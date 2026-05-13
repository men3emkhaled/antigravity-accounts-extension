import { Account, AccountTokens } from '../models/account.model';
import { DeviceProfile } from '../models/device-profile.model';

export interface IStateDbService {
  injectAccountState(account: Account, tokens: AccountTokens, deviceProfile: DeviceProfile | null): Promise<'success' | 'error' | 'cancelled'>;
  getActiveEmail(): Promise<string | null>;
}
