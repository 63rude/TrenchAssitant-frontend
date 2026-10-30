import { initializePageComponents } from './loadComponents.js';
import { initializeRecentSessionFeature } from './recentSession.js';

function initializeGlobalScripts() {
  const yearSpan = document.getElementById('currentYear');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  await initializePageComponents();
});

document.addEventListener('componentsLoaded', () => {
  initializeGlobalScripts();
  initializeRecentSessionFeature();
});

document.addEventListener('componentsLoadFailed', (event) => {
  console.error('Could not load page components:', event.detail);
});
