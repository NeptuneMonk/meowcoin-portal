import { describe, expect, it } from 'vitest';
import { GUEST_HANDLE } from './catalog';
import { createMockServices } from './createServices';
import { demoCid, slugHandle } from './ids';
import { MockIndexer } from './mockIndexer';
import { POST_QUOTE } from './pricing';

const CID = /^bafybei[a-z2-7]{52}$/;
const TX = /^[0-9a-f]{64}$/;
const ADDRESS = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

describe('demo services', () => {
  it('seeds communities, chats, and storefront items', () => {
    const indexer = new MockIndexer();
    const handles = new Set(indexer.getProfilesSnapshot().map((profile) => profile.handle));
    expect(handles.has(GUEST_HANDLE)).toBe(true);
    expect(indexer.getCommunitiesSnapshot().length).toBeGreaterThan(0);
    const communityIds = new Set(indexer.getCommunitiesSnapshot().map((community) => community.id));
    for (const channel of indexer.getChannelsSnapshot()) {
      expect(communityIds.has(channel.communityId)).toBe(true);
    }
    for (const membership of indexer.getMembershipsSnapshot()) {
      expect(communityIds.has(membership.communityId)).toBe(true);
      expect(handles.has(membership.handle)).toBe(true);
    }
    const channelIds = new Set(indexer.getChannelsSnapshot().map((channel) => channel.id));
    for (const message of indexer.getMessagesSnapshot()) {
      expect(message.burned).toBe(POST_QUOTE.split.burn);
      expect(message.cid).toMatch(CID);
      expect(message.dogeTxid).toMatch(TX);
      expect(message.localImageUrl).toBeNull();
      expect(message.forgedHere).toBe(false);
      expect(channelIds.has(message.channelId)).toBe(true);
      expect(handles.has(message.handle)).toBe(true);
    }
    for (const item of indexer.getItemsSnapshot()) {
      expect(item.cid).toMatch(CID);
      expect(item.localImageUrl).toBeNull();
      expect(handles.has(item.creatorHandle)).toBe(true);
      expect(handles.has(item.ownerHandle)).toBe(true);
    }
    for (const community of indexer.getCommunitiesSnapshot()) {
      expect(
        indexer
          .getMembershipsSnapshot()
          .some(
            (membership) =>
              membership.communityId === community.id && membership.handle === GUEST_HANDLE,
          ),
      ).toBe(true);
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
      await services.pricing.quote('message');
      await services.pricing.quote('community');
      await services.pricing.getSpot();
      await services.wallet.createWallet();
      await services.ipfs.pin({ label: 'offline' });
      const channel = services.communities.getChannelsSnapshot()[0];
      expect(channel).toBeTruthy();
      const quote = await services.pricing.quote('message');
      await services.relayer.submit({
        action: 'message',
        channelId: channel!.id,
        text: 'stays here',
        localImageUrl: 'blob:http://demo/local',
        quote,
      });
      const mint = await services.pricing.quote('mint');
      await services.relayer.submit({
        action: 'mint',
        name: 'Offline stamp',
        blurb: 'Stays in the browser.',
        localImageUrl: 'blob:http://demo/mint',
        quote: mint,
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

  it('records a message, a picture, a community, and a minted image', async () => {
    const services = createMockServices();
    const channel = services.communities
      .getChannelsSnapshot()
      .find((entry) => entry.id === 'nine-lives-general');
    expect(channel).toBeTruthy();
    const before = services.chat
      .getMessagesSnapshot()
      .filter((entry) => entry.channelId === channel!.id).length;
    const quote = await services.pricing.quote('message');
    const posted = await services.relayer.submit({
      action: 'message',
      channelId: channel!.id,
      text: 'hello forge',
      localImageUrl: null,
      quote,
    });
    expect(posted.simulated).toBe(true);
    expect(posted.cid).toMatch(CID);
    expect(posted.memo).toContain(posted.cid);
    const inChannel = services.chat
      .getMessagesSnapshot()
      .filter((entry) => entry.channelId === channel!.id);
    expect(inChannel).toHaveLength(before + 1);
    expect(inChannel.at(-1)?.handle).toBe(GUEST_HANDLE);
    expect(inChannel.at(-1)?.burned).toBe(374);

    const picture = await services.pricing.quote('profile');
    await services.relayer.submit({
      action: 'profile',
      localImageUrl: 'blob:http://demo/face',
      quote: picture,
    });
    expect(
      services.indexer.getProfilesSnapshot().find((profile) => profile.handle === GUEST_HANDLE)
        ?.localImageUrl,
    ).toBe('blob:http://demo/face');

    const communityQuote = await services.pricing.quote('community');
    const created = await services.relayer.submit({
      action: 'community',
      name: 'Sunbeam Room',
      topic: 'A quiet shelf.',
      quote: communityQuote,
    });
    expect(created.handle).toBe(GUEST_HANDLE);
    const community = services.communities
      .getCommunitiesSnapshot()
      .find((entry) => entry.id === created.entityId);
    expect(community?.ownerHandle).toBe(GUEST_HANDLE);
    expect(community?.forgedHere).toBe(true);
    expect(
      services.communities
        .getChannelsSnapshot()
        .some((entry) => entry.communityId === created.entityId && entry.name === 'general'),
    ).toBe(true);

    const mintQuote = await services.pricing.quote('mint');
    const minted = await services.relayer.submit({
      action: 'mint',
      name: 'Pocket coin',
      blurb: 'Picked on this device.',
      localImageUrl: 'blob:http://demo/item',
      quote: mintQuote,
    });
    const item = services.indexer.getItemsSnapshot().find((entry) => entry.id === minted.entityId);
    expect(item?.localImageUrl).toBe('blob:http://demo/item');
    expect(item?.art).toBeNull();
    expect(item?.ownerHandle).toBe(GUEST_HANDLE);
  });

  it('builds stable demo content ids', () => {
    expect(demoCid('same')).toBe(demoCid('same'));
    expect(demoCid('same')).not.toBe(demoCid('other'));
    expect(slugHandle('Gold Nip!')).toBe('goldnip');
  });
});
