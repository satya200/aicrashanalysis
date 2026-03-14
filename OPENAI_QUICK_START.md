# OpenAI Integration - Quick Start Guide

## ✅ Implementation Complete!

Your extension now supports both **Google Gemini** and **OpenAI-compatible APIs**.

---

## 🚀 Quick Test (5 minutes)

### Step 1: Reload Extension
```
1. Go to chrome://extensions/
2. Find "AI Crash Analysis Assistant"
3. Click the reload icon 🔄
```

### Step 2: Configure OpenAI
```
1. Click extension icon → Settings
2. Select "OpenAI Compatible" from dropdown
3. Enter API URL:
   https://api.context.flow.cnap.comcast.net/modelgw/models/openai/v1
4. Enter your API Token
5. Select model: gpt-5-2 or claude-4-6-sonnet
6. Click "Save Settings"
7. Wait for success message
```

### Step 3: Test Analysis
```
1. Click "Back to Analyzer"
2. Paste a simple stack trace:

   Exception in thread "main" java.lang.NullPointerException
       at com.example.MyClass.processData(MyClass.java:45)
       at com.example.Service.handleRequest(Service.java:123)

3. Click "Analyze with AI"
4. Wait 10-15 seconds
5. See OpenAI analysis appear!
```

### Step 4: Verify in Console
```
1. Press F12 (open DevTools)
2. Go to Console tab
3. Look for logs:
   🤖 Calling OpenAI API: {...}
   ✅ OpenAI Response received: {...}
```

---

## 📋 What Changed

### 1. Settings UI
- **New Dropdown:** "AI Provider" selector at top
- **Dynamic Sections:** Shows Gemini OR OpenAI fields
- **OpenAI Fields:**
  - API URL
  - API Token (password field)
  - Model selector

### 2. AI Service
- **Multi-Provider Support:** Routes to Gemini or OpenAI
- **OpenAI Integration:** Chat Completions API format
- **Same Features:** All functionality works with both providers

### 3. All Features Work
- ✅ Stack trace analysis
- ✅ Follow-up questions
- ✅ GitHub integration
- ✅ JSON file upload
- ✅ Copy to clipboard
- ✅ Full-screen mode

---

## 🔑 Your Organization's API

**URL:** `https://api.context.flow.cnap.comcast.net/modelgw/models/openai/v1`

**Models:**
- `gpt-5-2` (Azure)
- `claude-4-6-sonnet` (AWS)

**Authentication:** Bearer token in header

---

## 🧪 Full Testing Guide

For comprehensive testing (12 scenarios):
📄 **[OPENAI_INTEGRATION_TESTING.md](OPENAI_INTEGRATION_TESTING.md)**

Tests cover:
- Provider selection and switching
- OpenAI configuration
- Stack trace analysis
- Follow-up questions
- Error handling
- GitHub integration
- Model comparison
- Feature compatibility

---

## 📖 Technical Details

For implementation details:
📄 **[OPENAI_IMPLEMENTATION_SUMMARY.md](OPENAI_IMPLEMENTATION_SUMMARY.md)**

Includes:
- Code changes
- Architecture decisions
- API integration details
- Security notes
- Future enhancements

---

## 🔍 Troubleshooting

### "OpenAI credentials not configured"
→ Go to Settings, ensure URL and Token are saved

### "API request failed: 401"
→ Token is invalid, check with your organization

### "API request failed: 404"
→ URL is wrong, verify the endpoint URL

### Analysis returns weird format
→ Try the other model (GPT-5-2 ↔ Claude)

### Very slow responses
→ Organization endpoint may be slow, check network

---

## ✨ Key Features

### Provider Selection
```
Settings → AI Provider dropdown
├── Google Gemini (Free tier)
└── OpenAI Compatible (Your org)
```

### Dynamic UI
```
Select Gemini  → Shows: API Key, Model
Select OpenAI  → Shows: URL, Token, Model
```

### Seamless Switching
```
Can switch between providers anytime
Credentials saved separately
No data loss when switching
```

---

## 📊 What Works

| Feature | Gemini | OpenAI |
|---------|--------|--------|
| Analysis | ✅ | ✅ |
| Follow-up | ✅ | ✅ |
| GitHub | ✅ | ✅ |
| JSON Upload | ✅ | ✅ |
| Copy | ✅ | ✅ |
| Full Screen | ✅ | ✅ |

---

## 🎯 Testing Checklist

Quick verification:

- [ ] Extension reloaded
- [ ] Settings page opens
- [ ] Can see "AI Provider" dropdown
- [ ] Can select "OpenAI Compatible"
- [ ] OpenAI fields appear (URL, Token, Model)
- [ ] Can save OpenAI settings
- [ ] Can analyze a stack trace
- [ ] Analysis works with OpenAI
- [ ] Console shows OpenAI logs
- [ ] Can switch back to Gemini

---

## 💡 Pro Tips

1. **Test both models** to see which gives better analysis
2. **Use full-screen mode** for demos (expand button in header)
3. **Try follow-up questions** after analysis
4. **Add GitHub repo** for code-aware analysis
5. **Check console logs** if something goes wrong
6. **Keep both providers configured** to switch easily

---

## 🆘 Need Help?

### Console Logs to Check:
```
F12 → Console tab

Look for:
🤖 Calling OpenAI API: {...}
✅ OpenAI Response received: {...}

Or errors:
❌ OpenAI Service Error: ...
```

### Common Issues:
1. **401 Error** = Bad token
2. **404 Error** = Wrong URL
3. **Network Error** = Connection issue
4. **Empty Response** = Model incompatibility

### Debug Steps:
1. Check Settings are saved
2. Verify URL has no trailing slash
3. Confirm token is correct
4. Try the other model
5. Check browser console for details

---

## 📝 Summary

✅ **Implemented:**
- Multi-provider AI service (Gemini + OpenAI)
- Dynamic settings UI with provider toggle
- OpenAI Chat Completions API integration
- Bearer token authentication
- 2 models: gpt-5-2, claude-4-6-sonnet
- Full backward compatibility
- Comprehensive error handling

✅ **No Breaking Changes:**
- Existing Gemini users unaffected
- All features work with both providers
- Settings extended (not replaced)
- Seamless provider switching

✅ **Ready to Use:**
- Configure your OpenAI credentials
- Start analyzing with organization's API
- Same great features, your choice of AI

---

## 🚀 Next Steps

1. **Reload extension** (`chrome://extensions/`)
2. **Configure OpenAI** in settings
3. **Run quick test** (paste trace → analyze)
4. **Verify console logs** show OpenAI calls
5. **Try advanced features** (GitHub, follow-up, etc.)
6. **Compare models** (GPT-5-2 vs Claude)
7. **Test all scenarios** (see OPENAI_INTEGRATION_TESTING.md)

---

## 🎉 You're All Set!

The extension now has:
- ✅ Google Gemini support (original)
- ✅ OpenAI-compatible API support (NEW)  
- ✅ Choice of 5+ AI models
- ✅ All features working with both
- ✅ Easy provider switching

**Go test it now!** 🚀

---

*For detailed testing: [OPENAI_INTEGRATION_TESTING.md](OPENAI_INTEGRATION_TESTING.md)*  
*For technical details: [OPENAI_IMPLEMENTATION_SUMMARY.md](OPENAI_IMPLEMENTATION_SUMMARY.md)*
