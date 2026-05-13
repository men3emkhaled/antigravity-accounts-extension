import * as vscode from 'vscode';

export interface Skill {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  icon: string;
  isActive: boolean;
  color: string;
  fullInstructions: string;
}

export class SkillService {
  private _onDidChangeSkills = new vscode.EventEmitter<void>();
  public readonly onDidChangeSkills = this._onDidChangeSkills.event;

  private skills: Skill[] = [
    {
      id: 'docx',
      title: 'docx',
      category: 'Word Documents',
      description: 'Create, read, and edit Word documents, reports, and templates with professional formatting.',
      tags: ['docx.edit', 'Report/Memo', 'Word creation'],
      icon: 'word',
      isActive: false,
      color: '#2b579a',
      fullInstructions: `
- USE standard office-style formatting for Word documents.
- ENSURE table of contents and headers are properly indexed.
- SUPPORT template-based generation for official letters and technical reports.
- OPTIMIZE for readability and professional aesthetics.`
    },
    {
      id: 'pdf-pro',
      title: 'pdf',
      category: 'PDF Processing',
      description: 'Advanced PDF operations: text extraction, merging, splitting, watermarking, and form filling.',
      tags: ['Form filling', 'PDF Merge/Split', 'PDF Creation'],
      icon: 'pdf',
      isActive: false,
      color: '#f40f02',
      fullInstructions: `
- USE specialized OCR-like logic for extracting text from scanned PDFs.
- MAINTAIN document hierarchy (Headers, Body, Footers) during split/merge.
- IMPLEMENT secure form-filling with field validation.
- SUPPORT digital watermarking and metadata injection for security.`
    },
    {
      id: 'pdf-reading',
      title: 'pdf-reading',
      category: 'PDF Reading Only',
      description: 'High-fidelity PDF parsing for text, tables, and images without modifying source files.',
      tags: ['Content Analysis', 'Text Extraction', 'PDF Read'],
      icon: 'book',
      isActive: false,
      color: '#e74c3c',
      fullInstructions: `- PERFORM read-only extraction of PDF content including tables, text, and images.
- DO NOT attempt to write or edit the source file.
- MAINTAIN data integrity when parsing nested tables or layouts.`
    },
    {
      id: 'pptx',
      title: 'pptx',
      category: 'PowerPoint',
      description: 'Create and manage professional presentation decks, templates, and speaker notes.',
      tags: ['pptx.file', 'Slide deck', 'Presentation'],
      icon: 'project',
      isActive: false,
      color: '#d24726',
      fullInstructions: `- CREATE professional slide decks with consistent templates.
- MANAGE slide order, content placeholders, and speaker notes.
- OPTIMIZE visual layout for clarity and presentation impact.`
    },
    {
      id: 'xlsx',
      title: 'xlsx',
      category: 'Excel / Spreadsheets',
      description: 'Complex data manipulation, formulas, pivot tables, and visualization for Excel/CSV.',
      tags: ['xlsx.file', 'Spreadsheet creation', 'Data Cleaning'],
      icon: 'table',
      isActive: false,
      color: '#217346',
      fullInstructions: `- APPLY advanced formulas (VLOOKUP, INDEX-MATCH, Pivot Table logic).
- PERFORM deep data cleaning: removing duplicates, normalizing formats, handling null values.
- GENERATE meaningful data visualizations and summaries from raw CSV data.`
    },
    {
      id: 'frontend',
      title: 'frontend-design',
      category: 'UI / Web',
      description: 'Build modern, high-performance web interfaces with premium design aesthetics.',
      tags: ['UI component', 'Web page', 'Dashboard'],
      icon: 'browser',
      isActive: false,
      color: '#6366f1',
      fullInstructions: `- ADHERE to modern Design Systems (Glassmorphism, Bento grids, Modern Typography).
- USE Tailwind CSS for rapid styling and utility-first responsiveness.
- IMPLEMENT Framer Motion for smooth micro-animations.
- ENSURE component reusability and clean state management (React/Next.js).`
    },
    {
      id: 'security-shield',
      title: 'security-guard',
      category: 'Cyber Security',
      description: 'Proactive code auditing and protection against credential leaks and vulnerabilities.',
      tags: ['API Protection', 'Security Audit', 'Leak Prevention'],
      icon: 'shield',
      isActive: false,
      color: '#e11d48',
      fullInstructions: `- NEVER hardcode API keys, tokens, secrets, or passwords in source code.
- ALWAYS use environment variables (.env) or secret managers for sensitive data.
- SCAN for common vulnerabilities: SQL Injection, XSS, CSRF, and Broken Auth.
- ENFORCE "Least Privilege" principle in all code implementations.
- WARN the user immediately if sensitive data is detected in the workspace.`
    },
    {
      id: 'performance-pro',
      title: 'performance-optimizer',
      category: 'Core Engineering',
      description: 'Deep optimization for execution speed, algorithmic efficiency, and memory usage.',
      tags: ['Code Speed', 'Optimization', 'Big O'],
      icon: 'zap',
      isActive: false,
      color: '#fbbf24',
      fullInstructions: `- ANALYZE and optimize time and space complexity (Big O).
- USE efficient data structures (Maps, Sets, Typed Arrays) for large-scale operations.
- IMPLEMENT lazy loading, caching, and debouncing where applicable.
- ELIMINATE memory leaks and redundant computations.`
    },
    {
      id: 'human-coder',
      title: 'human-persona',
      category: 'Stealth Coding',
      description: 'Professional human-like communication. Eliminates AI markers and excessive emojis.',
      tags: ['Human Style', 'No Emojis', 'Clean Tone'],
      icon: 'person',
      isActive: false,
      color: '#334155',
      fullInstructions: `- ZERO TOLERANCE FOR EMOJIS: Never use icons or any other symbols.
- ELIMINATE CONVERSATIONAL FILLER: Do not use generic AI greetings or filler phrases in any language. Start directly with the technical content.
- MULTILINGUAL PROFESSIONALISM: Maintain a professional, senior-level technical tone in the user's preferred language (e.g., Arabic or English).
- ADOPT SENIOR PRAGMATISM: Write code and comments as a focused human senior developer would. Use concise, technical language.
- NO AI MARKERS: Do not explain obvious logic or use repetitive AI-style bullet points.
- PURE TECHNICAL DELIVERY: Provide only the code and essential technical notes in a professional, dry tone.
`
    },
    {
      id: 'qa-expert',
      title: 'qa-tester',
      category: 'Software Quality',
      description: 'Expertise in automated testing, bug hunting, and quality assurance benchmarks.',
      tags: ['Unit Test', 'Integration', 'Bug Hunting'],
      icon: 'check-all',
      isActive: false,
      color: '#10b981',
      fullInstructions: `- WRITE comprehensive unit and integration tests using Jest or Vitest.
- IMPLEMENT end-to-end (E2E) testing with Playwright or Cypress.
- ENFORCE 100% test coverage for critical business logic.
- AUTOMATE regression testing and CI quality gates.`
    },
    {
      id: 'mobile-pro',
      title: 'mobile-expert',
      category: 'Mobile Apps',
      description: 'Build high-performance, cross-platform mobile applications with native UI feel.',
      tags: ['Flutter', 'React Native', 'Native UI'],
      icon: 'device-mobile',
      isActive: false,
      color: '#8b5cf6',
      fullInstructions: `- BUILD cross-platform mobile apps with native-level performance.
- OPTIMIZE for touch interactions, different screen sizes, and offline modes.
- MANAGE app state efficiently (Provider, Riverpod, or Redux).
- ENSURE smooth transitions and gesture-based navigation.`
    },
    {
      id: 'data-science',
      title: 'data-scientist',
      category: 'Data & AI',
      description: 'Comprehensive data analysis, model building, and big data visualization.',
      tags: ['Python Data', 'ML Ops', 'Visualization'],
      icon: 'graph',
      isActive: false,
      color: '#06b6d4',
      fullInstructions: `- PERFORM exploratory data analysis (EDA) using Pandas and NumPy.
- GENERATE insightful charts and statistical summaries.
- IMPLEMENT machine learning pipelines and model evaluation.
- OPTIMIZE data processing for large-scale datasets.`
    },
    {
      id: 'ux-expert',
      title: 'ux-researcher',
      category: 'Design Psychology',
      description: 'User-flow optimization and WCAG 2.1 accessibility standards for digital products.',
      tags: ['A11y', 'User Flow', 'Heuristics'],
      icon: 'search',
      isActive: false,
      color: '#ec4899',
      fullInstructions: `- ENSURE Web Accessibility (WCAG 2.1) compliance for all UI elements.
- OPTIMIZE user flows to minimize cognitive load and friction.
- APPLY Jakob Nielsen's heuristics for interface design.
- PERFORM content hierarchy analysis for better readability.`
    },
    {
      id: 'tech-writer',
      title: 'technical-writer',
      category: 'Documentation',
      description: 'Professional technical documentation, API specifications, and README architecture.',
      tags: ['Docs', 'README', 'API Spec'],
      icon: 'book',
      isActive: false,
      color: '#64748b',
      fullInstructions: `- WRITE clear, concise, and professional documentation for developers and users.
- CREATE comprehensive README files with setup guides and examples.
- DOCUMENT API endpoints using OpenAPI/Swagger specifications.
- TRANSLATE complex technical concepts into easy-to-understand language.`
    },
    {
      id: 'cloud-arch',
      title: 'cloud-architect',
      category: 'DevOps / Infrastructure',
      description: 'Scalable infrastructure design, containerization, and robust CI/CD orchestration.',
      tags: ['Docker', 'CI/CD', 'Scalable'],
      icon: 'cloud',
      isActive: false,
      color: '#0ea5e9',
      fullInstructions: `- DESIGN scalable, microservices-oriented architectures.
- USE Docker and Kubernetes best practices for containerization.
- IMPLEMENT robust CI/CD pipelines (GitHub Actions, GitLab CI).
- OPTIMIZE for high availability and fault tolerance.`
    },
    {
      id: 'backend-arch',
      title: 'backend-architect',
      category: 'System Design',
      description: 'Scalable API architecture, high-performance databases, and microservices logic.',
      tags: ['API Design', 'Database', 'Microservices'],
      icon: 'server',
      isActive: false,
      color: '#1e293b',
      fullInstructions: `- DESIGN RESTful or GraphQL APIs with proper versioning and security.
- OPTIMIZE database schemas and queries for high performance (SQL/NoSQL).
- IMPLEMENT robust caching strategies using Redis or similar.
- DESIGN event-driven architectures with message brokers (RabbitMQ/Kafka).`
    },
    {
      id: 'embedded-systems',
      title: 'embedded-expert',
      category: 'Hardware / IoT',
      description: 'Low-level firmware development, RTOS management, and hardware communication.',
      tags: ['C/C++', 'Firmware', 'IoT'],
      icon: 'circuit-board',
      isActive: false,
      color: '#b91c1c',
      fullInstructions: `- WRITE efficient C/C++ code for memory-constrained embedded systems.
- MANAGE real-time operating systems (FreeRTOS, Zephyr) and thread priority.
- IMPLEMENT hardware communication protocols (I2C, SPI, UART).
- OPTIMIZE for low power consumption and deterministic behavior.`
    },
    {
      id: 'game-dev',
      title: 'game-developer',
      category: 'Graphics / Media',
      description: 'Game mechanics, physics optimization, and shader development (Unity/Unreal).',
      tags: ['Unity', 'Unreal', 'Shaders'],
      icon: 'game',
      isActive: false,
      color: '#7c3aed',
      fullInstructions: `- IMPLEMENT complex game loops and state management.
- OPTIMIZE physics simulations and collision detection.
- WRITE custom shaders (HLSL/GLSL) for advanced visual effects.
- ENSURE high frame rates through profiling and asset optimization.`
    },
    {
      id: 'web3-blockchain',
      title: 'web3-expert',
      category: 'Blockchain',
      description: 'Smart contract development, security auditing, and decentralized application logic.',
      tags: ['Solidity', 'Smart Contracts', 'Web3.js'],
      icon: 'link-external',
      isActive: false,
      color: '#f59e0b',
      fullInstructions: `- WRITE secure, gas-efficient smart contracts (Solidity/Vyper).
- PERFORM deep security audits to prevent reentrancy and other vulnerabilities.
- IMPLEMENT Web3 provider integrations and wallet interactions.
- DESIGN decentralized storage architectures (IPFS/Arweave).`
    },
    {
      id: 'mlops-engineer',
      title: 'mlops-expert',
      category: 'Machine Learning',
      description: 'Model deployment pipelines, data versioning, and AI lifecycle monitoring.',
      tags: ['DVC', 'Model Deploy', 'Pipelines'],
      icon: 'pulse',
      isActive: false,
      color: '#14b8a6',
      fullInstructions: `- AUTOMATE machine learning model deployment and versioning.
- IMPLEMENT robust data and model monitoring pipelines.
- USE DVC (Data Version Control) and MLflow for lifecycle management.
- SCALE inference services using specialized container orchestration.`
    },
    {
      id: 'file-reader',
      title: 'file-reading',
      category: 'Universal File Router',
      description: 'Intelligent file parsing router for various formats including images and data.',
      tags: ['File Upload', 'mnt/user-data/uploads/', 'Read File'],
      icon: 'files',
      isActive: false,
      color: '#10b981',
      fullInstructions: `- AUTOMATICALLY detect file types and route them to the correct parser.
- EXTRACT context from unstructured data sources efficiently.
- MAP local file paths to workspace-relative paths for the Agent.`
    },
    {
      id: 'anthropic-knowledge',
      title: 'product-self-knowledge',
      category: 'Anthropic Products',
      description: 'Direct consultation of official Anthropic docs for real-time API and feature specs.',
      tags: ['Claude API', 'Claude Pricing', 'Claude Code'],
      icon: 'hubot',
      isActive: false,
      color: '#f59e0b',
      fullInstructions: `- CONSULT official Anthropic documentation for the latest API/Model updates.
- DO NOT rely on cached or outdated memory for Claude-specific technical specs.
- PROVIDE accurate pricing, rate limits, and feature comparisons.`
    }
  ];

