# Day 4 Testing Guide - AI Crash Analysis Extension

## Overview
This guide provides comprehensive testing procedures for Day 4 enhancements including copy-to-clipboard functionality, UI polish, and verification of all existing features.

## Pre-Testing Setup

### 1. Load the Extension
```
1. Open Chrome and go to chrome://extensions/
2. Enable "Developer mode" (toggle in top-right)
3. Click "Load unpacked"
4. Select the /Users/ssahu777/ai_crashanalysis/extension folder
5. Verify extension appears with no errors
```

### 2. Configure Settings
```
1. Click the extension icon in Chrome toolbar
2. Click "⚙️ Settings" button at the bottom
3. Configure:
   - Google AI API Key: [Your API key from https://aistudio.google.com/app/apikey]
   - Model: gemini-2.5-flash (recommended)
   - GitHub Repository: [Optional, e.g., https://github.com/owner/repo]
   - Branch/Tag: [Optional, e.g., main or v1.0.0]
4. Click "Save Settings"
5. Verify success message appears
```

---

## Day 4 New Features Testing

### Test 1: Copy-to-Clipboard Functionality

**Test 1.1: Copy Button Visibility**
```
✓ Criteria: Copy button should appear in the results section header
Steps:
1. Open extension popup
2. Verify "📋" copy icon button appears next to "AI Analysis" header
3. Hover over copy button - should show tooltip "Copy to clipboard"
4. Button should have subtle border and hover effect

Expected: Copy button visible with proper styling ✅
```

**Test 1.2: Copy Without Analysis**
```
✓ Criteria: Should show warning when no analysis exists
Steps:
1. Open fresh extension popup (after clearing or first load)
2. Click the copy button
3. Observe status message

Expected: 
- Status shows "⚠️ No analysis available to copy"
- Message auto-hides after 2 seconds ✅
```

**Test 1.3: Copy After Analysis**
```
✓ Criteria: Should copy analysis text to clipboard
Steps:
1. Paste a sample stack trace (use Sample 1 below)
2. Click "Analyze Stack Trace"
3. Wait for AI analysis to complete
4. Click the copy button (📋)
5. Open a text editor and paste (Cmd+V / Ctrl+V)

Expected:
- Status shows "✅ Analysis copied to clipboard!"
- Copy button turns green briefly
- Status auto-hides after 2 seconds
- Pasted content matches the AI analysis text (markdown format) ✅
```

**Test 1.4: Copy Button Visual Feedback**
```
✓ Criteria: Button should provide visual feedback on click
Steps:
1. Complete an analysis with any stack trace
2. Click copy button
3. Observe button color change
4. Wait 2 seconds

Expected:
- Button color changes to green immediately
- Title changes to "Copied!"
- After 2 seconds, button returns to normal state ✅
```

---

## Day 1-3 Regression Testing

### Test 2: Stack Trace Parsing (Day 1)

**Test 2.1: Java Stack Trace**
```
✓ Criteria: Should parse Java stack traces correctly
Sample Input:
```
```java
Exception in thread "main" java.lang.NullPointerException
    at com.example.MyClass.myMethod(MyClass.java:42)
    at com.example.Main.main(Main.java:10)
```
```
Steps:
1. Paste the Java stack trace
2. Check character count updates
3. Click "Analyze Stack Trace"
4. Expand "Parsed Stack Frames" section

Expected:
- 2 frames parsed
- Frame details show file names and line numbers
- Analysis includes Java-specific suggestions ✅
```

**Test 2.2: Python Stack Trace**
```
✓ Criteria: Should parse Python stack traces correctly
Sample Input:
```
```python
Traceback (most recent call last):
  File "main.py", line 12, in <module>
    result = divide(10, 0)
  File "utils.py", line 5, in divide
    return a / b
ZeroDivisionError: division by zero
```
```
Steps:
1. Paste the Python stack trace
2. Click "Analyze Stack Trace"
3. Verify parsing

Expected:
- 2 frames parsed
- Detects ZeroDivisionError
- Analysis provides Python-specific guidance ✅
```

