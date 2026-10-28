import { buildCatalog, GUEST_HANDLE } from './catalog';
import { slugHandle } from './ids';
import { itemFromMint } from './objects';
import type {
  ChainReceipt,
  Channel,
  ChatMessage,
  ChatService,
  Community,
  CommunityService,
  DemoForgeSink,
  ForgedRef,
  ForgeRequest,
  IndexerService,
  Item,
  Membership,
  Profile,
} from './types';

const HUES = ['#5865f2', '#6d4bd8', '#3a3c43', '#16655e', '#e0528a'];

export class MockIndexer implements IndexerService, CommunityService, ChatService, DemoForgeSink {
  private profiles: readonly Profile[];
  private items: readonly Item[];
  private communities: readonly Community[];
  private channels: readonly Channel[];
  private memberships: readonly Membership[];
  private messages: readonly ChatMessage[];
  private listeners = new Set<() => void>();
  private seq = 0;

  constructor() {
    const seed = buildCatalog();
    this.profiles = seed.profiles;
    this.items = seed.items;
    this.communities = seed.communities;
    this.channels = seed.channels;
    this.memberships = seed.memberships;
    this.messages = seed.messages;
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  getProfilesSnapshot(): readonly Profile[] {
    return this.profiles;
  }

  getItemsSnapshot(): readonly Item[] {
    return this.items;
  }

  getCommunitiesSnapshot(): readonly Community[] {
    return this.communities;
  }

  getChannelsSnapshot(): readonly Channel[] {
    return this.channels;
  }

  getMembershipsSnapshot(): readonly Membership[] {
    return this.memberships;
  }

  getMessagesSnapshot(): readonly ChatMessage[] {
    return this.messages;
  }

  record(request: ForgeRequest, receipt: ChainReceipt): ForgedRef {
    this.seq += 1;
    const n = this.seq;

    if (request.action === 'message') {
      const channel = this.channels.find((entry) => entry.id === request.channelId);
      if (!channel) throw new Error('That channel is not in this demo.');
      const message: ChatMessage = {
        id: `forged-msg-${n}`,
        channelId: channel.id,
        handle: GUEST_HANDLE,
        text: request.text.trim(),
        localImageUrl: request.localImageUrl,
        createdLabel: 'Just now',
        burned: request.quote.split.burn,
        cid: receipt.cid,
        dogeTxid: receipt.dogeTxid,
        forgedHere: true,
      };
      this.messages = [...this.messages, message];
      this.emit();
      return { id: message.id, handle: GUEST_HANDLE };
    }

    if (request.action === 'profile') {
      const guest = this.profiles.find((profile) => profile.handle === GUEST_HANDLE);
      if (!guest) throw new Error('The guest profile is missing.');
      this.profiles = this.profiles.map((profile) =>
        profile.handle === GUEST_HANDLE
          ? { ...profile, localImageUrl: request.localImageUrl }
          : profile,
      );
      this.emit();
      return { id: GUEST_HANDLE, handle: GUEST_HANDLE };
    }

    if (request.action === 'community') {
      const id = uniqueCommunityId(request.name, this.communities);
      const community: Community = {
        id,
        name: request.name.trim(),
        topic: request.topic.trim() || 'A new room in this demo.',
        ownerHandle: GUEST_HANDLE,
        hue: HUES[n % HUES.length] ?? HUES[0],
        mark: markFrom(request.name),
        forgedHere: true,
      };
      const channel: Channel = {
        id: `${id}-general`,
        communityId: id,
        name: 'general',
        topic: 'The front room.',
      };
      this.communities = [community, ...this.communities];
      this.channels = [...this.channels, channel];
      this.memberships = [...this.memberships, { communityId: id, handle: GUEST_HANDLE }];
      this.emit();
      return { id: community.id, handle: GUEST_HANDLE };
    }

    const minted: Item = itemFromMint(
      `forged-item-${n}`,
      request,
      receipt.cid,
      receipt.dogeTxid,
    );
    this.items = [minted, ...this.items];
    this.emit();
    return { id: minted.id, handle: GUEST_HANDLE };
  }

  private emit(): void {
    for (const listener of this.listeners) listener();
  }
}

function uniqueCommunityId(name: string, existing: readonly Community[]): string {
  const base = slugHandle(name) || 'community';
  const taken = new Set(existing.map((community) => community.id));
  if (!taken.has(base)) return base;
  let n = 2;
  while (taken.has(`${base}${n}`)) n += 1;
  return `${base}${n}`;
}

function markFrom(name: string): string {
  const letters = name.replace(/[^A-Za-z0-9]/g, '');
  return (letters.slice(0, 1) || 'C').toUpperCase();
}
