import { MockIndexer } from './mockIndexer';
import { MockIpfs } from './mockIpfs';
import { MockPricing } from './mockPricing';
import { MockRelayer } from './mockRelayer';
import { MockWallet } from './mockWallet';
import type {
  ChatService,
  CommunityService,
  IndexerService,
  IpfsService,
  PricingService,
  RelayerService,
  WalletService,
} from './types';

/**
 * Composition root.
 * Screens talk to these interfaces only. Swap a mock for a live wallet,
 * relayer, pinner, price source, or Dogecoin indexer here — not in the pages.
 */
export interface PortalServices {
  wallet: WalletService;
  pricing: PricingService;
  ipfs: IpfsService;
  relayer: RelayerService;
  indexer: IndexerService;
  communities: CommunityService;
  chat: ChatService;
}

export function createMockServices(): PortalServices {
  const indexer = new MockIndexer();
  const ipfs = new MockIpfs();
  return {
    wallet: new MockWallet(),
    pricing: new MockPricing(),
    ipfs,
    relayer: new MockRelayer(ipfs, indexer),
    indexer,
    communities: indexer,
    chat: indexer,
  };
}
