const admin = require('firebase-admin');
require('dotenv').config();

// Initialize Firebase Admin
// We check if apps are already initialized to prevent "App already exists" errors on hot reload
if (admin.apps.length === 0) {
  admin.initializeApp({
    // We explicitly pass the Project ID from the .env file
    projectId: process.env.FIREBASE_PROJECT_ID
  });
}

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get the token from the header (Bearer <token>)
      token = req.headers.authorization.split(' ')[1];

      // Verify the ID token using Firebase Admin
      const decodedToken = await admin.auth().verifyIdToken(token);
      
      // Attach user info to request object so routes can use it
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
      };

      next();
    } catch (error) {
      console.error('Token verification failed:', error.message);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };