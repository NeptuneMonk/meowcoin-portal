const CAT_PATH =
  'M14.5 27.5 L16.5 8.5 L27.5 18.8 Q32 17.6 36.5 18.8 L47.5 8.5 L49.5 27.5 Q53.5 34.5 50.5 42.5 Q45.5 55 32 55 Q18.5 55 13.5 42.5 Q10.5 34.5 14.5 27.5Z';

function catSvg(bg: string, fg: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="${bg}"/><path d="${CAT_PATH}" fill="${fg}"/><ellipse cx="25" cy="36" rx="2.6" ry="3.4" fill="${bg}"/><ellipse cx="39" cy="36" rx="2.6" ry="3.4" fill="${bg}"/><path d="M30 43 L34 43 L32 45.5Z" fill="${bg}"/></svg>`;
}

function svgUrl(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/** Plain grey placeholder. Accent stays neutral because the picture has no saturated colour. */
export const GREY_CAT = svgUrl(catSvg('#4e5058', '#a4a9b2'));

const COLORED: Record<string, readonly [string, string]> = {
  ninelives: ['#8b5cf6', '#2a1763'],
  voidnap: ['#1fa595', '#0a3a35'],
  pawscript: ['#e0528a', '#4e1129'],
};

export function avatarUrl(handle: string): string {
  const pair = COLORED[handle];
  if (!pair) return GREY_CAT;
  return svgUrl(catSvg(pair[0], pair[1]));
}

const OFFLINE = new Set(['goldnip']);

export function presenceOf(handle: string): 'online' | 'offline' {
  return OFFLINE.has(handle) ? 'offline' : 'online';
}

export function displayHandle(handle: string): string {
  return handle === 'you' ? 'NeptuneMonk' : handle;
}
