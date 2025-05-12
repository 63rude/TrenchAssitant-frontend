export function updateHeroStatusIndicator(type, titleText, messageText) {
  const container = document.getElementById('hero-status-indicator-container');
  if (!container) return;
  let bgColor, borderColor, textColor, iconSvg;
  switch (type) {
    case 'loading':
      bgColor = 'bg-yellow-100'; borderColor = 'border-yellow-500'; textColor = 'text-yellow-700';
      iconSvg = `<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`;
      break;
    case 'running':
      bgColor = 'bg-blue-100'; borderColor = 'border-blue-500'; textColor = 'text-blue-700';
      iconSvg = `<svg class="h-5 w-5 text-blue-600 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" /></svg>`;
      break;
    case 'success':
      bgColor = 'bg-green-100'; borderColor = 'border-green-500'; textColor = 'text-green-700';
      iconSvg = `<svg class="h-5 w-5 text-green-600 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>`;
      break;
    case 'error':
      bgColor = 'bg-red-100'; borderColor = 'border-red-500'; textColor = 'text-red-700';
      iconSvg = `<svg class="h-5 w-5 text-red-600 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" /></svg>`;
      break;
    case 'idle':
      container.innerHTML = `<div class="status-indicator-wrapper"><p class="text-sm text-indigo-200">Enter a wallet address and click "Run Analysis".</p></div>`;
      return;
    default:
      container.innerHTML = ''; return;
  }
  container.innerHTML = `
    <div class="${bgColor} border-l-4 ${borderColor} ${textColor} p-4 rounded-md shadow status-indicator-wrapper" role="alert">
      <div class="flex items-center">
        ${iconSvg}
        <div>
          <p class="font-semibold">${titleText}</p>
          <p class="text-sm">${messageText}</p>
        </div>
      </div>
    </div>`;
}

export function updateRecentSessionStatus(type, message) {
  const container = document.getElementById('recent-session-status-container');
  if (!container) return;
  let bgColor, borderColor, textColor, iconSvg;

  switch (type) {
      case 'loading':
          bgColor = 'bg-yellow-50'; borderColor = 'border-yellow-400'; textColor = 'text-yellow-700';
          iconSvg = `<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`;
          break;
      case 'success':
          bgColor = 'bg-green-50'; borderColor = 'border-green-400'; textColor = 'text-green-700';
          iconSvg = `<svg class="h-5 w-5 text-green-600 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>`;
          break;
      case 'error':
          bgColor = 'bg-red-50'; borderColor = 'border-red-400'; textColor = 'text-red-700';
          iconSvg = `<svg class="h-5 w-5 text-red-600 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" /></svg>`;
          break;
      case 'idle':
           container.innerHTML = ''; // Clear status
           return;
      default:
          container.innerHTML = ''; return;
  }
  container.innerHTML = `
      <div class="${bgColor} border-l-4 ${borderColor} ${textColor} p-3 rounded-md shadow-sm" role="alert">
        <div class="flex items-center">
          ${iconSvg}
          <p class="text-sm">${message}</p>
        </div>
      </div>`;
}
