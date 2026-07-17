import { getProductsFromDb, deleteProductFromDb } from "../db/db.js";

const user = JSON.parse(localStorage.getItem('luxe_user'));
if (!user || !user.isAdmin) {
    alert("Admins only.");
    window.location.href = 'login.html';
}

document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('luxe_user');
    window.location.href = 'login.html';
});

async function loadAdminProducts() {
    const tbody = document.getElementById('admin-list');
    tbody.innerHTML = '<tr><td colspan="4" class="text-center py-4"><div class="spinner-border text-dark" role="status"></div></td></tr>';
    
    const products = await getProductsFromDb();
    tbody.innerHTML = '';

    products.forEach(product => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><img src="${product.image}" class="rounded shadow-sm" style="width: 50px; height: 50px; object-fit: cover;"></td>
            <td class="fw-bold">${product.name}</td>
            <td class="text-muted">$${product.price}</td>
            <td><button class="btn btn-sm btn-danger fw-bold" onclick="deleteItem('${product.id}')">Delete</button></td>
        `;
        tbody.appendChild(tr);
    });
}

window.deleteItem = async (id) => {
    if(confirm("Delete this product?")) {
        await deleteProductFromDb(id);
        loadAdminProducts();
    }
};

document.addEventListener('DOMContentLoaded', loadAdminProducts);