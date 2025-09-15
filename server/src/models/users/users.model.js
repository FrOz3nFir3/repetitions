import Users from "../users/users.mongo.js";
import Card from "../cards/cards.mongo.js";
import mongoose from "mongoose";
import crypto from "crypto";
import { escapeRegex } from "../../utils/textNormalization.js";

export async function findUserByEmail(email, projection = {}) {
  return Users.findOne({ email: String(email) }, projection).lean();
}

export async function findUserByUsername(username, projection = {}) {
  return Users.findOne({ username }, projection).lean();
}

export async function getPublicUserByUsername(username, excludeId = true) {
  return Users.findOne({
    username,
  })
    .select(`name username ${excludeId ? "-_id" : ""}`)
    .lean();
}

export async function findUserByEmailOrUsername(
  loginIdentifier,
  projection = {}
) {
  return Users.findOne(
    {
      $or: [{ email: loginIdentifier }, { username: loginIdentifier }],
    },
    projection
  );
}

export async function findUserByGoogleId(googleId, projection = {}) {
  // test this as _.doc is been used
  return Users.findOne({ googleId: { $eq: googleId } }, projection).lean();
}

export async function getUserById(userId, projection = {}) {
  if (userId === "null" || userId === "undefined") {
    return null;
  }
  return Users.findOne({ _id: { $eq: userId } }, projection).lean();
}

export async function createNewUser(user) {
  const newUser = new Users(user);
  return newUser.save();
}

export async function generateUniqueUsername(email) {
  let username = email.split("@")[0].replace(/[^a-z0-9]/gi, "");
  let user = await findUserByUsername(username);
  let attempts = 0;
  while (user) {
    attempts++;
    // Use cryptographically secure random bytes to generate a suffix.
    username = `${username}${crypto.randomBytes(2).toString("hex")}`;
    if (attempts > 5) {
      // Fallback for highly saturated usernames
      username = `${username}${new Date().getTime()}`;
    }
    user = await findUserByUsername(username);
  }
  return username;
}

export async function getUserReviewProgress(
  userId,
  { skip, limit, search } = {}
) {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return [];
  }

  const userObjectId = new mongoose.Types.ObjectId(`${userId}`);
  const pipeline = [
    { $match: { _id: userObjectId } },
    // probably projection before unwind will be more optimize - research about this
    {
      $project: {
        studying: {
          cardId: 1,
          review: 1,
          quiz: 1,
        },
      },
    },
    { $unwind: "$studying" },
    // decide later to show review or  not
    // { $match: { "studying.review": { $ne: null } } },
    {
      $lookup: {
        from: "cards",
        localField: "studying.cardId",
        foreignField: "_id",
        as: "cardDetails",
      },
    },
    { $unwind: "$cardDetails" },
  ];

  if (search && search.trim()) {
    const searchRegex = new RegExp("^" + escapeRegex(search), "i");
    pipeline.push({
      $match: {
        $or: [
          { "cardDetails.main-topic": searchRegex },
          { "cardDetails.sub-topic": searchRegex },
          { "cardDetails.category": searchRegex },
        ],
      },
    });
  }

  // need to update this to properly filter based on quiz and review both
  const paginatedPipeline = [
    {
      $sort: { "studying.review.updatedAt": -1, "studying.quiz.updatedAt": -1 },
    },
  ];

  if (typeof skip === "number") {
    paginatedPipeline.push({ $skip: skip });
  }

  if (typeof limit === "number") {
    paginatedPipeline.push({ $limit: limit });
  }
  paginatedPipeline.push({
    $project: {
      _id: "$cardDetails._id",
      "main-topic": "$cardDetails.main-topic",
      "sub-topic": "$cardDetails.sub-topic",
      category: "$cardDetails.category",
      lastReviewedCardNo: {
        $ifNull: ["$studying.review.lastReviewedCardNo", 0],
      },
      reviewLength: { $size: { $ifNull: ["$cardDetails.review", []] } },
      cardUpdatedAt: "$cardDetails.updatedAt",
      reviewUpdatedAt: "$studying.review.updatedAt",
      weakCardsCount: {
        $size: { $ifNull: ["$studying.review.weakCards", []] },
      },
      strugglingQuizCount: {
        $size: {
          $filter: {
            input: { $ifNull: ["$studying.quiz.attempts", []] },
            cond: { $eq: ["$$this.struggling", true] },
          },
        },
      },
    },
  });

  pipeline.push({
    $facet: {
      paginatedResults: paginatedPipeline,
      totalCount: [{ $count: "total" }],
    },
  });
  const aggregationResult = await Users.aggregate(pipeline);

  const cards = aggregationResult[0].paginatedResults;
  const total = aggregationResult[0].totalCount[0]?.total || 0;

  return { cards, total };
}

