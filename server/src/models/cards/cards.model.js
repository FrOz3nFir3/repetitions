import { getTextFromHTML } from "../../utils/dom.js";
import {
  normalizeWhitespace,
  normalizeCategory,
  escapeRegex,
} from "../../utils/textNormalization.js";
import Card from "./cards.mongo.js";
import { Types } from "mongoose";

export async function getCardsByCategoryPaginated(
  category,
  { skip, limit, search } = {}
) {
  const pipeline = [];

  if (search && search.trim()) {
    // text search doesn't allow prefix look into this ? or allow prefix ?
    pipeline.push({
      $match: { $text: { $search: search.trim() }, category: category },
    });
  } else {
    pipeline.push({ $match: { category: category } });
  }

  pipeline.push({
    $facet: {
      paginatedResults: [
        { $sort: { updatedAt: -1 } },
        { $skip: skip },
        { $limit: limit },
        {
          $project: {
            "main-topic": 1,
            "sub-topic": 1,
            category: 1,
            createdAt: 1,
            updatedAt: 1,
            reviewLength: { $size: "$review" },
            quizzesLength: { $size: "$quizzes" },
          },
        },
      ],
      totalCount: [{ $count: "total" }],
    },
  });

  const aggregationResult = await Card.aggregate(pipeline);

  // Safely extract the results
  const cards = aggregationResult[0]?.paginatedResults || [];
  const total = aggregationResult[0]?.totalCount[0]?.total || 0;

  return { cards, total };
}

export async function countCardsByCategory(category, search) {
  let filter = { category: { $eq: category } };

  // Add search filter if provided
  if (search && search.trim()) {
    filter.$text = { $search: search.trim() };
  }

  return Card.countDocuments(filter);
}

export async function getAllCards() {
  return Card.distinct("category");
}

export async function getAllCategoriesWithPagination({ skip, limit, search }) {
  const pipeline = [];

  if (search && search.trim()) {
    // this performance an index scan with prefix search
    const searchRegex = new RegExp("^" + escapeRegex(search), "i");
    pipeline.push({
      $match: {
        category: searchRegex,
      },
    });
  }

  const paginatedPipeline = [
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
        lastUpdated: { $max: "$updatedAt" },
      },
    },
    { $sort: { lastUpdated: -1 } },
  ];

  // --- Conditionally add pagination stages ---
  if (typeof skip === "number") {
    paginatedPipeline.push({ $skip: skip });
  }
  if (typeof limit === "number") {
    paginatedPipeline.push({ $limit: limit });
  }

  // Project a cleaner final shape for the client
  paginatedPipeline.push({
    $project: {
      _id: 0,
      category: "$_id",
      cardCount: "$count",
      lastUpdated: "$lastUpdated",
    },
  });

  pipeline.push({
    $facet: {
      paginatedResults: paginatedPipeline,
      totalCount: [
        // To count unique categories, we must group before counting
        { $group: { _id: "$category" } },
        { $count: "total" },
      ],
    },
  });

  const aggregationResult = await Card.aggregate(pipeline);

  const categories = aggregationResult[0]?.paginatedResults || [];
  const total = aggregationResult[0]?.totalCount[0]?.total || 0;

  return { categories, total };
}

export async function countAllCategories(search) {
  const pipeline = [];

  if (search && search.trim()) {
    // this performance an index scan with prefix search
    const searchRegex = new RegExp("^" + escapeRegex(search), "i");
    pipeline.push({
      $match: {
        category: searchRegex,
      },
    });
  }

  // projection
  pipeline.push({
    $project: {
      category: 1,
    },
  });

  pipeline.push({
    $group: {
      _id: "$category",
    },
  });

  const result = await Card.aggregate(pipeline);
  return result.length;
}

