// scripts/loadPageShell.js
import { loadComponent } from './loadComponent.js';

document.addEventListener('DOMContentLoaded', async () => {
  try {
    await Promise.all([
      loadComponent('components/Navbar.html', 'navbar-container'),
      loadComponent('components/Footer.html', 'footer-container')
    ]);
    console.log('Navbar and Footer loaded successfully for static page.');

    // Alpine.js should auto-initialize itself from the CDN script with `defer`.
    // Explicitly calling Alpine.start() here is generally not needed and removed.

  } catch (error) {
    console.error('Error loading page shell components (Navbar/Footer):', error);
    const body = document.querySelector('body');
    if (body) {
      const errorDiv = document.createElement('div');
      errorDiv.className = 'text-red-500 text-center p-8 text-xl';
      errorDiv.textContent = 'Failed to load essential page components. Please try refreshing.';
      const navbarContainer = document.getElementById('navbar-container');
      if (navbarContainer && !navbarContainer.innerHTML.trim()) {
         navbarContainer.appendChild(errorDiv.cloneNode(true));
      }
      const footerContainer = document.getElementById('footer-container');
       if (footerContainer && !footerContainer.innerHTML.trim()) {
         footerContainer.appendChild(errorDiv.cloneNode(true));
      }
    }
  }
});
