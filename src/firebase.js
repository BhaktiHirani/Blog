// Import necessary Firebase modules
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"; // Import Firebase Storage
import {  ref, uploadBytes, getDownloadURL } from "firebase/storage";


// Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyCS3Wg4yysAqMA2rJbU-4Fh5dC1iVOqqiU",
  authDomain: "blog-f57d7.firebaseapp.com",
  databaseURL: "https://blog-f57d7-default-rtdb.firebaseio.com",
  projectId: "blog-f57d7",
  storageBucket: "blog-f57d7.firebasestorage.app",
  messagingSenderId: "345134659628",
  appId: "1:345134659628:web:2c25908bfeda50a2d23989",
  measurementId: "G-DDZ72Y9KPY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Auth
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app); // Initialize storage



// Export Firestore and Auth
export { db, auth, storage };