export async function getUserQuizProgress(
  userId,
  { skip, limit, search } = {}
) {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return { cards: [], total: 0 };
  }

  const userObjectId = new mongoose.Types.ObjectId(`${userId}`);

  const pipeline = [
    { $match: { _id: userObjectId } },
    { $unwind: "$studying" },
    // decide later to show the quiz or not
    // { $match: { "studying.quiz": { $ne: null } } },
    {
      $lookup: {
        from: "cards",
        localField: "studying.cardId",
        foreignField: "_id",
        as: "cardDetails",
      },
    },
    { $unwind: "$cardDetails" },
  ];

  if (search && search.trim()) {
    const searchRegex = new RegExp("^" + escapeRegex(search), "i");
    pipeline.push({
      $match: {
        $or: [
          { "cardDetails.category": searchRegex },
          { "cardDetails.main-topic": searchRegex },
          { "cardDetails.sub-topic": searchRegex },
        ],
      },
    });
  }

  const paginatedPipeline = [{ $sort: { "studying.quiz.updatedAt": -1 } }];

  if (typeof skip === "number") {
    paginatedPipeline.push({ $skip: skip });
  }

  if (typeof limit === "number") {
    paginatedPipeline.push({ $limit: limit });
  }

  paginatedPipeline.push({
    $project: {
      _id: "$cardDetails._id",
      "main-topic": "$cardDetails.main-topic",
      "sub-topic": "$cardDetails.sub-topic",
      category: "$cardDetails.category",
      // decided to sent whole quiz instead
      timesStarted: "$studying.quiz.timesStarted",
      timesFinished: "$studying.quiz.timesFinished",
      totalCorrect: "$studying.quiz.totalCorrect",
      totalIncorrect: "$studying.quiz.totalIncorrect",
      strugglingQuizCount: {
        $size: {
          $filter: {
            input: { $ifNull: ["$studying.quiz.attempts", []] },
            cond: { $eq: ["$$this.struggling", true] },
          },
        },
      },
    },
  });

  pipeline.push({
    $facet: {
      paginatedResults: paginatedPipeline,
      totalCount: [{ $count: "total" }],
    },
  });

  const aggregationResult = await Users.aggregate(pipeline);

  const cards = aggregationResult[0].paginatedResults;
  const total = aggregationResult[0].totalCount[0]?.total || 0;

  return { cards, total };
}

// later have the cardId data itself on here to optimize api call
export async function getDetailedReport(userId, cardId) {
  if (
    !mongoose.Types.ObjectId.isValid(userId) ||
    !mongoose.Types.ObjectId.isValid(cardId)
  ) {
    return [];
  }

  const userObjectId = new mongoose.Types.ObjectId(`${userId}`);
  const cardObjectId = new mongoose.Types.ObjectId(`${cardId}`);

  const result = await Users.aggregate([
    { $match: { _id: userObjectId } },
    { $unwind: "$studying" },
    { $match: { "studying.cardId": cardObjectId } },
    {
      $project: {
        _id: 0,
        attempts: { $ifNull: ["$studying.quiz.attempts", []] },
      },
    },
  ]);

  if (result.length > 0) {
    return result[0].attempts;
  } else {
    return [];
  }
}

