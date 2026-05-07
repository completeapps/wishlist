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

// Toggle add item form
function toggleAddForm() {
  const form = document.getElementById('addForm');
  form.classList.toggle('active');
  
  if (!form.classList.contains('active')) {
    document.getElementById('itemName').value = '';
    document.getElementById('itemPrice').value = '';
    document.getElementById('itemLink').value = '';
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
  
  if (!name) {
    alert('Please enter an item name');
    return;
  }
  
  const newItemRef = window.dbPush(window.dbRef(window.db, 'wishlist'));
  window.dbSet(newItemRef, {
    name: name,
    price: price,
    link: link,
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

// Escape HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Close modal on background click
document.addEventListener('click', (e) => {
  const modal = document.getElementById('adminModal');
  if (e.target === modal) {
    closeAdminModal();
  }
});
