// Global Variables
window.wishlistData = {};
window.editingItemId = null;
const ADMIN_PASSWORD = "admin123"; // Change this!

// Load Wishlist from Firebase
window.loadWishlist = function() {
    const wishlistRef = window.dbRef(window.db, 'wishlist');
    
    window.dbOnValue(wishlistRef, (snapshot) => {
        window.wishlistData = snapshot.val() || {};
        displayItems();
    });
};

// Display Items
function displayItems() {
    const container = document.getElementById('wishlistItems');
    const isAdmin = sessionStorage.getItem('isAdmin') === 'true';
    
    // Filter items based on privacy
    let items = window.wishlistData;
    if (!isAdmin) {
        items = window.privateFeature.filterVisibleItems(items);
    }
    
    if (Object.keys(items).length === 0) {
        container.innerHTML = '<p class="empty-state">No items in wishlist yet!</p>';
        return;
    }
    
    // Sort by priority
    const sortedItems = Object.entries(items).sort((a, b) => {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a[1].priority] - priorityOrder[b[1].priority];
    });
    
    let html = '';
    sortedItems.forEach(([id, item]) => {
        const claimed = window.claimedFeature.isClaimed(item);
        const priceComparison = window.getPriceComparison(item);
        
        html += `
            <div class="wishlist-item ${claimed ? 'claimed' : ''}" data-priority="${item.priority}">
                ${item.image ? `<img src="${item.image}" alt="${item.name}">` : ''}
                
                <div class="item-content">
                    <div class="item-header">
                        <h3>${item.name}</h3>
                        <div class="item-badges">
                            ${item.isPrivate && isAdmin ? window.getPrivateBadge() : ''}
                            ${item.category ? `<span class="category-badge">${item.category}</span>` : ''}
                            <span class="priority-badge priority-${item.priority}">${item.priority}</span>
                        </div>
                    </div>
                    
                    <p class="item-price">${item.price}</p>
                    ${priceComparison ? priceComparison : ''}
                    
                    ${item.tags ? `<div class="item-tags">${window.tagsFeature.getTagsHTML(item.tags)}</div>` : ''}
                    
                    ${item.notes ? `<p class="item-notes">${item.notes}</p>` : ''}
                    
                    <div class="item-actions">
                        ${item.link ? `<a href="${item.link}" target="_blank" class="btn-link">🔗 View</a>` : ''}
                        <button onclick="showInfo('${id}')" class="btn-info">ℹ️ Info</button>
                        ${isAdmin ? `<button onclick="updateItemPrice('${id}')" class="btn-price">💲 Price</button>` : ''}
                        ${isAdmin ? `<button onclick="editItem('${id}')" class="btn-edit">✏️ Edit</button>` : ''}
                        ${isAdmin ? `<button onclick="deleteItem('${id}')" class="btn-delete">🗑️ Delete</button>` : ''}
                        
                        <label class="checkbox-container">
                            <input type="checkbox" ${claimed ? 'checked' : ''} 
                                   onchange="window.claimedFeature.confirmPurchase('${id}', this)">
                            <span class="checkbox-label">${claimed ? 'Purchased' : 'Mark Purchased'}</span>
                        </label>
                    </div>
                    
                    ${claimed ? window.claimedFeature.getClaimedBadge() : ''}
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Show Info Modal
window.showInfo = function(id) {
    const item = window.wishlistData[id];
    if (!item) return;
    
    const priceHistory = window.getPriceHistoryHTML(item);
    const isAdmin = sessionStorage.getItem('isAdmin') === 'true';
    
    let html = `
        <h2>${item.name}</h2>
        ${item.image ? `<img src="${item.image}" alt="${item.name}" style="max-width: 300px; border-radius: 8px; margin: 15px 0;">` : ''}
        
        <div class="info-section">
            <h3>💰 Price Information</h3>
            <p><strong>Current Price:</strong> ${item.price}</p>
            ${priceHistory}
        </div>
        
        <div class="info-section">
            <h3>📋 Details</h3>
            ${item.category ? `<p><strong>Category:</strong> ${item.category}</p>` : ''}
            <p><strong>Priority:</strong> <span class="priority-badge priority-${item.priority}">${item.priority}</span></p>
            ${item.tags ? `<p><strong>Tags:</strong> ${window.tagsFeature.getTagsHTML(item.tags)}</p>` : ''}
            ${item.notes ? `<p><strong>Notes:</strong> ${item.notes}</p>` : ''}
            ${item.isPrivate && isAdmin ? '<p><strong>Visibility:</strong> 🔒 Private</p>' : ''}
        </div>
        
        ${item.link ? `
            <div class="info-section">
                <h3>🔗 Link</h3>
                <a href="${item.link}" target="_blank" class="link-preview">${item.link}</a>
            </div>
        ` : ''}
        
        ${item.claimedBy ? `
            <div class="info-section claimed-info">
                <h3>✓ Purchase Status</h3>
                <p><strong>Claimed by:</strong> ${item.claimedBy}</p>
                <p><strong>Date:</strong> ${new Date(item.claimedDate).toLocaleDateString()}</p>
            </div>
        ` : ''}
    `;
    
    document.getElementById('infoContent').innerHTML = html;
    document.getElementById('infoModal').style.display = 'block';
};

window.closeInfoModal = function() {
    document.getElementById('infoModal').style.display = 'none';
};

// Add/Edit Item Functions
window.showAddForm = function() {
    window.editingItemId = null;
    document.getElementById('modalTitle').textContent = 'Add New Item';
    document.getElementById('itemForm').reset();
    document.getElementById('itemModal').style.display = 'block';
};

window.editItem = function(id) {
    const item = window.wishlistData[id];
    if (!item) return;
    
    window.editingItemId = id;
    document.getElementById('modalTitle').textContent = 'Edit Item';
    document.getElementById('itemName').value = item.name;
    document.getElementById('itemPrice').value = item.price;
    document.getElementById('itemLink').value = item.link || '';
    document.getElementById('itemImage').value = item.image || '';
    document.getElementById('itemCategory').value = item.category || '';
    document.getElementById('itemPriority').value = item.priority || 'medium';
    document.getElementById('itemTags').value = item.tags || '';
    document.getElementById('itemNotes').value = item.notes || '';
    document.getElementById('itemPrivate').checked = item.isPrivate || false;
    document.getElementById('itemModal').style.display = 'block';
};

window.closeModal = function() {
    document.getElementById('itemModal').style.display = 'none';
    window.editingItemId = null;
};

// Form Submit
document.getElementById('itemForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const itemData = {
        name: document.getElementById('itemName').value,
        price: document.getElementById('itemPrice').value,
        link: document.getElementById('itemLink').value,
        image: document.getElementById('itemImage').value,
        category: document.getElementById('itemCategory').value,
        priority: document.getElementById('itemPriority').value,
        tags: document.getElementById('itemTags').value,
        notes: document.getElementById('itemNotes').value,
        isPrivate: document.getElementById('itemPrivate').checked,
        checked: false
    };
    
    // Initialize price history for new items
    if (!window.editingItemId) {
        itemData.priceHistory = window.initPriceHistory(itemData.price);
    }
    
    if (window.editingItemId) {
        // Update existing item
        const existingItem = window.wishlistData[window.editingItemId];
        
        // Check if price changed
        if (existingItem.price !== itemData.price) {
            itemData.priceHistory = existingItem.priceHistory || window.initPriceHistory(existingItem.price);
            itemData.priceHistory.push({
                price: itemData.price,
                date: Date.now(),
                note: 'Price updated'
            });
        } else {
            itemData.priceHistory = existingItem.priceHistory;
        }
        
        window.dbSet(window.dbRef(window.db, 'wishlist/' + window.editingItemId), itemData);
    } else {
        // Add new item
        const newItemRef = window.dbPush(window.dbRef(window.db, 'wishlist'));
        window.dbSet(newItemRef, itemData);
    }
    
    closeModal();
});

// Delete Item
window.deleteItem = function(id) {
    if (confirm('Are you sure you want to delete this item?')) {
        window.dbRemove(window.dbRef(window.db, 'wishlist/' + id));
    }
};

// Admin Functions
window.showAdminLogin = function() {
    if (sessionStorage.getItem('isAdmin') === 'true') {
        alert('Already logged in as admin!');
        return;
    }
    document.getElementById('adminModal').style.display = 'block';
};

window.closeAdminModal = function() {
    document.getElementById('adminModal').style.display = 'none';
};

document.getElementById('adminForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const password = document.getElementById('adminPassword').value;
    
    if (password === ADMIN_PASSWORD) {
        sessionStorage.setItem('isAdmin', 'true');
        document.getElementById('adminControls').style.display = 'block';
        document.querySelector('.admin-btn').style.display = 'none';
        closeAdminModal();
        displayItems();
        alert('Welcome, Admin!');
    } else {
        alert('Incorrect password!');
    }
});

window.logout = function() {
    sessionStorage.removeItem('isAdmin');
    document.getElementById('adminControls').style.display = 'none';
    document.querySelector('.admin-btn').style.display = 'block';
    displayItems();
    alert('Logged out successfully!');
};

// Check admin status on load
if (sessionStorage.getItem('isAdmin') === 'true') {
    document.getElementById('adminControls').style.display = 'block';
    document.querySelector('.admin-btn').style.display = 'none';
}

// Close modals on outside click
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
};
