// ============================================
// PAYMENT METHODS FUNCTIONS
// ============================================

// Payment Methods Data
let paymentMethodsData = JSON.parse(localStorage.getItem('paymentMethods')) || [];
let defaultPaymentId = localStorage.getItem('defaultPaymentId');

// Setup Payment Methods
function setupPaymentMethods() {
  const cardNumInput = document.getElementById('payment-card-num');
  const expiryInput = document.getElementById('payment-expiry');
  const cvcInput = document.getElementById('payment-cvc');
  const addBtn = document.getElementById('payment-add-btn');

  if (!cardNumInput || !expiryInput || !cvcInput || !addBtn) return;

  // Format card number
  cardNumInput.addEventListener('input', (e) => {
    e.target.value = formatPaymentCardNumber(e.target.value);
    updatePaymentButtonState();
  });

  // Format expiry
  expiryInput.addEventListener('input', (e) => {
    e.target.value = formatPaymentExpiry(e.target.value);
    updatePaymentButtonState();
  });

  // Validate CVC
  cvcInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4);
    updatePaymentButtonState();
  });

  // Add button
  addBtn.addEventListener('click', addPaymentMethod);

  // Render payment methods
  renderPaymentMethods();
}

// Format Card Number
function formatPaymentCardNumber(value) {
  const cleaned = value.replace(/\s/g, '').replace(/\D/g, '');
  const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
  return formatted.slice(0, 23);
}

// Format Expiry
function formatPaymentExpiry(value) {
  const cleaned = value.replace(/\D/g, '').slice(0, 4);
  if (cleaned.length === 4) {
    return cleaned.slice(0, 2) + ' / ' + cleaned.slice(2);
  } else if (cleaned.length === 3) {
    return cleaned.slice(0, 2) + ' / ' + cleaned.slice(2);
  } else if (cleaned.length === 2) {
    return cleaned;
  }
  return cleaned;
}

// Update Button State
function updatePaymentButtonState() {
  const cardNum = document.getElementById('payment-card-num').value.replace(/\s/g, '');
  const expiry = document.getElementById('payment-expiry').value;
  const cvc = document.getElementById('payment-cvc').value;
  const addBtn = document.getElementById('payment-add-btn');

  const isValid = 
    cardNum.length >= 13 &&
    /^\d{2} \/ \d{2}$/.test(expiry) &&
    (cvc.length === 3 || cvc.length === 4);

  addBtn.disabled = !isValid;
}

// Add Payment Method
function addPaymentMethod() {
  const cardNumInput = document.getElementById('payment-card-num');
  const expiryInput = document.getElementById('payment-expiry');
  const cvcInput = document.getElementById('payment-cvc');

  const cardNum = cardNumInput.value.trim();
  const expiry = expiryInput.value.trim();
  const cvc = cvcInput.value.trim();

  const cleanCard = cardNum.replace(/\s/g, '');

  // Validate
  if (!cleanCard.match(/^\d{13,19}$/)) {
    showToast('Invalid card number', 'error');
    return;
  }

  if (!expiry.match(/^\d{2} \/ \d{2}$/)) {
    showToast('Invalid expiry date format', 'error');
    return;
  }

  const month = parseInt(expiry.split(' / ')[0]);
  if (month < 1 || month > 12) {
    showToast('Invalid month', 'error');
    return;
  }

  if (!cvc.match(/^\d{3,4}$/)) {
    showToast('Invalid CVC', 'error');
    return;
  }

  // Check duplicate
  const lastFour = cleanCard.slice(-4);
  if (paymentMethodsData.some(p => p.number.slice(-4) === lastFour)) {
    showToast('Card already saved', 'error');
    return;
  }

  // Save
  const newPayment = {
    id: Date.now(),
    number: cleanCard,
    expiry: expiry,
    cvc: cvc,
    type: detectPaymentCardType(cleanCard),
    isDefault: paymentMethodsData.length === 0
  };

  if (newPayment.isDefault) {
    defaultPaymentId = newPayment.id;
    localStorage.setItem('defaultPaymentId', defaultPaymentId);
  }

  paymentMethodsData.push(newPayment);
  localStorage.setItem('paymentMethods', JSON.stringify(paymentMethodsData));

  // Clear
  cardNumInput.value = '';
  expiryInput.value = '';
  cvcInput.value = '';
  document.getElementById('payment-add-btn').disabled = true;

  renderPaymentMethods();
  showToast('Payment method added!', 'success');
}

// Detect Card Type
function detectPaymentCardType(cardNum) {
  if (/^4/.test(cardNum)) return 'Visa';
  if (/^5[1-5]/.test(cardNum)) return 'Mastercard';
  if (/^3[47]/.test(cardNum)) return 'Amex';
  if (/^6(?:011|5)/.test(cardNum)) return 'Discover';
  return 'Card';
}

// Render Payment Methods
function renderPaymentMethods() {
  const cardsList = document.getElementById('payment-cards-list');
  const emptyState = document.getElementById('payment-empty-state');

  if (paymentMethodsData.length === 0) {
    cardsList.innerHTML = '';
    emptyState.style.display = 'block';
    return;
  }

  emptyState.style.display = 'none';

  cardsList.innerHTML = paymentMethodsData.map(payment => {
    const lastFour = payment.number.slice(-4);
    const isDefault = payment.id === defaultPaymentId;

    return `
      <div class="payment-card-item">
        <div class="payment-card-badge">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
            <line x1="1" y1="10" x2="23" y2="10"></line>
          </svg>
        </div>
        
        <div class="payment-card-info">
          <div class="payment-card-number">•••• •••• •••• ${lastFour}</div>
          <div class="payment-card-type">${payment.type}</div>
        </div>
        
        <div class="payment-card-actions">
          ${isDefault ? 
            `<span class="payment-default-label">Default</span>` : 
            `<a class="payment-set-default" onclick="setPaymentDefault(${payment.id})">Set as default</a>`
          }
          <button class="payment-delete-card" onclick="deletePaymentMethod(${payment.id})" title="Delete">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// Set Default Payment
function setPaymentDefault(paymentId) {
  paymentMethodsData.forEach(p => p.isDefault = false);
  const payment = paymentMethodsData.find(p => p.id === paymentId);
  if (payment) {
    payment.isDefault = true;
    defaultPaymentId = paymentId;
    localStorage.setItem('defaultPaymentId', defaultPaymentId);
    localStorage.setItem('paymentMethods', JSON.stringify(paymentMethodsData));
    renderPaymentMethods();
    showToast('Default payment updated!', 'success');
  }
}

// Delete Payment Method
function deletePaymentMethod(paymentId) {
  if (!confirm('Delete this payment method?')) return;

  const index = paymentMethodsData.findIndex(p => p.id === paymentId);
  if (index > -1) {
    const deleted = paymentMethodsData[index];
    paymentMethodsData.splice(index, 1);

    if (deleted.isDefault && paymentMethodsData.length > 0) {
      paymentMethodsData[0].isDefault = true;
      defaultPaymentId = paymentMethodsData[0].id;
      localStorage.setItem('defaultPaymentId', defaultPaymentId);
    }

    localStorage.setItem('paymentMethods', JSON.stringify(paymentMethodsData));
    renderPaymentMethods();
    showToast('Payment method deleted!', 'success');
  }
}
