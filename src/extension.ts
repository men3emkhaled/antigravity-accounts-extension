/**
 * Antigravity Accounts — VS Code Extension Entry Point
 *
 * This is the main activation/deactivation entry for the extension.
 * It follows the Composition Root pattern: all dependencies are wired here
 * and injected into the appropriate layers.
 */

import * as vscode from 'vscode';
import { Logger } from './core/utils/logger';
import { I18nService } from './i18n/i18n.service';
import { ExtensionConfig } from './core/config/extension.config';

import { AuthService } from './infrastructure/auth/auth.service';
import { BalanceService } from './infrastructure/api/balance.service';
import { AccountRepositoryImpl } from './infrastructure/storage/account.repository.impl';
import { StateDbService } from './infrastructure/storage/state-db.service';
import { AccountService } from './features/accounts/account.service';
import { StatusBarProvider } from './presentation/providers/status-bar.provider';
import { AccountsTreeProvider } from './presentation/providers/accounts-tree.provider';
import { AccountsPanelProvider } from './presentation/providers/accounts-panel.provider';

// TODO : complete Investigation Account Switching conversation

/**
 * Called when the extension is activated.
 * Responsible for:
 * - Initializing core services (Logger, I18n, Config)
 * - Registering commands
 * - Setting up the sidebar webview
 * - Initializing the status bar
 */
export function activate(context: vscode.ExtensionContext): void {
  const logger = Logger.getInstance();
  logger.info('Antigravity Accounts is activating...');

  try {
    // ── Initialize Configuration ──
    const config = ExtensionConfig.getInstance();
    config.initialize(context);

    // ── Initialize i18n ──
    const i18n = I18nService.getInstance();
    
    const updateLanguage = () => {
      let language = config.getLanguage();
      if (language === 'auto') {
        const editorLang = vscode.env.language.split('-')[0].toLowerCase();
        language = editorLang === 'ar' ? 'ar' : 'en';
      }
      i18n.setLocale(language);
      logger.info(`Language set to: ${language} (configured: ${config.getLanguage()})`);
    };
    
    updateLanguage();

    // ── Register Commands ──
    const commands = registerCommands(context, i18n);
    context.subscriptions.push(...commands);

    // ── Listen for configuration changes ──
    context.subscriptions.push(
      vscode.workspace.onDidChangeConfiguration((e) => {
        if (e.affectsConfiguration('antigravityAccounts.language')) {
          updateLanguage();
        }
      })
    );

    logger.info('Antigravity Accounts activated successfully.');
  } catch (error) {
    logger.error('Failed to activate Antigravity Accounts', error);
  }
}

/**
 * Called when the extension is deactivated.
 * Clean up resources here.
 */
export function deactivate(): void {
  const logger = Logger.getInstance();
  logger.info('Antigravity Accounts deactivated.');
}



/**
 * Register all extension commands.
 * Each command delegates to the appropriate use case / controller.
 */
function registerCommands(
  context: vscode.ExtensionContext,
  i18n: I18nService
): vscode.Disposable[] {
  const authService = new AuthService();
  const balanceService = new BalanceService();
  const accountRepo = new AccountRepositoryImpl(context);
  const stateDbService = new StateDbService(context);
  const accountService = new AccountService(authService, balanceService, accountRepo, stateDbService);

  // Start background monitoring for auto-refresh and auto-switch
  accountService.startBackgroundMonitor();


  const disposables: vscode.Disposable[] = [];

  // Initialize UI Providers
  const statusBarProvider = new StatusBarProvider(accountRepo, accountService);
  disposables.push(statusBarProvider);

  const accountsTreeProvider = new AccountsTreeProvider(accountRepo, accountService);
  const treeView = vscode.window.createTreeView('antigravity-accounts.accountsView', {
    treeDataProvider: accountsTreeProvider,
    showCollapseAll: true
  });
  disposables.push(treeView);

  // Rich WebviewPanel UI (opens in editor tab)
  const panelProvider = new AccountsPanelProvider(context.extensionUri, accountRepo, accountService);

  // Listen for account state changes to update UI
  disposables.push(
    accountService.onAccountsChanged(() => {
      statusBarProvider.update();
    })
  );

  // No longer syncing on startup, webview detects it dynamically on render.

  disposables.push(
    vscode.commands.registerCommand('antigravity-accounts.openPanel', () => {
      panelProvider.show();
    })
  );

  // Tree view actions
  disposables.push(
    vscode.commands.registerCommand('antigravity-accounts.treeSwitch', async (arg: any) => {
      const email = typeof arg === 'string' ? arg : arg?.email;
      if (email) {
        await accountService.switchAccountWorkflow(email);
        // Delay significantly to let Antigravity IDE's webview host stabilize
        setTimeout(() => accountsTreeProvider.refresh(), 1000);
      }
    })
  );

  disposables.push(
    vscode.commands.registerCommand('antigravity-accounts.treeDelete', async (arg: any) => {
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
    vscode.commands.registerCommand('antigravity-accounts.addAccount', async () => {
      await accountService.addAccountWorkflow();
    })
  );

  disposables.push(
    vscode.commands.registerCommand('antigravity-accounts.switchAccount', async () => {
      // Temporary quick pick until UI is built
      const accounts = await accountRepo.getAccountSummaries();
      if (accounts.length === 0) {
        vscode.window.showWarningMessage(i18n.t('extension.noAccountsToSwitch'));
        return;
      }

      const items = accounts.map(a => {
        let creditsStr = '?';
        if (a.balances && Object.keys(a.balances).length > 0) {
          creditsStr = Object.values(a.balances).join('/');
        }
        return {
          label: `${a.isActive ? '✅ ' : ''}${a.displayName}`,
          description: `${creditsStr} Credits`,
          email: a.email
        };
      });

      const picked = await vscode.window.showQuickPick(items, {
        placeHolder: i18n.t('extension.selectAccountToSwitch')
      });

      if (picked) {
        await accountService.switchAccountWorkflow(picked.email);
      }
    })
  );

  disposables.push(
    vscode.commands.registerCommand('antigravity-accounts.refreshBalances', async () => {
      await accountService.refreshBalancesWorkflow(true);
    })
  );

  disposables.push(
    vscode.commands.registerCommand('antigravity-accounts.setLanguage', async () => {
      const languages = [
        { label: i18n.t('webview.languageAuto'), description: 'auto' },
        ...i18n.getAvailableLocales().map((locale) => ({
          label: locale.name,
          description: locale.code,
        }))
      ];

      const picked = await vscode.window.showQuickPick(languages, {
        placeHolder: i18n.t('commands.setLanguage.placeholder'),
      });

      if (picked) {
        const extConfig = vscode.workspace.getConfiguration('antigravityAccounts');
        await extConfig.update('language', picked.description, vscode.ConfigurationTarget.Global);
        vscode.commands.executeCommand('antigravity-accounts.openPanel'); // trigger webview focus to reflect changes if possible
      }
    })
  );

  return disposables;
}
