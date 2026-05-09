// Claimed/Purchased Feature
// Better checkbox experience with confirmation

window.claimedFeature = {
  // Show confirmation popup when claiming item
  confirmPurchase: function(itemId, checkbox) {
    if (checkbox.checked) {
      // Ask for confirmation
      const confirmPurchase = confirm('Are you sure you bought this item?');
      
      if (confirmPurchase) {
        // Update in Firebase
        window.dbUpdate(window.dbRef(window.db, 'wishlist/' + itemId), {
          checked: true,
          claimedBy: 'Guest',
          claimedDate: Date.now()
        });
        return true;
      } else {
        // User cancelled, uncheck the box
        checkbox.checked = false;
        return false;
      }
    } else {
      // Unchecking - only allow for admin
      const isAdmin = sessionStorage.getItem('isAdmin') === 'true';
      
      if (isAdmin) {
        // Admin can uncheck
        window.dbUpdate(window.dbRef(window.db, 'wishlist/' + itemId), {
          checked: false,
          claimedBy: null,
          claimedDate: null
        });
        return true;
      } else {
        // Non-admin cannot uncheck
        alert('Only admin can unclaim items');
        checkbox.checked = true;
        return false;
      }
    }
  },
  
  // Get claimed badge HTML
  getClaimedBadge: function() {
    return '<span class="claimed-badge">✓ PURCHASED</span>';
  },
  
  // Check if item is claimed
  isClaimed: function(item) {
    return item.checked && item.claimedBy;
  }
};

// Override the toggleCheck function from script.js
window.toggleCheckWithConfirmation = function(id, checked) {
  const checkbox = event.target;
  
  // Use claimed feature logic
  window.claimedFeature.confirmPurchase(id, checkbox);
};
