const mongoose = require('mongoose');

const peopleSchema = new mongoose.Schema({
  name: {
    type: String
  },
  city: {
    type: String
  },
  state: {
    type: String
  },
  profileImage: {
    type: String
  },
  email: {
    type: String
  }


});

const People = mongoose.model('People', peopleSchema);

module.exports = People;
