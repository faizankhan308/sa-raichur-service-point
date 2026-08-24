// Service Catalog Database
const SERVICES_DATA = {
  cleaning: {
    title: "Cleaning Services",
    icon: "🧹",
    description: "Professional deep cleaning for home, office, and specialized areas.",
    items: [
      { id: "home-deep", name: "Home Deep Cleaning", price: 1999, originalPrice: 2499, duration: "4-6 hrs", description: "Complete house cleaning including bathrooms, kitchen, bedrooms, hall, and balcony dusting." },
      { id: "office-deep", name: "Office Deep Cleaning", price: 2999, originalPrice: 3999, duration: "5-7 hrs", description: "Deep cleaning of workstations, cabins, reception, floor scrubbing, and sanitization." },
      { id: "commercial-clean", name: "Commercial Cleaning", price: 4999, originalPrice: 5999, duration: "6-8 hrs", description: "Tailored deep cleaning for shops, hotels, clinics, and commercial complexes." },
      { id: "bathroom-deep", name: "Bathroom Deep Cleaning", price: 399, originalPrice: 499, duration: "1 hr", description: "Tiled floor scrubbing, tile stain removal, tap polishing, and toilet deep wash." },
      { id: "sofa-clean", name: "Sofa & Furniture Cleaning", price: 499, originalPrice: 699, duration: "1.5 hrs", description: "Vacuuming, dry shampooing, wet extraction, and stain removal for sofas (per seat pricing available)." },
      { id: "carpet-clean", name: "Carpet Cleaning", price: 599, originalPrice: 799, duration: "1 hr", description: "Machine scrubbing, shampooing, and drying for rugs and carpets." },
      { id: "mattress-clean", name: "Mattress Cleaning", price: 499, originalPrice: 699, duration: "1 hr", description: "Double-sided vacuuming and wet shampooing of mattresses for dust-mite removal." },
      { id: "kitchen-clean", name: "Kitchen Cleaning", price: 999, originalPrice: 1299, duration: "2 hrs", description: "Degreasing tiles, platform cleaning, external cabinet cleaning, and sink scrubbing." },
      { id: "chimney-clean", name: "Kitchen Chimney Cleaning", price: 699, originalPrice: 899, duration: "1.5 hrs", description: "Dismantling filters, deep degreasing using specialized chemicals, reassembly, and testing." },
      { id: "water-tank", name: "Water Tank Cleaning", price: 799, originalPrice: 999, duration: "1.5 hrs", description: "Mechanized dewatering, high-pressure washing, sludge removal, and UV disinfection." },
      { id: "sump-clean", name: "Underground Tank & Sump Cleaning", price: 1199, originalPrice: 1499, duration: "2 hrs", description: "Complete vacuuming, scrubbing, high-pressure washing, and sanitization of underground sumps." }
    ]
  },
  maintenance: {
    title: "Home Maintenance",
    icon: "🔧",
    description: "Expert technicians for AC, plumbing, electrical, carpenter, and pest control services.",
    items: [
      { id: "ac-service", name: "AC Service & Repair", price: 499, originalPrice: 699, duration: "45 mins", description: "Filter cleaning, cooling coil wash, jet pump wash, gas pressure check, and general diagnostics." },
      { id: "plumbing", name: "Plumbing Services", price: 149, originalPrice: 249, duration: "30 mins", description: "Fixing leakages, tap installation, toilet repair, blockages clearance, and pump installations." },
      { id: "electrical", name: "Electrical Services", price: 149, originalPrice: 249, duration: "30 mins", description: "Geyser repair, fan/light fittings, switchboard repair, MCB replacement, and short circuit diagnostic." },
      { id: "carpenter", name: "Carpenter Services", price: 199, originalPrice: 299, duration: "45 mins", description: "Door hinge repair, drawer slide repair, new furniture assembly, and custom wood works." },
      { id: "painting", name: "Painting Services", price: 4999, originalPrice: 5999, duration: "2-3 days", description: "Interior & exterior wall painting, touch-ups, putty application, and wallpaper installations." },
      { id: "pest-control", name: "Pest Control", price: 799, originalPrice: 999, duration: "1 hr", description: "Gel-based treatment for cockroaches, spray treatment for ants/bedbugs, and general sanitization." }
    ]
  },
  others: {
    title: "Other Services",
    icon: "⚡",
    description: "Specialized local services like solar panel cleaning, vehicle wash, shifting, and event decorations.",
    items: [
      { id: "solar-panel", name: "Solar Panel Cleaning", price: 899, originalPrice: 1199, duration: "1 hr", description: "Dust and bird-droppings removal using soft brushes and demineralized water for maximum efficiency." },
      { id: "solar-heater", name: "Solar Water Heater Cleaning", price: 1199, originalPrice: 1599, duration: "1.5 hrs", description: "Descaling vacuum tubes, flushing storage tank, checking air-vent and plumbing joints." },
      { id: "car-wash", name: "Doorstep Car Wash", price: 499, originalPrice: 699, duration: "1 hr", description: "Foam washing, vacuuming interiors, dashboard polishing, and tyre dressing done at your parking space." },
      { id: "bike-wash", name: "Bike Wash", price: 199, originalPrice: 299, duration: "30 mins", description: "Pressure wash, chain cleaning, and chain lubrication at your doorstep." },
      { id: "home-shifting", name: "Home Shifting (Packers & Movers)", price: 3499, originalPrice: 4499, duration: "4-6 hrs", description: "Safe packing, loading, local transportation, unloading, and unpacking services in Raichur." },
      { id: "decoration", name: "Decoration Services", price: 2499, originalPrice: 2999, duration: "2 hrs", description: "Balloon decorations for birthdays, anniversaries, naming ceremonies, and general home events." }
    ]
  }
};

