import { getUserByEmail, saveUserToDb } from "../db/db.js";

const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const user = await getUserByEmail(email);
        
        if (user && user.password === password) {
            localStorage.setItem('luxe_user', JSON.stringify(user));
            window.location.href = user.isAdmin ? 'admin.html' : 'index.html';
        } else {
            alert('Invalid credentials.');
        }
    });
}

const registerForm = document.getElementById('register-form');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        if (await getUserByEmail(email)) return alert('Email exists.');

        const user = {
            email,
            password: document.getElementById('password').value,
            displayName: document.getElementById('name').value,
            isAdmin: false,
            createdAt: new Date().toISOString()
        };
        await saveUserToDb(user);
        alert('Registered! Please login.');
        window.location.href = 'login.html';
    });
}