const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const recordSchema = new Schema({
  name: { type: String, required: true },
  plant: { type: String, required: true },
  region: { type: String, required: true },
  volume: { type: Number, required: true },
  purity: { type: Number, required: true },
  status: { type: String, required: true },
}, {
  timestamps: true, // This automatically adds createdAt and updatedAt fields
});

const Record = mongoose.model('Record', recordSchema);

module.exports = Record;
