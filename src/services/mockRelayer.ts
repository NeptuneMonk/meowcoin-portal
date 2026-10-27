import { demoSignature, demoTxid } from './ids';
import type {
  DemoForgeSink,
  ForgeReceipt,
  ForgeRequest,
  IpfsService,
  RelayerService,
} from './types';

/**
 * Stands in for the future relayer.
 * A real relayer would burn MEOWE, swap the DOGE share, and write the record.
 * This one pins a demo content id and tells the in-memory indexer.
 * It does not upload the picture.
 */
export class MockRelayer implements RelayerService {
  private seq = 0;

  constructor(
    private readonly ipfs: IpfsService,
    private readonly sink: DemoForgeSink,
  ) {}

  async submit(request: ForgeRequest): Promise<ForgeReceipt> {
    this.seq += 1;
    const label = `${request.action}:${this.seq}:${labelOf(request)}`;
    const pin = await this.ipfs.pin({ label });
    const memo = JSON.stringify({ v: 1, cid: pin.cid, act: request.action });
    const chain = {
      cid: pin.cid,
      dogeTxid: demoTxid(pin.cid),
      solanaSignature: demoSignature(pin.cid),
      memo,
      burned: request.quote.split.burn,
      simulated: true as const,
    };
    const ref = this.sink.record(request, chain);
    return { ...chain, entityId: ref.id, handle: ref.handle };
  }
}

function labelOf(request: ForgeRequest): string {
  if (request.action === 'message') return request.text.slice(0, 80) || 'image';
  if (request.action === 'profile') return 'picture';
  if (request.action === 'community') return request.name;
  return request.name;
}
