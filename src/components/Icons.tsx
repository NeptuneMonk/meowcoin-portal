type Name =
  | 'bubble'
  | 'plus'
  | 'friends'
  | 'cube'
  | 'store'
  | 'search'
  | 'mic'
  | 'head'
  | 'gear'
  | 'bell'
  | 'pin'
  | 'people'
  | 'add'
  | 'gift'
  | 'smile'
  | 'chain'
  | 'back'
  | 'x'
  | 'mail'
  | 'down'
  | 'camera'
  | 'share'
  | 'transfer'
  | 'image'
  | 'audio'
  | 'video'
  | 'book'
  | 'app'
  | 'text';

const PATHS: Record<Name, string> = {
  bubble:
    'M12 3C6.5 3 2 6.9 2 11.7c0 2.5 1.2 4.7 3.2 6.3L4.5 21.5c-.1.4.3.7.7.5l4-2c.9.2 1.8.3 2.8.3 5.5 0 10-3.9 10-8.7S17.5 3 12 3z',
  plus: 'M13 5h-2v6H5v2h6v6h2v-6h6v-2h-6z',
  friends:
    'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0 2c-3.3 0-7 1.7-7 4v2h14v-2c0-2.3-3.7-4-7-4zm7.5-2a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm.8 2.1c1.7.7 2.7 1.9 2.7 3.4V19h3v-2c0-1.9-2.6-3.4-5.7-3.9z',
  cube: 'M12 2 3 7v10l9 5 9-5V7l-9-5zm0 2.3L18.6 8 12 11.7 5.4 8 12 4.3zM5 9.7l6 3.4v6.6l-6-3.3V9.7zm8 10v-6.6l6-3.4v6.7l-6 3.3z',
  store: 'M4 4h16l1 5a3 3 0 0 1-2 2.8V20H5v-8.2A3 3 0 0 1 3 9l1-5zm3 9v5h4v-5H7zm6 0v5h4v-5h-4z',
  search:
    'M10 3a7 7 0 0 1 5.6 11.2l5.1 5.1-1.4 1.4-5.1-5.1A7 7 0 1 1 10 3zm0 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10z',
  mic: 'M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.9V21h2v-3.1A7 7 0 0 0 19 11h-2z',
  head: 'M12 3a9 9 0 0 0-9 9v6a3 3 0 0 0 3 3h2v-8H5v-1a7 7 0 0 1 14 0v1h-3v8h2a3 3 0 0 0 3-3v-6a9 9 0 0 0-9-9z',
  gear: 'M19.4 13a7.6 7.6 0 0 0 0-2l2.1-1.6-2-3.5-2.5 1a7.5 7.5 0 0 0-1.7-1L14.9 3h-4l-.4 2.9a7.5 7.5 0 0 0-1.7 1l-2.5-1-2 3.5L6.4 11a7.6 7.6 0 0 0 0 2l-2.1 1.6 2 3.5 2.5-1c.5.4 1.1.7 1.7 1l.4 2.9h4l.4-2.9c.6-.3 1.2-.6 1.7-1l2.5 1 2-3.5L19.4 13zM12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z',
  bell: 'M18 16v-5a6 6 0 0 0-5-5.9V3h-2v2.1A6 6 0 0 0 6 11v5l-2 2v1h16v-1l-2-2zm-6 6a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2z',
  pin: 'M16 3H8v2l1 1v5l-3 3v2h5v5l1 1 1-1v-5h5v-2l-3-3V6l1-1z',
  people:
    'M14 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0zm-4 6c-3.3 0-8 1.7-8 4v2h16v-2c0-2.3-4.7-4-8-4zm6.5-2.2A4 4 0 0 0 16 4.3 4 4 0 0 1 18 8a4 4 0 0 1-1.5 3.8zM18.6 14c1.6.9 3.4 2.2 3.4 4v2h-2v-2c0-1.6-.6-3-1.4-4z',
  add: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z',
  gift: 'M20 7h-2.2A3 3 0 0 0 12 4a3 3 0 0 0-5.8 3H4a1 1 0 0 0-1 1v3h8V7h2v4h8V8a1 1 0 0 0-1-1zM9 7a1 1 0 1 1 1-1v1H9zm5 0V6a1 1 0 1 1 1 1h-1zM4 13v7h7v-7H4zm9 0v7h7v-7h-7z',
  smile:
    'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM8.5 8a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm7 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zM12 18a6 6 0 0 1-5.2-3h10.4A6 6 0 0 1 12 18z',
  chain:
    'M10.6 13.4a1 1 0 0 1 0-1.4l3.5-3.5a3 3 0 1 1 4.2 4.2l-2 2-1.4-1.4 2-2a1 1 0 1 0-1.4-1.4L12 13.4a1 1 0 0 1-1.4 0zM8.3 20.3a3 3 0 0 1-4.2-4.2l2-2 1.4 1.4-2 2a1 1 0 1 0 1.4 1.4l3.5-3.5 1.4 1.4-3.5 3.5z',
  back: 'M20 11H7.8l5.6-5.6L12 4l-8 8 8 8 1.4-1.4L7.8 13H20z',
  x: 'M18.4 4.2 12 10.6 5.6 4.2 4.2 5.6 10.6 12l-6.4 6.4 1.4 1.4 6.4-6.4 6.4 6.4 1.4-1.4-6.4-6.4 6.4-6.4z',
  mail: 'M3 5h18v14H3V5zm2 2v.5l7 4.5 7-4.5V7H5z',
  down: 'M7 10l5 5 5-5z',
  camera:
    'M9 3 7.2 5H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3.2L15 3H9zm3 14a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9z',
  share:
    'M18 16a3 3 0 0 0-2.2 1l-7-4a3 3 0 0 0 0-2l7-4A3 3 0 1 0 15 5l-7 4a3 3 0 1 0 0 6l7 4A3 3 0 1 0 18 16z',
  transfer:
    'M7 7h11l-3-3 1.4-1.4L21.8 8l-5.4 5.4L15 12l3-3H7V7zm10 10H6l3 3-1.4 1.4L2.2 16l5.4-5.4L9 12l-3 3h11v2z',
  image:
    'M21 5v14H3V5h18zm-2 2H5v8.6l3.5-3.6 3 3 4-5 3.5 4.4V7zM8.5 9.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z',
  audio: 'M12 3v10.6A4 4 0 1 0 14 17V7h4V3h-6z',
  video: 'M8 5v14l11-7z',
  book: 'M6 2h12v20l-6-3-6 3V2z',
  app: 'M8.6 16.6 4 12l4.6-4.6L10 8.8 6.8 12l3.2 3.2-1.4 1.4zm6.8 0L14 15.2l3.2-3.2L14 8.8l1.4-1.4L20 12l-4.6 4.6z',
  text: 'M4 5h16v2H4V5zm0 4h16v2H4V9zm0 4h10v2H4v-2z',
};

export function Icon({
  name,
  className = 'i',
}: {
  name: Name;
  className?: string;
}) {
  const wide = name === 'chain' || name === 'down' ? 16 : name === 'camera' ? 26 : name === 'share' || name === 'transfer' ? 18 : undefined;
  return (
    <svg className={className} viewBox="0 0 24 24" width={wide} height={wide} aria-hidden="true">
      <path d={PATHS[name]} />
    </svg>
  );
}

export type TileKind = 'image' | 'audio' | 'video' | 'book' | 'app' | 'text';
