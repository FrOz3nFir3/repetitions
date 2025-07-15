const Users = require("./users.mongo");
const mongoose = require("mongoose");

async function findUserByEmail(email) {
  return Users.findOne({ email: { $eq: email } });
}

async function findUserByGoogleId(googleId) {
  return Users.findOne({ googleId: { $eq: googleId } });
}

async function getUserById(userId) {
  if (userId === "null" || userId === "undefined") {
    return null;
  }
  return Users.findOne({ _id: { $eq: userId } });
}

async function createNewUser(user) {
  const newUser = new Users(user);
  return newUser.save();
}

async function getUserProgress(userId) {
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

async function updateUser(userId, userDetails) {
  return Users.findOneAndUpdate({ _id: { $eq: userId } }, userDetails, {
    new: true,
  });
}

async function updateUserDetails(userId, details) {
  const { card_id, quiz_id, correct, isFirstQuestion, isLastQuestion } =
    details;
  const options = { new: true, upsert: true };

  const user = await Users.findOne({
    _id: { $eq: userId },
    "studying.card_id": { $eq: card_id },
  });

  if (user) {
    const updateQuery = { $inc: {} };
    const cardProgress = user.studying.find(
      (s) => s && s.card_id && s.card_id.toString() === card_id
    );

    const attemptIndex = cardProgress.quizAttempts.findIndex(
      (qa) => qa && qa.quiz_id && qa.quiz_id.toString() === quiz_id
    );

    updateQuery.$inc[
      `studying.$.${correct ? "total-correct" : "total-incorrect"}`
    ] = 1;

    if (isFirstQuestion) {
      updateQuery.$inc[`studying.$.times-started`] = 1;
    }
    if (isLastQuestion) {
      updateQuery.$inc[`studying.$.times-finished`] = 1;
    }

    if (attemptIndex > -1) {
      updateQuery.$inc[`studying.$.quizAttempts.${attemptIndex}.attempts`] = 1;
      updateQuery.$inc[
        `studying.$.quizAttempts.${attemptIndex}.${
          correct ? "timesCorrect" : "timesIncorrect"
        }`
      ] = 1;
    } else {
      updateQuery.$push = {
        "studying.$.quizAttempts": {
          quiz_id,
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
    const newUserProgress = {
      card_id,
      "times-started": 1,
      "times-finished": isLastQuestion ? 1 : 0,
      "total-correct": correct ? 1 : 0,
      "total-incorrect": correct ? 0 : 1,
      quizAttempts: [
        {
          quiz_id,
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
