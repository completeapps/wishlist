// Theme Toggle - Simple Dark/Light Mode
(function() {
  // Check saved theme or default to dark
  const savedTheme = localStorage.getItem('wishlist-theme') || 'dark';
  
  // Apply theme on page load
  document.documentElement.setAttribute('data-theme', savedTheme);
  
  // Wait for page to load
  window.addEventListener('DOMContentLoaded', () => {
    // Create theme toggle button
    const themeBtn = document.createElement('button');
    themeBtn.className = 'theme-toggle';
    themeBtn.innerHTML = savedTheme === 'light' ? '🌙' : '☀️';
    themeBtn.title = 'Toggle Theme';
    themeBtn.onclick = toggleTheme;
    
    // Add to body
    document.body.appendChild(themeBtn);
  });
  
  // Toggle theme function
  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('wishlist-theme', newTheme);
    
    // Update button icon
    const btn = document.querySelector('.theme-toggle');
    if (btn) {
      btn.innerHTML = newTheme === 'light' ? '🌙' : '☀️';
    }
  }
})();
