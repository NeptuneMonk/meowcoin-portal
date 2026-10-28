export interface Palette {
  acc: string;
  l: string;
  d: string;
  ink: string;
  soft: string;
  line: string;
  neutral: boolean;
}

function hex(r: number, g: number, b: number): string {
  return (
    '#' +
    [r, g, b]
      .map((v) =>
        Math.round(Math.max(0, Math.min(255, v)))
          .toString(16)
          .padStart(2, '0'),
      )
      .join('')
  );
}

function rgb(h: string): [number, number, number] {
  const value = h.replace('#', '');
  return [0, 2, 4].map((i) => parseInt(value.substr(i, 2), 16)) as [number, number, number];
}

function mix(h: string, t: string, p: number): string {
  const a = rgb(h);
  const b = rgb(t);
  return hex(a[0] + (b[0] - a[0]) * p, a[1] + (b[1] - a[1]) * p, a[2] + (b[2] - a[2]) * p);
}

function lum(h: string): number {
  const [r, g, b] = rgb(h).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function paletteFrom(c: string, neutral = false): Palette {
  return {
    acc: c,
    l: neutral ? '#dbdee1' : mix(c, '#ffffff', 0.38),
    d: mix(c, '#000000', 0.45),
    ink: lum(c) > 0.45 ? '#111214' : '#ffffff',
    soft: neutral ? 'rgba(255,255,255,.04)' : `${c}22`,
    line: neutral ? '#4e5058' : `${c}66`,
    neutral,
  };
}

export const NEUTRAL = paletteFrom('#6d6f78', true);

export function nameColor(p: Palette): string {
  return p.neutral ? '#f2f3f5' : p.l;
}

export function accentVars(p: Palette): Record<string, string> {
  return {
    '--acc': p.acc,
    '--acc-l': p.l,
    '--acc-d': p.d,
    '--acc-ink': p.ink,
    '--acc-soft': p.soft,
    '--acc-line': p.line,
  };
}

const cache = new Map<string, Promise<string | null>>();

/** Dominant saturated colour of an image. Greys and near-black are skipped. */
export function dominant(url: string): Promise<string | null> {
  const hit = cache.get(url);
  if (hit) return hit;
  const pending = new Promise<string | null>((resolve) => {
    const im = new Image();
    im.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 40;
      canvas.height = 40;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(null);
        return;
      }
      ctx.drawImage(im, 0, 0, 40, 40);
      let data: Uint8ClampedArray;
      try {
        data = ctx.getImageData(0, 0, 40, 40).data;
      } catch {
        resolve(null);
        return;
      }
      const bins: Record<string, [number, number, number, number]> = {};
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const mx = Math.max(r, g, b);
        const mn = Math.min(r, g, b);
        const sat = mx ? (mx - mn) / mx : 0;
        if (sat < 0.25 || mx < 60) continue;
        const key = `${r >> 4},${g >> 4},${b >> 4}`;
        const bin = bins[key] ?? [0, 0, 0, 0];
        bin[0] += r;
        bin[1] += g;
        bin[2] += b;
        bin[3] += 1;
        bins[key] = bin;
      }
      let best: [number, number, number, number] | null = null;
      for (const key of Object.keys(bins)) {
        const bin = bins[key];
        if (!best || bin[3] > best[3]) best = bin;
      }
      resolve(best ? hex(best[0] / best[3], best[1] / best[3], best[2] / best[3]) : null);
    };
    im.onerror = () => resolve(null);
    im.src = url;
  });
  cache.set(url, pending);
  return pending;
}
