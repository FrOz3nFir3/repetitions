const Users = require("./users.mongo");
const mongoose = require("mongoose");

async function findUserByEmail(email) {
  try {
    const user = Users.findOne({ email });
    return user;
  } catch (e) {
    throw e.message;
  }
}

async function createNewUser(user) {
  try {
    const newUser = new Users(user);
    return await newUser.save();
  } catch (e) {
    throw e.message;
  }
}

// non working code
async function getUserProgress(userId){
  if(userId == "null" || userId == "undefined") return []
  try {
    const user = await Users.aggregate([
      {$match:{_id : userId}},
      {
        $lookup:{
          from:"cards",
          localField:"studying.card_id",
          foreignField:"_id",
          as:"cardName"
        }
      }
    ]).exec();

  } catch (e) {
    throw e.message;
  }
}
async function updateUserDetails(details) {
  const { email, card_id, type } = details;
  let user = await Users.findOne({email, "studying.card_id":card_id});

  if(user){
    let incrementField = `studying.$.${type}`
    // meaning card details already exists
    user = await Users.findOneAndUpdate({email, "studying.card_id":card_id},
      {$inc:{[incrementField]:1}})

  }else{
    // meaning it the first time user is studying the quiz
      let userProgress = {card_id, 'times-started':1, 'times-finished': 0, 'total-correct':0, 'total-incorrect':0}
      if(type == "total-correct"){
        userProgress["total-correct"] += 1;
      }else{
        userProgress["total-incorrect"] += 1;
      }

    user = await Users.findOneAndUpdate({email},
        {$push:{studying: {...userProgress}}}
      )
  }
  return user
}

module.exports = {
  findUserByEmail,
  createNewUser,
  getUserProgress,
  updateUserDetails
};