// Global Application State
let cart = {}; // Format: { serviceId: { service, quantity } }
let selectedCategoryKey = null;
let currentView = 'home'; // 'home', 'category', 'admin'
let adminToken = localStorage.getItem('saraichur_admin_token') || null;

// Initialize App
document.addEventListener("DOMContentLoaded", () => {
  renderHomeCategories();
  renderFeaturedServices();
  setupEventListeners();
  checkUrlHash();
});

// Window hash routing listener (e.g. #admin)
window.addEventListener('hashchange', checkUrlHash);

function checkUrlHash() {
  const hash = window.location.hash;
  if (hash === '#admin') {
    showAdminView();
  } else {
    // Return to home if not in admin
    if (currentView === 'admin') {
      showHomeView();
    }
  }
}

// Setup Event Listeners
function setupEventListeners() {
  // Global Search functionality
  const searchInput = document.getElementById("global-search");
  const heroSearchInput = document.getElementById("hero-search");
  
  if (searchInput) searchInput.addEventListener("input", (e) => handleSearch(e.target.value));
  if (heroSearchInput) heroSearchInput.addEventListener("input", (e) => handleSearch(e.target.value));

  // Cart Drawer triggers
  document.getElementById("view-cart-btn").addEventListener("click", openCartDrawer);
  document.getElementById("close-cart-btn").addEventListener("click", closeCartDrawer);
  document.getElementById("cart-overlay").addEventListener("click", closeCartDrawer);

  // Booking Form Submission
  document.getElementById("booking-form").addEventListener("submit", handleBookingSubmit);

  // Category Modal Back Trigger
  document.getElementById("close-category-view").addEventListener("click", showHomeView);
}

// Render homepage service categories
function renderHomeCategories() {
  const container = document.getElementById("categories-grid");
  const quickNav = document.getElementById("quick-categories-nav");
  if (!container) return;

  container.innerHTML = "";
  if (quickNav) quickNav.innerHTML = "";

  Object.entries(SERVICES_DATA).forEach(([key, category]) => {
    // Homepage cards
    const card = document.createElement("div");
    card.className = "category-card";
    card.innerHTML = `
      <div class="category-card-icon">${category.icon}</div>
      <h3>${category.title}</h3>
      <p>${category.description}</p>
      <span class="category-card-link">View Services →</span>
    `;
    card.addEventListener("click", () => showCategoryView(key));
    container.appendChild(card);

    // Quick navigation bubbles in Hero
    if (quickNav) {
      const bubble = document.createElement("div");
      bubble.className = "quick-nav-bubble";
      bubble.innerHTML = `
        <span class="bubble-icon">${category.icon}</span>
        <span class="bubble-title">${category.title.split(' ')[0]}</span>
      `;
      bubble.addEventListener("click", () => showCategoryView(key));
      quickNav.appendChild(bubble);
    }
  });
}

