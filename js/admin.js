import { 
    getProductsFromDb, addProductToDb, updateProductInDb, deleteProductFromDb,
    getRetailersFromDb, addRetailerToDb, updateRetailerInDb, deleteRetailerFromDb,
    getOrdersFromDb, updateOrderStatusInDb, getStoreSettings, saveStoreSettings,
    getUserByEmail
} from "../db/db.js";
import { auth } from "../db/firebase.js";
import { signOut } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

// --- SECURITY & ADMIN INFO ---
const user = JSON.parse(localStorage.getItem('luxe_user'));
if (!user || !user.isAdmin) {
    window.location.replace('login.html');
} else {
    getUserByEmail(user.email).then(userData => {
        document.getElementById('admin-user-name').innerText = `👤 ${userData?.displayName || 'Admin'}`;
    });
}

document.getElementById('logout-btn')?.addEventListener('click', async (e) => {
    e.preventDefault();
    await signOut(auth);
    localStorage.removeItem('luxe_user');
    window.location.replace('login.html');
});

// --- DROPDOWN NAVIGATION LOGIC ---
function resetNav() {
    ['products-section', 'retailers-section', 'orders-section', 'settings-section'].forEach(id => {
        document.getElementById(id).classList.add('d-none');
    });
}

document.getElementById('nav-products').addEventListener('click', (e) => { e.preventDefault(); resetNav(); document.getElementById('products-section').classList.remove('d-none'); loadProducts(); });
document.getElementById('nav-retailers').addEventListener('click', (e) => { e.preventDefault(); resetNav(); document.getElementById('retailers-section').classList.remove('d-none'); loadRetailers(); });
document.getElementById('nav-orders').addEventListener('click', (e) => { e.preventDefault(); resetNav(); document.getElementById('orders-section').classList.remove('d-none'); loadOrders(); });
document.getElementById('nav-settings').addEventListener('click', (e) => { e.preventDefault(); resetNav(); document.getElementById('settings-section').classList.remove('d-none'); loadSettings(); });


// ================= WEB SETTINGS LOGIC =================
async function loadSettings() {
    try {
        const settings = await getStoreSettings();
        document.getElementById('set-logo').value = settings.logoText || '';
        document.getElementById('set-email').value = settings.email || '';
        document.getElementById('set-mobile').value = settings.phone || '';
        document.getElementById('set-address').value = settings.address || '';
    } catch(e) { console.error("Error loading settings", e); }
}

document.getElementById('settings-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    btn.innerText = "Saving..."; btn.disabled = true;
    try {
        await saveStoreSettings({
            logoText: document.getElementById('set-logo').value,
            email: document.getElementById('set-email').value,
            phone: document.getElementById('set-mobile').value,
            address: document.getElementById('set-address').value
        });
        alert("Web settings saved successfully!");
    } catch(e) { 
        alert("Error saving settings."); 
    }
    btn.innerText = "Save Settings"; btn.disabled = false;
});

// ================= PRODUCTS LOGIC =================
let productList = [];
async function loadProducts() {
    const tbody = document.getElementById('admin-product-list');
    tbody.innerHTML = '<tr><td colspan="5" class="text-center py-4">Loading...</td></tr>';
    
    try {
        productList = await getProductsFromDb();
        tbody.innerHTML = '';
        
        if(productList.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted py-4">No products found.</td></tr>';
            return;
        }

        productList.forEach(p => {
            tbody.innerHTML += `
                <tr>
                    <td><img src="${p.image}" class="rounded shadow-sm" style="width: 50px; height: 50px; object-fit: cover;"></td>
                    <td class="fw-bold">${p.name}</td>
                    <td class="text-muted small" style="max-width: 200px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${p.details || 'No details'}</td>
                    <td class="text-muted">₹${parseFloat(p.price).toFixed(2)}</td>
                    <td>
                        <button class="btn btn-sm btn-primary fw-bold me-1" onclick="editProduct('${p.id}')">Edit</button>
                        <button class="btn btn-sm btn-danger fw-bold" onclick="deleteProduct('${p.id}')">Delete</button>
                    </td>
                </tr>`;
        });
    } catch(err) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center text-danger py-4">Error loading products.</td></tr>';
    }
}

