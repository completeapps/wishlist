// Private Items Feature
// Admin-only visibility for certain items

window.privateFeature = {
  // Check if user is admin
  isAdmin: function() {
    return sessionStorage.getItem('isAdmin') === 'true';
  },
  
  // Check if item should be visible to current user
  isVisible: function(item) {
    // If item is not private, everyone can see it
    if (!item.isPrivate) {
      return true;
    }
    
    // If item is private, only admin can see it
    return this.isAdmin();
  },
  
  // Get private badge HTML for admin view
  getPrivateBadge: function() {
    return '<span class="private-badge">🔒 PRIVATE</span>';
  },
  
  // Toggle private status (admin only)
  togglePrivate: function(itemId, isPrivate) {
    if (!this.isAdmin()) {
      alert('Admin access required');
      return false;
    }
    
    window.dbUpdate(window.dbRef(window.db, 'wishlist/' + itemId), {
      isPrivate: isPrivate
    });
    
    return true;
  },
  
  // Filter items based on visibility
  filterVisibleItems: function(items) {
    const visibleItems = {};
    
    Object.keys(items).forEach(key => {
      if (this.isVisible(items[key])) {
        visibleItems[key] = items[key];
      }
    });
    
    return visibleItems;
  }
};

// Make functions globally available
window.isItemVisible = function(item) {
  return window.privateFeature.isVisible(item);
};

window.getPrivateBadge = function() {
  return window.privateFeature.getPrivateBadge();
};
