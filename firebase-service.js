import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

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
const usersCollection = collection(db, 'users');
const productsCollection = collection(db, 'products');
const requestsCollection = collection(db, 'productRequests');

async function fetchCollection(collectionRef, orderField = 'createdAt') {
  const collectionQuery = orderBy(orderField, 'desc');
  const snapshot = await getDocs(query(collectionRef, collectionQuery));
  return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
}

export async function getUsersFromDb() {
  return await fetchCollection(usersCollection);
}

export async function getUserByEmail(email) {
  const snapshot = await getDocs(query(usersCollection, where('email', '==', email)));
  if (snapshot.empty) return null;
  const userSnap = snapshot.docs[0];
  return { id: userSnap.id, ...userSnap.data() };
}

export async function saveUserToDb(user) {
  const userRef = doc(usersCollection, user.email);
  await setDoc(userRef, user, { merge: true });
}

export async function updateUserInDb(email, updates) {
  const userRef = doc(usersCollection, email);
  await updateDoc(userRef, updates);
}

export async function getProductsFromDb() {
  return await fetchCollection(productsCollection);
}

export async function addProductToDb(product) {
  await addDoc(productsCollection, {
    ...product,
    createdAt: new Date().toISOString()
  });
}

export async function getProductRequestsFromDb() {
  return await fetchCollection(requestsCollection);
}

export async function addProductRequestToDb(request) {
  await addDoc(requestsCollection, {
    ...request,
    createdAt: new Date().toISOString()
  });
}

export async function updateProductRequestStatus(requestId, status) {
  const requestRef = doc(requestsCollection, requestId);
  await updateDoc(requestRef, {
    status,
    updatedAt: new Date().toISOString()
  });
}

export async function seedInitialData(initialUsers, initialProducts) {
  const users = await getUsersFromDb();
  if (!users.length) {
    for (const user of initialUsers) {
      await saveUserToDb(user);
    }
  }

  const products = await getProductsFromDb();
  if (!products.length) {
    for (const product of initialProducts) {
      await addProductToDb(product);
    }
  }
}
