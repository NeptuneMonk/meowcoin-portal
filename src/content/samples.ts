import { profileAddress } from '../services/directory';

/** Sample direct threads for the Messages screen. Nothing here is sent or encrypted. */
export interface SampleLine {
  handle: string;
  text: string;
  time: string;
  cont?: boolean;
  /** Object address shared in this sample line. */
  sharedAddress?: string;
}

export type SampleEntry = { day: string } | SampleLine;

export interface SampleThread {
  handle: string;
  preview: string;
  when: string;
  entries: SampleEntry[];
}

export function isDay(entry: SampleEntry): entry is { day: string } {
  return 'day' in entry;
}

export const SAMPLE_THREADS: SampleThread[] = [
  {
    handle: 'voidnap',
    preview: 'Ping me when the first one is minted.',
    when: '9:33 PM',
    entries: [
      { day: 'Today' },
      {
        handle: 'voidnap',
        text: 'Saw your Space idea. If a Space is an object, I can pin its icon like any other file.',
        time: 'Today 9:30 PM',
      },
      {
        handle: 'you',
        text: "That's the plan. Mint it, own it, give it away if you want.",
        time: 'Today 9:32 PM',
      },
      {
        handle: 'voidnap',
        text: 'Night shift. Pins what the others mint and keeps an eye on the index.',
        time: 'Today 9:33 PM',
      },
      {
        handle: 'voidnap',
        text: 'Ping me when the first one is minted.',
        time: 'Today 9:33 PM',
        cont: true,
      },
      {
        handle: 'you',
        text: 'This is Ninelives, as an object. Every object has its own address.',
        time: 'Today 9:34 PM',
        sharedAddress: profileAddress('ninelives'),
      },
    ],
  },
  {
    handle: 'ninelives',
    preview: 'Memes are forever on Doge.',
    when: '8:02 PM',
    entries: [
      { day: 'Today' },
      {
        handle: 'ninelives',
        text: 'Memes are forever on Doge. That is the tagline, and it is the job.',
        time: 'Today 8:02 PM',
      },
    ],
  },
  {
    handle: 'pawscript',
    preview: 'A message is about one cent…',
    when: 'Yesterday',
    entries: [
      { day: 'Yesterday' },
      {
        handle: 'pawscript',
        text: 'A message is about one cent. Part of that cent is burned for good.',
        time: 'Yesterday 8:41 PM',
      },
    ],
  },
  {
    handle: 'whiskersmith',
    preview: 'Bring a picture from your own camera roll.',
    when: 'Mon',
    entries: [
      { day: 'Mon' },
      {
        handle: 'whiskersmith',
        text: 'Bring a picture from your own camera roll. In this demo it never leaves the phone.',
        time: 'Mon 4:12 PM',
      },
    ],
  },
  {
    handle: 'goldnip',
    preview: 'I will keep the medallion on my shelf until trading is real.',
    when: 'Sun',
    entries: [
      { day: 'Sun' },
      {
        handle: 'goldnip',
        text: 'I will keep the medallion on my shelf until trading is real.',
        time: 'Sun 6:40 PM',
      },
    ],
  },
];

export function sampleThread(handle: string | undefined): SampleThread | undefined {
  return SAMPLE_THREADS.find((thread) => thread.handle === handle);
}
