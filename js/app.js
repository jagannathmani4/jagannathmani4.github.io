import { seedInitialData, getProductsFromDb } from "../db/db.js";

async function initApp() {
    await seedInitialData();
    const products = await getProductsFromDb();
    renderProducts(products);
    updateCartCount();
    checkAuthStatus();
}

function renderProducts(products) {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = ''; 

    products.forEach(product => {
        // Bootstrap Card Structure
        const card = document.createElement('div');
        card.className = 'col';
        card.innerHTML = `
            <div class="card h-100 border-0 shadow-sm">
                <img src="${product.image}" class="card-img-top" alt="${product.name}" style="height: 250px; object-fit: cover;">
                <div class="card-body d-flex flex-column text-start">
                    <h5 class="card-title fs-6 fw-bold mb-1">${product.name}</h5>
                    <p class="card-text text-muted mb-3">$${product.price}</p>
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
    if (user) {
        document.getElementById('auth-link').innerText = '👤 Profile';
        document.getElementById('auth-link').href = user.isAdmin ? 'admin.html' : '#';
    }
}

document.addEventListener('DOMContentLoaded', initApp);