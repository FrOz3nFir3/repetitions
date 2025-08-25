import { Schema, model } from "mongoose";
import { genSalt, hash } from "bcrypt";

const quizAttemptSchema = new Schema(
  {
    quizId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    answerAttempts: {
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

const reviewSchema = new Schema(
  {
    lastReviewedCardNo: {
      type: Number,
      default: 0,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: false,
  }
);

const quizSchema = new Schema(
  {
    timesStarted: {
      type: Number,
      default: 0,
    },
    timesFinished: {
      type: Number,
      default: 0,
    },
    totalCorrect: {
      type: Number,
      default: 0,
    },
    totalIncorrect: {
      type: Number,
      default: 0,
    },
    attempts: [quizAttemptSchema],
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false, timestamps: true }
);

const studyingSchema = new Schema(
  {
    cardId: {
      type: Schema.Types.ObjectId,
      ref: "Card",
      required: true,
    },
    review: {
      type: reviewSchema,
      default: {},
    },
    quiz: {
      type: quizSchema,
      default: {},
    },
  },
  { _id: false }
);

const UsersSchema = new Schema({
  name: {
    type: String,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
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
