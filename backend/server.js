const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Database Connection ---
const uri = process.env.MONGO_URI;
mongoose.connect(uri);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("✅ MongoDB database connection established successfully");
});

// --- API ROUTES ---
// Import all the different route files
const recordsRouter = require('./routes/records');
const analysisRouter = require('./routes/analysis');
const settingsRouter = require('./routes/settings');
const authRouter = require('./routes/auth'); // Import the new auth router

// Tell the server to use the route files for specific URL paths
app.use('/api/records', recordsRouter);
app.use('/api/analysis', analysisRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/auth', authRouter); // Tell the app to use the auth routes

// --- Start the Server ---
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port: ${PORT}`);
});

