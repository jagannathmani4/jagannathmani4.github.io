import { seedInitialData, getProductsFromDb } from "../db/db.js";

async function initApp() {
    // 1. ALWAYS check auth status immediately so the Navbar updates instantly
    checkAuthStatus();
    updateCartCount();

    // 2. Wrap database calls in a try-catch so it doesn't crash the page if it fails
    try {
        await seedInitialData();
        const products = await getProductsFromDb();
        renderProducts(products);
    } catch (error) {
        console.error("Storefront Database Error:", error);
        document.getElementById('product-grid').innerHTML = `
            <div class="col w-100 text-center">
                <div class="alert alert-danger shadow-sm border-0 fw-bold">
                    Could not load products. Please check your Firestore Database Rules.
                </div>
            </div>`;
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
                <img src="${product.image}" class="card-img-top" alt="${product.name}" style="height: 250px; object-fit: cover;">
                <div class="card-body d-flex flex-column text-start">
                    <h5 class="card-title fs-5 fw-bold mb-1">${product.name}</h5>
                    <p class="card-text text-secondary small mb-2" style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                        ${product.details || 'Premium fashion item.'}
                    </p>
                    <p class="card-text text-dark fw-bold fs-5 mb-3">$${product.price}</p>
                    <button class="btn btn-outline-dark mt-auto add-to-cart w-100 fw-bold" 
                        data-id="${product.id}" data-name="${product.name}" data-price="${product.price}" data-img="${product.image}">
                        🛒 Add to Cart
                    </button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });

    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', addToCart);
    });
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
    if (existing) { existing.quantity += 1; } 
    else { cart.push(item); }
    
    localStorage.setItem('luxe_cart', JSON.stringify(cart));
    updateCartCount();
    alert(`${item.name} added to cart!`);
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('luxe_cart')) || [];
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').innerText = count;
}

function checkAuthStatus() {
    const user = JSON.parse(localStorage.getItem('luxe_user'));
    const authLink = document.getElementById('auth-link');
    
    if (user) {
        if (user.isAdmin) {
            authLink.innerText = '⚙️ Admin Panel';
            authLink.href = 'admin.html';
        } else {
            authLink.innerText = '📦 My Orders';
            authLink.href = 'orders.html';
        }
    } else {
        authLink.innerText = '👤 Login';
        authLink.href = 'login.html';
    }
}

document.addEventListener('DOMContentLoaded', initApp);