# AI-Powered Crash Analysis Browser Extension - LabWeek MVP

**Project Timeline:** 1 Week (March 2-8, 2026)  
**Goal:** Demonstrate a working MVP for LabWeek presentation

---

## Problem Statement

When a production crash occurs, the primary artifact is often a minidump and its derived stack trace. While the stack trace helps identify the failing thread and the sequence of calls, it frequently does not provide enough actionable guidance to determine quickly:

- Which specific function/code path is the most likely root cause  
- What recent code changes or patterns in the repository might be connected to the crash?  
- Where to start investigating when symbols are partial, stacks are noisy, or failures are caused by memory corruption earlier in execution

Engineers spend significant time manually correlating stack frames with the codebase, searching for suspicious logic (null dereferences, lifetime issues, buffer overruns, race conditions), and forming hypotheses with limited context.

---

## Solution

Create a Chrome browser extension that takes a minidump-derived stack trace and uses repository context to generate prioritized, code-referenced investigation suggestions using AI (Copilot) — highlighting the most likely candidate functions and the reasoning behind those recommendations.

---

## MVP Scope: What We're Building in 1 Week

### Core Features
1. ✅ Capture stack trace from portal (or paste manually)
2. ✅ Send stack trace to Copilot/AI for analysis
3. ✅ Display intelligent suggestions with reasoning
4. ✅ Interactive follow-up questions
5. ✅ Working demo for presentation

---

## Daily Task Breakdown

### **Day 1 (Monday) - Foundation & Setup**
**Goal:** Working Chrome extension skeleton + stack trace extraction

**Tasks (6-8 hours):**
- [ ] Create Chrome extension project (Manifest V3)
- [ ] Build basic popup UI with textarea for stack trace input
- [ ] Create simple content script to detect stack trace portal page
- [ ] Add "Extract Stack Trace" button that copies stack trace to extension
- [ ] Parse stack trace into structured format (function names, files, line numbers)
- [ ] Display parsed data in extension UI

**Output:** Extension that can capture/paste stack traces and parse them

---

### **Day 2 (Tuesday) - AI/Copilot Integration**
**Goal:** Connect to Copilot and get first AI response

**Tasks (6-8 hours):**
- [ ] Set up authentication with organization's Copilot (API key/OAuth)
- [ ] Create basic prompt template for crash analysis
- [ ] Implement API call to Copilot with stack trace
- [ ] Handle response and display in extension
- [ ] Add loading states and basic error handling
- [ ] Test with 2-3 sample stack traces

**Output:** Extension that sends stack traces to AI and shows responses

---

### **Day 3 (Wednesday) - Context Enrichment**
**Goal:** Add basic repository context

**Tasks (6-8 hours):**

**Option A - If repo API access is ready:**
- [ ] Integrate with GitHub/repo API (read-only)
- [ ] Fetch file contents for top 3-5 stack frames
- [ ] Extract code snippets around crash locations
- [ ] Include in AI prompt for better analysis

**Option B - If repo access is blocked (faster):**
- [ ] Create mock repository data structure
- [ ] Manually add 2-3 sample files with "problematic" code
- [ ] Simulate context enrichment for demo purposes
- [ ] Focus on prompt engineering with available data

**Output:** AI gets code context and provides better suggestions

---

### **Day 4 (Thursday) - Intelligent Suggestions & UI Polish**
**Goal:** Make output actionable and presentable

**Tasks (6-8 hours):**
- [ ] Improve prompt to generate structured output:
  - Top 3 suspicious functions (ranked)
  - Specific issue patterns (null deref, race conditions, etc.)
  - Reasoning for each suggestion
  - Recommended next steps
- [ ] Format AI response with proper sections and highlighting
- [ ] Add "Ask follow-up question" input box for interactive chat
- [ ] Polish UI: colors, icons, better layout
- [ ] Add copy-to-clipboard for suggestions

**Output:** Professional-looking extension with actionable suggestions

---

### **Day 5 (Friday) - Demo Prep & Testing**
**Goal:** Ensure reliable demo experience

**Tasks (6-8 hours):**
- [ ] Prepare 3 demo scenarios:
  1. Simple null pointer crash (best case)
  2. Memory corruption with complex stack (medium)
  3. Race condition or threading issue (challenging)
- [ ] Test extension with all demo scenarios
- [ ] Create fallback/mock responses in case API fails during demo
- [ ] Record demo video as backup
- [ ] Prepare presentation slides:
  - Problem statement
  - Solution overview
  - Live demo
  - Architecture diagram
  - Future phases
- [ ] Write demo script with talking points
- [ ] Practice demo run-through (15-20 min presentation)

