const router = require('express').Router();
let Setting = require('../models/settings.model');

// GET route remains the same
router.route('/').get(async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = new Setting();
      await settings.save();
    }
    res.json(settings);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

// POST route is updated to handle new notification fields
router.route('/').post(async (req, res) => {
  try {
    const {
      volumeAlertThreshold, purityWarningThreshold, theme,
      defaultRegion, notificationsEnabled, notifyOnAlert, notifyOnWarning
    } = req.body;

    const updatedSettings = await Setting.findOneAndUpdate({}, {
      volumeAlertThreshold: Number(volumeAlertThreshold),
      purityWarningThreshold: Number(purityWarningThreshold),
      theme, defaultRegion, notificationsEnabled,
      notifyOnAlert, notifyOnWarning, // Add new fields here
    }, { new: true, upsert: true });

    res.json({ message: 'Settings updated successfully!', settings: updatedSettings });
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

module.exports = router;

