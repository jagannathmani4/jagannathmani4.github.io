import { addOrderToDb } from "../db/db.js";

function loadCart() {
    const cart = JSON.parse(localStorage.getItem('luxe_cart')) || [];
    const container = document.getElementById('cart-items-container');
    const totalEl = document.getElementById('cart-total');
    let total = 0;

    if (cart.length === 0) {
        container.innerHTML = '<h2 class="mb-4">Shopping Cart</h2><div class="alert alert-secondary border-0 shadow-sm p-4">Your cart is empty.</div>';
        totalEl.innerText = '₹0.00';
        document.getElementById('generate-qr-btn').disabled = true;
        return;
    }

    container.innerHTML = '<h2 class="mb-4">Shopping Cart</h2>';
    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        const div = document.createElement('div');
        div.className = 'd-flex align-items-center gap-4 border-0 shadow-sm bg-white p-3 rounded mb-3';
        div.innerHTML = `
            <img src="${item.image}" class="rounded" style="width: 90px; height: 90px; object-fit: cover;">
            <div class="flex-grow-1">
                <h5 class="mb-1 fw-bold">${item.name}</h5>
                <p class="mb-0 text-muted">₹${item.price.toFixed(2)} x ${item.quantity}</p>
            </div>
            <button class="btn btn-sm btn-outline-danger fw-bold px-3 py-2" onclick="removeItem(${index})">Remove</button>
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

// --- Step 1: Validate Location and Generate QR ---
document.getElementById('generate-qr-btn')?.addEventListener('click', () => {
    const cart = JSON.parse(localStorage.getItem('luxe_cart')) || [];
    const user = JSON.parse(localStorage.getItem('luxe_user'));

    if(cart.length === 0) return alert("Add items to cart first!");
    
    if(!user) {
        alert("Please log in to complete your purchase.");
        window.location.href = 'login.html';
        return;
    }

    // Block Admins from ordering
    if(user.isAdmin) {
        alert("Admins are not allowed to place orders.");
        return;
    }

    const addressInput = document.getElementById('delivery-address').value.trim();
    const pinInput = document.getElementById('delivery-pincode').value.trim();
    const msgEl = document.getElementById('location-msg');

    if (addressInput === "" || addressInput.length < 10) {
        msgEl.innerHTML = "❌ Please enter a complete delivery address.";
        msgEl.className = "text-danger fw-bold small mt-2";
        return;
    }

    const pinRegex = /^[1-9][0-9]{5}$/;
    if (!pinRegex.test(pinInput)) {
        msgEl.innerHTML = "❌ Invalid PIN. Must be exactly 6 digits.";
        msgEl.className = "text-danger fw-bold small mt-2";
        return;
    }

    // Calculate Total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Generate UPI URI
    const upiID = "9832551256@ibl";
    const upiName = "Luxe";
    const upiString = `upi://pay?pa=${upiID}&pn=${upiName}&am=${total.toFixed(2)}&cu=INR`;
    
    // Create QR Code Image URL using an API
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiString)}`;
    
    // Update UI
    document.getElementById('pay-amount').innerText = total.toFixed(2);
    document.getElementById('upi-qr-code').src = qrUrl;
    
    // Switch to Payment View
    document.getElementById('checkout-step-1').classList.add('d-none');
    document.getElementById('payment-section').classList.remove('d-none');
});

// --- Cancel Payment ---
document.getElementById('cancel-payment-btn')?.addEventListener('click', () => {
    document.getElementById('payment-section').classList.add('d-none');
    document.getElementById('checkout-step-1').classList.remove('d-none');
});

// --- Step 2: Confirm Order with UTR ---
document.getElementById('confirm-order-btn')?.addEventListener('click', async () => {
    const utrInput = document.getElementById('utr-number').value.trim();
    if(utrInput === "" || utrInput.length < 8) {
        alert("Please enter a valid UTR / Reference Number to confirm your payment.");
        return;
    }

    const cart = JSON.parse(localStorage.getItem('luxe_cart')) || [];
    const user = JSON.parse(localStorage.getItem('luxe_user'));
    const addressInput = document.getElementById('delivery-address').value.trim();
    const pinInput = document.getElementById('delivery-pincode').value.trim();
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const orderData = {
        userEmail: user.email,
        deliveryAddress: addressInput,
        deliveryPin: pinInput,
        utrNumber: utrInput,
        items: cart,
        total: total
    };

    const btn = document.getElementById('confirm-order-btn');
    btn.innerText = "Processing...";
    btn.disabled = true;

    try {
        await addOrderToDb(orderData); 
        alert("Order Placed Successfully! We will verify your UTR shortly.");
        localStorage.removeItem('luxe_cart');
        window.location.href = 'orders.html'; 
    } catch (error) {
        alert("Error placing order. Please try again.");
        btn.innerText = "Done (Place Order)";
        btn.disabled = false;
    }
});

document.addEventListener('DOMContentLoaded', loadCart);