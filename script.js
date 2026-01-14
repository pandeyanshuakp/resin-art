// Add product to cart function
function addCardToCart(button) {
  const card = button.closest('.product-card');
  if (!card) return;

  const id = card.dataset.id || `prod-${Date.now()}`;
  const name = card.dataset.name || card.querySelector('.product-title')?.innerText || 'Product';
  const basePrice = parseFloat(card.dataset.baseprice) || parseFloat(card.querySelector('.price-value')?.innerText) || 0;

  const variant = card.querySelector('.variant-select')?.value || '';
  const qtyInput = card.querySelector('.qty-input');
  const qty = qtyInput ? Math.max(1, parseInt(qtyInput.value) || 1) : 1;

  const price = basePrice * qty;

  const cartItem = {
    id: id + (variant ? `-${variant}` : ''),
    productId: id,
    name: name,
    variant: variant,
    qty: qty,
    price: price,
    unitPrice: basePrice,
    img: card.querySelector('.product-img')?.src || ''
  };

  // Load existing cart from localStorage
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  // If same product+variant exists, increase qty
  const existingIndex = cart.findIndex(i => i.id === cartItem.id);
  if (existingIndex > -1) {
    cart[existingIndex].qty += cartItem.qty;
    cart[existingIndex].price = cart[existingIndex].unitPrice * cart[existingIndex].qty;
  } else {
    cart.push(cartItem);
  }

  localStorage.setItem('cart', JSON.stringify(cart));

  alert(`${name} (${variant}) — ${qty} added to cart!`);

  // Optional: update cart count on UI
  if (typeof updateCartCount === 'function') updateCartCount();
}

// Optional: Function to display cart count on header
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  let count = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartCountElem = document.getElementById('cart-count');
  if (cartCountElem) cartCountElem.innerText = count;
}
// Update cart count in header
function updateCartCount() {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartCountElem = document.getElementById('cart-count');
  if (cartCountElem) {
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    cartCountElem.innerText = totalQty;
  }
}

// Load cart items and display them
function loadCart() {
  const cartContainer = document.getElementById('cart-container');
  cartContainer.innerHTML = '';

  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  if (cart.length === 0) {
    cartContainer.innerHTML = '<p>Your cart is empty.</p>';
    document.getElementById('cart-total').innerText = '0';
    return;
  }

  let total = 0;

  cart.forEach((item, index) => {
    total += item.price;

    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');
    cartItem.innerHTML = `
      <img src="${item.img}" alt="${item.name}" class="cart-img">
      <div class="cart-info">
        <h4>${item.name} ${item.variant ? '(' + item.variant + ')' : ''}</h4>
        <p>Unit Price: ₹${item.unitPrice}</p>
        <label>Qty:
          <input type="number" class="cart-qty" value="${item.qty}" min="1" data-index="${index}">
        </label>
        <p>Total: ₹<span class="item-total">${item.price}</span></p>
        <button class="remove-btn" data-index="${index}">Remove</button>
      </div>
    `;
    cartContainer.appendChild(cartItem);
  });

  document.getElementById('cart-total').innerText = total;

  attachCartEvents();
}

// Handle quantity changes and item removal
function attachCartEvents() {
  const qtyInputs = document.querySelectorAll('.cart-qty');
  const removeBtns = document.querySelectorAll('.remove-btn');

  qtyInputs.forEach(input => {
    input.addEventListener('change', (e) => {
      const index = e.target.dataset.index;
      let qty = parseInt(e.target.value);
      if (qty < 1) qty = 1;
      e.target.value = qty;

      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      cart[index].qty = qty;
      cart[index].price = cart[index].unitPrice * qty;
      localStorage.setItem('cart', JSON.stringify(cart));
      loadCart();
      updateCartCount();
    });
  });

  removeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = e.target.dataset.index;
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      cart.splice(index, 1);
      localStorage.setItem('cart', JSON.stringify(cart));
      loadCart();
      updateCartCount();
    });
  });
}

// Checkout button functionality
function setupCheckout() {
  const checkoutBtn = document.getElementById('checkout-btn');
  checkoutBtn.addEventListener('click', () => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    alert(`Thank you for your purchase! Total: ₹${total}`);
    localStorage.removeItem('cart');
    loadCart();
    updateCartCount();
  });
}

// Initialize cart page
document.addEventListener('DOMContentLoaded', () => {
  loadCart();
  updateCartCount();
  setupCheckout();
});

// Call updateCartCount on page load
document.addEventListener('DOMContentLoaded', updateCartCount);

// Handle contact form submission
document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.querySelector('.contact-form');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
      alert('Please fill in all fields.');
      return;
    }

    // For now, just show an alert (you can connect it to backend later)
    alert(`Thank you ${name}! Your message has been received.\nWe will contact you at ${email}.`);

    // Clear the form
    contactForm.reset();
  });
});
