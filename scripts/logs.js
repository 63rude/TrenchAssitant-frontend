const API_BASE = 'https://trenchassistant-python.onrender.com'; // Use consistent API root

/**
 * Fetches and displays session logs.
 * @param {string} sessionId - The session identifier.
 */
export async function fetchAndDisplayLogs(sessionId) {
  const logsContainer = document.getElementById('hero-session-logs-container');
  const logsContent = document.getElementById('hero-session-logs-content');
  if (!logsContainer || !logsContent) {
    console.error('[logs.js] Logs container or content element not found.');
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/get_session_logs/${sessionId}`);

    if (!response.ok) {
      if (response.status === 404) {
        logsContent.textContent = "The bot is running — please wait while we process your request. This may take up to 2 minutes.";
        logsContainer.classList.remove('hidden');
        return;
      } else {
        const errorText = await response.text();
        logsContent.textContent = `Error fetching logs: ${response.status} - ${errorText}`;
        logsContainer.classList.remove('hidden');
        return;
      }
    }

    const logs = await response.json();
    logsContainer.classList.remove('hidden');

    if (logs && logs.logs) {
      const newLogText = Array.isArray(logs.logs)
        ? logs.logs.join('\n')
        : String(logs.logs);

      logsContent.textContent = newLogText;
      logsContent.scrollTop = logsContent.scrollHeight; // Scroll to bottom
    } else if (logs && logs.message) {
      logsContent.textContent = logs.message;
    } else {
      logsContent.textContent = "No log output received yet.";
    }

  } catch (error) {
    console.error('[logs.js] Error fetching or displaying logs:', error);
    logsContent.textContent = `Error fetching logs: ${error.message}`;
    logsContainer.classList.remove('hidden');
  }
}
