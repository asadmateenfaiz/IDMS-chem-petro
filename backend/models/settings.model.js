const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const settingsSchema = new Schema({
  volumeAlertThreshold: {
    type: Number,
    required: true,
    default: 20000,
  },
  purityWarningThreshold: {
    type: Number,
    required: true,
    default: 99.0,
  },
  theme: {
    type: String,
    required: true,
    enum: ['Light', 'Dark', 'Oceanic', 'Sunset'],
    default: 'Light',
  },
  defaultRegion: {
    type: String,
    required: true,
    default: 'USA (Houston)',
  },
  notificationsEnabled: {
    type: Boolean,
    required: true,
    default: true,
  },
  // --- NEW NOTIFICATION SETTINGS ---
  notifyOnAlert: {
    type: Boolean,
    required: true,
    default: true,
  },
  notifyOnWarning: {
    type: Boolean,
    required: true,
    default: false,
  },
}, {
  timestamps: true,
});

const Setting = mongoose.model('Setting', settingsSchema);

module.exports = Setting;

