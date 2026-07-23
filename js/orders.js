import { getUserOrdersFromDb } from "../db/db.js";

async function loadMyOrders() {
    const user = JSON.parse(localStorage.getItem('luxe_user'));
    const container = document.getElementById('customer-orders-list');

    if (!user) {
        container.innerHTML = '<div class="alert alert-warning border-0 shadow-sm">Please <a href="login.html" class="fw-bold text-dark">log in</a> to view your orders.</div>';
        return;
    }

    try {
        const orders = await getUserOrdersFromDb(user.email);
        container.innerHTML = '';

        if (orders.length === 0) {
            container.innerHTML = '<div class="alert alert-secondary border-0 shadow-sm">You have no previous orders.</div>';
            return;
        }

        orders.forEach(order => {
            const date = new Date(order.createdAt).toLocaleDateString();
            let statusBadge = order.status === 'Confirmed' ? 'bg-success' : (order.status === 'Rejected' ? 'bg-danger' : 'bg-warning text-dark');
            
            let itemsHtml = order.items.map(i => `<li class="text-muted">${i.name} (x${i.quantity})</li>`).join('');

            container.innerHTML += `
                <div class="card border-0 shadow-sm p-4">
                    <div class="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
                        <span class="fw-bold text-secondary">Order Date: ${date}</span>
                        <span class="badge ${statusBadge} fs-6 px-3 py-2 rounded-pill">${order.status}</span>
                    </div>
                    <ul class="mb-3 ps-3">${itemsHtml}</ul>
                    <div class="fw-bold fs-5 text-end">Total: $${order.total.toFixed(2)}</div>
                </div>
            `;
        });
    } catch (error) {
        container.innerHTML = '<div class="alert alert-danger border-0 shadow-sm">Error loading orders. Check your internet connection.</div>';
        console.error(error);
    }
}

document.addEventListener('DOMContentLoaded', loadMyOrders);