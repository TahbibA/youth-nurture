// Import necessary Firebase libraries
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Define Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAbZgfgjEQoO1irp2aYMvAQDE4jgWAzDxA",
  authDomain: "youth-support-bd3e1.firebaseapp.com",
  projectId: "youth-support-bd3e1",
  storageBucket: "youth-support-bd3e1.appspot.com",
  messagingSenderId: "658437269510",
  appId: "1:658437269510:web:87fa66e6337ae88efb3b87",
  measurementId: "G-XNGD060G8C",
};

// Initialize Firebase app
export const app = initializeApp(firebaseConfig);

// Get Firebase analytics, firestore, auth, and storage
export const analytics = getAnalytics(app);
export const fireStore = getFirestore();
export const auth = getAuth(app);
export const fireStorage = getStorage();
