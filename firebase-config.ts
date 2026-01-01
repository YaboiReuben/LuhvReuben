
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Replace these with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "luhvreuben-portfolio.firebaseapp.com",
  projectId: "luhvreuben-portfolio",
  storageBucket: "luhvreuben-portfolio.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