// Render popular / featured services section
function renderFeaturedServices() {
  const container = document.getElementById("featured-grid");
  if (!container) return;

  container.innerHTML = "";
  // Draw top items from all categories
  const featured = [
    { catKey: 'cleaning', item: SERVICES_DATA.cleaning.items[0] }, // Home Deep
    { catKey: 'cleaning', item: SERVICES_DATA.cleaning.items[3] }, // Bathroom Deep
    { catKey: 'maintenance', item: SERVICES_DATA.maintenance.items[0] }, // AC Service
    { catKey: 'others', item: SERVICES_DATA.others.items[2] } // Car Wash
  ];

  featured.forEach(({ catKey, item }) => {
    const discount = Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100);
    const card = document.createElement("div");
    card.className = "featured-card";
    card.innerHTML = `
      <div class="featured-badge">${discount}% OFF</div>
      <div class="featured-card-header">
        <h4>${item.name}</h4>
        <span class="featured-card-category">${SERVICES_DATA[catKey].title}</span>
      </div>
      <p class="featured-card-desc">${item.description}</p>
      <div class="featured-card-footer">
        <div class="featured-price">
          <span class="price-current">₹${item.price}</span>
          <span class="price-original">₹${item.originalPrice}</span>
        </div>
        <div class="card-action-container" id="feat-act-${item.id}">
          <!-- Dynamic Button -->
        </div>
      </div>
    `;
    container.appendChild(card);
    updateServiceButtonState(item, `feat-act-${item.id}`, catKey);
  });
}

// Search functionality
function handleSearch(query) {
  const searchResults = document.getElementById("search-results");
  const suggestionsBox = document.getElementById("search-suggestions");
  
  if (!query.trim()) {
    if (searchResults) searchResults.style.display = "none";
    if (suggestionsBox) suggestionsBox.style.display = "none";
    return;
  }

  // Find matching items
  const matches = [];
  Object.entries(SERVICES_DATA).forEach(([catKey, category]) => {
    category.items.forEach(item => {
      if (item.name.toLowerCase().includes(query.toLowerCase()) || 
          item.description.toLowerCase().includes(query.toLowerCase())) {
        matches.push({ ...item, categoryKey: catKey, categoryTitle: category.title });
      }
    });
  });

  // Render search list popup
  if (suggestionsBox) {
    suggestionsBox.innerHTML = "";
    if (matches.length === 0) {
      suggestionsBox.innerHTML = `<div class="search-no-results">No services found for "${query}"</div>`;
    } else {
      matches.slice(0, 5).forEach(match => {
        const row = document.createElement("div");
        row.className = "search-suggestion-row";
        row.innerHTML = `
          <div>
            <div class="search-match-name">${match.name}</div>
            <div class="search-match-cat">${match.categoryTitle} • ₹${match.price}</div>
          </div>
          <button class="btn btn-sm btn-outline">View</button>
        `;
        row.addEventListener("click", () => {
          suggestionsBox.style.display = "none";
          showCategoryView(match.categoryKey);
          // Highlight/scroll to the item inside the category view after load
          setTimeout(() => {
            const el = document.getElementById(`service-item-${match.id}`);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 300);
        });
        suggestionsBox.appendChild(row);
      });
    }
    suggestionsBox.style.display = "block";
  }
}

// Show category view (slides in full screen overlay)
function showCategoryView(categoryKey) {
  selectedCategoryKey = categoryKey;
  currentView = 'category';
  const category = SERVICES_DATA[categoryKey];
  
  document.getElementById("category-view-title").textContent = category.title;
  document.getElementById("category-view-desc").textContent = category.description;
  
  // Render sidebar category options (similar to Urban Company)
  const sidebar = document.getElementById("category-sidebar");
  sidebar.innerHTML = "";
  Object.entries(SERVICES_DATA).forEach(([key, cat]) => {
    const button = document.createElement("button");
    button.className = `sidebar-nav-btn ${key === categoryKey ? 'active' : ''}`;
    button.innerHTML = `${cat.icon} <span>${cat.title}</span>`;
    button.addEventListener("click", () => showCategoryView(key));
    sidebar.appendChild(button);
  });

  // Render Service Cards
  const container = document.getElementById("category-services-list");
  container.innerHTML = "";

  category.items.forEach(item => {
    const itemCard = document.createElement("div");
    itemCard.className = "service-item-row";
    itemCard.id = `service-item-${item.id}`;
    itemCard.innerHTML = `
      <div class="service-item-details">
        <h4 class="service-name">${item.name}</h4>
        <div class="service-meta">
          <span class="service-rating">★ 4.8</span>
          <span class="service-duration">• ${item.duration}</span>
        </div>
        <div class="service-pricing">
          <span class="price-current">₹${item.price}</span>
          <span class="price-original">₹${item.originalPrice}</span>
        </div>
        <p class="service-desc">${item.description}</p>
      </div>
      <div class="service-item-action">
        <div class="action-img-placeholder">${category.icon}</div>
        <div class="action-btn-container" id="act-${item.id}">
          <!-- Add/Quantity control buttons will go here -->
        </div>
      </div>
    `;
    container.appendChild(itemCard);
    updateServiceButtonState(item, `act-${item.id}`, categoryKey);
  });

  // Slide view open
  const view = document.getElementById("category-view-overlay");
  view.classList.add("active");
  document.body.style.overflow = "hidden"; // disable scroll behind modal
}

// Return to home view
function showHomeView() {
  currentView = 'home';
  window.location.hash = '';
  const view = document.getElementById("category-view-overlay");
  view.classList.remove("active");
  document.body.style.overflow = ""; // restore scroll
  
  // Refresh home page states
  renderFeaturedServices();
}

// Update Add/Quantity action buttons dynamically
function updateServiceButtonState(item, containerId, categoryKey) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";
  const cartItem = cart[item.id];

  if (cartItem) {
    container.innerHTML = `
      <div class="quantity-controller">
        <button class="qty-btn dec-btn">-</button>
        <span class="qty-count">${cartItem.quantity}</span>
        <button class="qty-btn inc-btn">+</button>
      </div>
    `;
    container.querySelector(".dec-btn").addEventListener("click", () => updateCartQuantity(item.id, cartItem.quantity - 1, categoryKey));
    container.querySelector(".inc-btn").addEventListener("click", () => updateCartQuantity(item.id, cartItem.quantity + 1, categoryKey));
  } else {
    container.innerHTML = `<button class="btn btn-primary add-service-btn">ADD</button>`;
    container.querySelector(".add-service-btn").addEventListener("click", () => addToCart(item, categoryKey));
  }
}

