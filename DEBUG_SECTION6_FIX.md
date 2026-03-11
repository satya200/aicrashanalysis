# Debug Fix - Path Extraction & Section 6

## Changes Made

### 1. **Fixed File Path Extraction** (github-service.js)
Added `extractRepoPath()` method that:
- Detects `/git/` in build paths like `/usr/src/debug/telemetry/.../git/source/xconf-client/xconfclient.c`
- Extracts everything after `/git/` → `source/xconf-client/xconfclient.c`
- Now fetches correct paths from repository

### 2. **Added Comprehensive Debugging**
Console logs added to trace:
- Repository context information
- Whether section 6 will be shown
- File fetch URLs and results
- AI prompt configuration

### 3. **Improved File Listing**
Shows both:
- Original build path from stack trace
- Extracted repository path for lookup

## How to Test

### Step 1: Reload Extension
```
chrome://extensions/ → Click Reload
```

### Step 2: Open DevTools Console
```
F12 → Console tab
```

### Step 3: Configure & Analyze
1. Settings → GitHub Repository: `https://github.com/rdkcentral/xconf` (or your repo)
2. Paste your stack trace with paths like:
   ```
   /usr/src/debug/telemetry/1.99+git64f60f5e15-r0/build/source/xconf-client/../../../git/source/xconf-client/xconfclient.c:123
   ```
3. Click "Analyze with AI"

### Step 4: Check Console Output

You should see:
```javascript
Fetching: https://raw.githubusercontent.com/rdkcentral/xconf/main/source/xconf-client/xconfclient.c
📦 Repository context info: { hasCode: false, formatted: "..." }
🔍 Repository context for AI: { hasCode: false, formatted: "..." }
🤖 AI Prompt Config: {
  hasRepoContext: true,
  hasActualCode: false,
  willShowSection6: true,  ← THIS SHOULD BE TRUE
  repoInfoLength: 450
}
```

**Key Check:** `willShowSection6: true` means section 6 will be requested from AI

## Expected AI Response

You should now get **6 sections**:

```markdown
1. ROOT CAUSE ANALYSIS (Most Likely Issue)
[Detailed analysis...]

2. TOP 3 SUSPICIOUS FUNCTIONS (Ranked by likelihood)
[Three functions with details...]

3. ISSUE PATTERN DETECTION
[Pattern analysis...]

4. RECOMMENDED INVESTIGATION STEPS
[5 specific steps...]

5. QUESTIONS TO ASK
[2-3 questions...]

6. REPOSITORY-SPECIFIC SUGGESTIONS  ← THIS SECTION SHOULD NOW APPEAR
- Check source/xconf-client/xconfclient.c in rdkcentral/xconf
- Look for string handling in xconf initialization
- Investigate where NULL pointers might occur
[Repository-aware suggestions...]
```

## Debugging Checklist

If section 6 is still missing, check console for:

### ✅ Good Signs:
- [ ] `📦 Repository context info:` appears
- [ ] `willShowSection6: true` in console
- [ ] Extracted repo paths show correctly (without /usr/src/debug)
- [ ] Status shows "with repository context"

### ❌ Problem Signs:
- [ ] `willShowSection6: false` → repoContextInfo not passed correctly
- [ ] `hasRepoContext: false` → formatted string is empty
- [ ] No repository context logs → formatRepositoryInfoForPrompt not called
- [ ] Console errors → check error messages

## File Path Extraction Examples

### Example 1: Build path with git/
```
Input:  /usr/src/debug/telemetry/1.99+git64f60f5e15-r0/build/source/xconf-client/../../../git/source/xconf-client/xconfclient.c
Output: source/xconf-client/xconfclient.c
```

### Example 2: Simple relative path
```
Input:  platform_hal.c
Output: platform_hal.c
```

### Example 3: Nested source path
```
Input:  /usr/src/debug/project/1.0/git/src/core/module.cpp
Output: src/core/module.cpp
```

## If Still Not Working

### Check 1: AI Response Truncated
If AI response cuts off before section 6:
- Check: `maxOutputTokens: 3072` in ai-service.js
- Increase to 4096 if needed

### Check 2: Section Headers Not Recognized
If AI doesn't format properly:
- Look for "6. **REPOSITORY-SPECIFIC SUGGESTIONS**" in raw response
- AI might be using different formatting

### Check 3: Repo Path Still Wrong
If files still 404:
```javascript
// In console, check what path is actually being fetched:
// Look for: "Fetching: https://raw.githubusercontent.com/..."
// Verify the path matches your repo structure on GitHub
```

## Quick Verification Commands

Run in Console:
```javascript
// Check if github-service has extractRepoPath method
const gs = new GitHubService();
console.log(gs.extractRepoPath('/usr/src/debug/test/git/source/file.c'));
// Should output: source/file.c

// Check AI service prompt generation
// (After clicking Analyze, prompt is logged to console)
```

## Success Criteria

✅ **Fix is working when:**
1. Console shows `willShowSection6: true`
2. File paths are correctly extracted (no /usr/src/debug)
3. Fetching logs show correct URLs
4. AI response includes all 6 sections
5. Section 6 has repository-specific suggestions

---

**After reloading and testing, paste the console logs if section 6 is still missing!**
