// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBYwEnSyAiulg-Gx3QV1QyR6JYxx4naEfw",
  authDomain: "tecasistencias-7a664.firebaseapp.com",
  projectId: "tecasistencias-7a664",
  storageBucket: "tecasistencias-7a664.appspot.com",
  messagingSenderId: "614707721976",
  appId: "1:614707721976:web:1f59e3c12fd562d120ad0d"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
