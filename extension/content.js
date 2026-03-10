// Content script for extracting stack traces from web pages
// This runs on all pages to detect and extract stack trace content

console.log('AI Crash Analysis: Content script loaded');

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extractStackTrace') {
    const stackTrace = extractStackTraceFromPage();
    sendResponse({ stackTrace: stackTrace });
  }
  return true; // Keep message channel open for async response
});

/**
 * Extract stack trace from the current page
 * Looks for common patterns in pre, code, textarea, or text content
 */
function extractStackTraceFromPage() {
  // Strategy 1: Look in <pre> or <code> tags (most common in stack trace viewers)
  const preElements = document.querySelectorAll('pre, code, .stack-trace, .stacktrace');
  for (const element of preElements) {
    const text = element.textContent || element.innerText;
    if (looksLikeStackTrace(text)) {
      return text.trim();
    }
  }

  // Strategy 2: Look in textareas
  const textareas = document.querySelectorAll('textarea');
  for (const textarea of textareas) {
    const text = textarea.value;
    if (looksLikeStackTrace(text)) {
      return text.trim();
    }
  }

  // Strategy 3: Look for selected text
  const selection = window.getSelection();
  if (selection && selection.toString()) {
    const text = selection.toString();
    if (looksLikeStackTrace(text)) {
      return text.trim();
    }
  }

  // Strategy 4: Look for elements with specific classes/ids
  const commonSelectors = [
    '[class*="stack"]',
    '[class*="trace"]',
    '[class*="error"]',
    '[class*="exception"]',
    '[id*="stack"]',
    '[id*="trace"]'
  ];

  for (const selector of commonSelectors) {
    const elements = document.querySelectorAll(selector);
    for (const element of elements) {
      const text = element.textContent || element.innerText;
      if (looksLikeStackTrace(text)) {
        return text.trim();
      }
    }
  }

  return null;
}

/**
 * Heuristic to determine if text looks like a stack trace
 */
function looksLikeStackTrace(text) {
  if (!text || text.length < 20) {
    return false;
  }

  // Count how many lines look like stack frames
  const lines = text.split('\n');
  let stackFrameCount = 0;
  
  // Common stack trace patterns
  const patterns = [
    /^\s*at\s+/i,                          // Java/JavaScript: at ...
    /^\s*File\s+["'].*["'],\s+line/i,      // Python: File "...", line
    /^\s*in\s+.*\s+at\s+.*:\d+/i,         // C#: in ... at file:line
    /^\s*#\d+\s+/,                         // PHP/Ruby: #0 ...
    /^\s*\d+\s+.*\s+0x[0-9a-f]+/i,        // C/C++: frame address
    /Exception|Error/i,                    // Exception keywords
    /\w+\.\w+\([^)]*\).*:\d+/,            // function.name(args) at file:line
  ];

  for (const line of lines) {
    if (patterns.some(pattern => pattern.test(line))) {
      stackFrameCount++;
    }
  }

  // If at least 3 lines look like stack frames, consider it a stack trace
  return stackFrameCount >= 3;
}

// Create a context menu item (when right-clicking on selected text)
// Note: This would typically be set up in background.js, but included here for reference
function setupContextMenu() {
  // This will be handled by background.js
  console.log('Context menu setup would go in background.js');
}
