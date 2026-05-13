/**
 * Account Repository Implementation
 */

import * as vscode from 'vscode';
import { IAccountRepository } from '../../core/domain/repositories/account.repository';
import { Account, AccountCreationData, AccountTokens, AccountSummary, AccountStatus } from '../../core/domain/models/account.model';
import { DeviceProfile } from '../../core/domain/models/device-profile.model';
import { STORAGE_KEYS, SECRET_KEYS } from '../../core/constants/app.constants';
import { Logger } from '../../core/utils/logger';

export class AccountRepositoryImpl implements IAccountRepository {
  constructor(private context: vscode.ExtensionContext) {}

  async getAllAccounts(): Promise<Account[]> {
    const accounts = this.context.globalState.get<Account[]>(STORAGE_KEYS.ACCOUNTS_LIST, []);
    return accounts;
  }

  async getAccount(email: string): Promise<Account | null> {
    const accounts = await this.getAllAccounts();
    return accounts.find(a => a.email === email) || null;
  }

  async saveAccount(data: AccountCreationData): Promise<Account> {
    const accounts = await this.getAllAccounts();
    const existingIndex = accounts.findIndex(a => a.email === data.email);
    
    const newAccount: Account = {
      email: data.email,
      name: data.name,
      avatarUrl: data.avatarUrl,
      projectId: data.projectId,
      plan: 'unknown' as any,
      status: AccountStatus.ACTIVE,
      balances: {},
      addedAt: new Date().toISOString(),
      isActive: false,
      hasDeviceProfile: false,
    };

    if (existingIndex >= 0) {
      accounts[existingIndex] = { ...accounts[existingIndex], ...newAccount, addedAt: accounts[existingIndex].addedAt };
    } else {
      accounts.push(newAccount);
    }

    await this.context.globalState.update(STORAGE_KEYS.ACCOUNTS_LIST, accounts);

    await this.storeTokens(data.email, {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      expiresAt: data.expiresAt
    });

    return newAccount;
  }

  async deleteAccount(email: string): Promise<void> {
    const accounts = await this.getAllAccounts();
    const filtered = accounts.filter(a => a.email !== email);
    await this.context.globalState.update(STORAGE_KEYS.ACCOUNTS_LIST, filtered);

    await this.context.secrets.delete(SECRET_KEYS.REFRESH_TOKEN(email));
    await this.context.secrets.delete(SECRET_KEYS.ACCESS_TOKEN(email));
    await this.context.secrets.delete(SECRET_KEYS.METADATA(email));
  }

  async findHealthyAccount(): Promise<Account | null> {
    const accounts = await this.getAllAccounts();
    return accounts.find(a => a.status === AccountStatus.ACTIVE) || null;
  }

  async updateAccount(email: string, updates: Partial<Account>): Promise<void> {
    const accounts = await this.getAllAccounts();
    const index = accounts.findIndex(a => a.email === email);
    if (index >= 0) {
      accounts[index] = { ...accounts[index], ...updates };
      await this.context.globalState.update(STORAGE_KEYS.ACCOUNTS_LIST, accounts);
    }
  }

  async getActiveAccountEmail(): Promise<string | null> {
    return this.context.globalState.get<string | null>(STORAGE_KEYS.ACTIVE_ACCOUNT, null);
  }

  async setActiveAccount(email: string): Promise<void> {
    const accounts = await this.getAllAccounts();
    const updatedAccounts = accounts.map(a => ({
      ...a,
      isActive: a.email === email
    }));
    await this.context.globalState.update(STORAGE_KEYS.ACCOUNTS_LIST, updatedAccounts);
    await this.context.globalState.update(STORAGE_KEYS.ACTIVE_ACCOUNT, email);
  }

  async storeTokens(email: string, tokens: AccountTokens): Promise<void> {
    await this.context.secrets.store(SECRET_KEYS.REFRESH_TOKEN(email), tokens.refreshToken);
    await this.context.secrets.store(SECRET_KEYS.ACCESS_TOKEN(email), tokens.accessToken);
    await this.context.secrets.store(SECRET_KEYS.METADATA(email), JSON.stringify({ expiresAt: tokens.expiresAt }));
  }

  async getTokens(email: string): Promise<AccountTokens | null> {
    try {
      const refreshToken = await this.context.secrets.get(SECRET_KEYS.REFRESH_TOKEN(email));
      const accessToken = await this.context.secrets.get(SECRET_KEYS.ACCESS_TOKEN(email));
      const metaStr = await this.context.secrets.get(SECRET_KEYS.METADATA(email));
      if (!refreshToken || !accessToken) return null;
      const meta = metaStr ? JSON.parse(metaStr) : { expiresAt: 0 };
      return { refreshToken, accessToken, expiresAt: meta.expiresAt };
    } catch (e) {
      return null;
    }
  }

  async getAccountSummaries(): Promise<AccountSummary[]> {
    const accounts = await this.getAllAccounts();
    return accounts.map(a => ({
      email: a.email,
      displayName: a.alias || a.name || a.email,
      avatarUrl: a.avatarUrl,
      balances: a.balances,
      status: a.status,
      isActive: a.isActive
    }));
  }

  private deviceProfileKey(email: string): string {
    return `antigravity.account.${email}.deviceProfile`;
  }

  async storeDeviceProfile(email: string, profile: DeviceProfile): Promise<void> {
    await this.context.secrets.store(this.deviceProfileKey(email), JSON.stringify(profile));
    await this.updateAccount(email, { hasDeviceProfile: true } as Partial<Account>);
  }

  async getDeviceProfile(email: string): Promise<DeviceProfile | null> {
    try {
      const raw = await this.context.secrets.get(this.deviceProfileKey(email));
      if (!raw) return null;
      return JSON.parse(raw) as DeviceProfile;
    } catch (e) {
      return null;
    }
  }

  async getPreferredModel(): Promise<string | null> {
    return this.context.globalState.get<string | null>(STORAGE_KEYS.PREFERRED_MODEL, null);
  }

  async setPreferredModel(modelKey: string): Promise<void> {
    await this.context.globalState.update(STORAGE_KEYS.PREFERRED_MODEL, modelKey);
  }

  async getBalancesLastRefreshed(): Promise<number> {
    return this.context.globalState.get<number>(STORAGE_KEYS.BALANCES_LAST_REFRESHED, 0);
  }

  async setBalancesLastRefreshed(timestampMs: number): Promise<void> {
    await this.context.globalState.update(STORAGE_KEYS.BALANCES_LAST_REFRESHED, timestampMs);
  }
}
