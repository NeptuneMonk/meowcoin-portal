export type PortalAction = 'message' | 'mint' | 'profile' | 'community';

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
  /** Object URL for a picture picked on this device. Never a remote address. */
  localImageUrl: string | null;
  forgedHere: boolean;
}

/**
 * What the viewer should open first.
 * `app` is an HTML bundle (an index.html plus its files).
 * `file` is anything else, offered as a download.
 */
export type ObjectKind = 'image' | 'video' | 'audio' | 'pdf' | 'app' | 'file';

/**
 * One file on an object.
 * Sup does not put this list inside the OBJ JSON. A root record's File map
 * is name to byte size, and urn / img / uri point at a file.
 * This list is the demo's copy of that, with a MIME type and a CID placeholder.
 */
export interface ObjectFile {
  name: string;
  mime: string;
  size: number;
  cid: string;
  /** Object URL or a bundled demo asset. Never an upload. */
  localUrl: string | null;
  /** HTML, CSS, or JS kept in memory so a sandboxed launch can inline it. */
  text: string | null;
}

export interface Item {
  id: string;
  /** Sup `nme`. */
  name: string;
  /** Sup `dsc`. */
  blurb: string;
  art: ItemArtId | null;
  /** Object URL when the main file is an image picked on this device. */
  localImageUrl: string | null;
  creatorHandle: string;
  ownerHandle: string;
  /** Illustrative shelf price. Null means it is not listed for sale. */
  previewMeowe: number | null;
  cid: string;
  dogeTxid: string;
  forgedHere: boolean;
  /** Sup `urn`. */
  urn: string;
  /** Sup `uri`. */
  uri: string | null;
  /** Sup `img`. */
  img: string | null;
  /** Sup `atr`. */
  attributes: Readonly<Record<string, string>>;
  /** Sup `lic`. */
  license: string | null;
  /** Sup `max`. Zero means the sample did not set a maximum. */
  max: number;
  /** Units held by `ownerHandle`. Sup stores this in `own`. */
  qty: number;
  /** Sup `cre`, as profile handles in this demo. */
  creators: readonly string[];
  /** Sup `roy`: handle to a percent. */
  royalties: Readonly<Record<string, number>>;
  mintedLabel: string;
  kind: ObjectKind;
  files: readonly ObjectFile[];
  /** File the viewer opens first. Sup's urn is the main reference. */
  mainFileName: string;
}

export interface Community {
  id: string;
  name: string;
  topic: string;
  ownerHandle: string;
  hue: string;
  mark: string;
  forgedHere: boolean;
}

export interface Channel {
  id: string;
  communityId: string;
  name: string;
  topic: string;
}

export interface Membership {
  communityId: string;
  handle: string;
}

export interface ChatMessage {
  id: string;
  channelId: string;
  handle: string;
  text: string;
  /** Object URL for an image picked on this device. Seed messages leave this empty. */
  localImageUrl: string | null;
  createdLabel: string;
  burned: number;
  cid: string;
  dogeTxid: string;
  forgedHere: boolean;
}

export type ForgeRequest =
  | {
      action: 'message';
      channelId: string;
      text: string;
      localImageUrl: string | null;
      quote: FeeQuote;
    }
  | {
      action: 'profile';
      localImageUrl: string;
      quote: FeeQuote;
    }
  | {
      action: 'mint';
      name: string;
      blurb: string;
      urn: string;
      uri: string | null;
      license: string | null;
      max: number;
      attributes: Readonly<Record<string, string>>;
      royaltyPercent: number | null;
      mainFileName: string;
      files: readonly {
        name: string;
        mime: string;
        size: number;
        localUrl: string;
        text: string | null;
      }[];
      quote: FeeQuote;
    }
  | {
      action: 'community';
      name: string;
      topic: string;
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
 * Read model for profiles and storefront items.
 * A live Dogecoin indexer replaces the snapshot after it reads the chain.
 */
export interface IndexerService {
  subscribe(listener: () => void): () => void;
  getProfilesSnapshot(): readonly Profile[];
  getItemsSnapshot(): readonly Item[];
}

/**
 * Spaces and their text channels. The service name stays CommunityService.
 * A live indexer fills this from Dogecoin records. The mock keeps a snapshot.
 */
export interface CommunityService {
  subscribe(listener: () => void): () => void;
  getCommunitiesSnapshot(): readonly Community[];
  getChannelsSnapshot(): readonly Channel[];
  getMembershipsSnapshot(): readonly Membership[];
}

/**
 * Text chats. Messages are the posts: each one carries a burn, a content id,
 * and a Dogecoin record. There is no voice, call, or audio stream here.
 */
export interface ChatService {
  subscribe(listener: () => void): () => void;
  getMessagesSnapshot(): readonly ChatMessage[];
}

/**
 * End-to-end encryption for private messages.
 * A live service follows Sup: encrypt to the recipient profile's pkx/pky,
 * and decrypt only with that profile's private key.
 * The mock does not encrypt and does not hold a private key.
 */
export interface EncryptedPayload {
  ciphertext: string;
  simulated: true;
}

export interface EncryptionService {
  readonly mode: 'mock' | 'sup';
  encryptFor(pkx: string, pky: string, plaintext: Uint8Array): Promise<EncryptedPayload>;
  decrypt(ciphertext: string): Promise<Uint8Array | null>;
}

/**
 * Demo-only write path. A live indexer learns by reading Dogecoin and Solana,
 * so the real one will not implement this. The mock uses it so a forged
 * message can show up in the tour immediately.
 */
export interface DemoForgeSink {
  record(request: ForgeRequest, receipt: ChainReceipt): ForgedRef;
}