export async function getUserStats(userId) {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return {
      totalDecksStudied: 0,
      totalQuizzesTaken: 0,
      totalCorrect: 0,
      totalIncorrect: 0,
      totalQuizzesFinished: 0,
      overallAccuracy: 0,
      completionRate: 0,
    };
  }

  const userObjectId = new mongoose.Types.ObjectId(`${userId}`);

  const result = await Users.aggregate([
    { $match: { _id: userObjectId } },
    { $unwind: "$studying" },
    { $match: { "studying.quiz": { $ne: null } } },
    {
      $group: {
        _id: null,
        totalDecksStudied: { $sum: 1 },
        totalQuizzesTaken: { $sum: "$studying.quiz.timesStarted" },
        totalCorrect: { $sum: "$studying.quiz.totalCorrect" },
        totalIncorrect: { $sum: "$studying.quiz.totalIncorrect" },
        totalQuizzesFinished: { $sum: "$studying.quiz.timesFinished" },
      },
    },
    {
      $project: {
        _id: 0,
        totalDecksStudied: 1,
        totalQuizzesTaken: 1,
        totalCorrect: 1,
        totalIncorrect: 1,
        totalQuizzesFinished: 1,
        totalAnswers: { $add: ["$totalCorrect", "$totalIncorrect"] },
        overallAccuracy: {
          $cond: {
            if: { $gt: [{ $add: ["$totalCorrect", "$totalIncorrect"] }, 0] },
            then: {
              $round: [
                {
                  $multiply: [
                    {
                      $divide: [
                        "$totalCorrect",
                        { $add: ["$totalCorrect", "$totalIncorrect"] },
                      ],
                    },
                    100,
                  ],
                },
                0,
              ],
            },
            else: 0,
          },
        },
        completionRate: {
          $cond: {
            if: { $gt: ["$totalQuizzesTaken", 0] },
            then: {
              $round: [
                {
                  $multiply: [
                    {
                      $divide: ["$totalQuizzesFinished", "$totalQuizzesTaken"],
                    },
                    100,
                  ],
                },
                0,
              ],
            },
            else: 0,
          },
        },
      },
    },
    {
      $facet: {
        stats: [{ $match: { totalDecksStudied: { $exists: true } } }],
        defaultStats: [
          {
            $project: {
              totalDecksStudied: 0,
              totalQuizzesTaken: 0,
              totalCorrect: 0,
              totalIncorrect: 0,
              totalQuizzesFinished: 0,
              overallAccuracy: 0,
              completionRate: 0,
            },
          },
        ],
      },
    },
    {
      $project: {
        stats: {
          $cond: {
            if: { $eq: [{ $size: "$stats" }, 0] },
            then: { $arrayElemAt: ["$defaultStats", 0] },
            else: { $arrayElemAt: ["$stats", 0] },
          },
        },
      },
    },
  ]);

  return (
    result[0]?.stats || {
      totalDecksStudied: 0,
      totalQuizzesTaken: 0,
      totalCorrect: 0,
      totalIncorrect: 0,
      totalQuizzesFinished: 0,
      overallAccuracy: 0,
      completionRate: 0,
    }
  );
}

export async function getUserStudyingCount(userId) {
  if (
    !userId ||
    userId === "null" ||
    userId === "undefined" ||
    !mongoose.Types.ObjectId.isValid(userId)
  ) {
    return 0;
  }

  return Users.findOne(
    {
      _id: { $eq: userId },
    },
    {
      studyingCount: { $size: "$studying" },
    }
  ).lean();
}

