// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyByCN3wuJVmsWYHxQVDuNYHoyNGyVNOHr0",
  authDomain: "recipe-app-52801.firebaseapp.com",
  projectId: "recipe-app-52801",
  storageBucket: "recipe-app-52801.appspot.com",
  messagingSenderId: "965589087414",
  appId: "1:965589087414:web:d21977c1fcc9e6cbfba217",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
