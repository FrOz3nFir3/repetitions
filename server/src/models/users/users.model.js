import Users from "../users/users.mongo.js";
import mongoose from "mongoose";
import crypto from "crypto";
import { escapeRegex } from "../../utils/textNormalization.js";

export async function findUserByEmail(email, projection = {}) {
  return Users.findOne({ email }, projection).lean();
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
    const searchRegex = new RegExp(escapeRegex(search), "i");
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

  const paginatedPipeline = [{ $sort: { "studying.review.updatedAt": -1 } }];

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
    const searchRegex = new RegExp(escapeRegex(search), "i");
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
    return { lastReviewedCardNo: 0 };
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
        lastReviewedCardNo: { $ifNull: ["$studying.lastReviewedCardNo", 0] },
      },
    },
  ]);

  if (result.length > 0) {
    return result[0];
  } else {
    return { lastReviewedCardNo: 0 };
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
    quiz: null,
    review: {
      lastReviewedCardNo: lastReviewedCardNo,
      updatedAt: new Date(),
    },
  };

  const updatedUser = await Users.findOneAndUpdate(
    { _id: userId, "studying.cardId": { $ne: card_id } },
    { $push: { studying: newReviewProgress } },
    { new: true }
  );

  if (updatedUser) {
    return updatedUser;
  }

  return Users.findOneAndUpdate(
    { _id: userId, "studying.cardId": card_id },
    {
      $set: {
        "studying.$.review": {
          lastReviewedCardNo: lastReviewedCardNo,
          updatedAt: new Date(),
        },
      },
    },
    { new: true }
  );
}

export async function updateUserQuizProgress(userId, details) {
  const { card_id, quiz_id, correct, isFirstQuestion, isLastQuestion } =
    details;

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
      },
    ],
    updatedAt: new Date(),
  };

  // has reviewed before but giving quiz first time
  const initializedUser = await Users.findOneAndUpdate(
    { _id: userId, "studying.cardId": card_id, "studying.quiz": null },
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
        studying: { cardId: card_id, review: null, quiz: firstQuizProgress },
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

  const result = await Users.updateOne(
    {
      _id: userId,
      "studying.cardId": card_id,
      "studying.quiz.attempts.quizId": quiz_id,
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
    },
    { arrayFilters: [{ "attempt.quizId": quiz_id }] }
  );

  // quiz doesn't exist (probably taking for first time)
  if (result.modifiedCount === 0) {
    return Users.findOneAndUpdate(
      { _id: userId, "studying.cardId": card_id },
      {
        ...updateQuery,
        $push: {
          "studying.$.quiz.attempts": {
            quizId: quiz_id,
            answerAttempts: 1,
            timesCorrect: correct ? 1 : 0,
            timesIncorrect: correct ? 0 : 1,
          },
        },
      },
      { new: true }
    ).lean();
  }

  return Users.findOne({ _id: userId }).lean();
}
