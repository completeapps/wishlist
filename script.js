// Admin password (CHANGE THIS!)
const ADMIN_PASSWORD = "0000";

// Check if user is admin on page load
window.addEventListener('DOMContentLoaded', () => {
  updateAdminUI();
});

// Toggle admin mode button
function toggleAdmin() {
  const isAdmin = sessionStorage.getItem('isAdmin') === 'true';
  
  if (isAdmin) {
    // Logout
    sessionStorage.removeItem('isAdmin');
    updateAdminUI();
  } else {
    // Show login modal
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

// Close admin modal
function closeAdminModal() {
  document.getElementById('adminModal').classList.remove('active');
  document.getElementById('adminPassword').value = '';
}

// Update UI based on admin status
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

// Open profile editor (admin only)
function openProfileEditor() {
  const isAdmin = sessionStorage.getItem('isAdmin') === 'true';
  if (!isAdmin) {
    alert('Admin access required');
    return;
  }
  
  // Load current profile values
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

// Save profile to Firebase
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

// Close profile modal
function closeProfileModal() {
  document.getElementById('profileModal').classList.remove('active');
}

// Toggle add item form
function toggleAddForm() {
  const form = document.getElementById('addForm');
  form.classList.toggle('active');
  
  if (!form.classList.contains('active')) {
    document.getElementById('itemName').value = '';
    document.getElementById('itemPrice').value = '';
    document.getElementById('itemLink').value = '';
    document.getElementById('itemInfo').value = '';
  }
}

// Add new item to Firebase
function addItem() {
  const isAdmin = sessionStorage.getItem('isAdmin') === 'true';
  if (!isAdmin) {
    alert('Admin access required');
    return;
  }
  
  const name = document.getElementById('itemName').value.trim();
  const price = document.getElementById('itemPrice').value.trim();
  const link = document.getElementById('itemLink').value.trim();
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
    info: info,
    checked: false
  });
  
  toggleAddForm();
}

// Delete item from Firebase
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

// Toggle check status (anyone can do this)
function toggleCheck(id, checked) {
  window.dbUpdate(window.dbRef(window.db, 'wishlist/' + id), {
    checked: checked
  });
}

// Open info modal
function openInfo(id, itemName, info) {
  document.getElementById('infoItemName').textContent = itemName;
  document.getElementById('infoContent').textContent = info || 'No info available.';
  document.getElementById('infoModal').classList.add('active');
}

// Close info modal
function closeInfoModal() {
  document.getElementById('infoModal').classList.remove('active');
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
  
  if (e.target === adminModal) {
    closeAdminModal();
  }
  if (e.target === profileModal) {
    closeProfileModal();
  }
  if (e.target === infoModal) {
    closeInfoModal();
  }
});