export async function getUserLastReviewedByCardProgress({ userId, cardId }) {
  if (
    !mongoose.Types.ObjectId.isValid(userId) ||
    !mongoose.Types.ObjectId.isValid(cardId)
  ) {
    return { lastReviewedCardNo: 0, weakCards: [] };
  }

  const userObjectId = new mongoose.Types.ObjectId(`${userId}`);
  const cardObjectId = new mongoose.Types.ObjectId(`${cardId}`);

  const result = await Users.aggregate([
    { $match: { _id: userObjectId } },
    { $unwind: "$studying" },
    { $match: { "studying.cardId": cardObjectId } },
    {
      $project: {
        _id: 0,
        lastReviewedCardNo: {
          $ifNull: ["$studying.review.lastReviewedCardNo", 0],
        },
        weakCards: {
          $ifNull: ["$studying.review.weakCards", []],
        },
      },
    },
  ]);

  if (result.length > 0) {
    return result[0];
  } else {
    return { lastReviewedCardNo: 0, weakCards: [] };
  }
}

export async function getUserQuizProgressByCard({ userId, cardId }) {
  if (
    !mongoose.Types.ObjectId.isValid(userId) ||
    !mongoose.Types.ObjectId.isValid(cardId)
  ) {
    return { strugglingQuizCount: 0 };
  }

  const userObjectId = new mongoose.Types.ObjectId(`${userId}`);
  const cardObjectId = new mongoose.Types.ObjectId(`${cardId}`);

  const result = await Users.aggregate([
    { $match: { _id: userObjectId } },
    { $unwind: "$studying" },
    { $match: { "studying.cardId": cardObjectId } },
    {
      $project: {
        _id: 0,
        strugglingQuizCount: {
          $size: {
            $filter: {
              input: { $ifNull: ["$studying.quiz.attempts", []] },
              cond: { $eq: ["$$this.struggling", true] },
            },
          },
        },
      },
    },
  ]);

  if (result.length > 0) {
    return result[0];
  } else {
    return { strugglingQuizCount: 0 };
  }
}

export async function updateUser(userId, userDetails) {
  return Users.findOneAndUpdate({ _id: { $eq: userId } }, userDetails, {
    new: true,
  }).lean();
}

export async function updateUserReviewProgress(
  userId,
  card_id,
  lastReviewedCardNo
) {
  const newReviewProgress = {
    cardId: card_id,
    quiz: {},
    review: {
      lastReviewedCardNo: lastReviewedCardNo,
      weakCards: [],
      updatedAt: new Date(),
    },
  };

  const updatedUser = await Users.findOneAndUpdate(
    { _id: { $eq: userId }, "studying.cardId": { $ne: card_id } },
    { $push: { studying: newReviewProgress } },
    { new: true }
  );

  if (updatedUser) {
    return updatedUser;
  }

  return Users.findOneAndUpdate(
    { _id: { $eq: userId }, "studying.cardId": { $eq: card_id } },
    {
      $set: {
        "studying.$.review.lastReviewedCardNo": lastReviewedCardNo,
        "studying.$.review.updatedAt": new Date(),
      },
    },
    { new: true }
  );
}

