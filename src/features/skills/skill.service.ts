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
  isCustom?: boolean;
}


export class SkillService {
  private _onDidChangeSkills = new vscode.EventEmitter<void>();
  public readonly onDidChangeSkills = this._onDidChangeSkills.event;

  private skills: Skill[] = [
    {
      id: 'frontend-material-design-3',
      title: 'Material Design 3',
      category: 'Premium UI & Design',
      description: 'Material Design 3 Guidelines and Philosophy',
      tags: ['Frontend', 'Design', 'UI'],
      icon: 'browser',
      isActive: false,
      color: '#6366f1',
      fullInstructions: `- DESIGN SYSTEM: Google Material Design 3 (M3)\n- PHILOSOPHY: "Material You" - highly personalized, adaptable, and accessible.\n- CHARACTERISTICS: Heavy use of dynamic color extraction, large rounded corners, prominent floating action buttons (FABs), elevation through tonal differences, and fluid responsive layouts.\n- TYPOGRAPHY: Roboto with fluid scaling.\n- CORE VISUAL: Flat surfaces with subtle depth, bold intentional colors, and playful micro-animations.\n- CORE RULES: Apply modern layout paradigms (CSS Grid/Flexbox), use design tokens, and ensure visible focus states.`
    },
    {
      id: 'frontend-apple-hig',
      title: 'Apple HIG',
      category: 'Premium UI & Design',
      description: 'Apple HIG Guidelines and Philosophy',
      tags: ['Frontend', 'Design', 'UI'],
      icon: 'browser',
      isActive: false,
      color: '#6366f1',
      fullInstructions: `- DESIGN SYSTEM: Apple Human Interface Guidelines (HIG)\n- PHILOSOPHY: Clarity, Deference, and Depth.\n- CHARACTERISTICS: Heavy use of translucency (glassmorphism/blur effects), vibrant but constrained color palettes, minimal borders, large typography for hierarchy, and continuous curves (squarcles).\n- TYPOGRAPHY: San Francisco (SF Pro) - highly legible with tight kerning.\n- CORE VISUAL: Content is the hero, UI elements recede. Very smooth, physics-based spring animations.\n- CORE RULES: Apply modern layout paradigms (CSS Grid/Flexbox), use design tokens, and ensure visible focus states.`
    },
    {
      id: 'frontend-ibm-carbon',
      title: 'IBM Carbon',
      category: 'Premium UI & Design',
      description: 'IBM Carbon Guidelines and Philosophy',
      tags: ['Frontend', 'Design', 'UI'],
      icon: 'browser',
      isActive: false,
      color: '#6366f1',
      fullInstructions: `- DESIGN SYSTEM: IBM Carbon Design System\n- PHILOSOPHY: Open-source, accessible, and highly systematic for enterprise scale.\n- CHARACTERISTICS: Strict grid systems (16-column base), high-contrast data visualization, monochromatic base with functional semantic colors.\n- TYPOGRAPHY: IBM Plex - a bespoke, highly legible, brutalist-leaning typeface.\n- CORE VISUAL: Utilitarian, sharp edges, precise, data-heavy but clean. Very professional and technical.\n- CORE RULES: Apply modern layout paradigms (CSS Grid/Flexbox), use design tokens, and ensure visible focus states.`
    },
    {
      id: 'frontend-uber-base-web',
      title: 'Uber Base Web',
      category: 'Premium UI & Design',
      description: 'Uber Base Web Guidelines and Philosophy',
      tags: ['Frontend', 'Design', 'UI'],
      icon: 'browser',
      isActive: false,
      color: '#6366f1',
      fullInstructions: `- DESIGN SYSTEM: Uber Base Web\n- PHILOSOPHY: Utility, speed, and cross-platform consistency.\n- CHARACTERISTICS: Extremely stark contrast (black and white primary), heavy bold typography, geometric shapes, minimal decorative elements.\n- TYPOGRAPHY: Uber Move - a custom geometric sans-serif inspired by transportation signage.\n- CORE VISUAL: High utility, brutally simple, highly accessible. Focus is entirely on the task with zero visual friction.\n- CORE RULES: Apply modern layout paradigms (CSS Grid/Flexbox), use design tokens, and ensure visible focus states.`
    },
    {
      id: 'frontend-microsoft-fluent',
      title: 'Microsoft Fluent',
      category: 'Premium UI & Design',
      description: 'Microsoft Fluent Guidelines and Philosophy',
      tags: ['Frontend', 'Design', 'UI'],
      icon: 'browser',
      isActive: false,
      color: '#6366f1',
      fullInstructions: `- DESIGN SYSTEM: Microsoft Fluent Design System\n- PHILOSOPHY: Sensory, engaging, and inclusive. "Light, Depth, Motion, Material, Scale."\n- CHARACTERISTICS: "Acrylic" material (blur/translucency), "Reveal" highlight (lighting effects on hover), elevation via shadows, responsive layouts for all devices.\n- TYPOGRAPHY: Segoe UI.\n- CORE VISUAL: Layered, textural, responsive. It feels like interacting with physical, illuminated glass.\n- CORE RULES: Apply modern layout paradigms (CSS Grid/Flexbox), use design tokens, and ensure visible focus states.`
    },
    {
      id: 'frontend-airbnb-dls',
      title: 'Airbnb DLS',
      category: 'Premium UI & Design',
      description: 'Airbnb DLS Guidelines and Philosophy',
      tags: ['Frontend', 'Design', 'UI'],
      icon: 'browser',
      isActive: false,
      color: '#6366f1',
      fullInstructions: `- DESIGN SYSTEM: Airbnb Design Language System (DLS)\n- PHILOSOPHY: "Belong anywhere" - warm, human, and highly consistent.\n- CHARACTERISTICS: Large, high-quality imagery, generous whitespace, soft rounded corners, warm primary color (Bélo Red), conversational UI patterns.\n- TYPOGRAPHY: Cereal - a custom geometric sans-serif that feels friendly and highly readable.\n- CORE VISUAL: Inviting, editorial-style layouts, highly legible, focuses on storytelling and trust.\n- CORE RULES: Apply modern layout paradigms (CSS Grid/Flexbox), use design tokens, and ensure visible focus states.`
    },
    {
      id: 'frontend-shopify-polaris',
      title: 'Shopify Polaris',
      category: 'Premium UI & Design',
      description: 'Shopify Polaris Guidelines and Philosophy',
      tags: ['Frontend', 'Design', 'UI'],
      icon: 'browser',
      isActive: false,
      color: '#6366f1',
      fullInstructions: `- DESIGN SYSTEM: Shopify Polaris\n- PHILOSOPHY: Merchant-first, accessible, and scalable for complex commerce interfaces.\n- CHARACTERISTICS: Functional utility, dense information hierarchy, restrained color palette (mostly grays, white, with green for primary actions and blue for info).\n- TYPOGRAPHY: Inter - highly legible for data-heavy tables and dashboards.\n- CORE VISUAL: A tool for work. Very clear boundaries between sections, extensive use of cards, unopinionated so merchant data stands out.\n- CORE RULES: Apply modern layout paradigms (CSS Grid/Flexbox), use design tokens, and ensure visible focus states.`
    },
    {
      id: 'frontend-atlassian-design',
      title: 'Atlassian Design',
      category: 'Premium UI & Design',
      description: 'Atlassian Design Guidelines and Philosophy',
      tags: ['Frontend', 'Design', 'UI'],
      icon: 'browser',
      isActive: false,
      color: '#6366f1',
      fullInstructions: `- DESIGN SYSTEM: Atlassian Design System\n- PHILOSOPHY: Team collaboration, productivity, and practicality.\n- CHARACTERISTICS: Playful but professional, distinct "Atlassian Blue", extensive use of avatars, lozenges (badges) for status, clear structured navigation for complex nested hierarchies.\n- TYPOGRAPHY: Charlie Sans (headings) / system-ui (body).\n- CORE VISUAL: Information-dense but structured. Uses color coding heavily to indicate status and priority.\n- CORE RULES: Apply modern layout paradigms (CSS Grid/Flexbox), use design tokens, and ensure visible focus states.`
    },
    {
      id: 'frontend-vercel-geist',
      title: 'Vercel Geist',
      category: 'Premium UI & Design',
      description: 'Vercel Geist Guidelines and Philosophy',
      tags: ['Frontend', 'Design', 'UI'],
      icon: 'browser',
      isActive: false,
      color: '#6366f1',
      fullInstructions: `- DESIGN SYSTEM: Vercel Geist (Next.js)\n- PHILOSOPHY: Developer-first, hyper-minimalist, fast.\n- CHARACTERISTICS: High-contrast monochrome (black/white), incredibly thin borders (1px gray), stark geometry, subtle hover states, zero fluff.\n- TYPOGRAPHY: Geist Sans / Geist Mono - highly technical and geometric.\n- CORE VISUAL: Feels like a modern code editor. Very sharp, extremely clean, highly technical.\n- CORE RULES: Apply modern layout paradigms (CSS Grid/Flexbox), use design tokens, and ensure visible focus states.`
    },
    {
      id: 'frontend-linear-design',
      title: 'Linear Design',
      category: 'Premium UI & Design',
      description: 'Linear Design Guidelines and Philosophy',
      tags: ['Frontend', 'Design', 'UI'],
      icon: 'browser',
      isActive: false,
      color: '#6366f1',
      fullInstructions: `- DESIGN SYSTEM: Linear Design System\n- PHILOSOPHY: Magical, high-craft, and keyboard-first.\n- CHARACTERISTICS: Dark mode by default (or highly polished dark themes), deep space backgrounds, glowing subtle accents, extreme attention to micro-interactions, keyboard shortcut hints everywhere.\n- TYPOGRAPHY: Inter - used with varying opacities to establish hierarchy rather than just size.\n- CORE VISUAL: Sleek, premium, high-performance. Feels like a specialized tool for power users.\n- CORE RULES: Apply modern layout paradigms (CSS Grid/Flexbox), use design tokens, and ensure visible focus states.`
    },
    {
      id: 'arabic-localization',
      title: 'arabic-rtl for chat',
      category: 'Standalone',
      description: 'Ensure proper Right-to-Left text alignment for Arabic communication.',
      tags: ['RTL', 'Arabic', 'Localization'],
      icon: 'symbol-string',
      isActive: false,
      color: '#0ea5e9',
      fullInstructions: `- RTL ARABIC SUPPORT: If the user communicates in Arabic, you MUST wrap your entire response in \`<div dir="rtl">\` and \`</div>\` to ensure proper Right-to-Left text alignment in the chat interface.\n- CONSISTENCY: Always ensure that the \`div\` tags correctly wrap the entire response when speaking in Arabic.`
    },
    {
      id: 'docx',
      title: 'docx',
      category: 'Document & Data Engine',
      description: 'Create, read, and edit Word documents, reports, and templates with professional formatting.',
      tags: ['docx.edit', 'Report/Memo', 'Word creation'],
      icon: 'word',
      isActive: false,
      color: '#2b579a',
      fullInstructions: `- STRUCTURE documents with proper heading hierarchy (H1 > H2 > H3) — never skip levels.
- USE styles (not manual formatting) for all headings, body text, captions, and lists to ensure consistency and easy theme changes.
- BUILD table of contents from heading styles only — never manually type TOC entries.
- IMPLEMENT section breaks (not page breaks) when different headers/footers are needed per section.
- USE tracked changes and comments for collaborative editing — never overwrite directly in review mode.
- DESIGN tables with merged headers and alternating row colors for readability — avoid borders-only tables.
- EMBED cross-references (not hardcoded numbers) for figure/table references so they auto-update.
- EXPORT to PDF with accessibility tags enabled — ensure all images have alt text in the document properties.
- TEMPLATE all repeating documents: official letters, reports, memos — never rebuild from scratch.`
    },
    {
      id: 'pdf-pro',
      title: 'pdf',
      category: 'Document & Data Engine',
      description: 'Advanced PDF operations: text extraction, merging, splitting, watermarking, and form filling.',
      tags: ['Form filling', 'PDF Merge/Split', 'PDF Creation'],
      icon: 'pdf',
      isActive: false,
      color: '#f40f02',
      fullInstructions: `- DISTINGUISH between text-based PDFs (selectable text) and scanned PDFs (image-only) — apply OCR only to the latter.
- PRESERVE document structure during merge: bookmarks, named destinations, and form fields must survive the operation.
- IMPLEMENT form-filling with field type validation: text, checkbox, radio, dropdown, date — validate before submission.
- APPLY digital watermarks at the page content stream level, not as floating overlays, for tamper resistance.
- INJECT PDF/A metadata for long-term archival compliance when generating official documents.
- OPTIMIZE PDF file size: downsample images above 150dpi for web, flatten transparent layers, subset embedded fonts.
- REDACT sensitive data properly — use actual content removal, not black rectangle overlays (which are reversible).
- SPLIT large PDFs by bookmark structure or page ranges, never arbitrarily — preserve context boundaries.`
    },
    {
      id: 'pdf-reading',
      title: 'pdf-reading',
      category: 'Document & Data Engine',
      description: 'High-fidelity PDF parsing for text, tables, and images without modifying source files.',
      tags: ['Content Analysis', 'Text Extraction', 'PDF Read'],
      icon: 'book',
      isActive: false,
      color: '#e74c3c',
      fullInstructions: `- PERFORM read-only extraction only — never acquire write handles or modify the source file in any way.
- DETECT document structure: multi-column layouts, sidebars, footnotes, and headers must be parsed in reading order, not positional order.
- EXTRACT tables by detecting cell boundaries via position clustering — output as structured 2D arrays, not raw text.
- PRESERVE mathematical formulas and special characters (Greek, symbols) using Unicode mapping, not substitution.
- HANDLE scanned PDFs by flagging them as image-only and returning the raw page image for external OCR processing.
- EXTRACT hyperlinks, cross-references, and bookmark targets as separate metadata alongside the text content.
- REPORT confidence level when text extraction is ambiguous (overlapping glyphs, damaged encoding).`
    },
    {
      id: 'pptx',
      title: 'pptx',
      category: 'Document & Data Engine',
      description: 'Create and manage professional presentation decks, templates, and speaker notes.',
      tags: ['pptx.file', 'Slide deck', 'Presentation'],
      icon: 'project',
      isActive: false,
      color: '#d24726',
      fullInstructions: `- ENFORCE a single visual theme: consistent fonts (max 2 families), colors (brand palette only), and spacing across all slides.
- APPLY the 6x6 rule: max 6 bullet points per slide, max 6 words per bullet — slides are a visual aid, not a script.
- STRUCTURE deck narrative: Problem → Insight → Solution → Proof → Call-to-Action. Every slide must serve this arc.
- USE slide masters and layouts — never format individual slides manually. All spacing and positioning via the layout system.
- ADD presenter notes with the full script or talking points for each slide — the deck must work standalone without the presenter.
- DESIGN data slides with a single chart per slide, clear axis labels, and a descriptive title that states the insight (not just the topic).
- EXPORT a PDF handout version with 3 slides per page + notes section for distribution.
- TEST the deck in presentation mode on a 16:9 1920x1080 display before delivery — check for text cutoff and font rendering.`
    },
    {
      id: 'xlsx',
      title: 'xlsx',
      category: 'Document & Data Engine',
      description: 'Complex data manipulation, formulas, pivot tables, and visualization for Excel/CSV.',
      tags: ['xlsx.file', 'Spreadsheet creation', 'Data Cleaning'],
      icon: 'table',
      isActive: false,
      color: '#217346',
      fullInstructions: `- PREFER INDEX-MATCH over VLOOKUP — it handles leftward lookups, is faster on large datasets, and doesn't break on column insertion.
- USE XLOOKUP (Excel 365+) for the most robust lookup: handles not-found cases, returns ranges, and searches in any direction.
- BUILD pivot tables from structured tables (Ctrl+T), not raw ranges — tables auto-expand and named columns survive formula changes.
- CLEAN data before analysis: TRIM() whitespace, PROPER()/UPPER()/LOWER() text normalization, IFERROR() for formula error masking.
- USE Power Query for repeatable ETL transformations — never manual cleaning steps that can't be reproduced.
- APPLY conditional formatting with formulas, not just presets — formulas give full control over logic and styling.
- NAME ranges and tables explicitly — never use raw cell references like A1:Z500 in formulas shared with others.
- VALIDATE data entry with Data Validation rules and dropdown lists to prevent input errors at the source.
- USE SUMIFS/COUNTIFS/AVERAGEIFS instead of array formulas where possible — they're more readable and faster.`
    },

    {
      id: 'security-shield',
      title: 'security-guard',
      category: 'Cloud & Security',
      description: 'Proactive code auditing and protection against credential leaks and vulnerabilities.',
      tags: ['API Protection', 'Security Audit', 'Leak Prevention'],
      icon: 'shield',
      isActive: false,
      color: '#e11d48',
      fullInstructions: `- NEVER hardcode secrets (API keys, tokens, passwords, connection strings) anywhere in source code, including comments and test files.
- USE environment variables + a secrets manager (AWS Secrets Manager, Vault, Doppler) — .env files are for local dev only and must be in .gitignore.
- SCAN every code change for: SQL Injection (parameterized queries only), XSS (output encoding + CSP headers), CSRF (SameSite cookies + CSRF tokens), IDOR (object-level authorization on every request).
- ENFORCE Least Privilege: every API key, DB user, and service account gets only the minimum permissions it needs to function.
- VALIDATE and sanitize ALL user input at the server — client-side validation is UX, not security.
- IMPLEMENT rate limiting, brute-force protection, and account lockout on all authentication endpoints.
- USE HTTPS everywhere. Never transmit sensitive data over HTTP, even on internal networks.
- HASH passwords with bcrypt (cost factor 12+) or Argon2id — never MD5, SHA1, or SHA256 for passwords.
- AUDIT third-party dependencies: run npm audit / pip-audit on every build. Remove unused dependencies.
- LOG security events (failed logins, permission denials, unusual access patterns) — never log passwords or tokens.
- IMPLEMENT Security Headers: Content-Security-Policy, Strict-Transport-Security, X-Frame-Options, X-Content-Type-Options.
- DESIGN for Zero Trust: verify every request, regardless of where it originates (even inside the network).`
    },
    {
      id: 'performance-pro',
      title: 'performance-optimizer',
      category: 'Software Integrity',
      description: 'Deep optimization for execution speed, algorithmic efficiency, and memory usage.',
      tags: ['Code Speed', 'Optimization', 'Big O'],
      icon: 'zap',
      isActive: false,
      color: '#fbbf24',
      fullInstructions: `- PROFILE before optimizing — never guess the bottleneck. Use Chrome DevTools, clinic.js, py-spy, or language-native profilers.
- ANALYZE algorithmic complexity first: O(n²) loops over large datasets are a bigger problem than any micro-optimization.
- USE the right data structure: Map for O(1) key-value lookups, Set for O(1) membership tests, typed arrays for numeric processing.
- IMPLEMENT memoization for pure functions with expensive computation — cache results keyed on input signature.
- APPLY debounce (trailing) for search/resize handlers, throttle (leading) for scroll/mousemove — know the difference.
- ELIMINATE unnecessary re-renders in React: useMemo for expensive calculations, useCallback for stable function references, React.memo for pure components.
- DETECT and fix memory leaks: unsubscribed event listeners, uncleared intervals, unclosed DB connections, circular references.
- DEFER non-critical work with requestIdleCallback (browser) or setImmediate (Node) to keep the main thread responsive.
- BATCH DOM mutations: read all, then write all — never interleave reads and writes (causes layout thrashing).
- USE Web Workers for CPU-intensive tasks to keep the UI thread at 60fps.`
    },
    {
      id: 'human-coder',
      title: 'human-persona',
      category: 'Persona & Tone',
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
      category: 'Software Integrity',
      description: 'Expertise in automated testing, bug hunting, and quality assurance benchmarks.',
      tags: ['Unit Test', 'Integration', 'Bug Hunting'],
      icon: 'check-all',
      isActive: false,
      color: '#10b981',
      fullInstructions: `- FOLLOW the testing pyramid: many unit tests (fast, isolated), fewer integration tests, minimal E2E tests (slow, expensive).
- WRITE tests that document behavior, not implementation — test what the code does, not how it does it internally.
- USE Arrange-Act-Assert (AAA) pattern in every test: clear setup, single action, explicit assertion.
- MOCK external dependencies (HTTP, DB, filesystem) at the boundary — never let tests touch real external services.
- TEST the unhappy path first: null inputs, empty arrays, network errors, auth failures — happy path is easy, edge cases catch bugs.
- ACHIEVE meaningful coverage: 100% line coverage means nothing if critical logical branches aren't tested.
- IMPLEMENT visual regression tests (Playwright screenshots, Storybook + Chromatic) for UI components.
- WRITE contract tests (Pact) for service-to-service integrations — don't rely only on E2E tests for API contracts.
- RUN tests in parallel and in random order — flaky tests that depend on ordering are hiding real bugs.
- ADD tests before fixing bugs: write a failing test that reproduces the bug, then fix it — prevents regression.`
    },
    {
      id: 'mobile-pro',
      title: 'mobile-expert',
      category: 'Mobile & Platforms',
      description: 'Build high-performance, cross-platform mobile applications with native UI feel and premium UX.',
      tags: ['Flutter', 'React Native', 'Native UI', 'iOS', 'Android'],
      icon: 'device-mobile',
      isActive: false,
      color: '#8b5cf6',
      fullInstructions: `- DESIGN for thumb-zone: primary actions in the bottom 1/3 of screen, destructive actions require confirmation and distance from primary CTA.
- TARGET 60fps minimum for all animations and scroll interactions — profile with DevTools, not assumptions.
- IMPLEMENT proper safe area insets for notched devices and dynamic islands.
- OPTIMIZE startup time: lazy load heavy modules, defer non-critical initialization.
- MANAGE app state with a clear unidirectional data flow (Riverpod/BLoC for Flutter, Redux/Zustand for React Native).
- HANDLE offline mode explicitly: cache critical data, queue writes, sync on reconnect with conflict resolution.
- USE platform-adaptive UI: follow Material 3 on Android, Cupertino conventions on iOS for native feel.
- IMPLEMENT proper push notification deep-linking with navigation state restoration.`
    },
    {
      id: 'data-science',
      title: 'data-scientist',
      category: 'AI & Intelligence',
      description: 'Comprehensive data analysis, model building, and big data visualization.',
      tags: ['Python Data', 'ML Ops', 'Visualization'],
      icon: 'graph',
      isActive: false,
      color: '#06b6d4',
      fullInstructions: `- START every analysis with EDA: shape, dtypes, null counts, basic stats (describe()), and value distributions before any modeling.
- VISUALIZE distributions before assuming normality — use histograms, box plots, and Q-Q plots to understand the data shape.
- HANDLE missing data explicitly: document the imputation strategy and why (mean/median/mode/forward-fill/drop) — never silently fill.
- ENGINEER features with domain knowledge: raw features rarely beat well-designed aggregations and transformations.
- SPLIT data strictly: train/validation/test — never use test data for any decisions until final evaluation.
- TRACK experiments with MLflow or W&B: every run logs hyperparameters, metrics, and artifact versions.
- EVALUATE models beyond accuracy: use precision, recall, F1, AUC-ROC for classification; MAE, RMSE, MAPE for regression.
- EXPLAIN model predictions with SHAP values for stakeholders — black-box results without explanation are not production-ready.
- PROCESS large datasets with chunking (Pandas read_csv chunksize), Polars, or Dask — never load full dataset into memory blindly.
- VERSION datasets with DVC alongside model versions — reproducibility requires knowing both the model and the data it was trained on.`
    },
    {
      id: 'ux-expert',
      title: 'ux-researcher',
      category: 'Strategy & Logic',
      description: 'User-flow optimization, behavioral psychology, and WCAG 2.1 accessibility for digital products.',
      tags: ['A11y', 'User Flow', 'Heuristics', 'Cognitive Load', 'UX'],
      icon: 'search',
      isActive: false,
      color: '#ec4899',
      fullInstructions: `- APPLY Fitts's Law: make clickable targets large enough (min 44x44px) and close to where the user's cursor naturally rests.
- REDUCE cognitive load: show only what's needed at each step. Progressive disclosure > information dump.
- APPLY Jakob Nielsen's 10 heuristics — especially visibility of system status, error prevention, and recognition over recall.
- ENSURE WCAG 2.1 AA compliance: 4.5:1 contrast for text, 3:1 for large text and UI components, keyboard navigation, ARIA roles.
- DESIGN for error states first: empty states, loading states, error messages, and recovery paths are as important as the happy path.
- USE the F-pattern and Z-pattern reading principles to place key information and CTAs where eyes naturally land.
- VALIDATE every flow against: Can a new user complete this task in under 3 clicks? Is every step's purpose obvious?
- APPLY Hick's Law: fewer choices = faster decisions. Reduce options at every decision point.`
    },
    {
      id: 'tech-writer',
      title: 'technical-writer',
      category: 'Strategy & Logic',
      description: 'Professional technical documentation, API specifications, and README architecture.',
      tags: ['Docs', 'README', 'API Spec'],
      icon: 'book',
      isActive: false,
      color: '#64748b',
      fullInstructions: `- WRITE for the reader's context: junior devs need explanation, senior devs need reference — know which doc type you're writing.
- STRUCTURE READMEs: What it does → Why use it → Quick start (working in under 5 minutes) → Full docs link. Never bury the quick start.
- DOCUMENT APIs with OpenAPI 3.1: include request/response schemas, error codes, authentication, and at least one real example per endpoint.
- USE ADRs (Architecture Decision Records) for every significant technical decision: context, options considered, decision made, consequences.
- WRITE runbooks for operational tasks: step-by-step, with expected outputs and troubleshooting for common failure points.
- KEEP docs co-located with code (docs/ folder in repo) — external wikis go stale and drift from reality.
- ADD code examples that actually run — test all code snippets in documentation as part of CI.
- DOCUMENT the WHY, not just the WHAT — code shows what it does, docs must explain why this approach was chosen.
- MAINTAIN a CHANGELOG following Keep a Changelog format: Added, Changed, Deprecated, Removed, Fixed, Security per version.`
    },
    {
      id: 'cloud-arch',
      title: 'cloud-architect',
      category: 'Cloud & Security',
      description: 'Scalable infrastructure design, containerization, and robust CI/CD orchestration.',
      tags: ['Docker', 'CI/CD', 'Scalable'],
      icon: 'cloud',
      isActive: false,
      color: '#0ea5e9',
      fullInstructions: `- DESIGN for failure: every external dependency (DB, cache, API) must have a circuit breaker, timeout, and fallback strategy.
- BUILD Docker images in multi-stage builds: builder stage (full SDK) → runtime stage (minimal base image like distroless or alpine).
- DEFINE Kubernetes resource requests AND limits for every container — containers without limits cause node OOM kills.
- IMPLEMENT health checks: /healthz (liveness) and /readyz (readiness) endpoints on every service.
- USE GitOps (ArgoCD/Flux) for Kubernetes deployments — cluster state declared in Git, never applied manually.
- DESIGN CI/CD pipelines with distinct stages: lint → test → build → security scan → deploy to staging → smoke test → promote to prod.
- IMPLEMENT blue-green or canary deployments for zero-downtime releases — never deploy directly to 100% traffic.
- STORE infrastructure as code (Terraform/Pulumi) — no manual cloud console changes in production environments.
- ENFORCE least-privilege IAM roles per service — no shared service accounts, no wildcard permissions.
- MONITOR with the RED method: Request rate, Error rate, Duration (latency percentiles p50/p95/p99) per service.`
    },
    {
      id: 'backend-arch',
      title: 'backend-architect',
      category: 'System Architecture',
      description: 'Scalable API architecture, high-performance databases, and microservices logic.',
      tags: ['API Design', 'Database', 'Microservices'],
      icon: 'server',
      isActive: false,
      color: '#1e293b',
      fullInstructions: `- DESIGN APIs contract-first: define the OpenAPI spec before writing any implementation code.
- VERSION APIs in the URL path (/v1/, /v2/) — never in headers for public APIs. Maintain backward compatibility for at least one major version.
- IMPLEMENT the repository pattern to decouple business logic from data storage — services should never query the DB directly.
- USE CQRS (Command Query Responsibility Segregation) for systems with heavy read/write asymmetry — separate read models from write models.
- CACHE at the right layer: CDN for static assets, Redis for session/computed data, DB query cache for slow repeated queries.
- DESIGN for idempotency in all write operations — clients will retry, and duplicate processing must be safe.
- USE async messaging (Kafka/RabbitMQ/SQS) to decouple services and absorb traffic spikes — never synchronous calls for non-critical paths.
- IMPLEMENT database connection pooling with explicit min/max pool sizes — never open unbounded connections.
- ADD correlation IDs to every request/response and propagate them through all service calls for distributed tracing.
- DESIGN pagination for all list endpoints: cursor-based pagination for large, frequently-updated datasets; offset-based for small static lists.
- IMPLEMENT Circuit Breakers and Retries with exponential backoff for all inter-service communication.
- DESIGN for observability: expose structured logs, metrics (Prometheus), and traces (OpenTelemetry) from every service.`
    },
    {
      id: 'embedded-systems',
      title: 'embedded-expert',
      category: 'System Architecture',
      description: 'Low-level firmware development, RTOS management, and hardware communication.',
      tags: ['C/C++', 'Firmware', 'IoT'],
      icon: 'circuit-board',
      isActive: false,
      color: '#b91c1c',
      fullInstructions: `- NEVER use dynamic memory allocation (malloc/free) in interrupt handlers or time-critical code paths — use static allocation or memory pools.
- DESIGN interrupt service routines (ISRs) to be as short as possible: set a flag or post to a queue, then handle in task context.
- APPLY MISRA-C guidelines for safety-critical embedded code: no implicit type conversions, no recursion, bounded loops.
- VALIDATE all hardware communication: implement timeout and retry logic for I2C/SPI/UART — assume buses can hang.
- USE volatile for variables shared between ISRs and main code — compiler optimization will break non-volatile shared state.
- IMPLEMENT watchdog timers in all production firmware — if the system hangs, it must recover autonomously.
- MINIMIZE power consumption: use sleep modes aggressively, reduce clock speed during idle, power-gate unused peripherals.
- TEST with real hardware AND simulation (QEMU, Renode) — hardware-only testing misses integration edge cases.
- VERSION firmware with semantic versioning stored in flash — bootloaders must validate firmware version and checksum before boot.`
    },
    {
      id: 'game-dev',
      title: 'game-developer',
      category: 'Mobile & Platforms',
      description: 'Game mechanics, physics optimization, and shader development (Unity/Unreal).',
      tags: ['Unity', 'Unreal', 'Shaders'],
      icon: 'game',
      isActive: false,
      color: '#7c3aed',
      fullInstructions: `- IMPLEMENT the game loop with fixed physics timestep (Update at fixed delta) and variable render rate — decouple physics from frame rate.
- USE an Entity-Component-System (ECS) architecture for large scenes: data-oriented design beats deep inheritance hierarchies for performance.
- PROFILE with engine-native tools (Unity Profiler, Unreal Insights) before optimizing — never guess where CPU/GPU time is spent.
- OPTIMIZE draw calls: batch static geometry, use GPU instancing for repeated meshes, atlas textures to reduce material switches.
- WRITE shaders with LOD in mind: full-quality for hero assets, simplified for distant or low-end hardware. Use shader variants, not if-statements.
- IMPLEMENT spatial partitioning (BVH, octree, spatial hash) for collision detection — brute-force O(n²) checks kill performance at scale.
- POOL game objects (bullets, particles, enemies) — instantiate/destroy cycles cause GC spikes. Pool everything that spawns frequently.
- DESIGN save systems with versioning: serialize game state to a versioned format that can be migrated forward across game updates.
- TARGET platforms explicitly: PC (uncapped FPS + quality presets), console (locked 60fps), mobile (30fps + aggressive LOD + battery budgets).`
    },
    {
      id: 'web3-blockchain',
      title: 'web3-expert',
      category: 'Mobile & Platforms',
      description: 'Smart contract development, security auditing, and decentralized application logic.',
      tags: ['Solidity', 'Smart Contracts', 'Web3.js'],
      icon: 'link-external',
      isActive: false,
      color: '#f59e0b',
      fullInstructions: `- APPLY Checks-Effects-Interactions pattern in every function: validate inputs, update state, then call external contracts — prevents reentrancy.
- USE OpenZeppelin audited contract libraries for standard functionality (ERC20, ERC721, AccessControl) — never reimplement security-critical code.
- OPTIMIZE gas: use calldata over memory for read-only function params, pack struct variables to fit in 32-byte slots, use events for historical data.
- AUDIT for: reentrancy, integer overflow (use SafeMath or Solidity 0.8+), access control bypass, front-running, oracle manipulation.
- NEVER store sensitive data on-chain — all on-chain data is public. Use zero-knowledge proofs or off-chain storage with on-chain commitment.
- IMPLEMENT multi-sig governance for contract admin functions — single-key admin is a centralization risk and single point of failure.
- WRITE comprehensive test suites with Hardhat/Foundry: unit tests, integration tests, and invariant/fuzz tests for all state-changing functions.
- DESIGN upgrade paths carefully: use proxy patterns (UUPS/Transparent) only when necessary — immutable contracts are safer when possible.
- PERFORM economic attack analysis: model game theory incentives to ensure honest behavior is always the most profitable strategy.`
    },
    {
      id: 'mlops-engineer',
      title: 'mlops-expert',
      category: 'AI & Intelligence',
      description: 'Model deployment pipelines, data versioning, and AI lifecycle monitoring.',
      tags: ['DVC', 'Model Deploy', 'Pipelines'],
      icon: 'pulse',
      isActive: false,
      color: '#14b8a6',
      fullInstructions: `- VERSION everything: data (DVC), code (Git), models (MLflow/W&B), and environments (Docker) — reproducibility requires all four to be pinned.
- BUILD training pipelines as DAGs (Airflow, Prefect, Kubeflow Pipelines) — not linear scripts. Each step must be independently rerunnable.
- IMPLEMENT data quality checks before every training run: schema validation, distribution drift detection, null/outlier thresholds.
- MONITOR models in production for data drift (input distribution shift) and concept drift (relationship between inputs and outputs changes).
- DESIGN serving infrastructure for latency SLAs: batch inference for throughput, real-time serving (Triton, TorchServe, vLLM) for low-latency.
- IMPLEMENT A/B testing and shadow mode for new model versions — never switch 100% traffic to an untested model.
- TRACK model lineage: for every deployed model, record the exact dataset version, hyperparameters, and evaluation metrics.
- DESIGN feature stores (Feast, Tecton) to share features between training and serving — eliminate training-serving skew.
- AUTOMATE model retraining triggers: schedule-based AND metric-based (performance degradation threshold).`
    },
    {
      id: 'file-reader',
      title: 'file-reading',
      category: 'Document & Data Engine',
      description: 'Intelligent file parsing router for various formats including images and data.',
      tags: ['File Upload', 'mnt/user-data/uploads/', 'Read File'],
      icon: 'files',
      isActive: false,
      color: '#10b981',
      fullInstructions: `- DETECT file type by MIME type and magic bytes, not just extension — extensions can be wrong or missing.
- ROUTE to the appropriate parser: PDF → pdf-reading skill, DOCX → docx skill, XLSX → xlsx skill, images → vision analysis, JSON/CSV → direct parse.
- EXTRACT content and return it as structured, typed data — not raw strings. Tables as 2D arrays, key-value as objects, lists as arrays.
- MAP all file paths to workspace-relative paths for consistent cross-platform handling.
- VALIDATE file size before processing: warn the user for files over 10MB, refuse processing for files over 50MB without explicit confirmation.
- HANDLE binary files gracefully: return file metadata and type description instead of attempting text extraction.
- CACHE parsed file content per session — don't re-parse the same file on every reference within a conversation.`
    },
    {
      id: 'anthropic-knowledge',
      title: 'product-self-knowledge',
      category: 'AI & Intelligence',
      description: 'Direct consultation of official Anthropic docs for real-time API and feature specs.',
      tags: ['Claude API', 'Claude Pricing', 'Claude Code'],
      icon: 'hubot',
      isActive: false,
      color: '#f59e0b',
      fullInstructions: `- CONSULT official Anthropic documentation (docs.anthropic.com) for all Claude API, model, and pricing questions — training data may be outdated.
- DIFFERENTIATE model tiers clearly: Haiku (fast/cheap) vs Sonnet (balanced) vs Opus (most capable) — match model to task requirements.
- KNOW the context window sizes, token limits, and pricing per model tier for accurate cost estimation.
- EXPLAIN Claude-specific features accurately: extended thinking, tool use, vision, system prompts, multi-turn conversations, batching.
- WARN when a requested feature may have changed since training cutoff — always verify against current docs for production implementations.
- COMPARE models for the specific use case: latency-sensitive apps need Haiku, complex reasoning needs Opus, most apps suit Sonnet.
- PROVIDE working API code examples using the official Anthropic Python SDK or TypeScript SDK, not raw HTTP.`
    },
    {
      id: 'refactor-pro',
      title: 'refactor-pro',
      category: 'Software Integrity',
      description: 'Transform messy code into clean, maintainable, SOLID-compliant implementations.',
      tags: ['Clean Code', 'SOLID', 'Design Patterns', 'Refactor'],
      icon: 'symbol-class',
      isActive: false,
      color: '#0ea5e9',
      fullInstructions: `- APPLY SOLID principles (Single Responsibility, Open/Closed, Liskov, Interface Segregation, Dependency Inversion) in every refactor.\n- ELIMINATE code smells: long methods, god classes, magic numbers, deep nesting, duplicate logic.\n- PREFER composition over inheritance. Favor small, focused functions with single clear responsibility.\n- APPLY appropriate design patterns (Factory, Strategy, Observer, Repository) where they reduce complexity.\n- ENSURE refactored code is functionally identical to original — never change behavior during refactor.\n- KEEP diffs minimal and incremental. Never refactor and add features simultaneously.`
    },
    {
      id: 'git-expert',
      title: 'git-expert',
      category: 'Strategy & Logic',
      description: 'Advanced Git workflows, branching strategies, and history management.',
      tags: ['Git', 'Branching', 'Rebase', 'Conflict Resolution'],
      icon: 'source-control',
      isActive: false,
      color: '#f97316',
      fullInstructions: `- USE conventional commits format: feat/fix/chore/docs/refactor/test/perf(scope): description.\n- PREFER rebase over merge for feature branches to maintain linear history.\n- RESOLVE conflicts by understanding both sides — never blindly accept ours/theirs.\n- APPLY Git worktrees for parallel work on multiple branches without stashing.\n- WRITE atomic commits: one logical change per commit, always passing tests.\n- USE interactive rebase (rebase -i) to squash, reorder, and clean history before merging.\n- NEVER force-push to shared/protected branches. Use --force-with-lease only on personal branches.`
    },
    {
      id: 'sql-expert',
      title: 'sql-expert',
      category: 'System Architecture',
      description: 'Advanced SQL query optimization, schema design, and database performance tuning.',
      tags: ['SQL', 'Query Optimization', 'Indexing', 'Schema Design'],
      icon: 'database',
      isActive: false,
      color: '#22c55e',
      fullInstructions: `- ANALYZE query execution plans (EXPLAIN/EXPLAIN ANALYZE) before optimizing.\n- DESIGN indexes based on actual query patterns — avoid over-indexing.\n- USE CTEs (WITH) for readability and window functions for analytical queries instead of subqueries.\n- APPLY proper normalization (3NF) for OLTP; consider denormalization for OLAP/reporting.\n- AVOID N+1 query patterns — always batch related queries or use JOINs.\n- USE transactions explicitly for multi-step writes. Always consider isolation levels.\n- NEVER use SELECT * in production code — always specify columns explicitly.`
    },
    {
      id: 'regex-master',
      title: 'regex-master',
      category: 'Strategy & Logic',
      description: 'Construct, explain, and optimize complex regular expressions across all flavors.',
      tags: ['Regex', 'Pattern Matching', 'Text Parsing'],
      icon: 'symbol-keyword',
      isActive: false,
      color: '#a855f7',
      fullInstructions: `- BREAK complex patterns into named groups (?<name>...) for readability.\n- EXPLAIN every non-trivial pattern with inline comments or step-by-step breakdown.\n- USE non-capturing groups (?:...) when you don't need the captured value.\n- PREFER possessive quantifiers or atomic groups to avoid catastrophic backtracking.\n- ALWAYS test regex against edge cases: empty strings, Unicode, special characters, multiline input.\n- SPECIFY the correct flags: case-insensitive (i), multiline (m), dotAll (s), global (g), unicode (u).\n- WARN when a simpler string method (split, indexOf, startsWith) would be more appropriate.`
    },
    {
      id: 'api-tester',
      title: 'api-tester',
      category: 'Software Integrity',
      description: 'Systematic REST and GraphQL API testing, edge case coverage, and contract validation.',
      tags: ['REST', 'GraphQL', 'API Testing', 'Edge Cases'],
      icon: 'plug',
      isActive: false,
      color: '#06b6d4',
      fullInstructions: `- TEST all HTTP status code scenarios: 200, 201, 400, 401, 403, 404, 409, 422, 429, 500.\n- VALIDATE response schema, not just status codes — check field types, nullability, and required fields.\n- TEST boundary conditions: empty arrays, null fields, max-length strings, zero values, negative numbers.\n- VERIFY idempotency for PUT/PATCH/DELETE endpoints.\n- TEST rate limiting behavior and retry-after headers.\n- SIMULATE network failures: timeouts, partial responses, connection resets.\n- FOR GraphQL: test query depth limits, N+1 resolver patterns, and error handling in partial responses.`
    },
    {
      id: 'debug-expert',
      title: 'debug-expert',
      category: 'Software Integrity',
      description: 'Systematic root cause analysis and debugging strategy for complex software issues.',
      tags: ['Debugging', 'Root Cause', 'Profiling', 'Tracing'],
      icon: 'debug',
      isActive: false,
      color: '#ef4444',
      fullInstructions: `- FOLLOW scientific method: reproduce consistently, isolate variables, form hypothesis, test.\n- NARROW scope with binary search — eliminate half the codebase per step.\n- READ error messages fully and literally before assuming the cause.\n- CHECK recent changes first (git log/diff) before deep-diving into older code.\n- ADD minimal targeted logging/breakpoints — never scatter random debug statements.\n- DISTINGUISH between symptoms and root causes — fix the cause, not the symptom.\n- VERIFY fix by reproducing the original bug scenario, not just running the happy path.\n- DOCUMENT findings: what the bug was, why it happened, and what the fix does.`
    },
    {
      id: 'code-reviewer',
      title: 'code-reviewer',
      category: 'Software Integrity',
      description: 'Thorough, constructive code review focusing on correctness, security, and maintainability.',
      tags: ['PR Review', 'Code Quality', 'Feedback', 'Best Practices'],
      icon: 'eye',
      isActive: false,
      color: '#64748b',
      fullInstructions: `- PRIORITIZE feedback by severity: bugs/security > correctness > performance > style.\n- ALWAYS explain WHY a change is needed, not just what to change.\n- DISTINGUISH blocking issues from suggestions — use "nit:" prefix for non-blocking style comments.\n- CHECK for: missing error handling, unclosed resources, race conditions, SQL injection, XSS vectors.\n- VERIFY tests cover the new code paths and edge cases, not just the happy path.\n- PRAISE good patterns and clever solutions — code review is bidirectional learning.\n- NEVER review more than 400 lines at once — request smaller PRs if needed.\n- FOCUS on the code, never on the author — keep all feedback technical and impersonal.`
    },
    {
      id: 'prompt-engineer',
      title: 'prompt-engineer',
      category: 'AI & Intelligence',
      description: 'Craft precise, effective prompts for LLMs to maximize output quality and consistency.',
      tags: ['Prompting', 'LLM', 'Chain-of-Thought', 'Few-Shot'],
      icon: 'comment-discussion',
      isActive: false,
      color: '#8b5cf6',
      fullInstructions: `- DEFINE role, context, task, output format, and constraints in every system prompt.\n- USE chain-of-thought (think step by step) for reasoning-heavy tasks.\n- PROVIDE few-shot examples when the output format is non-trivial or ambiguous.\n- CONSTRAIN output format explicitly: JSON schema, markdown structure, word limits.\n- TEST prompts against adversarial inputs — assume the model will try edge cases.\n- SEPARATE instructions from data using clear delimiters (XML tags, triple quotes, or code fences).\n- ITERATE systematically — change one variable per test run to isolate improvements.\n- DOCUMENT prompt versions and their performance like code — treat prompts as first-class artifacts.`
    },
    {
      id: 'css-master',
      title: 'css-master',
      category: 'Premium UI & Design',
      description: 'Deep CSS mastery: layouts, custom properties, cascade layers, and cutting-edge techniques.',
      tags: ['CSS', 'Grid', 'Flexbox', 'Custom Properties', 'Cascade'],
      icon: 'symbol-color',
      isActive: false,
      color: '#38bdf8',
      fullInstructions: `- USE CSS custom properties (variables) at :root for the full design token system: --color-*, --space-*, --radius-*, --shadow-*, --font-*.
- MASTER the cascade: use @layer to organize styles (reset, base, components, utilities, overrides) with explicit specificity control.
- APPLY fluid typography with clamp(): clamp(1rem, 2.5vw + 0.5rem, 1.5rem) — eliminate media query breakpoints for type.
- USE logical properties (margin-inline, padding-block) for internationalization and RTL support from day one.
- IMPLEMENT :has() selector for parent-state styling instead of JavaScript class toggling where possible.
- USE container queries (@container) for component-level responsiveness instead of viewport-only media queries.
- APPLY the @property rule for type-safe, animatable custom properties with proper syntax, inherits, and initial-value.
- LEVERAGE CSS Grid subgrid for aligning nested elements across parent grid tracks.
- USE :is() and :where() to reduce specificity bloat in complex selectors.
- NEVER use !important except in utility classes where it's intentional — it's a specificity debt sign.
- PREFER gap over margin for spacing in flex/grid contexts. Margin is for flow layout only.
- WRITE CSS that reads like documentation: group related properties, add comments for non-obvious choices.`
    },
    {
      id: 'animation-expert',
      title: 'animation-expert',
      category: 'Premium UI & Design',
      description: 'Craft fluid micro-interactions, page transitions, and physics-based animations that delight users.',
      tags: ['CSS Animation', 'Micro-interactions', 'GSAP', 'Framer Motion', 'Motion Design'],
      icon: 'zap',
      isActive: false,
      color: '#f43f5e',
      fullInstructions: `- FOLLOW the 12 principles of animation: squash & stretch, anticipation, follow-through, and easing are most critical for UI.
- USE cubic-bezier curves intentionally: ease-out for elements entering the screen, ease-in for exiting, ease-in-out for state changes.
- TARGET animation durations: micro-interactions 100-200ms, page transitions 250-400ms, complex sequences 400-600ms. Never exceed 700ms for interactive feedback.
- IMPLEMENT View Transitions API for native-feeling page transitions in SPAs and MPAs.
- USE CSS @keyframes with will-change: transform and opacity only — never animate layout-triggering properties (width, height, top, left).
- APPLY the FLIP technique (First, Last, Invert, Play) for performant layout animations.
- USE Framer Motion's layout prop and AnimatePresence for React component enter/exit animations.
- IMPLEMENT spring physics (stiffness, damping, mass) for natural-feeling interactions instead of linear easing.
- ALWAYS respect prefers-reduced-motion: wrap all non-essential animations in a media query check.
- CHAIN animations with AnimationTimeline or GSAP ScrollTrigger for scroll-driven storytelling.
- AVOID animating more than 2-3 properties simultaneously — it creates visual noise, not delight.`
    },
    {
      id: 'design-system-architect',
      title: 'design-system',
      category: 'Premium UI & Design',
      description: 'Architect scalable design systems with tokens, component libraries, and living documentation.',
      tags: ['Design Tokens', 'Component Library', 'Storybook', 'Figma Tokens', 'Style Dictionary'],
      icon: 'layers',
      isActive: false,
      color: '#7c3aed',
      fullInstructions: `- STRUCTURE tokens in 3 tiers: Primitive (raw values) → Semantic (purpose-driven aliases) → Component (specific usage).
- USE Style Dictionary or Theo to transform tokens from a single JSON source into CSS variables, JS objects, iOS Swift, Android XML.
- DEFINE component API contracts before implementation: props, variants, states, slots, and composition patterns.
- BUILD components at 4 levels: Base (unstyled, accessible) → Styled (design applied) → Composed (multi-component) → Page-level.
- DOCUMENT every component in Storybook with: description, props table, all variant stories, do/don't examples, and accessibility notes.
- ENFORCE the open/closed principle in components: open for extension via props/slots, closed for internal modification.
- VERSION the design system semantically: breaking changes = major, new components = minor, fixes = patch.
- MAINTAIN a decision log (ADR - Architecture Decision Records) for every non-obvious design or API decision.
- BUILD visual regression tests with Chromatic or Percy to catch unintended style changes in CI.
- DEFINE contribution guidelines: naming conventions, file structure, required stories, and review process.`
    },
    {
      id: 'color-theory-expert',
      title: 'color-theory',
      category: 'Premium UI & Design',
      description: 'Apply color theory, psychology, and accessibility to craft harmonious, expressive palettes.',
      tags: ['Color Palette', 'HSL', 'Contrast', 'Color Psychology', 'Dark Mode'],
      icon: 'paintcan',
      isActive: false,
      color: '#f59e0b',
      fullInstructions: `- WORK in HSL color space for intuitive adjustments: same hue, vary lightness for tints/shades, vary saturation for vibrancy.
- BUILD a 11-step palette (50-950) for each brand color using perceptual uniformity — not linear lightness steps.
- ENSURE WCAG AA contrast for all text: 4.5:1 for body text, 3:1 for large text (18px+ or 14px+ bold), 3:1 for UI components.
- USE the 60-30-10 rule: 60% neutral background, 30% secondary surface, 10% accent/brand color.
- DESIGN dark mode as a separate palette, not just inverted lightness — dark surfaces use low-saturation, slightly warm neutrals (#1a1a2e not #000000).
- APPLY color psychology purposefully: blue = trust/stability, green = success/growth, red = error/urgency, amber = warning/attention.
- AVOID pure black (#000000) and pure white (#ffffff) — use near-black (#0f172a) and near-white (#f8fafc) for softer, more premium feel.
- TEST palette under color blindness simulations (deuteranopia, protanopia) — never use color as the sole conveyor of meaning.
- CREATE semantic color aliases: --color-surface, --color-on-surface, --color-primary, --color-on-primary, --color-error, --color-success.
- USE oklch() for perceptually uniform colors in modern browsers — produces more consistent gradients than hsl().`
    },
    {
      id: 'creative-ui-pro',
      title: 'creative-ui',
      category: 'Premium UI & Design',
      description: 'Create visually stunning, award-worthy interfaces using advanced CSS and modern design trends.',
      tags: ['Glassmorphism', 'Neumorphism', 'Bento Grid', 'Aurora', 'Premium Design'],
      icon: 'star-full',
      isActive: false,
      color: '#e879f9',
      fullInstructions: `- THINK like a designer, not just a developer: before writing code, define the emotion the interface should evoke.
- IMPLEMENT Glassmorphism correctly: backdrop-filter: blur(12px) + semi-transparent background (rgba with 10-20% opacity) + subtle border (1px solid rgba(255,255,255,0.2)) + soft shadow.
- USE Bento Grid layouts for dashboard/landing pages: asymmetric grid with feature cards of varying sizes (1x1, 2x1, 1x2, 2x2).
- CREATE Aurora/gradient mesh backgrounds with radial-gradient blobs + mix-blend-mode for depth without images.
- APPLY noise texture overlay (SVG filter feTurbulence or CSS noise) at 3-8% opacity to add premium tactility to flat surfaces.
- IMPLEMENT glow effects with box-shadow layering: multiple shadows at different blur radii in the brand color.
- USE CSS @property with animation for smooth gradient transitions — gradients are not animatable without it.
- BUILD scroll-driven animations with animation-timeline: scroll() for parallax and reveal effects without JavaScript.
- APPLY text-gradient with background-clip: text for striking hero typography.
- CREATE depth with layered shadows: use 3-5 shadow layers at different blur/offset values instead of one heavy shadow.
- VALIDATE every "creative" decision against usability: if a user pauses to understand the UI, the creativity has failed.`
    },
    {
      id: 'rag-architect',
      title: 'rag-architect',
      category: 'AI & Intelligence',
      description: 'Architecting high-performance Retrieval-Augmented Generation systems with advanced chunking and hybrid search.',
      tags: ['RAG', 'Chunking', 'Embeddings', 'Semantic Search', 'Hybrid Search'],
      icon: 'brain',
      isActive: false,
      color: '#8b5cf6',
      fullInstructions: `- IMPLEMENT advanced chunking strategies: semantic chunking based on header structure, sliding windows with overlap, and recursive character splitting.
- DESIGN hybrid search architectures: combine dense vector retrieval (semantic) with sparse keyword search (BM25) using Reciprocal Rank Fusion (RRF).
- OPTIMIZE retrieval with re-ranking: use Cross-Encoders (like Cohere Rerank or BGE) to refine top-K results before passing to LLM.
- PREVENT hallucinations via citations: enforce that every claim in the response must map back to a specific retrieved chunk ID.
- MANAGE metadata filtering: implement strict pre-filtering (at the vector DB level) for tenant isolation, categories, or date ranges.
- EVALUATE RAG performance using RAGAS or TruLens: measure faithfulness, relevancy, and context precision.
- IMPLEMENT Small-to-Big retrieval: retrieve small parent chunks for accuracy but provide larger context window chunks to the LLM.`
    },
    {
      id: 'vector-db-expert',
      title: 'vector-db-expert',
      category: 'System Architecture',
      description: 'Optimization and management of high-scale vector databases for AI similarity search.',
      tags: ['Pinecone', 'Weaviate', 'Milvus', 'ChromaDB', 'Indexing'],
      icon: 'database',
      isActive: false,
      color: '#06b6d4',
      fullInstructions: `- CHOOSE the right index type: HNSW for low-latency/high-memory, IVF for high-compression/larger datasets.
- OPTIMIZE HNSW parameters: adjust M (max connections) and efConstruction (build-time accuracy) for the optimal trade-off between build speed and recall.
- IMPLEMENT Namespace isolation for multi-tenant applications — never mix tenant data in the same index without clear partitioning.
- USE scalar quantization (SQ) or product quantization (PQ) to reduce memory footprint by 4x-10x while maintaining >95% recall.
- MONITOR index freshness: handle upsert/delete lag and ensure indices are optimized after large batch operations.
- DESIGN efficient batching strategies: use parallel workers for upserts but respect API rate limits and connection pooling.`
    },
    {
      id: 'rust-systems',
      title: 'rust-systems',
      category: 'System Architecture',
      description: 'Memory-safe, high-performance systems development with zero-cost abstractions.',
      tags: ['Rust', 'Systems', 'WASM', 'High Performance', 'Memory Safety'],
      icon: 'shield',
      isActive: false,
      color: '#f97316',
      fullInstructions: `- ENFORCE strict ownership and borrowing: minimize use of .clone() and prefer references where possible.
- USE zero-cost abstractions: leverage traits, generics, and closures without runtime overhead.
- IMPLEMENT safe concurrency: utilize Send and Sync traits, Arc/Mutex/RwLock for shared state, and Rayon for data parallelism.
- MANAGE errors with Result and Option — avoid .unwrap() or .expect() in production code. Use the ? operator for propagation.
- OPTIMIZE for performance: profile with flamegraph, use jemalloc for high-allocation workloads, and minimize dynamic dispatch (dyn).
- DESIGN API crates with clear documentation and examples (doc tests) following the Rust API Guidelines.`
    },
    {
      id: 'advanced-typescript',
      title: 'advanced-typescript',
      category: 'System Architecture',
      description: 'Mastery of type systems, advanced generics, and sound architecture for large-scale TS apps.',
      tags: ['Type Gymnastics', 'Generics', 'Mapped Types', 'Conditional Types'],
      icon: 'symbol-interface',
      isActive: false,
      color: '#3178c6',
      fullInstructions: `- USE conditional types (T extends U ? X : Y) to build flexible, type-safe API responses.
- IMPLEMENT mapped types and template literal types for robust string manipulation and configuration objects.
- ENFORCE exhaustiveness checking in switch statements using the 'never' type.
- LEVERAGE Discriminated Unions for complex state management and payload handling.
- BUILD reusable utility types: DeepPartial, DeepReadonly, PickByType, and OmitByType for complex object manipulation.
- PREFER 'unknown' over 'any' for untrusted inputs — enforce validation at the boundary before casting.`
    },
    {
      id: 'ai-orchestration',
      title: 'ai-orchestrator',
      category: 'AI & Intelligence',
      description: 'Building autonomous multi-agent systems and complex LLM workflows.',
      tags: ['LangGraph', 'AutoGPT', 'Multi-agent', 'Workflows'],
      icon: 'workflow',
      isActive: false,
      color: '#10b981',
      fullInstructions: `- DESIGN stateful workflows: use graph-based state machines (like LangGraph) for multi-step agent interactions with feedback loops.
- IMPLEMENT tool-use (Function Calling) with strict validation and retry logic for agent-to-environment interactions.
- MANAGE agent hand-offs: define clear criteria for when one specialized agent should delegate to another.
- IMPLEMENT 'Human-in-the-loop' checkpoints for sensitive actions (e.g., file deletion, database writes).
- OPTIMIZE token usage: summarize long-running histories and use selective context injection (caching).
- MONITOR agent behavior: log thought chains, tool calls, and execution graphs for debugging and audit trails.`
    },
    {
      id: 'enterprise-i18n',
      title: 'enterprise-i18n',
      category: 'Standalone',
      description: 'Scaling localized applications with complex RTL support and cultural adaptation.',
      tags: ['i18n', 'L10n', 'RTL', 'Arabic', 'Multi-region'],
      icon: 'globe',
      isActive: false,
      color: '#6366f1',
      fullInstructions: `- DESIGN for RTL (Right-to-Left) from day one: use logical properties (margin-inline, padding-block) instead of physical ones.
- IMPLEMENT pluralization and gender-aware translations using ICU MessageFormat — never concatenate strings.
- MANAGE translation workflows: use TMS (Translation Management Systems) and automated pull requests for localized content.
- HANDLE dynamic content: ensure layouts accommodate 30-50% text expansion in certain languages (e.g., German, Arabic).
- OPTIMIZE font loading: use subsetted fonts for different character sets (Arabic, CJK) to reduce initial load time.
- VALIDATE locale formatting: dates, numbers, currencies, and address formats must be localized using Intl API.`
    },
    {
      id: 'database-tuning',
      title: 'db-tuner',
      category: 'Standalone',
      description: 'Deep performance optimization and scaling for relational databases (Postgres/MySQL).',
      tags: ['PostgreSQL', 'Query Plan', 'Vacuum', 'Indexing', 'Tuning'],
      icon: 'server-process',
      isActive: false,
      color: '#22c55e',
      fullInstructions: `- ANALYZE Wait Events: use pg_stat_activity and performance schema to identify bottlenecks (IO vs CPU vs Locks).
- OPTIMIZE Indexing: identify redundant indices and add covering indices to eliminate heap fetches (Index Only Scan).
- MANAGE Autovacuum (Postgres): tune scale factors and cost limits to prevent bloat without impacting performance.
- TUNE configuration: adjust shared_buffers, work_mem, and maintenance_work_mem based on workload (OLTP vs OLAP).
- IMPLEMENT connection pooling (PgBouncer/ProxySQL) to handle high-concurrency connections efficiently.
- MONITOR Query Performance: use pg_stat_statements to identify the top 1% of queries consuming 90% of resources.`
    },
    {
      id: 'stability-architect',
      title: 'stability-architect',
      category: 'Standalone',
      description: 'Ensure code integrity, prevent regressions, and maintain architectural consistency during modifications.',
      tags: ['Code Safety', 'Regression Prevention', 'Integrity'],
      icon: 'shield-check',
      isActive: false,
      color: '#10b981',
      fullInstructions: `- NEVER delete existing logic, functions, or utility calls unless explicitly requested or redundant.
- ENSURE all new functions are properly invoked/referenced in the appropriate lifecycle or execution paths.
- VERIFY imports and dependencies after modification to prevent "silent" breaks in functionality.
- PRESERVE existing architectural patterns and naming conventions to maintain codebase homogeneity.
- AUDIT the "before" state of a file before committing changes to ensure no unintended deletions occurred.
- VALIDATE that new features do not shadow or overwrite existing critical variables or state.`
    },
    {
      id: 'legacy-modernizer',
      title: 'legacy-modernizer',
      category: 'Standalone',
      description: 'Transform aging codebases into modern, type-safe, and performant implementations.',
      tags: ['Migration', 'Refactor', 'TypeScript Upgrade', 'Legacy Code'],
      icon: 'history',
      isActive: false,
      color: '#78350f',
      fullInstructions: `- ANALYZE legacy patterns: identify outdated APIs, class-based components, and untyped objects for modernization.
- IMPLEMENT incremental migration: move from JS to TS by adding types to boundaries first, then internals.
- REFACTOR Class-based components to Functional components with Hooks in React/Vue.
- UPDATE deprecated dependencies: identify breaking changes in package updates and apply necessary shims or code changes.
- ELIMINATE "Technical Debt": remove dead code, simplify complex conditionals, and introduce modern language features (ES6+).
- ENSURE functional parity: use unit tests to verify that the modernized code behaves exactly like the original.`
    },
    {
      id: 'docker-maestro',
      title: 'docker-maestro',
      category: 'Standalone',
      description: 'Architect high-performance container environments and robust orchestration logic.',
      tags: ['Docker', 'Kubernetes', 'CI/CD', 'Containers'],
      icon: 'package',
      isActive: false,
      color: '#2496ed',
      fullInstructions: `- DESIGN multi-stage builds: use separate stages for building and runtime to minimize image size and attack surface.
- IMPLEMENT optimized Dockerfiles: leverage layer caching, use non-root users, and minimize installed packages.
- ORCHESTRATE complex services: use Docker Compose for local development with proper networking, volumes, and health checks.
- MANAGE Kubernetes manifests: write clean, versioned YAML for Deployments, Services, Ingress, and ConfigMaps.
- CONFIGURE environment isolation: use secret managers and environment variables — never bake credentials into images.
- OPTIMIZE container performance: set CPU/Memory limits and use efficient base images like Alpine or Distroless.`
    },
    {
      id: 'threejs-wizard',
      title: 'threejs-wizard',
      category: 'Standalone',
      description: 'Create immersive 3D web experiences using WebGL and advanced rendering techniques.',
      tags: ['Three.js', 'WebGL', '3D Graphics', 'Shaders'],
      icon: 'circuit-board',
      isActive: false,
      color: '#000000',
      fullInstructions: `- OPTIMIZE the render loop: use requestAnimationFrame, minimize draw calls, and implement object pooling for dynamic scenes.
- MANAGE assets efficiently: use GLTF/GLB formats, implement texture compression, and lazy-load heavy 3D assets.
- CREATE custom shaders: write performant GLSL for special effects, lighting, and material transitions.
- IMPLEMENT responsive 3D: handle window resizing, pixel ratio adjustments, and mobile-specific performance optimizations.
- BUILD interactive environments: use Raycasting for mouse/touch interactions and implement smooth camera transitions (OrbitControls/Tweening).
- DEBUG with precision: use Spector.js or Three.js Inspector to identify bottlenecking geometries or materials.`
    },
    {
      id: 'accessibility-advocate',
      title: 'accessibility-advocate',
      category: 'Frontend Design',
      description: 'Ensure digital products are usable by everyone through WCAG 2.1 compliance and inclusive design.',
      tags: ['A11y', 'WCAG', 'ARIA', 'Inclusive Design'],
      icon: 'accessibility',
      isActive: false,
      color: '#4f46e5',
      fullInstructions: `- ENFORCE WCAG 2.1 AA standards: ensure 4.5:1 contrast ratios, proper heading hierarchy, and logical focus order.
- IMPLEMENT semantic HTML: use proper elements (<button>, <nav>, <main>) instead of generic <div> tags for better screen reader support.
- ENHANCE with ARIA: use aria-labels, aria-expanded, and live regions only when native HTML is insufficient.
- OPTIMIZE for Keyboard Navigation: ensure all interactive elements are focusable and have visible focus indicators.
- VALIDATE with tools: run automated audits (Lighthouse/axe-core) and perform manual screen reader testing (NVDA/VoiceOver).
- DESIGN for diverse needs: support high-contrast modes, reduced motion preferences, and large font sizes.`
    },
    {
      id: 'state-architect',
      title: 'state-architect',
      category: 'Standalone',
      description: 'Design scalable, maintainable state management systems for complex frontend applications.',
      tags: ['Redux', 'Zustand', 'Context API', 'State Management'],
      icon: 'split-horizontal',
      isActive: false,
      color: '#7c3aed',
      fullInstructions: `- DESIGN normalized state: store data in flat structures to simplify updates and prevent redundant synchronization.
- MINIMIZE re-renders: use selectors (reselect) and memoization to ensure components only update when relevant state changes.
- IMPLEMENT unidirectional data flow: ensure all state mutations happen through explicit actions/reducers to maintain predictability.
- SEPARATE concerns: distinguish between Global UI state, Server-cached data (React Query), and Local component state.
- ARCHITECT for scale: use slices or modular store patterns to keep state management logic maintainable as the app grows.
- DEBUG effectively: leverage DevTools for time-travel debugging and state snapshot analysis.`
    },
    {
      id: 'algorithm-strategist',
      title: 'algorithm-strategist',
      category: 'Strategy & Logic',
      description: 'Optimize performance through advanced data structures and algorithmic efficiency.',
      tags: ['Big O', 'Data Structures', 'Performance', 'Complexity'],
      icon: 'symbol-method',
      isActive: false,
      color: '#1e40af',
      fullInstructions: `- ANALYZE computational complexity: always calculate Big O (Time & Space) for critical logic paths.
- SELECT optimal data structures: use Maps for O(1) lookups, Sets for unique collections, and Trees/Graphs when hierarchal relationships exist.
- OPTIMIZE loops: eliminate nested loops where possible by using hash maps or two-pointer techniques.
- IMPLEMENT memoization: cache results of expensive recursive functions to avoid redundant calculations.
- REFACTOR for efficiency: replace brute-force solutions with divide-and-conquer or dynamic programming strategies when appropriate.
- BENCHMARK execution: use performance.now() or console.time() to verify that the optimized algorithm is actually faster.`
    },
    {
      id: 'unit-test-guardian',
      title: 'unit-test-guardian',
      category: 'Standalone',
      description: 'Write bulletproof tests that document behavior and prevent regressions.',
      tags: ['Testing', 'Vitest', 'Jest', 'Edge Cases'],
      icon: 'shield',
      isActive: false,
      color: '#047857',
      fullInstructions: `- TEST the edges: prioritize tests for null inputs, empty arrays, maximum values, and network failures.
- DOCUMENT through testing: write test descriptions that explain exactly what the behavior should be, not how it's implemented.
- USE the AAA pattern: ensure every test clearly separates Arrange, Act, and Assert stages.
- IMPLEMENT effective mocks: mock external dependencies strictly at the boundary to keep tests fast and isolated.
- ENSURE deterministic tests: avoid dependencies on current time, random numbers, or external file systems.
- REPRODUCE before fixing: always write a failing test that captures a bug before implementing the fix.`
    },
    {
      id: 'seo-engineer',
      title: 'seo-engineer',
      category: 'Standalone',
      description: 'Optimize technical SEO, metadata, and semantic structure for maximum search visibility.',
      tags: ['SEO', 'Semantic HTML', 'Meta Tags', 'JSON-LD'],
      icon: 'search',
      isActive: false,
      color: '#ea580c',
      fullInstructions: `- ENFORCE Semantic HTML: use <main>, <article>, <section>, and <header> correctly to provide document structure to crawlers.
- OPTIMIZE Metadata: ensure unique, keyword-rich <title> and <meta name="description"> tags for every page.
- IMPLEMENT Structured Data: use JSON-LD to provide rich snippets for articles, products, breadcrumbs, and organizations.
- MONITOR Core Web Vitals: prioritize LCP, FID, and CLS by optimizing images, fonts, and scripts.
- MANAGE robots & sitemaps: ensure correct robots.txt directives and automated sitemap generation for dynamic routes.
- DESIGN for Mobile-First: verify that all layouts and interactive elements are optimized for mobile indexing.`
    },
    {
      id: 'storybook-master',
      title: 'storybook-master',
      category: 'Standalone',
      description: 'Architect living component libraries with comprehensive documentation and visual testing.',
      tags: ['Storybook', 'Documentation', 'UI Library', 'Visual Testing'],
      icon: 'layers',
      isActive: false,
      color: '#ff4785',
      fullInstructions: `- DOCUMENT every variant: create stories for all states (default, hover, active, loading, disabled, error).
- DEFINE clear Prop contracts: use ArgTypes to document every prop with descriptions, types, and default values.
- IMPLEMENT accessibility checks: use the @storybook/addon-a11y to audit components during development.
- STRUCTURE the library: group components logically (Atoms, Molecules, Organisms) using the Atomic Design methodology.
- UTILIZE decorators: use decorators to provide theme, routing, and state context to isolated components.
- ENABLE interaction testing: use play functions to automate user interactions within stories.`
    },
    {
      id: 'cyber-compliance-auditor',
      title: 'cyber-compliance-auditor',
      category: 'Cloud & Security',
      description: 'Ensure code complies with global security standards like OWASP Top 10 and GDPR.',
      tags: ['Security', 'Compliance', 'GDPR', 'OWASP'],
      icon: 'lock',
      isActive: false,
      color: '#dc2626',
      fullInstructions: `- AUDIT against OWASP: identify and fix common vulnerabilities like SQL injection, XSS, and broken access control.
- ENFORCE Data Privacy: implement strict field-level encryption for sensitive user data (PII) as per GDPR/HIPAA.
- SECURE API Headers: implement Content-Security-Policy (CSP), HSTS, and X-Frame-Options to protect against browser-based attacks.
- VALIDATE supply chain: audit third-party dependencies for known vulnerabilities and licenses using npm-audit or Snyk.
- IMPLEMENT Least Privilege: ensure that service accounts and tokens have only the minimum necessary permissions.
- LOG for Auditing: maintain immutable logs of security-sensitive operations (logins, permission changes, sensitive data access).`
    }
  ];