**Test 2.3: C Multi-line Stack Trace (RDK Format)**
```
✓ Criteria: Should parse complex C stack traces with build paths
Sample Input:
```
```
#0  0x00007f9d3e4f1234 in free ()
    from /lib/x86_64-linux-gnu/libc.so.6
#1  0x00007f9d3e4f5678 in cleanup_buffer (buf=0x123456)
    at /usr/src/debug/telemetry/1.0-r0/git/source/telemetry_module.c:145
#2  0x00007f9d3e4f9abc in process_data ()
    at /usr/src/debug/telemetry/1.0-r0/git/source/data_processor.c:89
```
```
Steps:
1. Paste the C stack trace
2. Click "Analyze Stack Trace"
3. Verify parsing and path extraction

Expected:
- 3 frames parsed
- Paths extracted correctly (after /git/)
- GitHub service attempts to fetch source/telemetry_module.c
- Analysis includes C-specific memory debugging tips ✅
```

### Test 3: AI Integration (Day 2)

**Test 3.1: Full Analysis Generation**
```
✓ Criteria: AI should generate 3-4 section analysis
Steps:
1. Use any valid stack trace
2. Analyze and wait for completion
3. Review analysis structure

Expected:
- Section 1: ROOT CAUSE IDENTIFICATION
- Section 2: ISSUE PATTERN ANALYSIS
- Section 3: RECOMMENDED INVESTIGATION STEPS
- Section 4: REPOSITORY-SPECIFIC (if GitHub configured)
- All sections present with content
- Proper markdown formatting (headers, lists, code blocks) ✅
```

**Test 3.2: Follow-up Questions**
```
✓ Criteria: Should handle follow-up questions
Steps:
1. Complete an analysis
2. Verify "Ask Follow-up Question" section appears
3. Type: "What debugging tools would help?"
4. Click "Ask" or press Enter
5. Wait for AI response

Expected:
- Question appears in results section (blue box)
- AI provides contextual answer
- Answer formatted properly
- Can ask multiple follow-ups ✅
```

**Test 3.3: API Error Handling**
```
✓ Criteria: Should handle API errors gracefully
Steps:
1. Go to Settings
2. Enter invalid API key (e.g., "invalid-key-12345")
3. Save and return to main screen
4. Try to analyze a stack trace

Expected:
- Error message displayed
- User-friendly error description
- Suggestion to check API key in settings ✅
```

### Test 4: GitHub Integration (Day 3)

**Test 4.1: Without GitHub Configuration**
```
✓ Criteria: Should work without GitHub settings
Steps:
1. Go to Settings
2. Clear GitHub Repository and Branch fields
3. Save settings
4. Analyze a stack trace

Expected:
- Analysis completes successfully
- Only 3 sections generated (no Section 4)
- No GitHub fetch attempts in console
- Analysis still useful and complete ✅
```

**Test 4.2: With GitHub Configuration (Public Repo)**
```
✓ Criteria: Should fetch files from GitHub
Steps:
1. Configure GitHub: https://github.com/torvalds/linux
2. Branch: master
3. Use stack trace with Linux kernel paths:
```
```
kernel BUG at mm/page_alloc.c:1234!
    at mm/page_alloc.c:1234
    at kernel/fork.c:567
```
```
4. Open browser DevTools Console
5. Click "Analyze Stack Trace"

Expected:
- Console logs show GitHub fetch attempts
- Section 4 "REPOSITORY-SPECIFIC" appears
- If files found: code context included
- If 404: repository URL still provided in analysis ✅
```

**Test 4.3: GitHub Path Extraction**
```
✓ Criteria: Should extract paths correctly from build paths
Test with path:
/usr/src/debug/telemetry/1.0-r0/git/source/file.c

Expected extracted path: source/file.c
Verify in console logs: "Extracted repo path: source/file.c" ✅
```

### Test 5: UI/UX Features

**Test 5.1: Keyboard Shortcuts**
```
✓ Criteria: Should support keyboard shortcuts
Steps:
1. Focus on stack trace input
2. Type some text
3. Press Ctrl+Enter (Cmd+Enter on Mac)

Expected: Analysis starts (same as clicking Analyze button) ✅
```

**Test 5.2: Character Counter**
```
✓ Criteria: Character counter should update in real-time
Steps:
1. Type in stack trace input
2. Observe character count

Expected:
- Count updates as you type
- Format: "X / 50000 characters"
- No lag or delay ✅
```

**Test 5.3: Clear Functionality**
```
✓ Criteria: Clear button should reset all data
Steps:
1. Complete an analysis
2. Ask a follow-up question
3. Click "Clear" button

Expected:
- Input cleared
- Results hidden
- Parsed section hidden
- Follow-up section hidden
- Character count reset to "0 / 50000"
- All state cleared ✅
```

