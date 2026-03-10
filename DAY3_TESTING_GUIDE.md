# Day 3 Testing Guide - GitHub Context Integration

## Overview
Day 3 adds GitHub repository context enrichment, allowing the AI to analyze actual source code from your repositories when analyzing crashes. This guide covers testing both the enhanced C parser and the new GitHub integration features.

## Prerequisites

### 1. Extension Setup
- Extension loaded in Chrome (from Day 1/2)
- Google AI Studio API key configured in Settings
- Extension popup accessible

### 2. GitHub Repository Information
For testing with rdkcentral repositories, you'll need:
- Repository URL: `https://github.com/rdkcentral/[repo-name]`
- Branch/tag/commit (e.g., `main`, `stable2`, or a commit SHA)

**Example repositories:**
- `https://github.com/rdkcentral/RdkServicesManager`
- `https://github.com/rdkcentral/rdk-halif-test-hdmi_cec`
- `https://github.com/rdkcentral/Thunder`

## Test Cases

### Test Case 1: C Multi-Line Stack Trace Parser (Enhanced)

**Objective:** Verify the parser handles multi-line C stack traces with invisible characters

**Steps:**
1. Open the extension popup
2. Paste the following C stack trace:
```
0
strlen
:
1
__strdup
/usr/src/debug/glibc/2.35-r0/git/string/strdup.c:41
2
get_environ
platform_hal.c:38
3
platform_hal_GetSerialNumber
platform_hal.c:71
4
_ZN11WPEFramework8Platform20SystemInfo13GetProductIDEv
platform_linux_gen.cpp:96
5
_ZN11WPEFramework4Core14SystemInfoImplC2Ev
SystemInfo.cpp:49
```

3. Click "Parse Stack Trace"

**Expected Results:**
- ✅ Should parse 6 frames (numbered 0-5)
- ✅ Frame 0: `strlen` at `:?`
- ✅ Frame 1: `__strdup` at `/usr/src/debug/glibc/2.35-r0/git/string/strdup.c:41`
- ✅ Frame 2: `get_environ` at `platform_hal.c:38`
- ✅ Frame 3: `platform_hal_GetSerialNumber` at `platform_hal.c:71`
- ✅ Frame 4: `_ZN11WPEFramework8Platform20SystemInfo13GetProductIDEv` at `platform_linux_gen.cpp:96`
- ✅ Frame 5: `_ZN11WPEFramework4Core14SystemInfoImplC2Ev` at `SystemInfo.cpp:49`
- ✅ All function names displayed correctly
- ✅ File paths and line numbers extracted properly

### Test Case 2: GitHub Settings Configuration

**Objective:** Verify GitHub repository settings can be saved and loaded

**Steps:**
1. Click "Settings" link in the extension popup footer
2. Scroll to "📦 GitHub Repository Context (Optional)" section
3. Enter a test repository URL:
   - Example: `https://github.com/rdkcentral/RdkServicesManager`
4. Enter branch/tag/commit:
   - Example: `main` or `stable2` or a commit SHA
5. Click "Save Settings"

**Expected Results:**
- ✅ Success message: "✅ Settings saved successfully!"
- ✅ API key validation runs (if configured)
- ✅ GitHub URL validation passes (format check)
- ✅ Settings persist after closing and reopening

