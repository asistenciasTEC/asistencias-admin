// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCNTLVNZoL0QUZtKNT10cZUmVMBKrO8k5o",
  authDomain: "asistencias-65cba.firebaseapp.com",
  projectId: "asistencias-65cba",
  storageBucket: "asistencias-65cba.appspot.com",
  messagingSenderId: "482185405982",
  appId: "1:482185405982:web:8d395fea5c1d90a642b00f"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
