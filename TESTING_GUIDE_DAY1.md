# 🧪 Quick Testing Guide - Day 1

## Installation Steps

### 1. Generate Extension Icons (2 minutes)

**Option A - Use the Icon Generator (Recommended):**
```bash
# Open the icon generator in your browser
open extension/icons/create-icons.html
```

1. Click "Generate Icons" button
2. Right-click each generated icon image
3. Save as: `icon16.png`, `icon48.png`, `icon128.png` in the `extension/icons/` folder

**Option B - Skip Icons Temporarily:**
Edit `extension/manifest.json` and comment out lines 21-29 (icons section):
```json
// Temporarily comment out:
// "icons": {
//   "16": "icons/icon16.png",
//   "48": "icons/icon48.png",
//   "128": "icons/icon128.png"
// },
```

### 2. Load Extension in Chrome (1 minute)

1. Open Chrome
2. Go to: `chrome://extensions/`
3. Enable "Developer mode" (top-right toggle)
4. Click "Load unpacked"
5. Navigate to and select: `/Users/ssahu777/ai_crashanalysis/extension`
6. Extension appears in list ✅

### 3. Pin Extension to Toolbar

1. Click puzzle icon (Extensions) in Chrome toolbar
2. Find "AI Crash Analysis Assistant"
3. Click pin icon 📌

---

## Quick Tests (15 minutes total)

### ✅ Test 1: Basic UI (2 min)
1. Click extension icon
2. ✓ Popup opens with clean interface
3. ✓ "Analyze with AI" button is disabled (gray)
4. ✓ Character counter shows "0 characters"

### ✅ Test 2: Input & Parsing - Java (3 min)
Paste this:
```
Exception in thread "main" java.lang.NullPointerException
    at com.example.MyClass.processData(MyClass.java:45)
    at com.example.Service.handleRequest(Service.java:123)
    at com.example.Main.main(Main.java:15)
```

1. Paste into textarea
2. ✓ Character count updates
3. ✓ "Analyze" button becomes blue
4. Click "Analyze with AI"
5. ✓ Status shows "Parsing stack trace..."
6. ✓ "Parsed Stack Trace (3 frames)" section appears
7. ✓ Expand to see parsed frames with details

### ✅ Test 3: Input & Parsing - Python (2 min)
Clear and paste:
```
Traceback (most recent call last):
  File "app.py", line 15, in main
  File "service.py", line 42, in process_request
  File "database.py", line 89, in query
ValueError: Invalid query parameter
```

1. Click "Analyze with AI"
2. ✓ Parses correctly showing 3 frames

### ✅ Test 4: Input & Parsing - JavaScript (2 min)
Clear and paste:
```
Error: Cannot read property 'name' of undefined
    at UserService.getName (user-service.js:45:12)
    at AuthController.login (auth-controller.js:78:23)
    at app.js:123:5
```

1. Click "Analyze with AI"
2. ✓ Shows 3 frames with line:column numbers

### ✅ Test 5: Clear Function (1 min)
1. Click "Clear" button
2. ✓ All text removed
3. ✓ Counter resets to 0
4. ✓ Analyze button disabled
5. ✓ Parsed section hidden

### ✅ Test 6: Data Persistence (2 min)
1. Paste any stack trace
2. Close popup (click outside)
3. Open popup again
4. ✓ Stack trace is still there
5. ✓ Settings preserved

### ✅ Test 7: Keyboard Shortcuts (1 min)
1. Enter stack trace
2. Press `Cmd+Enter` (Mac) or `Ctrl+Enter` (Windows)
3. ✓ Triggers analysis
4. Press `Cmd+K` or `Ctrl+K`
5. ✓ Clears everything

### ✅ Test 8: Context Menu (2 min)
1. On any webpage, type or select text:
```
at MyClass.method(File.java:123)
```
2. Right-click selected text
3. ✓ Menu shows "Analyze with AI Crash Assistant"
4. Click menu item
5. ✓ Extension opens with selected text

---

## 🐛 Check for Errors

### View Console Logs
1. Right-click extension icon
2. Select "Inspect popup"
3. Check Console tab
4. ✓ No red errors should appear

### Background Worker Logs
1. Go to `chrome://extensions/`
2. Find "AI Crash Analysis Assistant"
3. Click "service worker" link
4. ✓ Should show: "Background service worker started"

---

## Sample Stack Traces for Testing

### C++ Stack Trace
```
#0  0x00007ffff7a3d428 in raise () from /lib64/libc.so.6
#1  0x00007ffff7a3f02a in abort () from /lib64/libc.so.6
#2  0x0000000000401234 in MyClass::processData() at src/myclass.cpp:45
#3  0x0000000000401567 in Service::handleRequest() at src/service.cpp:123
```

### C# Stack Trace
```
System.NullReferenceException: Object reference not set to an instance of an object.
   at MyNamespace.MyClass.ProcessData() in MyClass.cs:line 45
   at MyNamespace.Service.HandleRequest() in Service.cs:line 123
   at MyNamespace.Program.Main(String[] args) in Program.cs:line 15
```

### Generic Format
```
MyClass.processData (File.java:45)
Service.handleRequest (Service.java:123)
Main.main (Main.java:15)
```

---

## ✅ Day 1 Success Criteria

Mark complete when all work:
- [ ] Extension loads in Chrome without errors
- [ ] Popup UI displays correctly
- [ ] Can input stack traces (paste or type)
- [ ] Character counter updates
- [ ] Analyze button enables/disables correctly
- [ ] Parses Java stack traces correctly
- [ ] Parses Python stack traces correctly
- [ ] Parses JavaScript stack traces correctly
- [ ] Shows error for invalid input
- [ ] Clear button works
- [ ] Data persists across sessions
- [ ] Keyboard shortcuts work
- [ ] Context menu appears
- [ ] No console errors

---

## 📸 Screenshots to Take (for Demo)

1. Extension installed in Chrome
2. Popup with clean UI (empty state)
3. Popup with stack trace entered
4. Parsed stack trace section expanded
5. Context menu with extension option

---

## Next: Day 2 Preview

Tomorrow we'll add:
- AI/Copilot API integration
- Prompt engineering for crash analysis
- Display AI suggestions
- Interactive follow-up questions

**Estimated Time:** 6-8 hours
**Prerequisites:** API access to organization's Copilot

---

**Testing Completed:** ___/___/2026  
**Tested By:** ________________  
**Status:** ⬜ Pass | ⬜ Fail | ⬜ Partial  
**Notes:**
