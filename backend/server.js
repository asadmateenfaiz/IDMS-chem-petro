// 1. Load environment variables at the very top BEFORE anything else
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { protect } = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 5001;

// --- Debugging Checks ---
if (!process.env.MONGO_URI) {
  console.error("❌ CRITICAL ERROR: MONGO_URI is missing in .env file");
  process.exit(1);
}
if (!process.env.FIREBASE_PROJECT_ID) {
  console.error("⚠️ WARNING: FIREBASE_PROJECT_ID is missing in .env file (Auth may fail)");
}

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Database Connection ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB database connection established successfully"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// --- API ROUTES ---
const recordsRouter = require('./routes/records');
const analysisRouter = require('./routes/analysis');
const settingsRouter = require('./routes/settings');
const authRouter = require('./routes/auth');

// Protected Routes
app.use('/api/records', protect, recordsRouter);
app.use('/api/analysis', protect, analysisRouter);
app.use('/api/settings', protect, settingsRouter);
app.use('/api/auth', authRouter);

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port: ${PORT}`);
});