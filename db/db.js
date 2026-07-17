import {
  collection, doc, getDocs, setDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { db } from "./firebase.js";

const usersCollection = collection(db, 'users');
const productsCollection = collection(db, 'products');

async function fetchCollection(collectionRef, orderField = 'createdAt') {
  const collectionQuery = orderBy(orderField, 'desc');
  const snapshot = await getDocs(query(collectionRef, collectionQuery));
  return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
}

export async function getUsersFromDb() { return await fetchCollection(usersCollection); }
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

export async function getProductsFromDb() { return await fetchCollection(productsCollection); }
export async function addProductToDb(product) {
  await addDoc(productsCollection, { ...product, createdAt: new Date().toISOString() });
}
export async function deleteProductFromDb(productId) {
  await deleteDoc(doc(productsCollection, productId));
}

// 1. Updated Database Initialization Object
export const luxeDB = {
  initialProducts: [
    { id: '1', name: 'Oversized Sweater', price: 49.99, image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=500&q=80', category: 'Women' },
    { id: '2', name: 'Classic Sneakers', price: 69.99, image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=500&q=80', category: 'Shoes' },
    { id: '3', name: 'Luxury Handbag', price: 89.99, image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&w=500&q=80', category: 'Bags' }
  ],
  initialUsers: [
    { 
      email: 'jagannathmani5@gmail.com', 
      password: 'AdminPassword123!', // <-- Default Password
      displayName: 'Jagannath Admin', 
      isAdmin: true, 
      createdAt: new Date().toISOString() 
    }
  ]
};

// 2. Updated Seeding Logic to ensure your admin always exists
export async function seedInitialData() {
  try {
    // Check if the specific admin account exists, if not, create it
    const adminUser = luxeDB.initialUsers[0];
    const existingAdmin = await getUserByEmail(adminUser.email);
    
    if (!existingAdmin) {
      await saveUserToDb(adminUser);
      console.log("Default admin account created.");
    }

    // Seed products if the products collection is completely empty
    const products = await getProductsFromDb();
    if (!products.length) {
      for (const product of luxeDB.initialProducts) {
        await addProductToDb(product);
      }
      console.log("Default products seeded.");
    }
  } catch (error) {
    console.error("Error seeding initial data:", error);
  }
}