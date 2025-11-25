const router = require('express').Router();
let User = require('../models/user.model');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/auth/sync
// @desc    Sync Firebase User with MongoDB
// @access  Private (Protected by Firebase Token)
router.post('/sync', protect, async (req, res) => {
  try {
    const { uid, email } = req.user; // From middleware
    const { username } = req.body; // Optional username passed from frontend on signup

    // Upsert: Update if exists, Create if not
    const user = await User.findOneAndUpdate(
      { firebaseUid: uid },
      { 
        email, 
        firebaseUid: uid,
        // Only update username if it's provided in body (e.g. on signup)
        ...(username && { username }) 
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({ 
      message: 'User synced successfully', 
      user 
    });
  } catch (error) {
    console.error('Sync Error:', error);
    res.status(500).json({ message: 'Server Error syncing user' });
  }
});

module.exports = router;