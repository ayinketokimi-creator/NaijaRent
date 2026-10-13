// ========== Data & State ==========
const STORAGE_KEY = 'naijarent_properties';
const USERS_KEY = 'naijarent_users';
const SESSION_KEY = 'naijarent_session';

let properties = [];
let currentUser = null;
let isRegisterMode = false;

// Sample listings (Nigerian context)
const sampleProperties = [
  {
    id: 1,
    title: "Spacious 3 Bedroom Flat in Lekki Phase 1",
    price: 4500000,
    city: "Lagos",
    area: "Lekki Phase 1",
    beds: 3,
    baths: 3,
    type: "Apartment",
    description: "Modern 3-bedroom flat with fitted kitchen, POP ceiling, 24/7 power (generator + inverter), borehole water, and secure estate. Close to shops and restaurants.",
    amenities: ["Generator", "Inverter", "Borehole", "Security", "Parking", "AC"],
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
    owner: "demo@landlord.com",
    createdAt: Date.now()
  },
  {
    id: 2,
    title: "Luxury 4 Bedroom Duplex in Maitama",
    price: 12000000,
    city: "Abuja",
    area: "Maitama",
    beds: 4,
    baths: 5,
    type: "Duplex",
    description: "Elegant duplex in a quiet, high-end neighborhood. Fully air-conditioned, smart home features, private garden, and 24-hour security.",
    amenities: ["AC", "Smart Home", "Garden", "Security", "Parking", "Generator"],
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
    owner: "demo@landlord.com",
    createdAt: Date.now()
  },
  {
    id: 3,
    title: "Affordable 2 Bedroom Apartment in Yaba",
    price: 1800000,
    city: "Lagos",
    area: "Yaba",
    beds: 2,
    baths: 2,
    type: "Apartment",
    description: "Clean and well-maintained 2-bedroom flat near University of Lagos. Good water supply, prepaid meter, and peaceful environment.",
    amenities: ["Prepaid Meter", "Water", "Security", "Parking"],
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
    owner: "demo@landlord.com",
    createdAt: Date.now()
  },
  {
    id: 4,
    title: "Modern Studio Apartment in Port Harcourt",
    price: 1200000,
    city: "Port Harcourt",
    area: "GRA Phase 2",
    beds: 1,
    baths: 1,
    type: "Studio",
    description: "Fully furnished studio ideal for young professionals. Includes kitchenette, en-suite bathroom, and reliable power backup.",
    amenities: ["Furnished", "Generator", "AC", "Security"],
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
    owner: "demo@landlord.com",
    createdAt: Date.now()
  },
  {
    id: 5,
    title: "Family House in Bodija, Ibadan",
    price: 2200000,
    city: "Ibadan",
    area: "Bodija",
    beds: 3,
    baths: 2,
    type: "House",
    description: "Detached 3-bedroom bungalow with spacious compound, fruit trees, and borehole. Perfect for families.",
    amenities: ["Borehole", "Compound", "Security", "Parking"],
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
    owner: "demo@landlord.com",
    createdAt: Date.now()
  }
];

// ========== Initialization ==========
function init() {
  loadProperties();
  loadSession();
  renderProperties(properties);
  setupEventListeners();
}

function loadProperties() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    properties = JSON.parse(stored);
  } else {
    properties = [...sampleProperties];
    saveProperties();
  }
}

function saveProperties() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(properties));
}

function loadSession() {
  const session = localStorage.getItem(SESSION_KEY);
  if (session) {
    currentUser = JSON.parse(session);
    updateUIForUser();
  }
}

function saveSession() {
  if (currentUser) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(currentUser));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

