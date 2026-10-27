import { buildCatalog } from './catalog';
import type {
  ChainReceipt,
  DemoForgeSink,
  ForgedRef,
  ForgeRequest,
  IndexerService,
  Item,
  Post,
  Profile,
} from './types';

export class MockIndexer implements IndexerService, DemoForgeSink {
  private posts: readonly Post[];
  private profiles: readonly Profile[];
  private items: readonly Item[];
  private listeners = new Set<() => void>();
  private seq = 0;
  private guestHandle: string | null = null;

  constructor() {
    const seed = buildCatalog();
    this.posts = seed.posts;
    this.profiles = seed.profiles;
    this.items = seed.items;
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  getPostsSnapshot(): readonly Post[] {
    return this.posts;
  }

  getProfilesSnapshot(): readonly Profile[] {
    return this.profiles;
  }

  getItemsSnapshot(): readonly Item[] {
    return this.items;
  }

  record(request: ForgeRequest, receipt: ChainReceipt): ForgedRef {
    this.seq += 1;
    const n = this.seq;

    if (request.action === 'post') {
      const handle = this.guestHandle ?? 'you';
      const post: Post = {
        id: `forged-post-${n}`,
        handle,
        kind: request.meme ? 'meme' : 'message',
        text: request.text.trim(),
        meme: request.meme,
        createdLabel: 'Just now',
        burned: request.quote.split.burn,
        cid: receipt.cid,
        dogeTxid: receipt.dogeTxid,
        forgedHere: true,
      };
      this.posts = [post, ...this.posts];
      this.emit();
      return { id: post.id, handle };
    }

    if (request.action === 'profile') {
      if (this.profiles.some((profile) => profile.handle === request.handle)) {
        throw new Error('That name is already in this demo.');
      }
      const profile: Profile = {
        handle: request.handle,
        name: request.name.trim(),
        role: 'Forged here',
        bio: request.bio.trim() || 'A cat in this demo.',
        look: request.look,
        joinedLabel: 'Just now',
        walletLabel: request.walletLabel,
        forgedHere: true,
      };
      this.guestHandle = profile.handle;
      this.profiles = [profile, ...this.profiles];
      this.posts = this.posts.map((post) =>
        post.handle === 'you' ? { ...post, handle: profile.handle } : post,
      );
      this.items = this.items.map((entry) => ({
        ...entry,
        creatorHandle: entry.creatorHandle === 'you' ? profile.handle : entry.creatorHandle,
        ownerHandle: entry.ownerHandle === 'you' ? profile.handle : entry.ownerHandle,
      }));
      this.emit();
      return { id: profile.handle, handle: profile.handle };
    }

    const handle = this.guestHandle ?? 'you';
    const item: Item = {
      id: `forged-item-${n}`,
      name: request.name.trim(),
      blurb: request.blurb.trim() || 'Minted in this demo.',
      art: request.art,
      creatorHandle: handle,
      ownerHandle: handle,
      previewMeowe: null,
      cid: receipt.cid,
      dogeTxid: receipt.dogeTxid,
      forgedHere: true,
    };
    this.items = [item, ...this.items];
    this.emit();
    return { id: item.id, handle };
  }

  private emit(): void {
    for (const listener of this.listeners) listener();
  }
}
