import { GUEST_LOOK } from '../content/looks';
import { demoMedia } from './demoMedia';
import { demoAddress, demoCid, demoTxid } from './ids';
import { POST_QUOTE } from './pricing';
import type {
  Channel,
  ChatMessage,
  Community,
  Item,
  Membership,
  ObjectFile,
  Profile,
} from './types';

export const GUEST_HANDLE = 'you';

const burned = POST_QUOTE.split.burn;

const profiles: Profile[] = [
  {
    handle: 'ninelives',
    name: 'Ninelives',
    role: 'OG emoji',
    bio: 'Started as a reaction emoji in the DOGEos Discord. Nine lives. Still here.',
    look: {
      fur: '#8b5cf6',
      belly: '#ece9fe',
      accent: '#6d4bd8',
      accessory: 'crown',
      mood: 'smile',
    },
    joinedLabel: 'Life 2',
    walletLabel: demoAddress('profile:ninelives'),
    localImageUrl: null,
    forgedHere: false,
  },
  {
    handle: 'whiskersmith',
    name: 'Whiskersmith',
    role: 'Meme smith',
    bio: 'Forges memes into records. The file sits on IPFS. The lasting copy is on Dogecoin.',
    look: {
      fur: '#4e5058',
      belly: '#dbdee1',
      accent: '#6d6f78',
      accessory: 'shades',
      mood: 'wink',
    },
    joinedLabel: 'Smithy',
    walletLabel: demoAddress('profile:whiskersmith'),
    localImageUrl: null,
    forgedHere: false,
  },
  {
    handle: 'pawscript',
    name: 'Pawscript',
    role: 'Scribe',
    bio: 'Short messages. Pennies in MEOWE. The words are meant to stay on Doge.',
    look: {
      fur: '#e0528a',
      belly: '#f8d5e4',
      accent: '#e0528a',
      accessory: 'cap',
      mood: 'smile',
    },
    joinedLabel: 'Scribe',
    walletLabel: demoAddress('profile:pawscript'),
    localImageUrl: null,
    forgedHere: false,
  },
  {
    handle: 'goldnip',
    name: 'Goldnip',
    role: 'Collector',
    bio: 'Collects P2FK objects the way other cats collect sunbeams.',
    look: {
      fur: '#6d6f78',
      belly: '#dbdee1',
      accent: '#6d6f78',
      accessory: 'none',
      mood: 'blep',
    },
    joinedLabel: 'Collector',
    walletLabel: demoAddress('profile:goldnip'),
    localImageUrl: null,
    forgedHere: false,
  },
  {
    handle: 'voidnap',
    name: 'Voidnap',
    role: 'Node cat',
    bio: 'Night shift. Pins what the others mint and keeps an eye on the index.',
    look: {
      fur: '#1fa595',
      belly: '#d5f3ef',
      accent: '#1fa595',
      accessory: 'beanie',
      mood: 'wink',
    },
    joinedLabel: 'Node',
    walletLabel: demoAddress('profile:voidnap'),
    localImageUrl: null,
    forgedHere: false,
  },
  {
    handle: GUEST_HANDLE,
    name: 'NeptuneMonk',
    role: 'Guest',
    bio: 'This is your profile in the demo. Pictures you pick stay on this device.',
    look: GUEST_LOOK,
    joinedLabel: 'Just visiting',
    walletLabel: demoAddress('profile:you'),
    localImageUrl: null,
    forgedHere: false,
  },
];

const communities: Community[] = [
  {
    id: 'nine-lives',
    name: 'Nine Lives',
    topic: 'The second life of the emoji cat.',
    ownerHandle: 'ninelives',
    hue: '#6d4bd8',
    mark: '9',
    forgedHere: false,
  },
  {
    id: 'smithy',
    name: 'The Smithy',
    topic: 'Where a meme gets hammered into a record.',
    ownerHandle: 'whiskersmith',
    hue: '#3a3c43',
    mark: 'S',
    forgedHere: false,
  },
  {
    id: 'node-night',
    name: 'Node Night',
    topic: 'Night shift for pins and the index.',
    ownerHandle: 'voidnap',
    hue: '#16655e',
    mark: '🌙',
    forgedHere: false,
  },
];

