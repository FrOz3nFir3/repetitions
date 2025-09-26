import { Schema, model } from "mongoose";

const changeSchema = new Schema(
  {
    field: { type: String, required: true },
    oldValue: { type: Schema.Types.Mixed },
    newValue: { type: Schema.Types.Mixed },
    oldDisplayText: { type: Schema.Types.Mixed },
    newDisplayText: { type: Schema.Types.Mixed },
    cardId: { type: String },
    quizId: { type: String },
    optionId: { type: String },
  },
  { _id: false }
);

const logEntrySchema = new Schema({
  eventType: {
    type: String,
    required: true,
    enum: ["created", "updated", "deleted", "reverted"],
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  summary: {
    type: String,
    required: true,
  },
  changes: [changeSchema],
});

const optionSchema = new Schema({
  value: { type: String, required: true },
});

const quizSchema = new Schema({
  quizQuestion: { type: String, required: true },
  quizAnswer: { type: String, required: true },
  options: { type: [optionSchema], default: [] },
  minimumOptions: { type: Number, default: 2 },
  flashcardId: { type: Schema.Types.ObjectId, required: false },
});

const reviewQueueItemSchema = new Schema({
  changeType: {
    type: String,
    enum: ["edit", "addition", "deletion"],
    required: true,
  },
  field: { type: String, required: true },
  oldValue: { type: Schema.Types.Mixed },
  newValue: { type: Schema.Types.Mixed },
  oldDisplayText: { type: Schema.Types.Mixed },
  newDisplayText: { type: Schema.Types.Mixed },
  targetId: { type: String }, // flashcardId, quizId, optionId
  submittedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  submittedAt: { type: Date, default: Date.now },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  },
  metadata: { type: Schema.Types.Mixed }, // Additional context data
});

const reviewSchema = new Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
});

const cardsSchema = new Schema(
  {
    "main-topic": {
      type: String,
      required: true,
    },
    "sub-topic": {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    review: {
      type: [reviewSchema],
      default: [],
    },
    quizzes: {
      type: [quizSchema],
      default: [],
    },
    description: {
      type: String,
      default: "",
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lastUpdatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reviewers: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
      default: function () { return [this.author]; }
    },
    reviewQueue: {
      type: [reviewQueueItemSchema],
      default: []
    },
    logs: [logEntrySchema],
  },
  { timestamps: true }
);

export default model("Card", cardsSchema);
