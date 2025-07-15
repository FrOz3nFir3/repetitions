const Card = require("./cards.mongo");
const createDOMPurify = require("dompurify");
const { JSDOM } = require("jsdom");
const mongoose = require("mongoose");

const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);

function getTextFromHTML(html) {
  if (!html) return "";
  const sanitizedHtml = DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
  });
  let text = sanitizedHtml
    .replace(/<\/(div|p|h[1-6])>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n");
  text = text
    .replace(/<[^>]+>/g, "")
    .replace(/ +/g, " ")
    .replace(/\n{3,}/g, "\n\n");
  return text.trim();
}

async function cardsByCategory(category) {
  return Card.find({ category: { $eq: category } });
}

async function getAllCards() {
  return Card.distinct("category");
}

async function createNewCard(card, userId) {
  const newCard = new Card({
    ...card,
    author: userId,
    logs: [{ eventType: "created", user: userId, summary: "Card created" }],
  });
  return newCard.save();
}

async function getCardById(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  const cardId = new mongoose.Types.ObjectId(id);

  const result = await Card.aggregate([
    { $match: { _id: cardId } },
    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "author",
      },
    },
    { $unwind: { path: "$author", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "users",
        localField: "lastUpdatedBy",
        foreignField: "_id",
        as: "lastUpdatedBy",
      },
    },
    { $unwind: { path: "$lastUpdatedBy", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        "main-topic": 1,
        "sub-topic": 1,
        category: 1,
        review: 1,
        description: 1,
        createdAt: 1,
        updatedAt: 1,
        author: { name: "$author.name", email: "$author.email" },
        lastUpdatedBy: {
          name: "$lastUpdatedBy.name",
          email: "$lastUpdatedBy.email",
        },
        logs: {
          $sortArray: { input: "$logs", sortBy: { timestamp: -1 } },
        },
      },
    },
    {
      $project: {
        "main-topic": 1,
        "sub-topic": 1,
        category: 1,
        review: 1,
        description: 1,
        createdAt: 1,
        updatedAt: 1,
        author: 1,
        lastUpdatedBy: 1,
        logs: { $slice: ["$logs", 6] },
      },
    },
    { $unwind: { path: "$logs", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "users",
        localField: "logs.user",
        foreignField: "_id",
        as: "logs.user",
      },
    },
    { $unwind: { path: "$logs.user", preserveNullAndEmptyArrays: true } },
    {
      $group: {
        _id: "$_id",
        "main-topic": { $first: "$main-topic" },
        "sub-topic": { $first: "$sub-topic" },
        category: { $first: "$category" },
        review: { $first: "$review" },
        description: { $first: "$description" },
        author: { $first: "$author" },
        lastUpdatedBy: { $first: "$lastUpdatedBy" },
        createdAt: { $first: "$createdAt" },
        updatedAt: { $first: "$updatedAt" },
        logs: { $push: "$logs" },
      },
    },
    {
      $project: {
        "main-topic": 1,
        "sub-topic": 1,
        category: 1,
        review: 1,
        description: 1,
        createdAt: 1,
        updatedAt: 1,
        author: 1,
        lastUpdatedBy: 1,
        logs: {
          $map: {
            input: "$logs",
            as: "log",
            in: {
              _id: "$$log._id",
              eventType: "$$log.eventType",
              timestamp: "$$log.timestamp",
              summary: "$$log.summary",
              changes: "$$log.changes",
              user: {
                name: "$$log.user.name",
                email: "$$log.user.email",
              },
            },
          },
        },
      },
    },
  ]);

  if (!result || result.length === 0) return null;

  const card = result[0];
  if (card.logs && card.logs.length === 1 && !card.logs[0]._id) {
    card.logs = [];
  }

  if (card.logs) {
    card.logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  return card;
}

async function getCardsByIds(ids) {
  if (!ids || ids.length === 0 || !Array.isArray(ids)) return [];
  return Card.find(
    { _id: { $in: ids } },
    {
      "main-topic": 1,
      "sub-topic": 1,
      category: 1,
      reviewLength: { $size: "$review" },
    }
  );
}

