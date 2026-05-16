import * as vscode from 'vscode';
import { SkillService, Skill } from '../../features/skills/skill.service';

export class CustomSkillsTreeProvider implements vscode.TreeDataProvider<CustomSkillTreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<CustomSkillTreeItem | undefined | void> = new vscode.EventEmitter<CustomSkillTreeItem | undefined | void>();
  readonly onDidChangeTreeData: vscode.Event<CustomSkillTreeItem | undefined | void> = this._onDidChangeTreeData.event;

  constructor(private skillService: SkillService) {
    skillService.onDidChangeSkills(() => this.refresh());
  }

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: CustomSkillTreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: CustomSkillTreeItem): Thenable<CustomSkillTreeItem[]> {
    if (element) {
      return Promise.resolve([]);
    }

    const customSkills = this.skillService.getSkills().filter(skill => skill.isCustom);
    
    return Promise.resolve(customSkills.map(skill => new CustomSkillTreeItem(skill)));
  }
}

export class CustomSkillTreeItem extends vscode.TreeItem {
  constructor(public readonly skill: Skill) {
    super(skill.title, vscode.TreeItemCollapsibleState.None);

    this.tooltip = `${skill.category}: ${skill.description}`;
    this.description = skill.isActive ? 'ACTIVE' : '';
    
    this.iconPath = new vscode.ThemeIcon(
      skill.isActive ? 'pass-filled' : 'person',
      new vscode.ThemeColor(skill.isActive ? 'charts.green' : 'disabledForeground')
    );

    this.contextValue = 'customSkillItem';
    
    // Clicking the item toggles it
    this.command = {
      command: 'agent-assistant.toggleSkillSidebar',
      title: 'Toggle Skill',
      arguments: [skill.id]
    };
  }
}
