// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';
import { getStorage } from 'firebase/storage';

// Paste your config from Firebase console
const firebaseConfig = {
  apiKey: "AIzaSyAdVwuEX22IuQ08x4VbgugNOIFG2Q1Lr5c",
  authDomain: "familytree-6efc5.firebaseapp.com",
  projectId: "familytree-6efc5",
  storageBucket: "familytree-6efc5.firebasestorage.app",
  messagingSenderId: "204206322974",
  appId: "1:204206322974:web:527f0b455ba8b8f9fe850f",
  measurementId: "G-SSKYRX0NDQ"
};

const app = initializeApp(firebaseConfig);

// Auth
export const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence);
export const googleProvider = new GoogleAuthProvider();

// Firestore
export const db = getFirestore(app);

// Optional: Cloud Functions and Storage
export const functions = getFunctions(app);
export const storage = getStorage(app);
