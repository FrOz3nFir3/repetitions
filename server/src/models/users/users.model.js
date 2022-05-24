const Users = require("./users.mongo");

async function findUserByEmail(email) {
  try {
    const user = Users.findOne({ email });
    return user;
  } catch (e) {
    throw e;
  }
}

async function createNewUser(user) {
  try {
    const newUser = new Users(user);
    return await newUser.save();
  } catch (e) {
    throw e;
  }
}

module.exports = {
  findUserByEmail,
  createNewUser,
};

async function updateUserDetails(details) {
  const { email, flashCardId } = details;
  const user = await findUserByEmail(email);
}
