/**
 * Balance & API Service - Restored Full Logic
 */

import { ApiClient } from '../../core/network/api.client';
import { API } from '../../core/constants/app.constants';
import { Logger } from '../../core/utils/logger';
import { AccountPlan } from '../../core/domain/models/account.model';
import { IBalanceService } from '../../core/domain/services/balance.service';

export interface BalanceResult {
  balances: Record<string, any>;
  plan: AccountPlan;
  projectId?: string;
  hasError: boolean;
}

export class BalanceService implements IBalanceService {
  async getBalanceInfo(accessToken: string): Promise<BalanceResult> {
    const result: BalanceResult = {
      balances: {},
      plan: AccountPlan.UNKNOWN,
      hasError: false
    };

    try {
      // Strategy 1: Primary loadCodeAssist
      const codeAssist = await this.tryLoadCodeAssist(accessToken);
      if (codeAssist) {
        result.plan = this.parsePlanName(codeAssist.planName);
        result.projectId = codeAssist.projectId;
        if (codeAssist.balances) result.balances = codeAssist.balances;
      }

      // Strategy 2: Fallback daily loadCodeAssist
      if (Object.keys(result.balances).length === 0) {
        const fallback = await this.tryFallbackLoadCodeAssist(accessToken);
        if (fallback) {
          if (result.plan === AccountPlan.UNKNOWN) result.plan = this.parsePlanName(fallback.planName);
          if (!result.projectId) result.projectId = fallback.projectId;
          if (fallback.balances) result.balances = fallback.balances;
        }
      }

      // Strategy 3: Available Models (Quotas)
      const modelQuotas = await this.tryFetchAvailableModels(accessToken, result.projectId);
      if (Object.keys(modelQuotas).length > 0) {
        result.balances = { ...result.balances, ...modelQuotas };
      }

      if (Object.keys(result.balances).length === 0) {
        result.hasError = true;
      }

    } catch (error: any) {
      Logger.getInstance().error('Balance fetch failed', error);
      result.hasError = true;
    }

    return result;
  }

  private async tryLoadCodeAssist(accessToken: string) {
    try {
      const data = await ApiClient.request<any>(API.LOAD_CODE_ASSIST, {
        method: 'POST',
        body: { metadata: { ideType: 'ANTIGRAVITY' } },
        accessToken
      });
      return this.parseCodeAssistData(data);
    } catch { return null; }
  }

  private async tryFallbackLoadCodeAssist(accessToken: string) {
    try {
      const data = await ApiClient.request<any>(API.DAILY_LOAD_CODE_ASSIST, {
        method: 'POST',
        body: { metadata: { ide_type: 'ANTIGRAVITY', ide_version: API.DEFAULT_VERSION, ide_name: 'antigravity' } },
        accessToken
      });
      return this.parseCodeAssistData(data);
    } catch { return null; }
  }

  private async tryFetchAvailableModels(accessToken: string, projectId?: string): Promise<Record<string, any>> {
    const balances: Record<string, any> = {};
    const body = projectId ? { project: projectId } : {};
    for (const url of API.FETCH_MODELS_URLS) {
      try {
        const data = await ApiClient.request<any>(url, { method: 'POST', body, accessToken });
        if (data?.models) {
          Object.entries<any>(data.models).forEach(([id, m]) => {
            if (m.quotaInfo) {
              const fraction = m.quotaInfo.remainingFraction ?? 0;
              balances[id] = { value: Math.round(fraction * 100), resetTime: m.quotaInfo.resetTime };
            }
          });
          if (Object.keys(balances).length > 0) return balances;
        }
      } catch {}
    }
    return balances;
  }

  private parseCodeAssistData(data: any) {
    if (!data) return null;
    const balances: Record<string, number> = {};
    let planName: string | undefined;
    if (data.paidTier) {
      planName = data.paidTier.name;
      if (Array.isArray(data.paidTier.availableCredits)) {
        data.paidTier.availableCredits.forEach((c: any) => {
          const name = (c.creditType || c.modelName || c.modelId || 'default').toString().toLowerCase();
          const amount = parseInt((c.creditAmount ?? c.amount ?? 0).toString(), 10);
          if (!isNaN(amount)) balances[name] = amount;
        });
      }
    }
    if (!planName && data.currentTier) planName = data.currentTier.name;
    return { balances: Object.keys(balances).length > 0 ? balances : undefined, planName, projectId: data.cloudaicompanionProject };
  }

  private parsePlanName(name?: string): AccountPlan {
    if (!name) return AccountPlan.UNKNOWN;
    const l = name.toLowerCase();
    if (l.includes('ultra')) return AccountPlan.ULTRA;
    if (l.includes('premium')) return AccountPlan.PREMIUM;
    if (l.includes('free') || l.includes('standard')) return AccountPlan.FREE;
    return AccountPlan.UNKNOWN;
  }
}
