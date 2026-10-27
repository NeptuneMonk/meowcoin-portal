export type PortalAction = 'post' | 'profile' | 'mint';

export type MemeId = 'forever' | 'ninelives' | 'beside' | 'penny';

export type ItemArtId = 'medallion' | 'plate' | 'hammer' | 'stamp' | 'scroll' | 'crown';

export type Accessory = 'none' | 'shades' | 'beanie' | 'cap' | 'crown';

export type Mood = 'smile' | 'wink' | 'blep';

export interface CatLook {
  fur: string;
  belly: string;
  accent: string;
  accessory: Accessory;
  mood: Mood;
}

export interface FeeSplitAmounts {
  burn: number;
  doge: number;
  nodes: number;
}

export interface FeeQuote {
  action: PortalAction;
  /** Whole US cents. 1 is one penny. */
  usdCents: number;
  usd: number;
  meowe: number;
  split: FeeSplitAmounts;
  simulated: true;
}

export interface SpotPrice {
  usdPerMeowe: number;
  meowePerPenny: number;
  simulated: true;
}

/**
 * Public address only. Implementations must not return or log a secret key.
 * `simulated` is true when no key was generated.
 */
export interface PublicWallet {
  publicAddress: string;
  createdAtIso: string;
  simulated: boolean;
}

export interface PinRequest {
  label: string;
  /** A future pinner hashes these bytes. The mock ignores them. */
  bytes?: Uint8Array;
}

export interface PinnedFile {
  cid: string;
  simulated: true;
}

export interface Profile {
  handle: string;
  name: string;
  role: string;
  bio: string;
  look: CatLook;
  joinedLabel: string;
  walletLabel: string;
  forgedHere: boolean;
}

export interface Post {
  id: string;
  handle: string;
  kind: 'meme' | 'message';
  text: string;
  meme: MemeId | null;
  createdLabel: string;
  burned: number;
  cid: string;
  dogeTxid: string;
  forgedHere: boolean;
}

export interface Item {
  id: string;
  name: string;
  blurb: string;
  art: ItemArtId;
  creatorHandle: string;
  ownerHandle: string;
  /** Illustrative marketplace price. Null means it is not listed. */
  previewMeowe: number | null;
  cid: string;
  dogeTxid: string;
  forgedHere: boolean;
}

export type ForgeRequest =
  | {
      action: 'post';
      text: string;
      meme: MemeId | null;
      quote: FeeQuote;
    }
  | {
      action: 'profile';
      name: string;
      handle: string;
      bio: string;
      look: CatLook;
      walletLabel: string;
      quote: FeeQuote;
    }
  | {
      action: 'mint';
      name: string;
      blurb: string;
      art: ItemArtId;
      quote: FeeQuote;
    };

/** What a relayer would get back from the chains. No local id yet. */
export interface ChainReceipt {
  cid: string;
  dogeTxid: string;
  solanaSignature: string;
  memo: string;
  burned: number;
  simulated: true;
}

export interface ForgedRef {
  id: string;
  handle: string;
}

export interface ForgeReceipt extends ChainReceipt {
  entityId: string;
  handle: string;
}

/**
 * Portal wallet boundary.
 * Today this returns a guest label. Later it returns the public address of a
 * portal-generated Solana wallet. There is no field for a secret key.
 */
export interface WalletService {
  readonly mode: 'mock' | 'portal';
  createWallet(): Promise<PublicWallet>;
}

/** Turns a penny price into MEOWE and the 30/60/10 split. */
export interface PricingService {
  getSpot(): Promise<SpotPrice>;
  quote(action: PortalAction): Promise<FeeQuote>;
}

/** Pins a file and returns its content id. The mock does not upload. */
export interface IpfsService {
  pin(request: PinRequest): Promise<PinnedFile>;
}

/**
 * Pays the fee, burns the burn share, and asks for the Dogecoin record.
 * The mock does none of that. It returns a simulated receipt.
 */
export interface RelayerService {
  submit(request: ForgeRequest): Promise<ForgeReceipt>;
}

/**
 * Read model for profiles, posts, and items.
 * A live Dogecoin indexer replaces the snapshot after it reads the chain.
 * `subscribe` fires when the snapshot changes.
 */
export interface IndexerService {
  subscribe(listener: () => void): () => void;
  getPostsSnapshot(): readonly Post[];
  getProfilesSnapshot(): readonly Profile[];
  getItemsSnapshot(): readonly Item[];
}

/**
 * Demo-only write path. A live indexer learns by reading Dogecoin and Solana,
 * so the real one will not implement this. The mock uses it so a forged post
 * can show up in the tour immediately.
 */
export interface DemoForgeSink {
  record(request: ForgeRequest, receipt: ChainReceipt): ForgedRef;
}