// Cart Logic
function addToCart(service, categoryKey) {
  cart[service.id] = {
    service: service,
    quantity: 1,
    categoryKey: categoryKey
  };
  updateCartUI();
  
  // Re-render button states in whichever views are active
  showCategoryView(selectedCategoryKey);
  renderFeaturedServices();
}

function updateCartQuantity(serviceId, quantity, categoryKey) {
  if (quantity <= 0) {
    delete cart[serviceId];
  } else {
    cart[serviceId].quantity = quantity;
  }
  updateCartUI();
  
  // Re-render button states
  if (currentView === 'category') {
    showCategoryView(selectedCategoryKey);
  }
  renderFeaturedServices();
}

function updateCartUI() {
  const cartCountEl = document.getElementById("cart-count");
  const cartTotalEl = document.getElementById("cart-total");
  const bottomCartBar = document.getElementById("bottom-cart-bar");
  const cartBarSummary = document.getElementById("cart-bar-summary");

  let totalItems = 0;
  let totalPrice = 0;

  Object.values(cart).forEach(item => {
    totalItems += item.quantity;
    totalPrice += item.service.price * item.quantity;
  });

  // Header cart indicator
  if (cartCountEl) cartCountEl.textContent = totalItems;
  if (cartTotalEl) cartTotalEl.textContent = `₹${totalPrice}`;

  // Floating bottom bar (Urban Company style)
  if (bottomCartBar) {
    if (totalItems > 0) {
      cartBarSummary.innerHTML = `
        <div class="cart-bar-items">${totalItems} item${totalItems > 1 ? 's' : ''} added</div>
        <div class="cart-bar-price">₹${totalPrice} <span class="tax-info">plus tax</span></div>
      `;
      bottomCartBar.classList.add("active");
    } else {
      bottomCartBar.classList.remove("active");
    }
  }

  // Live update items inside cart drawer if open
  renderCartDrawerItems();
}

