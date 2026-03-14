# JSON Stack Trace Extract Feature - Testing Guide

## Feature Overview

The Extract button now allows you to upload a JSON file containing stack trace data in the backtrace.json format. The extension will:
1. Read the JSON file
2. Extract the first thread's `stackWalk` array
3. Format it as a readable stack trace
4. Display it in the input area
5. Make it ready for AI analysis

---

## Implementation Details

### Files Modified

1. **extension/popup.html**
   - Added hidden file input: `<input type="file" id="jsonFileInput" accept=".json">`
   - Updated Extract button tooltip to "Upload JSON stack trace file"

2. **extension/popup.js**
   - Added `jsonFileInput` DOM reference
   - Modified `extractFromPage()` to trigger file upload dialog
   - Added `handleFileUpload()` function to process uploaded files
   - Added `parseBacktraceJson()` to parse JSON and extract first thread
   - Added `formatStackWalk()` to format stack frames as readable text

### Code Changes Summary

**New Functions:**
- `handleFileUpload(event)` - Handles file selection and reading
- `parseBacktraceJson(jsonData)` - Extracts first thread's stackWalk from JSON
- `formatStackWalk(stackWalk, threadId)` - Formats stack frames as text

**Modified Functions:**
- `extractFromPage()` - Now triggers file input instead of page extraction

---

## Testing Procedures

### Test 1: Basic JSON Upload ✅

**Objective:** Verify JSON file upload works correctly

**Steps:**
1. Open Chrome and load the extension
2. Click the extension icon to open popup
3. Click the "Extract" button
4. Select the `backtrace.json` file from `/Users/ssahu777/ai_crashanalysis/`
5. Observe the result

**Expected Results:**
- ✅ File selection dialog appears
- ✅ Status shows "📂 Reading JSON file..."
- ✅ Status changes to "✅ Stack trace extracted from JSON successfully!"
- ✅ Stack trace appears in the text area
- ✅ Character count updates
- ✅ "Analyze with AI" button becomes enabled
- ✅ Status message auto-hides after 2 seconds

**Expected Format:**
```
Thread 9 Stack Trace:
============================================================

#0  strlen
    from libc.so.6

#1  __strdup
    from libc.so.6
    at /usr/src/debug/glibc/2.35-r0/git/string/strdup.c:41

#2  appendRequestParams
    from libxconfclient.so.0.0.0
    at /usr/src/debug/telemetry/1.99+git64f60f5e15-r0/build/source/xconf-client/../../../git/source/xconf-client/xconfclient.c:229

...
```

---

### Test 2: JSON Validation ✅

**Objective:** Verify proper error handling for invalid files

**Test 2.1: Non-JSON File**
```
Steps:
1. Click "Extract" button
2. Try to select a .txt or .png file
3. Observe result

Expected:
- File picker shows only .json files (accept filter)
- If other files are shown, selecting them should trigger validation
```

**Test 2.2: Invalid JSON Content**
```
Steps:
1. Create a file named "invalid.json" with content: {invalid json}
2. Click "Extract" and select this file
3. Observe result

Expected:
- Status shows "❌ Failed to parse JSON file: [error message]"
- Input area remains unchanged
- Message auto-hides after 3 seconds
```

**Test 2.3: JSON Without threads Object**
```
Steps:
1. Create "no-threads.json" with content: {"data": "test"}
2. Click "Extract" and select this file
3. Observe result

Expected:
- Status shows "❌ No valid stackWalk found in JSON"
- Console shows: "No threads object found in JSON"
- Input area remains unchanged
```

**Test 2.4: JSON With Empty threads**
```
Steps:
1. Create "empty-threads.json" with content: {"threads": {}}
2. Click "Extract" and select this file
3. Observe result

Expected:
- Status shows "❌ No valid stackWalk found in JSON"
- Console shows: "No threads found in JSON"
```

---

### Test 3: Stack Trace Formatting ✅

**Objective:** Verify correct parsing and formatting of stackWalk data

**Steps:**
1. Upload `backtrace.json`
2. Review the formatted output in the text area
3. Check console logs for verification

**Verify Format Contains:**
- ✅ Thread header: "Thread 9 Stack Trace:"
- ✅ Separator line of '=' characters
- ✅ Frame numbers starting with #0
- ✅ Function names (e.g., "strlen", "__strdup", "appendRequestParams")
- ✅ Library names prefixed with "from" (e.g., "from libc.so.6")
- ✅ Source code paths prefixed with "at" (e.g., "at /usr/src/.../strdup.c:41")
- ✅ Line numbers when available (e.g., ":229")
- ✅ Empty lines between frames for readability

**Console Verification:**
```
Expected console log:
📊 Extracting thread 9 with [N] frames
```

---

### Test 4: AI Analysis Integration ✅

**Objective:** Verify extracted stack trace can be analyzed by AI

**Steps:**
1. Upload `backtrace.json` using Extract button
2. Wait for stack trace to populate
3. Click "Analyze with AI" button
4. Wait for AI response
5. Review the analysis

