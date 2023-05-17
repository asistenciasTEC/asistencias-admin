 // Import the functions you need from the SDKs you need
 import { initializeApp } from "firebase/app";
 import { getFirestore } from "firebase/firestore";
 import {getAuth} from "firebase/auth";
 // TODO: Add SDKs for Firebase products that you want to use
 // https://firebase.google.com/docs/web/setup#available-libraries
 
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAob237DEjFS2alY2-dGY-tW3qzWraX_mE",
  authDomain: "test2-56949.firebaseapp.com",
  projectId: "test2-56949",
  storageBucket: "test2-56949.appspot.com",
  messagingSenderId: "237618785375",
  appId: "1:237618785375:web:0fc92780e2bb3fc4ec3fea"
};

 // Initialize Firebase
  const firebaseApp = initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
