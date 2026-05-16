# Changelog

All notable changes to the Agent Assistant ecosystem are documented here. This project strictly follows [Semantic Versioning](https://semver.org/) for transparent and reliable updates.

---

## [1.0.5] - 2026-05-16
### Expert Skills Categorization & UI Overhaul
- **Skill Folders**: Introduced a hierarchical tree view for Expert Skills, organizing 60+ skills into 9 premium categories (e.g., Premium UI & Design, System Architecture).
- **Frontend Design Library**: Restored 10 individual high-fidelity design system skills (Apple HIG, Uber, Material 3, etc.) as standalone selectable entities within the UI folder.
- **RTL Support**: Renamed and prioritized "arabic-rtl for chat", pinning it to the absolute top of the sidebar for instant access.
- **Custom Skill Builder 2.0**: Upgraded the builder with a category selection dropdown, ensuring new skills are perfectly integrated into the folder structure.
- **Dynamic Sync**: Fixed real-time synchronization between Custom Skills management and the Expert Skills sidebar.

## [1.0.3] - 2026-05-14
### Major Skill Library Expansion
- Added 13 new skills: refactor-pro, git-expert, sql-expert, regex-master, api-tester, debug-expert, code-reviewer, prompt-engineer, css-master, animation-expert, design-system, color-theory, creative-ui.
- Upgraded all existing skills with deep, opinionated, actionable instructions replacing generic 3-4 line stubs.
- GEMINI.md injection layer: Antigravity IDE now reads skill instructions directly from workspace root.
- Updated injection pipeline to 6 layers: GEMINI.md, CLAUDE.md, .cursorrules, .github/copilot-instructions.md, .vscode/settings.json, .gemini/settings.json.
- Full README rewrite to document the 30+ skill library, injection mechanism, and updated installation instructions.
- Updated LICENSE copyright holder to men3emkhaled.

## [1.0.1] - 2026-05-13
### Human Persona Optimization
- Strengthened Human Persona: Implemented strict constraints to eliminate AI artifacts, emojis, and redundant conversational fillers.
- Metadata Cleanup: Removed emojis from README and documentation to maintain a professional, senior-developer identity.

## [1.0.0] - 2026-05-13
### Evolution into Agent Assistant
- Complete Rebranding: Transitioned from Antigravity Hub to the new Agent Assistant identity.
- Unified Sidepanel Architecture: Integrated all management features into a native VS Code sidebar for a zero-latency experience.
- Universal Skill Engine: Implemented a model-agnostic injection system compatible with GPT-4, Claude 3.5, Gemini 1.5, and Llama 3.
- Expert Instruction Sets: Injected deep technical knowledge and expert constraints directly into AI agent workspaces using the official Anthropic Skill Specification.

### New Expert Personas
- Security Shield: Enforces strict security protocols, prevents API key leakage, and audits code for vulnerabilities.
- Human Persona: Mimics professional senior developer communication, eliminating AI artifacts and redundant fillers.
- UI/UX Architect: Directs agents to build modern, accessible, and high-performance web interfaces.
- QA & Automation Lead: Expert-level testing strategies using Playwright, Jest, and Vitest.
- Performance Core: Focuses on algorithmic efficiency, memory optimization, and high-speed execution.

### Professional Quota Management
- Sync Engine v2: Enhanced multi-account synchronization with encrypted state management.
- Real-time Balance Dashboard: Glassmorphism UI providing high-visibility metrics for all major LLM providers.
- One-Click Account Swapping: Instant session injection to switch between development environments without friction.

---

## [0.1.2] - 2026-05-10
### Added
- Visual Identity: Integrated user profile pictures for active accounts.
- Performance: Optimized background sync to reduce CPU overhead during heavy polling.

## [0.1.1] - 2026-05-09
### Foundations
- Initial development of the account synchronization engine.
- Bi-lingual localization framework (Arabic/English).
- Secure credential handling using VS Code globalState.

---
*Maintained with precision by men3em*