async function updateCard(details) {
  const {
    _id,
    cardId,
    deleteCard,
    userId,
    quizId,
    quizQuestion,
    quizAnswer,
    minimumOptions,
    options: newOptions,
    option,
    optionId,
    deleteQuiz,
    deleteOption,
    ...otherDetails
  } = details;

  const card = await Card.findById(_id);
  if (!card) return null;

  let updateQuery = {};
  const changes = [];
  let summary = "";

  const isUpdatingSpecificCard = cardId != null;
  const isAddingNewCard =
    otherDetails.question && otherDetails.answer && !isUpdatingSpecificCard;
  const isUpdatingOtherFields = Object.keys(otherDetails).length > 0;

  if (isUpdatingSpecificCard) {
    const reviewIndex = card.review.findIndex(
      (r) => r._id.toString() === cardId
    );
    if (reviewIndex === -1) return card;

    const reviewPath = `review.${reviewIndex}`;
    const oldReview = card.review[reviewIndex];

    if (quizId) {
      const quizIndex = oldReview.quizzes.findIndex(
        (q) => q._id.toString() === quizId
      );
      if (quizIndex === -1) return card;

      const quizPath = `${reviewPath}.quizzes.${quizIndex}`;
      const oldQuiz = oldReview.quizzes[quizIndex];

      if (deleteQuiz) {
        updateQuery.$pull = { [`${reviewPath}.quizzes`]: { _id: quizId } };
        summary = `Deleted quiz: "${getTextFromHTML(oldQuiz.quizQuestion)}"`;
        changes.push({
          field: `Quiz`,
          oldValue: oldQuiz.quizQuestion,
          newValue: "Deleted",
        });
      } else {
        const changedFields = [];
        if (quizQuestion !== undefined) {
          updateQuery.$set = {
            ...updateQuery.$set,
            [`${quizPath}.quizQuestion`]: quizQuestion,
          };
          changes.push({
            field: `Quiz Question`,
            oldValue: getTextFromHTML(oldQuiz.quizQuestion),
            newValue: getTextFromHTML(quizQuestion),
          });
          changedFields.push("question");
        }
        if (quizAnswer !== undefined) {
          updateQuery.$set = {
            ...updateQuery.$set,
            [`${quizPath}.quizAnswer`]: quizAnswer,
          };
          changes.push({
            field: `Quiz Answer`,
            oldValue: getTextFromHTML(oldQuiz.quizAnswer),
            newValue: getTextFromHTML(quizAnswer),
          });
          changedFields.push("answer");
        }
        if (minimumOptions !== undefined) {
          updateQuery.$set = {
            ...updateQuery.$set,
            [`${quizPath}.minimumOptions`]: Number(minimumOptions),
          };
          changes.push({
            field: `Quiz Minimum Options`,
            oldValue: oldQuiz.minimumOptions,
            newValue: Number(minimumOptions),
          });
          changedFields.push("minimum options");
        }
        if (newOptions !== undefined) {
          const newOptionsWithId = newOptions.map((opt) => ({ value: opt }));
          updateQuery.$set = {
            ...updateQuery.$set,
            [`${quizPath}.options`]: newOptionsWithId,
          };
          changes.push({
            field: `Quiz Options`,
            oldValue: oldQuiz.options.map((o) => getTextFromHTML(o.value)),
            newValue: newOptions.map((o) => getTextFromHTML(o)),
          });
          changedFields.push("options");
        }
        if (option !== undefined) {
          if (optionId) {
            const optionIndex = oldQuiz.options.findIndex(
              (o) => o._id.toString() === optionId
            );
            if (optionIndex > -1) {
              updateQuery.$set = {
                ...updateQuery.$set,
                [`${quizPath}.options.${optionIndex}.value`]: option,
              };
              changes.push({
                field: `Quiz Option`,
                oldValue: getTextFromHTML(oldQuiz.options[optionIndex].value),
                newValue: getTextFromHTML(option),
              });
            }
          } else {
            updateQuery.$push = {
              ...updateQuery.$push,
              [`${quizPath}.options`]: { value: option },
            };
            changes.push({
              field: `New Quiz Option`,
              oldValue: null,
              newValue: getTextFromHTML(option),
            });
          }
          changedFields.push("options");
        }
        if (deleteOption) {
          const deletedOption = oldQuiz.options.find(
            (o) => o._id.toString() === optionId
          );
          if (deletedOption) {
            updateQuery.$pull = {
              ...updateQuery.$pull,
              [`${quizPath}.options`]: { _id: optionId },
            };
            changes.push({
              field: `Quiz Option`,
              oldValue: getTextFromHTML(deletedOption.value),
              newValue: "Deleted",
            });
            changedFields.push("options");
          }
        }
        if (changedFields.length > 0) {
          summary = `Updated ${changedFields.join(
            ", "
          )} in quiz: "${getTextFromHTML(oldQuiz.quizQuestion)}"`;
        }
      }
    } else if (quizQuestion && quizAnswer) {
      const newQuiz = { quizQuestion, quizAnswer, options: [] };
      updateQuery.$push = {
        ...updateQuery.$push,
        [`${reviewPath}.quizzes`]: newQuiz,
      };
      summary = `Added new quiz to flashcard: "${getTextFromHTML(
        oldReview.question
      )}"`;
      changes.push({
        field: "New Quiz",
        oldValue: null,
        newValue: {
          question: getTextFromHTML(quizQuestion),
          answer: getTextFromHTML(quizAnswer),
        },
      });
    } else if (otherDetails.question !== undefined) {
      updateQuery.$set = {
        ...updateQuery.$set,
        [`${reviewPath}.question`]: otherDetails.question,
      };
      changes.push({
        field: "Flashcard Question",
        oldValue: getTextFromHTML(oldReview.question),
        newValue: getTextFromHTML(otherDetails.question),
      });
      summary = `Updated question in flashcard: "${getTextFromHTML(
        oldReview.question
      )}"`;
    } else if (otherDetails.answer !== undefined) {
      updateQuery.$set = {
        ...updateQuery.$set,
        [`${reviewPath}.answer`]: otherDetails.answer,
      };
      changes.push({
        field: "Flashcard Answer",
        oldValue: getTextFromHTML(oldReview.answer),
        newValue: getTextFromHTML(otherDetails.answer),
      });
      summary = `Updated answer in flashcard: "${getTextFromHTML(
        oldReview.question
      )}"`;
    }

    if (deleteCard) {
      updateQuery.$pull = { review: { _id: cardId } };
      summary = `Deleted flashcard: "${getTextFromHTML(oldReview.question)}"`;
      changes.push({
        field: `Flashcard`,
        oldValue: {
          question: getTextFromHTML(oldReview.question),
          answer: getTextFromHTML(oldReview.answer),
        },
        newValue: "Deleted",
      });
    }
  } else if (isAddingNewCard) {
    const newFlashcard = {
      question: otherDetails.question,
      answer: otherDetails.answer,
    };
    updateQuery.$push = { review: newFlashcard };
    summary = `Added new flashcard.`;
    changes.push({
      field: "New Flashcard",
      oldValue: null,
      newValue: {
        question: getTextFromHTML(otherDetails.question),
        answer: getTextFromHTML(otherDetails.answer),
      },
    });
  } else if (isUpdatingOtherFields) {
    const {
      description,
      category,
      "main-topic": mainTopic,
      "sub-topic": subTopic,
    } = otherDetails;
    const changedFields = [];

    if (category !== undefined && card.category !== category) {
      updateQuery.$set = { ...updateQuery.$set, category };
      changes.push({
        field: "Category",
        oldValue: card.category,
        newValue: category,
      });
      changedFields.push("Category");
    }
    if (mainTopic !== undefined && card["main-topic"] !== mainTopic) {
      updateQuery.$set = { ...updateQuery.$set, "main-topic": mainTopic };
      changes.push({
        field: "Main Topic",
        oldValue: card["main-topic"],
        newValue: mainTopic,
      });
      changedFields.push("Main Topic");
    }
    if (subTopic !== undefined && card["sub-topic"] !== subTopic) {
      updateQuery.$set = { ...updateQuery.$set, "sub-topic": subTopic };
      changes.push({
        field: "Sub Topic",
        oldValue: card["sub-topic"],
        newValue: subTopic,
      });
      changedFields.push("Sub Topic");
    }
    if (description !== undefined && card.description !== description) {
      updateQuery.$set = { ...updateQuery.$set, description };
      changes.push({
        field: "Description",
        oldValue: card.description,
        newValue: description,
      });
      changedFields.push("Description");
    }
    if (changedFields.length > 0) {
      summary = `Updated ${changedFields.join(", ")}.`;
    }
  }

  if (changes.length > 0) {
    const logEntry = {
      eventType: "updated",
      user: userId,
      summary: summary || "Card updated.",
      changes,
    };
    updateQuery.$push = { ...updateQuery.$push, logs: logEntry };
    updateQuery.$set = { ...updateQuery.$set, lastUpdatedBy: userId };
    return Card.findByIdAndUpdate(_id, updateQuery, { new: true });
  }

  return card;
}

