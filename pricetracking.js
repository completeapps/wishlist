// Price Tracking Feature
// Track price changes over time

window.priceTracking = {
  // Initialize price history when item is created
  initPriceHistory: function(price) {
    return [{
      price: price,
      date: Date.now(),
      note: 'Original price'
    }];
  },
  
  // Update price and add to history
  updatePrice: function(itemId, newPrice, note = 'Price updated') {
    const item = window.wishlistData[itemId];
    if (!item) return;
    
    // Get existing price history or create new one
    const priceHistory = item.priceHistory || this.initPriceHistory(item.price);
    
    // Add new price entry
    priceHistory.push({
      price: newPrice,
      date: Date.now(),
      note: note
    });
    
    // Update item in Firebase
    window.dbUpdate(window.dbRef(window.db, 'wishlist/' + itemId), {
      price: newPrice,
      priceHistory: priceHistory
    });
  },
  
  // Show price update modal
  showPriceUpdateModal: function(itemId) {
    const item = window.wishlistData[itemId];
    if (!item) return;
    
    const newPrice = prompt(`Update price for "${item.name}"\n\nCurrent: ${item.price}\nEnter new price:`);
    
    if (newPrice && newPrice.trim() !== '') {
      this.updatePrice(itemId, newPrice.trim());
      alert('Price updated!');
    }
  },
  
  // Get price history HTML
  getPriceHistoryHTML: function(item) {
    if (!item.priceHistory || item.priceHistory.length === 0) {
      return '<p style="color: #666;">No price history available.</p>';
    }
    
    let html = '<div class="price-history">';
    html += '<h4 style="margin-bottom: 15px; color: #8b5cf6;">Price History</h4>';
    
    // Reverse to show newest first
    const history = [...item.priceHistory].reverse();
    
    history.forEach((entry, index) => {
      const date = new Date(entry.date).toLocaleDateString();
      const isLatest = index === 0;
      const isPriceChange = index < history.length - 1;
      
      html += `<div class="price-entry ${isLatest ? 'latest' : ''}">`;
      html += `<span class="price-value">${entry.price}</span>`;
      html += `<span class="price-date">${date}</span>`;
      
      // Show price change indicator
      if (isPriceChange && index < history.length - 1) {
        const oldPrice = parseFloat(history[index + 1].price.replace(/[^0-9.]/g, ''));
        const newPrice = parseFloat(entry.price.replace(/[^0-9.]/g, ''));
        
        if (newPrice < oldPrice) {
          const savings = (oldPrice - newPrice).toFixed(2);
          html += `<span class="price-change down">↓ Saved $${savings}</span>`;
        } else if (newPrice > oldPrice) {
          const increase = (newPrice - oldPrice).toFixed(2);
          html += `<span class="price-change up">↑ +$${increase}</span>`;
        }
      }
      
      if (entry.note) {
        html += `<span class="price-note">${entry.note}</span>`;
      }
      
      html += '</div>';
    });
    
    html += '</div>';
    return html;
  },
  
  // Get current vs original price comparison
  getPriceComparison: function(item) {
    if (!item.priceHistory || item.priceHistory.length < 2) {
      return null;
    }
    
    const originalPrice = parseFloat(item.priceHistory[0].price.replace(/[^0-9.]/g, ''));
    const currentPrice = parseFloat(item.price.replace(/[^0-9.]/g, ''));
    
    if (currentPrice < originalPrice) {
      const savings = (originalPrice - currentPrice).toFixed(2);
      return `<span class="price-savings">💰 $${savings} off original price!</span>`;
    } else if (currentPrice > originalPrice) {
      const increase = (currentPrice - originalPrice).toFixed(2);
      return `<span class="price-increase">📈 +$${increase} from original</span>`;
    }
    
    return null;
  }
};

// Global functions
window.updateItemPrice = function(itemId) {
  const isAdmin = sessionStorage.getItem('isAdmin') === 'true';
  if (!isAdmin) {
    alert('Admin access required');
    return;
  }
  
  window.priceTracking.showPriceUpdateModal(itemId);
};

window.getPriceHistoryHTML = function(item) {
  return window.priceTracking.getPriceHistoryHTML(item);
};

window.getPriceComparison = function(item) {
  return window.priceTracking.getPriceComparison(item);
};

window.initPriceHistory = function(price) {
  return window.priceTracking.initPriceHistory(price);
};
