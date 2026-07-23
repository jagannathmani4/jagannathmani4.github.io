import {
  collection, doc, getDocs, setDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { db } from "./firebase.js";

const usersCollection = collection(db, 'users');
const productsCollection = collection(db, 'products');
const retailersCollection = collection(db, 'retailers');
const ordersCollection = collection(db, 'orders');
const settingsCollection = collection(db, 'settings');

async function fetchCollection(collectionRef, orderField = 'createdAt') {
  const collectionQuery = orderBy(orderField, 'desc');
  const snapshot = await getDocs(query(collectionRef, collectionQuery));
  return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
}

// --- USERS ---
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

// --- PRODUCTS & RETAILERS ---
export async function getProductsFromDb() { return await fetchCollection(productsCollection); }
export async function addProductToDb(product) { await addDoc(productsCollection, { ...product, createdAt: new Date().toISOString() }); }
export async function updateProductInDb(id, updates) { await updateDoc(doc(productsCollection, id), { ...updates, updatedAt: new Date().toISOString() }); }
export async function deleteProductFromDb(id) { await deleteDoc(doc(productsCollection, id)); }

export async function getRetailersFromDb() { return await fetchCollection(retailersCollection); }
export async function addRetailerToDb(retailer) { await addDoc(retailersCollection, { ...retailer, createdAt: new Date().toISOString() }); }
export async function updateRetailerInDb(id, updates) { await updateDoc(doc(retailersCollection, id), { ...updates, updatedAt: new Date().toISOString() }); }
export async function deleteRetailerFromDb(id) { await deleteDoc(doc(retailersCollection, id)); }

// --- ORDERS ---
export async function getOrdersFromDb() { return await fetchCollection(ordersCollection); }
export async function getUserOrdersFromDb(email) {
    const q = query(ordersCollection, where('userEmail', '==', email), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
}
export async function addOrderToDb(order) { await addDoc(ordersCollection, { ...order, status: 'Pending', createdAt: new Date().toISOString() }); }
export async function updateOrderStatusInDb(orderId, status) { await updateDoc(doc(ordersCollection, orderId), { status, updatedAt: new Date().toISOString() }); }

// --- WEB SETTINGS ---
export async function getStoreSettings() {
    const snap = await getDocs(settingsCollection);
    if(snap.empty) {
        return { logoText: 'Luxe.', email: 'support@luxe.com', phone: '+910000000000', address: 'India' };
    }
    return { id: snap.docs[0].id, ...snap.docs[0].data() };
}
export async function saveStoreSettings(data) {
    const snap = await getDocs(settingsCollection);
    if(snap.empty) { await addDoc(settingsCollection, data); } 
    else { await updateDoc(doc(settingsCollection, snap.docs[0].id), data); }
}

// --- DEFAULT DATA SEEDING ---
export const luxeDB = {
  initialProducts: [{ name: 'Oversized Sweater', details: 'Comfortable cotton blend sweater.', price: 2999.00, image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=500&q=80' }],
  initialUsers: [
    { email: 'jagannathmani4@gmail.com', password: 'Jagannath@2005', displayName: 'Jagannath Admin', isAdmin: true, createdAt: new Date().toISOString() },
    { email: 'sahebmani18@gmail.com', password: 'Jagannath@2005', displayName: 'Saheb Admin', isAdmin: true, createdAt: new Date().toISOString() }
  ]
};

export async function seedInitialData() {
  try {
    for (const user of luxeDB.initialUsers) {
        const existing = await getUserByEmail(user.email);
        if(!existing) await saveUserToDb(user);
    }
    const products = await getProductsFromDb();
    if (!products.length) {
      for (const product of luxeDB.initialProducts) await addProductToDb(product);
    }
  } catch (error) { console.error("Database seeding error:", error); }
}