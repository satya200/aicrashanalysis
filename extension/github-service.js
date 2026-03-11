// GitHub Service - Fetches code context from GitHub repositories

class GitHubService {
  constructor() {
    this.API_BASE = 'https://api.github.com';
    this.RAW_BASE = 'https://raw.githubusercontent.com';
  }

  /**
   * Parse GitHub repository URL
   * @param {string} repoUrl - GitHub repository URL (e.g., https://github.com/owner/repo)
   * @returns {object|null} - {owner, repo} or null if invalid
   */
  parseRepoUrl(repoUrl) {
    if (!repoUrl) return null;
    
    const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!match) return null;
    
    return {
      owner: match[1],
      repo: match[2].replace(/\.git$/, '') // Remove .git suffix if present
    };
  }

  /**
   * Extract repository path from build/debug paths
   * Handles paths like: /usr/src/debug/telemetry/.../git/source/xconf-client/file.c
   * Returns: source/xconf-client/file.c
   */
  extractRepoPath(filePath) {
    if (!filePath) return filePath;
    
    // Look for 'git/' in the path and extract everything after it
    const gitIndex = filePath.indexOf('/git/');
    if (gitIndex !== -1) {
      return filePath.substring(gitIndex + 5); // +5 to skip '/git/'
    }
    
    // If no git/ found, try other common patterns
    // Remove leading /usr/src/debug paths
    const srcDebugPattern = /^\/usr\/src\/debug\/[^\/]+\/[^\/]+\/(.+)$/;
    const match = filePath.match(srcDebugPattern);
    if (match) {
      return match[1];
    }
    
    // Return as-is if no patterns match
    return filePath;
  }

  /**
   * Fetch raw file content from GitHub
   * @param {string} owner - Repository owner
   * @param {string} repo - Repository name
   * @param {string} branch - Branch, tag, or commit SHA
   * @param {string} filePath - File path in repository
   * @returns {Promise<string|null>} - File content or null if error
   */
  async fetchFileContent(owner, repo, branch, filePath) {
    try {
      // Extract actual repo path from build paths
      let repoPath = this.extractRepoPath(filePath);
      
      // Remove leading slash from file path if present
      repoPath = repoPath.replace(/^\/+/, '');
      
      const url = `${this.RAW_BASE}/${owner}/${repo}/${branch}/${repoPath}`;
      console.log(`Fetching: ${url}`);
      const response = await fetch(url);
      
      if (!response.ok) {
        console.warn(`Failed to fetch ${repoPath}: ${response.status}`);
        return null;
      }
      
      console.log(`✅ Successfully fetched: ${repoPath}`);
      return await response.text();
    } catch (error) {
      console.error(`Error fetching file ${filePath}:`, error);
      return null;
    }
  }

  /**
   * Extract code context around a specific line number
   * @param {string} fileContent - Full file content
   * @param {number} lineNumber - Target line number (1-indexed)
   * @param {number} contextLines - Number of lines before/after to include (default: 5)
   * @returns {object} - {lines, startLine, endLine, targetLine}
   */
  extractCodeContext(fileContent, lineNumber, contextLines = 5) {
    if (!fileContent) return null;
    
    const lines = fileContent.split('\n');
    const targetIndex = lineNumber - 1; // Convert to 0-indexed
    
    if (targetIndex < 0 || targetIndex >= lines.length) {
      return null;
    }
    
    const startLine = Math.max(0, targetIndex - contextLines);
    const endLine = Math.min(lines.length - 1, targetIndex + contextLines);
    
    const contextLines_array = lines.slice(startLine, endLine + 1);
    
    return {
      lines: contextLines_array,
      startLine: startLine + 1, // Convert back to 1-indexed
      endLine: endLine + 1,
      targetLine: lineNumber,
      snippet: contextLines_array.join('\n')
    };
  }

  /**
   * Get code context for multiple stack frames
   * @param {Array} frames - Array of parsed stack frames with file and line properties
   * @param {string} repoUrl - GitHub repository URL
   * @param {string} branch - Branch, tag, or commit SHA
   * @returns {Promise<Array>} - Array of code contexts
   */
  async getCodeContext(frames, repoUrl, branch = 'main') {
    const repoInfo = this.parseRepoUrl(repoUrl);
    if (!repoInfo) {
      console.warn('Invalid GitHub repository URL');
      return [];
    }

    const contexts = [];
    
    // Process frames in parallel but limit to top 10 frames to avoid rate limiting
    const framesToProcess = frames.slice(0, 10);
    
    const promises = framesToProcess.map(async (frame) => {
      if (!frame.file || !frame.line) return null;
      
      // Skip if file path doesn't look like a source file
      const filePath = frame.file;
      if (!this.isSourceFile(filePath)) return null;
      
      try {
        const fileContent = await this.fetchFileContent(
          repoInfo.owner,
          repoInfo.repo,
          branch,
          filePath
        );
        
        if (!fileContent) return null;
        
        const context = this.extractCodeContext(fileContent, frame.line);
        
        if (context) {
          return {
            frame: frame,
            context: context,
            filePath: filePath
          };
        }
      } catch (error) {
        console.error(`Error processing frame ${frame.id}:`, error);
      }
      
      return null;
    });

    const results = await Promise.all(promises);
    
    // Filter out null results
    return results.filter(r => r !== null);
  }

  /**
   * Check if file path looks like a source code file
   * @param {string} filePath - File path
   * @returns {boolean} - True if it looks like a source file
   */
  isSourceFile(filePath) {
    if (!filePath) return false;
    
    // Common source file extensions
    const sourceExtensions = [
      '.c', '.cpp', '.cc', '.cxx', '.h', '.hpp',
      '.java', '.js', '.ts', '.jsx', '.tsx',
      '.py', '.rb', '.go', '.rs', '.swift',
      '.php', '.cs', '.m', '.mm', '.scala',
      '.kt', '.kts', '.sh', '.bash'
    ];
    
    return sourceExtensions.some(ext => filePath.toLowerCase().endsWith(ext));
  }

  /**
   * Format code contexts for AI prompt
   * @param {Array} codeContexts - Array of code contexts from getCodeContext
   * @returns {string} - Formatted string for AI prompt
   */
  formatContextsForPrompt(codeContexts) {
    if (!codeContexts || codeContexts.length === 0) {
      return '';
    }

    let formatted = '\n\n## 📦 Repository Code Context\n\n';
    formatted += 'Here is the actual source code around the crash locations:\n\n';

    codeContexts.forEach((ctx, index) => {
      const frame = ctx.frame;
      formatted += `### Frame ${frame.id}: ${frame.function || 'Unknown'}\n`;
      formatted += `**File:** \`${ctx.filePath}\`\n`;
      formatted += `**Line:** ${ctx.context.targetLine}\n\n`;
      formatted += '```' + this.getLanguageFromPath(ctx.filePath) + '\n';
      formatted += `// Lines ${ctx.context.startLine}-${ctx.context.endLine}\n`;
      
      // Add line numbers to code
      ctx.context.lines.forEach((line, idx) => {
        const lineNum = ctx.context.startLine + idx;
        const marker = lineNum === ctx.context.targetLine ? '➤' : ' ';
        formatted += `${marker} ${lineNum.toString().padStart(4, ' ')} | ${line}\n`;
      });
      
      formatted += '```\n\n';
    });

    return formatted;
  }

  /**
   * Get language identifier from file path for syntax highlighting
   * @param {string} filePath - File path
   * @returns {string} - Language identifier
   */
  getLanguageFromPath(filePath) {
    if (!filePath) return '';
    
    const ext = filePath.substring(filePath.lastIndexOf('.')).toLowerCase();
    const langMap = {
      '.c': 'c',
      '.h': 'c',
      '.cpp': 'cpp',
      '.cc': 'cpp',
      '.cxx': 'cpp',
      '.hpp': 'cpp',
      '.java': 'java',
      '.js': 'javascript',
      '.jsx': 'javascript',
      '.ts': 'typescript',
      '.tsx': 'typescript',
      '.py': 'python',
      '.rb': 'ruby',
      '.go': 'go',
      '.rs': 'rust',
      '.swift': 'swift',
      '.php': 'php',
      '.cs': 'csharp',
      '.sh': 'bash',
      '.bash': 'bash'
    };
    
    return langMap[ext] || '';
  }

  /**
   * Format repository information for AI prompt (even without code context)
   * @param {string} repoUrl - GitHub repository URL
   * @param {string} branch - Branch/tag/commit
   * @param {Array} codeContexts - Array of code contexts (optional)
   * @param {Array} parsedFrames - All parsed frames for context
   * @returns {string} - Formatted string for AI prompt
   */
  formatRepositoryInfoForPrompt(repoUrl, branch, codeContexts = [], parsedFrames = []) {
    const repoInfo = this.parseRepoUrl(repoUrl);
    if (!repoInfo) return { hasCode: false, formatted: '' };

    let formatted = '\n\n## 📦 Repository Context (Supplementary)\n\n';
    formatted += `**Repository:** [${repoInfo.owner}/${repoInfo.repo}](${repoUrl})\n`;
    formatted += `**Branch/Ref:** \`${branch}\`\n\n`;

    const hasCodeContext = codeContexts && codeContexts.length > 0;

    if (hasCodeContext) {
      formatted += `✅ **Fetched Source Code:** Successfully retrieved code for ${codeContexts.length} frame(s).\n\n`;
      formatted += this.formatContextsForPrompt(codeContexts);
    } else {
      formatted += `ℹ️ **Repository Information:** The repository above is publicly accessible.\n\n`;
      
      // List the files mentioned in the stack trace (extract repo paths)
      const filePaths = parsedFrames
        .filter(f => f.file && this.isSourceFile(f.file))
        .map(f => {
          const repoPath = this.extractRepoPath(f.file);
          return { original: f.file, repo: repoPath };
        })
        .filter((v, i, a) => a.findIndex(x => x.repo === v.repo) === i); // unique by repo path
      
      if (filePaths.length > 0) {
        formatted += `**Files mentioned in stack trace:**\n`;
        filePaths.forEach(pathObj => {
          if (pathObj.original !== pathObj.repo) {
            formatted += `- \`${pathObj.repo}\` (from build path: \`${pathObj.original}\`)\n`;
          } else {
            formatted += `- \`${pathObj.repo}\`\n`;
          }
        });
        formatted += `\n*Note: Extracted repository paths from build/debug paths for easier lookup.*\n`;
      }
    }

    console.log('📦 Repository context info:', { hasCode: hasCodeContext, formatted: formatted.substring(0, 200) + '...' });
    return { hasCode: hasCodeContext, formatted: formatted };
  }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GitHubService;
}
