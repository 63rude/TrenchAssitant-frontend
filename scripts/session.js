console.log('[session.js] Script loaded and parsing started. (Top of file)');

import { updateHeroStatusIndicator, updateRecentSessionStatus } from './statusIndicator.js';
import { fetchAndDisplayLogs } from './logs.js';
import { fetchAndDisplayResults } from './results.js';

const API_BASE = 'https://trenchassistant-python.onrender.com';
let pollIntervalId = null;

console.log('[session.js] Imports loaded, API_BASE and pollIntervalId initialized.');

async function pollStatus(sessionId, runAnalysisButton, walletAddress) {
  console.log('[pollStatus] Called for session:', sessionId, 'Wallet:', walletAddress);
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
    console.log('[pollStatus] Received data:', data);

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
        console.log('[pollStatus] Status completed. Fetching results for wallet:', walletAddress);
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
  console.log('[session.js] initializeHeroSectionInteractions called.');
  updateHeroStatusIndicator('idle');

  const runAnalysisButton = document.getElementById('runAnalysisBtn');
  const walletAddressInput = document.getElementById('walletAddressInput');

  const heroLogsContainer = document.getElementById('hero-session-logs-container');
  const heroResultsContainer = document.getElementById('hero-session-results-container');
  const heroLogsContent = document.getElementById('hero-session-logs-content');
  const heroResultsContent = document.getElementById('hero-session-results-content');

  if (runAnalysisButton && walletAddressInput) {
    console.log('[session.js] runAnalysisButton and walletAddressInput FOUND in Hero section. Attaching event listener.');
    runAnalysisButton.addEventListener('click', async () => {
      console.log('[session.js] runAnalysisButton CLICKED.');
      const walletAddress = walletAddressInput.value.trim();
      console.log('[session.js] Wallet address input value:', `"${walletAddress}"`);

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
        console.log('[session.js] Clearing existing poll interval before starting new session.');
        clearInterval(pollIntervalId);
        pollIntervalId = null;
      }

      try {
        console.log('[session.js] Sending /start_session request for address:', walletAddress);
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
          console.log('[session.js] Session ID received:', sessionId, 'Starting polling for wallet:', walletAddress);
          updateHeroStatusIndicator('loading', 'Session Started', `Polling status for session ID: ${sessionId.substring(0, 8)}...`);
          pollIntervalId = setInterval(() => pollStatus(sessionId, runAnalysisButton, walletAddress), 5000);
          pollStatus(sessionId, runAnalysisButton, walletAddress);
        } else {
          const dataType = data === null ? 'null' : Array.isArray(data) ? 'array' : typeof data;
          console.error(`[session.js] Invalid or missing session_id. Received type: ${dataType}.`, data);
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
    console.error('[session.js] CRITICAL: runAnalysisButton or walletAddressInput NOT FOUND. Event listener NOT attached.');
  }
}

document.addEventListener('componentsLoaded', () => {
  console.log('[session.js] Event: componentsLoaded received. Initializing hero section interactions.');
  initializeHeroSectionInteractions();
});

console.log('[session.js] Script parsing finished. Event listeners set up. (End of file)');
