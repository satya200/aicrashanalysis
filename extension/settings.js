// Settings page JavaScript

const apiKeyInput = document.getElementById('apiKey');
const modelSelect = document.getElementById('model');
const githubRepoInput = document.getElementById('githubRepo');
const githubBranchInput = document.getElementById('githubBranch');
const saveBtn = document.getElementById('saveBtn');
const statusMessage = document.getElementById('statusMessage');

// Load saved settings
document.addEventListener('DOMContentLoaded', loadSettings);

saveBtn.addEventListener('click', saveSettings);

function loadSettings() {
  chrome.storage.sync.get(['geminiApiKey', 'geminiModel', 'githubRepo', 'githubBranch'], (result) => {
    if (result.geminiApiKey) {
      apiKeyInput.value = result.geminiApiKey;
    }
    if (result.geminiModel) {
      modelSelect.value = result.geminiModel;
    }
    if (result.githubRepo) {
      githubRepoInput.value = result.githubRepo;
    }
    if (result.githubBranch) {
      githubBranchInput.value = result.githubBranch;
    }
  });
}

function saveSettings() {
  const apiKey = apiKeyInput.value.trim();
  const model = modelSelect.value;
  const githubRepo = githubRepoInput.value.trim();
  const githubBranch = githubBranchInput.value.trim() || 'main';

  if (!apiKey) {
    showStatus('Please enter an API key', 'error');
    return;
  }

  // Basic validation for Google API key format
  if (!apiKey.startsWith('AIza')) {
    showStatus('Invalid API key format. Google AI Studio keys start with "AIza"', 'error');
    return;
  }

  // Validate GitHub repo URL format if provided
  if (githubRepo && !isValidGitHubUrl(githubRepo)) {
    showStatus('Invalid GitHub URL. Use format: https://github.com/owner/repo', 'error');
    return;
  }

  // Save to Chrome storage
  chrome.storage.sync.set({
    geminiApiKey: apiKey,
    geminiModel: model,
    githubRepo: githubRepo,
    githubBranch: githubBranch
  }, () => {
    showStatus('✅ Settings saved successfully!', 'success');
    
    // Optional: Validate API key by making a test call
    testApiKey(apiKey, model);
  });
}

function isValidGitHubUrl(url) {
  // Validates GitHub URL format
  const githubPattern = /^https:\/\/github\.com\/[\w-]+\/[\w.-]+\/?$/;
  return githubPattern.test(url);
}

async function testApiKey(apiKey, model) {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}?key=${apiKey}`
    );

    if (response.ok) {
      showStatus('✅ Settings saved and API key validated!', 'success');
    } else {
      const error = await response.json();
      showStatus(`⚠️ Settings saved, but API key validation failed: ${error.error?.message || 'Unknown error'}`, 'error');
    }
  } catch (error) {
    showStatus('⚠️ Settings saved, but could not validate API key (check internet connection)', 'error');
  }
}

function showStatus(message, type) {
  statusMessage.textContent = message;
  statusMessage.className = `status-message ${type}`;
  statusMessage.style.display = 'block';

  if (type === 'success') {
    setTimeout(() => {
      statusMessage.style.display = 'none';
    }, 3000);
  }
}
