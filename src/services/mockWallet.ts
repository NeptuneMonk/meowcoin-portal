import { demoAddress } from './ids';
import type { PublicWallet, WalletService } from './types';

/** Guest labels only. This class has no keypair and does not call a network. */
export class MockWallet implements WalletService {
  readonly mode = 'mock' as const;
  private seq = 0;

  async createWallet(): Promise<PublicWallet> {
    this.seq += 1;
    return {
      publicAddress: demoAddress(`guest-wallet-${this.seq}`),
      createdAtIso: new Date().toISOString(),
      simulated: true,
    };
  }
}