// ========== UI Helpers ==========
function updateUIForUser() {
  const authBtn = document.getElementById('authBtn');
  const userMenu = document.getElementById('userMenu');
  const uploadBtn = document.getElementById('uploadBtn');
  const userName = document.getElementById('userName');

  if (currentUser) {
    authBtn.classList.add('hidden');
    userMenu.classList.remove('hidden');
    userName.textContent = currentUser.name.split(' ')[0];
    if (currentUser.role === 'landlord') {
      uploadBtn.classList.remove('hidden');
    } else {
      uploadBtn.classList.add('hidden');
    }
  } else {
    authBtn.classList.remove('hidden');
    userMenu.classList.add('hidden');
    uploadBtn.classList.add('hidden');
  }
}

function formatPrice(price) {
  return '₦' + price.toLocaleString('en-NG');
}

// ========== Rendering ==========
function renderProperties(list) {
  const grid = document.getElementById('propertyGrid');
  const countEl = document.getElementById('propertyCount');
  const empty = document.getElementById('emptyState');

  countEl.textContent = `${list.length} propert${list.length === 1 ? 'y' : 'ies'} available`;

  if (list.length === 0) {
    grid.innerHTML = '';
    empty.classList.remove('hidden');
    return;
  }

  empty.classList.add('hidden');
  grid.innerHTML = list.map(p => `
    <article class="property-card" data-id="${p.id}">
      <img src="${p.image}" alt="${p.title}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'" />
      <div class="card-body">
        <div class="card-price">${formatPrice(p.price)} <small style="font-size:0.8rem;font-weight:400;color:var(--muted)">/year</small></div>
        <h3 class="card-title">${p.title}</h3>
        <p class="card-location">${p.area}, ${p.city}</p>
        <div class="card-meta">
          <span>🛏 ${p.beds} bed</span>
          <span>🛁 ${p.baths} bath</span>
          <span>${p.type}</span>
        </div>
      </div>
    </article>
  `).join('');

  // Attach click listeners
  document.querySelectorAll('.property-card').forEach(card => {
    card.addEventListener('click', () => openDetail(Number(card.dataset.id)));
  });
}

function openDetail(id) {
  const p = properties.find(x => x.id === id);
  if (!p) return;

  const content = document.getElementById('detailContent');
  content.innerHTML = `
    <img class="detail-image" src="${p.image}" alt="${p.title}" onerror="this.src='https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'" />
    <div class="detail-price">${formatPrice(p.price)} <small style="font-size:1rem;font-weight:400;color:var(--muted)">per year</small></div>
    <h2 class="detail-title">${p.title}</h2>
    <p class="detail-location">${p.area}, ${p.city} • ${p.type}</p>
    <div class="detail-specs">
      <span>🛏 ${p.beds} Bedroom${p.beds > 1 ? 's' : ''}</span>
      <span>🛁 ${p.baths} Bathroom${p.baths > 1 ? 's' : ''}</span>
      <span>📍 ${p.city}</span>
    </div>
    <p class="detail-desc">${p.description}</p>
    <div>
      <strong>Amenities</strong>
      <div class="amenities">
        ${p.amenities.map(a => `<span class="amenity-tag">${a}</span>`).join('')}
      </div>
    </div>
  `;
  document.getElementById('detailModal').classList.remove('hidden');
}

// ========== Auth ==========
function openAuthModal(register = false) {
  isRegisterMode = register;
  document.getElementById('authTitle').textContent = register ? 'Create Account' : 'Login';
  document.getElementById('switchText').textContent = register ? 'Already have an account?' : "Don't have an account?";
  document.getElementById('switchAuth').textContent = register ? 'Login' : 'Register';
  document.getElementById('roleGroup').style.display = register ? 'block' : 'none';
  document.getElementById('authName').parentElement.style.display = register ? 'block' : 'none';
  document.getElementById('authForm').reset();
  document.getElementById('authModal').classList.remove('hidden');
}

