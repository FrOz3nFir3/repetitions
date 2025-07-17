const mongoose = require('mongoose');

const changeSchema = new mongoose.Schema({
  field: { type: String, required: true },
  oldValue: { type: mongoose.Schema.Types.Mixed },
  newValue: { type: mongoose.Schema.Types.Mixed },
  cardId: { type: String },
  quizId: { type: String },
  optionId: { type: String },
}, { _id: false });

const logEntrySchema = new mongoose.mongoose.Schema({
  eventType: {
    type: String,
    required: true,
    enum: ['created', 'updated', 'deleted'],
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  summary: {
    type: String,
    required: true,
  },
  changes: [changeSchema],
});

const optionSchema = new mongoose.Schema({
  value: { type: String, required: true },
});

const quizSchema = new mongoose.Schema({
  quizQuestion: { type: String, required: true },
  quizAnswer: { type: String, required: true },
  options: { type: [optionSchema], default: [] },
  minimumOptions: { type: Number, default: 2 },
});

const reviewSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  quizzes: { type: [quizSchema], default: [] },
});

const cardsSchema = new mongoose.Schema({
  "main-topic": {
    type: String,
    required: true,
  },
  "sub-topic": {
    type: String,
    required: true,
  },
  "category": {
    type: String,
    required: true,
  },
  "review":{
    type:[reviewSchema],
    default:[]
  },
  "description":{
    type:String,
    default:""
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  logs: [logEntrySchema],
}, { timestamps: true });

// Connects planetSchema with the "planets" collection
module.exports = mongoose.model('Card', cardsSchema);