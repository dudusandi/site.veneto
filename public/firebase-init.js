// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCBw8ytx3UYQqi9wo0et4WAECeBnSykFOY",
  authDomain: "veneto-cxs.firebaseapp.com",
  projectId: "veneto-cxs",
  storageBucket: "veneto-cxs.firebasestorage.app",
  messagingSenderId: "129924301870",
  appId: "1:129924301870:web:85f5bf977fcf4a9fe04bbf",
  measurementId: "G-J0JLY9D8V6"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and export
export const db = getDatabase(app);

// Initialize Auth and export
export const auth = getAuth(app); 

export const analytics = getAnalytics(app);