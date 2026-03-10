# AI Crash Analysis Chrome Extension - Day 1 Implementation

## 📦 Project Structure

```
extension/
├── manifest.json          # Extension configuration (Manifest V3)
├── popup.html            # Main UI interface
├── popup.css             # Styling for the popup
├── popup.js              # Popup logic and interactions
├── content.js            # Content script for page interaction
├── background.js         # Background service worker
├── icons/                # Extension icons
│   ├── create-icons.html # Helper to generate icons
│   └── placeholder.txt   # Instructions for icons
└── README.md            # This file
```

## ✅ Day 1 Completed Features

### 1. Chrome Extension Structure (Manifest V3)
- Modern Manifest V3 configuration
- Proper permissions setup
- Background service worker
- Content script injection

### 2. Popup UI with Stack Trace Input
- Clean, modern interface
- Large textarea for stack trace input
- Character counter
- Extract button (for future portal integration)
- Analyze button (enables when text is entered)
- Clear button
- Responsive design

### 3. Stack Trace Parsing
- Multi-language support:
  - Java
  - C++/C#
  - Python
  - JavaScript
  - Generic formats
- Structured frame extraction
- Display parsed frames with details

### 4. Data Persistence
- Auto-saves input to Chrome storage
- Restores last session on reopen

### 5. UI Features
- Modern gradient header
- Status messages with loading spinner
- Collapsible parsed stack section
- Keyboard shortcuts:
  - `Ctrl/Cmd + Enter` - Analyze
  - `Ctrl/Cmd + K` - Clear

## 🚀 Installation & Testing

### Step 1: Generate Icons (Optional but Recommended)

**Option A - Quick Method:**
1. Open `icons/create-icons.html` in a web browser
2. Click "Generate Icons"
3. Right-click each icon and "Save Image As" to the `icons/` folder
4. Save as: `icon16.png`, `icon48.png`, `icon128.png`

**Option B - Skip Icons for Now:**
1. Open `manifest.json`
2. Remove or comment out the `"icons"` and `"default_icon"` sections

### Step 2: Load Extension in Chrome

1. Open Chrome browser
2. Navigate to: `chrome://extensions/`
3. Enable "Developer mode" (toggle in top-right corner)
4. Click "Load unpacked"
5. Select the `extension` folder: `/Users/ssahu777/ai_crashanalysis/extension`
6. The extension should now appear in your extensions list

### Step 3: Pin the Extension

1. Click the puzzle piece icon (Extensions) in Chrome toolbar
2. Find "AI Crash Analysis Assistant"
3. Click the pin icon to pin it to the toolbar

## 🧪 Testing Guide

### Test 1: Basic UI

1. Click the extension icon in Chrome toolbar
2. **Expected:** Popup opens with clean interface
3. **Verify:**
   - Header shows "Crash Analysis" with MVP badge
   - Textarea is visible with placeholder text
   - "Analyze with AI" button is disabled (grayed out)
   - Character counter shows "0 characters"

### Test 2: Text Input & Character Count

1. Paste any text into the textarea
2. **Expected:**
   - Character count updates in real-time
   - "Analyze with AI" button becomes enabled (blue)
3. Type more text and observe updates

### Test 3: Clear Functionality

1. Enter some text
2. Click "Clear" button
3. **Expected:**
   - Textarea clears
   - Character count resets to 0
   - Analyze button becomes disabled
   - Any visible results disappear

### Test 4: Stack Trace Parsing - Java

Paste this Java stack trace:
```
Exception in thread "main" java.lang.NullPointerException
    at com.example.MyClass.processData(MyClass.java:45)
    at com.example.Service.handleRequest(Service.java:123)
    at com.example.Controller.process(Controller.java:78)
    at com.example.Main.main(Main.java:15)
```

1. Click "Analyze with AI"
2. **Expected:**
   - Status message appears: "Parsing stack trace..."
   - "Parsed Stack Trace" section appears showing "(4 frames)"
   - Expand the section to see parsed frames
   - Each frame shows function name, file, and line number
   - Success message appears after parsing

### Test 5: Stack Trace Parsing - Python

Paste this Python stack trace:
```
Traceback (most recent call last):
  File "app.py", line 15, in main
  File "service.py", line 42, in process_request
  File "database.py", line 89, in query
ValueError: Invalid query parameter
```

1. Click "Analyze with AI"
2. **Expected:**
   - Parses correctly
   - Shows 3 frames
   - Each frame displays function name and location

### Test 6: Stack Trace Parsing - JavaScript

Paste this JavaScript stack trace:
```
Error: Cannot read property 'name' of undefined
    at UserService.getName (user-service.js:45:12)
    at AuthController.login (auth-controller.js:78:23)
    at app.js:123:5
```

