const mongoose = require('mongoose');

const  dogSchema = new mongoose.Schema({
  name: { 
    type: String,
    required: true
  },
  age:  {
    type: Number,
    required: true
  }, 
  weight: {
    type: String, 
    required: true
  }, 
  owner: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'People', 
    required: true
  }
});

module.exports = mongoose.model('Dog', dogSchema);

