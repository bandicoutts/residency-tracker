const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  country: {
    type: String,
    default: 'UK', // Default to 'UK'
  },
});

module.exports = mongoose.model('User', UserSchema);
