// scripts/main.js
import { initializePageComponents } from './loadComponents.js';
import { initializeRecentSessionFeature } from './recentSession.js';

console.log('[main.js] Script loaded.');

function initializeGlobalScripts() {
  console.log('[main.js] Initializing global scripts...');
  // Set copyright year in footer
  const yearSpan = document.getElementById('currentYear'); // Depends on Footer.html
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  } else {
    console.warn('[main.js] currentYear element not found in footer.');
  }

  // Alpine.js initialization:
  // The Alpine.js CDN script with `defer` should handle its own initialization.
  // Explicitly calling Alpine.start() can lead to "already initialized" warnings
  // if the CDN script also calls it. We'll rely on the CDN's behavior.
  if (typeof Alpine !== 'undefined') {
    console.log('[main.js] Alpine.js is available.');
    // If Alpine.start() is needed and not auto-run by CDN:
    // if (!Alpine.isStarted) { // Or a similar check if available
    //   Alpine.start();
    // }
  } else {
    console.warn('[main.js] Alpine.js not detected.');
  }
  
  console.log('[main.js] Global scripts initialized.');
}

document.addEventListener('DOMContentLoaded', async () => {
  console.log('[main.js] DOMContentLoaded event fired. Starting component loading.');
  // initializePageComponents will dispatch 'componentsLoaded' or 'componentsLoadFailed'
  await initializePageComponents(); 
});

document.addEventListener('componentsLoaded', () => {
  console.log('[main.js] Event: componentsLoaded received. Initializing global scripts and features.');
  initializeGlobalScripts(); 
  initializeRecentSessionFeature(); // Depends on RecentSession.html
});

document.addEventListener('componentsLoadFailed', (event) => {
  console.error('[main.js] Event: componentsLoadFailed received. Some initializations might be skipped.', event.detail);
  // Potentially initialize parts that don't depend on failed components, or show a global error.
});