export async function updateUserWeakCards(userId, cardId, flashcardId, action) {
  if (
    !mongoose.Types.ObjectId.isValid(userId) ||
    !mongoose.Types.ObjectId.isValid(cardId) ||
    !mongoose.Types.ObjectId.isValid(flashcardId)
  ) {
    throw new Error("Invalid ObjectId provided");
  }

  const userObjectId = new mongoose.Types.ObjectId(userId);
  const cardObjectId = new mongoose.Types.ObjectId(cardId);
  const flashcardObjectId = new mongoose.Types.ObjectId(flashcardId);

  if (action === "add") {
    // First, ensure the card exists in studying array with review object
    const ensureCardExists = await Users.findOneAndUpdate(
      { _id: userObjectId, "studying.cardId": { $ne: cardObjectId } },
      {
        $push: {
          studying: {
            cardId: cardObjectId,
            review: {
              lastReviewedCardNo: 0,
              weakCards: [],
              updatedAt: new Date(),
            },
            quiz: {},
          },
        },
      },
      { new: true }
    );

    // Now add the weak card if it doesn't already exist
    const result = await Users.findOneAndUpdate(
      {
        _id: userObjectId,
        "studying.cardId": cardObjectId,
        "studying.review.weakCards.flashcardId": { $ne: flashcardObjectId },
      },
      {
        $push: {
          "studying.$.review.weakCards": {
            flashcardId: flashcardObjectId,
            addedAt: new Date(),
            reviewCount: 1,
          },
        },
        $set: { "studying.$.review.updatedAt": new Date() },
      },
      { new: true }
    );

    // If the card already exists in weak cards, update the timestamp and increment review count
    if (!result) {
      await Users.findOneAndUpdate(
        {
          _id: userObjectId,
          "studying.cardId": cardObjectId,
          "studying.review.weakCards.flashcardId": flashcardObjectId,
        },
        {
          $set: {
            "studying.$.review.weakCards.$[weakCard].addedAt": new Date(),
            "studying.$.review.updatedAt": new Date(),
          },
          $inc: { "studying.$.review.weakCards.$[weakCard].reviewCount": 1 },
        },
        {
          arrayFilters: [{ "weakCard.flashcardId": flashcardObjectId }],
          new: true,
        }
      );
    }
  } else if (action === "remove") {
    // Remove the weak card from the array
    await Users.findOneAndUpdate(
      {
        _id: userObjectId,
        "studying.cardId": cardObjectId,
      },
      {
        $pull: {
          "studying.$.review.weakCards": { flashcardId: flashcardObjectId },
        },
        $set: { "studying.$.review.updatedAt": new Date() },
      },
      { new: true }
    );
  }

  return true;
}

// Optimized with aggregation pipeline to avoid Card model queries and client-side filtering
export async function getFocusReviewData(userId, cardId) {
  if (
    !mongoose.Types.ObjectId.isValid(userId) ||
    !mongoose.Types.ObjectId.isValid(cardId)
  ) {
    throw new Error("Invalid ObjectId provided");
  }

  const userObjectId = new mongoose.Types.ObjectId(`${userId}`);
  const cardObjectId = new mongoose.Types.ObjectId(`${cardId}`);

  const result = await Users.aggregate([
    // Match the specific user
    { $match: { _id: userObjectId } },

    // Unwind studying array to work with individual studying entries
    { $unwind: { path: "$studying", preserveNullAndEmptyArrays: true } },

    // Match the specific card
    { $match: { "studying.cardId": cardObjectId } },

    // Lookup card data from cards collection
    {
      $lookup: {
        from: "cards",
        localField: "studying.cardId",
        foreignField: "_id",
        as: "cardDetails",
        pipeline: [
          {
            $project: {
              _id: 1,
              "main-topic": 1,
              "sub-topic": 1,
              category: 1,
              review: 1,
              quizzes: 1,
            },
          },
        ],
      },
    },

    // Unwind card details
    { $unwind: { path: "$cardDetails", preserveNullAndEmptyArrays: true } },

    // Project the final result structure with proper default values
    {
      $project: {
        _id: "$cardDetails._id",
        "main-topic": "$cardDetails.main-topic",
        "sub-topic": "$cardDetails.sub-topic",
        category: "$cardDetails.category",
        reviewLength: {
          $size: { $ifNull: ["$cardDetails.review", []] },
        },
        quizzesLength: {
          $size: { $ifNull: ["$cardDetails.quizzes", []] },
        },
        weakCards: {
          $map: {
            input: { $ifNull: ["$studying.review.weakCards", []] },
            as: "weakCard",
            in: {
              $let: {
                vars: {
                  matchedReview: {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: { $ifNull: ["$cardDetails.review", []] },
                          as: "review",
                          cond: {
                            $eq: ["$$review._id", "$$weakCard.flashcardId"],
                          },
                        },
                      },
                      0,
                    ],
                  },
                },
                in: {
                  $cond: {
                    if: { $ne: ["$$matchedReview", null] },
                    then: {
                      _id: "$$matchedReview._id",
                      question: "$$matchedReview.question",
                      answer: "$$matchedReview.answer",
                      flashcardId: "$$weakCard.flashcardId",
                      addedAt: "$$weakCard.addedAt",
                      reviewCount: "$$weakCard.reviewCount",
                    },
                    else: null,
                  },
                },
              },
            },
          },
        },
      },
    },

    // Filter out null weak cards
    {
      $addFields: {
        weakCards: {
          $filter: {
            input: "$weakCards",
            as: "card",
            cond: { $ne: ["$$card", null] },
          },
        },
      },
    },
  ]);

  // Handle case where no matching user/card combination is found
  if (!result || result.length === 0) {
    // Check if card exists at all
    const cardExists = await Card.findById(cardObjectId, { _id: 1 }).lean();
    if (!cardExists) {
      return null;
    }

    // Return card data with empty weak cards if user hasn't studied this card
    const cardData = await Card.findById(cardObjectId, {
      _id: 1,
      "main-topic": 1,
      "sub-topic": 1,
      category: 1,
      review: 1,
      quizzes: 1,
    }).lean();

    return {
      _id: cardData._id,
      "main-topic": cardData["main-topic"],
      "sub-topic": cardData["sub-topic"],
      category: cardData.category,
      reviewLength: cardData.review ? cardData.review.length : 0,
      quizzesLength: cardData.quizzes ? cardData.quizzes.length : 0,
      weakCards: [],
    };
  }

  return result[0];
}