// Cart Drawer / Checkout Functions
function openCartDrawer() {
  const drawer = document.getElementById("cart-drawer");
  const overlay = document.getElementById("cart-overlay");
  
  drawer.classList.add("active");
  overlay.classList.add("active");
  document.body.style.overflow = "hidden";
  
  renderCartDrawerItems();
}

function closeCartDrawer() {
  const drawer = document.getElementById("cart-drawer");
  const overlay = document.getElementById("cart-overlay");
  
  drawer.classList.remove("active");
  overlay.classList.remove("active");
  if (currentView !== 'category') {
    document.body.style.overflow = "";
  }
}

function renderCartDrawerItems() {
  const container = document.getElementById("checkout-items-list");
  const subtotalEl = document.getElementById("checkout-subtotal");
  const taxEl = document.getElementById("checkout-tax");
  const totalEl = document.getElementById("checkout-total");
  const submitBtn = document.getElementById("checkout-submit-btn");

  if (!container) return;
  container.innerHTML = "";

  const items = Object.values(cart);

  if (items.length === 0) {
    container.innerHTML = `
      <div class="empty-cart-state">
        <div class="empty-cart-icon">🛒</div>
        <h3>Your Cart is Empty</h3>
        <p>Browse our categories and add services to get started.</p>
        <button class="btn btn-primary" onclick="closeCartDrawer()">Start Booking</button>
      </div>
    `;
    if (subtotalEl) subtotalEl.textContent = "₹0";
    if (taxEl) taxEl.textContent = "₹0";
    if (totalEl) totalEl.textContent = "₹0";
    if (submitBtn) submitBtn.disabled = true;
    return;
  }

  let subtotal = 0;
  items.forEach(item => {
    const itemCost = item.service.price * item.quantity;
    subtotal += itemCost;

    const row = document.createElement("div");
    row.className = "checkout-item-row";
    row.innerHTML = `
      <div class="checkout-item-info">
        <div class="checkout-item-name">${item.service.name}</div>
        <div class="checkout-item-price">₹${item.service.price} each</div>
      </div>
      <div class="checkout-item-action">
        <div class="quantity-controller">
          <button class="qty-btn drawer-dec-btn">-</button>
          <span class="qty-count">${item.quantity}</span>
          <button class="qty-btn drawer-inc-btn">+</button>
        </div>
        <div class="checkout-item-total">₹${itemCost}</div>
      </div>
    `;
    
    row.querySelector(".drawer-dec-btn").addEventListener("click", () => updateCartQuantity(item.service.id, item.quantity - 1, item.categoryKey));
    row.querySelector(".drawer-inc-btn").addEventListener("click", () => updateCartQuantity(item.service.id, item.quantity + 1, item.categoryKey));
    
    container.appendChild(row);
  });

  const tax = Math.round(subtotal * 0.05); // 5% GST
  const grandTotal = subtotal + tax;

  if (subtotalEl) subtotalEl.textContent = `₹${subtotal}`;
  if (taxEl) taxEl.textContent = `₹${tax}`;
  if (totalEl) totalEl.textContent = `₹${grandTotal}`;
  if (submitBtn) submitBtn.disabled = false;
}

// Handle Form Submission and Backend Booking Save
async function handleBookingSubmit(event) {
  event.preventDefault();
  
  const submitBtn = document.getElementById("checkout-submit-btn");
  const originalText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = `<span class="loading-spinner"></span> Booking...`;

  const customerName = document.getElementById("booking-name").value;
  const phone = document.getElementById("booking-phone").value;
  const email = document.getElementById("booking-email").value;
  const address = document.getElementById("booking-address").value;
  const date = document.getElementById("booking-date").value;
  const timeSlot = document.getElementById("booking-time").value;
  const notes = document.getElementById("booking-notes").value;

  // Build services array
  const services = Object.values(cart).map(item => ({
    id: item.service.id,
    name: item.service.name,
    price: item.service.price,
    quantity: item.quantity
  }));

  const subtotal = services.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalAmount = subtotal + Math.round(subtotal * 0.05);

  const payload = {
    customerName,
    phone,
    email,
    address,
    date,
    timeSlot,
    services,
    totalAmount,
    notes
  };

  try {
    const response = await fetch('/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Failed to submit booking');
    }

    // Success!
    cart = {}; // Empty cart
    updateCartUI();
    closeCartDrawer();
    showHomeView();
    
    // Show Success Modal
    showSuccessScreen(result.booking);
  } catch (error) {
    console.error('Submission error:', error);
    alert(`Error: ${error.message}. Please check your connection and try again.`);
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
  }
}

