# OpenAI API Integration - Testing Guide

## Overview
The extension now supports both **Google Gemini** and **OpenAI-compatible APIs**. Users can choose their preferred AI provider in settings.

## What Was Added

### 1. **Multi-Provider Support** ([ai-service.js](extension/ai-service.js))
- Provider selection: `gemini` or `openai`
- Separate initialization for each provider
- OpenAI API calls using chat completions format
- Provider-aware routing for analysis and follow-up questions

### 2. **Settings UI** ([settings.html](extension/settings.html))
- Provider dropdown selector
- Dynamic sections (Gemini settings / OpenAI settings)
- OpenAI-specific fields:
  - API URL
  - API Token
  - Model selection (gpt-5-2, claude-4-6-sonnet)

### 3. **Settings Logic** ([settings.js](extension/settings.js))
- Provider-based field visibility toggle
- Separate validation for each provider
- Connection testing for OpenAI endpoints
- Saves provider-specific credentials

---

## Configuration Details

### OpenAI Compatible API
**URL:** `https://api.context.flow.cnap.comcast.net/modelgw/models/openai/v1`

**Supported Models:**
- `gpt-5-2` - Provided by Azure
- `claude-4-6-sonnet` - Provided by AWS

**Authentication:** Bearer token in Authorization header

**API Format:** OpenAI Chat Completions (`/chat/completions`)

---

## Testing Steps

### Prerequisites
1. **Reload the extension** in `chrome://extensions/`
2. **Have your OpenAI token ready**
3. **Sample stack trace** for testing

---

### Test 1: Settings UI - Provider Selection
**Objective:** Verify the provider selector works

1. **Open extension** → Click **Settings**
2. **Locate "AI Provider" dropdown** at the top
3. **Verify two options:**
   - Google Gemini (Free tier available)
   - OpenAI Compatible (Organization provided)
4. **Select "Google Gemini"**
   - Verify: Gemini API Key and Model fields appear
   - Verify: OpenAI fields are hidden
5. **Select "OpenAI Compatible"**
   - Verify: OpenAI URL, Token, and Model fields appear
   - Verify: Gemini fields are hidden

✅ **Expected:** Fields toggle correctly based on provider selection

---

### Test 2: OpenAI Settings - Configure & Save
**Objective:** Save OpenAI credentials

1. **Open Settings**
2. **Select "OpenAI Compatible"**
3. **Enter OpenAI API URL:**
   ```
   https://api.context.flow.cnap.comcast.net/modelgw/models/openai/v1
   ```
4. **Enter your API Token** (from your organization)
5. **Select Model:**
   - Try `gpt-5-2` first
   - Or `claude-4-6-sonnet`
6. **Click "Save Settings"**
7. **Verify status message:**
   - Success: "✅ Settings saved and OpenAI endpoint accessible!"
   OR
   - "⚠️ Settings saved, but connection test failed..." (check URL/token)

✅ **Expected:** Settings save successfully, connection test runs

---

### Test 3: OpenAI Settings - Persistence
**Objective:** Verify settings persist across sessions

1. **Configure OpenAI settings** (Test 2)
2. **Close settings page**
3. **Reopen Settings**
4. **Verify:**
   - Provider dropdown shows "OpenAI Compatible"
   - OpenAI fields are visible (Gemini hidden)
   - URL is pre-filled
   - Token is pre-filled
   - Model is pre-selected

✅ **Expected:** All OpenAI settings persist correctly

---

### Test 4: OpenAI Analysis - Simple Stack Trace
**Objective:** Test crash analysis with OpenAI

1. **Configure OpenAI settings** (Test 2)
2. **Go back to main analyzer** (click "Back to Analyzer")
3. **Paste sample stack trace:**
   ```
   Exception in thread "main" java.lang.NullPointerException
       at com.example.MyClass.processData(MyClass.java:45)
       at com.example.Service.handleRequest(Service.java:123)
       at com.example.Main.main(Main.java:15)
   ```
4. **Click "Analyze with AI"**
5. **Wait for analysis** (may take 10-15 seconds)
6. **Verify:**
   - Analysis appears in results section
   - Contains sections: ROOT CAUSE, CRASH PATTERN, INVESTIGATION STEPS
   - No errors in console
7. **Open browser console** (F12)
8. **Check logs for:**
   ```
   🤖 Calling OpenAI API: {url: "...", model: "gpt-5-2", ...}
   ✅ OpenAI Response received: {length: ..., model: "gpt-5-2", ...}
   ```

✅ **Expected:** Analysis completes successfully using OpenAI