  constructor(private context: vscode.ExtensionContext) {
    // Initial state loading moved to loadState() called during activation
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
    if (!vscode.workspace.workspaceFolders || vscode.workspace.workspaceFolders.length === 0) {
      return;
    }

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

      // --- Build the persistent system instruction content ---
      const skillNames = activeSkills.map(s => s.title.toUpperCase()).join(', ');
      const persistentHeader = activeSkills.length > 0
        ? [
            `# AGENT ASSISTANT — ACTIVE EXPERT SKILLS`,
            ``,
            `> CRITICAL SYSTEM INSTRUCTION: You MUST follow ALL guidelines below for EVERY message in this conversation.`,
            `> Do NOT forget these instructions after the first response. They apply to the ENTIRE session.`,
            `> Active Skills: ${skillNames}`,
            ``,
          ].join('\n')
        : '';

      let mdContent = persistentHeader;
      let xmlContent = '<available_skills>\n';
      let compactInstructions = ''; // For injection into settings/chat instructions

      if (activeSkills.length > 0) {
        mdContent += `## Expert Skill Guidelines\n\n`;

        for (const skill of activeSkills) {
          const skillDir = vscode.Uri.joinPath(skillsFolder, skill.id);
          const skillMdFile = vscode.Uri.joinPath(skillDir, 'SKILL.md');
          await vscode.workspace.fs.createDirectory(skillDir);

          const skillMdContent = `# Skill: ${skill.title}\n\n` +
            `## Instructions\n${skill.fullInstructions}\n\n` +
            `## Triggers\n${skill.tags.map(t => `- ${t}`).join('\n')}\n`;

          await vscode.workspace.fs.writeFile(skillMdFile, Buffer.from(skillMdContent, 'utf8'));

          // Build Universal Markdown
          mdContent += `### ${skill.title.toUpperCase()} (${skill.category})\n`;
          mdContent += `**Role**: ${skill.description}\n`;
          mdContent += `**Guidelines**:\n${skill.fullInstructions}\n`;
          mdContent += `---\n\n`;

          // Compact version for settings injection
          compactInstructions += `[${skill.title.toUpperCase()}]: ${skill.fullInstructions.trim()} `;

          // Keep Anthropic XML for backward compatibility
          xmlContent += '  <skill>\n';
          xmlContent += `    <name>${skill.id}</name>\n`;
          xmlContent += `    <description>${skill.description}</description>\n`;
          xmlContent += `    <location>${skillMdFile.fsPath}</location>\n`;
          xmlContent += '  </skill>\n';
        }
      } else {
        mdContent += `No specialized skills currently active. Operating in standard assistant mode.\n`;
      }

      xmlContent += '</available_skills>';

      // --- Write .antigravity internal files ---
      await vscode.workspace.fs.writeFile(universalFile, Buffer.from(mdContent, 'utf8'));
      await vscode.workspace.fs.writeFile(anthropicFile, Buffer.from(xmlContent, 'utf8'));

      // ============================================================
      // LAYER 1: .github/copilot-instructions.md (Gemini / Copilot)
      // This is the OFFICIAL file that VS Code Copilot Chat and
      // Gemini Code Assist read automatically on EVERY prompt.
      // ============================================================
      const githubDir = vscode.Uri.joinPath(root, '.github');
      try { await vscode.workspace.fs.createDirectory(githubDir); } catch (e) { /* exists */ }
      const copilotInstructionsFile = vscode.Uri.joinPath(githubDir, 'copilot-instructions.md');
      await vscode.workspace.fs.writeFile(copilotInstructionsFile, Buffer.from(mdContent, 'utf8'));

      // ============================================================
      // LAYER 2: .vscode/settings.json — chat.instructions
      // Injected directly into VS Code's chat instructions array
      // so the agent sees them in its system prompt every time.
      // ============================================================
      await this.injectChatInstructions(root, activeSkills, compactInstructions);

      // ============================================================
      // LAYER 3: Cursor (.cursorrules)
      // ============================================================
      const cursorRulesFile = vscode.Uri.joinPath(root, '.cursorrules');
      await vscode.workspace.fs.writeFile(cursorRulesFile, Buffer.from(mdContent, 'utf8'));

      // ============================================================
      // LAYER 4: Claude Code + Antigravity (CLAUDE.md)
      // ============================================================
      const claudeMdFile = vscode.Uri.joinPath(root, 'CLAUDE.md');
      await vscode.workspace.fs.writeFile(claudeMdFile, Buffer.from(mdContent, 'utf8'));

      // ============================================================
      // LAYER 5: Antigravity IDE / Gemini (GEMINI.md)
      // Antigravity IDE reads: CLAUDE.md, GEMINI.md, .github/copilot-instructions.md
      // ============================================================
      const geminiMdFile = vscode.Uri.joinPath(root, 'GEMINI.md');
      await vscode.workspace.fs.writeFile(geminiMdFile, Buffer.from(mdContent, 'utf8'));

      // ============================================================
      // LAYER 6: Gemini Code Assist (.gemini/settings.json)
      // ============================================================
      const geminiDir = vscode.Uri.joinPath(root, '.gemini');
      try { await vscode.workspace.fs.createDirectory(geminiDir); } catch (e) { /* exists */ }
      const geminiStyleFile = vscode.Uri.joinPath(geminiDir, 'settings.json');
      const geminiSettings = JSON.stringify({
        codeAssist: {
          systemInstruction: activeSkills.length > 0
            ? `You have the following expert personas active. Follow their guidelines for EVERY response: ${compactInstructions.trim()}`
            : ''
        }
      }, null, 2);
      await vscode.workspace.fs.writeFile(geminiStyleFile, Buffer.from(geminiSettings, 'utf8'));

      const count = activeSkills.length;
      vscode.window.setStatusBarMessage(
        count > 0
          ? `$(zap) ${count} Expert Skill(s) synced to all AI agents`
          : `$(info) All skills deactivated — agents reset to default mode`,
        4000
      );
    } catch (err) {
      console.error('Failed to inject universal skills', err);
    }
  }

  /**
   * Inject active skill instructions into .vscode/settings.json
   * under the "github.copilot.chat.codeGeneration.instructions" key.
   * This ensures VS Code's built-in Copilot/Gemini chat reads them
   * as part of its system prompt on every single message.
   */
  private async injectChatInstructions(
    root: vscode.Uri,
    activeSkills: Skill[],
    compactInstructions: string
  ) {
    const vscodeDir = vscode.Uri.joinPath(root, '.vscode');
    const settingsFile = vscode.Uri.joinPath(vscodeDir, 'settings.json');

    try {
      try { await vscode.workspace.fs.createDirectory(vscodeDir); } catch (e) { /* exists */ }

      // Read existing settings if they exist
      let existingSettings: Record<string, any> = {};
      try {
        const raw = await vscode.workspace.fs.readFile(settingsFile);
        const text = Buffer.from(raw).toString('utf8');
        // Strip comments for JSON parse safety
        const stripped = text.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
        existingSettings = JSON.parse(stripped);
      } catch (e) { /* file doesn't exist or parse error, start fresh */ }

      // Build instruction entries
      const agentAssistantMarker = '[Agent Assistant]';
      
      // Remove any previous Agent Assistant entries
      const existingInstructions: any[] = existingSettings['github.copilot.chat.codeGeneration.instructions'] || [];
      const cleaned = existingInstructions.filter(
        (entry: any) => typeof entry === 'string'
          ? !entry.includes(agentAssistantMarker)
          : !(entry.text && entry.text.includes(agentAssistantMarker))
      );

      if (activeSkills.length > 0) {
        cleaned.push({
          text: `${agentAssistantMarker} PERSISTENT EXPERT INSTRUCTIONS — Apply these to EVERY response in this session: ${compactInstructions.trim()}`
        });
      }

      existingSettings['github.copilot.chat.codeGeneration.instructions'] = cleaned;

      const content = JSON.stringify(existingSettings, null, 2);
      await vscode.workspace.fs.writeFile(settingsFile, Buffer.from(content, 'utf8'));
    } catch (err) {
      console.error('Failed to inject chat instructions into .vscode/settings.json', err);
    }
  }

  private saveState() {
    const state = this.skills.reduce((acc, s) => {
      acc[s.id] = s.isActive;
      return acc;
    }, {} as Record<string, boolean>);
    this.context.globalState.update('antigravity.skills', state);

    // Save custom skills
    const customSkills = this.skills.filter(s => s.isCustom);
    this.context.globalState.update('antigravity.customSkills', customSkills);
  }

  public async loadState() {
    // Load custom skills
    const customSkills = this.context.globalState.get<Skill[]>('antigravity.customSkills') || [];
    this.skills = this.skills.filter(s => !s.isCustom);
    this.skills.push(...customSkills);


    const state = this.context.globalState.get<Record<string, boolean>>('antigravity.skills') || {};
    this.skills.forEach(s => {
      if (state[s.id] !== undefined) {
        s.isActive = state[s.id];
      }
    });
    // Sync instruction files on activation with previously saved state
    await this.injectSkillsToWorkspace();
  }

  public addCustomSkill(skill: Skill) {
    skill.isCustom = true;
    this.skills.push(skill);
    this.saveState();
    this.injectSkillsToWorkspace();
    this._onDidChangeSkills.fire();
  }

  public deleteCustomSkill(id: string) {
    this.skills = this.skills.filter(s => s.id !== id);
    this.saveState();
    this.injectSkillsToWorkspace();
    this._onDidChangeSkills.fire();
  }

}