  constructor(private context: vscode.ExtensionContext) {
    this.loadState();
  }

  getSkills(): Skill[] {
    return this.skills;
  }

  toggleSkill(id: string): boolean {
    const skill = this.skills.find(s => s.id === id);
    if (skill) {
      skill.isActive = !skill.isActive;
      this.saveState();
      this.injectSkillsToWorkspace(); // Sync with Agent context
      this._onDidChangeSkills.fire();
      return true;
    }
    return false;
  }

  private async injectSkillsToWorkspace() {
    const activeSkills = this.skills.filter(s => s.isActive);
    if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) {
      const root = vscode.workspace.workspaceFolders[0].uri;
      const skillsFolder = vscode.Uri.joinPath(root, '.antigravity', 'skills');
      const universalFile = vscode.Uri.joinPath(root, '.antigravity', 'UNIVERSAL_AGENT_GUIDE.md');
      const anthropicFile = vscode.Uri.joinPath(root, '.antigravity', 'active_skills.xml');

      try {
        // Clear old skills folders to prevent sync issues
        try {
          await vscode.workspace.fs.delete(skillsFolder, { recursive: true, useTrash: false });
        } catch (e) { /* ignore if not exists */ }

        await vscode.workspace.fs.createDirectory(skillsFolder);
        
        let xmlContent = '<available_skills>\n';
        let mdContent = `# 🧠 UNIVERSAL AGENT COMMAND CENTER\n\n`;
        mdContent += `> **SYSTEM INSTRUCTION**: You are an advanced AI Agent. You MUST adopt the following expert personas and adhere to their technical guidelines for all subsequent interactions in this workspace.\n\n`;
        mdContent += `## 🛠 Active Specialist Skills\n\n`;

        for (const skill of activeSkills) {
          const skillDir = vscode.Uri.joinPath(skillsFolder, skill.id);
          const skillMdFile = vscode.Uri.joinPath(skillDir, 'SKILL.md');
          await vscode.workspace.fs.createDirectory(skillDir);
          
          const skillMdContent = `# Skill: ${skill.title}\n\n` +
            `## Instructions\n${skill.fullInstructions}\n\n` +
            `## Triggers\n${skill.tags.map(t => `- ${t}`).join('\n')}\n`;

          await vscode.workspace.fs.writeFile(skillMdFile, Buffer.from(skillMdContent, 'utf8'));

          // Build Universal Markdown
          mdContent += `### ✅ ${skill.title.toUpperCase()} (${skill.category})\n`;
          mdContent += `**Role**: ${skill.description}\n`;
          mdContent += `**Expert Guidelines**:\n${skill.fullInstructions}\n`;
          mdContent += `**Activation Keywords**: \`${skill.tags.join('`, `')}\`\n\n`;
          mdContent += `---\n\n`;

          // Keep Anthropic XML for backward compatibility
          xmlContent += '  <skill>\n';
          xmlContent += `    <name>${skill.id}</name>\n`;
          xmlContent += `    <description>${skill.description}</description>\n`;
          xmlContent += `    <location>${skillMdFile.fsPath}</location>\n`;
          xmlContent += '  </skill>\n';
        }

        xmlContent += '</available_skills>';

        if (activeSkills.length === 0) {
          mdContent += `*No specialized skills currently active. Operating in standard assistant mode.*\n`;
        }

        await vscode.workspace.fs.writeFile(universalFile, Buffer.from(mdContent, 'utf8'));
        await vscode.workspace.fs.writeFile(anthropicFile, Buffer.from(xmlContent, 'utf8'));
        
        // --- Universal AI Support: Injection for other Agents ---
        // 1. Cursor (.cursorrules)
        const cursorRulesFile = vscode.Uri.joinPath(root, '.cursorrules');
        await vscode.workspace.fs.writeFile(cursorRulesFile, Buffer.from(mdContent, 'utf8'));

        // 2. Claude Code (CLAUDE.md)
        const claudeMdFile = vscode.Uri.joinPath(root, 'CLAUDE.md');
        await vscode.workspace.fs.writeFile(claudeMdFile, Buffer.from(mdContent, 'utf8'));

        vscode.window.setStatusBarMessage(`$(zap) Universal Agent Context Synced`, 3000);
      } catch (err) {
        console.error('Failed to inject universal skills', err);
      }
    }
  }

  private saveState() {
    const state = this.skills.reduce((acc, s) => {
      acc[s.id] = s.isActive;
      return acc;
    }, {} as Record<string, boolean>);
    this.context.globalState.update('antigravity.skills', state);
  }

  private loadState() {
    const state = this.context.globalState.get<Record<string, boolean>>('antigravity.skills') || {};
    this.skills.forEach(s => {
      if (state[s.id] !== undefined) {
        s.isActive = state[s.id];
      }
    });
  }
}
