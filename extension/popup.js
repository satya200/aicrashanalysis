// DOM Elements
const stackTraceInput = document.getElementById('stackTraceInput');
const analyzeBtn = document.getElementById('analyzeBtn');
const clearBtn = document.getElementById('clearBtn');
const extractBtn = document.getElementById('extractBtn');
const copyBtn = document.getElementById('copyBtn');
const fullScreenBtn = document.getElementById('fullScreenBtn');
const jsonFileInput = document.getElementById('jsonFileInput');
const charCount = document.getElementById('charCount');
const statusSection = document.getElementById('statusSection');
const statusText = document.getElementById('statusText');
const resultsSection = document.getElementById('resultsSection');
const resultsContent = document.getElementById('resultsContent');
const parsedSection = document.getElementById('parsedSection');
const parsedContent = document.getElementById('parsedContent');
const frameCount = document.getElementById('frameCount');
const followUpSection = document.getElementById('followUpSection');
const followUpInput = document.getElementById('followUpInput');
const askBtn = document.getElementById('askBtn');

// State
let currentStackTrace = '';
let parsedFrames = [];
let aiService = null;
let lastAnalysis = '';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadSavedData();
  updateCharCount();
  updateAnalyzeButton();
  initializeAI();
});

// Event Listeners
stackTraceInput.addEventListener('input', () => {
  currentStackTrace = stackTraceInput.value;
  updateCharCount();
  updateAnalyzeButton();
  saveData();
});

analyzeBtn.addEventListener('click', analyzeStackTrace);
clearBtn.addEventListener('click', clearAll);
extractBtn.addEventListener('click', extractFromPage);
copyBtn.addEventListener('click', copyAnalysisToClipboard);
jsonFileInput.addEventListener('change', handleFileUpload);
askBtn.addEventListener('click', handleFollowUpQuestion);

// Add full screen button listener only if in popup mode
if (fullScreenBtn) {
  fullScreenBtn.addEventListener('click', openFullScreen);
}

followUpInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    handleFollowUpQuestion();
  }
});

// Initialize AI Service
async function initializeAI() {
  aiService = new AIService();
  const isConfigured = await aiService.isConfigured();
  
  if (!isConfigured) {
    console.log('API key not configured. User needs to set it in settings.');
  }
}

// Functions
function updateCharCount() {
  const count = stackTraceInput.value.length;
  charCount.textContent = count.toLocaleString();
}

function updateAnalyzeButton() {
  const hasContent = stackTraceInput.value.trim().length > 0;
  analyzeBtn.disabled = !hasContent;
}

function clearAll() {
  stackTraceInput.value = '';
  currentStackTrace = '';
  parsedFrames = [];
  lastAnalysis = '';
  updateCharCount();
  updateAnalyzeButton();
  hideStatus();
  hideResults();
  hideParsedSection();
  hideFollowUpSection();
  saveData();
}

function openFullScreen() {
  // Save current state before opening in new tab
  saveData();
  
  // Open popup.html in a new tab for full screen demo
  chrome.tabs.create({
    url: chrome.runtime.getURL('popup.html')
  });
}

async function copyAnalysisToClipboard() {
  if (!lastAnalysis) {
    showStatus('⚠️ No analysis available to copy');
    setTimeout(hideStatus, 2000);
    return;
  }

  try {
    await navigator.clipboard.writeText(lastAnalysis);
    
    // Show success feedback
    const originalText = copyBtn.getAttribute('title');
    copyBtn.setAttribute('title', 'Copied!');
    copyBtn.style.color = 'var(--success-color)';
    
    showStatus('✅ Analysis copied to clipboard!');
    
    // Reset after 2 seconds
    setTimeout(() => {
      copyBtn.setAttribute('title', originalText || 'Copy to clipboard');
      copyBtn.style.color = '';
      hideStatus();
    }, 2000);
    
  } catch (error) {
    console.error('Failed to copy:', error);
    showStatus('❌ Failed to copy to clipboard');
    setTimeout(hideStatus, 2000);
  }
}

function showStatus(message) {
  statusText.textContent = message;
  statusSection.classList.remove('hidden');
}

function hideStatus() {
  statusSection.classList.add('hidden');
}

function showResults(content) {
  resultsContent.innerHTML = content;
  resultsSection.classList.remove('hidden');
}

function hideResults() {
  resultsSection.classList.add('hidden');
}

function showParsedSection() {
  parsedSection.classList.remove('hidden');
}

function hideParsedSection() {
  parsedSection.classList.add('hidden');
}

function showFollowUpSection() {
  followUpSection.classList.remove('hidden');
}

