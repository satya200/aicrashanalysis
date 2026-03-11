// AI Service - Google Gemini API Integration
// This module handles all AI-related operations

class AIService {
  constructor() {
    this.apiKey = null;
    this.model = 'gemini-2.5-flash';
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';
  }

  // Initialize with API key from storage
  async initialize() {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get(['geminiApiKey', 'geminiModel'], (result) => {
        if (result.geminiApiKey) {
          this.apiKey = result.geminiApiKey;
          this.model = result.geminiModel || 'gemini-2.5-flash';
          resolve(true);
        } else {
          reject(new Error('API key not configured'));
        }
      });
    });
  }

  // Check if API key is configured
  async isConfigured() {
    try {
      await this.initialize();
      return true;
    } catch {
      return false;
    }
  }

  // Generate crash analysis prompt
  generateAnalysisPrompt(stackTrace, parsedFrames, repoContextInfo = null) {
    // repoContextInfo: { hasCode: boolean, formatted: string }
    const hasRepoContext = repoContextInfo && repoContextInfo.formatted;
    const hasActualCode = repoContextInfo && repoContextInfo.hasCode;
    const repoFormatted = hasRepoContext ? repoContextInfo.formatted : '';
    
    console.log('🤖 AI Prompt Config:', {
      hasRepoContext: !!hasRepoContext,
      hasActualCode: !!hasActualCode,
      willShowSection6: !!(hasRepoContext && !hasActualCode),
      repoInfoLength: repoFormatted.length
    });

    return `You are an expert software engineer and crash analysis specialist. Analyze the following crash stack trace and provide actionable debugging guidance.

**STACK TRACE:**
\`\`\`
${stackTrace}
\`\`\`

**PARSED INFORMATION:**
- Total Frames: ${parsedFrames.length}
- Top Frame: ${parsedFrames[0]?.function || 'Unknown'} at ${parsedFrames[0]?.file || 'Unknown'}:${parsedFrames[0]?.line || '?'}
${repoFormatted}

**YOUR TASK:**
Provide a comprehensive structured analysis with ALL of the following sections:

1. **ROOT CAUSE ANALYSIS** (Most Likely Issue)
   - Identify the most suspicious function/location
   - Explain what likely went wrong and why
   - Provide detailed technical reasoning
   - Confidence level (High/Medium/Low)

2. **TOP 3 SUSPICIOUS FUNCTIONS** (Ranked by likelihood)
   For each function provide:
   - Function name and location
   - Why it's suspicious (detailed explanation)
   - Common issues at this location
   - What to check (specific debugging steps)

3. **ISSUE PATTERN DETECTION**
   Identify likely crash patterns:
   - Null pointer dereference
   - Memory corruption (buffer overflow, use-after-free)
   - Race condition / threading issue
   - Resource exhaustion
   - Logic error
   - Other (specify)

4. **RECOMMENDED INVESTIGATION STEPS**
   Provide 3-5 specific actionable steps to debug this crash
   - Include specific debugging commands or techniques
   - Mention what to look for in logs or debugger

5. **QUESTIONS TO ASK**
   List 2-3 critical questions that would help narrow down the root cause

${hasRepoContext && !hasActualCode ? `
6. **REPOSITORY-SPECIFIC SUGGESTIONS**
   - The repository mentioned above is publicly accessible
   - Suggest specific files or areas to investigate in the repository
   - Recommend where to look in the repository structure for the mentioned files
   - Provide repository-aware debugging guidance` : ''}
${hasRepoContext && hasActualCode ? `
**IMPORTANT:** Source code has been provided above. Reference specific lines of code when explaining issues and provide code-level insights in each section above.` : ''}

**CRITICAL:** You must provide ALL ${hasRepoContext && !hasActualCode ? '6' : '5'} sections listed above. Use clear markdown formatting with headers. Be specific, technical, and actionable.`;
  }

  // Generate follow-up prompt for interactive chat
  generateFollowUpPrompt(originalStackTrace, previousAnalysis, userQuestion) {
    return `You are continuing a crash analysis conversation.

**ORIGINAL STACK TRACE:**
\`\`\`
${originalStackTrace}
\`\`\`

**PREVIOUS ANALYSIS:**
${previousAnalysis}

**USER'S FOLLOW-UP QUESTION:**
${userQuestion}

**YOUR TASK:**
Answer the user's question with specific, technical details related to this crash. Be concise but thorough.`;
  }

  // Call Gemini API for crash analysis
  async analyzeCrash(stackTrace, parsedFrames, repoContextInfo = null) {
    if (!this.apiKey) {
      await this.initialize();
    }

    const prompt = this.generateAnalysisPrompt(stackTrace, parsedFrames, repoContextInfo);
    
    const requestBody = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 3072,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_NONE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_NONE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_NONE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_NONE"
        }
      ]
    };

    try {
      const response = await fetch(
        `${this.baseUrl}/${this.model}:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `API request failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        return {
          success: true,
          analysis: data.candidates[0].content.parts[0].text,
          model: this.model
        };
      } else {
        throw new Error('Unexpected API response format');
      }
    } catch (error) {
      console.error('AI Service Error:', error);
      throw error;
    }
  }

  // Interactive follow-up question
  async askFollowUp(originalStackTrace, previousAnalysis, userQuestion) {
    if (!this.apiKey) {
      await this.initialize();
    }

    const prompt = this.generateFollowUpPrompt(originalStackTrace, previousAnalysis, userQuestion);
    
    const requestBody = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 1024,
      }
    };

    try {
      const response = await fetch(
        `${this.baseUrl}/${this.model}:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `API request failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        return {
          success: true,
          answer: data.candidates[0].content.parts[0].text,
          model: this.model
        };
      } else {
        throw new Error('Unexpected API response format');
      }
    } catch (error) {
      console.error('AI Service Error:', error);
      throw error;
    }
  }
}

// Export for use in popup.js
window.AIService = AIService;
