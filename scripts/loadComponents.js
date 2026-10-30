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
  try {
    for (const component of componentsToLoad) {
      const container = document.getElementById(component.containerId);
      if (container) {
        const html = await fetchComponent(component.filePath);
        container.innerHTML = html; // Replaces content of container (e.g., placeholder divs)
      } else {
        console.warn(`[loadComponents.js] Container #${component.containerId} not found for ${component.filePath}. Skipping.`);
      }
    }
    document.dispatchEvent(new CustomEvent('componentsLoaded'));
  } catch (error) {
    console.error('[loadComponents.js] Error loading components:', error);
    document.dispatchEvent(new CustomEvent('componentsLoadFailed', { detail: { error: error.message || String(error) } }));
  }
}