export async function findExistingCard(mainTopic, subTopic, category) {
  const normalizedCategory = normalizeCategory(category);

  // Normalize all fields for comparison
  const normalizedMainTopic = normalizeWhitespace(mainTopic);
  const normalizedSubTopic = normalizeWhitespace(subTopic);

  return Card.findOne(
    {
      category: normalizedCategory,
      "main-topic": normalizedMainTopic,
      "sub-topic": normalizedSubTopic,
    },
    {
      _id: 1,
    }
  );
}

export async function createNewCard(card, userId) {
  // Normalize fields before saving
  const normalizedCard = {
    ...card,
    "main-topic": normalizeWhitespace(card["main-topic"]),
    "sub-topic": normalizeWhitespace(card["sub-topic"]),
    category: normalizeCategory(card.category),
  };

  const newCard = new Card({
    ...normalizedCard,
    author: userId,
    logs: [{ eventType: "created", user: userId, summary: "Card created" }],
  });
  return newCard.save();
}

export async function getCardById(id, view = "overview") {
  if (!Types.ObjectId.isValid(id)) return null;

  // Optimized paths for simple views that don't need population
  if (view === "review") {
    return Card.findById(id, {
      review: 1,
      quizzesLength: {
        $size: "$quizzes",
      },
      category: 1,
    }).lean();
  }
  if (view === "quiz") {
    return Card.findById(id, {
      quizzes: 1,
      reviewLength: {
        $size: "$review",
      },
      category: 1,
      "main-topic": 1,
      "sub-topic": 1,
    }).lean();
  }

  const cardId = new Types.ObjectId(`${id}`);

  const pipeline = [
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
        quizzes: 1,
        description: 1,
        createdAt: 1,
        updatedAt: 1,
        author: { name: "$author.name", username: "$author.username" },
        lastUpdatedBy: {
          name: "$lastUpdatedBy.name",
          username: "$lastUpdatedBy.username",
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
        quizzes: 1,
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
        quizzes: { $first: "$quizzes" },
        description: { $first: "$description" },
        author: { $first: "$author" },
        lastUpdatedBy: { $first: "$lastUpdatedBy" },
        createdAt: { $first: "$createdAt" },
        updatedAt: { $first: "$updatedAt" },
        logs: { $push: "$logs" },
      },
    },
  ];

  const baseProjection = {
    "main-topic": 1,
    "sub-topic": 1,
    category: 1,
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
            username: "$$log.user.username",
          },
        },
      },
    },
  };

  let finalProjection = { ...baseProjection };

  switch (view) {
    case "overview":
      finalProjection.reviewLength = { $size: "$review" };
      finalProjection.quizzesLength = { $size: "$quizzes" };
      break;
    case "edit_flashcards":
      finalProjection.review = 1;
      finalProjection.quizzesLength = { $size: "$quizzes" };
      break;
    case "edit_quizzes":
      finalProjection.quizzes = 1;
      finalProjection.review = {
        $map: {
          input: "$review",
          as: "r",
          in: { _id: "$$r._id", question: "$$r.question" },
        },
      };
      break;
    default: // Fallback for any unknown view
      finalProjection.reviewLength = { $size: "$review" };
      finalProjection.quizzesLength = { $size: "$quizzes" };
      break;
  }

  pipeline.push({ $project: finalProjection });

  const result = await Card.aggregate(pipeline);

  if (!result || result.length === 0) return null;

  const card = result[0];
  if (card.logs && card.logs.length === 1 && !card.logs[0]._id) {
    card.logs = [];
  }

  // optimizing the payload upfront
  if (view === "edit_quizzes") {
    card.review = card.review.map((item) => {
      return {
        ...item,
        question: getTextFromHTML(item.question),
      };
    });
  }

  return card;
}

