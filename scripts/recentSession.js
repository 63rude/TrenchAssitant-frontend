import { fetchAndDisplayResults } from './results.js';
import { updateRecentSessionStatus } from './statusIndicator.js';

// Function to initialize the recent session feature
export function initializeRecentSessionFeature() {
  const recentSessionInput = document.getElementById('recentSessionInput');
  const loadRecentResultsBtn = document.getElementById('loadRecentResultsBtn');
  const recentSessionStatusContainer = document.getElementById('recent-session-status-container');
  const recentSessionResultsContainer = document.getElementById('recent-session-results-container');
  const recentSessionResultsContent = document.getElementById('recent-session-results-content');

  if (
    recentSessionInput &&
    loadRecentResultsBtn &&
    recentSessionStatusContainer &&
    recentSessionResultsContainer &&
    recentSessionResultsContent
  ) {
    loadRecentResultsBtn.addEventListener('click', async () => {
      const walletAddress = recentSessionInput.value.trim();
      if (!walletAddress) {
        updateRecentSessionStatus('error', 'Wallet Address Required', 'Please enter a wallet address.');
        return;
      }

      updateRecentSessionStatus(
        'loading',
        'Loading Results',
        `Loading results for wallet ${walletAddress.substring(0, 8)}...`
      );

      recentSessionResultsContainer.classList.remove('hidden');
      recentSessionResultsContent.innerHTML =
        '<p class="text-center text-gray-400">Loading results...</p>';

      try {
        await fetchAndDisplayResults(
          walletAddress,
          'recent-session-results-container',
          'recent-session-results-content'
        );
        updateRecentSessionStatus('success', 'Results Loaded', 'Previous session results are displayed below.');
      } catch (error) {
        updateRecentSessionStatus(
          'error',
          'Error Loading Results',
          `Failed to load results: ${error.message}`
        );
        console.error('Error loading recent session results:', error);
      }
    });
  } else {
    console.error('One or more elements for recent session functionality not found.');
  }
}
