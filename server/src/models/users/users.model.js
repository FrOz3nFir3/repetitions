const Users = require("./users.mongo");
const mongoose = require("mongoose");

async function findUserByEmail(email) {
  return Users.findOne({ email: { $eq: email } });
}

async function findUserByGoogleId(googleId) {
  return Users.findOne({ googleId: { $eq: googleId } });
}

async function getUserById(userId) {
  // Validate userId to prevent unnecessary database queries with invalid data.
  if (userId === "null" || userId === "undefined") {
    return null;
  }
  // Use $eq to prevent NoSQL injection.
  return Users.findOne({ _id: { $eq: userId } });
}

// Creates a new user document.
async function createNewUser(user) {
  const newUser = new Users(user);
  return newUser.save();
}

// Retrieves a user's progress by joining user data with card data.
// Uses $eq to prevent NoSQL injection.
async function getUserProgress(userId) {
  // Validate userId to prevent unnecessary database queries with invalid data.
  if (
    !userId ||
    userId === "null" ||
    userId === "undefined" ||
    !mongoose.Types.ObjectId.isValid(userId)
  ) {
    return [];
  }

  const userObjectId = new mongoose.Types.ObjectId(userId);
  return Users.aggregate([
    { $match: { _id: { $eq: userObjectId } } },
    {
      $lookup: {
        from: "cards",
        localField: "studying.card_id",
        foreignField: "_id",
        as: "cardName",
      },
    },
  ]).exec();
}

/**
 * Updates a user's progress on a specific card.
 * Handles general progress counters and detailed quiz attempt tracking.
 * Uses $eq in queries to prevent NoSQL injection.
 */
async function updateUser(userId, userDetails) {
  return Users.findOneAndUpdate({ _id: { $eq: userId } }, userDetails, {
    new: true,
  });
}

/**
 * Atomically updates a user's progress for a single quiz answer.
 * Handles initial progress creation and all subsequent updates in one operation.
 * Uses $eq in queries to prevent NoSQL injection.
 */
async function updateUserDetails(userId, details) {
  const { card_id, flashcard_id, correct, isFirstQuestion, isLastQuestion } =
    details;
  const options = { new: true, upsert: true };

  // Find the user and the specific card progress in one go.
  const user = await Users.findOne({
    _id: { $eq: userId },
    "studying.card_id": { $eq: card_id },
  });

  if (user) {
    // The user has studied this card before. Update existing progress.
    const updateQuery = { $inc: {} };
    const cardProgress = user.studying.find(
      (s) => s.card_id.toString() === card_id
    );
    const attemptIndex = cardProgress.quizAttempts.findIndex(
      (qa) => qa.flashcard_id === flashcard_id
    );

    // Increment total correct/incorrect
    updateQuery.$inc[
      `studying.$.${correct ? "total-correct" : "total-incorrect"}`
    ] = 1;

    // Increment times-started or times-finished if applicable
    if (isFirstQuestion) {
      updateQuery.$inc[`studying.$.times-started`] = 1;
    }
    if (isLastQuestion) {
      updateQuery.$inc[`studying.$.times-finished`] = 1;
    }

    if (attemptIndex > -1) {
      // This specific question has been attempted before.
      updateQuery.$inc[`studying.$.quizAttempts.${attemptIndex}.attempts`] = 1;
      updateQuery.$inc[
        `studying.$.quizAttempts.${attemptIndex}.${
          correct ? "timesCorrect" : "timesIncorrect"
        }`
      ] = 1;
    } else {
      // First attempt for this specific question.
      updateQuery.$push = {
        "studying.$.quizAttempts": {
          flashcard_id,
          attempts: 1,
          timesCorrect: correct ? 1 : 0,
          timesIncorrect: correct ? 0 : 1,
        },
      };
    }

    return Users.findOneAndUpdate(
      { _id: { $eq: userId }, "studying.card_id": { $eq: card_id } },
      updateQuery,
      options
    );
  } else {
    // First time this user is studying this card deck.
    const newUserProgress = {
      card_id,
      "times-started": 1, // Always 1 on the first go
      "times-finished": isLastQuestion ? 1 : 0, // 1 if it's a single-question quiz
      "total-correct": correct ? 1 : 0,
      "total-incorrect": correct ? 0 : 1,
      quizAttempts: [
        {
          flashcard_id,
          attempts: 1,
          timesCorrect: correct ? 1 : 0,
          timesIncorrect: correct ? 0 : 1,
        },
      ],
    };

    return Users.findOneAndUpdate(
      { _id: { $eq: userId } },
      { $push: { studying: newUserProgress } },
      { ...options, upsert: true }
    );
  }
}

module.exports = {
  findUserByEmail,
  findUserByGoogleId,
  createNewUser,
  getUserProgress,
  updateUserDetails,
  getUserById,
  updateUser,
};
