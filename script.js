// Admin password
const ADMIN_PASSWORD = "0000";

window.addEventListener('DOMContentLoaded', () => {
  updateAdminUI();
});

// Toggle admin mode
function toggleAdmin() {
  const isAdmin = sessionStorage.getItem('isAdmin') === 'true';
  
  if (isAdmin) {
    sessionStorage.removeItem('isAdmin');
    updateAdminUI();
  } else {
    document.getElementById('adminModal').classList.add('active');
  }
}

// Login admin
function loginAdmin() {
  const password = document.getElementById('adminPassword').value;
  
  if (password === ADMIN_PASSWORD) {
    sessionStorage.setItem('isAdmin', 'true');
    closeAdminModal();
    updateAdminUI();
    alert('Admin mode enabled');
  } else {
    alert('Incorrect password');
  }
}

function closeAdminModal() {
  document.getElementById('adminModal').classList.remove('active');
  document.getElementById('adminPassword').value = '';
}

function updateAdminUI() {
  const isAdmin = sessionStorage.getItem('isAdmin') === 'true';
  const adminBtn = document.getElementById('adminBtn');
  const adminElements = document.querySelectorAll('.admin-only');
  
  if (isAdmin) {
    adminBtn.classList.add('active');
    adminBtn.textContent = 'Logout';
    adminElements.forEach(el => el.style.display = 'block');
  } else {
    adminBtn.classList.remove('active');
    adminBtn.textContent = 'Admin';
    adminElements.forEach(el => el.style.display = 'none');
  }
}

// Profile functions
function openProfileEditor() {
  const isAdmin = sessionStorage.getItem('isAdmin') === 'true';
  if (!isAdmin) {
    alert('Admin access required');
    return;
  }
  
  document.getElementById('editName').value = document.getElementById('profileName').textContent;
  document.getElementById('editTitle').value = document.getElementById('profileTitle').textContent;
  document.getElementById('editLocation').value = document.getElementById('profileLocation').textContent.replace('📍 ', '');
  document.getElementById('editBio').value = document.getElementById('profileBio').textContent;
  document.getElementById('editAvatar').value = document.getElementById('avatarCircle').textContent;
  
  const websiteEl = document.getElementById('profileWebsite');
  if (websiteEl.style.display !== 'none') {
    document.getElementById('editWebsite').value = websiteEl.href;
  }
  
  const interestsEl = document.getElementById('profileInterests');
  if (interestsEl.style.display !== 'none') {
    document.getElementById('editInterests').value = interestsEl.textContent.replace('💡 ', '');
  }
  
  document.getElementById('profileModal').classList.add('active');
}

function saveProfile() {
  const name = document.getElementById('editName').value.trim();
  const title = document.getElementById('editTitle').value.trim();
  const location = document.getElementById('editLocation').value.trim();
  const bio = document.getElementById('editBio').value.trim();
  const avatar = document.getElementById('editAvatar').value.trim().toUpperCase();
  const website = document.getElementById('editWebsite').value.trim();
  const interests = document.getElementById('editInterests').value.trim();
  
  if (!name) {
    alert('Please enter a name');
    return;
  }
  
  const profileData = {
    name: name,
    title: title,
    location: location,
    bio: bio,
    avatar: avatar || name.charAt(0).toUpperCase(),
    website: website,
    interests: interests
  };
  
  window.dbSet(window.dbRef(window.db, 'profile'), profileData);
  closeProfileModal();
  alert('Profile updated!');
}

function closeProfileModal() {
  document.getElementById('profileModal').classList.remove('active');
}

// Edit item - FIXED FUNCTION
function openEditItem(id) {
  const isAdmin = sessionStorage.getItem('isAdmin') === 'true';
  if (!isAdmin) {
    alert('Admin access required');
    return;
  }
  
  const item = window.wishlistData[id];
  if (!item) return;
  
  document.getElementById('editItemId').value = id;
  document.getElementById('editItemName').value = item.name || '';
  document.getElementById('editItemPrice').value = item.price || '';
  document.getElementById('editItemLink').value = item.link || '';
  document.getElementById('editItemImage').value = item.image || '';
  document.getElementById('editItemTag').value = item.tag || '';
  document.getElementById('editItemInfo').value = item.info || '';
  
  document.getElementById('editItemModal').classList.add('active');
}

function saveItemEdit() {
  const id = document.getElementById('editItemId').value;
  const name = document.getElementById('editItemName').value.trim();
  const price = document.getElementById('editItemPrice').value.trim();
  const link = document.getElementById('editItemLink').value.trim();
  const image = document.getElementById('editItemImage').value.trim();
  const tag = document.getElementById('editItemTag').value;
  const info = document.getElementById('editItemInfo').value.trim();
  
  if (!name) {
    alert('Please enter an item name');
    return;
  }
  
  window.dbUpdate(window.dbRef(window.db, 'wishlist/' + id), {
    name: name,
    price: price,
    link: link,
    image: image,
    tag: tag,
    info: info
  });
  
  closeEditItemModal();
  alert('Item updated!');
}

function closeEditItemModal() {
  document.getElementById('editItemModal').classList.remove('active');
}

// Add/Delete items
function toggleAddForm() {
  const form = document.getElementById('addForm');
  form.classList.toggle('active');
  
  if (!form.classList.contains('active')) {
    document.getElementById('itemName').value = '';
    document.getElementById('itemPrice').value = '';
    document.getElementById('itemLink').value = '';
    document.getElementById('itemImage').value = '';
    document.getElementById('itemTag').value = '';
    document.getElementById('itemInfo').value = '';
  }
}

