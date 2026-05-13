export interface IBalanceService {
  getBalanceInfo(accessToken: string): Promise<{
    balances: Record<string, any>;
    plan: string;
    hasError: boolean;
  }>;
}
