// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyClpjCvQyjsi5snj0zc-yPosO4LMSO26_k",
  authDomain: "busybuy-c43f3.firebaseapp.com",
  projectId: "busybuy-c43f3",
  storageBucket: "busybuy-c43f3.appspot.com",
  messagingSenderId: "292923612791",
  appId: "1:292923612791:web:78104bd35bd39aeab0b072"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
export {auth ,app ,db};