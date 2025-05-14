// scripts/loadComponent.js
export async function loadComponent(componentPath, containerId) {
  // Ensure componentPath is treated as an absolute path from the domain root
  const absolutePath = componentPath.startsWith('/') ? componentPath : `/${componentPath}`;

  try {
    const response = await fetch(absolutePath);
    if (!response.ok) {
      // Provide more details in the error if fetch fails
      throw new Error(`Failed to fetch ${absolutePath}: ${response.status} ${response.statusText}`);
    }
    const html = await response.text();
    const targetContainer = document.getElementById(containerId);

    if (targetContainer) {
      targetContainer.innerHTML = html; // Inject the HTML content

      // Initialize Alpine.js for the newly added content
      if (window.Alpine && typeof window.Alpine.initTree === 'function') {
        window.Alpine.initTree(targetContainer);
      } else if (window.Alpine) {
        console.warn(`Alpine.js is loaded, but Alpine.initTree() is not available. Components in '${componentPath}' might not initialize correctly. Check Alpine.js version or loading sequence.`);
      } else {
        // This case should ideally not happen if Alpine is included in the HTML page
        console.warn(`Alpine.js not found. Components in '${componentPath}' will not be initialized.`);
      }
    } else {
      console.warn(`Container with ID '${containerId}' not found for component ${componentPath}.`);
    }
  } catch (error) {
    console.error(`Error loading component '${componentPath}' (resolved to '${absolutePath}') into container '#${containerId}':`, error);

    try {
      if (typeof document !== 'undefined' && typeof document.getElementById === 'function') {
        const errorDisplayContainer = document.getElementById(containerId);
        if (errorDisplayContainer) {
          let errorMessageDetail = 'No specific error message available.';
          if (error && error.message) {
            errorMessageDetail = error.message;
          }
          
          let errorStackDetail = '';
          if (error && error.stack) {
            errorStackDetail = String(error.stack)
              .replace(/</g, '<')
              .replace(/>/g, '>')
              .substring(0, 400); 
          }

          errorDisplayContainer.innerHTML = `
            <div class="text-red-700 p-4 border border-red-700 bg-red-100 rounded-md m-2 text-xs" style="font-family: monospace; white-space: pre-wrap; word-break: break-all;">
              <p style="font-weight: bold; color: #B91C1C; font-size: 0.875rem; margin-bottom: 0.5rem;">Error loading: <code>${componentPath}</code> (resolved: <code>${absolutePath}</code>)</p>
              <p style="color: #C2410C; margin-bottom: 0.25rem;"><strong>Message:</strong> ${errorMessageDetail}</p>
              ${errorStackDetail ? `<p style="color: #A16207; margin-top: 0.5rem; font-size: 0.75rem;"><strong>Stack (partial):</strong><br>${errorStackDetail}...</p>` : ''}
              <p style="margin-top: 0.75rem; font-size: 0.75rem; color: #57534E;">Please check the browser's developer console for the full error details and object.</p>
            </div>`;
        } else {
          console.warn(`Container with ID '${containerId}' was not found in the DOM when trying to display a loading error for component '${componentPath}'.`);
        }
      } else {
        console.error('`document` or `document.getElementById` is not available. Cannot display loading error in container.');
      }
    } catch (displayError) {
      console.error('A further error occurred while trying to display the component loading error in its container:', displayError);
    }
  }
}

window.loadComponent = loadComponent;

