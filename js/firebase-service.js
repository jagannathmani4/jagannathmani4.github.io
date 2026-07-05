// Firestore helper (moved to js/)
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import { getFirestore, collection, getDocs, query, where, addDoc, doc, updateDoc } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';

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
const db = getFirestore(app);

export async function getUsersFromDb() {
  const snap = await getDocs(collection(db, 'users'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getUserByEmail(email) {
  const q = query(collection(db, 'users'), where('email', '==', email));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() };
}

export async function saveUserToDb(user) {
  const ref = await addDoc(collection(db, 'users'), user);
  return { id: ref.id, ...user };
}

export async function updateUserInDb(id, updates) {
  const ref = doc(db, 'users', id);
  await updateDoc(ref, updates);
}

export async function getProductsFromDb() {
  const snap = await getDocs(collection(db, 'products'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function addProductToDb(product) {
  const ref = await addDoc(collection(db, 'products'), product);
  return { id: ref.id, ...product };
}

export async function getProductRequestsFromDb() {
  const snap = await getDocs(collection(db, 'productRequests'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function addProductRequestToDb(req) {
  const ref = await addDoc(collection(db, 'productRequests'), req);
  return { id: ref.id, ...req };
}

export async function updateProductRequestStatus(id, updates) {
  const ref = doc(db, 'productRequests', id);
  await updateDoc(ref, updates);
}

export async function seedInitialData(initialUsers = [], initialProducts = []) {
  // In this environment we avoid seeding automatically to prevent duplicates.
  return { seeded: true };
}
