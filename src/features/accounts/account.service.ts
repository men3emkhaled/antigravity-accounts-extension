/**
 * Account Service - DELIBERATE PREMIUM REFRESH 0.1.21
 */

import * as vscode from 'vscode';
import { IAccountRepository } from '../../core/domain/repositories/account.repository';
import { IAuthenticationService } from '../../core/domain/services/authentication.service';
import { IBalanceService } from '../../core/domain/services/balance.service';
import { IStateDbService } from '../../core/domain/services/state-db.service';
import { I18nService } from '../../i18n/i18n.service';
import { Logger } from '../../core/utils/logger';
import { AccountStatus } from '../../core/domain/models/account.model';
import { ExtensionConfig } from '../../core/config/extension.config';

export class AccountService {
  private _onAccountsChanged = new vscode.EventEmitter<void>();
  public readonly onAccountsChanged = this._onAccountsChanged.event;

  private _isRefreshing = false;
  private _lastRefreshTime = 0;

  constructor(
    private readonly authService: IAuthenticationService,
    private readonly balanceService: IBalanceService,
    private readonly accountRepo: IAccountRepository,
    private readonly stateDbService: IStateDbService
  ) { }

  public startBackgroundMonitor() {
    const config = ExtensionConfig.getInstance();
    const interval = config.getRefreshInterval();

    setInterval(async () => {
      await this.refreshBalancesWorkflow(false);
    }, interval);
  }

  async addAccountWorkflow(): Promise<void> {
    try {
      const authResult = await this.authService.authenticate();
      await this.accountRepo.saveAccount(authResult);
      const balanceInfo = await this.balanceService.getBalanceInfo(authResult.accessToken);
      
      await this.accountRepo.updateAccount(authResult.email, {
        balances: balanceInfo.balances,
        plan: balanceInfo.plan as any,
        status: balanceInfo.hasError ? AccountStatus.ERROR : AccountStatus.ACTIVE
      });

      this._onAccountsChanged.fire();
    } catch (error: any) {
      Logger.getInstance().error('Add account failed', error);
    }
  }

  async switchAccountWorkflow(email: string): Promise<void> {
    const account = await this.accountRepo.getAccount(email);
    const tokens = await this.accountRepo.getTokens(email);
    if (!account || !tokens) return;

    const deviceProfile = await this.accountRepo.getDeviceProfile(email);
    const result = await this.stateDbService.injectAccountState(account, tokens, deviceProfile);
    if (result === 'success') {
      this._onAccountsChanged.fire();
    }
  }

  async getActiveAntigravityEmail(): Promise<string | null> {
    return this.stateDbService.getActiveEmail();
  }

  public isRefreshing(): boolean {
    return this._isRefreshing;
  }

  /**
   * Enhanced Refresh Workflow with deliberate delay for UX.
   */
  async refreshBalancesWorkflow(notify: boolean = true): Promise<void> {
    const now = Date.now();
    if (this._isRefreshing) return;

    this._isRefreshing = true;
    this._onAccountsChanged.fire(); // Notify start

    // Artificial "Premium" Delay (2.5 seconds) to let animations play
    const minDelay = new Promise(r => setTimeout(r, 2500));

    try {
      const accounts = await this.accountRepo.getAllAccounts();
      const config = ExtensionConfig.getInstance();

      const refreshPromise = Promise.all(accounts.map(async (account) => {
        try {
          let tokens = await this.accountRepo.getTokens(account.email);
          if (!tokens) return;

          // Token Refresh Logic: Refresh if expired or expiring soon (within 5 minutes)
          const nowSeconds = Math.floor(Date.now() / 1000);
          if (tokens.expiresAt < nowSeconds + 300) {
            try {
              const refreshed = await this.authService.refreshAccessToken(tokens.refreshToken);
              tokens.accessToken = refreshed.accessToken;
              tokens.expiresAt = nowSeconds + refreshed.expiresIn;
              await this.accountRepo.storeTokens(account.email, tokens);
            } catch (refreshError) {
              Logger.getInstance().error(`Token refresh failed for ${account.email}`, refreshError);
              await this.accountRepo.updateAccount(account.email, { status: AccountStatus.ERROR });
              return;
            }
          }

          const balanceInfo = await this.balanceService.getBalanceInfo(tokens.accessToken);
          let status = balanceInfo.hasError ? AccountStatus.ERROR : AccountStatus.ACTIVE;
          
          await this.accountRepo.updateAccount(account.email, {
            balances: balanceInfo.balances,
            plan: balanceInfo.plan as any,
            status: status,
            lastRefreshedAt: new Date().toISOString()
          });

        } catch (e) {
          Logger.getInstance().error(`Refresh failed for ${account.email}`, e);
        }
      }));

      // Wait for both the actual work and the minimal UX delay
      await Promise.all([refreshPromise, minDelay]);
      
      await this.accountRepo.setBalancesLastRefreshed(Date.now());
      this._lastRefreshTime = Date.now();
    } finally {
      this._isRefreshing = false;
      this._onAccountsChanged.fire(); // Notify end
    }
  }

  async removeAccountWorkflow(email: string): Promise<void> {
    await this.accountRepo.deleteAccount(email);
    this._onAccountsChanged.fire();
  }
}
