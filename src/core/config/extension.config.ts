/**
 * Extension Configuration — Centralized configuration access
 */

import * as vscode from 'vscode';

const CONFIG_SECTION = 'agentAssistant';

export class ExtensionConfig {
  private static instance: ExtensionConfig;
  private context: vscode.ExtensionContext | null = null;

  private constructor() {}

  static getInstance(): ExtensionConfig {
    if (!ExtensionConfig.instance) {
      ExtensionConfig.instance = new ExtensionConfig();
    }
    return ExtensionConfig.instance;
  }

  initialize(context: vscode.ExtensionContext): void {
    this.context = context;
  }

  getLanguage(): string {
    return this.getConfig().get<string>('language', 'auto');
  }

  /**
   * Get the refresh interval in milliseconds
   */
  getRefreshInterval(): number {
    const mins = this.getConfig().get<number>('refreshIntervalMinutes', 30);
    return mins * 60 * 1000;
  }

  getLowCreditThreshold(): number {
    return this.getConfig().get<number>('lowCreditThreshold', 100);
  }

  isAutoSwitchEnabled(): boolean {
    return this.getConfig().get<boolean>('enableAutoSwitch', false);
  }

  getContext(): vscode.ExtensionContext {
    if (!this.context) {
      throw new Error('ExtensionConfig not initialized. Call initialize() first.');
    }
    return this.context;
  }

  private getConfig(): vscode.WorkspaceConfiguration {
    return vscode.workspace.getConfiguration(CONFIG_SECTION);
  }
}