const channels: Channel[] = [
  {
    id: 'nine-lives-general',
    communityId: 'nine-lives',
    name: 'general',
    topic: 'The front room.',
  },
  {
    id: 'nine-lives-lore',
    communityId: 'nine-lives',
    name: 'lore',
    topic: 'How the emoji got a second life.',
  },
  {
    id: 'smithy-general',
    communityId: 'smithy',
    name: 'general',
    topic: 'The smithy floor.',
  },
  {
    id: 'smithy-memes',
    communityId: 'smithy',
    name: 'memes',
    topic: 'Pictures worth a penny.',
  },
  {
    id: 'node-night-general',
    communityId: 'node-night',
    name: 'general',
    topic: 'Quiet channel. Still on the clock.',
  },
];

const memberships: Membership[] = [
  'ninelives',
  'whiskersmith',
  'pawscript',
  'goldnip',
  'voidnap',
  GUEST_HANDLE,
].flatMap((handle) => [
  { communityId: 'nine-lives', handle },
  { communityId: 'smithy', handle },
]).concat([
  { communityId: 'node-night', handle: 'voidnap' },
  { communityId: 'node-night', handle: 'ninelives' },
  { communityId: 'node-night', handle: GUEST_HANDLE },
]);

function message(
  id: string,
  channelId: string,
  handle: string,
  text: string,
  createdLabel: string,
): ChatMessage {
  return {
    id,
    channelId,
    handle,
    text,
    localImageUrl: null,
    createdLabel,
    burned,
    cid: demoCid(`msg:${id}`),
    dogeTxid: demoTxid(`msg:${id}`),
    forgedHere: false,
  };
}

/** Oldest first. New demo messages are appended. */
const messages: ChatMessage[] = [
  message(
    'm-origin',
    'nine-lives-general',
    'ninelives',
    'I started as a reaction emoji in the DOGEos Discord. Nine lives. Still here.',
    'Yesterday 9:12 PM',
  ),
  message(
    'm-pool-room',
    'nine-lives-general',
    'goldnip',
    'The pool pairs MEOWE with wrapped DOGE. The lasting record is native Dogecoin.',
    'Yesterday 9:20 PM',
  ),
  message(
    'm-hello',
    'nine-lives-general',
    'ninelives',
    'Memes are forever on Doge. That is the tagline, and it is the job.',
    'Today 8:02 PM',
  ),
  message(
    'm-second',
    'nine-lives-general',
    'whiskersmith',
    'The first life ended when the deployer left. This room is the second one.',
    'Today 8:05 PM',
  ),
  message(
    'm-penny',
    'nine-lives-general',
    'pawscript',
    'A message is about one cent. Part of that cent is burned for good.',
    'Today 8:41 PM',
  ),
  message(
    'm-nodes-room',
    'nine-lives-general',
    'voidnap',
    'Community nodes pin the files and index Dogecoin. They receive 10% of each fee.',
    'Today 9:15 PM',
  ),
  message(
    'm-quiet-room',
    'nine-lives-general',
    'voidnap',
    'If this website goes quiet, the message is still supposed to live in the chain.',
    'Today 9:15 PM',
  ),
  message(
    'm-lore',
    'nine-lives-lore',
    'ninelives',
    'I started as a reaction emoji in the DOGEos Discord. Nine lives. Still here.',
    'Yesterday',
  ),
  message(
    'm-pool',
    'nine-lives-lore',
    'goldnip',
    'The pool pairs MEOWE with wrapped DOGE. The lasting record is native Dogecoin.',
    'Yesterday',
  ),
  message(
    'm-hammer',
    'smithy-general',
    'whiskersmith',
    'Bring a picture from your own camera roll. In this demo it never leaves the phone.',
    '5h ago',
  ),
  message(
    'm-layers',
    'smithy-general',
    'pawscript',
    'The file is meant for IPFS. A Solana memo carries the content id. The profile and the item are written on Dogecoin.',
    '4h ago',
  ),
  message(
    'm-stamp',
    'smithy-memes',
    'goldnip',
    'I will keep the medallion on my shelf until trading is real.',
    '1d ago',
  ),
  message(
    'm-nodes',
    'node-night-general',
    'voidnap',
    'Community nodes pin the files and index Dogecoin. They receive 10% of each fee.',
    '3h ago',
  ),
  message(
    'm-quiet',
    'node-night-general',
    'ninelives',
    'If this website goes quiet, the message is still supposed to live in the chain.',
    '1h ago',
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
    localImageUrl: null,
    creatorHandle,
    ownerHandle,
    previewMeowe,
    cid: demoCid(`item:${id}`),
    dogeTxid: demoTxid(`item:${id}`),
    forgedHere: false,
    urn: id,
    uri: null,
    img: null,
    attributes: {},
    license: null,
    max: 1,
    qty: 1,
    creators: [creatorHandle],
    royalties: {},
    mintedLabel: 'Sample',
    kind: 'image',
    files: [],
    mainFileName: '',
  };
}

