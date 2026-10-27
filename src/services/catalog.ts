import type { Item, Post, Profile } from './types';
import { demoAddress, demoCid, demoTxid } from './ids';
import { POST_QUOTE } from './pricing';

const burned = POST_QUOTE.split.burn;

const profiles: Profile[] = [
  {
    handle: 'ninelives',
    name: 'Ninelives',
    role: 'OG emoji',
    bio: 'Started as a reaction emoji in the DOGEos Discord. Nine lives. Still here.',
    look: {
      fur: '#e2c25a',
      belly: '#fff4c8',
      accent: '#f0d36a',
      accessory: 'crown',
      mood: 'smile',
    },
    joinedLabel: 'Life 2',
    walletLabel: demoAddress('profile:ninelives'),
    forgedHere: false,
  },
  {
    handle: 'whiskersmith',
    name: 'Whiskersmith',
    role: 'Meme smith',
    bio: 'Forges memes into records. The file sits on IPFS. The lasting copy is on Dogecoin.',
    look: {
      fur: '#e8963a',
      belly: '#ffe0c2',
      accent: '#1a1406',
      accessory: 'shades',
      mood: 'wink',
    },
    joinedLabel: 'Smithy',
    walletLabel: demoAddress('profile:whiskersmith'),
    forgedHere: false,
  },
  {
    handle: 'pawscript',
    name: 'Pawscript',
    role: 'Scribe',
    bio: 'Short messages. Pennies in MEOWE. The words are meant to stay on Doge.',
    look: {
      fur: '#f6edd4',
      belly: '#fffaf0',
      accent: '#8b5cf6',
      accessory: 'cap',
      mood: 'smile',
    },
    joinedLabel: 'Scribe',
    walletLabel: demoAddress('profile:pawscript'),
    forgedHere: false,
  },
  {
    handle: 'goldnip',
    name: 'Goldnip',
    role: 'Collector',
    bio: 'Collects P2FK objects the way other cats collect sunbeams.',
    look: {
      fur: '#d4b235',
      belly: '#fff1c2',
      accent: '#e77fa8',
      accessory: 'none',
      mood: 'blep',
    },
    joinedLabel: 'Collector',
    walletLabel: demoAddress('profile:goldnip'),
    forgedHere: false,
  },
  {
    handle: 'voidnap',
    name: 'Voidnap',
    role: 'Node cat',
    bio: 'Night shift. Pins what the others mint and keeps an eye on the index.',
    look: {
      fur: '#3f3a34',
      belly: '#d9cbb3',
      accent: '#2ba59a',
      accessory: 'beanie',
      mood: 'wink',
    },
    joinedLabel: 'Node',
    walletLabel: demoAddress('profile:voidnap'),
    forgedHere: false,
  },
];

function post(
  id: string,
  handle: string,
  kind: Post['kind'],
  meme: Post['meme'],
  text: string,
  createdLabel: string,
): Post {
  return {
    id,
    handle,
    kind,
    meme,
    text,
    createdLabel,
    burned,
    cid: demoCid(`post:${id}`),
    dogeTxid: demoTxid(`post:${id}`),
    forgedHere: false,
  };
}

const posts: Post[] = [
  post(
    'p-forever',
    'ninelives',
    'meme',
    'forever',
    'Memes are forever on Doge. That is the tagline, and it is the job.',
    '2h ago',
  ),
  post(
    'p-second',
    'whiskersmith',
    'meme',
    'ninelives',
    'The first life ended when the deployer left. This one belongs to the community.',
    'Yesterday',
  ),
  post(
    'p-pool',
    'pawscript',
    'message',
    null,
    'Wrapped DOGE sits in the pool. The lasting record is native Dogecoin.',
    '5h ago',
  ),
  post(
    'p-penny',
    'goldnip',
    'meme',
    'penny',
    'A post is about one cent. Part of that cent is burned for good.',
    '1d ago',
  ),
  post(
    'p-quiet',
    'voidnap',
    'message',
    null,
    'If this website goes quiet, the meme is still supposed to live in the chain.',
    '3d ago',
  ),
  post(
    'p-beside',
    'ninelives',
    'meme',
    'beside',
    'A cat in a Doge world. The pool pairs MEOWE with wrapped DOGE.',
    '4d ago',
  ),
  post(
    'p-layers',
    'whiskersmith',
    'message',
    null,
    'The file lives on IPFS. A Solana memo carries the content id. Profiles and items are written on Dogecoin.',
    '6d ago',
  ),
  post(
    'p-nodes',
    'voidnap',
    'message',
    null,
    'Community nodes pin the files and index Dogecoin. They receive 10% of each fee.',
    '8d ago',
  ),
];

function item(
  id: string,
  name: string,
  blurb: string,
  art: Item['art'],
  creatorHandle: string,
  ownerHandle: string,
  previewMeowe: number,
): Item {
  return {
    id,
    name,
    blurb,
    art,
    creatorHandle,
    ownerHandle,
    previewMeowe,
    cid: demoCid(`item:${id}`),
    dogeTxid: demoTxid(`item:${id}`),
    forgedHere: false,
  };
}

/** Preview prices are illustrations for the grid. They are not buy quotes. */
const items: Item[] = [
  item(
    'medallion',
    'Nine Lives Medallion',
    'A one-of-one for the second life. The cat that would not stay gone.',
    'medallion',
    'ninelives',
    'ninelives',
    80_000,
  ),
  item(
    'plate',
    'Reaction Emoji Plate',
    'The original idea: a cat face used as a reaction in the DOGEos Discord.',
    'plate',
    'ninelives',
    'goldnip',
    42_000,
  ),
  item(
    'hammer',
    'Forge Hammer',
    'For striking a meme into a Dogecoin record.',
    'hammer',
    'whiskersmith',
    'whiskersmith',
    25_000,
  ),
  item(
    'stamp',
    'Penny Burn Stamp',
    'Marks a post that burned its 30% share.',
    'stamp',
    'pawscript',
    'pawscript',
    12_460,
  ),
  item(
    'scroll',
    'Doge Nap Scroll',
    'A short message, kept the Sup way, on Dogecoin.',
    'scroll',
    'pawscript',
    'voidnap',
    18_000,
  ),
  item(
    'crown',
    'Crown of the Second Life',
    'Community takeover, worn like nine points. One for each life.',
    'crown',
    'goldnip',
    'goldnip',
    90_000,
  ),
];

export function buildCatalog(): { profiles: Profile[]; posts: Post[]; items: Item[] } {
  return {
    profiles: profiles.map((profile) => ({ ...profile, look: { ...profile.look } })),
    posts: posts.map((entry) => ({ ...entry })),
    items: items.map((entry) => ({ ...entry })),
  };
}
