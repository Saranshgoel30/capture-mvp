import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Note: We're now using Supabase for auth, but keeping Firebase for other functionality
const firebaseConfig = {
  apiKey: "AIzaSyACyNdHZNM08sScshHa5CrsU6rqYBQX-1Y",
  authDomain: "capture-f42c1.firebaseapp.com",
  projectId: "capture-f42c1",
  storageBucket: "capture-f42c1.firebasestorage.app",
  messagingSenderId: "967089137374",
  appId: "1:967089137374:web:4fd17745334d7147e5444f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