function addItem() {
  const isAdmin = sessionStorage.getItem('isAdmin') === 'true';
  if (!isAdmin) {
    alert('Admin access required');
    return;
  }
  
  const name = document.getElementById('itemName').value.trim();
  const price = document.getElementById('itemPrice').value.trim();
  const link = document.getElementById('itemLink').value.trim();
  const image = document.getElementById('itemImage').value.trim();
  const tag = document.getElementById('itemTag').value;
  const info = document.getElementById('itemInfo').value.trim();
  
  if (!name) {
    alert('Please enter an item name');
    return;
  }
  
  const newItemRef = window.dbPush(window.dbRef(window.db, 'wishlist'));
  window.dbSet(newItemRef, {
    name: name,
    price: price,
    link: link,
    image: image,
    tag: tag,
    info: info,
    checked: false,
    comments: {}
  });
  
  toggleAddForm();
}

function deleteItem(id) {
  const isAdmin = sessionStorage.getItem('isAdmin') === 'true';
  if (!isAdmin) {
    alert('Admin access required');
    return;
  }
  
  if (confirm('Remove this item from wishlist?')) {
    window.dbRemove(window.dbRef(window.db, 'wishlist/' + id));
  }
}

function toggleCheck(id, checked) {
  window.dbUpdate(window.dbRef(window.db, 'wishlist/' + id), {
    checked: checked
  });
}

// Info modal - FIXED FUNCTION
function openInfo(id) {
  const item = window.wishlistData[id];
  if (!item) return;
  
  document.getElementById('infoItemName').textContent = item.name;
  document.getElementById('infoContent').textContent = item.info || 'No info available.';
  document.getElementById('infoModal').classList.add('active');
}

function closeInfoModal() {
  document.getElementById('infoModal').classList.remove('active');
}

// Comments
function addComment(itemId) {
  const author = document.getElementById('comment-input-' + itemId).value.trim();
  const text = document.getElementById('comment-text-' + itemId).value.trim();
  
  if (!author || !text) {
    alert('Please enter your name and comment');
    return;
  }
  
  const commentRef = window.dbPush(window.dbRef(window.db, 'wishlist/' + itemId + '/comments'));
  window.dbSet(commentRef, {
    author: author,
    text: text,
    timestamp: Date.now()
  });
  
  document.getElementById('comment-input-' + itemId).value = '';
  document.getElementById('comment-text-' + itemId).value = '';
}

// Filters
let currentPriceFilter = 'all';
let currentTagFilter = 'all';

function filterByPrice(filter) {
  currentPriceFilter = filter;
  
  document.querySelectorAll('.filter-group .filter-btn').forEach(btn => {
    if (btn.textContent.includes('$') || btn.textContent.includes('All Prices')) {
      btn.classList.remove('active');
    }
  });
  event.target.classList.add('active');
  
  applyFilters();
}

function filterByTag(filter) {
  currentTagFilter = filter;
  
  document.querySelectorAll('.filter-group .filter-btn').forEach(btn => {
    if (btn.textContent.includes('🎂') || btn.textContent.includes('🎄') || 
        btn.textContent.includes('🎓') || btn.textContent.includes('🎁') || 
        btn.textContent.includes('All Tags')) {
      btn.classList.remove('active');
    }
  });
  event.target.classList.add('active');
  
  applyFilters();
}

function applyFilters() {
  const items = document.querySelectorAll('.wishlist-item');
  
  items.forEach(item => {
    let showItem = true;
    
    // Price filter
    if (currentPriceFilter !== 'all') {
      const priceText = item.dataset.price;
      const priceNum = parseFloat(priceText.replace(/[^0-9.]/g, ''));
      
      if (currentPriceFilter === 'under50' && priceNum >= 50) showItem = false;
      if (currentPriceFilter === '50to100' && (priceNum < 50 || priceNum > 100)) showItem = false;
      if (currentPriceFilter === 'over100' && priceNum <= 100) showItem = false;
    }
    
    // Tag filter
    if (currentTagFilter !== 'all') {
      const tag = item.dataset.tag;
      if (tag !== currentTagFilter) showItem = false;
    }
    
    if (showItem) {
      item.classList.remove('hidden');
    } else {
      item.classList.add('hidden');
    }
  });
}

// Escape HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Close modals on background click
document.addEventListener('click', (e) => {
  const adminModal = document.getElementById('adminModal');
  const profileModal = document.getElementById('profileModal');
  const infoModal = document.getElementById('infoModal');
  const editItemModal = document.getElementById('editItemModal');
  
  if (e.target === adminModal) closeAdminModal();
  if (e.target === profileModal) closeProfileModal();
  if (e.target === infoModal) closeInfoModal();
  if (e.target === editItemModal) closeEditItemModal();
});
/* Footer - Perplexity Credit */
.footer {
  margin-top: 60px;
  padding: 30px 20px;
  text-align: center;
  border-top: 1px solid #333;
}

.footer-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: #999;
  transition: color 0.2s;
}

.footer-link:hover {
  color: #fff;
}

.footer-text {
  font-size: 13px;
  letter-spacing: 0.5px;
}

.perplexity-logo {
  width: 20px;
  height: 20px;
  color: #0ff;
  transition: transform 0.2s;
}

.footer-link:hover .perplexity-logo {
  transform: scale(1.1);
}

.footer-brand {
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.5px;
}
