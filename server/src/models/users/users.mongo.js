const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const quizAttemptSchema = new mongoose.Schema({
  quiz_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  attempts: {
    type: Number,
    default: 0,
  },
  timesCorrect: {
    type: Number,
    default: 0,
  },
  timesIncorrect: {
    type: Number,
    default: 0,
  },
}, { _id: false });

const studyingSchema = new mongoose.Schema({
  card_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Card',
    required: true,
  },
  "times-started": {
    type: Number,
    default: 0,
  },
  "times-finished": {
    type: Number,
    default: 0,
  },
  "total-correct": {
    type: Number,
    default: 0,
  },
  "total-incorrect": {
    type: Number,
    default: 0,
  },
  quizAttempts: [quizAttemptSchema],
}, { _id: false });

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
  studying: [studyingSchema],
});

const SALT_WORK_FACTOR = 10;

UsersSchema.pre("save", async function save(next) {
  if (!this.isModified("password") || !this.password) return next();

  try {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

module.exports = mongoose.model("User", UsersSchema);
