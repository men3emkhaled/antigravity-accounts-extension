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
// AccountsWebviewProvider removed — it conflicted with AccountsTreeProvider on the same view ID
import { SkillService } from './features/skills/skill.service';
import { SkillsTreeProvider } from './presentation/providers/skills-tree.provider';
import { CustomSkillsTreeProvider } from './presentation/providers/custom-skills-tree.provider';
import { SkillBuilderWebview } from './presentation/providers/skill-builder.webview';
import { PersonaDiagnosticProvider } from './presentation/providers/persona-diagnostic.provider';

export async function activate(context: vscode.ExtensionContext): Promise<void> {
  // Use console.log for absolute last resort debugging
  console.log('[Agent Assistant] Activation triggered.');
  
  try {
    // Show immediate feedback to user that extension is starting
    vscode.window.setStatusBarMessage('$(sync~spin) Agent Assistant: Booting...', 3000);

    Logger.getInstance().info('Agent Assistant is starting activation...');
    const skillService = new SkillService(context);

    // 1. Setup Logger & Config first
    const config = ExtensionConfig.getInstance();
    config.initialize(context);
    
    // 2. Initialize Core Domain Services
    const authService = new AuthService();
    const balanceService = new BalanceService();
    const accountRepo = new AccountRepositoryImpl(context);
    const stateDbService = new StateDbService(context);
    const accountService = new AccountService(authService, balanceService, accountRepo, stateDbService);

    // 3. Register UI Providers (IDs must match package.json)
    const accountsTreeProvider = new AccountsTreeProvider(accountService, accountRepo);
    context.subscriptions.push(
      vscode.window.createTreeView('agent-assistant.accountsView', {
        treeDataProvider: accountsTreeProvider,
        showCollapseAll: false
      })
    );

    const skillsTreeProvider = new SkillsTreeProvider(skillService);
    vscode.window.registerTreeDataProvider('agent-assistant.skillsView', skillsTreeProvider);

    const customSkillsTreeProvider = new CustomSkillsTreeProvider(skillService);
    vscode.window.registerTreeDataProvider('agent-assistant.customSkillsView', customSkillsTreeProvider);

    const statusBarProvider = new StatusBarProvider(accountRepo, accountService);
    context.subscriptions.push(statusBarProvider);

    const panelProvider = new AccountsPanelProvider(context.extensionUri, accountRepo, accountService, skillService);
    const personaDiagnosticProvider = new PersonaDiagnosticProvider(context, skillService);
    context.subscriptions.push(personaDiagnosticProvider);

    // 4. Register Commands (Crucial for UI to be responsive)
    const commands = registerCommands(context, skillService, accountService, accountRepo, accountsTreeProvider, skillsTreeProvider, customSkillsTreeProvider, panelProvider);
    context.subscriptions.push(...commands);

    // 5. Start Background Tasks (Non-blocking)
    accountService.startBackgroundMonitor();
    
    // 6. Initialize Skill State & Workspace Injection (May take time, so do last)
    skillService.loadState().catch((err: unknown) => {
      Logger.getInstance().error('Failed to initialize skills', err);
    });

    Logger.getInstance().info('Agent Assistant activated successfully.');
  } catch (error: unknown) {
    Logger.getInstance().error('CRITICAL: Failed to activate Agent Assistant', error);
    vscode.window.showErrorMessage(`Agent Assistant failed to start: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
  accountRepo: AccountRepositoryImpl,
  accountsTreeProvider: AccountsTreeProvider,
  skillsTreeProvider: SkillsTreeProvider,
  customSkillsTreeProvider: CustomSkillsTreeProvider,
  panelProvider: AccountsPanelProvider
): vscode.Disposable[] {
  const disposables: vscode.Disposable[] = [];

  disposables.push(
    vscode.commands.registerCommand('agent-assistant.openPanel', () => {
      panelProvider.show();
    })
  );
  
  disposables.push(
    vscode.commands.registerCommand('agent-assistant.switchAccount', async (arg?: unknown) => {
      let email = typeof arg === 'string' ? arg : (arg as { email?: string })?.email;
      
      if (!email) {
        const accounts = await accountRepo.getAccountSummaries();
        if (accounts.length === 0) {
          vscode.window.showInformationMessage('No accounts found. Add one first.');
          return;
        }
        const activeEmail = await accountService.getActiveAntigravityEmail();
        const items = accounts.map((acc: { email: string; displayName?: string }) => ({
          label: acc.email,
          description: acc.displayName || '',
          detail: acc.email === activeEmail ? '$(check) Active' : '',
          email: acc.email
        }));
        const selected = await vscode.window.showQuickPick(items, { placeHolder: 'Select account to switch to' });
        if (selected) {
          email = selected.email;
        }
      }
      
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
        vscode.commands.executeCommand('setContext', 'agent-assistant.isSearching', query !== '');
      }
    })
  );

  disposables.push(
    vscode.commands.registerCommand('agent-assistant.clearSearch', () => {
      accountsTreeProvider.setFilter('');
      vscode.commands.executeCommand('setContext', 'agent-assistant.isSearching', false);
    })
  );

  disposables.push(
    vscode.commands.registerCommand('agent-assistant.treeDelete', async (arg: unknown) => {
      const email = typeof arg === 'string' ? arg : (arg as { email?: string })?.email;
      if (email) {
        const confirm = await vscode.window.showWarningMessage(`Are you sure you want to remove ${email}?`, 'Yes', 'No');
        if (confirm === 'Yes') {
          await accountService.removeAccountWorkflow(email);
        }
      }
    })
  );

  disposables.push(
    vscode.commands.registerCommand('agent-assistant.searchSkills', async () => {
      const query = await vscode.window.showInputBox({
        placeHolder: 'Search skills...',
        prompt: 'Filter Expert Skills'
      });
      if (query !== undefined) {
        skillsTreeProvider.setFilter(query);
        vscode.commands.executeCommand('setContext', 'agent-assistant.isSearchingSkills', query !== '');
      }
    })
  );

  disposables.push(
    vscode.commands.registerCommand('agent-assistant.clearSkillsSearch', () => {
      skillsTreeProvider.setFilter('');
      vscode.commands.executeCommand('setContext', 'agent-assistant.isSearchingSkills', false);
    })
  );

  disposables.push(
    vscode.commands.registerCommand('agent-assistant.toggleSkillSidebar', (id: string) => {
      skillService.toggleSkill(id);
      skillsTreeProvider.refresh();
      customSkillsTreeProvider.refresh();
      panelProvider.refresh();
    })
  );

  disposables.push(
    vscode.commands.registerCommand('agent-assistant.createCustomSkill', () => {
      SkillBuilderWebview.createOrShow(context.extensionUri, skillService);
    })
  );

  disposables.push(
    vscode.commands.registerCommand('agent-assistant.deleteCustomSkill', async (item: any) => {
      if (item && item.skill && item.skill.id) {
        const confirm = await vscode.window.showWarningMessage(`Are you sure you want to delete custom skill '${item.skill.title}'?`, 'Yes', 'No');
        if (confirm === 'Yes') {
          skillService.deleteCustomSkill(item.skill.id);
          customSkillsTreeProvider.refresh();
        }
      }
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

  disposables.push(
    vscode.commands.registerCommand('agent-assistant.refreshBalances', async () => {
      await accountService.refreshBalancesWorkflow(true);
    })
  );

  return disposables;
}
