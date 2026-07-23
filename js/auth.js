import { auth } from "../db/firebase.js";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getUserByEmail, saveUserToDb } from "../db/db.js";

const adminEmails = ['jagannathmani4@gmail.com', 'sahebmani18@gmail.com'];

// --- UI TOGGLE LOGIC ---
const loginContainer = document.getElementById('login-container');
const registerContainer = document.getElementById('register-container');
const adminPortalContainer = document.getElementById('admin-portal-container');

document.getElementById('show-register')?.addEventListener('click', (e) => {
    e.preventDefault();
    loginContainer.classList.add('d-none');
    registerContainer.classList.remove('d-none');
});

document.getElementById('show-login')?.addEventListener('click', (e) => {
    e.preventDefault();
    registerContainer.classList.add('d-none');
    loginContainer.classList.remove('d-none');
});

// --- FIREBASE LOGIN LOGIC ---
document.getElementById('login-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const submitBtn = e.target.querySelector('button');
    
    try {
        submitBtn.innerHTML = 'Signing in...';
        submitBtn.disabled = true;
        
        await signInWithEmailAndPassword(auth, email, password);
        const userDoc = await getUserByEmail(email);
        const isAdmin = userDoc ? userDoc.isAdmin : false;

        localStorage.setItem('luxe_user', JSON.stringify({ email, isAdmin }));
        
        if (isAdmin) {
            loginContainer.classList.add('d-none');
            adminPortalContainer.classList.remove('d-none');
        } else {
            window.location.replace('index.html');
        }
    } catch (error) {
        alert(`Login Failed: Invalid credentials.`);
        submitBtn.innerHTML = 'Sign In';
        submitBtn.disabled = false;
    }
});

// --- FIREBASE REGISTER LOGIC ---
document.getElementById('register-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;

    if (password.length < 6) return alert("Password must be at least 6 characters long.");

    try {
        await createUserWithEmailAndPassword(auth, email, password);
        
        // Check if the registering email is in the admin array
        const isAdmin = adminEmails.includes(email);

        await saveUserToDb({
            email,
            displayName: name,
            isAdmin: isAdmin,
            createdAt: new Date().toISOString()
        });

        alert('Registration successful! You can now log in.');
        document.getElementById('register-form').reset();
        registerContainer.classList.add('d-none');
        loginContainer.classList.remove('d-none');
        
    } catch (error) {
        alert(`Registration Error: ${error.message}`);
    }
});