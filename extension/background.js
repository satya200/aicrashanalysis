// Background service worker for the extension
// Handles context menus, background tasks, and cross-component communication

console.log('AI Crash Analysis: Background service worker started');

// Create context menu on installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed, setting up context menu...');
  
  // Create context menu item
  chrome.contextMenus.create({
    id: 'analyzeStackTrace',
    title: 'Analyze with AI Crash Assistant',
    contexts: ['selection']
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'analyzeStackTrace' && info.selectionText) {
    // Store the selected text
    chrome.storage.local.set({
      stackTrace: info.selectionText,
      timestamp: Date.now()
    }, () => {
      // Open the popup (by triggering the extension icon)
      chrome.action.openPopup();
    });
  }
});

// Handle messages from content scripts or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background received message:', request);
  
  if (request.action === 'analyzeStackTrace') {
    // Handle analysis request
    handleAnalysisRequest(request.stackTrace)
      .then(result => sendResponse({ success: true, result }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Keep message channel open for async response
  }
  
  if (request.action === 'getConfig') {
    // Return configuration (API keys, settings, etc.)
    chrome.storage.sync.get(['apiKey', 'apiEndpoint'], (config) => {
      sendResponse({ success: true, config });
    });
    return true;
  }
});

// Placeholder for AI analysis (will be implemented in Day 2)
async function handleAnalysisRequest(stackTrace) {
  console.log('Analysis requested for stack trace:', stackTrace);
  
  // TODO: Day 2 - Implement actual AI/Copilot integration
  return {
    status: 'parsed',
    message: 'AI integration coming in Day 2',
    frameCount: stackTrace.split('\n').length
  };
}

// Listen for keyboard shortcuts (if configured in manifest)
// Note: Requires "commands" section in manifest.json
if (chrome.commands) {
  chrome.commands.onCommand.addListener((command) => {
    console.log('Command received:', command);
    
    if (command === 'open-analysis') {
      chrome.action.openPopup();
    }
  });
} else {
  console.log('Chrome commands API not available (commands not configured in manifest)');
}

// Optional: Badge text to show status
function updateBadge(text, color = '#0066cc') {
  chrome.action.setBadgeText({ text });
  chrome.action.setBadgeBackgroundColor({ color });
}

// Clear badge on startup
updateBadge('');
