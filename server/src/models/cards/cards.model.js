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
    // this performs faster search due to index
    const searchRegex = new RegExp("^" + escapeRegex(search), "i");
    pipeline.push({
      $match: {
        category: category,
        $or: [{ "main-topic": searchRegex }, { "sub-topic": searchRegex }],
      },
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
    // this performs faster search due to index
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
      reviewQueueLength: {
        $size: {
          $filter: {
            input: "$reviewQueue",
            cond: {
              $or: [
                { $eq: ["$$this.expiresAt", null] },
                { $gt: ["$$this.expiresAt", new Date()] },
              ],
            },
          },
        },
      },
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
      reviewQueueLength: {
        $size: {
          $filter: {
            input: "$reviewQueue",
            cond: {
              $or: [
                { $eq: ["$$this.expiresAt", null] },
                { $gt: ["$$this.expiresAt", new Date()] },
              ],
            },
          },
        },
      },
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
      $addFields: {
        reviewQueue: {
          $filter: {
            input: "$reviewQueue",
            cond: {
              $or: [
                { $eq: ["$$this.expiresAt", null] },
                { $gt: ["$$this.expiresAt", new Date()] },
              ],
            },
          },
        },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "reviewQueue.submittedBy",
        foreignField: "_id",
        as: "reviewQueueUsers",
      },
    },
    {
      $addFields: {
        reviewQueue: {
          $map: {
            input: "$reviewQueue",
            as: "item",
            in: {
              $mergeObjects: [
                "$$item",
                {
                  submittedBy: {
                    $let: {
                      vars: {
                        user: {
                          $arrayElemAt: [
                            {
                              $filter: {
                                input: "$reviewQueueUsers",
                                cond: {
                                  $eq: ["$$this._id", "$$item.submittedBy"],
                                },
                              },
                            },
                            0,
                          ],
                        },
                      },
                      in: {
                        _id: "$$user._id",
                        name: "$$user.name",
                        username: "$$user.username",
                      },
                    },
                  },
                },
              ],
            },
          },
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
        reviewers: 1,
        reviewQueue: 1,
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
        reviewers: 1,
        reviewQueue: 1,
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
        reviewers: { $first: "$reviewers" },
        reviewQueue: { $first: "$reviewQueue" },
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
    // reviewers removed - fetched separately when needed
    reviewQueue: {
      $filter: {
        input: "$reviewQueue",
        cond: {
          $or: [
            { $eq: ["$$this.expiresAt", null] },
            { $gt: ["$$this.expiresAt", new Date()] },
          ],
        },
      },
    },
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

  // Remove the baseProjection reviewQueue filter and add proper handling
  delete finalProjection.reviewQueue;

  // Add reviewQueueLength for all views
  finalProjection.reviewQueueLength = { $size: "$reviewQueue" };

  switch (view) {
    case "overview":
      finalProjection.reviewLength = { $size: "$review" };
      finalProjection.quizzesLength = { $size: "$quizzes" };
      break;
    case "edit_flashcards":
      finalProjection.review = 1;
      finalProjection.quizzesLength = { $size: "$quizzes" };
      // Add initial reviewQueue data (5 items) - already filtered in pipeline
      finalProjection.reviewQueue = { $slice: ["$reviewQueue", 5] };
      break;
    case "edit_quizzes":
      finalProjection.quizzes = 1;
      finalProjection.reviewLength = { $size: "$review" };
      // Add initial reviewQueue data (5 items) - already filtered in pipeline
      finalProjection.reviewQueue = { $slice: ["$reviewQueue", 5] };
      break;
    case "review-queue":
      // For review-queue view, include initial data plus counts
      finalProjection.reviewLength = { $size: "$review" };
      finalProjection.quizzesLength = { $size: "$quizzes" };
      // Add initial reviewQueue data (5 items) - already filtered in pipeline
      finalProjection.reviewQueue = { $slice: ["$reviewQueue", 5] };
      break;
    case "review_text":
      finalProjection = {};
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

  // Post-processing for specific views
  if (view === "review_text") {
    card.review = card.review.map((item) => {
      return {
        _id: item._id,
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
    reorderFlashcards,
    reorderQuizzes,
    isCollaborativeEdit, // Flag to indicate this is from review queue acceptance
    ...otherDetails
  } = details;

  // can optimize the projection based on conditions if alot of queries are been made
  const card = await Card.findOne({ _id: { $eq: _id } }).lean();
  if (!card) return null;

  let updateQuery = {};
  const changes = [];
  let summary = "";

  if (reorderFlashcards) {
    const validIds = reorderFlashcards.filter((id) =>
      card.review.some((r) => r._id.toString() === id)
    );

    if (validIds.length === card.review.length) {
      // Create a reordered array based on the provided order
      const reviewMap = new Map();

      // fill with review data
      for (let flashcardItem of card.review) {
        reviewMap.set(flashcardItem._id.toString(), flashcardItem);
      }

      const reorderedReview = validIds.map((id) => reviewMap.get(id));

      updateQuery.$set = { review: reorderedReview };
      summary = "Reordered Flashcards";

      const oldDisplayText = card.review
        .map((item, index) => {
          let plainText = getTextFromHTML(item.question);
          if (plainText.length > 100) {
            plainText = plainText.slice(0, 100) + "...";
          }
          return `#${index + 1} - ${plainText}`;
        })
        .join("\n");

      const newDisplayText = reorderedReview
        .map((item, index) => {
          let plainText = getTextFromHTML(item.question);
          if (plainText.length > 100) {
            plainText = plainText.slice(0, 100) + "...";
          }
          return `#${index + 1} - ${plainText}`;
        })
        .join("\n");

      changes.push({
        field: "Flashcard Order",
        oldValue: card.review.map((r) => r._id.toString()),
        newValue: validIds,
        oldDisplayText,
        newDisplayText,
      });
    }
  } else if (reorderQuizzes) {
    const validIds = reorderQuizzes.filter((id) =>
      card.quizzes.some((q) => q._id.toString() === id)
    );

    if (validIds.length === card.quizzes.length) {
      const quizMap = new Map();
      // fill the map with current data
      for (let quizItem of card.quizzes) {
        quizMap.set(quizItem._id.toString(), quizItem);
      }

      // Create a reordered array based on the provided order
      const reorderedQuizzes = validIds.map((id) => quizMap.get(id.toString()));

      updateQuery.$set = { quizzes: reorderedQuizzes };
      summary = "Reordered quizzes";

      const oldDisplayText = card.quizzes
        .map((item, index) => {
          let plainText = getTextFromHTML(item.quizQuestion);
          if (plainText.length > 100) {
            plainText = plainText.slice(0, 100) + "...";
          }
          return `#${index + 1} - ${plainText}`;
        })
        .join("\n");
      const newDisplayText = reorderedQuizzes
        .map((item, index) => {
          let plainText = getTextFromHTML(item.quizQuestion);
          if (plainText.length > 100) {
            plainText = plainText.slice(0, 100) + "...";
          }
          return `#${index + 1} - ${plainText}`;
        })
        .join("\n");

      changes.push({
        field: "Quiz Order",
        oldValue: card.quizzes.map((q) => q._id.toString()),
        newValue: validIds,
        oldDisplayText,
        newDisplayText,
      });
    }
  }

  // Case 1: Add a new quiz (distinguished by the absence of quizId)
  if (quizQuestion && quizAnswer && !quizId) {
    const newQuiz = {
      quizQuestion,
      quizAnswer,
      options: newOptions
        ? newOptions
            .filter((opt) => opt && opt.trim())
            .map((opt) => ({
              _id: new Types.ObjectId(),
              value: opt,
            }))
        : [],
      minimumOptions: minimumOptions || 2,
    };
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

    // Log minimum options if provided
    if (minimumOptions && minimumOptions !== 2) {
      changes.push({
        field: "New Quiz Minimum Options",
        oldValue: "",
        newValue: minimumOptions.toString(),
        cardId,
      });
    }

    // Log additional options if provided
    if (newOptions && newOptions.length > 0) {
      newOptions
        .filter((opt) => opt && opt.trim())
        .forEach((option, index) => {
          changes.push({
            field: `New Quiz Option ${index + 2}`,
            oldValue: "",
            newValue: option,
            cardId,
          });
        });
    }
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
    } else {
      // Handle flashcard updates (question and/or answer)
      const changedFields = [];
      let hasChanges = false;

      if (
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
        changedFields.push("question");
        hasChanges = true;
      }

      if (
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
        changedFields.push("answer");
        hasChanges = true;
      }

      if (hasChanges) {
        const questionText = otherDetails.question || oldReview.question;
        if (changedFields.length === 1) {
          summary = `Updated ${
            changedFields[0]
          } in Flashcard: "${getTextFromHTML(questionText).slice(0, 250)}"`;
        } else {
          summary = `Updated ${changedFields.join(
            " and "
          )} in Flashcard: "${getTextFromHTML(questionText).slice(0, 250)}"`;
        }
      }
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
    } else if (isCollaborativeEdit) {
      finalSummary = `Collaborative Edit: ${finalSummary
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
/**
 * Create a review queue item for non-author edits
 */
export async function createReviewQueueItem(cardId, changeDetails, userId) {
  if (!Types.ObjectId.isValid(cardId)) {
    throw new Error("Invalid card ID");
  }

  if (!Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  const {
    changeType,
    field,
    oldValue,
    newValue,
    oldDisplayText,
    newDisplayText,
    targetId,
    metadata,
  } = changeDetails;

  // Validate required fields
  if (!changeType || !field) {
    throw new Error("Change type and field are required");
  }

  if (!["edit", "addition", "deletion"].includes(changeType)) {
    throw new Error("Invalid change type");
  }

  const reviewQueueItem = {
    changeType,
    field,
    oldValue: oldValue !== undefined ? oldValue : null,
    newValue: newValue !== undefined ? newValue : null,
    oldDisplayText: oldDisplayText || "",
    newDisplayText: newDisplayText || "",
    targetId: targetId || null,
    submittedBy: new Types.ObjectId(userId),
    submittedAt: new Date(),
    expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days
    metadata: metadata || {},
  };

  try {
    return await Card.findByIdAndUpdate(
      cardId,
      { $push: { reviewQueue: reviewQueueItem } },
      { new: true }
    );
  } catch (error) {
    throw new Error(`Failed to create review queue item: ${error.message}`);
  }
}

/**
 * Generate display text for review queue items
 */
export function generateDisplayText(value, field) {
  if (!value && value !== 0) return "";

  // Handle different field types
  switch (field) {
    case "question":
    case "answer":
    case "description":
      // For HTML content, extract plain text and truncate
      if (typeof value === "string") {
        const plainText = value.includes("<") ? getTextFromHTML(value) : value;
        return plainText.length > 100
          ? plainText.slice(0, 100) + "..."
          : plainText;
      }
      break;

    case "option":
      // For quiz options, handle both string and object values
      if (typeof value === "object" && value.value) {
        return value.value.length > 50
          ? value.value.slice(0, 50) + "..."
          : value.value;
      }
      if (typeof value === "string") {
        return value.length > 50 ? value.slice(0, 50) + "..." : value;
      }
      break;

    default:
      // For arrays (like options lists)
      if (Array.isArray(value)) {
        const items = value.map((item) => {
          if (typeof item === "object" && item.value) return item.value;
          return String(item);
        });
        const joined = items.join(", ");
        return joined.length > 100 ? joined.slice(0, 100) + "..." : joined;
      }

      // For objects (like flashcard/quiz data)
      if (typeof value === "object" && value !== null) {
        if (value.question) {
          return generateDisplayText(value.question, "question");
        }
        if (value.quizQuestion) {
          return generateDisplayText(value.quizQuestion, "question");
        }
        // For other objects, try to create a meaningful representation
        const keys = Object.keys(value);
        if (keys.length > 0) {
          return `{${keys.join(", ")}}`;
        }
      }

      // For other values, convert to string and truncate if needed
      const stringValue = String(value);
      return stringValue.length > 100
        ? stringValue.slice(0, 100) + "..."
        : stringValue;
  }

  // Fallback for any unhandled cases
  const stringValue = String(value);
  return stringValue.length > 100
    ? stringValue.slice(0, 100) + "..."
    : stringValue;
}

/**
 * Process update request and determine if it should go to review queue
 * Users with review permission (authors or reviewers) can make direct updates
 * Non-reviewers have their changes go to the review queue
 */
export async function processUpdateRequest(
  cardId,
  updateDetails,
  userId,
  hasReviewPermission
) {
  if (hasReviewPermission) {
    // Users with review permission (authors or reviewers) can make direct updates
    return updateCard(updateDetails);
  }

  // Non-author edits go to review queue
  const card = await Card.findById(cardId).lean();
  if (!card) {
    throw new Error("Card not found");
  }

  const changes = [];
  const {
    question,
    answer,
    quizQuestion,
    quizAnswer,
    option,
    options: newOptions,
    minimumOptions,
    description,
    category,
    "main-topic": mainTopic,
    "sub-topic": subTopic,
    cardId: flashcardId,
    quizId,
    optionId,
    deleteCard,
    deleteQuiz,
    deleteOption,
    ...otherDetails
  } = updateDetails;

  // Handle different types of changes
  if (deleteCard && flashcardId) {
    const flashcard = card.review.find((r) => r._id.toString() === flashcardId);
    if (flashcard) {
      changes.push({
        changeType: "deletion",
        field: "Flashcard",
        oldValue: { question: flashcard.question, answer: flashcard.answer },
        newValue: null,
        oldDisplayText: generateDisplayText(flashcard.question, "question"),
        newDisplayText: "",
        targetId: flashcardId,
      });
    }
  } else if (deleteQuiz && quizId) {
    const quiz = card.quizzes.find((q) => q._id.toString() === quizId);
    if (quiz) {
      changes.push({
        changeType: "deletion",
        field: "Quiz",
        oldValue: {
          quizQuestion: quiz.quizQuestion,
          quizAnswer: quiz.quizAnswer,
        },
        newValue: null,
        oldDisplayText: generateDisplayText(quiz.quizQuestion, "question"),
        newDisplayText: "",
        targetId: quizId,
      });
    }
  } else if (deleteOption && optionId && quizId) {
    const quiz = card.quizzes.find((q) => q._id.toString() === quizId);
    const optionToDelete = quiz?.options.find(
      (o) => o._id.toString() === optionId
    );
    if (optionToDelete) {
      changes.push({
        changeType: "deletion",
        field: "Quiz Option",
        oldValue: optionToDelete.value,
        newValue: null,
        oldDisplayText: generateDisplayText(optionToDelete.value, "option"),
        newDisplayText: "",
        targetId: optionId,
        metadata: { quizId },
      });
    }
  } else {
    // Handle edits and additions
    if (question !== undefined && flashcardId) {
      const flashcard = card.review.find(
        (r) => r._id.toString() === flashcardId
      );
      if (flashcard && flashcard.question !== question) {
        changes.push({
          changeType: "edit",
          field: "Flashcard Question",
          oldValue: flashcard.question,
          newValue: question,
          oldDisplayText: generateDisplayText(flashcard.question, "question"),
          newDisplayText: generateDisplayText(question, "question"),
          targetId: flashcardId,
        });
      }
    }

    if (answer !== undefined && flashcardId) {
      const flashcard = card.review.find(
        (r) => r._id.toString() === flashcardId
      );
      if (flashcard && flashcard.answer !== answer) {
        changes.push({
          changeType: "edit",
          field: "Flashcard Answer",
          oldValue: flashcard.answer,
          newValue: answer,
          oldDisplayText: generateDisplayText(flashcard.answer, "answer"),
          newDisplayText: generateDisplayText(answer, "answer"),
          targetId: flashcardId,
        });
      }
    }

    if (quizQuestion !== undefined && quizId) {
      const quiz = card.quizzes.find((q) => q._id.toString() === quizId);
      if (quiz && quiz.quizQuestion !== quizQuestion) {
        changes.push({
          changeType: "edit",
          field: "Quiz Question",
          oldValue: quiz.quizQuestion,
          newValue: quizQuestion,
          oldDisplayText: generateDisplayText(quiz.quizQuestion, "question"),
          newDisplayText: generateDisplayText(quizQuestion, "question"),
          targetId: quizId,
        });
      }
    }

    if (quizAnswer !== undefined && quizId) {
      const quiz = card.quizzes.find((q) => q._id.toString() === quizId);
      if (quiz && quiz.quizAnswer !== quizAnswer) {
        changes.push({
          changeType: "edit",
          field: "Quiz Answer",
          oldValue: quiz.quizAnswer,
          newValue: quizAnswer,
          oldDisplayText: generateDisplayText(quiz.quizAnswer, "answer"),
          newDisplayText: generateDisplayText(quizAnswer, "answer"),
          targetId: quizId,
        });
      }
    }

    // Handle new flashcard
    if (question && answer && !flashcardId && !quizId) {
      changes.push({
        changeType: "addition",
        field: "New Flashcard",
        oldValue: null,
        newValue: { question, answer },
        oldDisplayText: "",
        newDisplayText: generateDisplayText(question, "question"),
        targetId: null,
      });
    }

    // Handle new quiz
    if (quizQuestion && quizAnswer && !quizId) {
      changes.push({
        changeType: "addition",
        field: "New Quiz",
        oldValue: null,
        newValue: {
          quizQuestion,
          quizAnswer,
          options: newOptions,
          minimumOptions,
        },
        oldDisplayText: "",
        newDisplayText: generateDisplayText(quizQuestion, "question"),
        targetId: null,
        metadata: { flashcardId },
      });
    }

    // Handle quiz option edits
    if (option !== undefined && optionId && quizId) {
      const quiz = card.quizzes.find((q) => q._id.toString() === quizId);
      const existingOption = quiz?.options.find(
        (o) => o._id.toString() === optionId
      );
      if (existingOption && existingOption.value !== option) {
        changes.push({
          changeType: "edit",
          field: "Quiz Option",
          oldValue: existingOption.value,
          newValue: option,
          oldDisplayText: generateDisplayText(existingOption.value, "option"),
          newDisplayText: generateDisplayText(option, "option"),
          targetId: optionId,
          metadata: { quizId },
        });
      }
    }

    // Handle new quiz option additions
    if (option !== undefined && !optionId && quizId) {
      changes.push({
        changeType: "addition",
        field: "New Quiz Option",
        oldValue: null,
        newValue: option,
        oldDisplayText: "",
        newDisplayText: generateDisplayText(option, "option"),
        targetId: null,
        metadata: { quizId },
      });
    }

    // Handle quiz options array updates (for bulk option changes)
    if (newOptions !== undefined && quizId) {
      const quiz = card.quizzes.find((q) => q._id.toString() === quizId);
      if (quiz) {
        const oldOptions = quiz.options || [];
        const maxLen = Math.max(oldOptions.length, newOptions.length);

        for (let i = 0; i < maxLen; i++) {
          const oldOpt = oldOptions[i];
          const newOptValue = newOptions[i];

          if (oldOpt && !newOptValue) {
            // Option deletion
            changes.push({
              changeType: "deletion",
              field: `Quiz Option ${i + 1}`,
              oldValue: oldOpt.value,
              newValue: null,
              oldDisplayText: generateDisplayText(oldOpt.value, "option"),
              newDisplayText: "",
              targetId: oldOpt._id.toString(),
              metadata: { quizId },
            });
          } else if (oldOpt && newOptValue && oldOpt.value !== newOptValue) {
            // Option edit
            changes.push({
              changeType: "edit",
              field: `Quiz Option ${i + 1}`,
              oldValue: oldOpt.value,
              newValue: newOptValue,
              oldDisplayText: generateDisplayText(oldOpt.value, "option"),
              newDisplayText: generateDisplayText(newOptValue, "option"),
              targetId: oldOpt._id.toString(),
              metadata: { quizId },
            });
          } else if (!oldOpt && newOptValue) {
            // New option addition
            changes.push({
              changeType: "addition",
              field: "New Quiz Option",
              oldValue: null,
              newValue: newOptValue,
              oldDisplayText: "",
              newDisplayText: generateDisplayText(newOptValue, "option"),
              targetId: null,
              metadata: { quizId },
            });
          }
        }
      }
    }

    // Handle minimum options changes
    if (minimumOptions !== undefined && quizId) {
      const quiz = card.quizzes.find((q) => q._id.toString() === quizId);
      if (quiz && quiz.minimumOptions !== Number(minimumOptions)) {
        changes.push({
          changeType: "edit",
          field: "Quiz Minimum Options",
          oldValue: quiz.minimumOptions,
          newValue: Number(minimumOptions),
          oldDisplayText: (quiz.minimumOptions || "").toString(),
          newDisplayText: minimumOptions.toString(),
          targetId: quizId,
        });
      }
    }

    // Handle quiz flashcard association changes
    if (flashcardId !== undefined && quizId) {
      const quiz = card.quizzes.find((q) => q._id.toString() === quizId);
      const currentFlashcardId = quiz?.flashcardId?.toString();

      if (currentFlashcardId !== flashcardId) {
        const oldFlashcard = currentFlashcardId
          ? card.review.find((r) => r._id.toString() === currentFlashcardId)
          : null;
        const newFlashcard = flashcardId
          ? card.review.find((r) => r._id.toString() === flashcardId)
          : null;

        const oldDisplayText = oldFlashcard
          ? `"${generateDisplayText(oldFlashcard.question, "question")}"`
          : "None";
        const newDisplayText = newFlashcard
          ? `"${generateDisplayText(newFlashcard.question, "question")}"`
          : "None";

        changes.push({
          changeType: "edit",
          field: "Quiz Flashcard Association",
          oldValue: currentFlashcardId,
          newValue: flashcardId,
          oldDisplayText,
          newDisplayText,
          targetId: quizId,
          metadata: { oldFlashcardId: currentFlashcardId },
        });
      }
    }

    // Handle reordering operations
    if (otherDetails.reorderFlashcards) {
      const validIds = otherDetails.reorderFlashcards.filter((id) =>
        card.review.some((r) => r._id.toString() === id)
      );

      if (validIds.length === card.review.length) {
        const oldDisplayText = card.review
          .map((item, index) => {
            const plainText = generateDisplayText(item.question, "question");
            return `#${index + 1} - ${plainText}`;
          })
          .join("\n");

        const reorderedItems = validIds.map((id) =>
          card.review.find((r) => r._id.toString() === id)
        );
        const newDisplayText = reorderedItems
          .map((item, index) => {
            const plainText = generateDisplayText(item.question, "question");
            return `#${index + 1} - ${plainText}`;
          })
          .join("\n");

        changes.push({
          changeType: "edit",
          field: "Flashcard Order",
          oldValue: card.review.map((r) => r._id.toString()),
          newValue: validIds,
          oldDisplayText,
          newDisplayText,
          targetId: null,
        });
      }
    }

    if (otherDetails.reorderQuizzes) {
      const validIds = otherDetails.reorderQuizzes.filter((id) =>
        card.quizzes.some((q) => q._id.toString() === id)
      );

      if (validIds.length === card.quizzes.length) {
        const oldDisplayText = card.quizzes
          .map((item, index) => {
            const plainText = generateDisplayText(
              item.quizQuestion,
              "question"
            );
            return `#${index + 1} - ${plainText}`;
          })
          .join("\n");

        const reorderedItems = validIds.map((id) =>
          card.quizzes.find((q) => q._id.toString() === id)
        );
        const newDisplayText = reorderedItems
          .map((item, index) => {
            const plainText = generateDisplayText(
              item.quizQuestion,
              "question"
            );
            return `#${index + 1} - ${plainText}`;
          })
          .join("\n");

        changes.push({
          changeType: "edit",
          field: "Quiz Order",
          oldValue: card.quizzes.map((q) => q._id.toString()),
          newValue: validIds,
          oldDisplayText,
          newDisplayText,
          targetId: null,
        });
      }
    }

    // Handle card field updates
    if (description !== undefined && card.description !== description) {
      changes.push({
        changeType: "edit",
        field: "Description",
        oldValue: card.description,
        newValue: description,
        oldDisplayText: generateDisplayText(card.description, "description"),
        newDisplayText: generateDisplayText(description, "description"),
        targetId: null,
      });
    }

    if (category !== undefined && card.category !== category) {
      changes.push({
        changeType: "edit",
        field: "Category",
        oldValue: card.category,
        newValue: category,
        oldDisplayText: card.category,
        newDisplayText: category,
        targetId: null,
      });
    }

    if (mainTopic !== undefined && card["main-topic"] !== mainTopic) {
      changes.push({
        changeType: "edit",
        field: "Main Topic",
        oldValue: card["main-topic"],
        newValue: mainTopic,
        oldDisplayText: card["main-topic"],
        newDisplayText: mainTopic,
        targetId: null,
      });
    }

    if (subTopic !== undefined && card["sub-topic"] !== subTopic) {
      changes.push({
        changeType: "edit",
        field: "Sub Topic",
        oldValue: card["sub-topic"],
        newValue: subTopic,
        oldDisplayText: card["sub-topic"],
        newDisplayText: subTopic,
        targetId: null,
      });
    }
  }

  // Create a single review queue item with all changes grouped together
  if (changes.length === 0) {
    return card; // No changes to process
  }

  // Determine the primary change type and field for the grouped change
  let primaryChangeType = "edit";
  let primaryField = "Multiple Fields";
  let primaryTargetId = null;
  let groupedOldValue = {};
  let groupedNewValue = {};
  let groupedMetadata = {};

  // If all changes are for the same target (e.g., same flashcard or quiz), group them properly
  const targetIds = [
    ...new Set(changes.map((c) => c.targetId).filter(Boolean)),
  ];
  const changeTypes = [...new Set(changes.map((c) => c.changeType))];

  if (targetIds.length === 1 && targetIds[0]) {
    // All changes are for the same target
    primaryTargetId = targetIds[0];

    // Determine if it's a flashcard or quiz
    const isFlashcard = changes.some((c) => c.field.startsWith("Flashcard"));
    const isQuiz = changes.some((c) => c.field.startsWith("Quiz"));

    if (isFlashcard) {
      primaryField = "Flashcard";
      const flashcard = card.review.find(
        (r) => r._id.toString() === primaryTargetId
      );
      if (flashcard) {
        groupedOldValue = { question: flashcard.question };
        groupedNewValue = { ...groupedOldValue };
        groupedMetadata.flashcardQuestion = flashcard.question;

        // Apply changes to the grouped values
        const questionChange = changes.find(
          (c) => c.field === "Flashcard Question"
        );
        if (questionChange) {
          groupedNewValue.question = questionChange.newValue;
        }
        if (primaryChangeType !== changeTypes[0]) {
          primaryChangeType = changeTypes[0];
        }
      }
    } else if (isQuiz) {
      primaryField = "Quiz";
      const quiz = card.quizzes.find(
        (q) => q._id.toString() === primaryTargetId
      );
      if (quiz) {
        groupedOldValue = { quizQuestion: quiz.quizQuestion };
        groupedNewValue = { ...groupedOldValue };
        groupedMetadata.quizQuestion = quiz.quizQuestion;

        // Apply changes to the grouped values
        const questionChange = changes.find((c) => c.field === "Quiz Question");
        if (questionChange) {
          groupedNewValue.quizQuestion = questionChange.newValue;
        }
        if (primaryChangeType !== changeTypes[0]) {
          primaryChangeType = changeTypes[0];
        }
      }
    }
  } else if (changeTypes.length === 1) {
    // All changes are the same type
    primaryChangeType = changeTypes[0];

    if (primaryChangeType === "addition") {
      // Handle new additions
      if (changes.some((c) => c.field.includes("Flashcard"))) {
        primaryField = "New Flashcard";
        groupedNewValue = {
          question:
            changes.find((c) => c.field.includes("Question"))?.newValue || "",
          answer:
            changes.find((c) => c.field.includes("Answer"))?.newValue || "",
        };
      } else if (changes.some((c) => c.field.includes("Quiz"))) {
        primaryField = "New Quiz";
        groupedNewValue = {
          quizQuestion:
            changes.find((c) => c.field.includes("Question"))?.newValue || "",
          quizAnswer:
            changes.find((c) => c.field.includes("Answer"))?.newValue || "",
          options: changes
            .filter((c) => c.field.includes("Option"))
            .map((c) => c.newValue),
          minimumOptions:
            changes.find((c) => c.field.includes("Minimum"))?.newValue || 2,
        };

        // Add flashcard association if present
        const flashcardAssoc = changes.find((c) =>
          c.field.includes("Association")
        );
        if (flashcardAssoc) {
          groupedMetadata.flashcardId = flashcardAssoc.newValue;
        }
      }
    } else if (primaryChangeType === "deletion") {
      // Handle deletions
      if (changes.some((c) => c.field.includes("Flashcard"))) {
        primaryField = "Flashcard";
        primaryTargetId = changes[0].targetId;
        groupedOldValue = changes[0].oldValue;
      } else if (changes.some((c) => c.field.includes("Quiz"))) {
        primaryField = "Quiz";
        primaryTargetId = changes[0].targetId;
        groupedOldValue = changes[0].oldValue;
      }
    }
  }

  // Generate display text for the grouped change
  let oldDisplayText = "";
  let newDisplayText = "";

  if (primaryField === "Flashcard") {
    oldDisplayText = generateDisplayText(groupedOldValue.question, "question");
    newDisplayText = generateDisplayText(groupedNewValue.question, "question");
  } else if (primaryField === "Quiz") {
    oldDisplayText = generateDisplayText(
      groupedOldValue.quizQuestion,
      "question"
    );
    newDisplayText = generateDisplayText(
      groupedNewValue.quizQuestion,
      "question"
    );
  } else if (primaryField === "New Flashcard") {
    newDisplayText = generateDisplayText(groupedNewValue.question, "question");
  } else if (primaryField === "New Quiz") {
    newDisplayText = generateDisplayText(
      groupedNewValue.quizQuestion,
      "question"
    );
  } else {
    // For multiple unrelated fields, create a summary
    const fieldNames = [...new Set(changes.map((c) => c.field))];
    primaryField =
      fieldNames.length === 1 ? fieldNames[0] : `${fieldNames.length} Fields`;
    oldDisplayText = fieldNames.join(", ");
    newDisplayText = fieldNames.join(", ");
  }

  // Create the grouped review queue item
  const groupedChange = {
    changeType: primaryChangeType,
    field: primaryField,
    oldValue:
      Object.keys(groupedOldValue).length > 0
        ? groupedOldValue
        : changes[0]?.oldValue || null,
    newValue:
      Object.keys(groupedNewValue).length > 0
        ? groupedNewValue
        : changes[0]?.newValue || null,
    oldDisplayText,
    newDisplayText,
    targetId: primaryTargetId,
    metadata: {
      ...groupedMetadata,
      individualChanges: changes, // Store individual changes for detailed view
    },
  };

  const updatedCard = await createReviewQueueItem(
    cardId,
    groupedChange,
    userId
  );
  return updatedCard;
}

/**
 * Accept a review queue item and apply the change to the card
 */
export async function acceptReviewItem(cardId, itemId, userId) {
  if (!Types.ObjectId.isValid(cardId) || !Types.ObjectId.isValid(itemId)) {
    throw new Error("Invalid card ID or item ID");
  }

  const card = await Card.findById(cardId);
  if (!card) {
    throw new Error("Card not found");
  }

  // Find the review queue item
  const queueItem = card.reviewQueue.find(
    (item) => item._id.toString() === itemId
  );
  if (!queueItem) {
    throw new Error("Review queue item not found");
  }

  // Check if the item has expired
  if (queueItem.expiresAt && new Date() > queueItem.expiresAt) {
    throw new Error("Review queue item has expired");
  }

  // Apply the change based on the change type and field
  let updateQuery = {};
  let logChanges = [];
  let summary = "";

  try {
    // Check if this is a grouped change with individual changes in metadata
    if (
      queueItem.metadata &&
      queueItem.metadata.individualChanges &&
      Array.isArray(queueItem.metadata.individualChanges)
    ) {
      // Process grouped changes - apply all individual changes together
      const individualChanges = queueItem.metadata.individualChanges;

      // Apply changes using the original updateCard logic with collaborative edit flag
      const updateDetails = {
        _id: cardId,
        userId: queueItem.submittedBy,
        isCollaborativeEdit: true,
      };

      // Reconstruct the update details from individual changes
      individualChanges.forEach((change) => {
        if (change.changeType === "deletion") {
          // Handle deletions
          if (change.field === "Flashcard" && change.targetId) {
            updateDetails.deleteCard = true;
            updateDetails.cardId = change.targetId;
          } else if (change.field === "Quiz" && change.targetId) {
            updateDetails.deleteQuiz = true;
            updateDetails.quizId = change.targetId;
          } else if (
            change.field === "Quiz Option" ||
            change.field.startsWith("Deleted Quiz Option")
          ) {
            updateDetails.deleteOption = true;
            updateDetails.optionId = change.targetId;
            updateDetails.quizId = change.metadata?.quizId;
          }
        } else if (change.changeType === "addition") {
          // Handle additions
          if (change.field === "New Flashcard") {
            updateDetails.question = change.newValue?.question;
            updateDetails.answer = change.newValue?.answer;
          } else if (change.field === "New Quiz") {
            updateDetails.quizQuestion = change.newValue?.quizQuestion;
            updateDetails.quizAnswer = change.newValue?.quizAnswer;
            updateDetails.options = change.newValue?.options;
            updateDetails.minimumOptions = change.newValue?.minimumOptions;
            if (change.metadata?.flashcardId) {
              updateDetails.cardId = change.metadata.flashcardId;
            }
          } else if (change.field === "New Quiz Option") {
            updateDetails.option = change.newValue;
            updateDetails.quizId = change.metadata?.quizId;
          }
        } else {
          // Handle edits
          if (change.field === "Flashcard Question" && change.targetId) {
            updateDetails.question = change.newValue;
            updateDetails.cardId = change.targetId;
          } else if (change.field === "Flashcard Answer" && change.targetId) {
            updateDetails.answer = change.newValue;
            updateDetails.cardId = change.targetId;
          } else if (change.field === "Quiz Question" && change.targetId) {
            updateDetails.quizQuestion = change.newValue;
            updateDetails.quizId = change.targetId;
          } else if (change.field === "Quiz Answer" && change.targetId) {
            updateDetails.quizAnswer = change.newValue;
            updateDetails.quizId = change.targetId;
          } else if (
            change.field === "Quiz Minimum Options" &&
            change.targetId
          ) {
            updateDetails.minimumOptions = change.newValue;
            updateDetails.quizId = change.targetId;
          } else if (
            change.field.startsWith("Quiz Option") &&
            change.targetId
          ) {
            updateDetails.option = change.newValue;
            updateDetails.optionId = change.targetId;
            updateDetails.quizId = change.metadata?.quizId;
          } else if (change.field === "Description") {
            updateDetails.description = change.newValue;
          } else if (change.field === "Category") {
            updateDetails.category = change.newValue;
          } else if (change.field === "Main Topic") {
            updateDetails["main-topic"] = change.newValue;
          } else if (change.field === "Sub Topic") {
            updateDetails["sub-topic"] = change.newValue;
          } else if (
            change.field === "Quiz Flashcard Association" &&
            change.targetId
          ) {
            updateDetails.cardId = change.newValue;
            updateDetails.quizId = change.targetId;
          } else if (change.field === "Flashcard Order") {
            updateDetails.reorderFlashcards = change.newValue;
          } else if (change.field === "Quiz Order") {
            updateDetails.reorderQuizzes = change.newValue;
          }
        }
      });

      // Apply the grouped changes by calling updateCard with reconstructed details
      // updateCard will handle logging with the "Collaborative Edit:" prefix
      const result = await updateCard(updateDetails);

      // For grouped changes, we only need to remove the item from review queue
      // No additional logging needed since updateCard already handled it
      const updatedCard = await Card.findByIdAndUpdate(
        cardId,
        { $pull: { reviewQueue: { _id: itemId } } },
        { new: true }
      );

      return updatedCard;
    } else {
      // Handle single changes (legacy support)
      switch (queueItem.changeType) {
        case "edit":
          updateQuery = await applyEditChange(card, queueItem);
          break;
        case "addition":
          updateQuery = await applyAdditionChange(card, queueItem);
          break;
        case "deletion":
          updateQuery = await applyDeletionChange(card, queueItem);
          break;
        default:
          throw new Error(`Unknown change type: ${queueItem.changeType}`);
      }

      // Create log entry for the accepted change with collaborative prefix
      const logEntry = {
        eventType: "updated",
        user: queueItem.submittedBy, // Use the original contributor, not the reviewer
        summary: `Collaborative Edit: ${queueItem.changeType} ${queueItem.field}`,
        changes: [
          {
            field: queueItem.field,
            oldValue: queueItem.oldValue,
            newValue: queueItem.newValue,
            oldDisplayText: queueItem.oldDisplayText,
            newDisplayText: queueItem.newDisplayText,
            targetId: queueItem.targetId,
          },
        ],
      };

      // Remove the item from review queue and apply the change
      updateQuery.$pull = { reviewQueue: { _id: itemId } };
      updateQuery.$push = { ...updateQuery.$push, logs: logEntry };
      updateQuery.$set = { ...updateQuery.$set, lastUpdatedBy: userId };

      const updatedCard = await Card.findByIdAndUpdate(cardId, updateQuery, {
        new: true,
      });
      return updatedCard;
    }
  } catch (error) {
    throw new Error(`Failed to apply change: ${error.message}`);
  }
}

/**
 * Apply an edit change to the card
 */
async function applyEditChange(card, queueItem) {
  const { field, newValue, targetId } = queueItem;
  let updateQuery = { $set: {} };

  switch (field) {
    case "Main Topic":
      updateQuery.$set["main-topic"] = newValue;
      break;
    case "Sub Topic":
      updateQuery.$set["sub-topic"] = newValue;
      break;
    case "Category":
      updateQuery.$set.category = newValue;
      break;
    case "Description":
      updateQuery.$set.description = newValue;
      break;
    case "Flashcard Question":
      if (!targetId)
        throw new Error("Target ID required for flashcard updates");
      const reviewIndex = card.review.findIndex(
        (r) => r._id.toString() === targetId
      );
      if (reviewIndex === -1) throw new Error("Flashcard not found");
      updateQuery.$set[`review.${reviewIndex}.question`] = newValue;
      break;
    case "Flashcard Answer":
      if (!targetId)
        throw new Error("Target ID required for flashcard updates");
      const answerIndex = card.review.findIndex(
        (r) => r._id.toString() === targetId
      );
      if (answerIndex === -1) throw new Error("Flashcard not found");
      updateQuery.$set[`review.${answerIndex}.answer`] = newValue;
      break;
    case "Quiz Question":
      if (!targetId) throw new Error("Target ID required for quiz updates");
      const quizIndex = card.quizzes.findIndex(
        (q) => q._id.toString() === targetId
      );
      if (quizIndex === -1) throw new Error("Quiz not found");
      updateQuery.$set[`quizzes.${quizIndex}.quizQuestion`] = newValue;
      break;
    case "Quiz Answer":
      if (!targetId) throw new Error("Target ID required for quiz updates");
      const quizAnswerIndex = card.quizzes.findIndex(
        (q) => q._id.toString() === targetId
      );
      if (quizAnswerIndex === -1) throw new Error("Quiz not found");
      updateQuery.$set[`quizzes.${quizAnswerIndex}.quizAnswer`] = newValue;
      break;
    case "Quiz Minimum Options":
      if (!targetId) throw new Error("Target ID required for quiz updates");
      const minOptionsQuizIndex = card.quizzes.findIndex(
        (q) => q._id.toString() === targetId
      );
      if (minOptionsQuizIndex === -1) throw new Error("Quiz not found");
      updateQuery.$set[`quizzes.${minOptionsQuizIndex}.minimumOptions`] =
        Number(newValue);
      break;
    case "Quiz Flashcard Association":
      if (!targetId) throw new Error("Target ID required for quiz updates");
      const assocQuizIndex = card.quizzes.findIndex(
        (q) => q._id.toString() === targetId
      );
      if (assocQuizIndex === -1) throw new Error("Quiz not found");
      const flashcardId =
        newValue && Types.ObjectId.isValid(newValue)
          ? new Types.ObjectId(newValue)
          : null;
      updateQuery.$set[`quizzes.${assocQuizIndex}.flashcardId`] = flashcardId;
      break;
    case "Flashcard Order":
      // Reorder flashcards based on newValue array
      if (!Array.isArray(newValue))
        throw new Error("Invalid flashcard order data");
      const reviewMap = new Map();
      card.review.forEach((item) => reviewMap.set(item._id.toString(), item));
      const reorderedReview = newValue
        .map((id) => reviewMap.get(id))
        .filter(Boolean);
      if (reorderedReview.length === card.review.length) {
        updateQuery.$set.review = reorderedReview;
      }
      break;
    case "Quiz Order":
      // Reorder quizzes based on newValue array
      if (!Array.isArray(newValue)) throw new Error("Invalid quiz order data");
      const quizMap = new Map();
      card.quizzes.forEach((item) => quizMap.set(item._id.toString(), item));
      const reorderedQuizzes = newValue
        .map((id) => quizMap.get(id))
        .filter(Boolean);
      if (reorderedQuizzes.length === card.quizzes.length) {
        updateQuery.$set.quizzes = reorderedQuizzes;
      }
      break;
    default:
      // Handle dynamic quiz option fields like "Quiz Option 1", "Quiz Option 2", etc.
      if (field.startsWith("Quiz Option ")) {
        const optionMatch = field.match(/Quiz Option (\d+)/);
        if (optionMatch && queueItem.metadata?.quizId) {
          const optionNumber = parseInt(optionMatch[1]);
          const quizIndex = card.quizzes.findIndex(
            (q) => q._id.toString() === queueItem.metadata.quizId
          );
          if (quizIndex === -1) throw new Error("Quiz not found");

          const optionIndex = optionNumber - 1; // Convert to 0-based index
          if (
            optionIndex >= 0 &&
            optionIndex < card.quizzes[quizIndex].options.length
          ) {
            updateQuery.$set[
              `quizzes.${quizIndex}.options.${optionIndex}.value`
            ] = newValue;
          } else {
            throw new Error(`Quiz option ${optionNumber} not found`);
          }
          break;
        }
      }

      // Handle generic "Quiz Option" field with targetId
      if (field === "Quiz Option" && targetId && queueItem.metadata?.quizId) {
        const quizIndex = card.quizzes.findIndex(
          (q) => q._id.toString() === queueItem.metadata.quizId
        );
        if (quizIndex === -1) throw new Error("Quiz not found");

        const optionIndex = card.quizzes[quizIndex].options.findIndex(
          (opt) => opt._id.toString() === targetId
        );
        if (optionIndex === -1) throw new Error("Quiz option not found");

        updateQuery.$set[`quizzes.${quizIndex}.options.${optionIndex}.value`] =
          newValue;
        break;
      }

      // Handle generic "Quiz Option" field with just targetId (no metadata)
      if (field === "Quiz Option" && targetId) {
        // Find the quiz that contains this option
        let foundQuizIndex = -1;
        let foundOptionIndex = -1;

        for (let i = 0; i < card.quizzes.length; i++) {
          const optionIndex = card.quizzes[i].options.findIndex(
            (opt) => opt._id.toString() === targetId
          );
          if (optionIndex !== -1) {
            foundQuizIndex = i;
            foundOptionIndex = optionIndex;
            break;
          }
        }

        if (foundQuizIndex === -1 || foundOptionIndex === -1) {
          throw new Error("Quiz option not found");
        }

        updateQuery.$set[
          `quizzes.${foundQuizIndex}.options.${foundOptionIndex}.value`
        ] = newValue;
        break;
      }

      throw new Error(`Unsupported edit field: ${field}`);
  }

  return updateQuery;
}

/**
 * Apply an addition change to the card
 */
async function applyAdditionChange(card, queueItem) {
  const { field, newValue, metadata } = queueItem;
  let updateQuery = { $push: {} };

  switch (field) {
    case "New Flashcard":
      // For new flashcards, newValue contains both question and answer
      if (!newValue || !newValue.question || !newValue.answer) {
        throw new Error("Question and answer required for new flashcard");
      }
      updateQuery.$push.review = {
        question: newValue.question,
        answer: newValue.answer,
      };
      break;
    case "New Quiz":
      // For new quizzes, newValue contains quiz data
      if (!newValue || !newValue.quizQuestion || !newValue.quizAnswer) {
        throw new Error("Question and answer required for new quiz");
      }
      const newQuiz = {
        quizQuestion: newValue.quizQuestion,
        quizAnswer: newValue.quizAnswer,
        options: (newValue.options || []).map((option) => ({
          _id: new Types.ObjectId(),
          value: option,
        })),
        minimumOptions: newValue.minimumOptions || 2,
      };
      // Only add flashcardId if it's a valid ObjectId
      if (
        metadata &&
        metadata.flashcardId &&
        Types.ObjectId.isValid(metadata.flashcardId)
      ) {
        newQuiz.flashcardId = new Types.ObjectId(metadata.flashcardId);
      }
      updateQuery.$push.quizzes = newQuiz;
      break;
    case "New Quiz Option":
      // For new quiz options, we need the quiz ID from metadata
      if (!metadata || !metadata.quizId) {
        throw new Error("Quiz ID required for new quiz option");
      }
      if (!newValue || typeof newValue !== "string") {
        throw new Error("Option value required for new quiz option");
      }

      const quizIndex = card.quizzes.findIndex(
        (q) => q._id.toString() === metadata.quizId
      );
      if (quizIndex === -1) throw new Error("Quiz not found");

      // Use $push to add new option to the specific quiz
      updateQuery = { $push: {} };
      updateQuery.$push[`quizzes.${quizIndex}.options`] = {
        _id: new Types.ObjectId(),
        value: newValue,
      };
      break;
    default:
      // Handle any other "New" fields that might be dynamically generated
      if (field.startsWith("New ")) {
        if (field.includes("Flashcard")) {
          // Handle new flashcard additions
          if (!newValue || !newValue.question || !newValue.answer) {
            throw new Error("Question and answer required for new flashcard");
          }
          updateQuery.$push.review = {
            question: newValue.question,
            answer: newValue.answer,
          };
          break;
        }
        if (field.includes("Quiz") && !field.includes("Option")) {
          // Handle new quiz additions
          if (!newValue || !newValue.quizQuestion || !newValue.quizAnswer) {
            throw new Error("Question and answer required for new quiz");
          }
          const newQuiz = {
            quizQuestion: newValue.quizQuestion,
            quizAnswer: newValue.quizAnswer,
            options: (newValue.options || []).map((option) => ({
              _id: new Types.ObjectId(),
              value: option,
            })),
            minimumOptions: newValue.minimumOptions || 2,
          };
          if (
            metadata &&
            metadata.flashcardId &&
            Types.ObjectId.isValid(metadata.flashcardId)
          ) {
            newQuiz.flashcardId = new Types.ObjectId(metadata.flashcardId);
          }
          updateQuery.$push.quizzes = newQuiz;
          break;
        }
      }

      throw new Error(`Unsupported addition field: ${field}`);
  }

  return updateQuery;
}

/**
 * Apply a deletion change to the card
 */
async function applyDeletionChange(card, queueItem) {
  const { field, targetId } = queueItem;
  let updateQuery = { $pull: {} };

  switch (field) {
    case "Flashcard":
      if (!targetId)
        throw new Error("Target ID required for flashcard deletion");
      updateQuery.$pull.review = { _id: targetId };
      // Also remove associated quizzes
      updateQuery.$pull.quizzes = { flashcardId: targetId };
      break;
    case "Quiz":
      if (!targetId) throw new Error("Target ID required for quiz deletion");
      updateQuery.$pull.quizzes = { _id: targetId };
      break;
    case "Quiz Option":
      if (!targetId || !queueItem.metadata || !queueItem.metadata.quizId) {
        throw new Error("Target ID and quiz ID required for option deletion");
      }
      const quizIndex = card.quizzes.findIndex(
        (q) => q._id.toString() === queueItem.metadata.quizId
      );
      if (quizIndex === -1) throw new Error("Quiz not found");
      updateQuery.$pull[`quizzes.${quizIndex}.options`] = { _id: targetId };
      break;
    default:
      // Handle numbered deletion fields like "Deleted Quiz Option 1", "Deleted Quiz Option 2", etc.
      if (field.startsWith("Deleted Quiz Option ")) {
        const optionMatch = field.match(/Deleted Quiz Option (\d+)/);
        if (optionMatch && queueItem.metadata?.quizId) {
          const quizIndex = card.quizzes.findIndex(
            (q) => q._id.toString() === queueItem.metadata.quizId
          );
          if (quizIndex === -1) throw new Error("Quiz not found");

          if (targetId) {
            updateQuery.$pull[`quizzes.${quizIndex}.options`] = {
              _id: targetId,
            };
          } else {
            throw new Error("Target ID required for option deletion");
          }
          break;
        }
      }

      // Handle other numbered deletion fields
      if (field.startsWith("Deleted ")) {
        if (field.includes("Flashcard")) {
          if (!targetId)
            throw new Error("Target ID required for flashcard deletion");
          updateQuery.$pull.review = { _id: targetId };
          updateQuery.$pull.quizzes = { flashcardId: targetId };
          break;
        }
        if (field.includes("Quiz") && !field.includes("Option")) {
          if (!targetId)
            throw new Error("Target ID required for quiz deletion");
          updateQuery.$pull.quizzes = { _id: targetId };
          break;
        }
      }

      throw new Error(`Unsupported deletion field: ${field}`);
  }

  return updateQuery;
}

/**
 * Reject a review queue item by removing it from the queue
 */
export async function rejectReviewItem(cardId, itemId, userId) {
  if (!Types.ObjectId.isValid(cardId) || !Types.ObjectId.isValid(itemId)) {
    throw new Error("Invalid card ID or item ID");
  }

  const card = await Card.findById(cardId);
  if (!card) {
    throw new Error("Card not found");
  }

  // Find the review queue item
  const queueItem = card.reviewQueue.find(
    (item) => item._id.toString() === itemId
  );
  if (!queueItem) {
    throw new Error("Review queue item not found");
  }

  // Remove the item from review queue silently (no log entry for rejections)
  const updateQuery = {
    $pull: { reviewQueue: { _id: itemId } },
  };

  const updatedCard = await Card.findByIdAndUpdate(cardId, updateQuery, {
    new: true,
  });
  return updatedCard;
}
/**

 * Clean up expired review queue items from all cards probably use cron job or other alternative
 */
export async function cleanupExpiredReviewItems() {
  try {
    const result = await Card.updateMany(
      { "reviewQueue.expiresAt": { $lt: new Date() } },
      {
        $pull: {
          reviewQueue: {
            expiresAt: { $lt: new Date() },
          },
        },
      }
    );

    console.log(
      `Cleaned up expired review items from ${result.modifiedCount} cards`
    );
    return result;
  } catch (error) {
    console.error("Error cleaning up expired review items:", error);
    throw error;
  }
}

/**
 * Get review queue items for a specific card with pagination
 */
export async function getReviewQueueItems(cardId, page = 1, limit = 10) {
  if (!Types.ObjectId.isValid(cardId)) {
    throw new Error("Invalid card ID");
  }

  const skip = (page - 1) * limit;
  const currentDate = new Date();

  const result = await Card.aggregate([
    { $match: { _id: new Types.ObjectId(cardId) } },
    {
      $project: {
        reviewQueue: {
          $filter: {
            input: "$reviewQueue",
            cond: {
              $or: [
                { $eq: ["$$this.expiresAt", null] },
                { $gt: ["$$this.expiresAt", currentDate] },
              ],
            },
          },
        },
      },
    },
    { $unwind: { path: "$reviewQueue", preserveNullAndEmptyArrays: true } },
    { $sort: { "reviewQueue.submittedAt": -1 } },
    {
      $facet: {
        items: [
          { $skip: skip },
          { $limit: limit },
          {
            $lookup: {
              from: "users",
              localField: "reviewQueue.submittedBy",
              foreignField: "_id",
              as: "reviewQueue.submittedBy",
            },
          },
          {
            $unwind: {
              path: "$reviewQueue.submittedBy",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              _id: "$reviewQueue._id",
              changeType: "$reviewQueue.changeType",
              field: "$reviewQueue.field",
              oldValue: "$reviewQueue.oldValue",
              newValue: "$reviewQueue.newValue",
              oldDisplayText: "$reviewQueue.oldDisplayText",
              newDisplayText: "$reviewQueue.newDisplayText",
              targetId: "$reviewQueue.targetId",
              submittedAt: "$reviewQueue.submittedAt",
              expiresAt: "$reviewQueue.expiresAt",
              metadata: "$reviewQueue.metadata",
              submittedBy: {
                name: "$reviewQueue.submittedBy.name",
                username: "$reviewQueue.submittedBy.username",
              },
            },
          },
        ],
        totalCount: [{ $count: "total" }],
      },
    },
  ]);

  const items = result[0]?.items || [];
  const total = result[0]?.totalCount[0]?.total || 0;
  const hasMore = skip + limit < total;

  return {
    items,
    total,
    hasMore,
    page,
    limit,
  };
}

export async function getCardReviewers(cardId) {
  if (!Types.ObjectId.isValid(cardId)) {
    throw new Error("Invalid card ID");
  }

  const result = await Card.aggregate([
    { $match: { _id: new Types.ObjectId(cardId) } },
    {
      $lookup: {
        from: "users",
        localField: "reviewers",
        foreignField: "_id",
        as: "reviewerDetails",
      },
    },
    {
      $project: {
        reviewers: {
          $map: {
            input: "$reviewerDetails",
            as: "reviewer",
            in: {
              _id: "$$reviewer._id",
              name: "$$reviewer.name",
              username: "$$reviewer.username",
            },
          },
        },
      },
    },
  ]);

  if (!result || result.length === 0) {
    throw new Error("Card not found");
  }

  return result[0].reviewers || [];
}

export async function addCardReviewers(cardId, userIds, addedByUserId) {
  if (!Types.ObjectId.isValid(cardId)) {
    throw new Error("Invalid card ID");
  }

  // Validate all user IDs
  const validUserIds = userIds.filter((id) => Types.ObjectId.isValid(id));
  if (validUserIds.length !== userIds.length) {
    throw new Error("One or more invalid user IDs provided");
  }

  // Check if users exist
  const User = (await import("../users/users.mongo.js")).default;
  const existingUsers = await User.find(
    { _id: { $in: validUserIds } },
    { _id: 1 }
  );
  if (existingUsers.length !== validUserIds.length) {
    throw new Error("One or more users not found");
  }

  // Get current card to check existing reviewers
  const card = await Card.findById(cardId, { reviewers: 1 });
  if (!card) {
    throw new Error("Card not found");
  }

  // Filter out users who are already reviewers
  const existingReviewerIds = card.reviewers.map((id) => id.toString());
  const newReviewerIds = validUserIds.filter(
    (id) => !existingReviewerIds.includes(id)
  );

  if (newReviewerIds.length === 0) {
    throw new Error("All specified users are already reviewers");
  }

  // Add new reviewers (no log entry for permission changes)
  const updatedCard = await Card.findByIdAndUpdate(
    cardId,
    {
      $addToSet: { reviewers: { $each: newReviewerIds } },
      $set: { lastUpdatedBy: addedByUserId },
    },
    { new: true }
  );

  return updatedCard;
} /**

 * Remove a reviewer from a card
 */
export async function removeCardReviewer(
  cardId,
  userIdToRemove,
  removedByUserId
) {
  if (
    !Types.ObjectId.isValid(cardId) ||
    !Types.ObjectId.isValid(userIdToRemove)
  ) {
    throw new Error("Invalid card ID or user ID");
  }

  // Get current card to check author and existing reviewers
  const card = await Card.findById(cardId, { author: 1, reviewers: 1 });
  if (!card) {
    throw new Error("Card not found");
  }

  // Ensure author cannot be removed from reviewers
  if (card.author.toString() === userIdToRemove) {
    throw new Error("Cannot remove the card author from reviewers");
  }

  // Check if user is actually a reviewer
  const isReviewer = card.reviewers.some(
    (id) => id.toString() === userIdToRemove
  );
  if (!isReviewer) {
    throw new Error("User is not a reviewer for this card");
  }

  // Remove the reviewer (no log entry for permission changes)
  const updatedCard = await Card.findByIdAndUpdate(
    cardId,
    {
      $pull: { reviewers: userIdToRemove },
      $set: { lastUpdatedBy: removedByUserId },
    },
    { new: true }
  );

  return updatedCard;
}