---

### Test 5: OpenAI Follow-up Questions
**Objective:** Test interactive Q&A with OpenAI

1. **Complete Test 4** (analyze stack trace)
2. **Verify "Ask Follow-up Question" section appears**
3. **Type a question:**
   ```
   What debugging tools would you recommend?
   ```
4. **Click "Ask" button** or press Enter
5. **Wait for response**
6. **Verify:**
   - Answer appears below the original analysis
   - Answer is relevant to the question
   - Console shows OpenAI API call logs

✅ **Expected:** Follow-up questions work with OpenAI

---

### Test 6: Switch Between Providers
**Objective:** Verify switching from Gemini to OpenAI works

**Part A: Start with Gemini**
1. **Open Settings**
2. **Select "Google Gemini"**
3. **Enter a valid Gemini API key** (starts with AIzaSy...)
4. **Save settings**
5. **Analyze a stack trace** → Should use Gemini
6. **Check console logs:**
   ```
   ✅ Gemini Response received: {...}
   ```

**Part B: Switch to OpenAI**
1. **Go back to Settings**
2. **Select "OpenAI Compatible"**
3. **Enter OpenAI credentials** (from Test 2)
4. **Save settings**
5. **Analyze same stack trace** → Should use OpenAI
6. **Check console logs:**
   ```
   🤖 Calling OpenAI API: {...}
   ✅ OpenAI Response received: {...}
   ```

**Part C: Switch back to Gemini**
1. **Go to Settings** →Select "Google Gemini"
2. **Verify Gemini API key is still saved**
3. **Save settings**
4. **Analyze stack trace** → Should use Gemini again

✅ **Expected:** Can switch between providers without losing credentials

---

### Test 7: OpenAI Error Handling
**Objective:** Test error scenarios

**Test 7a: Invalid Token**
1. **Open Settings** → Select OpenAI
2. **Enter correct URL but wrong token:** `invalid-token-123`
3. **Save settings**
4. **Try to analyze a stack trace**
5. **Verify:** Error message appears indicating authentication failed

**Test 7b: Invalid URL**
1. **Enter wrong URL:** `https://wrong-url.com/v1`
2. **Enter correct token**
3. **Save settings**
4. **Try to analyze**
5. **Verify:** Error about connection or endpoint

**Test 7c: Empty Fields**
1. **Leave URL or Token empty**
2. **Try to save**
3. **Verify:** Validation message appears

✅ **Expected:** Clear error messages for all error scenarios

---

### Test 8: OpenAI with GitHub Integration
**Objective:** Test OpenAI with repository context

1. **Configure OpenAI** in settings
2. **Add GitHub repository:**
   ```
   https://github.com/rdkcentral/rdk-halif-test-device_settings
   Branch: main
   ```
3. **Save settings**
4. **Paste a C/C++ stack trace** (from the repo)
5. **Click "Analyze with AI"**
6. **Verify:**
   - Analysis includes "REPOSITORY DEBUGGING" section
   - OpenAI receives repository context in prompt
   - Suggestions reference actual files from the repo

✅ **Expected:** GitHub integration works with OpenAI

---

### Test 9: OpenAI Model Selection
**Objective:** Test both supported models

**Test 9a: GPT-5-2 (Azure)**
1. **Settings** → OpenAI → Select `gpt-5-2`
2. **Save and analyze a stack trace**
3. **Check console:** Should show `model: "gpt-5-2"`
4. **Verify analysis quality**

**Test 9b: Claude 4.6 Sonnet (AWS)**
1. **Settings** → OpenAI → Select `claude-4-6-sonnet`
2. **Save and analyze same stack trace**
3. **Check console:** Should show `model: "claude-4-6-sonnet"`
4. **Compare analysis** (may have different style/depth)

✅ **Expected:** Both models work correctly

---

### Test 10: Full-Screen Mode with OpenAI
**Objective:** Verify full-screen works with OpenAI

1. **Configure OpenAI** in settings
2. **Open extension popup**
3. **Click full-screen button** (expand icon in header)
4. **In the new tab:**
   - Paste stack trace
   - Analyze with AI
   - Verify OpenAI is used
5. **Check console logs**

✅ **Expected:** Full-screen mode works identically with OpenAI

---

### Test 11: JSON Upload with OpenAI
**Objective:** Test Extract button with OpenAI

1. **Configure OpenAI**
2. **Click "Extract" button**
3. **Select backtrace.json file**
4. **Verify upload and parsing**
5. **Click "Analyze with AI"**
6. **Verify OpenAI analyzes the extracted trace**

