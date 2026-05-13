import * as vscode from 'vscode';
import { SkillService } from '../../features/skills/skill.service';

/**
 * PersonaDiagnosticProvider — High-Visibility AI Context Injection.
 * 
 * This provider creates a VS Code Diagnostic (Information level) at the top of 
 * every active file. AI agents proactively read diagnostics to understand the
 * context of the code they are working on. By injecting active persona details
 * here, we ensure the agent 'notices' the expert guidelines automatically.
 */
export class PersonaDiagnosticProvider {
  private diagnostics: vscode.DiagnosticCollection;

  constructor(
    private context: vscode.ExtensionContext,
    private skillService: SkillService
  ) {
    this.diagnostics = vscode.languages.createDiagnosticCollection('agent-assistant-persona');
    
    // Update when skills change
    this.context.subscriptions.push(
      this.skillService.onDidChangeSkills(() => this.updateAllDiagnostics())
    );

    // Update when the active editor changes
    this.context.subscriptions.push(
      vscode.window.onDidChangeActiveTextEditor(() => this.updateAllDiagnostics())
    );

    // Initial update
    this.updateAllDiagnostics();
  }

  private updateAllDiagnostics() {
    const activeSkills = this.skillService.getSkills().filter(s => s.isActive);
    const editor = vscode.window.activeTextEditor;

    // Clear previous diagnostics
    this.diagnostics.clear();

    if (!editor || activeSkills.length === 0) {
      return;
    }

    const doc = editor.document;
    const personaNames = activeSkills.map(s => s.title.toUpperCase()).join(', ');
    
    // Create a diagnostic message for the AI
    const message = `[AGENT ASSISTANT] ACTIVE PERSONAS: ${personaNames}. 
IMPORTANT: You MUST follow the expert guidelines in .antigravity/UNIVERSAL_AGENT_GUIDE.md or CLAUDE.md for this workspace.`;

    const diagnostic = new vscode.Diagnostic(
      new vscode.Range(0, 0, 0, 1), // First character of the file
      message,
      vscode.DiagnosticSeverity.Information
    );

    diagnostic.source = 'Agent Assistant';
    diagnostic.code = 'PERSONA_ACTIVE';

    this.diagnostics.set(doc.uri, [diagnostic]);
  }

  public dispose() {
    this.diagnostics.dispose();
  }
}
