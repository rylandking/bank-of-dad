const mongoose = require('mongoose');

const KidSchema = mongoose.Schema({
  // Create relationship between parent and kids
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'parents'
  },
  name: {
    type: String,
    require: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('kid', KidSchema);
