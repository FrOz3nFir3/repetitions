const mongoose = require('mongoose');

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
  }
});

// Connects planetSchema with the "planets" collection
module.exports = mongoose.model('Card', cardsSchema);