const mongoose = require('mongoose');

const changeSchema = new mongoose.Schema({
  field: { type: String, required: true },
  oldValue: { type: mongoose.Schema.Types.Mixed },
  newValue: { type: mongoose.Schema.Types.Mixed },
}, { _id: false });

const logEntrySchema = new mongoose.Schema({
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
    type:Array,
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
