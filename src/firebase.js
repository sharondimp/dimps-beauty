import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAxgI5AQ5ZHQC0-zKAq2wR5b_5qEcB6Vos",
  authDomain: "dimps-beauty.firebaseapp.com",
  projectId: "dimps-beauty",
  storageBucket: "dimps-beauty.firebasestorage.app",
  messagingSenderId: "810264297138",
  appId: "1:810264297138:web:ee06e7d3a5ccaf232d53ab"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
