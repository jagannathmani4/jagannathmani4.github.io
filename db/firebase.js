import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyASQNNDlubNqQ_x8GY4ZW7uekgj1L6rUsw",
  authDomain: "e-commerce-webpage-646fa.firebaseapp.com",
  projectId: "e-commerce-webpage-646fa",
  storageBucket: "e-commerce-webpage-646fa.firebasestorage.app",
  messagingSenderId: "188177467211",
  appId: "1:188177467211:web:dd63141d5480c032e0cace"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);