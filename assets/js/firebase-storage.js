import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

window.FIREBASE_STORAGE_CONFIG = window.FIREBASE_STORAGE_CONFIG || {
  apiKey: "AIzaSyDXRq_Wfs2mlvxdLkmh2t3PokZ5n03Vc-I",
  authDomain: "portfolio-web-bd546.firebaseapp.com",
  projectId: "portfolio-web-bd546",
  storageBucket: "portfolio-web-bd546.firebasestorage.app",
  messagingSenderId: "1093729951257",
  appId: "1:1093729951257:web:6f9f5665273c01e2285488",
};

const firebaseConfig = window.FIREBASE_STORAGE_CONFIG;
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

window.firebaseStorageApp = app;
window.firebaseStorage = storage;

window.uploadFileToFirebase = async function uploadFileToFirebase(file, path) {
  if (!file) {
    throw new Error("No file provided.");
  }

  const cleanPath = path || `portfolio-uploads/${Date.now()}_${file.name}`;
  const storageRef = ref(storage, cleanPath);
  const snapshot = await uploadBytes(storageRef, file);
  return getDownloadURL(snapshot.ref);
};

window.getFirebaseStorageUrl = async function getFirebaseStorageUrl(path) {
  if (!path) {
    throw new Error("Storage path is required.");
  }

  return getDownloadURL(ref(storage, path));
};

console.info("Firebase Storage initialized successfully.");