function hideFollowUpSection() {
  followUpSection.classList.add('hidden');
}

async function analyzeStackTrace() {
  if (!stackTraceInput.value.trim()) {
    alert('Please enter a stack trace first');
    return;
  }

  showStatus('Parsing stack trace...');
  hideResults();
  hideFollowUpSection();

  // Parse the stack trace
  parsedFrames = parseStackTrace(stackTraceInput.value);
  
  if (parsedFrames.length === 0) {
    showStatus('❌ No valid stack frames found. Please check the format.');
    setTimeout(hideStatus, 3000);
    return;
  }

  // Display parsed frames
  displayParsedFrames(parsedFrames);
  showParsedSection();

  // Check if AI is configured
  const isConfigured = await aiService.isConfigured();
  
  if (!isConfigured) {
    showStatus('⚠️ AI analysis unavailable');
    showResults(`
      <div class="api-warning">
        <strong>⚠️ API Key Not Configured</strong>
        <p>To enable AI-powered analysis, you need to configure your Google AI Studio API key.</p>
        <p>
          <strong>Steps:</strong><br>
          1. Click <a href="settings.html" target="_blank">Settings</a> below<br>
          2. Get your free API key from <a href="https://makersuite.google.com/app/apikey" target="_blank">Google AI Studio</a><br>
          3. Paste it in the settings and save<br>
          4. Come back and click "Analyze with AI" again
        </p>
      </div>
    `);
    setTimeout(hideStatus, 3000);
    return;
  }

  // Call AI for analysis
  showStatus('🤖 Analyzing with AI... This may take 10-15 seconds');
  
  try {
    // Fetch GitHub code context if configured
    let repoContextInfo = null;
    const settings = await new Promise(resolve => {
      chrome.storage.sync.get(['githubRepo', 'githubBranch'], resolve);
    });
    
    if (settings.githubRepo) {
      showStatus('📦 Fetching code context from GitHub...');
      try {
        const githubService = new GitHubService();
        const branch = settings.githubBranch || 'main';
        const codeContexts = await githubService.getCodeContext(parsedFrames, settings.githubRepo, branch);
        
        // Always pass repository info to AI, even if code fetch failed
        repoContextInfo = githubService.formatRepositoryInfoForPrompt(
          settings.githubRepo, 
          branch, 
          codeContexts, 
          parsedFrames
        );
        
        console.log('🔍 Repository context for AI:', repoContextInfo);
        
        if (repoContextInfo.hasCode) {
          showStatus(`🤖 Analyzing with AI (found code for ${codeContexts.length} frames)...`);
        } else {
          showStatus('🤖 Analyzing with AI (with repository context)...');
        }
      } catch (githubError) {
        console.warn('GitHub context fetch failed:', githubError);
        showStatus('🤖 Analyzing with AI (GitHub fetch failed, continuing without code context)...');
      }
    }
    
    const result = await aiService.analyzeCrash(stackTraceInput.value, parsedFrames, repoContextInfo);
    
    if (result.success) {
      lastAnalysis = result.analysis;
      const formattedAnalysis = formatMarkdown(result.analysis);
      console.log('📊 Displaying analysis:', {
        originalLength: result.analysis.length,
        formattedLength: formattedAnalysis.length,
        sectionsFound: (result.analysis.match(/\*\*[A-Z][A-Z\s]+\*\*/g) || [])
      });
      showResults(`
        <div class="ai-analysis">
          ${formattedAnalysis}
        </div>
        <div style="margin-top: 16px; padding: 12px; background: var(--surface); border-radius: 6px; font-size: 12px; color: var(--text-secondary);">
          <strong>Model:</strong> ${result.model} | <strong>Analyzed:</strong> ${new Date().toLocaleTimeString()}
        </div>
      `);
      showStatus('✅ AI analysis complete!');
      showFollowUpSection();
      setTimeout(hideStatus, 2000);
    } else {
      throw new Error('AI analysis failed');
    }
  } catch (error) {
    console.error('Analysis error:', error);
    showStatus('❌ Analysis failed');
    showResults(`
      <div class="api-warning" style="background: #f8d7da; border-color: #dc3545; color: #721c24;">
        <strong>❌ AI Analysis Failed</strong>
        <p><strong>Error:</strong> ${escapeHtml(error.message)}</p>
        <p><strong>Possible causes:</strong></p>
        <ul>
          <li>Invalid or expired API key</li>
          <li>API rate limit exceeded</li>
          <li>Network connection issue</li>
          <li>Service temporarily unavailable</li>
        </ul>
        <p>Check the <a href="settings.html">Settings</a> and try again.</p>
      </div>
    `);
    setTimeout(hideStatus, 3000);
  }
}

