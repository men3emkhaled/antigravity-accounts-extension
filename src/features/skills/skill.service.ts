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
  private skills: Skill[] = [
    {
      id: 'docx',
      title: 'docx',
      category: 'Word Documents',
      description: 'بالكامل من تقارير Word إنشاء، قراءة، وتعديل ملفات وخطابات ونماذج لفهارس وعناوين ورقمه صفحات.',
      tags: ['docx.تعديل', 'تقرير/مذكرة/خطاب', 'Word doc إنشاء'],
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
      description: 'استخراج نصوص، دمج، تقسيم، PDF: كل عمليات الـ ووترمارك، تشفير، وملء فورمات.',
      tags: ['ملء فورم', 'PDF دمج/تقسيم', 'PDF إنشاء'],
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
      description: 'فقط — نصوص، جداول، PDF قراءة واستخراج محتوى من صور، وفورمات — بدون تعديل أو إنشاء.',
      tags: ['تحليل محتوى', 'استخراج نص', 'PDF قراءة'],
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
      description: 'PowerPoint — slides إنشاء وتعديل وقراءة عروض وتركيب ملفات speaker notes. templates.',
      tags: ['pptx. ملف', 'Slide deck', 'عرض تقديمي'],
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
      description: 'فورمولاز، Excel و CSV — فتح، قراءة، إنشاء وتعديل ملفات تنسيق، تنظيف بيانات، وشارتات.',
      tags: ['xlsx. ملف', 'spreadsheet إنشاء', 'CSV تنظيف'],
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
      description: 'بناء واجهات ويب احترافية — React components، landing pages، dashboards — بتصميم مميز وبعيد عن الـ generic.',
      tags: ['UI component', 'صفحة ويب', 'Dashboard'],
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
      description: 'حماية الكود من تسريب المفاتيح (API Keys) والثغرات الأمنية. يمنع نهائياً وضع بيانات حساسة في الكود.',
      tags: ['API حماية', 'Security Audit', 'منع تسريب'],
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
      description: 'تحسين أداء الكود وسرعة التنفيذ. يركز على الـ Algorithms وكفاءة استهلاك الميموري.',
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
      description: 'الكتابة بأسلوب بشري محترف. يمنع الكومنتات اللي بتدل إنه AI ويمنع الايموجيز نهائياً.',
      tags: ['Human Style', 'No Emojis', 'Clean Tone'],
      icon: 'person',
      isActive: false,
      color: '#334155',
      fullInstructions: `- ZERO TOLERANCE FOR EMOJIS: Never use icons or any other symbols.
- ELIMINATE CONVERSATIONAL FILLER: Do not say "Certainly!", "I understand", or "Here is the updated code". Start directly with the technical content or code.
- ADOPT SENIOR PRAGMATISM: Write code and comments as a focused human senior developer would. Use concise, technical language.
- NO AI MARKERS: Do not explain obvious logic or use repetitive AI-style bullet points.
- PURE TECHNICAL DELIVERY: If asked for code, provide only the code and essential technical notes in a professional, dry tone.`
    },
    {
      id: 'qa-expert',
      title: 'qa-tester',
      category: 'Software Quality',
      description: 'خبير في اختبار الكود وضمان الجودة. Jest, Playwright, Cypress, and Unit Testing.',
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
      description: 'تطوير تطبيقات موبايل احترافية باستخدام Flutter أو React Native.',
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
      description: 'تحليل البيانات، بناء النماذج، والتعامل مع الـ Big Data. Python, Pandas, NumPy.',
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
      description: 'تحسين تجربة المستخدم وسهولة الوصول (Accessibility). بيفهم اليوزر بيفكر إزاي.',
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
      description: 'كتابة توثيق (Documentation) احترافي، READMEs، و API Docs.',
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
      description: 'بناء بنية تحتية سحابية قوية. Docker, Kubernetes, CI/CD, and Scalability.',
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
      id: 'file-reader',
      title: 'file-reading',
      category: 'Universal File Router',
      description: '(PDF, docx, xlsx, ذكي يعرف يقرأ أي نوع ملف Router CSV, JSON, ويختار الطريقة الصح لكل نوع (صور.',
      tags: ['ملف مرفوع', 'mnt/user-data/uploads/', 'اقرأ الملف ده'],
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
      description: 'قبل ما يجاوب على docs لـ Anthropic يتحقق من الرسمية لـ بدل ما يجاوب على Claude.ai أو Claude API, Claude Code قديمة ما يعتمد على memory.',
      tags: ['Claude API', 'Claude أسعار', 'Claude Code'],
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
        
        vscode.window.setStatusBarMessage(`$(zap) Universal Agent Context Updated`, 3000);
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