**Output:** Polished demo ready for labweek presentation

---

## Feature Scope

### ✅ Must Have (In Scope for MVP)
- Chrome extension that integrates with stack trace portal
- Manual paste option (fallback)
- Stack trace parsing
- AI/Copilot integration with conversation
- Structured analysis output with prioritized suggestions
- Basic UI (popup or side panel)
- 3 working demo scenarios

### ✅ Should Have (If Time Permits)
- Repository code fetching (GitHub API)
- Code snippet display in suggestions
- Interactive follow-up questions
- Simple caching to avoid repeated API calls

### ❌ Out of Scope for MVP
- Complex repository analysis (blame, history, commits)
- Multiple repository support
- Session management/history
- Export functionality
- Advanced pattern detection algorithms
- Performance optimization
- Comprehensive error handling
- Authentication system (use simple API key)
- Publishing to Chrome store

---

## Tech Stack

```
Frontend:
- HTML/CSS/JavaScript (vanilla or lightweight framework)
- Chrome Extension APIs (Manifest V3)

AI Integration:
- GitHub Copilot API / Azure OpenAI / ChatGPT API
- REST API calls (fetch/axios)

Optional (if time):
- GitHub REST API for code fetching
- Simple local storage for caching
```

---

## Risk Mitigation Strategies

| Risk | Mitigation |
|------|------------|
| Can't access organization's Copilot | Use OpenAI API with personal key for demo |
| Portal integration too complex | Focus on manual paste workflow |
| Repository API issues | Use mock data for demo, explain it's WIP |
| API rate limits during demo | Pre-cache responses or use mock data |
| Extension bugs during demo | Have screen recording ready as backup |

---

## Demo Script Outline (15-20 min)

### 1. Problem Introduction (2 min)
- Show real stack trace
- Explain the pain point
- Current manual investigation process

### 2. Solution Overview (2 min)
- Architecture slide showing extension + AI
- Key capabilities

### 3. Live Demo (8-10 min)
- Open stack trace portal
- Click extension icon
- Extract stack trace
- Show AI analysis with suggestions
- Ask follow-up question
- Highlight top suspicious function

### 4. Technical Deep-Dive (3 min)
- Show prompt engineering approach
- Explain context enrichment strategy
- Discuss AI reasoning process

### 5. Future Roadmap (2 min)
- Show full phased plan
- Explain how this becomes production-ready
- Timeline for full implementation

### 6. Q&A (3-5 min)
- Answer questions
- Discuss potential applications

---

## Success Criteria for MVP

- ✅ Extension installs and runs without errors
- ✅ Can capture stack trace from portal OR paste manually
- ✅ AI provides 3+ specific, actionable suggestions
- ✅ Suggestions include reasoning and code references
- ✅ Demo runs smoothly for 10+ minutes
- ✅ Audience understands the value proposition
- ✅ Can answer "what's next?" with confidence

---

## Immediate Action Items

### Today
1. [ ] Create project folder structure
2. [ ] Set up Chrome extension boilerplate
3. [ ] Get Copilot API access credentials
4. [ ] Identify 2-3 real stack traces for demo
5. [ ] Set up development environment

### This Week
- Follow daily breakdown above
- Daily stand-up/progress check
- Mid-week checkpoint (Wednesday EOD)
- Final testing (Thursday/Friday)

---

## Future Phases (Post-LabWeek)

Once MVP is approved, implement the full phased approach:

- **Phase 1:** Research & Architecture Design (1-2 weeks)
- **Phase 2:** Enhanced Extension & Data Extraction (2-3 weeks)
- **Phase 3:** Repository Context Integration (2-3 weeks)
- **Phase 4:** Advanced AI/Copilot Features (3-4 weeks)
- **Phase 5:** Intelligent Analysis & Ranking (2-3 weeks)
- **Phase 6:** Enhanced UX & Interactive Features (2-3 weeks)
- **Phase 7:** Testing, Optimization & Feedback (2-3 weeks)
- **Phase 8:** Deployment & Documentation (1-2 weeks)
- **Phase 9:** Iteration & Advanced Features (Ongoing)

**Total Timeline:** 16-24 weeks for production-ready system

---

## Notes & Ideas

<!-- Add your notes, ideas, and observations here as you work through the week -->

---

## Resources & Links

- Stack Trace Portal: [Add URL]
- Copilot API Documentation: [Add URL]
- Repository API: [Add URL]
- Design Mockups: [Add URL]
- Demo Scenarios: [Add folder path]

---

**Last Updated:** March 2, 2026  
**Status:** Planning Phase  
**Next Review:** End of Day 1 (Monday)
