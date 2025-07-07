const Users = require("./users.mongo");

async function findUserByEmail(email) {
  return Users.findOne({ email: { $eq: email } });
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
 * If the user is studying the card for the first time, it creates a new progress entry.
 * Otherwise, it increments the relevant progress counter.
 * Uses $eq in queries to prevent NoSQL injection.
 */
async function updateUserDetails(details) {
  const { email, card_id, type } = details;
  const options = { new: true }; // Return the updated document

  // Check if the user is already studying this card.
  // Uses $eq to prevent NoSQL injection.
  const user = await Users.findOne({
    email: { $eq: email },
    "studying.card_id": { $eq: card_id },
  });

  if (user) {
    // If the card progress already exists, increment the specified field.
    const incrementField = `studying.$.${type}`;
    return Users.findOneAndUpdate(
      { email: { $eq: email }, "studying.card_id": { $eq: card_id } },
      { $inc: { [incrementField]: 1 } },
      options
    );
  } else {
    // If it's the first time, create a new progress object.
    const userProgress = {
      card_id,
      "times-started": 1,
      "times-finished": 0,
      "total-correct": type === "total-correct" ? 1 : 0,
      "total-incorrect": type === "total-incorrect" ? 1 : 0,
    };

    return Users.findOneAndUpdate(
      { email: { $eq: email } },
      { $push: { studying: userProgress } },
      options
    );
  }
}

module.exports = {
  findUserByEmail,
  createNewUser,
  getUserProgress,
  updateUserDetails,
};