export async function getFocusQuizData(userId, cardId) {
  if (
    !mongoose.Types.ObjectId.isValid(userId) ||
    !mongoose.Types.ObjectId.isValid(cardId)
  ) {
    throw new Error("Invalid ObjectId provided");
  }

  const userObjectId = new mongoose.Types.ObjectId(`${userId}`);
  const cardObjectId = new mongoose.Types.ObjectId(`${cardId}`);

  const result = await Users.aggregate([
    // Match the specific user
    { $match: { _id: userObjectId } },

    // Unwind studying array to work with individual studying entries
    { $unwind: { path: "$studying", preserveNullAndEmptyArrays: true } },

    // Match the specific card
    { $match: { "studying.cardId": cardObjectId } },

    // Lookup card data from cards collection
    {
      $lookup: {
        from: "cards",
        localField: "studying.cardId",
        foreignField: "_id",
        as: "cardDetails",
        pipeline: [
          {
            $project: {
              _id: 1,
              "main-topic": 1,
              "sub-topic": 1,
              category: 1,
              review: 1,
              quizzes: 1,
            },
          },
        ],
      },
    },

    // Unwind card details
    { $unwind: { path: "$cardDetails", preserveNullAndEmptyArrays: true } },

    // Project the final result structure with proper default values
    {
      $project: {
        _id: "$cardDetails._id",
        "main-topic": "$cardDetails.main-topic",
        "sub-topic": "$cardDetails.sub-topic",
        category: "$cardDetails.category",
        reviewLength: {
          $size: { $ifNull: ["$cardDetails.review", []] },
        },
        quizzesLength: {
          $size: { $ifNull: ["$cardDetails.quizzes", []] },
        },
        strugglingQuizzes: {
          $map: {
            input: {
              $filter: {
                input: { $ifNull: ["$studying.quiz.attempts", []] },
                as: "attempt",
                cond: { $eq: ["$$attempt.struggling", true] },
              },
            },
            as: "strugglingAttempt",
            in: {
              $let: {
                vars: {
                  matchedQuiz: {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: { $ifNull: ["$cardDetails.quizzes", []] },
                          as: "quiz",
                          cond: {
                            $eq: ["$$quiz._id", "$$strugglingAttempt.quizId"],
                          },
                        },
                      },
                      0,
                    ],
                  },
                },
                in: {
                  $cond: {
                    if: { $ne: ["$$matchedQuiz", null] },
                    then: {
                      _id: "$$matchedQuiz._id",
                      quizQuestion: "$$matchedQuiz.quizQuestion",
                      quizAnswer: "$$matchedQuiz.quizAnswer",
                      options: { $ifNull: ["$$matchedQuiz.options", []] },
                      minimumOptions: {
                        $ifNull: ["$$matchedQuiz.minimumOptions", 2],
                      },
                      quizId: "$$strugglingAttempt.quizId",
                      addedAt: "$$strugglingAttempt.addedAt",
                    },
                    else: null,
                  },
                },
              },
            },
          },
        },
      },
    },

    // Filter out null struggling quizzes
    {
      $addFields: {
        strugglingQuizzes: {
          $filter: {
            input: "$strugglingQuizzes",
            as: "quiz",
            cond: { $ne: ["$$quiz", null] },
          },
        },
      },
    },
  ]);

  // Handle case where no matching user/card combination is found
  if (!result || result.length === 0) {
    // Check if card exists at all
    const cardExists = await Card.findById(cardObjectId, { _id: 1 }).lean();
    if (!cardExists) {
      return null;
    }

    // Return card data with empty struggling quizzes if user hasn't studied this card
    const cardData = await Card.findById(cardObjectId, {
      _id: 1,
      "main-topic": 1,
      "sub-topic": 1,
      category: 1,
      review: 1,
      quizzes: 1,
    }).lean();

    return {
      _id: cardData._id,
      "main-topic": cardData["main-topic"],
      "sub-topic": cardData["sub-topic"],
      category: cardData.category,
      reviewLength: cardData.review ? cardData.review.length : 0,
      quizzesLength: cardData.quizzes ? cardData.quizzes.length : 0,
      strugglingQuizzes: [],
    };
  }

  return result[0];
}

