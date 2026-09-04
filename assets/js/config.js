/**
 * config.js
 * -----------------------------------------------------------------------
 * Fill in your own Firebase and Supabase project credentials below.
 * Both are safe to expose in client-side code AS LONG AS your Firestore
 * security rules and Supabase bucket policies restrict writes to
 * authenticated admins only (see README.md for the exact rules to use).
 * -----------------------------------------------------------------------
 */

// --- Firebase ------------------------------------------------------------
// Firebase Console -> Project settings -> General -> Your apps -> SDK config
export const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// --- Supabase --------------------------------------------------------------
// Supabase Dashboard -> Project settings -> API
export const supabaseConfig = {
  url: "https://YOUR_PROJECT_REF.supabase.co",
  anonKey: "YOUR_SUPABASE_ANON_KEY",
  bucket: "portfolio-assets" // create this bucket in Supabase Storage
};

// Firestore document that stores all portfolio content
export const FIRESTORE_DOC_PATH = { collection: "portfolio", doc: "main" };

// Emails allowed to sign in to the admin panel (defense-in-depth client-side
// check — the real enforcement must live in your Firestore/Storage rules)
export const ADMIN_ALLOWED_EMAILS = [
  // "mary@example.com"
];
