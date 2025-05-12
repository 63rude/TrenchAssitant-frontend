import { updateHeroStatusIndicator } from './statusIndicator.js';

const API_BASE = 'https://trenchassistant-python.onrender.com';

/**
 * Formats a number as currency (USD).
 */
function formatCurrency(amount) {
  if (typeof amount !== 'number') return 'N/A';
  return `$${amount.toFixed(2)}`;
}

/**
 * Formats a number as a percentage.
 */
function formatPercentage(value) {
  if (typeof value !== 'number') return 'N/A';
  return `${(value * 100).toFixed(1)}%`;
}

/**
 * Formats a date string.
 */
function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  return date.toLocaleDateString();
}

/**
 * Converts seconds to human-readable duration (e.g., 2h 15m 30s).
 */
function formatDuration(seconds) {
  if (typeof seconds !== 'number') return 'N/A';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${h}h ${m}m ${s}s`;
}

/**
 * Fetches results and displays them, handling missing summary_stats gracefully.
 * @param {string} walletAddress The wallet address.
 * @param {string} targetContainerId The ID of the results container (optional).
 * @param {string} targetContentId The ID of the results content area (optional).
 */
export async function fetchAndDisplayResults(walletAddress, targetContainerId = 'hero-session-results-container', targetContentId = 'hero-session-results-content') {
  const resultsContainer = document.getElementById(targetContainerId);
  const resultsContent = document.getElementById(targetContentId);

  if (!resultsContainer || !resultsContent) {
    console.warn('[results.js] Target result container or content not found.');
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/get_session_result_by_wallet/${walletAddress}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Could not parse error from results endpoint.' }));
      resultsContainer.classList.remove('hidden');
      resultsContent.innerHTML = `<p class="text-red-400 text-sm">Error loading results: ${errorData.detail || 'Server Error'}</p>`;
      return;
    }

    const results = await response.json();
    console.log('[results.js] ACTUAL results data received:', JSON.stringify(results, null, 2));

    const summary = results.summary_stats || results;

    let htmlContent = `
      <div class="space-y-4">
        <div>
          <h4 class="text-lg font-semibold mb-2 text-gray-200 border-b border-gray-700 pb-1">Summary Statistics</h4>
          <dl class="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
            <dt class="text-gray-400">Total Profit:</dt>
            <dd class="font-medium ${summary.total_profit_usd >= 0 ? 'text-green-400' : 'text-red-400'}">${formatCurrency(summary.total_profit_usd)}</dd>
            <dt class="text-gray-400">Win Rate:</dt>
            <dd class="font-medium text-gray-300">${formatPercentage(summary.win_rate)}</dd>
            <dt class="text-gray-400">Start Date:</dt>
            <dd class="font-medium text-gray-300">${formatDate(summary.start_date)}</dd>
            <dt class="text-gray-400">End Date:</dt>
            <dd class="font-medium text-gray-300">${formatDate(summary.end_date)}</dd>
          </dl>
        </div>`;

    // Best Trades
    if (Array.isArray(results.best_trades) && results.best_trades.length > 0) {
      htmlContent += `
        <div>
          <h4 class="text-lg font-semibold mb-2 text-gray-200 border-b border-gray-700 pb-1">Best Trades</h4>
          <ul class="space-y-2 text-sm text-gray-300">`;
      results.best_trades.forEach(trade => {
        htmlContent += `
          <li class="border border-gray-700 rounded p-2 bg-gray-800">
            <strong>${trade.token_symbol}</strong> — PnL: ${formatCurrency(trade.profit_usd)} — Held: ${trade.hold_duration_readable || formatDuration(trade.duration_secs)}
          </li>`;
      });
      htmlContent += `</ul></div>`;
    }

    // Worst Trades
    if (Array.isArray(results.worst_trades) && results.worst_trades.length > 0) {
      htmlContent += `
        <div>
          <h4 class="text-lg font-semibold mb-2 text-gray-200 border-b border-gray-700 pb-1">Worst Trades</h4>
          <ul class="space-y-2 text-sm text-gray-300">`;
      results.worst_trades.forEach(trade => {
        htmlContent += `
          <li class="border border-gray-700 rounded p-2 bg-gray-800">
            <strong>${trade.token_symbol}</strong> — PnL: ${formatCurrency(trade.profit_usd)} — Held: ${trade.hold_duration_readable || formatDuration(trade.duration_secs)}
          </li>`;
      });
      htmlContent += `</ul></div>`;
    }

    htmlContent += `</div>`;

    resultsContainer.classList.remove('hidden');
    resultsContent.innerHTML = htmlContent;
    updateHeroStatusIndicator('completed', 'Results Loaded', 'Analysis results summary is displayed.');

  } catch (error) {
    console.error('[results.js] Error fetching or displaying results:', error);
    resultsContainer.classList.remove('hidden');
    resultsContent.innerHTML = `<p class="text-red-400 text-sm">Failed to load results: ${error.message || 'Unknown error'}</p>`;
    updateHeroStatusIndicator('error', 'Result Error', error.message || 'Could not fetch session result.');
  }
}