1. Click "Analyze with AI"
2. **Expected:**
   - Parses JavaScript format correctly
   - Shows function names with file:line:column

### Test 7: Invalid Input

1. Paste random text (not a stack trace):
```
This is just some random text
that doesn't look like a stack trace
at all
```

2. Click "Analyze with AI"
3. **Expected:**
   - Shows error: "No valid stack frames found"
   - Error message disappears after 3 seconds

### Test 8: Data Persistence

1. Enter a stack trace
2. Close the popup (click outside or press ESC)
3. Open the popup again
4. **Expected:**
   - Previous stack trace is still there
   - Character count is correct
   - Analyze button is enabled

### Test 9: Extract Button (Portal Integration Placeholder)

1. Navigate to any webpage
2. Open the extension popup
3. Click "Extract" button
4. **Expected:**
   - Status message appears
   - If page has stack trace content, it extracts
   - If not, shows "Could not extract" or "No stack trace found"
   - This is a placeholder for Day 3 portal integration

### Test 10: Keyboard Shortcuts

1. Enter a stack trace
2. Press `Ctrl + Enter` (Windows/Linux) or `Cmd + Enter` (Mac)
3. **Expected:** Triggers analysis (same as clicking Analyze button)

4. Press `Ctrl + K` or `Cmd + K`
5. **Expected:** Clears all content (same as clicking Clear button)

### Test 11: Right-Click Context Menu

1. On any webpage, select some text that looks like a stack trace
2. Right-click the selected text
3. **Expected:**
   - Context menu shows "Analyze with AI Crash Assistant"
4. Click the menu item
5. **Expected:**
   - Extension popup opens with the selected text

### Test 12: Responsive UI

1. Open the extension
2. Enter a long stack trace (20+ lines)
3. **Expected:**
   - Textarea scrolls properly
   - UI remains clean and organized
   - Parsed section has its own scrollbar if content is long

### Test 13: Multiple Sessions

1. Open extension, enter text, close
2. Open extension again in different tab
3. **Expected:**
   - Same data appears (persistence works)
4. Clear the data
5. Open in another tab
6. **Expected:**
   - Data is cleared everywhere

## 📊 Validation Checklist

- [ ] Extension loads without errors in `chrome://extensions/`
- [ ] Popup opens and displays correctly
- [ ] All buttons are functional
- [ ] Character counter updates in real-time
- [ ] Java stack traces parse correctly
- [ ] Python stack traces parse correctly
- [ ] JavaScript stack traces parse correctly
- [ ] Invalid input shows appropriate error
- [ ] Data persists across popup open/close
- [ ] Clear button works completely
- [ ] Keyboard shortcuts work
- [ ] Context menu appears on text selection
- [ ] UI is responsive and scrollable
- [ ] No console errors (check DevTools)

## 🐛 Troubleshooting

### Issue: Extension won't load
- Check if all files are in the correct location
- Verify manifest.json has no syntax errors
- Try removing icon references if icons aren't created

### Issue: Icons showing as placeholder
- Either generate icons using `create-icons.html`
- Or temporarily remove icon references from manifest.json

### Issue: Popup doesn't open
- Check for JavaScript errors in popup DevTools
  - Right-click extension icon → "Inspect popup"
- Verify all files (popup.js, popup.css) are present

### Issue: Extract button not working
- This is expected - full portal integration comes in Day 3
- Currently shows a status message as placeholder

### Issue: Stack trace not parsing
- Verify the format matches common patterns
- Check console for errors
- Try the test examples provided above

## 🎯 Day 1 Completion Status

✅ **Completed:**
- Chrome Extension structure (Manifest V3)
- Popup UI with modern design
- Stack trace input textarea
- Character counter
- Parse functionality for multiple languages
- Data persistence
- Basic error handling
- Keyboard shortcuts
- Context menu integration

🔄 **Placeholders for Future Days:**
- AI/Copilot integration (Day 2)
- Actual portal extraction logic (Day 3)
- Repository context enrichment (Day 3)
- Intelligent analysis results (Day 4)

## 📝 Notes

- Extension uses Chrome's local storage for persistence
- All sensitive operations (AI calls) will be added in Day 2
- Content script is prepared for portal integration
- Background worker ready for async operations

## 🔗 Next Steps (Day 2)

Tomorrow we'll integrate with Copilot/AI:
- Set up API authentication
- Create prompt templates
- Implement AI analysis function
- Display AI-generated suggestions
- Add interactive follow-up questions

---

**Status:** Day 1 Complete ✅  
**Date:** March 2, 2026  
**Next Review:** Day 2 Morning Standup
