import { addOrderToDb } from "../db/db.js";

function loadCart() {
    const cart = JSON.parse(localStorage.getItem('luxe_cart')) || [];
    const container = document.getElementById('cart-items-container');
    const totalEl = document.getElementById('cart-total');
    let total = 0;

    if (cart.length === 0) {
        container.innerHTML = '<h2 class="mb-4">Shopping Cart</h2><div class="alert alert-secondary border-0">Your cart is empty.</div>';
        totalEl.innerText = '₹0.00';
        return;
    }

    container.innerHTML = '<h2 class="mb-4">Shopping Cart</h2>';
    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        const div = document.createElement('div');
        div.className = 'd-flex align-items-center gap-3 border-bottom py-3';
        div.innerHTML = `
            <img src="${item.image}" class="rounded shadow-sm" style="width: 100px; height: 100px; object-fit: cover;">
            <div class="flex-grow-1">
                <h5 class="mb-1 fw-bold">${item.name}</h5>
                <p class="mb-0 text-muted">₹${item.price.toFixed(2)} x ${item.quantity}</p>
            </div>
            <button class="btn btn-sm btn-outline-danger fw-bold px-3" onclick="removeItem(${index})">Remove</button>
        `;
        container.appendChild(div);
    });

    totalEl.innerText = `₹${total.toFixed(2)}`;
}

window.removeItem = (index) => {
    let cart = JSON.parse(localStorage.getItem('luxe_cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('luxe_cart', JSON.stringify(cart));
    loadCart();
};

document.getElementById('checkout-btn')?.addEventListener('click', async () => {
    const cart = JSON.parse(localStorage.getItem('luxe_cart')) || [];
    const user = JSON.parse(localStorage.getItem('luxe_user'));

    if(cart.length === 0) return alert("Add items to cart first!");
    if(!user) {
        alert("Please log in to complete your purchase.");
        window.location.href = 'login.html';
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // UPI PAYMENT PROMPT
    const paymentMsg = `Total Amount: ₹${total.toFixed(2)}\n\nPlease make the payment to this UPI ID:\n9832551256@ibl\n\nClick 'OK' ONLY AFTER you have completed the payment.`;
    const confirmPayment = confirm(paymentMsg);
    
    if(!confirmPayment) return; 

    const orderData = {
        userEmail: user.email,
        items: cart,
        total: total
    };

    try {
        const btn = document.getElementById('checkout-btn');
        btn.innerText = "Processing Order...";
        btn.disabled = true;
        
        await addOrderToDb(orderData); 
        alert("Payment Confirmed! Your order has been placed.");
        localStorage.removeItem('luxe_cart');
        window.location.href = 'orders.html'; 
    } catch (error) {
        alert("Error placing order. Please try again.");
        btn.innerText = "Proceed to Checkout";
        btn.disabled = false;
    }
});

document.addEventListener('DOMContentLoaded', loadCart);