**Test 5.4: Extract from Page**
```
✓ Criteria: Should extract text from active tab
Steps:
1. Open a webpage with text content
2. Select some text on the page
3. Open extension popup
4. Click "Extract from Page"

Expected:
- Selected text copied to input
- If no selection: error message
- Character count updates
- Analyze button enables if content valid ✅
```

---

## Day 4 UI Polish Verification

### Test 6: Visual Enhancements

**Test 6.1: Results Section Animation**
```
✓ Criteria: Results should fade in smoothly
Steps:
1. Analyze any stack trace
2. Observe the results section appearance

Expected:
- Smooth fade-in animation (0.3s)
- Slight upward movement effect
- Gradient background (light gray to white) ✅
```

**Test 6.2: Enhanced Headers in Analysis**
```
✓ Criteria: AI analysis headers should have visual enhancements
Steps:
1. Complete an analysis
2. Review the header styles in results

Expected:
- H1: Underline with gradient effect, left padding
- H2: Left border (3px solid blue), color accent
- H3: Bold, proper hierarchy
- Clear visual distinction between section levels ✅
```

**Test 6.3: Button Hover Effects**
```
✓ Criteria: All buttons should have smooth hover states
Test buttons:
- Analyze Stack Trace (primary)
- Clear (secondary)
- Extract from Page (secondary)
- Copy button (icon)
- Ask (follow-up)

Expected:
- Smooth color transitions (0.2s)
- Slight upward movement on hover (-1px)
- Shadow enhancement on primary button
- Cursor changes to pointer ✅
```

**Test 6.4: Section Shadows and Depth**
```
✓ Criteria: Major sections should have subtle shadows
Check sections:
- Results section
- Follow-up section
- Parsed section

Expected:
- Subtle box-shadow visible
- Gradient backgrounds on results/follow-up
- Proper visual depth hierarchy
- Professional appearance ✅
```

---

## Performance Testing

### Test 7: Performance & Edge Cases

**Test 7.1: Large Stack Trace**
```
✓ Criteria: Should handle large inputs
Steps:
1. Paste a stack trace with 100+ frames
2. Analyze

Expected:
- Parsing completes within 2-3 seconds
- UI remains responsive
- All frames captured (check parsed section)
- Analysis completes without timeout ✅
```

**Test 7.2: Invalid Input**
```
✓ Criteria: Should handle invalid input gracefully
Steps:
1. Paste random text (not a stack trace)
2. Click Analyze

Expected:
- Message: "No valid stack frames found"
- No crash or error
- UI remains usable ✅
```

**Test 7.3: Network Failure**
```
✓ Criteria: Should handle network errors
Steps:
1. Turn off internet connection
2. Try to analyze

Expected:
- Clear error message about network failure
- Suggestion to check connection
- No silent failure ✅
```

**Test 7.4: Multiple Rapid Clicks**
```
✓ Criteria: Should prevent duplicate requests
Steps:
1. Paste a stack trace
2. Click "Analyze" multiple times rapidly

Expected:
- Only one analysis runs
- Button disabled during analysis
- No duplicate API calls ✅
```

---

## Integration Testing

### Test 8: End-to-End Workflows

**Test 8.1: Complete Workflow with GitHub**
```
✓ Full workflow test
Steps:
1. Configure GitHub repository
2. Paste a stack trace with file paths matching repo
3. Analyze
4. Review all 4 sections
5. Copy analysis to clipboard
6. Ask a follow-up question
7. Clear all

Expected:
- All steps complete successfully
- GitHub files fetched (or 404 logged)
- Analysis contains repository context
- Copy works
- Follow-up answered
- Clear resets everything ✅
```

**Test 8.2: Complete Workflow without GitHub**
```
✓ Simplified workflow test
Steps:
1. Ensure GitHub settings are empty
2. Paste a Java or Python stack trace
3. Analyze
4. Review 3 sections
5. Copy to clipboard
6. Ask follow-up: "How do I prevent this?"
7. Test Clear

Expected:
- Analysis completes with 3 sections
- All features work without GitHub
- Copy and follow-up functional
- No errors in console ✅
```

---

## Console Logging Verification

### Test 9: Debug Logs

