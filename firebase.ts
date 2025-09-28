// firebase.ts

import { initializeApp } from "firebase/app";
// 1. Import getAuth instead of getAnalytics
import { getAuth } from "firebase/auth"; 

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCJzArn3ZIw0uDI_ShkgOqQsvd4jUQsXzg",
  authDomain: "idsaid-tarneemapp.firebaseapp.com",
  projectId: "idsaid-tarneemapp",
  storageBucket: "idsaid-tarneemapp.firebasestorage.app",
  messagingSenderId: "901909619251",
  appId: "1:901909619251:web:b42c103563a1191cd7b946",
  measurementId: "G-KHJN7ETVRF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// 2. Initialize and EXPORT the auth service. This is the crucial line.
export const auth = getAuth(app);