import { 
    getProductsFromDb, addProductToDb, updateProductInDb, deleteProductFromDb,
    getRetailersFromDb, addRetailerToDb, updateRetailerInDb, deleteRetailerFromDb,
    getOrdersFromDb, updateOrderStatusInDb, getStoreSettings, saveStoreSettings
} from "../db/db.js";
import { auth } from "../db/firebase.js";
import { signOut } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

// --- SECURITY & LOGOUT ---
const user = JSON.parse(localStorage.getItem('luxe_user'));
if (!user || !user.isAdmin) {
    window.location.replace('login.html');
}

document.getElementById('logout-btn')?.addEventListener('click', async (e) => {
    e.preventDefault();
    await signOut(auth);
    localStorage.removeItem('luxe_user');
    window.location.replace('login.html');
});

// --- NAVIGATION TOGGLE ---
function resetNav() {
    ['nav-products', 'nav-retailers', 'nav-orders', 'nav-settings'].forEach(id => document.getElementById(id).classList.remove('bg-light'));
    ['products-section', 'retailers-section', 'orders-section', 'settings-section'].forEach(id => document.getElementById(id).classList.add('d-none'));
}

document.getElementById('nav-products').addEventListener('click', () => { resetNav(); document.getElementById('products-section').classList.remove('d-none'); document.getElementById('nav-products').classList.add('bg-light'); loadProducts(); });
document.getElementById('nav-retailers').addEventListener('click', () => { resetNav(); document.getElementById('retailers-section').classList.remove('d-none'); document.getElementById('nav-retailers').classList.add('bg-light'); loadRetailers(); });
document.getElementById('nav-orders').addEventListener('click', () => { resetNav(); document.getElementById('orders-section').classList.remove('d-none'); document.getElementById('nav-orders').classList.add('bg-light'); loadOrders(); });
document.getElementById('nav-settings').addEventListener('click', () => { resetNav(); document.getElementById('settings-section').classList.remove('d-none'); document.getElementById('nav-settings').classList.add('bg-light'); loadSettings(); });


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
    tbody.innerHTML = '<tr><td colspan="5" class="text-center py-3">Loading...</td></tr>';
    
    try {
        productList = await getProductsFromDb();
        tbody.innerHTML = '';
        
        if(productList.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted py-3">No products found.</td></tr>';
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
        tbody.innerHTML = '<tr><td colspan="5" class="text-center text-danger py-3">Error loading products.</td></tr>';
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
    tbody.innerHTML = '<tr><td colspan="4" class="text-center py-3">Loading...</td></tr>';
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

// ================= ORDERS LOGIC =================
async function loadOrders() {
    const tbody = document.getElementById('admin-orders-list');
    tbody.innerHTML = '<tr><td colspan="5" class="text-center py-3">Loading...</td></tr>';
    
    try {
        const orders = await getOrdersFromDb();
        tbody.innerHTML = '';
        
        if (orders.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted py-3">No orders found.</td></tr>';
            return;
        }

        orders.forEach(order => {
            let itemsHtml = order.items.map(i => `${i.name} (x${i.quantity})`).join('<br>');
            let statusClass = order.status === 'Pending' ? 'text-warning' : (order.status === 'Confirmed' ? 'text-success' : 'text-danger');
            
            tbody.innerHTML += `
                <tr>
                    <td class="fw-bold">${order.userEmail}</td>
                    <td class="small text-muted">${itemsHtml}</td>
                    <td class="fw-bold">₹${parseFloat(order.total).toFixed(2)}</td>
                    <td class="fw-bold ${statusClass}">${order.status}</td>
                    <td>
                        ${order.status === 'Pending' ? `
                            <button class="btn btn-sm btn-success fw-bold me-1" onclick="changeOrderStatus('${order.id}', 'Confirmed')">Accept</button>
                            <button class="btn btn-sm btn-danger fw-bold" onclick="changeOrderStatus('${order.id}', 'Rejected')">Reject</button>
                        ` : '<span class="text-muted small">Processed</span>'}
                    </td>
                </tr>`;
        });
    } catch(error) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-danger text-center py-3">Failed to load orders.</td></tr>';
    }
}

window.changeOrderStatus = async (id, newStatus) => {
    if(confirm(`Mark this order as ${newStatus}?`)) {
        try {
            await updateOrderStatusInDb(id, newStatus);
            loadOrders(); 
        } catch(e) { alert("Failed to update status."); }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
});