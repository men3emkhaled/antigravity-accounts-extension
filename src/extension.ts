/**
 * Agent Assistant — VS Code Extension Entry Point
 */

import * as vscode from 'vscode';
import { Logger } from './core/utils/logger';
import { ExtensionConfig } from './core/config/extension.config';

import { AuthService } from './infrastructure/auth/auth.service';
import { BalanceService } from './infrastructure/api/balance.service';
import { AccountRepositoryImpl } from './infrastructure/storage/account.repository.impl';
import { StateDbService } from './infrastructure/storage/state-db.service';
import { AccountService } from './features/accounts/account.service';
import { StatusBarProvider } from './presentation/providers/status-bar.provider';
import { AccountsTreeProvider } from './presentation/providers/accounts-tree.provider';
import { AccountsPanelProvider } from './presentation/providers/accounts-panel.provider';
import { AccountsWebviewProvider } from './presentation/providers/accounts-webview.provider';
import { SkillService } from './features/skills/skill.service';
import { SkillsTreeProvider } from './presentation/providers/skills-tree.provider';

export async function activate(context: vscode.ExtensionContext): Promise<void> {
  const logger = Logger.getInstance();
  const skillService = new SkillService(context);
  logger.info('Agent Assistant is activating...');

  try {
    const config = ExtensionConfig.getInstance();
    config.initialize(context);

    // Initialize Domain Services
    const authService = new AuthService();
    const balanceService = new BalanceService();
    const accountRepo = new AccountRepositoryImpl(context);
    const stateDbService = new StateDbService(context);
    const accountService = new AccountService(authService, balanceService, accountRepo, stateDbService);
    accountService.startBackgroundMonitor();

    // Initialize UI Providers
    const statusBarProvider = new StatusBarProvider(accountRepo, accountService);
    context.subscriptions.push(statusBarProvider);

    const accountsTreeProvider = new AccountsTreeProvider(accountService, accountRepo);
    const treeView = vscode.window.createTreeView('agent-assistant.accountsView', {
      treeDataProvider: accountsTreeProvider,
      showCollapseAll: false
    });
    context.subscriptions.push(treeView);

    const skillsTreeProvider = new SkillsTreeProvider(skillService);
    vscode.window.registerTreeDataProvider('agent-assistant.skillsView', skillsTreeProvider);

    const panelProvider = new AccountsPanelProvider(context.extensionUri, accountRepo, accountService, skillService);
    const webviewProvider = new AccountsWebviewProvider(context.extensionUri, accountRepo, accountService);

    context.subscriptions.push(
      vscode.window.registerWebviewViewProvider(
        AccountsWebviewProvider.viewType,
        webviewProvider
      )
    );

    // Register Commands
    const commands = registerCommands(context, skillService, accountService, accountRepo, accountsTreeProvider, skillsTreeProvider, panelProvider);
    context.subscriptions.push(...commands);

    logger.info('Agent Assistant activated successfully.');
  } catch (error) {
    logger.error('Failed to activate Agent Assistant', error);
  }
}

export function deactivate(): void {
  const logger = Logger.getInstance();
  logger.info('Agent Assistant deactivated.');
}

function registerCommands(
  context: vscode.ExtensionContext,
  skillService: SkillService,
  accountService: AccountService,
  accountRepo: any,
  accountsTreeProvider: AccountsTreeProvider,
  skillsTreeProvider: SkillsTreeProvider,
  panelProvider: AccountsPanelProvider
): vscode.Disposable[] {
  const disposables: vscode.Disposable[] = [];

  disposables.push(
    vscode.commands.registerCommand('agent-assistant.openPanel', () => {
      panelProvider.show();
    })
  );

  disposables.push(
    vscode.commands.registerCommand('agent-assistant.treeSwitch', async (arg: any) => {
      const email = typeof arg === 'string' ? arg : arg?.email;
      if (email) {
        await accountService.switchAccountWorkflow(email);
        setTimeout(() => accountsTreeProvider.refresh(), 1000);
      }
    })
  );

  disposables.push(
    vscode.commands.registerCommand('agent-assistant.searchAccounts', async () => {
      const query = await vscode.window.showInputBox({
        placeHolder: 'Search accounts...',
        prompt: 'Filter Agent Assistant'
      });
      if (query !== undefined) {
        accountsTreeProvider.setFilter(query);
      }
    })
  );

  disposables.push(
    vscode.commands.registerCommand('agent-assistant.clearSearch', () => {
      accountsTreeProvider.setFilter('');
    })
  );

  disposables.push(
    vscode.commands.registerCommand('agent-assistant.treeDelete', async (arg: any) => {
      const email = typeof arg === 'string' ? arg : arg?.email;
      if (email) {
        const confirm = await vscode.window.showWarningMessage(`Are you sure you want to remove ${email}?`, 'Yes', 'No');
        if (confirm === 'Yes') {
          await accountService.removeAccountWorkflow(email);
        }
      }
    })
  );

  disposables.push(
    vscode.commands.registerCommand('agent-assistant.toggleSkillSidebar', (id: string) => {
      skillService.toggleSkill(id);
      skillsTreeProvider.refresh();
      panelProvider.refresh();
    })
  );

  disposables.push(
    vscode.commands.registerCommand('agent-assistant.addAccount', async () => {
      await accountService.addAccountWorkflow();
    })
  );

  disposables.push(
    vscode.commands.registerCommand('agent-assistant.refreshAccounts', async () => {
      await accountService.refreshBalancesWorkflow(true);
    })
  );

  return disposables;
}
