import { describe, expect, it } from 'vitest';
import { GUEST_LOOK } from '../content/looks';
import { createMockServices } from './createServices';
import { demoCid, slugHandle } from './ids';
import { MockIndexer } from './mockIndexer';
import { POST_QUOTE } from './pricing';

const CID = /^bafybei[a-z2-7]{52}$/;
const TX = /^[0-9a-f]{64}$/;
const ADDRESS = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

describe('demo services', () => {
  it('seeds realistic demo records that use the post burn', () => {
    const indexer = new MockIndexer();
    const handles = new Set(indexer.getProfilesSnapshot().map((profile) => profile.handle));
    expect(handles.size).toBe(indexer.getProfilesSnapshot().length);
    for (const post of indexer.getPostsSnapshot()) {
      expect(post.burned).toBe(POST_QUOTE.split.burn);
      expect(post.cid).toMatch(CID);
      expect(post.dogeTxid).toMatch(TX);
      expect(post.forgedHere).toBe(false);
      expect(handles.has(post.handle)).toBe(true);
    }
    for (const item of indexer.getItemsSnapshot()) {
      expect(item.cid).toMatch(CID);
      expect(handles.has(item.creatorHandle)).toBe(true);
      expect(handles.has(item.ownerHandle)).toBe(true);
    }
  });

  it('never calls the network', async () => {
    const original = globalThis.fetch;
    let calls = 0;
    globalThis.fetch = (() => {
      calls += 1;
      return Promise.reject(new Error('network'));
    }) as typeof fetch;
    try {
      const services = createMockServices();
      await services.pricing.quote('post');
      await services.pricing.getSpot();
      await services.wallet.createWallet();
      await services.ipfs.pin({ label: 'offline' });
      const quote = await services.pricing.quote('mint');
      await services.relayer.submit({
        action: 'mint',
        name: 'Offline stamp',
        blurb: 'Stays in the browser.',
        art: 'stamp',
        quote,
      });
      expect(calls).toBe(0);
    } finally {
      globalThis.fetch = original;
    }
  });

  it('creates a public label and no secret field', async () => {
    const { wallet } = createMockServices();
    const first = await wallet.createWallet();
    const second = await wallet.createWallet();
    expect(wallet.mode).toBe('mock');
    expect(first.simulated).toBe(true);
    expect(Object.keys(first).sort()).toEqual(['createdAtIso', 'publicAddress', 'simulated']);
    expect(first.publicAddress).toMatch(ADDRESS);
    expect(second.publicAddress).not.toBe(first.publicAddress);
  });

  it('records a forged post, then attaches it to a later profile', async () => {
    const services = createMockServices();
    const before = services.indexer.getPostsSnapshot().length;
    const postQuote = await services.pricing.quote('post');
    const posted = await services.relayer.submit({
      action: 'post',
      text: 'hello forge',
      meme: 'forever',
      quote: postQuote,
    });
    expect(posted.simulated).toBe(true);
    expect(posted.cid).toMatch(CID);
    expect(posted.memo).toContain(posted.cid);
    expect(services.indexer.getPostsSnapshot()).toHaveLength(before + 1);
    expect(services.indexer.getPostsSnapshot()[0]?.handle).toBe('you');
    expect(services.indexer.getPostsSnapshot()[0]?.burned).toBe(postQuote.split.burn);

    const wallet = await services.wallet.createWallet();
    const profileQuote = await services.pricing.quote('profile');
    const profile = await services.relayer.submit({
      action: 'profile',
      name: 'Demo Cat',
      handle: 'democat',
      bio: 'hi',
      look: GUEST_LOOK,
      walletLabel: wallet.publicAddress,
      quote: profileQuote,
    });
    expect(profile.handle).toBe('democat');
    expect(services.indexer.getPostsSnapshot()[0]?.handle).toBe('democat');
    expect(services.indexer.getProfilesSnapshot()[0]?.walletLabel).toBe(wallet.publicAddress);
    expect(services.indexer.getProfilesSnapshot()[0]?.forgedHere).toBe(true);
  });

  it('builds stable demo content ids', () => {
    expect(demoCid('same')).toBe(demoCid('same'));
    expect(demoCid('same')).not.toBe(demoCid('other'));
    expect(slugHandle('Gold Nip!')).toBe('goldnip');
  });
});