export async function updateCard(details) {
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
    reverted,
    ...otherDetails
  } = details;

  // can optimize the projection based on conditions if alot of queries are been made
  const card = await Card.findOne({ _id: { $eq: _id } }).lean();
  if (!card) return null;

  let updateQuery = {};
  const changes = [];
  let summary = "";

  // Case 1: Add a new quiz (distinguished by the absence of quizId)
  if (quizQuestion && quizAnswer && !quizId) {
    const newQuiz = { quizQuestion, quizAnswer, options: [] };
    if (cardId) {
      newQuiz.flashcardId = cardId;
    }
    updateQuery.$push = { quizzes: newQuiz };

    if (cardId) {
      const flashcard = card.review.find((r) => r._id.toString() === cardId);
      summary = `Added new Quiz to Flashcard: "${getTextFromHTML(
        flashcard.question
      ).slice(0, 250)}"`;
    } else {
      summary = `Added new Quiz: "${getTextFromHTML(quizQuestion).slice(
        0,
        250
      )}"`;
    }
    changes.push({
      field: "New Quiz Question",
      oldValue: "",
      newValue: quizQuestion,
      cardId,
    });
    changes.push({
      field: "New Quiz Answer",
      oldValue: "",
      newValue: quizAnswer,
      cardId,
    });
  }
  // Case 2: Add a new flashcard (distinguished by question and answer, but not for a quiz)
  else if (otherDetails.question && otherDetails.answer && !cardId) {
    const newFlashcard = {
      question: otherDetails.question,
      answer: otherDetails.answer,
    };
    updateQuery.$push = { review: newFlashcard };
    summary = `Added new Flashcard: ${getTextFromHTML(
      otherDetails.question
    ).slice(0, 250)}`;
    changes.push({
      field: "New Flashcard Question",
      oldValue: "",
      newValue: otherDetails.question,
    });
    changes.push({
      field: "New Flashcard Answer",
      oldValue: "",
      newValue: otherDetails.answer,
    });
  }
  // Case 3: Operations on existing quizzes (distinguished by quizId)
  else if (quizId) {
    const quizIndex = card.quizzes.findIndex(
      (q) => q._id.toString() === quizId
    );
    if (quizIndex === -1) return card;

    const quizPath = `quizzes.${quizIndex}`;
    const oldQuiz = card.quizzes[quizIndex];

    if (deleteQuiz) {
      updateQuery.$pull = { quizzes: { _id: quizId } };
      summary = `Deleted quiz: "${getTextFromHTML(oldQuiz.quizQuestion).slice(
        0,
        250
      )}"`;
      changes.push({
        field: `Deleted Quiz Question`,
        oldValue: oldQuiz.quizQuestion,
        newValue: "",
        quizId,
      });
      changes.push({
        field: `Deleted Quiz Answer`,
        oldValue: oldQuiz.quizAnswer,
        newValue: "",
        quizId,
      });
    } else {
      const changedFields = [];
      if (cardId !== undefined && oldQuiz.flashcardId?.toString() !== cardId) {
        const newFlashcardId = cardId ? new Types.ObjectId(`${cardId}`) : null;
        updateQuery.$set = {
          ...updateQuery.$set,
          [`${quizPath}.flashcardId`]: newFlashcardId,
        };

        const oldFlashcard = oldQuiz.flashcardId
          ? card.review.find(
              (r) => r._id.toString() === oldQuiz.flashcardId.toString()
            )
          : null;
        const oldFlashcardText = oldFlashcard
          ? `"${getTextFromHTML(oldFlashcard.question).slice(0, 40)}..."`
          : "";

        const newFlashcard = cardId
          ? card.review.find((r) => r._id.toString() === cardId)
          : null;
        const newFlashcardText = newFlashcard
          ? `"${getTextFromHTML(newFlashcard.question).slice(0, 40)}..."`
          : "";

        changes.push({
          field: `Quiz Flashcard Association`,
          oldValue: oldFlashcardText,
          newValue: newFlashcardText,
          quizId,
          cardId: oldQuiz.flashcardId?.toString() || null,
        });
        changedFields.push("flashcard association");
      }
      const updateFields = {};
      if (quizQuestion !== undefined && oldQuiz.quizQuestion !== quizQuestion) {
        updateFields[`${quizPath}.quizQuestion`] = quizQuestion;
        changes.push({
          field: `Quiz Question`,
          oldValue: oldQuiz.quizQuestion || "",
          newValue: quizQuestion,
          quizId,
        });
        changedFields.push("question");
      }
      if (quizAnswer !== undefined && oldQuiz.quizAnswer !== quizAnswer) {
        updateFields[`${quizPath}.quizAnswer`] = quizAnswer;
        changes.push({
          field: `Quiz Answer`,
          oldValue: oldQuiz.quizAnswer || "",
          newValue: quizAnswer,
          quizId,
        });
        changedFields.push("answer");
      }
      if (Object.keys(updateFields).length > 0) {
        updateQuery.$set = {
          ...updateQuery.$set,
          ...updateFields,
        };
      }
      if (
        minimumOptions !== undefined &&
        oldQuiz.minimumOptions !== Number(minimumOptions)
      ) {
        const newMinOptions = Number(minimumOptions);
        updateQuery.$set = {
          ...updateQuery.$set,
          [`${quizPath}.minimumOptions`]: newMinOptions,
        };
        changes.push({
          field: `Quiz Minimum Options`,
          oldValue: (oldQuiz.minimumOptions || "").toString(),
          newValue: newMinOptions.toString(),
          quizId,
        });
        changedFields.push("minimum options");
      }
      if (newOptions !== undefined) {
        const oldOptions = [...oldQuiz.options];
        const newOptionsData = newOptions.map((opt, index) => ({
          _id: oldOptions[index] ? oldOptions[index]._id : new Types.ObjectId(),
          value: opt,
        }));

        updateQuery.$set = {
          ...updateQuery.$set,
          [`${quizPath}.options`]: newOptionsData,
        };

        const maxLen = Math.max(oldOptions.length, newOptions.length);
        for (let i = 0; i < maxLen; i++) {
          const oldOpt = oldOptions[i];
          const newOptValue = newOptions[i];

          if (
            (oldOpt && !newOptValue) ||
            (oldOpt && newOptValue && oldOpt.value !== newOptValue)
          ) {
            const isDeletion = !newOptValue;
            changes.push({
              field: isDeletion
                ? `Deleted Quiz Option ${i + 1}`
                : `Quiz Option ${i + 1}`,
              oldValue: oldOpt.value,
              newValue: isDeletion ? "" : newOptValue,
              quizId,
              optionId: oldOpt._id.toString(),
            });
          } else if (!oldOpt && newOptValue) {
            changes.push({
              field: `New Quiz Option`,
              oldValue: "",
              newValue: newOptValue,
              quizId,
            });
          }
        }
        changedFields.push("options");
      }
      if (option !== undefined) {
        if (optionId) {
          const optionIndex = oldQuiz.options.findIndex(
            (o) => o._id.toString() === optionId
          );
          if (
            optionIndex > -1 &&
            oldQuiz.options[optionIndex].value !== option
          ) {
            updateQuery.$set = {
              ...updateQuery.$set,
              [`${quizPath}.options.${optionIndex}.value`]: option,
            };
            changes.push({
              field: `Quiz Option ${optionIndex + 1}`,
              oldValue: oldQuiz.options[optionIndex].value || "",
              newValue: option,
              quizId,
              optionId,
            });
            changedFields.push("options");
          }
        } else {
          updateQuery.$push = {
            ...updateQuery.$push,
            [`${quizPath}.options`]: { value: option },
          };
          changes.push({
            field: `New Quiz Option`,
            oldValue: "",
            newValue: option,
            quizId,
          });
          changedFields.push("options");
        }
      }
      if (deleteOption) {
        const deletedOptionIndex = oldQuiz.options.findIndex(
          (o) => o._id.toString() === optionId
        );
        if (deletedOptionIndex > -1) {
          const deletedOption = oldQuiz.options[deletedOptionIndex];
          updateQuery.$pull = {
            ...updateQuery.$pull,
            [`${quizPath}.options`]: { _id: optionId },
          };
          changes.push({
            field: `Deleted Quiz Option ${deletedOptionIndex + 1}`,
            oldValue: deletedOption.value || "",
            newValue: "",
            quizId,
            optionId,
          });
          changedFields.push("options");
        }
      }
      if (changedFields.length > 0) {
        const newQuizQuestion =
          quizQuestion !== undefined ? quizQuestion : oldQuiz.quizQuestion;
        summary = `Updated ${changedFields.join(
          ", "
        )} in quiz: "${getTextFromHTML(newQuizQuestion).slice(0, 250)}"`;
      }
    }
  }
  // Sub-case 3.2: Update flashcard question/answer or delete flashcard
  else if (cardId) {
    const reviewIndex = card.review.findIndex(
      (r) => r._id.toString() === cardId
    );
    if (reviewIndex === -1) return card;

    const reviewPath = `review.${reviewIndex}`;
    const oldReview = card.review[reviewIndex];

    if (deleteCard) {
      updateQuery.$pull = {
        review: { _id: cardId },
        quizzes: { flashcardId: cardId },
      };
      summary = `Deleted flashcard: "${getTextFromHTML(
        oldReview.question
      ).slice(0, 250)}"`;
      changes.push({
        field: `Deleted Flashcard Question`,
        oldValue: oldReview.question,
        newValue: "",
        cardId,
      });
      changes.push({
        field: `Deleted Flashcard Answer`,
        oldValue: oldReview.answer,
        newValue: "",
        cardId,
      });
    } else if (
      otherDetails.question !== undefined &&
      oldReview.question !== otherDetails.question
    ) {
      updateQuery.$set = {
        ...updateQuery.$set,
        [`${reviewPath}.question`]: otherDetails.question,
      };
      changes.push({
        field: "Flashcard Question",
        oldValue: oldReview.question || "",
        newValue: otherDetails.question,
        cardId,
      });
      summary = `Updated question in Flashcard: "${getTextFromHTML(
        otherDetails.question
      ).slice(0, 250)}"`;
    } else if (
      otherDetails.answer !== undefined &&
      oldReview.answer !== otherDetails.answer
    ) {
      updateQuery.$set = {
        ...updateQuery.$set,
        [`${reviewPath}.answer`]: otherDetails.answer,
      };
      changes.push({
        field: "Flashcard Answer",
        oldValue: oldReview.answer || "",
        newValue: otherDetails.answer,
        cardId,
      });
      summary = `Updated answer in Flashcard: "${getTextFromHTML(
        oldReview.question
      ).slice(0, 250)}"`;
    }
  }
  // Case 4: Update main card fields
  else {
    const {
      description,
      category,
      "main-topic": mainTopic,
      "sub-topic": subTopic,
    } = otherDetails;
    const changedFields = [];

    const normalizedCategory = category && normalizeCategory(category);
    if (category !== undefined && card.category !== normalizedCategory) {
      // Normalize category when updating
      updateQuery.$set = { ...updateQuery.$set, category: normalizedCategory };
      changes.push({
        field: "Category",
        oldValue: card.category || "",
        newValue: normalizedCategory,
      });
      changedFields.push("Category");
    }

    const normalizedMainTopic = mainTopic && normalizeWhitespace(mainTopic);
    if (mainTopic !== undefined && card["main-topic"] !== normalizedMainTopic) {
      updateQuery.$set = {
        ...updateQuery.$set,
        "main-topic": normalizedMainTopic,
      };
      changes.push({
        field: "Main Topic",
        oldValue: card["main-topic"] || "",
        newValue: normalizedMainTopic,
      });
      changedFields.push("Main Topic");
    }

    const normalizedSubTopic = subTopic && normalizeWhitespace(subTopic);
    if (subTopic !== undefined && card["sub-topic"] !== normalizedSubTopic) {
      updateQuery.$set = {
        ...updateQuery.$set,
        "sub-topic": normalizedSubTopic,
      };
      changes.push({
        field: "Sub Topic",
        oldValue: card["sub-topic"] || "",
        newValue: normalizedSubTopic,
      });
      changedFields.push("Sub Topic");
    }
    if (description !== undefined && card.description !== description) {
      updateQuery.$set = { ...updateQuery.$set, description };
      changes.push({
        field: "Description",
        oldValue: card.description || "",
        newValue: description,
      });
      changedFields.push("Description");
    }
    if (changedFields.length > 0) {
      summary = `Updated ${changedFields.join(", ")}`;
    }
  }

  if (changes.length > 0) {
    let finalSummary = summary || "Card updated";
    if (reverted) {
      finalSummary = `Reverted: ${finalSummary
        .charAt(0)
        .toLowerCase()}${finalSummary.slice(1)}`;
    }
    const logEntry = {
      eventType: reverted ? "reverted" : "updated",
      user: userId,
      summary: finalSummary,
      changes,
    };
    updateQuery.$push = { ...updateQuery.$push, logs: logEntry };
    updateQuery.$set = { ...updateQuery.$set, lastUpdatedBy: userId };
    return Card.findOneAndUpdate({ _id: { $eq: _id } }, updateQuery, {
      new: true,
    });
  }

  return card;
}

