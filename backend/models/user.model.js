const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String },
  email: { type: String, required: true, unique: true },
  firebaseUid: { type: String, required: true, unique: true, index: true },
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;