function bundledFile(
  itemId: string,
  name: string,
  mime: string,
  size: number,
  localUrl: string,
  text: string | null = null,
): ObjectFile {
  return {
    name,
    mime,
    size,
    cid: demoCid(`item:${itemId}:${name}`),
    localUrl,
    text,
  };
}

function objectItem(
  id: string,
  name: string,
  blurb: string,
  creatorHandle: string,
  ownerHandle: string,
  extra: Pick<
    Item,
    | 'kind'
    | 'files'
    | 'mainFileName'
    | 'urn'
    | 'img'
    | 'attributes'
    | 'license'
    | 'max'
    | 'royalties'
    | 'creators'
    | 'mintedLabel'
  >,
): Item {
  return {
    id,
    name,
    blurb,
    art: null,
    localImageUrl: null,
    creatorHandle,
    ownerHandle,
    previewMeowe: null,
    cid: demoCid(`item:${id}`),
    dogeTxid: demoTxid(`item:${id}`),
    forgedHere: false,
    uri: null,
    qty: 1,
    ...extra,
  };
}

/** Preview prices are illustrations for the shelf. They are not buy quotes. */
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
    'Marks a message that burned its 30% share.',
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
  objectItem(
    'sunbeam',
    'Sunbeam Pair',
    'Two drawings of a cat, day and night. Open either one.',
    'ninelives',
    'ninelives',
    {
      kind: 'image',
      mainFileName: 'sunbeam.svg',
      files: [
        bundledFile('sunbeam', 'sunbeam.svg', 'image/svg+xml', 668, demoMedia.sunbeamUrl),
        bundledFile('sunbeam', 'moon.svg', 'image/svg+xml', 663, demoMedia.moonUrl),
      ],
      urn: `IPFS:${demoCid('item:sunbeam:sunbeam.svg')}/sunbeam.svg`,
      img: `IPFS:${demoCid('item:sunbeam:sunbeam.svg')}/sunbeam.svg`,
      attributes: { mood: 'bright' },
      license: null,
      max: 1,
      royalties: {},
      creators: ['ninelives'],
      mintedLabel: 'Mar 2024',
    },
  ),
  objectItem(
    'purr-loop',
    'Purr Loop',
    'A one-second color loop, drawn for this demo.',
    'whiskersmith',
    'ninelives',
    {
      kind: 'video',
      mainFileName: 'purr.mp4',
      files: [bundledFile('purr-loop', 'purr.mp4', 'video/mp4', 3868, demoMedia.purrUrl)],
      urn: `IPFS:${demoCid('item:purr-loop:purr.mp4')}/purr.mp4`,
      img: null,
      attributes: {},
      license: null,
      max: 8,
      royalties: {},
      creators: ['whiskersmith'],
      mintedLabel: 'Apr 2024',
    },
  ),
  objectItem(
    'night-meow',
    'Night Meow',
    'A short tone, not a song. Two notes, then it stops.',
    'pawscript',
    'ninelives',
    {
      kind: 'audio',
      mainFileName: 'night-meow.wav',
      files: [bundledFile('night-meow', 'night-meow.wav', 'audio/wav', 3644, demoMedia.meowUrl)],
      urn: `IPFS:${demoCid('item:night-meow:night-meow.wav')}/night-meow.wav`,
      img: null,
      attributes: {},
      license: null,
      max: 1,
      royalties: {},
      creators: ['pawscript'],
      mintedLabel: 'May 2024',
    },
  ),
  objectItem(
    'field-guide',
    'Nine Lives Field Guide',
    'A one-page book, plus a cover drawing.',
    'goldnip',
    'ninelives',
    {
      kind: 'pdf',
      mainFileName: 'field-guide.pdf',
      files: [
        bundledFile('field-guide', 'field-guide.pdf', 'application/pdf', 807, demoMedia.guideUrl),
        bundledFile('field-guide', 'guide-cover.svg', 'image/svg+xml', 667, demoMedia.coverUrl),
      ],
      urn: `IPFS:${demoCid('item:field-guide:field-guide.pdf')}/field-guide.pdf`,
      img: `IPFS:${demoCid('item:field-guide:guide-cover.svg')}/guide-cover.svg`,
      attributes: { pages: '1' },
      license: 'CC0',
      max: 100,
      royalties: { pawscript: 5 },
      creators: ['goldnip'],
      mintedLabel: 'Jun 2024',
    },
  ),
  objectItem(
    'cat-clicker',
    'Cat Clicker',
    'A tiny game. Tap the cat. The score stays in the page.',
    'voidnap',
    'ninelives',
    {
      kind: 'app',
      mainFileName: 'index.html',
      files: [
        bundledFile(
          'cat-clicker',
          'index.html',
          'text/html',
          new TextEncoder().encode(demoMedia.indexHtml).length,
          demoMedia.indexUrl,
          demoMedia.indexHtml,
        ),
        bundledFile(
          'cat-clicker',
          'game.js',
          'text/javascript',
          new TextEncoder().encode(demoMedia.gameJs).length,
          demoMedia.gameUrl,
          demoMedia.gameJs,
        ),
        bundledFile(
          'cat-clicker',
          'style.css',
          'text/css',
          new TextEncoder().encode(demoMedia.styleCss).length,
          demoMedia.styleUrl,
          demoMedia.styleCss,
        ),
      ],
      urn: `IPFS:${demoCid('item:cat-clicker:index.html')}/index.html`,
      img: null,
      attributes: {},
      license: null,
      max: 1,
      royalties: {},
      creators: ['voidnap', 'whiskersmith'],
      mintedLabel: 'Jul 2024',
    },
  ),
];

export interface Catalog {
  profiles: Profile[];
  items: Item[];
  communities: Community[];
  channels: Channel[];
  memberships: Membership[];
  messages: ChatMessage[];
}

export function buildCatalog(): Catalog {
  return {
    profiles: profiles.map((profile) => ({ ...profile, look: { ...profile.look } })),
    items: items.map((entry) => ({ ...entry })),
    communities: communities.map((entry) => ({ ...entry })),
    channels: channels.map((entry) => ({ ...entry })),
    memberships: memberships.map((entry) => ({ ...entry })),
    messages: messages.map((entry) => ({ ...entry })),
  };
}