function handleAuth(e) {
  e.preventDefault();
  const name = document.getElementById('authName').value.trim();
  const email = document.getElementById('authEmail').value.trim().toLowerCase();
  const password = document.getElementById('authPassword').value;
  const role = document.getElementById('authRole').value;

  let users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');

  if (isRegisterMode) {
    if (users.some(u => u.email === email)) {
      alert('Email already registered. Please login.');
      return;
    }
    const newUser = { name, email, password, role };
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    currentUser = { name, email, role };
    alert('Account created successfully!');
  } else {
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      // Allow demo login
      if (email === 'demo@tenant.com' && password === 'demo') {
        currentUser = { name: 'Demo Tenant', email, role: 'tenant' };
      } else if (email === 'demo@landlord.com' && password === 'demo') {
        currentUser = { name: 'Demo Landlord', email, role: 'landlord' };
      } else {
        alert('Invalid email or password.\\n\\nTry demo accounts:\\nTenant: demo@tenant.com / demo\\nLandlord: demo@landlord.com / demo');
        return;
      }
    } else {
      currentUser = { name: user.name, email: user.email, role: user.role };
    }
  }

  saveSession();
  updateUIForUser();
  document.getElementById('authModal').classList.add('hidden');
}

function logout() {
  currentUser = null;
  saveSession();
  updateUIForUser();
}

// ========== Upload ==========
function handleUpload(e) {
  e.preventDefault();
  if (!currentUser || currentUser.role !== 'landlord') {
    alert('Only landlords and agents can upload listings.');
    return;
  }

  const newProp = {
    id: Date.now(),
    title: document.getElementById('propTitle').value.trim(),
    price: Number(document.getElementById('propPrice').value),
    city: document.getElementById('propCity').value,
    area: document.getElementById('propArea').value.trim(),
    beds: Number(document.getElementById('propBeds').value),
    baths: Number(document.getElementById('propBaths').value),
    type: document.getElementById('propType').value,
    description: document.getElementById('propDesc').value.trim(),
    amenities: document.getElementById('propAmenities').value
      .split(',')
      .map(a => a.trim())
      .filter(Boolean),
    image: document.getElementById('propImage').value.trim() || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    owner: currentUser.email,
    createdAt: Date.now()
  };

  properties.unshift(newProp);
  saveProperties();
  renderProperties(properties);
  document.getElementById('uploadModal').classList.add('hidden');
  document.getElementById('uploadForm').reset();
  alert('Listing published successfully!');
}

// ========== Filters ==========
function applyFilters() {
  const city = document.getElementById('cityFilter').value;
  const beds = document.getElementById('bedroomFilter').value;
  const maxPrice = document.getElementById('priceFilter').value;

  let filtered = [...properties];

  if (city) filtered = filtered.filter(p => p.city === city);
  if (beds) {
    const b = Number(beds);
    filtered = filtered.filter(p => b === 4 ? p.beds >= 4 : p.beds === b);
  }
  if (maxPrice) filtered = filtered.filter(p => p.price <= Number(maxPrice));

  renderProperties(filtered);
}

function resetFilters() {
  document.getElementById('cityFilter').value = '';
  document.getElementById('bedroomFilter').value = '';
  document.getElementById('priceFilter').value = '';
  renderProperties(properties);
}

// ========== Event Listeners ==========
function setupEventListeners() {
  document.getElementById('authBtn').addEventListener('click', () => openAuthModal(false));
  document.getElementById('logoutBtn').addEventListener('click', logout);
  document.getElementById('uploadBtn').addEventListener('click', () => {
    document.getElementById('uploadModal').classList.remove('hidden');
  });

  document.getElementById('authForm').addEventListener('submit', handleAuth);
  document.getElementById('uploadForm').addEventListener('submit', handleUpload);

  document.getElementById('switchAuth').addEventListener('click', (e) => {
    e.preventDefault();
    openAuthModal(!isRegisterMode);
  });

  document.getElementById('applyFilters').addEventListener('click', applyFilters);
  document.getElementById('resetFilters').addEventListener('click', resetFilters);

  // Close modals
  document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById(btn.dataset.close).classList.add('hidden');
    });
  });

  // Close on backdrop click
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.add('hidden');
    });
  });
}

// Start the app
init();
