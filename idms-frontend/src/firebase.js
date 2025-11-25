// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCkcFqn26OG8j41PkIKr5ZphC1HFjWVIHM",
  authDomain: "idms-chempetro.firebaseapp.com",
  projectId: "idms-chempetro",
  storageBucket: "idms-chempetro.firebasestorage.app",
  messagingSenderId: "905646822522",
  appId: "1:905646822522:web:0cb4c356d4891f0a0857c3",
  measurementId: "G-X9M9MF4SC6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;