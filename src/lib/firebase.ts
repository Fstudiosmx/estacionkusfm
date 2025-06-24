// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBcJGvx5WmOimzK9AX8THXKWnFrbbTSqSE",
  authDomain: "estacionkusfm.firebaseapp.com",
  projectId: "estacionkusfm",
  storageBucket: "estacionkusfm.appspot.com",
  messagingSenderId: "186423695774",
  appId: "1:186423695774:web:ef8c3c542762623d455e8f"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
