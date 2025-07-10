const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UsersSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  googleId: {
    type: String,
  },
  studying: {
    type: [Object],
    default: [],
  },
});

const SALT_WORK_FACTOR = 10;

UsersSchema.pre("save", async function save(next) {
  // only hash the password if it has been modified (or is new)
  if (!this.isModified("password") || !this.password) return next();

  try {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

// Connects usersSchema with the "users" collection
module.exports = mongoose.model("User", UsersSchema);