// Show success sheet/popup with WhatsApp option
function showSuccessScreen(booking) {
  const modal = document.getElementById("success-modal");
  const modalBody = document.getElementById("success-modal-details");
  
  if (!modal || !modalBody) return;

  const serviceNames = booking.services.map(s => `${s.name} (x${s.quantity})`).join(', ');

  modalBody.innerHTML = `
    <div class="success-icon-badge">✓</div>
    <h2>Booking Confirmed!</h2>
    <div class="success-booking-id">ID: <strong>${booking.id}</strong></div>
    <p class="success-message-text">Thank you, <strong>${booking.customerName}</strong>! Your service request has been received.</p>
    
    <div class="success-info-list">
      <div class="success-info-item">📅 <span>Date:</span> ${booking.date} (${booking.timeSlot})</div>
      <div class="success-info-item">📍 <span>Address:</span> ${booking.address}</div>
      <div class="success-info-item">🧹 <span>Services:</span> ${serviceNames}</div>
      <div class="success-info-item">💰 <span>Total Amount:</span> ₹${booking.totalAmount} (incl. GST)</div>
    </div>
  `;

  // WhatsApp Button pre-filled message
  const whatsappBtn = document.getElementById("success-whatsapp-btn");
  if (whatsappBtn) {
    const waText = encodeURIComponent(
      `*S A RAICHUR SERVICE POINT - NEW BOOKING*\n\n` +
      `*Booking ID:* ${booking.id}\n` +
      `*Name:* ${booking.customerName}\n` +
      `*Phone:* ${booking.phone}\n` +
      `*Services:* ${serviceNames}\n` +
      `*Date/Time:* ${booking.date} | ${booking.timeSlot}\n` +
      `*Address:* ${booking.address}\n` +
      `*Amount:* ₹${booking.totalAmount}\n\n` +
      `Please confirm my service slot. Thank you!`
    );
    // Open chat with primary contact
    whatsappBtn.href = `https://wa.me/917411741418?text=${waText}`;
  }

  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeSuccessModal() {
  const modal = document.getElementById("success-modal");
  modal.classList.remove("active");
  document.body.style.overflow = "";
}


/* ==========================================================================
   ADMIN DASHBOARD SECTION
   ========================================================================== */

function showAdminView() {
  currentView = 'admin';
  document.getElementById("main-landing").style.display = "none";
  document.getElementById("admin-panel").style.display = "block";
  document.getElementById("category-view-overlay").classList.remove("active");
  document.body.style.overflow = "";
  
  // Check auth
  if (adminToken) {
    loadAdminBookings();
  } else {
    showAdminLogin();
  }
}

function showHomeViewFromAdmin() {
  currentView = 'home';
  window.location.hash = '';
  document.getElementById("main-landing").style.display = "block";
  document.getElementById("admin-panel").style.display = "none";
}

function showAdminLogin() {
  document.getElementById("admin-auth-box").style.display = "block";
  document.getElementById("admin-dashboard-box").style.display = "none";
  document.getElementById("admin-login-btn").addEventListener("click", handleAdminLoginSubmit);
}

function handleAdminLoginSubmit() {
  const pass = document.getElementById("admin-pass-input").value;
  if (pass === 'admin') {
    adminToken = 'admin';
    localStorage.setItem('saraichur_admin_token', 'admin');
    document.getElementById("admin-pass-input").value = "";
    loadAdminBookings();
  } else {
    alert("Incorrect password. Access denied.");
  }
}

function adminLogout() {
  adminToken = null;
  localStorage.removeItem('saraichur_admin_token');
  showAdminLogin();
}

async function loadAdminBookings() {
  document.getElementById("admin-auth-box").style.display = "none";
  document.getElementById("admin-dashboard-box").style.display = "block";
  
  const loader = document.getElementById("admin-loader");
  const bookingsTable = document.getElementById("admin-bookings-table");
  const tbody = document.getElementById("admin-bookings-rows");
  
  loader.style.display = "block";
  bookingsTable.style.display = "none";
  tbody.innerHTML = "";

  try {
    const response = await fetch('/api/bookings', {
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });

    if (response.status === 401 || response.status === 403) {
      // Token invalid, logout
      adminLogout();
      return;
    }

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Failed to fetch bookings');
    }

    renderAdminTable(data.bookings);

  } catch (error) {
    console.error('Error fetching bookings:', error);
    tbody.innerHTML = `<tr><td colspan="7" class="text-error">Error loading bookings: ${error.message}</td></tr>`;
  } finally {
    loader.style.display = "none";
    bookingsTable.style.display = "table";
  }
}

