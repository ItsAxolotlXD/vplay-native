import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  updateProfile, 
  onAuthStateChanged,
  type User
} from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  updateDoc, 
  arrayUnion, 
  arrayRemove,
  onSnapshot
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCTWyzo2jC3vMhcyvGPIr4dygvzGf9Qtuc",
  authDomain: "vplay-android.firebaseapp.com",
  projectId: "vplay-android",
  storageBucket: "vplay-android.firebasestorage.app",
  messagingSenderId: "841734875694",
  appId: "1:841734875694:web:eb0859e78b3da269420dbf",
  measurementId: "G-6JFNVWG43Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

let analytics;
try {
  if (typeof window !== "undefined") {
    analytics = getAnalytics(app);
  }
} catch (e) {
  console.warn("Firebase Analytics could not initialize in this framing environment:", e);
}

export const auth = getAuth(app);
export const db = getFirestore(app);

export { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  updateProfile, 
  onAuthStateChanged,
  type User,
  analytics,
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  arrayUnion,
  arrayRemove,
  onSnapshot
};