document.getElementById('show-add-product-btn').addEventListener('click', () => {
    document.getElementById('product-form').reset();
    document.getElementById('p-id').value = ''; 
    document.getElementById('product-form-title').innerText = 'Add New Product';
    document.getElementById('product-form-container').classList.remove('d-none');
});

document.getElementById('cancel-product-btn').addEventListener('click', () => {
    document.getElementById('product-form-container').classList.add('d-none');
});

document.getElementById('product-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const id = document.getElementById('p-id').value;
    
    const data = {
        name: document.getElementById('p-name').value,
        price: parseFloat(document.getElementById('p-price').value),
        image: document.getElementById('p-image').value,
        details: document.getElementById('p-details').value
    };

    try {
        btn.innerText = "Saving...";
        btn.disabled = true;

        if (id && id !== "") {
            await updateProductInDb(id, data);
            alert("Product updated successfully!");
        } else {
            await addProductToDb(data);
            alert("Product added successfully!");
        }

        document.getElementById('product-form-container').classList.add('d-none');
        loadProducts(); 
    } catch (error) {
        alert("Failed to save product. Check database rules.");
    } finally {
        btn.innerText = "Save Product";
        btn.disabled = false;
    }
});

window.editProduct = (id) => {
    const p = productList.find(item => item.id === id);
    if(p) {
        document.getElementById('p-id').value = p.id;
        document.getElementById('p-name').value = p.name;
        document.getElementById('p-price').value = p.price;
        document.getElementById('p-image').value = p.image;
        document.getElementById('p-details').value = p.details || '';
        document.getElementById('product-form-title').innerText = 'Edit Product';
        document.getElementById('product-form-container').classList.remove('d-none');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

window.deleteProduct = async (id) => {
    if (confirm("Are you sure you want to delete this product?")) { 
        try {
            await deleteProductFromDb(id); 
            loadProducts(); 
        } catch(e) { alert("Failed to delete product."); }
    }
};

// ================= RETAILERS LOGIC =================
let retailerList = [];
async function loadRetailers() {
    const tbody = document.getElementById('admin-retailer-list');
    tbody.innerHTML = '<tr><td colspan="4" class="text-center py-4">Loading...</td></tr>';
    retailerList = await getRetailersFromDb();
    tbody.innerHTML = '';
    
    retailerList.forEach(r => {
        tbody.innerHTML += `
            <tr>
                <td class="fw-bold">${r.name}</td>
                <td class="text-muted">${r.contact}</td>
                <td class="text-muted">${r.location}</td>
                <td>
                    <button class="btn btn-sm btn-primary fw-bold me-1" onclick="editRetailer('${r.id}')">Edit</button>
                    <button class="btn btn-sm btn-danger fw-bold" onclick="deleteRetailer('${r.id}')">Delete</button>
                </td>
            </tr>`;
    });
}

document.getElementById('show-add-retailer-btn').addEventListener('click', () => {
    document.getElementById('retailer-form').reset();
    document.getElementById('r-id').value = '';
    document.getElementById('retailer-form-title').innerText = 'Add New Retailer';
    document.getElementById('retailer-form-container').classList.remove('d-none');
});
document.getElementById('cancel-retailer-btn').addEventListener('click', () => {
    document.getElementById('retailer-form-container').classList.add('d-none');
});

document.getElementById('retailer-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('r-id').value;
    const data = {
        name: document.getElementById('r-name').value,
        contact: document.getElementById('r-contact').value,
        location: document.getElementById('r-location').value
    };
    try {
        if (id && id !== "") await updateRetailerInDb(id, data);
        else await addRetailerToDb(data);
        document.getElementById('retailer-form-container').classList.add('d-none');
        loadRetailers();
    } catch(e) { alert("Failed to save retailer."); }
});

window.editRetailer = (id) => {
    const r = retailerList.find(item => item.id === id);
    if(r) {
        document.getElementById('r-id').value = r.id;
        document.getElementById('r-name').value = r.name;
        document.getElementById('r-contact').value = r.contact;
        document.getElementById('r-location').value = r.location;
        document.getElementById('retailer-form-title').innerText = 'Edit Retailer';
        document.getElementById('retailer-form-container').classList.remove('d-none');
    }
};
window.deleteRetailer = async (id) => {
    if (confirm("Delete this retailer?")) { await deleteRetailerFromDb(id); loadRetailers(); }
};

// ================= ORDERS LOGIC (MODAL) =================
let globalOrderList = []; 
let orderDetailsModal = null; 

async function loadOrders() {
    const tbody = document.getElementById('admin-orders-list');
    tbody.innerHTML = '<tr><td colspan="4" class="text-center py-4">Loading...</td></tr>';
    
    try {
        globalOrderList = await getOrdersFromDb();
        tbody.innerHTML = '';
        
        if (globalOrderList.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted py-4">No orders found.</td></tr>';
            return;
        }

        globalOrderList.forEach(order => {
            let productNames = order.items.map(i => `${i.name} (x${i.quantity})`).join(', ');
            if(productNames.length > 40) productNames = productNames.substring(0, 37) + '...';
            
            let statusBadgeClass = order.status === 'Pending' ? 'bg-warning text-dark' : (order.status === 'Confirmed' ? 'bg-success' : 'bg-danger');

            tbody.innerHTML += `
                <tr>
                    <td class="fw-bold">${productNames} <br><span class="badge ${statusBadgeClass} mt-1">${order.status}</span></td>
                    <td class="fw-bold text-primary">${order.deliveryPin || 'N/A'}</td>
                    <td class="fw-bold text-secondary">${order.utrNumber || 'N/A'}</td>
                    <td>
                        <button class="btn btn-sm btn-dark fw-bold" onclick="viewOrderDetails('${order.id}')">View Details</button>
                    </td>
                </tr>`;
        });
    } catch(error) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-danger text-center py-4">Failed to load orders.</td></tr>';
    }
}