**Error Cases to Test:**
- Invalid URL format: `github.com/owner/repo` (missing https://)
  - ❌ Should show: "Invalid GitHub URL. Use format: https://github.com/owner/repo"
- Empty GitHub repo is allowed (optional feature)

### Test Case 3: Analysis WITHOUT GitHub Context (Baseline)

**Objective:** Verify existing functionality still works without GitHub configuration

**Steps:**
1. Go to Settings
2. Clear the "GitHub Repository URL" field (leave it empty)
3. Save settings
4. Go back to popup
5. Enter a simple Java stack trace:
```
Exception in thread "main" java.lang.NullPointerException
    at com.example.App.processData(App.java:45)
    at com.example.App.main(App.java:12)
```
6. Click "Analyze with AI"

**Expected Results:**
- ✅ Parses 2 frames correctly
- ✅ Status shows: "🤖 Analyzing with AI... This may take 10-15 seconds"
- ✅ NO GitHub fetch attempted
- ✅ AI analysis completes successfully
- ✅ Shows root cause analysis, suspicious functions, etc.
- ✅ No errors in console
- ✅ Follow-up section appears

### Test Case 4: Analysis WITH GitHub Context (C Code)

**Objective:** Verify GitHub integration fetches and includes code context

**Steps:**
1. Configure Settings:
   - GitHub Repository URL: `https://github.com/rdkcentral/rdkservices`
   - Branch: `main`
   - Save settings

2. Enter a stack trace with matching file paths:
```
Exception in thread "main" 
    at DeviceInfo::GetSystemInfo(DeviceInfo.cpp:123)
    at DeviceInfo::InitDevice(DeviceInfo.cpp:89)
    at main(Main.cpp:45)
```

3. Click "Analyze with AI"

**Expected Results:**
- ✅ Status updates: "📦 Fetching code context from GitHub..."
- ✅ Status updates: "🤖 Analyzing with AI (found code for X frames)..." OR "🤖 Analyzing with AI (repository info provided, direct code fetch failed)..."
- ✅ AI receives repository URL and branch information even if files not fetched
- ✅ AI analysis can reference the repository and suggest where to look
- ✅ More context-aware analysis citing the repository structure
- ✅ If files not found: Still provides repository info to AI (no silent failure)
- ✅ Console shows GitHub API calls (check DevTools)

**Note:** Code context will only be fetched successfully if:
- File paths in stack trace match repository structure
- Files exist at that branch/commit
- Paths are relative to repo root (e.g., `src/file.cpp` not `/absolute/path/file.cpp`)

**IMPORTANT:** Even if direct code fetch fails (404), the repository URL and branch are ALWAYS provided to the AI, so it can still access the public repository and provide repository-aware analysis.

### Test Case 5: GitHub Fetch Failure Handling

**Objective:** Verify graceful degradation when GitHub is unavailable

**Steps:**
1. Configure Settings with invalid repo:
   - GitHub Repository URL: `https://github.com/rdkcentral/nonexistent-repo-12345`
   - Branch: `main`
   - Save settings

2. Analyze any stack trace
3. Click "Analyze with AI"

**Expected Results:**
- ✅ Status shows GitHub fetch attempt
- ✅ Warning in console: "GitHub context fetch failed"
- ✅ Status updates: "🤖 Analyzing with AI (GitHub fetch failed, continuing without code context)..."
- ✅ AI analysis continues normally without code
- ✅ No crash or hang
- ✅ User gets analysis despite GitHub failure

### Test Case 6: Multi-Frame Code Context

**Objective:** Verify code context for multiple stack frames

**Steps:**
1. Configure Settings with a known rdkcentral repository
2. Create a stack trace with 5-10 frames pointing to actual source files
3. Analyze with AI

**Expected Results:**
- ✅ Maximum 10 frames processed for code context (rate limit protection)
- ✅ Only source files attempted (skips system libraries like `/lib/x86_64/libc.so`)
- ✅ Code context shown for each found file
- ✅ Each code snippet shows ±5 lines around crash line
- ✅ Target line marked with `➤` indicator
- ✅ Line numbers displayed correctly
- ✅ Syntax highlighting language detected from file extension

### Test Case 7: Different Branch/Tag/Commit

**Objective:** Verify branch/tag/commit specification works

**Test Scenarios:**

**7a. Specific Branch:**
- Repository: `https://github.com/rdkcentral/Thunder`
- Branch: `master` (or another known branch)
- Expected: Fetches code from that branch

**7b. Tag:**
- Repository: `https://github.com/rdkcentral/Thunder`
- Branch/Tag: `R4.1` (example tag, check actual tags)
- Expected: Fetches code from that tag

**7c. Commit SHA:**
- Repository: `https://github.com/rdkcentral/Thunder`
- Branch/Tag: `abc123def456` (use an actual commit SHA)
- Expected: Fetches code from that specific commit

**Expected Results:**
- ✅ All three types (branch/tag/commit) work
- ✅ Code fetched from correct version
- ✅ No errors when switching between types

### Test Case 8: Code Context in AI Prompt

**Objective:** Verify AI receives and uses code context

**Steps:**
1. Configure GitHub with test repository
2. Analyze a stack trace with matching files
3. In browser DevTools Console, check the AI service logs
4. Look for the generated prompt

**Expected Results:**
- ✅ Prompt includes "## 📦 Repository Code Context" section
- ✅ Each frame shows:
  - Frame number and function name
  - File path and line number
  - Code snippet with line numbers
  - Target line marked with `➤`
  - Proper syntax highlighting language tag
- ✅ AI analysis references specific code lines
- ✅ More detailed and accurate analysis with code

### Test Case 9: Follow-Up Questions (Regression Test)

**Objective:** Verify follow-up questions still work after Day 3 changes

**Steps:**
1. Complete any analysis (with or without GitHub context)
2. Wait for "Ask Me Anything" section to appear
3. Type question: "What could cause this memory leak?"
4. Click "Ask"

**Expected Results:**
- ✅ Follow-up section works as before
- ✅ Question submitted successfully
- ✅ AI responds with context from original analysis
- ✅ No regression in Day 2 functionality

## Debugging Tips

### Console Logs to Check
Open Chrome DevTools (F12) and check Console for:

```javascript
// Expected logs for GitHub integration:
"GitHub repo configured: https://github.com/..."
"Fetching code context for X frames"
"Fetched code context for file: src/file.cpp"
"Warning: Failed to fetch src/missing.cpp: 404"
"Code context found for N frames"
```

### Network Tab Inspection
In DevTools Network tab, look for:
- `raw.githubusercontent.com` requests (GitHub file fetches)
- `generativelanguage.googleapis.com` requests (AI API calls)
- Check response status codes (200 = success, 404 = not found)

### Common Issues and Solutions

**Issue:** "Invalid GitHub URL" error
- **Solution:** Ensure URL format is exact: `https://github.com/owner/repo` (no trailing slash)

**Issue:** Code context not found
- **Possible causes:**
  - File paths in stack trace don't match repository structure
  - Branch/tag/commit doesn't exist
  - Files are in subdirectories (need full path from repo root)
- **Solution:** Check repository structure on GitHub and verify paths

**Issue:** Analysis slow when GitHub configured
- **Cause:** Fetching multiple files from GitHub API
- **Expected:** Adds 2-5 seconds for GitHub fetches
- **Mitigation:** Only top 10 frames processed

**Issue:** "API rate limit exceeded"
- **Cause:** GitHub API has rate limits (60 requests/hour for unauthenticated)
- **Solution:** Wait or reduce number of frames analyzed

## Performance Expectations

| Scenario | Expected Time |
|----------|---------------|
| Parse only | < 1 second |
| AI analysis (no GitHub) | 10-15 seconds |
| AI analysis (with GitHub) | 15-20 seconds |
| GitHub fetch per file | 0.5-2 seconds |

## Test Completion Checklist

- [ ] C multi-line parser works with provided test case
- [ ] GitHub settings can be saved and loaded
- [ ] Analysis works WITHOUT GitHub (regression test)
- [ ] Analysis works WITH GitHub context
- [ ] GitHub fetch failures are handled gracefully
- [ ] Code context appears in AI analysis
- [ ] Multiple frames processed correctly
- [ ] Different branches/tags/commits work
- [ ] Follow-up questions still work (regression)
- [ ] No JavaScript errors in console
- [ ] No breaking of existing Day 1/2 functionality

## Reporting Issues

If you encounter issues, please provide:
1. **Stack trace used** (paste the exact text)
2. **GitHub repository and branch** configured
3. **Console errors** (from DevTools)
4. **Expected vs actual behavior**
5. **Screenshots** if UI issue

## Success Criteria

✅ All test cases pass
✅ No console errors
✅ Existing functionality preserved
✅ GitHub integration enhances analysis when configured
✅ Graceful degradation when GitHub unavailable
✅ C parser handles multi-line format correctly

---

**Day 3 Implementation Complete!** 🎉

You now have:
- Enhanced C stack trace parser for RDK/glibc multi-line format
- GitHub repository context integration
- Code-aware AI analysis with actual source code
- Graceful fallback when code context unavailable
- Optional GitHub configuration (doesn't break existing workflows)
