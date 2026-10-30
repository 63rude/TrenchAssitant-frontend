
import { updateHeroStatusIndicator, updateRecentSessionStatus } from './statusIndicator.js';
import { fetchAndDisplayLogs } from './logs.js';
import { fetchAndDisplayResults } from './results.js';

const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || '';
let pollIntervalId = null;


async function pollStatus(sessionId, runAnalysisButton, walletAddress) {
  try {
    const response = await fetch(`${API_BASE}/get_session_status/${sessionId}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: "Failed to parse error from status endpoint." }));
      console.error('[pollStatus] API error:', errorData);
      updateHeroStatusIndicator('error', 'Polling Error', errorData.detail || `Server error: ${response.status}.`);
      clearInterval(pollIntervalId); pollIntervalId = null;
      if (runAnalysisButton) runAnalysisButton.disabled = false;
      return;
    }

    const data = await response.json();

    const status = data.status ? data.status.toLowerCase() : 'unknown';

    switch (status) {
      case 'pending':
        updateHeroStatusIndicator('running', 'Analysis Pending', data.message || 'Your request is queued...');
        fetchAndDisplayLogs(sessionId);
        break;
      case 'running':
        updateHeroStatusIndicator('running', 'Analysis in Progress', data.message || 'Processing your request...');
        fetchAndDisplayLogs(sessionId);
        break;
      case 'completed':
        clearInterval(pollIntervalId); pollIntervalId = null;
        if (runAnalysisButton) runAnalysisButton.disabled = false;
        fetchAndDisplayResults(walletAddress); 
        fetchAndDisplayLogs(sessionId);
        break;
      case 'failed':
        console.error('[pollStatus] Status failed:', data.message);
        updateHeroStatusIndicator('error', 'Analysis Failed', data.message || 'An error occurred during analysis.');
        clearInterval(pollIntervalId); pollIntervalId = null;
        if (runAnalysisButton) runAnalysisButton.disabled = false;
        fetchAndDisplayLogs(sessionId);
        break;
      default:
        console.warn('[pollStatus] Unknown status:', data.status);
        updateHeroStatusIndicator('error', 'Unknown Status', `Received an unexpected status: ${data.status}`);
        clearInterval(pollIntervalId); pollIntervalId = null;
        if (runAnalysisButton) runAnalysisButton.disabled = false;
    }
  } catch (error) {
    console.error('[pollStatus] Catch block error:', error);
    updateHeroStatusIndicator('error', 'Polling Error', 'Could not retrieve status. Check console.');
    clearInterval(pollIntervalId); pollIntervalId = null;
    if (runAnalysisButton) runAnalysisButton.disabled = false;
  }
}

function initializeHeroSectionInteractions() {
  updateHeroStatusIndicator('idle');

  const runAnalysisButton = document.getElementById('runAnalysisBtn');
  const walletAddressInput = document.getElementById('walletAddressInput');

  const heroLogsContainer = document.getElementById('hero-session-logs-container');
  const heroResultsContainer = document.getElementById('hero-session-results-container');
  const heroLogsContent = document.getElementById('hero-session-logs-content');
  const heroResultsContent = document.getElementById('hero-session-results-content');

  if (runAnalysisButton && walletAddressInput) {
    runAnalysisButton.addEventListener('click', async () => {
      const walletAddress = walletAddressInput.value.trim();

      if (!walletAddress) {
        updateHeroStatusIndicator('error', 'Input Error', 'Please enter a wallet address.');
        if (runAnalysisButton) runAnalysisButton.disabled = false;
        return;
      }

      runAnalysisButton.disabled = true;
      updateHeroStatusIndicator('loading', 'Starting Session...', 'Initializing analysis for your wallet.');

      if (heroLogsContent) heroLogsContent.innerHTML = '';
      if (heroResultsContent) heroResultsContent.innerHTML = '';

      if (heroLogsContainer) heroLogsContainer.classList.add('hidden');
      if (heroResultsContainer) heroResultsContainer.classList.add('hidden');

      if (pollIntervalId) {
        clearInterval(pollIntervalId);
        pollIntervalId = null;
      }

      try {
        const response = await fetch(`${API_BASE}/start_session`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ wallet: walletAddress })
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ detail: "Failed to parse error from start_session." }));
          console.error('[session.js] /start_session API error response:', errorData);
          throw new Error(errorData.detail || `Server error: ${response.status}`);
        }

        const data = await response.json();

        if (data && typeof data === 'object' && data.session_id && typeof data.session_id === 'string' && data.session_id.trim() !== '') {
          const sessionId = data.session_id;
          updateHeroStatusIndicator('loading', 'Session Started', `Polling status for session ID: ${sessionId.substring(0, 8)}...`);
          pollIntervalId = setInterval(() => pollStatus(sessionId, runAnalysisButton, walletAddress), 5000);
          pollStatus(sessionId, runAnalysisButton, walletAddress);
        } else {
          console.error('Invalid or missing session ID in backend response.');
          updateHeroStatusIndicator('error', 'Session Error', 'Invalid session data from server.');
          if (runAnalysisButton) runAnalysisButton.disabled = false;
        }
      } catch (error) {
        console.error('[session.js] Catch block error during /start_session or polling setup:', error);
        updateHeroStatusIndicator('error', 'Session Error', error.message || 'Could not start the analysis session.');
        if (runAnalysisButton) runAnalysisButton.disabled = false;
      }
    });
  } else {
    console.error('Wallet input or analysis button was not found.');
  }
}

document.addEventListener('componentsLoaded', () => {
  initializeHeroSectionInteractions();
});
