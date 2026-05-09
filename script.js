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

// Edit item
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
  document.getElementById('editItemInfo').value = item.info || '';
  document.getElementById('editItemCategory').value = item.category || '';
  document.getElementById('editItemPriority').value = item.priority || 'medium';
  document.getElementById('editItemTags').value = item.tags || '';
  document.getElementById('editItemPrivate').checked = item.isPrivate || false;
  
  document.getElementById('editItemModal').classList.add('active');
}

function saveItemEdit() {
  const id = document.getElementById('editItemId').value;
  const item = window.wishlistData[id];
  const name = document.getElementById('editItemName').value.trim();
  const price = document.getElementById('editItemPrice').value.trim();
  const link = document.getElementById('editItemLink').value.trim();
  const image = document.getElementById('editItemImage').value.trim();
  const info = document.getElementById('editItemInfo').value.trim();
  const category = document.getElementById('editItemCategory').value;
  const priority = document.getElementById('editItemPriority').value;
  const tags = document.getElementById('editItemTags').value.trim();
  const isPrivate = document.getElementById('editItemPrivate').checked;
  
  if (!name) {
    alert('Please enter an item name');
    return;
  }
  
  const updateData = {
    name: name,
    price: price,
    link: link,
    image: image,
    info: info,
    category: category,
    priority: priority,
    tags: tags,
    isPrivate: isPrivate
  };
  
  // Handle price tracking
  if (item.price !== price) {
    const priceHistory = item.priceHistory || window.initPriceHistory(item.price);
    priceHistory.push({
      price: price,
      date: Date.now(),
      note: 'Price updated'
    });
    updateData.priceHistory = priceHistory;
  } else {
    updateData.priceHistory = item.priceHistory;
  }
  
  window.dbUpdate(window.dbRef(window.db, 'wishlist/' + id), updateData);
  
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
    document.getElementById('itemInfo').value = '';
    document.getElementById('itemCategory').value = '';
    document.getElementById('itemPriority').value = 'medium';
    document.getElementById('itemTags').value = '';
    document.getElementById('itemPrivate').checked = false;
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
  const info = document.getElementById('itemInfo').value.trim();
  const category = document.getElementById('itemCategory').value;
  const priority = document.getElementById('itemPriority').value;
  const tags = document.getElementById('itemTags').value.trim();
  const isPrivate = document.getElementById('itemPrivate').checked;
  
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
    info: info,
    category: category,
    priority: priority,
    tags: tags,
    isPrivate: isPrivate,
    checked: false,
    comments: {},
    priceHistory: price ? window.initPriceHistory(price) : []
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
  if (checked) {
    // Use claimed feature confirmation
    if (window.claimedFeature && window.claimedFeature.confirmPurchase) {
      const checkbox = event.target;
      const confirmed = confirm('Are you sure you bought this item?');
      
      if (confirmed) {
        window.dbUpdate(window.dbRef(window.db, 'wishlist/' + id), {
          checked: true,
          claimedBy: 'Guest',
          claimedDate: Date.now()
        });
      } else {
        checkbox.checked = false;
      }
    } else {
      window.dbUpdate(window.dbRef(window.db, 'wishlist/' + id), {
        checked: checked
      });
    }
  } else {
    // Unchecking
    const isAdmin = sessionStorage.getItem('isAdmin') === 'true';
    if (isAdmin) {
      window.dbUpdate(window.dbRef(window.db, 'wishlist/' + id), {
        checked: false,
        claimedBy: null,
        claimedDate: null
      });
    } else {
      alert('Only admin can unclaim items');
      event.target.checked = true;
    }
  }
}

// Price update function
window.updateItemPrice = function(id) {
  const isAdmin = sessionStorage.getItem('isAdmin') === 'true';
  if (!isAdmin) {
    alert('Admin access required');
    return;
  }
  
  if (window.priceTracking) {
    window.priceTracking.showPriceUpdateModal(id);
  }
};

// Info modal
function openInfo(id) {
  const item = window.wishlistData[id];
  if (!item) return;
  
  document.getElementById('infoItemName').textContent = item.name;
  
  let infoHTML = item.info ? `<p>${escapeHtml(item.info)}</p>` : '<p>No info available.</p>';
  
  // Add price history if available
  if (window.getPriceHistoryHTML && item.priceHistory && item.priceHistory.length > 0) {
    infoHTML += '<div class="info-section">' + window.getPriceHistoryHTML(item) + '</div>';
  }
  
  document.getElementById('infoContent').innerHTML = infoHTML;
  document.getElementById('infoModal').classList.add('active');
}

function closeInfoModal() {
  document.getElementById('infoModal').classList.remove('active');
}

// Comments modal
function openComments(id) {
  const item = window.wishlistData[id];
  if (!item) return;
  
  const isAdmin = sessionStorage.getItem('isAdmin') === 'true';
  
  document.getElementById('commentsItemName').textContent = item.name;
  const commentsContent = document.getElementById('commentsContent');
  commentsContent.innerHTML = '';
  
  if (item.comments && Object.keys(item.comments).length > 0) {
    Object.entries(item.comments).forEach(([commentId, comment]) => {
      const commentDiv = document.createElement('div');
      commentDiv.className = 'comment';
      
      let commentHTML = `<span class="comment-author">${escapeHtml(comment.author)}:</span> <span class="comment-text">${escapeHtml(comment.text)}</span>`;
      
      if (isAdmin) {
        commentHTML += ` <button class="delete-comment-btn" onclick="deleteComment('${id}', '${commentId}')">×</button>`;
      }
      
      commentDiv.innerHTML = commentHTML;
      commentsContent.appendChild(commentDiv);
    });
  } else {
    commentsContent.innerHTML = '<p style="color: #666;">No comments yet.</p>';
  }
  
  document.getElementById('commentsModal').classList.add('active');
}

function closeCommentsModal() {
  document.getElementById('commentsModal').classList.remove('active');
}

// Delete comment
function deleteComment(itemId, commentId) {
  const isAdmin = sessionStorage.getItem('isAdmin') === 'true';
  if (!isAdmin) {
    alert('Admin access required');
    return;
  }
  
  if (confirm('Delete this comment?')) {
    window.dbRemove(window.dbRef(window.db, 'wishlist/' + itemId + '/comments/' + commentId));
    // Refresh the comments modal
    setTimeout(() => openComments(itemId), 200);
  }
}

// Add comment modal
function openAddComment(id) {
  document.getElementById('commentItemId').value = id;
  document.getElementById('commentAuthor').value = '';
  document.getElementById('commentText').value = '';
  document.getElementById('addCommentModal').classList.add('active');
}

function closeAddCommentModal() {
  document.getElementById('addCommentModal').classList.remove('active');
}

function submitComment() {
  const itemId = document.getElementById('commentItemId').value;
  const author = document.getElementById('commentAuthor').value.trim();
  const text = document.getElementById('commentText').value.trim();
  
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
  
  closeAddCommentModal();
  alert('Comment posted!');
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
  const commentsModal = document.getElementById('commentsModal');
  const addCommentModal = document.getElementById('addCommentModal');
  
  if (e.target === adminModal) closeAdminModal();
  if (e.target === profileModal) closeProfileModal();
  if (e.target === infoModal) closeInfoModal();
  if (e.target === editItemModal) closeEditItemModal();
  if (e.target === commentsModal) closeCommentsModal();
  if (e.target === addCommentModal) closeAddCommentModal();
});
