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
        if (codeAssist.balances) {result.balances = codeAssist.balances;}
      }

      // Strategy 2: Fallback daily loadCodeAssist
      if (Object.keys(result.balances).length === 0) {
        const fallback = await this.tryFallbackLoadCodeAssist(accessToken);
        if (fallback) {
          if (result.plan === AccountPlan.UNKNOWN) {result.plan = this.parsePlanName(fallback.planName);}
          if (!result.projectId) {result.projectId = fallback.projectId;}
          if (fallback.balances) {result.balances = fallback.balances;}
        }
      }

      // Strategy 3: Available Models (Quotas)
      const modelQuotas = await this.tryFetchAvailableModels(accessToken, result.projectId);
      if (Object.keys(modelQuotas).length > 0) {
        result.balances = { ...result.balances, ...modelQuotas };
      }

      // Strategy 4: Fallback fetchCredits
      if (Object.keys(result.balances).length === 0) {
        const credits = await this.tryFetchCredits(accessToken);
        if (credits) {
          result.balances = { ...result.balances, ...credits };
        }
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
        body: { metadata: { ideType: 'VSCODE' } },
        accessToken
      });
      return this.parseCodeAssistData(data);
    } catch { return null; }
  }

  private async tryFallbackLoadCodeAssist(accessToken: string) {
    try {
      const data = await ApiClient.request<any>(API.DAILY_LOAD_CODE_ASSIST, {
        method: 'POST',
        body: { metadata: { ide_type: 'VSCODE', ide_version: API.DEFAULT_VERSION, ide_name: 'vscode' } },
        accessToken
      });
      return this.parseCodeAssistData(data);
    } catch { return null; }
  }

  private async tryFetchAvailableModels(accessToken: string, projectId?: string): Promise<Record<string, any>> {
    const balances: Record<string, any> = {};
    
    for (const url of API.FETCH_MODELS_URLS) {
      // Try both with and without project ID to be sure
      const bodies = projectId ? [{ project: projectId }, {}] : [{}];
      
      for (const body of bodies) {
        try {
          const data = await ApiClient.request<any>(url, { method: 'POST', body, accessToken });
          const models = data?.models;
          if (!models) {continue;}

          const modelEntries = Array.isArray(models) ? models.map((m: any) => [m.id || m.modelId, m]) : Object.entries(models);

          modelEntries.forEach((entry: any) => {
            const [id, m] = entry;
            if (!m || typeof m !== 'object') {return;}
            
            const quota = m.quotaInfo || m.quota_info;
            if (quota) {
              const fraction = quota.remainingFraction ?? quota.remaining_fraction ?? quota.fraction ?? 0;
              const reset = quota.resetTime || quota.reset_time;
              const key = (id || 'default').toString().toLowerCase();
              balances[key] = { value: Math.round(fraction * 100), resetTime: reset };
            }
          });

          if (Object.keys(balances).length > 0) {return balances;}
        } catch {}
      }
    }
    return balances;
  }

  private parseCodeAssistData(data: any) {
    if (!data) {return null;}
    const balances: Record<string, number> = {};
    let planName: string | undefined;
    
    const tier = data.paidTier || data.paid_tier || data.currentTier || data.current_tier;
    if (tier) {
      planName = tier.name;
      const credits = tier.availableCredits || tier.available_credits;
      if (Array.isArray(credits)) {
        credits.forEach((c: any) => {
          const name = (c.creditType || c.credit_type || c.modelName || c.model_name || c.modelId || c.model_id || 'default').toString().toLowerCase();
          const amount = parseInt((c.creditAmount ?? c.credit_amount ?? c.amount ?? 0).toString(), 10);
          if (!isNaN(amount)) {balances[name] = amount;}
        });
      }
    }
    
    return { 
      balances: Object.keys(balances).length > 0 ? balances : undefined, 
      planName, 
      projectId: data.cloudaicompanionProject || data.cloudaicompanion_project || data.projectId || data.project_id
    };
  }

  private async tryFetchCredits(accessToken: string): Promise<Record<string, any> | null> {
    try {
      const data = await ApiClient.request<any>(API.FETCH_CREDITS, {
        method: 'POST',
        body: {},
        accessToken
      });
      if (data && typeof data === 'object') {
        const balances: Record<string, any> = {};
        const credits = data.credits || data.availableCredits || data.available_credits;
        if (Array.isArray(credits)) {
          credits.forEach((c: any) => {
            const name = (c.type || c.modelId || 'default').toString().toLowerCase();
            balances[name] = { value: c.amount || c.value || 0 };
          });
        } else if (data.amount !== undefined || data.value !== undefined) {
          balances['total'] = { value: data.amount || data.value || 0 };
        }
        return Object.keys(balances).length > 0 ? balances : null;
      }
    } catch { return null; }
    return null;
  }

  private parsePlanName(name?: string): AccountPlan {
    if (!name) {return AccountPlan.UNKNOWN;}
    const l = name.toLowerCase();
    if (l.includes('ultra')) {return AccountPlan.ULTRA;}
    if (l.includes('premium')) {return AccountPlan.PREMIUM;}
    if (l.includes('free') || l.includes('standard')) {return AccountPlan.FREE;}
    return AccountPlan.UNKNOWN;
  }
}
