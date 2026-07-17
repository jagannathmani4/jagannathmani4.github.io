import { auth } from "../db/firebase.js";
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getUserByEmail, saveUserToDb } from "../db/db.js";

const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        try {
            // 1. Authenticate securely with Firebase Auth
            await signInWithEmailAndPassword(auth, email, password);
            
            // 2. Fetch user's role (admin or normal) from Firestore
            const userDoc = await getUserByEmail(email);
            const isAdmin = userDoc ? userDoc.isAdmin : false;

            // 3. Save safe session info to local storage for UI updates
            localStorage.setItem('luxe_user', JSON.stringify({ email, isAdmin }));
            
            // 4. Redirect based on role
            window.location.href = isAdmin ? 'admin.html' : 'index.html';
        } catch (error) {
            console.error("Login Error:", error);
            alert('Login failed: Check your email and password.');
        }
    });
}

const registerForm = document.getElementById('register-form');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            // 1. Create the user securely in Firebase Auth
            await createUserWithEmailAndPassword(auth, email, password);

            // 2. Make your specific email the admin automatically
            const isAdmin = (email === 'jagannathmani5@gmail.com');

            // 3. Save profile data to Firestore
            const userProfile = {
                email,
                displayName: name,
                isAdmin: isAdmin,
                createdAt: new Date().toISOString()
            };
            await saveUserToDb(userProfile);

            alert('Registration successful! Please sign in.');
            window.location.href = 'login.html';
        } catch (error) {
            console.error("Registration Error:", error);
            alert('Registration error: ' + error.message);
        }
    });
}