export async function updateUserQuizProgress(userId, details) {
  const {
    card_id,
    quiz_id,
    correct,
    struggling,
    isFirstQuestion,
    isLastQuestion,
  } = details;

  const firstQuizProgress = {
    timesStarted: 1,
    timesFinished: isLastQuestion ? 1 : 0,
    totalCorrect: correct ? 1 : 0,
    totalIncorrect: correct ? 0 : 1,
    attempts: [
      {
        quizId: quiz_id,
        answerAttempts: 1,
        timesCorrect: correct ? 1 : 0,
        timesIncorrect: correct ? 0 : 1,
        struggling: struggling || false,
      },
    ],
    updatedAt: new Date(),
  };

  // has reviewed before but giving quiz first time
  const initializedUser = await Users.findOneAndUpdate(
    {
      _id: { $eq: userId },
      "studying.cardId": { $eq: card_id },
      "studying.quiz": null,
    },
    { $set: { "studying.$.quiz": firstQuizProgress } },
    { new: true }
  ).lean();

  if (initializedUser) {
    return initializedUser;
  }

  // giving quiz first time and doesn't have reviewed before
  const newCardUser = await Users.findOneAndUpdate(
    { _id: userId, "studying.cardId": { $ne: card_id } },
    {
      $push: {
        studying: { cardId: card_id, review: {}, quiz: firstQuizProgress },
      },
    },
    { new: true }
  ).lean();

  if (newCardUser) {
    return newCardUser;
  }

  // If we reach here, we know quiz progress for this card already exists.
  const updateQuery = {
    $inc: {
      [`studying.$.quiz.${correct ? "totalCorrect" : "totalIncorrect"}`]: 1,
    },
    $set: { "studying.$.quiz.updatedAt": new Date() },
  };

  if (isFirstQuestion) {
    updateQuery.$inc["studying.$.quiz.timesStarted"] = 1;
  }
  if (isLastQuestion) {
    updateQuery.$inc["studying.$.quiz.timesFinished"] = 1;
  }

  const quidIdObject = new mongoose.Types.ObjectId(`${quiz_id}`);

  const result = await Users.updateOne(
    {
      _id: { $eq: userId },
      "studying.cardId": { $eq: card_id },
      "studying.quiz.attempts.quizId": { $eq: quidIdObject },
    },
    {
      ...updateQuery,
      $inc: {
        ...updateQuery.$inc,
        "studying.$.quiz.attempts.$[attempt].answerAttempts": 1,
        [`studying.$.quiz.attempts.$[attempt].${
          correct ? "timesCorrect" : "timesIncorrect"
        }`]: 1,
      },
      $set: {
        ...updateQuery.$set,
        "studying.$.quiz.attempts.$[attempt].struggling": struggling || false,
      },
    },
    { arrayFilters: [{ "attempt.quizId": { $eq: quidIdObject } }] }
  );

  // quiz doesn't exist (probably taking for first time)
  if (result.modifiedCount === 0) {
    return Users.findOneAndUpdate(
      { _id: { $eq: userId }, "studying.cardId": { $eq: card_id } },
      {
        ...updateQuery,
        $push: {
          "studying.$.quiz.attempts": {
            quizId: quiz_id,
            answerAttempts: 1,
            timesCorrect: correct ? 1 : 0,
            timesIncorrect: correct ? 0 : 1,
            struggling: struggling || false,
          },
        },
      },
      { new: true }
    ).lean();
  }

  return Users.findOne({ _id: userId }).lean();
}

