import { seedInitialData, getProductsFromDb, getStoreSettings, getUserByEmail } from "../db/db.js";
import { auth } from "../db/firebase.js";
import { signOut } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

async function initApp() {
    checkAuthStatus();
    updateCartCount();

    try {
        // Fetch dynamic settings for the logo
        const settings = await getStoreSettings();
        document.querySelectorAll('.dynamic-logo').forEach(el => {
            el.innerHTML = `${settings.logoText}<span>FASHION</span>`;
        });

        await seedInitialData();
        const products = await getProductsFromDb();
        renderProducts(products);
    } catch (error) {
        document.getElementById('product-grid').innerHTML = `
            <div class="col w-100 text-center"><div class="alert alert-danger shadow-sm border-0 fw-bold">Database connection error. Check rules or internet.</div></div>`;
    }
}

function renderProducts(products) {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = ''; 
    
    if(products.length === 0) {
        grid.innerHTML = '<div class="col w-100 text-center text-muted">No products available at the moment.</div>';
        return;
    }

    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'col';
        card.innerHTML = `
            <div class="card h-100 border-0 shadow-sm">
                <img src="${product.image}" class="card-img-top" style="height: 250px; object-fit: cover;">
                <div class="card-body d-flex flex-column text-start">
                    <h5 class="card-title fs-5 fw-bold mb-1">${product.name}</h5>
                    <p class="card-text text-secondary small mb-2" style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                        ${product.details || 'Premium fashion item.'}
                    </p>
                    <p class="card-text text-dark fw-bold fs-5 mb-3">₹${parseFloat(product.price).toFixed(2)}</p>
                    <button class="btn btn-outline-dark mt-auto add-to-cart w-100 fw-bold" 
                        data-id="${product.id}" data-name="${product.name}" data-price="${product.price}" data-img="${product.image}">
                        🛒 Add to Cart
                    </button>
                </div>
            </div>`;
        grid.appendChild(card);
    });

    document.querySelectorAll('.add-to-cart').forEach(btn => btn.addEventListener('click', addToCart));
}

function addToCart(e) {
    const item = {
        id: e.target.dataset.id, 
        name: e.target.dataset.name,
        price: parseFloat(e.target.dataset.price), 
        image: e.target.dataset.img, 
        quantity: 1
    };
    
    let cart = JSON.parse(localStorage.getItem('luxe_cart')) || [];
    const existing = cart.find(i => i.id === item.id);
    
    if (existing) { 
        existing.quantity += 1; 
    } else { 
        cart.push(item); 
    }
    
    localStorage.setItem('luxe_cart', JSON.stringify(cart));
    updateCartCount();
    alert(`${item.name} added to cart!`);
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('luxe_cart')) || [];
    document.getElementById('cart-count').innerText = cart.reduce((sum, item) => sum + item.quantity, 0);
}

async function checkAuthStatus() {
    const user = JSON.parse(localStorage.getItem('luxe_user'));
    const authLink = document.getElementById('auth-link');
    const logoutBtn = document.getElementById('store-logout-btn');
    const greeting = document.getElementById('user-greeting');
    
    if (user) {
        if (logoutBtn) logoutBtn.classList.remove('d-none');
        if (greeting) greeting.classList.remove('d-none');
        
        // Fetch User Name to display in the Navbar
        try {
            const userData = await getUserByEmail(user.email);
            if (greeting) greeting.innerText = `Hi, ${userData?.displayName || 'User'}!`;
        } catch(e) {
            console.error("Failed to fetch user name:", e);
        }

        if (user.isAdmin) {
            if (authLink) {
                authLink.innerText = '📦 Inventory';
                authLink.href = 'admin.html';
            }
        } else {
            if (authLink) {
                authLink.innerText = '📦 My Orders';
                authLink.href = 'orders.html';
            }
        }
    } else {
        if (authLink) {
            authLink.innerText = '👤 Login';
            authLink.href = 'login.html';
        }
        if (logoutBtn) logoutBtn.classList.add('d-none');
        if (greeting) greeting.classList.add('d-none');
    }
}

document.getElementById('store-logout-btn')?.addEventListener('click', async (e) => {
    e.preventDefault();
    await signOut(auth);
    localStorage.removeItem('luxe_user');
    window.location.reload();
});

document.addEventListener('DOMContentLoaded', initApp);