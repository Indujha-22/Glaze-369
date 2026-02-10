// Firebase Configuration and Initialization
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBCokwvC9TWLft86kp0sr_4B_6c2xRI5FA",
  authDomain: "glaze-369.firebaseapp.com",
  databaseURL: "https://glaze-369-default-rtdb.firebaseio.com",
  projectId: "glaze-369",
  storageBucket: "glaze-369.firebasestorage.app",
  messagingSenderId: "441325943025",
  appId: "1:441325943025:web:017c6c577b0c54e6325150",
  measurementId: "G-QPMN3JT9VB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Realtime Database
export const database = getDatabase(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Configure Google Provider (optional settings)
googleProvider.setCustomParameters({
  prompt: 'select_account' // Forces account selection even if one account is available
});

export default app;
