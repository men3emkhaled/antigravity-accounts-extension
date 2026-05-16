import * as vscode from 'vscode';
import { SkillService } from '../../features/skills/skill.service';

export class SkillBuilderWebview {
  public static currentPanel: SkillBuilderWebview | undefined;
  public static readonly viewType = 'skillBuilder';

  private readonly _panel: vscode.WebviewPanel;
  private _disposables: vscode.Disposable[] = [];

  public static createOrShow(extensionUri: vscode.Uri, skillService: SkillService) {
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;

    if (SkillBuilderWebview.currentPanel) {
      SkillBuilderWebview.currentPanel._panel.reveal(column);
      return;
    }

    const panel = vscode.window.createWebviewPanel(
      SkillBuilderWebview.viewType,
      'Create Custom Skill',
      column || vscode.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [extensionUri]
      }
    );

    SkillBuilderWebview.currentPanel = new SkillBuilderWebview(panel, skillService);
  }

  private constructor(panel: vscode.WebviewPanel, private skillService: SkillService) {
    this._panel = panel;
    this._panel.webview.html = this._getHtmlForWebview();

    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

    this._panel.webview.onDidReceiveMessage(
      async message => {
        switch (message.command) {
          case 'saveSkill':
            const { title, category, description, fullInstructions } = message.data;
            if (!title || !fullInstructions) {
              vscode.window.showErrorMessage('Title and Instructions are required.');
              return;
            }

            const newSkill = {
              id: 'custom-' + Date.now().toString(),
              title,
              category: category || 'Custom',
              description: description || 'User-defined custom skill.',
              tags: ['Custom'],
              icon: 'person',
              isActive: false,
              color: '#8b5cf6', // purple indicator for custom
              fullInstructions,
              isCustom: true
            };

            this.skillService.addCustomSkill(newSkill);
            vscode.window.showInformationMessage(`Custom Skill "${title}" saved successfully!`);
            this._panel.dispose();
            return;
        }
      },
      null,
      this._disposables
    );
  }

  public dispose() {
    SkillBuilderWebview.currentPanel = undefined;
    this._panel.dispose();
    while (this._disposables.length) {
      const x = this._disposables.pop();
      if (x) {
        x.dispose();
      }
    }
  }

  private _getHtmlForWebview(): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Create Custom Skill</title>
    <style>
        :root {
            --bg: var(--vscode-editor-background);
            --fg: var(--vscode-editor-foreground);
            --border: var(--vscode-panel-border);
            --primary: var(--vscode-button-background);
            --primary-hover: var(--vscode-button-hoverBackground);
            --primary-fg: var(--vscode-button-foreground);
            --input-bg: var(--vscode-input-background);
            --input-fg: var(--vscode-input-foreground);
            --input-border: var(--vscode-input-border);
        }
        body {
            font-family: var(--vscode-font-family);
            background-color: var(--bg);
            color: var(--fg);
            padding: 20px;
            max-width: 800px;
            margin: 0 auto;
        }
        h1 {
            font-weight: 600;
            margin-bottom: 24px;
            border-bottom: 1px solid var(--border);
            padding-bottom: 10px;
        }
        .form-group {
            margin-bottom: 16px;
        }
        label {
            display: block;
            margin-bottom: 6px;
            font-weight: 600;
            font-size: 13px;
        }
        input, textarea, select {
            width: 100%;
            padding: 8px;
            background-color: var(--input-bg);
            color: var(--input-fg);
            border: 1px solid var(--input-border);
            border-radius: 4px;
            font-family: inherit;
            box-sizing: border-box;
        }
        input:focus, textarea:focus, select:focus {
            outline: 1px solid var(--primary);
            border-color: var(--primary);
        }
        textarea {
            resize: vertical;
            min-height: 200px;
            font-family: var(--vscode-editor-font-family);
        }
        .btn-save {
            background-color: var(--primary);
            color: var(--primary-fg);
            border: none;
            padding: 10px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 600;
            font-size: 14px;
            margin-top: 10px;
        }
        .btn-save:hover {
            background-color: var(--primary-hover);
        }
        .help-text {
            font-size: 11px;
            opacity: 0.7;
            margin-top: 4px;
        }
    </style>
</head>
<body>
    <h1>Create Custom Skill</h1>
    <form id="skillForm">
        <div class="form-group">
            <label for="title">Skill Title *</label>
            <input type="text" id="title" required placeholder="e.g. My React Rules">
        </div>
        <div class="form-group">
            <label for="category">Category</label>
            <select id="category">
                <option value="Premium UI & Design">Premium UI & Design</option>
                <option value="System Architecture">System Architecture</option>
                <option value="Cloud & Security">Cloud & Security</option>
                <option value="AI & Intelligence">AI & Intelligence</option>
                <option value="Document & Data Engine">Document & Data Engine</option>
                <option value="Software Integrity">Software Integrity</option>
                <option value="Mobile & Platforms">Mobile & Platforms</option>
                <option value="Strategy & Logic">Strategy & Logic</option>
                <option value="Persona & Tone">Persona & Tone</option>
                <option value="Standalone">Standalone (Top Level)</option>
            </select>
        </div>
        <div class="form-group">
            <label for="description">Short Description</label>
            <input type="text" id="description" placeholder="Brief summary of what this skill does">
        </div>
        <div class="form-group">
            <label for="instructions">Full Instructions (Markdown) *</label>
            <textarea id="instructions" required placeholder="- RULE 1: Do this...\n- RULE 2: Never do that..."></textarea>
            <div class="help-text">These instructions will be strictly followed by the AI when this skill is active.</div>
        </div>
        <button type="submit" class="btn-save">Save Skill</button>
    </form>

    <script>
        const vscode = acquireVsCodeApi();
        document.getElementById('skillForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const title = document.getElementById('title').value;
            const category = document.getElementById('category').value;
            const description = document.getElementById('description').value;
            const fullInstructions = document.getElementById('instructions').value;

            vscode.postMessage({
                command: 'saveSkill',
                data: { title, category, description, fullInstructions }
            });
        });
    </script>
</body>
</html>`;
  }
}
