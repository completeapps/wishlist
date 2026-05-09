// Theme Toggle - Dark/Light Mode
// Manages theme switching and saves preference

(function() {
  // Check saved theme or default to dark
  const savedTheme = localStorage.getItem('wishlist-theme') || 'dark';
  
  // Apply theme on page load
  document.documentElement.setAttribute('data-theme', savedTheme);
  
  // Create theme toggle button
  window.addEventListener('DOMContentLoaded', () => {
    // Add toggle button to admin controls
    const adminControls = document.querySelector('.admin-controls');
    const themeBtn = document.createElement('button');
    themeBtn.id = 'themeToggle';
    themeBtn.className = 'theme-toggle-btn';
    themeBtn.innerHTML = savedTheme === 'light' ? '🌙' : '☀️';
    themeBtn.title = 'Toggle Theme';
    themeBtn.onclick = toggleTheme;
    
    // Insert before admin button
    adminControls.insertBefore(themeBtn, adminControls.firstChild);
  });
  
  // Toggle theme function
  window.toggleTheme = function() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('wishlist-theme', newTheme);
    
    // Update button icon
    const btn = document.getElementById('themeToggle');
    btn.innerHTML = newTheme === 'light' ? '🌙' : '☀️';
  };
})();
