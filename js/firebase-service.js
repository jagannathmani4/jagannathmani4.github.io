// Firestore helper (moved to js/)
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import { getFirestore, collection, getDocs, query, where, addDoc, doc, updateDoc } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  reload
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';

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
const auth = getAuth(app);

export async function createFirebaseUserAndSendVerification(email, password) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await sendEmailVerification(credential.user);
  return credential.user;
}

export async function signInWithFirebaseEmail(email, password) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  await reload(credential.user);
  return credential.user;
}

export async function sendFirebaseVerificationEmail(user) {
  await sendEmailVerification(user);
}

export async function signOutFirebaseUser() {
  await signOut(auth);
}

export function getFirebaseAuthErrorMessage(error) {
  const code = error?.code || 'unknown';
  const messages = {
    'auth/operation-not-allowed': 'Enable Email/Password in Firebase Console > Authentication > Sign-in method.',
    'auth/unauthorized-continue-uri': 'Add this website domain in Firebase Console > Authentication > Settings > Authorized domains.',
    'auth/invalid-continue-uri': 'The email verification return URL is invalid. Use the site through localhost or your deployed domain.',
    'auth/email-already-in-use': 'That email is already registered. Please sign in instead.',
    'auth/user-not-found': 'No Firebase Auth account exists for this email.',
    'auth/wrong-password': 'The password is incorrect.',
    'auth/invalid-credential': 'Invalid email or password.',
    'auth/too-many-requests': 'Firebase has temporarily blocked this action after too many attempts. Try again later.',
    'auth/network-request-failed': 'Network request failed. Check your internet connection and Firebase project access.'
  };

  return `${messages[code] || 'Firebase Authentication failed.'} (${code})`;
}

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
