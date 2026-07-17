import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBBzZm9c0xUJl9BcRmC1V79EUSAULztMeY",
  authDomain: "portfolio-db-fb8e8.firebaseapp.com",
  projectId: "portfolio-db-fb8e8",
  storageBucket: "portfolio-db-fb8e8.firebasestorage.app",
  messagingSenderId: "927664452346",
  appId: "1:927664452346:web:783eb1bb9942295db5cf43",
  measurementId: "G-548J2DMEP4"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);