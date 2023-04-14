const mongoose = require('mongoose');

const outletSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  userRole: {
    type: String,
    default: 'user'
  }
});

module.exports = mongoose.model('Outletmanager', outletSchema);





