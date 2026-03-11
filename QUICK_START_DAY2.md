# 🚀 QUICK START - Day 2 AI Integration

## ⚡ 5-Minute Setup & Test

### **Step 1: Get Google AI Studio API Key** (2 minutes)

1. Open: https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Click **"Create API Key"**
4. Copy the key (starts with `AIza...`)

### **Step 2: Reload Extension** (30 seconds)

1. Open Chrome → `chrome://extensions/`
2. Find "AI Crash Analysis Assistant"
3. Click **🔄 Reload**
4. Verify: No errors

### **Step 3: Configure API Key** (1 minute)

1. Click extension icon
2. Click **Settings** (bottom right)
3. Paste your API key
4. Click **Save Settings**
5. Wait for green ✅ success message

### **Step 4: Test AI Analysis** (2 minutes)

1. Click extension icon
2. Paste this test stack trace:

```
Exception in thread "main" java.lang.NullPointerException
    at com.example.UserService.getUserName(UserService.java:45)
    at com.example.AuthController.authenticate(AuthController.java:78)
    at com.example.LoginHandler.processLogin(LoginHandler.java:123)
```

3. Click **"Analyze with AI"**
4. Wait 10-15 seconds
5. **Expected:** Detailed AI analysis with root cause, suspicious functions, and debugging steps

### **Step 5: Ask Follow-up Question** (1 minute)

1. After AI analysis appears, scroll down
2. Type: **"What could cause this null pointer?"**
3. Press **Enter**
4. **Expected:** AI answers your specific question

---

## ✅ Success Checklist

After completing steps above, verify:
- [ ] Extension loads in Chrome
- [ ] Settings page opens and saves API key
- [ ] AI analysis generates results (takes 10-15 seconds)
- [ ] Results include root cause, suspicious functions, steps
- [ ] Follow-up questions work
- [ ] No errors in Chrome console

---

## 🐛 Troubleshooting

**Extension won't load:**
- Reload in `chrome://extensions/`
- Check for errors in extension details

**API key validation fails:**
- Verify key starts with "AIza"
- Check internet connection
- Try creating new key

**Analysis takes too long:**
- Normal: 10-15 seconds for Gemini 1.5 Flash
- Slower: 15-25 seconds for Gemini 1.5 Pro
- If >30 seconds: Check network connection

**"API key not configured" warning:**
- Go to Settings and enter API key
- Make sure you clicked "Save Settings"
- Reload extension after saving

---

## 📚 Full Documentation

- **Complete Testing Guide:** [DAY2_TESTING_GUIDE.md](DAY2_TESTING_GUIDE.md)
- **Implementation Summary:** [DAY2_SUMMARY.md](DAY2_SUMMARY.md)
- **Extension README:** [extension/README.md](extension/README.md)

---

## 🎯 What You Can Do Now

### **Analyze Any Crash:**
- Java, Python, JavaScript, C++, C#
- Get AI-powered root cause analysis
- Receive debugging suggestions
- Ask follow-up questions

### **Interactive Debugging:**
- Ask "Why did this crash?"
- Ask "How can I fix this?"
- Ask "What should I check first?"
- Get context-aware answers

### **Professional Demo:**
- Show real AI analysis
- Demonstrate follow-up questions
- Explain debugging suggestions
- Impress your team! 🎉

---

## 🔥 Try These Sample Stack Traces

### **Python KeyError:**
```
KeyError: 'user_id'
  File "app.py", line 25, in main
  File "processor.py", line 67, in process_data
  File "validator.py", line 42, in validate_input
```

### **JavaScript TypeError:**
```
TypeError: Cannot read property 'id' of undefined
    at UserComponent.render (UserComponent.js:156:23)
    at ReactComponent.performUpdate (react-dom.js:2345:12)
```

### **C++ Segfault:**
```
Segmentation fault (core dumped)
#2  0x0000000000401234 in DataProcessor::processBuffer() at processor.cpp:145
#3  0x0000000000401567 in DataHandler::handleData() at handler.cpp:89
```

---

**Ready to test?** Follow Step 1 above and get started! 🚀

**Questions?** Check [DAY2_TESTING_GUIDE.md](DAY2_TESTING_GUIDE.md) for detailed guide.
