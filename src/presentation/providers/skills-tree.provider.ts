import * as vscode from 'vscode';
import { SkillService, Skill } from '../../features/skills/skill.service';

export class SkillsTreeProvider implements vscode.TreeDataProvider<SkillTreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<SkillTreeItem | undefined | void> = new vscode.EventEmitter<SkillTreeItem | undefined | void>();
  readonly onDidChangeTreeData: vscode.Event<SkillTreeItem | undefined | void> = this._onDidChangeTreeData.event;

  constructor(private skillService: SkillService) {}

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: SkillTreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: SkillTreeItem): Thenable<SkillTreeItem[]> {
    if (element) return Promise.resolve([]);

    const skills = this.skillService.getSkills();
    return Promise.resolve(skills.map(skill => new SkillTreeItem(skill)));
  }
}

class SkillTreeItem extends vscode.TreeItem {
  constructor(public readonly skill: Skill) {
    super(skill.title, vscode.TreeItemCollapsibleState.None);

    this.tooltip = `${skill.category}: ${skill.description}`;
    this.description = skill.isActive ? 'ACTIVE' : '';
    
    // Use native codicons for simple, theme-adaptive look
    this.iconPath = new vscode.ThemeIcon(
      skill.isActive ? 'pass-filled' : 'circle-outline',
      new vscode.ThemeColor(skill.isActive ? 'charts.green' : 'disabledForeground')
    );

    this.contextValue = 'skillItem';
    
    // Clicking the item toggles it
    this.command = {
      command: 'agent-assistant.toggleSkillSidebar',
      title: 'Toggle Skill',
      arguments: [skill.id]
    };
  }
}
