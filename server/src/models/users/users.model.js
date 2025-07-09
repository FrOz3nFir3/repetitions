const Users = require("./users.mongo");

async function findUserByEmail(email) {
  return Users.findOne({ email: { $eq: email } });
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
  if (userId === "null" || userId === "undefined") {
    return [];
  }
  // The aggregation pipeline was missing a return statement.
  return Users.aggregate([
    { $match: { _id: { $eq: userId } } },
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
async function updateUserDetails(details) {
  const { email, card_id, type, flashcard_id, correct } = details;
  const options = { new: true, upsert: true };

  const user = await Users.findOne({ email: { $eq: email } });

  if (!user) {
    console.error("User not found for email:", email);
    return null;
  }

  const cardProgress = user.studying.find(
    (s) => s.card_id && s.card_id.toString() === card_id
  );

  if (type) {
    // This handles general progress updates like 'times-started', 'times-finished', etc.
    if (cardProgress) {
      const incrementField = `studying.$.${type}`;
      return Users.findOneAndUpdate(
        { email: { $eq: email }, "studying.card_id": { $eq: card_id } },
        { $inc: { [incrementField]: 1 } },
        options
      );
    } else {
      const newUserProgress = {
        card_id,
        "times-started": type === "times-started" ? 1 : 0,
        "times-finished": type === "times-finished" ? 1 : 0,
        "total-correct": type === "total-correct" ? 1 : 0,
        "total-incorrect": type === "total-incorrect" ? 1 : 0,
        quizAttempts: [],
      };
      return Users.findOneAndUpdate(
        { email: { $eq: email } },
        { $push: { studying: newUserProgress } },
        options
      );
    }
  } else if (flashcard_id) {
    // This handles specific quiz question attempts using flashcard_id
    if (cardProgress) {
      const attemptIndex = cardProgress.quizAttempts.findIndex(
        (qa) => qa.flashcard_id === flashcard_id
      );

      if (attemptIndex > -1) {
        // If the question has been attempted before, update it
        const update = {
          $inc: {
            [`studying.$.quizAttempts.${attemptIndex}.attempts`]: 1,
          },
        };
        if (correct) {
          update.$inc[
            `studying.$.quizAttempts.${attemptIndex}.timesCorrect`
          ] = 1;
        } else {
          update.$inc[
            `studying.$.quizAttempts.${attemptIndex}.timesIncorrect`
          ] = 1;
        }
        return Users.findOneAndUpdate(
          { email: { $eq: email }, "studying.card_id": { $eq: card_id } },
          update,
          options
        );
      } else {
        // If this is the first attempt for this question, add it
        const newAttempt = {
          flashcard_id,
          attempts: 1,
          timesCorrect: correct ? 1 : 0,
          timesIncorrect: correct ? 0 : 1,
        };
        return Users.findOneAndUpdate(
          { email: { $eq: email }, "studying.card_id": { $eq: card_id } },
          { $push: { "studying.$.quizAttempts": newAttempt } },
          options
        );
      }
    } else {
      // If the user has never studied this card before, create the entry
      const newAttempt = {
        flashcard_id,
        attempts: 1,
        timesCorrect: correct ? 1 : 0,
        timesIncorrect: correct ? 0 : 1,
      };
      const newUserProgress = {
        card_id,
        "times-started": 1,
        "times-finished": 0,
        "total-correct": 0,
        "total-incorrect": 0,
        quizAttempts: [newAttempt],
      };
      return Users.findOneAndUpdate(
        { email: { $eq: email } },
        { $push: { studying: newUserProgress } },
        options
      );
    }
  }
}

module.exports = {
  findUserByEmail,
  createNewUser,
  getUserProgress,
  updateUserDetails,
  getUserById,
};
