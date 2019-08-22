const mongoose = require('mongoose');

const KidSchema = mongoose.Schema({
  // Create relationship between parent and kids
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'parents'
  },
  name: {
    type: String,
    require: true
  },
  trxns: [
    {
      parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'parents'
      },
      amount: {
        type: Number,
        require: true
      },
      desc: {
        type: String,
        require: true
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('kid', KidSchema);