**Test 9.1: Verify Debugging Logs**
```
✓ Criteria: Console should show useful debug information
Steps:
1. Open Chrome DevTools Console
2. Run a complete analysis workflow
3. Review console output

Expected logs:
- "🔧 Prompt configuration: {sections: X, hasRepoContext: boolean}"
- "✅ AI Response received: {length: X, sections: Y, truncated: boolean}"
- "📊 Displaying analysis: {originalLength, formattedLength, sectionsFound}"
- GitHub fetch attempts (if configured)
- Extracted repo paths (for C traces) ✅
```

---

## Report Format

After completing tests, document results as:

```
✅ PASSED - [Test Name]: Brief description of success
❌ FAILED - [Test Name]: Description of failure + steps to reproduce
⚠️  PARTIAL - [Test Name]: Description of partial success + issues
```

---

## Common Issues & Solutions

### Issue 1: Copy Button Not Visible
**Solution**: Reload the extension (chrome://extensions/ > Reload)

### Issue 2: Analysis Shows Only 1 Section
**Solution**: Check console for truncation warnings. Verify API key has sufficient quota.

### Issue 3: GitHub Files Not Fetched
**Solution**: 
- Verify repository is public
- Check branch name is correct
- Review console for 404 errors (expected for some paths)

### Issue 4: Follow-up Questions Not Working
**Solution**: Ensure initial analysis completed successfully. Check lastAnalysis state.

### Issue 5: UI Looks Different
**Solution**: Hard reload extension popup (Cmd+Shift+R / Ctrl+Shift+R)

---

## Sample Stack Traces for Testing

### Sample 1: Java NullPointerException
```java
Exception in thread "main" java.lang.NullPointerException: Cannot invoke method on null object
	at com.example.service.UserService.getUserProfile(UserService.java:45)
	at com.example.controller.UserController.getUser(UserController.java:23)
	at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
	at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)
	at com.example.Main.main(Main.java:12)
```

### Sample 2: Python TypeError
```python
Traceback (most recent call last):
  File "/home/user/app/main.py", line 15, in <module>
    result = process_data(None)
  File "/home/user/app/utils/data_processor.py", line 34, in process_data
    return data.upper()
AttributeError: 'NoneType' object has no attribute 'upper'
```

### Sample 3: C Segmentation Fault (RDK Format)
```
Program received signal SIGSEGV, Segmentation fault.
0x00007f4b2c8d1234 in strcmp () from /lib/x86_64-linux-gnu/libc.so.6
#0  0x00007f4b2c8d1234 in strcmp () from /lib/x86_64-linux-gnu/libc.so.6
#1  0x00007f4b2c8d5678 in validate_string (str=0x0)
    at /usr/src/debug/telemetry/1.0-r0/git/source/validator.c:78
#2  0x00007f4b2c8d9abc in process_telemetry (data=0x7ffc123456)
    at /usr/src/debug/telemetry/1.0-r0/git/source/telemetry.c:156
#3  0x000055a8f1234567 in main () at /usr/src/debug/telemetry/1.0-r0/git/main.c:42
```

### Sample 4: JavaScript Error
```javascript
Uncaught TypeError: Cannot read properties of undefined (reading 'value')
    at handleSubmit (app.js:156:23)
    at HTMLFormElement.<anonymous> (app.js:45:12)
    at HTMLFormElement.dispatch (jquery.min.js:3:8453)
    at HTMLFormElement.v.handle (jquery.min.js:3:5246)
```

---

## Success Criteria Summary

All tests should pass with ✅ status for Day 4 to be considered complete:

- [x] Copy-to-clipboard functionality working
- [x] Visual feedback on copy action
- [x] UI polish applied (animations, gradients, shadows)
- [x] All Day 1-3 features still functional
- [x] No regressions introduced
- [x] Console logging working
- [x] Error handling robust
- [x] Performance acceptable

---

## Test Completion Checklist

- [ ] All Day 4 features tested (Tests 1, 6)
- [ ] All regression tests passed (Tests 2-5)
- [ ] Performance tests completed (Test 7)
- [ ] Integration tests passed (Test 8)
- [ ] Console logs verified (Test 9)
- [ ] Issues documented (if any)
- [ ] Extension ready for Day 5 demo preparation

---

**Testing Duration Estimate**: 45-60 minutes for complete test suite

**Last Updated**: Day 4 - March 12, 2026
