// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCeRKPgBF_VnGmEZXqp_vSSVQHOYpGgwEQ",
  authDomain: "project-cnw-iuh.firebaseapp.com",
  databaseURL: "https://project-cnw-iuh-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "project-cnw-iuh",
  storageBucket: "project-cnw-iuh.appspot.com",
  messagingSenderId: "251616094724",
  appId: "1:251616094724:web:33fec484376565b0e8a351",
  measurementId: "G-CTBH2F13WT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);