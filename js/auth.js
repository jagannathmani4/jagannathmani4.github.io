import { auth } from "../db/firebase.js";
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getUserByEmail, saveUserToDb } from "../db/db.js";

// --- UI TOGGLE LOGIC ---
const loginContainer = document.getElementById('login-container');
const registerContainer = document.getElementById('register-container');
const showRegisterBtn = document.getElementById('show-register');
const showLoginBtn = document.getElementById('show-login');

if (showRegisterBtn && showLoginBtn) {
    showRegisterBtn.addEventListener('click', (e) => {
        e.preventDefault();
        loginContainer.classList.add('d-none'); // Hide Login
        registerContainer.classList.remove('d-none'); // Show Register
    });

    showLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        registerContainer.classList.add('d-none'); // Hide Register
        loginContainer.classList.remove('d-none'); // Show Login
    });
}

// --- FIREBASE LOGIN LOGIC ---
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        try {
            console.log("Attempting to log in...");
            await signInWithEmailAndPassword(auth, email, password);
            
            const userDoc = await getUserByEmail(email);
            const isAdmin = userDoc ? userDoc.isAdmin : false;

            localStorage.setItem('luxe_user', JSON.stringify({ email, isAdmin }));
            window.location.replace(isAdmin ? 'admin.html' : 'index.html');
        } catch (error) {
            console.error("Login Error:", error.message);
            alert(`Login Failed: ${error.message}`);
        }
    });
}

// --- FIREBASE REGISTER LOGIC ---
const registerForm = document.getElementById('register-form');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('reg-name').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;

        if (password.length < 6) {
            alert("Password must be at least 6 characters long.");
            return;
        }

        try {
            console.log("Creating user in Firebase Auth...");
            await createUserWithEmailAndPassword(auth, email, password);

            const isAdmin = (email === 'jagannathmani5@gmail.com' || email === 'sahebmani18@gmail.com');

            const userProfile = {
                email,
                displayName: name,
                isAdmin: isAdmin,
                createdAt: new Date().toISOString()
            };
            
            console.log("Saving user profile to database...");
            await saveUserToDb(userProfile);

            alert('Registration successful! You can now log in.');
            
            // Swap UI back to Login form instead of redirecting
            registerForm.reset();
            registerContainer.classList.add('d-none');
            loginContainer.classList.remove('d-none');
            
        } catch (error) {
            console.error("Registration Error:", error);
            alert(`Registration Error: ${error.message}`);
        }
    });
}