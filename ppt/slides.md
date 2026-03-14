---
marp: true
theme: default
paginate: true
backgroundColor: #fff
backgroundImage: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
color: #fff
style: |
  section {
    font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
    font-size: 28px;
    padding: 60px;
  }
  h1 {
    font-size: 72px;
    font-weight: 700;
    margin-bottom: 20px;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
  }
  h2 {
    font-size: 48px;
    font-weight: 700;
    margin-bottom: 30px;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
  }
  h3 {
    font-size: 32px;
    font-weight: 600;
    margin-bottom: 20px;
  }
  ul, ol {
    font-size: 24px;
    line-height: 1.8;
  }
  strong {
    color: #ffed4e;
  }
  .columns {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 40px;
  }
  .center {
    text-align: center;
  }
  .large-icon {
    font-size: 80px;
    margin-bottom: 20px;
  }
---

<!-- _class: lead -->

# AI-Powered RDK Crash Analysis

## From Stack Trace to Root Cause in Seconds

<br>

**Presented by:** [Your Name]
**Team:** [Your Team Name]

**LabWeek 2026 Demo | March 15, 2026**

---

<!-- _backgroundImage: linear-gradient(135deg, #f093fb 0%, #f5576c 100%) -->

## The Problem & Its Impact

<div class="columns">

<div>

### 🔍 Manual Investigation

**Today's crash analysis requires extensive manual work:**

- ⚠️ Navigate to Stack Trace Portal
- ⚠️ Extract and analyze stack traces
- ⚠️ Search through source code repositories
- ⚠️ Correlate code with crash patterns
- ⚠️ Identify potential root causes
- ⚠️ Review logs and debug information

</div>

<div>

### ⏱️ The Impact

**This manual process creates significant challenges:**

- ⚠️ **Hours/Days** spent per crash
- ⚠️ **Multiple team members** involved
- ⚠️ **Reduced productivity** for developers
- ⚠️ **Delayed feature delivery** to customers
- ⚠️ **Increased operational costs**
- ⚠️ **Customer impact** from slow fixes

</div>

</div>

---

<!-- _backgroundImage: linear-gradient(135deg, #f093fb 0%, #f5576c 100%) -->

## The Problem - Summary

<br>

### ❌ Result: Slow response times and high costs

<br>

- Manual investigation takes **2-4 hours minimum**
- Multiple developers and triage team involved
- Delayed feature delivery and customer impact
- Significant productivity loss across teams

---

<!-- _backgroundImage: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%) -->

## The Solution: RDK Crash AI Analyzer

<div class="columns">

<div class="center">

🤖
### AI-Powered Analysis

Advanced LLM analyzes stack traces and source code to identify root causes automatically

</div>

<div class="center">

📋
### Root Cause Identification

Pinpoints suspicious functions and provides confidence levels for each hypothesis

</div>

</div>

<div class="columns">

<div class="center">

🔎
### Pattern Recognition

Identifies crash patterns: null pointers, memory corruption, race conditions, and more

</div>

<div class="center">

🛠️
### Actionable Suggestions

Provides investigation steps, debugging commands, and code-specific recommendations

</div>

</div>

---

<!-- _backgroundImage: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%) -->

## The Solution - Benefits

<br>

### ✅ **60 Seconds** from stack trace to root cause suggestion

### ✅ **90% Time Savings** in crash investigation

### ✅ **Zero Manual Code Search** – AI does it automatically

---

<!-- _backgroundImage: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%) -->

## Architecture Overview

<br>

### System Flow:

```
🌐 RDK Crash Portal  →  🧩 Chrome Extension  →  🤖 AI Analysis Engine
       ↓
📚 GitHub Source Code  →  📊 AI Root Cause Summary, Fix & Suggestions
```

<br>

**Key Components:**
- **Portal:** Stack trace repository
- **Extension:** User interface & data extraction
- **AI Engine:** LLM processing (Gemini/OpenAI/Claude)
- **GitHub:** Context enrichment & code fetching
- **Output:** Root cause, patterns, investigation steps, debugging advice

---

<!-- _backgroundImage: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%) -->

## Architecture - Technical Details

<br>

### Key Features:
- Multi-provider AI support (Gemini / GPT-5 / Claude)
- GitHub integration for source code context
- JSON upload for batch processing
- Interactive Q&A for follow-up questions
- Full-screen demo mode for presentations

<br>

### Tech Stack:
| Frontend | AI Engine | Integration |
|----------|-----------|-------------|
| Chrome Extension (Manifest V3) | Gemini 2.5 / GPT-5-2 / Claude 4.6 | GitHub REST API |

---

<!-- _backgroundImage: linear-gradient(135deg, #fa709a 0%, #fee140 100%) -->

## Live Demo / Recorded Video

<br>

<div class="center">

### 🎬 Demo Video or Live Demonstration

<br>

**[Insert video link or perform live demo here]**

<br>

### Demo Workflow:

**1️⃣ Upload/Paste Stack Trace** → **2️⃣ AI Analyzes Code** → **3️⃣ View Root Cause** → **4️⃣ Get Fix Suggestions**

</div>

---

<!-- _backgroundImage: linear-gradient(135deg, #fa709a 0%, #fee140 100%) -->

## Demo Highlights

<br>

### What the Demo Shows:

- ✅ **Upload stack trace** from JSON file or manual paste
- ✅ **AI analysis** completes in 10-15 seconds
- ✅ **Root cause identification** with confidence levels
- ✅ **Crash pattern recognition** (null pointer, memory corruption, etc.)
- ✅ **Investigation steps** with specific commands
- ✅ **Repository debugging** suggestions with code references
- ✅ **Interactive Q&A** for follow-up questions
- ✅ **Copy to clipboard** for easy sharing

---

<!-- _backgroundImage: linear-gradient(135deg, #667eea 0%, #764ba2 100%) -->
<!-- _class: lead -->

# Thank You!

## Questions & Discussion

<br>

### 🚀 Ready for Production Deployment

---

<!-- _backgroundImage: linear-gradient(135deg, #667eea 0%, #764ba2 100%) -->

## Contact Information

<br>

<div class="columns">

<div class="center">

### 📧 Email

**[your.email@company.com]**

</div>

<div class="center">

### 💼 GitHub

**[github.com/yourproject]**

</div>

</div>

---

<!-- _backgroundImage: linear-gradient(135deg, #667eea 0%, #764ba2 100%) -->

## 🎯 Next Steps

<br>

### Planned Enhancements:

- 📌 **Integrate to Stack Trace Portal**
- 📌 **Add crashed component log to AI prompt for better suggestions**
- 📌 **Implement caching for AI analysis data**

<br>

### Timeline:
- **Phase 1:** Portal integration (Sprint 1)
- **Phase 2:** Enhanced context with logs (Sprint 2)
- **Phase 3:** Caching layer for performance (Sprint 3)

---

<!-- _backgroundImage: linear-gradient(135deg, #667eea 0%, #764ba2 100%) -->
<!-- _class: lead -->

# Questions?

<br>

**Let's discuss how this can transform your crash analysis workflow!**

<br>

### 🚀 Ready to deploy and make an impact!
