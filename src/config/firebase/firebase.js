// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCAK56jjnYbhUu61_qVwgY54iEo4X47-dU",
  authDomain: "test3-7fa14.firebaseapp.com",
  projectId: "test3-7fa14",
  storageBucket: "test3-7fa14.appspot.com",
  messagingSenderId: "797258260010",
  appId: "1:797258260010:web:381aa8bf1b141ec8e26d53"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