export async function getCardLogs(cardId, page = 1, limit = 10, search = "") {
  if (!Types.ObjectId.isValid(cardId)) return { logs: [], hasMore: false };
  const id = new Types.ObjectId(`${cardId}`);
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
    { $unwind: { path: "$logs", preserveNullAndEmptyArrays: true } },
    ...(search && search.trim()
      ? [
          {
            $match: {
              "logs.summary": {
                $regex: normalizeWhitespace(search),
                $options: "i",
              },
            },
          },
        ]
      : []),
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
    { $unwind: { path: "$logs.user", preserveNullAndEmptyArrays: true } },
    { $sort: { "logs.timestamp": -1 } },
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
                username: "$$log.user.username",
              },
            },
          },
        },
      },
    },
  ]);

  if (!result || result.length === 0) return { logs: [], hasMore: false };

  const data = result[0];

  return data;
}

export async function getQuizAnswer(cardId, quizId) {
  const card = await Card.findOne({ _id: { $eq: cardId } }, "quizzes").lean();
  if (!card) return null;

  const quiz = card.quizzes.find((q) => q._id.toString() === quizId);
  return quiz ? quiz.quizAnswer : null;
}

export async function getAuthorOfCard(cardId) {
  const card = await Card.findOne({ _id: { $eq: cardId } }, "author").lean();
  return card ? card.author : null;
}