export async function resetUserQuizProgress(userId, cardId) {
  if (
    !mongoose.Types.ObjectId.isValid(userId) ||
    !mongoose.Types.ObjectId.isValid(cardId)
  ) {
    throw new Error("Invalid ObjectId provided");
  }

  const userObjectId = new mongoose.Types.ObjectId(userId);
  const cardObjectId = new mongoose.Types.ObjectId(cardId);

  return Users.findOneAndUpdate(
    {
      _id: userObjectId,
      "studying.cardId": cardObjectId,
    },
    {
      $set: {
        "studying.$.quiz": {
          timesStarted: 0,
          timesFinished: 0,
          totalCorrect: 0,
          totalIncorrect: 0,
          attempts: [],
          updatedAt: new Date(),
        },
      },
    },
    { new: true }
  ).lean();
}

export async function updateUserStrugglingQuiz(userId, cardId, quizId, action) {
  if (
    !mongoose.Types.ObjectId.isValid(userId) ||
    !mongoose.Types.ObjectId.isValid(cardId) ||
    !mongoose.Types.ObjectId.isValid(quizId)
  ) {
    throw new Error("Invalid ObjectId provided");
  }

  const userObjectId = new mongoose.Types.ObjectId(userId);
  const cardObjectId = new mongoose.Types.ObjectId(cardId);
  const quizObjectId = new mongoose.Types.ObjectId(quizId);

  if (action === "add") {
    // Mark quiz as struggling (set struggling: true)
    const result = await Users.findOneAndUpdate(
      {
        _id: userObjectId,
        "studying.cardId": cardObjectId,
        "studying.quiz.attempts.quizId": quizObjectId,
      },
      {
        $set: {
          "studying.$.quiz.attempts.$[attempt].struggling": true,
        },
      },
      {
        arrayFilters: [{ "attempt.quizId": quizObjectId }],
        new: true,
      }
    ).lean();

    return result;
  } else if (action === "remove") {
    // Mark quiz as not struggling (set struggling: false)
    const result = await Users.findOneAndUpdate(
      {
        _id: userObjectId,
        "studying.cardId": cardObjectId,
        "studying.quiz.attempts.quizId": quizObjectId,
      },
      {
        $set: {
          "studying.$.quiz.attempts.$[attempt].struggling": false,
        },
      },
      {
        arrayFilters: [{ "attempt.quizId": quizObjectId }],
        new: true,
      }
    ).lean();

    return result;
  }

  throw new Error(`Invalid action: ${action}. Must be 'add' or 'remove'`);
}
