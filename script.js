// Toggle add item form
function toggleAddForm() {
  const form = document.getElementById('addForm');
  form.classList.toggle('active');
  
  // Clear form inputs when closing
  if (!form.classList.contains('active')) {
    document.getElementById('itemName').value = '';
    document.getElementById('itemPrice').value = '';
    document.getElementById('itemLink').value = '';
  }
}

// Add new item to wishlist
function addItem() {
  const name = document.getElementById('itemName').value.trim();
  const price = document.getElementById('itemPrice').value.trim();
  const link = document.getElementById('itemLink').value.trim();
  
  if (!name) {
    alert('Please enter an item name');
    return;
  }
  
  const grid = document.getElementById('wishlistGrid');
  
  // Create new item element
  const itemDiv = document.createElement('div');
  itemDiv.className = 'wishlist-item';
  
  itemDiv.innerHTML = `
    <div class="item-header">
      <h3 class="item-name">${escapeHtml(name)}</h3>
      <button class="delete-btn" onclick="deleteItem(this)">×</button>
    </div>
    ${price ? `<p class="item-price">${escapeHtml(price)}</p>` : ''}
    ${link ? `<a href="${escapeHtml(link)}" target="_blank" class="item-link">View →</a>` : ''}
  `;
  
  grid.appendChild(itemDiv);
  
  // Close form and clear inputs
  toggleAddForm();
  
  // Save to localStorage
  saveWishlist();
}

// Delete item from wishlist
function deleteItem(button) {
  if (confirm('Remove this item from your wishlist?')) {
    button.closest('.wishlist-item').remove();
    saveWishlist();
  }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Save wishlist to localStorage
function saveWishlist() {
  const grid = document.getElementById('wishlistGrid');
  const items = [];
  
  grid.querySelectorAll('.wishlist-item').forEach(item => {
    const name = item.querySelector('.item-name').textContent;
    const priceEl = item.querySelector('.item-price');
    const linkEl = item.querySelector('.item-link');
    
    items.push({
      name: name,
      price: priceEl ? priceEl.textContent : '',
      link: linkEl ? linkEl.getAttribute('href') : ''
    });
  });
  
  localStorage.setItem('wishlist', JSON.stringify(items));
}

// Load wishlist from localStorage
function loadWishlist() {
  const saved = localStorage.getItem('wishlist');
  if (!saved) return;
  
  const items = JSON.parse(saved);
  const grid = document.getElementById('wishlistGrid');
  
  // Clear current items (except samples on first load)
  grid.innerHTML = '';
  
  items.forEach(item => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'wishlist-item';
    
    itemDiv.innerHTML = `
      <div class="item-header">
        <h3 class="item-name">${escapeHtml(item.name)}</h3>
        <button class="delete-btn" onclick="deleteItem(this)">×</button>
      </div>
      ${item.price ? `<p class="item-price">${escapeHtml(item.price)}</p>` : ''}
      ${item.link ? `<a href="${escapeHtml(item.link)}" target="_blank" class="item-link">View →</a>` : ''}
    `;
    
    grid.appendChild(itemDiv);
  });
}

// Load wishlist on page load
window.addEventListener('DOMContentLoaded', loadWishlist);
