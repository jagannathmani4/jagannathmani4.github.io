import { getUserOrdersFromDb } from "../db/db.js";

async function loadMyOrders() {
    const user = JSON.parse(localStorage.getItem('luxe_user'));
    const container = document.getElementById('customer-orders-list');

    // Check if user is logged in
    if (!user) {
        container.innerHTML = '<div class="alert alert-warning border-0 shadow-sm p-4 text-center">Please <a href="login.html" class="fw-bold text-dark">log in</a> to view your orders.</div>';
        return;
    }

    try {
        // Fetch orders for this specific user
        const orders = await getUserOrdersFromDb(user.email);
        container.innerHTML = '';

        if (orders.length === 0) {
            container.innerHTML = '<div class="alert alert-secondary border-0 shadow-sm p-4 text-center">You have no previous orders.</div>';
            return;
        }

        // Loop through and display each order
        orders.forEach(order => {
            // FAIL-SAFE: Protect against old test data missing properties
            const date = order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Unknown Date';
            let statusBadge = order.status === 'Confirmed' ? 'bg-success' : (order.status === 'Rejected' ? 'bg-danger' : 'bg-warning text-dark');
            
            // Protect items array
            let itemsArray = order.items || [];
            let itemsHtml = itemsArray.map(i => `<li class="text-muted">${i.name} (x${i.quantity})</li>`).join('');
            if (itemsHtml === '') itemsHtml = '<li class="text-muted">No items recorded (Legacy Order)</li>';
            
            // Protect total value
            let safeTotal = order.total ? parseFloat(order.total).toFixed(2) : '0.00';

            container.innerHTML += `
                <div class="card border-0 shadow-sm p-4 mb-4">
                    <div class="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
                        <span class="fw-bold text-secondary">Order Date: ${date}</span>
                        <span class="badge ${statusBadge} fs-6 px-3 py-2 rounded-pill">${order.status || 'Pending'}</span>
                    </div>
                    
                    <div class="row">
                        <div class="col-md-7">
                            <h6 class="fw-bold mb-2">Items Ordered:</h6>
                            <ul class="mb-3 ps-3">${itemsHtml}</ul>
                        </div>
                        <div class="col-md-5">
                            <h6 class="fw-bold mb-2">Delivery Details:</h6>
                            <p class="small text-muted mb-1" style="word-wrap: break-word;">📍 ${order.deliveryAddress || 'N/A'}</p>
                            <p class="small text-muted mb-1"><strong>PIN Code:</strong> ${order.deliveryPin || 'N/A'}</p>
                            <p class="small text-muted mb-0"><strong>UTR / Ref:</strong> <span class="text-success fw-bold">${order.utrNumber || 'N/A'}</span></p>
                        </div>
                    </div>

                    <div class="border-top pt-3 mt-3 text-end">
                        <span class="fw-bold fs-5">Total Paid: ₹${safeTotal}</span>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        console.error("Error loading customer orders:", error);
        container.innerHTML = '<div class="alert alert-danger border-0 shadow-sm p-4 text-center fw-bold">Error loading your orders. Please check your internet connection.</div>';
    }
}

document.addEventListener('DOMContentLoaded', loadMyOrders);