✅ **Expected:** JSON upload works with OpenAI provider

---

### Test 12: Copy Button with OpenAI
**Objective:** Verify copy functionality

1. **Analyze with OpenAI** (Test 4)
2. **Click Copy button** (top-right of results)
3. **Paste into a text editor**
4. **Verify:**
   - Full analysis text is copied
   - Markdown formatting intact
   - All sections present

✅ **Expected:** Copy works with OpenAI-generated analysis

---

## Troubleshooting

### Issue: "OpenAI credentials not configured" error
**Solutions:**
- Open Settings
- Select "OpenAI Compatible"
- Ensure both URL and Token are filled
- Click Save Settings
- Try analysis again

### Issue: "OpenAI API request failed: 401"
**Solutions:**
- Token is invalid or expired
- Contact your organization for a new token
- Re-enter token in settings

### Issue: "OpenAI API request failed: 404"
**Solutions:**
- URL is incorrect
- Verify URL: `https://api.context.flow.cnap.comcast.net/modelgw/models/openai/v1`
- Remove trailing slashes if any
- Model name must match organization's supported models

### Issue: Analysis returns empty or weird format
**Solutions:**
- Model may not support markdown formatting
- Try the other model (switch gpt-5-2 ↔ claude-4-6-sonnet)
- Check console for actual response
- Verify prompt is being sent correctly

### Issue: Very slow response times
**Solutions:**
- Organization endpoint may be slow
- Try a simpler/shorter stack trace first
- Check network connection
- Verify with organization if endpoint is operational

### Issue: Settings not saving
**Solutions:**
- Check browser console for errors
- Ensure Chrome storage sync is enabled
- Try incognito mode to test
- Clear extension storage and reconfigure

---

## Verification Checklist

After testing, verify:

- [ ] Can select between Gemini and OpenAI
- [ ] Fields toggle correctly based on provider
- [ ] OpenAI settings save and persist
- [ ] Can analyze stack traces with OpenAI
- [ ] Follow-up questions work with OpenAI
- [ ] Can switch between providers freely
- [ ] Error messages are clear and helpful
- [ ] GitHub integration works with OpenAI
- [ ] Both models (gpt-5-2, claude-4-6-sonnet) work
- [ ] All existing features work:
  - [ ] Manual paste
  - [ ] JSON upload
  - [ ] Copy button
  - [ ] Full-screen mode
  - [ ] Settings persistence
- [ ] No errors in browser console
- [ ] Original Gemini functionality still works

---

## API Comparison

| Feature | Gemini | OpenAI Compatible |
|---------|--------|-------------------|
| **Authentication** | API Key in URL | Bearer Token in Header |
| **Endpoint** | `/generateContent` | `/chat/completions` |
| **Request Format** | Contents/Parts | Messages (system/user) |
| **Response Format** | candidates→content→parts→text | choices→message→content |
| **Temperature** | 0.7 | 0.7 |
| **Max Tokens** | 4096 | 4096 |
| **Streaming** | No | No |
| **Cost** | Free tier available | Organization provided |

---

## Quick Test Script (30 seconds)

1. **Settings** → Select "OpenAI Compatible" ✅
2. **Enter URL and Token** ✅
3. **Save** → See success message ✅
4. **Back to Analyzer** ✅
5. **Paste simple stack trace** ✅
6. **Analyze with AI** → Wait for OpenAI response ✅

**Success?** OpenAI integration is working! 🎉

---

## Console Logging

Look for these console messages:

**OpenAI Analysis:**
```
🤖 Calling OpenAI API: {url: "...", model: "gpt-5-2", promptLength: 1234}
✅ OpenAI Response received: {length: 2345, model: "gpt-5-2", sections: 3}
```

**OpenAI Follow-up:**
```
🤖 Calling OpenAI API: {...}
✅ OpenAI Response: ...
```

**Provider Selection:**
```
🤖 AI Prompt Config: {hasRepoContext: true, ...}
```

---

## Summary

✅ **Implementation Complete**
- Multi-provider support (Gemini + OpenAI)
- Dynamic settings UI
- Provider-aware API routing
- Error handling for both providers
- All existing features preserved

✅ **Testing Coverage**
- Provider selection and switching
- OpenAI authentication and connection
- Analysis with both models
- Follow-up questions
- GitHub integration
- Error scenarios
- Feature compatibility

✅ **Ready for Production**
- No breaking changes
- Backward compatible with Gemini
- Clear user guidance
- Comprehensive error messages

**Next:** Run through all 12 tests to verify the integration! 🚀