async function getCardLogs(cardId, page = 1, limit = 10) {
  if (!mongoose.Types.ObjectId.isValid(cardId))
    return { logs: [], hasMore: false };
  const id = new mongoose.Types.ObjectId(cardId);
  const skip = (page - 1) * limit;

  const result = await Card.aggregate([
    { $match: { _id: id } },
    {
      $project: {
        totalLogs: { $size: "$logs" },
        logs: {
          $sortArray: {
            input: "$logs",
            sortBy: { timestamp: -1 },
          },
        },
      },
    },
    { $unwind: "$logs" },
    { $skip: skip },
    { $limit: limit },
    {
      $lookup: {
        from: "users",
        localField: "logs.user",
        foreignField: "_id",
        as: "logs.user",
      },
    },
    { $unwind: "$logs.user" },
    {
      $group: {
        _id: "$_id",
        totalLogs: { $first: "$totalLogs" },
        logs: { $push: "$logs" },
      },
    },
    {
      $project: {
        _id: 0,
        hasMore: { $gt: ["$totalLogs", skip + limit] },
        logs: {
          $map: {
            input: "$logs",
            as: "log",
            in: {
              _id: "$$log._id",
              eventType: "$$log.eventType",
              timestamp: "$$log.timestamp",
              summary: "$$log.summary",
              changes: "$$log.changes",
              user: {
                name: "$$log.user.name",
                email: "$$log.user.email",
              },
            },
          },
        },
      },
    },
  ]);

  if (!result || result.length === 0) return { logs: [], hasMore: false };

  const data = result[0];
  if (data.logs) {
    data.logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  return data;
}

module.exports = {
  cardsByCategory,
  createNewCard,
  getAllCards,
  getCardById,
  getCardsByIds,
  updateCard,
  getTextFromHTML,
  getCardLogs,
};
