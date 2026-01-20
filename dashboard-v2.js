// ============================================
// Dashboard V2 - JavaScript
// ============================================

// Dummy Orders Data
const ordersData = [
  {
    id: 'INV-001',
    name: 'Classic Burger Combo',
    status: 'delivered'
  },
  {
    id: 'INV-002',
    name: 'Crispy Chicken Sandwich',
    status: 'pending'
  },
  {
    id: 'INV-003',
    name: 'Family Feast Box',
    status: 'delivered'
  },
  {
    id: 'INV-004',
    name: 'Veggie Wrap Meal',
    status: 'pending'
  },
  {
    id: 'INV-005',
    name: 'Double Cheese Pizza',
    status: 'cancelled'
  },
  {
    id: 'INV-006',
    name: 'BBQ Wings Bucket',
    status: 'delivered'
  },
  {
    id: 'INV-007',
    name: 'Fish & Chips Special',
    status: 'pending'
  },
  {
    id: 'INV-008',
    name: 'Kids Happy Meal',
    status: 'delivered'
  }
];

// Wallet Cards Data
let walletCards = JSON.parse(localStorage.getItem('walletCards')) || [];

// Status Labels
const statusLabels = {
  delivered: 'Delivered',
  pending: 'In Delivery',
  cancelled: 'Cancelled'
};

// DOM Elements
const sidebarLinks = document.querySelectorAll('.sidebar-link');
const dashboardSections = document.querySelectorAll('.dashboard-section');
const ordersTbody = document.getElementById('orders-tbody');

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', () => {
  // Render orders
  renderOrders();

  // Setup navigation
  setupNavigation();

  // Setup settings form
  setupSettingsForm();

  // Setup payment methods (from payment-methods.js)
  if (typeof setupPaymentMethods === 'function') {
    setupPaymentMethods();
  }
});

// Render Orders Table
function renderOrders() {
  if (!ordersTbody) return;

  ordersTbody.innerHTML = ordersData.map(order => `
    <tr data-order-id="${order.id}">
      <td><strong>${order.id}</strong></td>
      <td>${order.name}</td>
      <td>
        <span class="status-badge ${order.status}">
          ${statusLabels[order.status]}
        </span>
      </td>
      <td>
          <button class="action-btn" onclick="viewOrder('${order.id}')" aria-label="View">
            <svg xmlns="http://www.w3.org/2000/svg" fill="#fff" width="18" height="18" viewBox="0 0 24 24">
              <path d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7zm0 12c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5zm0-8a3 3 0 100 6 3 3 0 000-6z"/>
            </svg>
          </button>
          <button class="action-btn delete" onclick="deleteOrder('${order.id}')" aria-label="Delete">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#f04521" viewBox="0 0 24 24">
            <path d="M3 6h18v2H3V6zm2 3h14l-1.4 12.6c-.1.9-.9 1.4-1.8 1.4H8.2c-.9 0-1.7-.5-1.8-1.4L5 9zm5 2v8h2v-8H10zm4 0v8h2v-8h-2zM9 4V3h6v1h5v2H4V4h5z"/>
          </svg>
        </button>
      </td>
    </tr>
  `).join('');
}

// Setup Navigation
function setupNavigation() {
  sidebarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const sectionId = link.getAttribute('data-section');
      
      // Update active link
      sidebarLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      // Show corresponding section
      dashboardSections.forEach(section => {
        section.classList.remove('active');
        if (section.id === sectionId) {
          section.classList.add('active');
        }
      });
    });
  });
}

// Setup Settings Form
function setupSettingsForm() {
  const form = document.querySelector('.settings-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form values
    const settings = {
      restaurantName: document.getElementById('restaurant-name').value,
      contactEmail: document.getElementById('contact-email').value,
      phoneNumber: document.getElementById('phone-number').value,
      address: document.getElementById('address').value,
      openingHours: document.getElementById('opening-hours').value
    };

    // Simulate saving
    console.log('Saving settings:', settings);
    showToast('Settings saved successfully!', 'success');
  });
}


// View Order
function viewOrder(orderId) {
  const order = ordersData.find(o => o.id === orderId);
  if (order) {
    window.location.href = 'track-product.html';
  }
}

// Delete Order
function deleteOrder(orderId) {
  const orderIndex = ordersData.findIndex(o => o.id === orderId);
  if (orderIndex > -1) {
    ordersData.splice(orderIndex, 1);
    renderOrders();
    showToast('Order deleted successfully!', 'success');
  }
}

// Show Toast Notification
function showToast(message, type = 'success') {
  // Remove existing toast
  const existingToast = document.querySelector('.toast');
  if (existingToast) {
    existingToast.remove();
  }

  // Create new toast
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  // Show toast
  setTimeout(() => toast.classList.add('show'), 10);

  // Hide toast after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// View Order
function viewOrder(orderId) {
  const order = ordersData.find(o => o.id === orderId);
  if (order) {
    window.location.href = 'track-product.html';
  }
}

// Delete Order
function deleteOrder(orderId) {
  const orderIndex = ordersData.findIndex(o => o.id === orderId);
  if (orderIndex > -1) {
    ordersData.splice(orderIndex, 1);
    renderOrders();
    showToast('Order deleted successfully!', 'success');
  }
}

// Show Toast Notification
function showToast(message, type = 'success') {
  // Remove existing toast
  const existingToast = document.querySelector('.toast');
  if (existingToast) {
    existingToast.remove();
  }

  // Create new toast
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  // Show toast
  setTimeout(() => toast.classList.add('show'), 10);

  // Hide toast after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