**Expected Results:**
- ✅ AI analysis starts without errors
- ✅ AI recognizes it as a C/C++ stack trace
- ✅ Analysis includes sections:
  - ROOT CAUSE IDENTIFICATION
  - ISSUE PATTERN ANALYSIS
  - RECOMMENDED INVESTIGATION STEPS
  - REPOSITORY-SPECIFIC (if GitHub configured)
- ✅ AI identifies the crash type (SIGSEGV)
- ✅ AI mentions the failing functions (strlen, __strdup, appendRequestParams)
- ✅ AI suggests null pointer or memory corruption issues
- ✅ Copy button works to copy analysis

---

### Test 5: GitHub Integration ✅

**Objective:** Verify GitHub file fetching works with extracted paths

**Pre-requisites:**
- Configure GitHub repository in Settings
- Use a repository that contains the source files (if available)

**Steps:**
1. Configure Settings:
   - GitHub Repository: `https://github.com/[owner]/[repo]`
   - Branch: `main` or appropriate branch
2. Upload `backtrace.json`
3. Click "Analyze with AI"
4. Open Browser DevTools Console
5. Review GitHub fetch attempts

**Expected Console Logs:**
```
Fetching: https://raw.githubusercontent.com/[owner]/[repo]/main/string/strdup.c
Fetching: https://raw.githubusercontent.com/[owner]/[repo]/main/source/xconf-client/xconfclient.c
```

**Expected Results:**
- ✅ Extension attempts to fetch source files
- ✅ If files found: Code context included in AI prompt
- ✅ If files not found (404): Repository URL still provided to AI
- ✅ Analysis contains "REPOSITORY-SPECIFIC" section with suggestions

---

### Test 6: Existing Functionality Regression ✅

**Objective:** Ensure all existing features still work

**Test 6.1: Manual Paste**
```
Steps:
1. Paste a Java or Python stack trace directly into the input
2. Click "Analyze with AI"

Expected:
- ✅ Analysis works as before
- ✅ No errors or issues
```

**Test 6.2: Clear Button**
```
Steps:
1. Upload JSON file
2. Click "Clear" button

Expected:
- ✅ Input cleared
- ✅ Results hidden
- ✅ All state reset
```

**Test 6.3: Copy Button**
```
Steps:
1. Upload JSON and analyze
2. Click copy button after analysis completes

Expected:
- ✅ Analysis copied to clipboard
- ✅ Visual feedback shown
- ✅ Status message displayed
```

**Test 6.4: Follow-up Questions**
```
Steps:
1. Upload JSON and analyze
2. Ask a follow-up question

Expected:
- ✅ Follow-up works normally
- ✅ AI provides contextual answer
```

**Test 6.5: Settings Persistence**
```
Steps:
1. Configure GitHub settings
2. Close and reopen extension
3. Upload JSON and analyze

Expected:
- ✅ Settings persist
- ✅ GitHub integration still works
```

---

### Test 7: Edge Cases ✅

**Test 7.1: Multiple File Uploads**
```
Steps:
1. Upload backtrace.json
2. Click "Extract" again
3. Upload a different JSON file
4. Repeat 2-3 times

Expected:
- ✅ Each upload replaces previous content
- ✅ No memory leaks or accumulation
- ✅ File input resets after each upload
```

**Test 7.2: Cancel File Selection**
```
Steps:
1. Click "Extract" button
2. Cancel the file selection dialog

Expected:
- ✅ No error messages
- ✅ Extension remains functional
- ✅ Input area unchanged
```

**Test 7.3: Large JSON File**
```
Steps:
1. Create/use a JSON with many threads and long stackWalk arrays
2. Upload the file

Expected:
- ✅ File loads successfully
- ✅ First thread extracted regardless of size
- ✅ UI remains responsive
```

**Test 7.4: JSON with Missing Fields**
```
Steps:
1. Create JSON with incomplete stackWalk entries:
{
  "threads": {
    "1": {
      "stackWalk": [
        {
          "callStack": 0,
          "functionName": "test"
          // Missing other fields
        }
      ]
    }
  }
}
2. Upload this file

Expected:
- ✅ Parsing succeeds with available data
- ✅ Missing fields shown as empty or "(unknown)"
- ✅ No crashes or errors
```

---

## Sample Test Data

### Valid backtrace.json
Located at: `/Users/ssahu777/ai_crashanalysis/backtrace.json`

**Key Structure:**
```json
{
  "threads": {
    "9": {
      "stackWalk": [
        {
          "callStack": 0,
          "appName": "libc.so.6",
          "functionName": "strlen",
          "sourceCode": "",
          "sourceLine": "",
          "sourceAddress": "0x23"
        },
        ...
      ]
    },
    "0": { ... },
    "1": { ... }
  }
}
```

### Test JSON (Minimal Valid)
```json
{
  "threads": {
    "1": {
      "stackWalk": [
        {
          "callStack": 0,
          "appName": "test.so",
          "functionName": "testFunction",
          "sourceCode": "/path/to/test.c",
          "sourceLine": 42,
          "sourceAddress": "0x1234"
        }
      ]
    }
  }
}
```

