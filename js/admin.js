import { getProductsFromDb, deleteProductFromDb } from "../db/db.js";
import { auth } from "../db/firebase.js";
import { signOut } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

// 1. Security Check: Ensure only authenticated admins can view this page
const user = JSON.parse(localStorage.getItem('luxe_user'));
if (!user || !user.isAdmin) {
    alert("Access Denied. Admins only.");
    window.location.href = 'login.html';
}

// 2. Secure Logout
document.getElementById('logout-btn').addEventListener('click', async (e) => {
    e.preventDefault();
    try {
        await signOut(auth); // Logs out of Firebase
        localStorage.removeItem('luxe_user'); // Clears local session
        window.location.href = 'login.html';
    } catch (error) {
        console.error("Logout Error", error);
        alert("Failed to log out.");
    }
});

// 3. Load and Display Products in the Table
async function loadAdminProducts() {
    const tbody = document.getElementById('admin-list');
    // Show a loading spinner while fetching data
    tbody.innerHTML = '<tr><td colspan="4" class="text-center py-4"><div class="spinner-border text-dark" role="status"></div></td></tr>';
    
    try {
        const products = await getProductsFromDb();
        tbody.innerHTML = ''; // Clear loading spinner

        if (products.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="text-center py-4 text-muted">No products found in inventory.</td></tr>';
            return;
        }

        products.forEach(product => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><img src="${product.image}" class="rounded shadow-sm" style="width: 50px; height: 50px; object-fit: cover;" alt="${product.name}"></td>
                <td class="fw-bold">${product.name}</td>
                <td class="text-muted">$${product.price}</td>
                <td><button class="btn btn-sm btn-danger fw-bold" onclick="deleteItem('${product.id}')">Delete</button></td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error("Error loading products:", error);
        tbody.innerHTML = '<tr><td colspan="4" class="text-center py-4 text-danger">Failed to load inventory.</td></tr>';
    }
}

// 4. Delete Product Function (Attached to window so HTML onclick can access it)
window.deleteItem = async (id) => {
    if (confirm("Are you sure you want to delete this product?")) {
        try {
            await deleteProductFromDb(id);
            loadAdminProducts(); // Reload the table immediately after deletion
        } catch (error) {
            console.error("Error deleting product:", error);
            alert("Failed to delete product.");
        }
    }
};

// Initialize by loading products when the DOM is ready
document.addEventListener('DOMContentLoaded', loadAdminProducts);