export async function getQuizById(cardId, quizId) {
  const card = await Card.findOne({ _id: { $eq: cardId } }, "quizzes").lean();
  if (!card) return null;

  return card.quizzes.find((q) => q._id.toString() === quizId);
}

export async function getCardsByAuthorPaginated(authorId, { skip, limit }) {
  if (!Types.ObjectId.isValid(authorId)) {
    return [];
  }
  if (!Types.ObjectId.isValid(authorId)) {
    return { cards: [], total: 0 };
  }

  const authorIdObject = new Types.ObjectId(`${authorId}`);
  const aggregationResult = await Card.aggregate([
    { $match: { author: authorIdObject } },
    {
      $facet: {
        paginatedResults: [
          { $sort: { updatedAt: -1 } },
          { $skip: skip },
          { $limit: limit },
          {
            $project: {
              "main-topic": 1,
              "sub-topic": 1,
              category: 1,
              createdAt: 1,
              updatedAt: 1,
              reviewLength: { $size: "$review" },
              quizzesLength: { $size: "$quizzes" },
            },
          },
        ],
        totalCount: [{ $count: "total" }],
      },
    },
  ]);

  const cards = aggregationResult[0].paginatedResults;
  const total = aggregationResult[0].totalCount[0]?.total || 0;

  return { cards, total };
}

export async function countCardsByAuthor(authorId) {
  if (!Types.ObjectId.isValid(authorId)) {
    return 0;
  }
  return Card.countDocuments({ author: { $eq: authorId } });
}
