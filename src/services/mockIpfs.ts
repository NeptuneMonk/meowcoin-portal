import { demoCid } from './ids';
import type { IpfsService, PinRequest, PinnedFile } from './types';

/** Returns a realistic-looking content id. Nothing is uploaded. */
export class MockIpfs implements IpfsService {
  async pin(request: PinRequest): Promise<PinnedFile> {
    return {
      cid: demoCid(request.label),
      simulated: true,
    };
  }
}