window.viewOrderDetails = (orderId) => {
    const order = globalOrderList.find(o => o.id === orderId);
    if(!order) return;

    const modalBody = document.getElementById('order-modal-body');
    const modalFooter = document.getElementById('order-modal-footer');

    let itemsHtml = order.items.map(i => `<li>${i.name} (x${i.quantity}) - ₹${(i.price * i.quantity).toFixed(2)}</li>`).join('');

    modalBody.innerHTML = `
        <div class="mb-3">
            <p class="mb-1 text-muted small">Customer Email:</p>
            <h6 class="fw-bold">${order.userEmail}</h6>
        </div>
        <div class="mb-3">
            <p class="mb-1 text-muted small">Full Delivery Address:</p>
            <h6 class="fw-bold">${order.deliveryAddress || 'N/A'}</h6>
            <span class="badge bg-primary">PIN: ${order.deliveryPin || 'N/A'}</span>
        </div>
        <div class="mb-3">
            <p class="mb-1 text-muted small">Payment UTR Number:</p>
            <h6 class="fw-bold text-success">${order.utrNumber || 'N/A'}</h6>
        </div>
        <hr>
        <div class="mb-3">
            <p class="fw-bold mb-2">Order Items:</p>
            <ul class="text-muted small">${itemsHtml}</ul>
        </div>
        <div class="d-flex justify-content-between align-items-center mt-3">
            <h5 class="fw-bold mb-0">Total:</h5>
            <h5 class="fw-bold text-dark mb-0">₹${parseFloat(order.total).toFixed(2)}</h5>
        </div>
    `;

    if (order.status === 'Pending') {
        modalFooter.innerHTML = `
            <button class="btn btn-danger fw-bold flex-grow-1" onclick="changeOrderStatus('${order.id}', 'Rejected')">Decline</button>
            <button class="btn btn-success fw-bold flex-grow-1" onclick="changeOrderStatus('${order.id}', 'Confirmed')">Confirm Order</button>
        `;
    } else {
        modalFooter.innerHTML = `<span class="text-muted fw-bold w-100 text-center">Order is ${order.status}</span>`;
    }

    if (!orderDetailsModal) {
        orderDetailsModal = new bootstrap.Modal(document.getElementById('orderModal'));
    }
    orderDetailsModal.show();
};

window.changeOrderStatus = async (id, newStatus) => {
    if(confirm(`Are you sure you want to ${newStatus === 'Confirmed' ? 'Confirm' : 'Decline'} this order?`)) {
        try {
            await updateOrderStatusInDb(id, newStatus);
            if (orderDetailsModal) orderDetailsModal.hide(); 
            loadOrders(); 
        } catch(e) { alert("Failed to update status."); }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
});