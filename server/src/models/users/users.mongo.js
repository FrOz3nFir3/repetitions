import { Schema, model } from "mongoose";
import { genSalt, hash } from "bcrypt";

const quizAttemptSchema = new Schema(
  {
    quiz_id: {
      type: Schema.Types.ObjectId,
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
  },
  { _id: false }
);

const studyingSchema = new Schema(
  {
    card_id: {
      type: Schema.Types.ObjectId,
      ref: "Card",
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
  },
  { _id: false }
);

const UsersSchema = new Schema({
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
    const salt = await genSalt(SALT_WORK_FACTOR);
    this.password = await hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

export default model("User", UsersSchema);
