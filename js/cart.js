function loadCart() {
    const cart = JSON.parse(localStorage.getItem('luxe_cart')) || [];
    const container = document.getElementById('cart-items-container');
    const totalEl = document.getElementById('cart-total');
    let total = 0;

    if (cart.length === 0) {
        container.innerHTML = '<h2 class="mb-4">Shopping Cart</h2><div class="alert alert-secondary">Your cart is empty.</div>';
        totalEl.innerText = '$0.00';
        return;
    }

    container.innerHTML = '<h2 class="mb-4">Shopping Cart</h2>';
    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        const div = document.createElement('div');
        // Bootstrap Flex Layout for Cart Item
        div.className = 'd-flex align-items-center gap-3 border-bottom py-3';
        div.innerHTML = `
            <img src="${item.image}" alt="" class="rounded" style="width: 100px; height: 100px; object-fit: cover;">
            <div class="flex-grow-1">
                <h5 class="mb-1 fw-bold">${item.name}</h5>
                <p class="mb-0 text-muted">$${item.price} x ${item.quantity}</p>
            </div>
            <button class="btn btn-sm btn-outline-danger fw-bold px-3" onclick="removeItem(${index})">Remove</button>
        `;
        container.appendChild(div);
    });

    totalEl.innerText = `$${total.toFixed(2)}`;
}

window.removeItem = (index) => {
    let cart = JSON.parse(localStorage.getItem('luxe_cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('luxe_cart', JSON.stringify(cart));
    loadCart();
};

document.getElementById('checkout-btn').addEventListener('click', () => {
    const cart = JSON.parse(localStorage.getItem('luxe_cart')) || [];
    if(cart.length === 0) return alert("Add items to cart first!");
    
    alert("Payment Successful! Thank you for your order.");
    localStorage.removeItem('luxe_cart');
    window.location.href = 'index.html';
});

document.addEventListener('DOMContentLoaded', loadCart);