---

## Known Issues and Limitations

### Current Limitations:
1. **Only First Thread Extracted**
   - By design, only the first thread's stackWalk is extracted
   - Thread order depends on JSON object key order (may not be sequential)
   - In the provided backtrace.json, thread "9" is first, not thread "0"

2. **File Size**
   - Very large JSON files may cause performance issues
   - Browser memory limits apply to file reading

3. **JSON Format**
   - Must match the exact structure with `threads` object containing `stackWalk` arrays
   - Other JSON formats will fail validation

### Future Enhancements (Out of Scope):
- Select which thread to extract
- Extract and merge multiple threads
- Support for other JSON formats
- Drag-and-drop file upload
- Recent files history

---

## Console Log Reference

### Successful Upload:
```
📊 Extracting thread 9 with 6 frames
```

### Error Cases:
```
No threads object found in JSON
No threads found in JSON
No stackWalk array found in first thread
Error parsing backtrace JSON: [error details]
```

---

## Verification Checklist

Before marking testing as complete, verify:

- [ ] **Upload Flow**
  - [ ] Extract button triggers file picker
  - [ ] Only .json files are filtered (or validated)
  - [ ] File selection shows loading status
  - [ ] Success message appears on completion

- [ ] **Parsing Logic**
  - [ ] First thread correctly identified
  - [ ] stackWalk array properly extracted
  - [ ] All stack frames formatted correctly
  - [ ] Console logs provide useful debugging info

- [ ] **UI Updates**
  - [ ] Stack trace appears in text area
  - [ ] Character count updates
  - [ ] Analyze button becomes enabled
  - [ ] Status messages appear and auto-hide

- [ ] **AI Integration**
  - [ ] Extracted trace can be analyzed
  - [ ] AI recognizes trace format
  - [ ] Analysis quality is good
  - [ ] All sections generated

- [ ] **Error Handling**
  - [ ] Invalid JSON shows clear error
  - [ ] Missing fields handled gracefully
  - [ ] Network errors don't crash extension
  - [ ] User-friendly error messages

- [ ] **Regression Testing**
  - [ ] Manual paste still works
  - [ ] Clear button works
  - [ ] Copy button works
  - [ ] Follow-up questions work
  - [ ] Settings persist
  - [ ] GitHub integration works

- [ ] **Edge Cases**
  - [ ] Multiple uploads work
  - [ ] Cancel file selection handled
  - [ ] Large files don't crash
  - [ ] Incomplete data handled

---

## Quick Test Script

**5-Minute Smoke Test:**

```
1. Load extension (chrome://extensions/)
2. Click extension icon
3. Click "Extract" button
4. Select backtrace.json from /Users/ssahu777/ai_crashanalysis/
5. Verify stack trace appears (should start with "Thread 9 Stack Trace:")
6. Click "Analyze with AI"
7. Wait for analysis
8. Verify analysis has 3-4 sections
9. Click copy button
10. Paste in a text editor - verify content copied

PASS: All steps succeed ✅
FAIL: Any step fails ❌
```

---

## Troubleshooting Guide

### Issue: File picker doesn't appear
**Solution:** 
- Check browser console for errors
- Reload extension (chrome://extensions/ > Reload)
- Verify jsonFileInput element exists in HTML

### Issue: "No valid stackWalk found" error
**Solution:**
- Open JSON in text editor
- Verify `threads` object exists
- Verify at least one thread has `stackWalk` array
- Check JSON syntax with JSON validator

### Issue: Stack trace appears but AI analysis fails
**Solution:**
- Check API key is configured correctly
- Verify internet connection
- Check browser console for API errors
- Try manual paste to isolate issue

### Issue: GitHub files not fetched
**Solution:**
- Verify repository URL is correct
- Ensure repository is public
- Check branch name matches
- Review console for 404 errors (may be expected)

---

## Success Criteria

✅ **Feature Successfully Implemented If:**

1. Extract button triggers file upload dialog
2. Valid JSON files are parsed correctly
3. First thread's stackWalk is extracted
4. Stack trace is formatted readably
5. Formatted trace appears in input area
6. AI can analyze the extracted trace
7. All existing features still work
8. Error handling is user-friendly
9. No console errors during normal operation
10. Documentation is clear and complete

---

**Testing Completed:** [Date]  
**Tested By:** [Name]  
**Status:** [PASS/FAIL]  
**Notes:** [Any additional observations]

---

## Next Steps After Testing

1. **If All Tests Pass:**
   - Feature is ready for use
   - Update LABWEEK_MVP_PLAN.md to mark Day 4 Extract feature complete
   - Proceed with Day 5 demo preparation

2. **If Issues Found:**
   - Document issues in detail
   - Prioritize by severity
   - Create fix plan
   - Retest after fixes

3. **Future Improvements:**
   - Add thread selection dropdown
   - Support multiple JSON formats
   - Add drag-and-drop upload
   - Create file preview before processing
