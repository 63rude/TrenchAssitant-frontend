console.log('[loadComponents.js] Script loaded.');

async function fetchComponent(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch component ${url}: ${response.status} ${response.statusText}`);
  }
  return response.text();
}

// Define components to load: [containerIdToInjectInto, htmlFilePath]
// The component's HTML will replace the content of the containerId.
const componentsToLoad = [
  { containerId: 'navbar-container', filePath: 'components/Navbar.html' },
  { containerId: 'hero-container', filePath: 'components/Hero.html' },
  { containerId: 'recent-session-container', filePath: 'components/RecentSession.html' },
  { containerId: 'features-container', filePath: 'components/Features.html' },
  { containerId: 'how-it-works-container', filePath: 'components/HowItWorks.html' },
  { containerId: 'limitations-container', filePath: 'components/Limitations.html' },
  { containerId: 'roadmap-container', filePath: 'components/Roadmap.html' },
  { containerId: 'footer-container', filePath: 'components/Footer.html' }
];

export async function initializePageComponents() {
  console.log('[loadComponents.js] initializePageComponents called.');
  try {
    for (const component of componentsToLoad) {
      const container = document.getElementById(component.containerId);
      if (container) {
        console.log(`[loadComponents.js] Loading ${component.filePath} into #${component.containerId}`);
        const html = await fetchComponent(component.filePath);
        container.innerHTML = html; // Replaces content of container (e.g., placeholder divs)
        console.log(`[loadComponents.js] Successfully loaded ${component.filePath} into #${component.containerId}`);
      } else {
        console.warn(`[loadComponents.js] Container #${component.containerId} not found for ${component.filePath}. Skipping.`);
      }
    }
    console.log('[loadComponents.js] All components loaded successfully. Dispatching componentsLoaded event.');
    document.dispatchEvent(new CustomEvent('componentsLoaded'));
  } catch (error) {
    console.error('[loadComponents.js] Error loading components:', error);
    document.dispatchEvent(new CustomEvent('componentsLoadFailed', { detail: { error: error.message || String(error) } }));
  }
}