function renderAdminTable(bookings) {
  const tbody = document.getElementById("admin-bookings-rows");
  tbody.innerHTML = "";

  if (bookings.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center">No bookings found in the database.</td></tr>`;
    return;
  }

  // Get filter settings
  const statusFilter = document.getElementById("admin-filter-status").value;
  const searchQuery = document.getElementById("admin-search-input").value.toLowerCase();

  let filtered = bookings;

  // Filter by status
  if (statusFilter !== 'all') {
    filtered = filtered.filter(b => b.status === statusFilter);
  }

  // Filter by search query (Name, ID, phone, services)
  if (searchQuery) {
    filtered = filtered.filter(b => 
      b.id.toLowerCase().includes(searchQuery) ||
      b.customerName.toLowerCase().includes(searchQuery) ||
      b.phone.includes(searchQuery) ||
      b.services.some(s => s.name.toLowerCase().includes(searchQuery))
    );
  }

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center">No bookings match the filters.</td></tr>`;
    return;
  }

  filtered.forEach(booking => {
    const tr = document.createElement("tr");
    
    const servicesStr = booking.services.map(s => `${s.name} (x${s.quantity})`).join(', ');
    const formattedDate = new Date(booking.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    tr.innerHTML = `
      <td>
        <div class="booking-id-tag">${booking.id}</div>
        <div class="booking-time-created">${formattedDate}</div>
      </td>
      <td>
        <div class="admin-cust-name">${booking.customerName}</div>
        <div class="admin-cust-phone">${booking.phone}</div>
      </td>
      <td>
        <div class="admin-services-list">${servicesStr}</div>
        <div class="admin-total-price">₹${booking.totalAmount}</div>
      </td>
      <td>
        <div>${booking.date}</div>
        <div class="admin-timeslot">${booking.timeSlot}</div>
      </td>
      <td><div class="admin-address-text" title="${booking.address}">${booking.address}</div></td>
      <td>
        <select class="admin-status-dropdown status-${booking.status.toLowerCase().replace(' ', '-')}" data-id="${booking.id}">
          <option value="Pending" ${booking.status === 'Pending' ? 'selected' : ''}>Pending</option>
          <option value="Confirmed" ${booking.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
          <option value="In Progress" ${booking.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
          <option value="Completed" ${booking.status === 'Completed' ? 'selected' : ''}>Completed</option>
          <option value="Cancelled" ${booking.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
        </select>
      </td>
      <td>
        <div class="admin-row-actions">
          <a href="tel:${booking.phone}" class="admin-action-btn btn-call" title="Call Customer">📞</a>
          <a href="https://wa.me/91${booking.phone.replace(/[^0-9]/g, '')}" target="_blank" class="admin-action-btn btn-wa" title="WhatsApp Customer">💬</a>
        </div>
      </td>
    `;

    // Hook status change
    tr.querySelector(".admin-status-dropdown").addEventListener("change", async (e) => {
      const select = e.target;
      const newStatus = select.value;
      const bookingId = select.dataset.id;
      
      select.disabled = true;
      try {
        const response = await fetch(`/api/bookings/${bookingId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`
          },
          body: JSON.stringify({ status: newStatus })
        });

        if (!response.ok) {
          throw new Error('Failed to update status');
        }

        // Change color class
        select.className = `admin-status-dropdown status-${newStatus.toLowerCase().replace(' ', '-')}`;
      } catch (err) {
        alert(`Failed to update booking status: ${err.message}`);
        // Reset to old value
        loadAdminBookings();
      } finally {
        select.disabled = false;
      }
    });

    tbody.appendChild(tr);
  });
}

// Trigger refresh on filters
function triggerAdminFilter() {
  loadAdminBookings();
}
