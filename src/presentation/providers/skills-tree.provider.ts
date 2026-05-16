import * as vscode from 'vscode';
import { SkillService, Skill } from '../../features/skills/skill.service';

export class SkillsTreeProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
  private filterQuery: string = '';
  private _onDidChangeTreeData: vscode.EventEmitter<vscode.TreeItem | undefined | void> = new vscode.EventEmitter<vscode.TreeItem | undefined | void>();
  readonly onDidChangeTreeData: vscode.Event<vscode.TreeItem | undefined | void> = this._onDidChangeTreeData.event;

  constructor(private skillService: SkillService) {
    skillService.onDidChangeSkills(() => this.refresh());
  }

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  setFilter(query: string): void {
    this.filterQuery = query.toLowerCase();
    this.refresh();
  }

  getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: vscode.TreeItem): Thenable<vscode.TreeItem[]> {
    let skills = this.skillService.getSkills();
    
    if (this.filterQuery) {
      skills = skills.filter(skill => 
        skill.title.toLowerCase().includes(this.filterQuery) || 
        skill.category.toLowerCase().includes(this.filterQuery) ||
        skill.description.toLowerCase().includes(this.filterQuery) ||
        skill.tags.some(tag => tag.toLowerCase().includes(this.filterQuery))
      );
      return Promise.resolve(skills.map(skill => new SkillTreeItem(skill)));
    }

    if (element) {
      if (element instanceof CategoryTreeItem) {
        const categorySkills = skills.filter(s => s.category === element.categoryName);
        return Promise.resolve(categorySkills.map(skill => new SkillTreeItem(skill)));
      }
      return Promise.resolve([]);
    }

    // Root level
    const groups = new Map<string, Skill[]>();
    const standalone: Skill[] = [];

    skills.forEach(skill => {
      if (!skill.category || skill.category.toLowerCase() === 'standalone') {
        standalone.push(skill);
      } else {
        if (!groups.has(skill.category)) {
          groups.set(skill.category, []);
        }
        groups.get(skill.category)!.push(skill);
      }
    });

    const items: vscode.TreeItem[] = [];
    
    for (const [category, groupSkills] of groups.entries()) {
      const activeCount = groupSkills.filter(s => s.isActive).length;
      items.push(new CategoryTreeItem(category, groupSkills.length, activeCount));
    }

    standalone.forEach(skill => {
      items.push(new SkillTreeItem(skill));
    });

    items.sort((a, b) => {
      // arabic-localization always at the very top
      if (a instanceof SkillTreeItem && a.skill.id === 'arabic-localization') return -1;
      if (b instanceof SkillTreeItem && b.skill.id === 'arabic-localization') return 1;
      
      if (a instanceof CategoryTreeItem && b instanceof SkillTreeItem) return -1;
      if (a instanceof SkillTreeItem && b instanceof CategoryTreeItem) return 1;
      return a.label!.toString().localeCompare(b.label!.toString());
    });

    return Promise.resolve(items);
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

export class CategoryTreeItem extends vscode.TreeItem {
  constructor(public readonly categoryName: string, count: number, activeCount: number) {
    super(categoryName, vscode.TreeItemCollapsibleState.Collapsed);
    this.contextValue = 'categoryItem';
    this.description = activeCount > 0 ? `${activeCount}/${count} ACTIVE` : `${count} skills`;
    this.iconPath = new vscode.ThemeIcon('folder');
  }
}