function parseStackTrace(stackTrace) {
  const frames = [];
  const lines = stackTrace.split('\n').map(l => l.trim());
  
  // First, try to detect multi-line C stack trace format
  // Format: <number> \n <function> \n <file:line> or :
  const multiLineFrames = parseMultiLineCStackTrace(lines);
  if (multiLineFrames.length > 0) {
    return multiLineFrames;
  }
  
  // Common single-line stack trace patterns
  const patterns = [
    // Java: at package.Class.method(File.java:123)
    /^\s*at\s+([^\(]+)\(([^:]+):(\d+)\)/,
    // C++/C#: in ClassName::Method() at File.cpp:line 123
    /^\s*(?:in\s+)?([^\s]+)\s+at\s+([^:]+):(?:line\s+)?(\d+)/,
    // Python: File "file.py", line 123, in function
    /^\s*File\s+"([^"]+)",\s+line\s+(\d+),\s+in\s+(.+)/,
    // JavaScript: at functionName (file.js:123:45)
    /^\s*at\s+([^\(]+)\s*\(([^:]+):(\d+)(?::(\d+))?\)/,
    // Generic: FunctionName (File:Line)
    /^\s*([^\(]+)\s*\(([^:]+):(\d+)\)/,
    // C/C++ simple: #N function at file.cpp:line
    /^#(\d+)\s+(.+?)\s+(?:at|in)\s+([^:]+):(\d+)/,
  ];

  lines.forEach((line, index) => {
    if (!line || line.startsWith('Exception') || line.startsWith('Error')) {
      return;
    }

    for (const pattern of patterns) {
      const match = line.match(pattern);
      if (match) {
        let frameNum, func, file, lineNum, col;
        
        // Check if pattern captured frame number first (like #N format)
        if (pattern.source.startsWith('^#')) {
          frameNum = match[1];
          func = match[2];
          file = match[3];
          lineNum = match[4];
          col = match[5] || 0;
        } else {
          func = match[1];
          file = match[2];
          lineNum = match[3];
          col = match[4] || 0;
        }
        
        const frame = {
          id: frames.length + 1,
          raw: line,
          function: func ? func.trim() : 'Unknown',
          file: file ? file.trim() : 'Unknown',
          line: lineNum ? parseInt(lineNum) : 0,
          column: col ? parseInt(col) : 0
        };
        frames.push(frame);
        break;
      }
    }
  });

  return frames;
}

// Parse multi-line C stack trace format
// Format:
//   0
//   strlen
//   :
//   1
//   __strdup
//   /usr/src/debug/glibc/2.35-r0/git/string/strdup.c:41
function parseMultiLineCStackTrace(lines) {
  const frames = [];
  let i = 0;
  
  while (i < lines.length) {
    const line = lines[i].replace(/[^\S\r\n]/g, ' ').trim(); // Remove invisible chars
    
    // Check if line is just a frame number
    if (/^\d+$/.test(line)) {
      const frameNum = parseInt(line);
      
      // Next line should be function name
      if (i + 1 < lines.length) {
        const funcLine = lines[i + 1].replace(/[^\S\r\n]/g, ' ').trim();
        
        // Skip if function line looks empty or is another number
        if (!funcLine || /^\d+$/.test(funcLine)) {
          i++;
          continue;
        }
        
        // Next line should be file:line or just ":" or empty
        if (i + 2 < lines.length) {
          const fileLine = lines[i + 2].replace(/[^\S\r\n]/g, ' ').trim();
          
          let file = 'Unknown';
          let lineNum = 0;
          
          // Parse file:line format - handle various formats
          if (fileLine && fileLine !== ':' && fileLine.length > 1) {
            // Try to match file path with line number
            const fileMatch = fileLine.match(/^(.+?):(\d+)$/);
            if (fileMatch) {
              file = fileMatch[1].trim();
              lineNum = parseInt(fileMatch[2]);
            } else {
              // Just a file path without line number
              file = fileLine.trim();
            }
          }
          
          frames.push({
            id: frames.length + 1,
            raw: `#${frameNum} ${funcLine} ${file}:${lineNum || '?'}`,
            function: funcLine,
            file: file,
            line: lineNum,
            column: 0
          });
          
          // Skip past the three lines we just processed
          i += 3;
          continue;
        }
      }
    }
    
    i++;
  }
  
  return frames;
}

function displayParsedFrames(frames) {
  frameCount.textContent = frames.length;
  
  let html = '';
  frames.forEach(frame => {
    html += `
      <div class="stack-frame">
        <div class="frame-function">#${frame.id} ${escapeHtml(frame.function)}</div>
        <div class="frame-location">
          📄 ${escapeHtml(frame.file)}${frame.line ? ':' + frame.line : ''}${frame.column ? ':' + frame.column : ''}
        </div>
      </div>
    `;
  });
  
  parsedContent.innerHTML = html;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Format markdown-style AI responses to HTML
function formatMarkdown(text) {
  // Convert markdown to HTML (simplified)
  let html = text;
  
  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  
  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Code blocks
  html = html.replace(/```([^`]+)```/g, '<pre><code>$1</code></pre>');
  
  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // Lists (simple conversion)
  html = html.replace(/^\* (.+)$/gim, '<li>$1</li>');
  html = html.replace(/^- (.+)$/gim, '<li>$1</li>');
  html = html.replace(/^\d+\. (.+)$/gim, '<li>$1</li>');
  
  // Wrap consecutive <li> in <ul>
  html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');
  
  // Line breaks
  html = html.replace(/\n\n/g, '<br><br>');
  html = html.replace(/\n/g, '<br>');
  
  return html;
}

// Handle follow-up questions
async function handleFollowUpQuestion() {
  const question = followUpInput.value.trim();
  
  if (!question) {
    followUpInput.focus();
    return;
  }
  
  if (!lastAnalysis) {
    alert('Please run an analysis first before asking follow-up questions.');
    return;
  }
  
  // Add user question to results
  const currentResults = resultsContent.innerHTML;
  resultsContent.innerHTML = currentResults + `
    <div style="margin-top: 20px; padding: 12px; background: #e3f2fd; border-left: 3px solid var(--primary-color); border-radius: 4px;">
      <strong>Your question:</strong> ${escapeHtml(question)}
    </div>
  `;
  
  followUpInput.value = '';
  showStatus('🤔 Thinking...');
  
  try {
    const result = await aiService.askFollowUp(
      currentStackTrace,
      lastAnalysis,
      question
    );
    
    if (result.success) {
      const formattedAnswer = formatMarkdown(result.answer);
      resultsContent.innerHTML = resultsContent.innerHTML + `
        <div style="margin-top: 12px; padding: 12px; background: var(--surface); border-radius: 4px;">
          <strong style="color: var(--primary-color);">AI Answer:</strong><br><br>
          <div class="ai-analysis">${formattedAnswer}</div>
        </div>
      `;
      
      // Scroll to bottom
      resultsContent.scrollTop = resultsContent.scrollHeight;
      
      showStatus('✅ Answer ready!');
      setTimeout(hideStatus, 2000);
    } else {
      throw new Error('Follow-up failed');
    }
  } catch (error) {
    console.error('Follow-up error:', error);
    resultsContent.innerHTML = resultsContent.innerHTML + `
      <div style="margin-top: 12px; padding: 12px; background: #f8d7da; border-radius: 4px; color: #721c24;">
        <strong>❌ Error:</strong> ${escapeHtml(error.message)}
      </div>
    `;
    showStatus('❌ Follow-up failed');
    setTimeout(hideStatus, 3000);
  }
}

async function extractFromPage() {
  // Trigger file input for JSON upload
  jsonFileInput.click();
}

async function handleFileUpload(event) {
  const file = event.target.files[0];
  
  if (!file) {
    return;
  }
  
  if (!file.name.endsWith('.json')) {
    showStatus('⚠️ Please select a JSON file');
    setTimeout(hideStatus, 3000);
    return;
  }
  
  showStatus('📂 Reading JSON file...');
  console.log('📂 Loading file:', file.name);
  
  try {
    const fileContent = await file.text();
    console.log('📄 File size:', fileContent.length, 'characters');
    
    // Parse JSON but also keep the text for position-based search
    const jsonData = JSON.parse(fileContent);
    console.log('✅ JSON parsed successfully');
    
    // Extract first thread's stackWalk based on text position
    const stackTrace = parseBacktraceJson(jsonData, fileContent);
    
    if (!stackTrace) {
      showStatus('❌ No valid stackWalk found in JSON');
      setTimeout(hideStatus, 3000);
      return;
    }
    
    console.log('📝 Formatted stack trace length:', stackTrace.length, 'characters');
    console.log('📝 Number of lines:', stackTrace.split('\n').length);
    
    // Set the stack trace in the input
    stackTraceInput.value = stackTrace;
    currentStackTrace = stackTrace;
    updateCharCount();
    updateAnalyzeButton();
    saveData();
    
    showStatus('✅ Stack trace extracted from JSON successfully!');
    setTimeout(hideStatus, 2000);
    
    // Clear the file input so the same file can be selected again
    jsonFileInput.value = '';
    
  } catch (error) {
    console.error('❌ JSON parsing error:', error);
    showStatus('❌ Failed to parse JSON file: ' + error.message);
    setTimeout(hideStatus, 3000);
    jsonFileInput.value = '';
  }
}

function parseBacktraceJson(jsonData, jsonText) {
  try {
    console.log('🔍 Searching for first stackWalk array in JSON...');
    
    // Find all stackWalk arrays and track their positions in the original text
    const stackWalkArrays = [];
    findAllStackWalks(jsonData, '', stackWalkArrays);
    
    if (stackWalkArrays.length === 0) {
      console.error('❌ No stackWalk array found in JSON');
      return null;
    }
    
    // Find which one appears first in the original JSON text
    let firstStackWalk = null;
    let firstPosition = Infinity;
    
    for (const item of stackWalkArrays) {
      // Find the position of this path in the original text
      // Extract a unique identifier (like the first function name)
      const firstFunc = item.stackWalk[0]?.functionName;
      if (firstFunc) {
        const searchPattern = `"functionName"\\s*:\\s*"${firstFunc}"`;
        const match = jsonText.search(new RegExp(searchPattern));
        if (match !== -1 && match < firstPosition) {
          firstPosition = match;
          firstStackWalk = item;
        }
      }
    }
    
    if (!firstStackWalk) {
      // Fallback: just use the first one found
      firstStackWalk = stackWalkArrays[0];
    }
    
    console.log(`✅ Found first stackWalk at: ${firstStackWalk.path}`);
    console.log(`   Position in file: ${firstPosition}`);
    console.log(`   Frames in stackWalk: ${firstStackWalk.stackWalk.length}`);
    console.log(`   First function: ${firstStackWalk.stackWalk[0]?.functionName || 'unknown'}`);
    
    // Format stackWalk as a stack trace
    const formattedTrace = formatStackWalk(firstStackWalk.stackWalk, firstStackWalk.path);
    
    console.log('✅ Successfully formatted stack trace');
    console.log('First 3 lines:', formattedTrace.split('\n').slice(0, 3).join('\n'));
    
    return formattedTrace;
  } catch (error) {
    console.error('Error parsing backtrace JSON:', error);
    return null;
  }
}

function findAllStackWalks(obj, path, results) {
  // Recursively find all stackWalk arrays in the JSON
  if (obj && typeof obj === 'object') {
    if (obj.hasOwnProperty('stackWalk') && Array.isArray(obj.stackWalk)) {
      results.push({
        stackWalk: obj.stackWalk,
        path: path || 'root'
      });
    }
    
    // Recursively search all properties
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const newPath = path ? `${path}.${key}` : key;
        findAllStackWalks(obj[key], newPath, results);
      }
    }
  }
}

function formatStackWalk(stackWalk, path) {
  // Create a formatted stack trace from stackWalk array
  let output = [];
  
  // Add header with location info
  output.push(`Stack Trace from: ${path}`);
  output.push('');
  
  // Format each frame as single-line for parser compatibility
  stackWalk.forEach((frame, index) => {
    const frameNum = frame.callStack !== undefined ? frame.callStack : index;
    const funcName = frame.functionName || '(unknown)';
    const sourceCode = frame.sourceCode || '';
    const sourceLine = frame.sourceLine || '';
    
    // Create single-line format that matches the C/C++ parser pattern
    // Pattern: #N function at file.cpp:line
    if (sourceCode && sourceLine) {
      output.push(`#${frameNum} ${funcName} at ${sourceCode}:${sourceLine}`);
    } else if (sourceCode) {
      output.push(`#${frameNum} ${funcName} at ${sourceCode}`);
    } else {
      // No source code, just function name
      output.push(`#${frameNum} ${funcName}`);
    }
  });
  
  return output.join('\n');
}

// Storage functions
function saveData() {
  chrome.storage.local.set({
    stackTrace: currentStackTrace,
    timestamp: Date.now()
  });
}

function loadSavedData() {
  chrome.storage.local.get(['stackTrace'], (result) => {
    if (result.stackTrace) {
      stackTraceInput.value = result.stackTrace;
      currentStackTrace = result.stackTrace;
      updateCharCount();
      updateAnalyzeButton();
    }
  });
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Ctrl/Cmd + Enter to analyze
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    if (!analyzeBtn.disabled) {
      analyzeStackTrace();
    }
  }
  
  // Ctrl/Cmd + K to clear
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    clearAll();
  }
});
