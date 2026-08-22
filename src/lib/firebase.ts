// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCisXoHVcV7wXgSRirG8UpznZvuOU7hsbU",
  authDomain: "flight911-885f1.firebaseapp.com",
  projectId: "flight911-885f1",
  storageBucket: "flight911-885f1.firebasestorage.app",
  messagingSenderId: "1058005031809",
  appId: "1:1058005031809:web:c45646d3082ca1efd1e680"
};

// Initialize Firebase (prevent multiple initializations during hot reload in Next.js)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
