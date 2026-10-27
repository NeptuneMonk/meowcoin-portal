import { demoCid } from './ids';
import type { ForgeRequest, Item, ObjectFile, ObjectKind } from './types';

const IMAGE_EXT = new Set(['gif', 'webp', 'svg', 'png', 'jpg', 'jpeg', 'bmp', 'avif']);
const VIDEO_EXT = new Set(['mp4', 'webm', 'ogv', 'm4v', 'mov']);
const AUDIO_EXT = new Set(['mp3', 'wav', 'ogg', 'oga']);

export function fileExtension(name: string): string {
  const base = name.split(/[/\\]/).pop() ?? name;
  const dot = base.lastIndexOf('.');
  if (dot <= 0) return '';
  return base.slice(dot + 1).toLowerCase();
}

export function mimeForName(name: string): string {
  const ext = fileExtension(name);
  const known: Record<string, string> = {
    svg: 'image/svg+xml',
    gif: 'image/gif',
    webp: 'image/webp',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    bmp: 'image/bmp',
    avif: 'image/avif',
    mp4: 'video/mp4',
    webm: 'video/webm',
    ogv: 'video/ogg',
    m4v: 'video/mp4',
    mov: 'video/quicktime',
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    ogg: 'audio/ogg',
    oga: 'audio/ogg',
    pdf: 'application/pdf',
    html: 'text/html',
    htm: 'text/html',
    css: 'text/css',
    js: 'text/javascript',
    mjs: 'text/javascript',
  };
  return known[ext] ?? 'application/octet-stream';
}

export function isTextBundleFile(name: string): boolean {
  return ['html', 'htm', 'css', 'js', 'mjs'].includes(fileExtension(name));
}

/** Kind of a single file, from its name and MIME type. */
export function fileKind(name: string, mime: string): ObjectKind {
  const ext = fileExtension(name);
  const normalized = mime.toLowerCase();
  if (ext === 'html' || ext === 'htm' || normalized === 'text/html') return 'app';
  if (normalized.startsWith('image/') || IMAGE_EXT.has(ext)) return 'image';
  if (normalized.startsWith('audio/') || AUDIO_EXT.has(ext)) return 'audio';
  if (normalized.startsWith('video/') || VIDEO_EXT.has(ext)) return 'video';
  if (ext === 'pdf' || normalized === 'application/pdf') return 'pdf';
  return 'file';
}

export function isIndexHtml(name: string): boolean {
  return /(^|\/)index\.html?$/i.test(name);
}

/** Kind of a whole object. An index.html makes it an app. */
export function objectKind(
  files: readonly { name: string; mime: string }[],
  mainFileName: string,
): ObjectKind {
  if (files.some((file) => isIndexHtml(file.name))) return 'app';
  const main = files.find((file) => file.name === mainFileName) ?? files[0];
  if (!main) return 'file';
  return fileKind(main.name, main.mime);
}

export function kindLabel(kind: ObjectKind): string {
  if (kind === 'image') return 'Image';
  if (kind === 'video') return 'Video';
  if (kind === 'audio') return 'Audio';
  if (kind === 'pdf') return 'PDF';
  if (kind === 'app') return 'App';
  return 'File';
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Inline CSS and JS into the HTML entry so a sandboxed iframe can run it
 * from one blob URL. The iframe is not given the parent's origin.
 */
export function packAppHtml(
  files: readonly Pick<ObjectFile, 'name' | 'text'>[],
  mainFileName = '',
): string | null {
  const entry =
    files.find((file) => isIndexHtml(file.name) && file.text) ??
    files.find((file) => file.name === mainFileName && file.text && fileKind(file.name, '') === 'app') ??
    files.find((file) => file.text && fileKind(file.name, '') === 'app');
  if (!entry?.text) return null;

  let html = entry.text;
  for (const asset of files) {
    if (asset === entry || !asset.text) continue;
    const ext = fileExtension(asset.name);
    const base = asset.name.split(/[/\\]/).pop() ?? asset.name;
    const names = [...new Set([asset.name, base])];
    if (ext === 'css') {
      for (const name of names) {
        const link = new RegExp(
          `<link\\b[^>]*href=["'](?:\\./)?${escapeRegExp(name)}["'][^>]*>`,
          'gi',
        );
        html = html.replace(link, () => `<style>${asset.text}</style>`);
      }
    } else if (ext === 'js' || ext === 'mjs') {
      const safe = asset.text.replace(/<\/script/gi, '<\\/script');
      for (const name of names) {
        const script = new RegExp(
          `<script\\b[^>]*src=["'](?:\\./)?${escapeRegExp(name)}["'][^>]*>\\s*</script>`,
          'gi',
        );
        html = html.replace(script, () => `<script>${safe}</script>`);
      }
    }
  }
  return html;
}

type MintRequest = Extract<ForgeRequest, { action: 'mint' }>;

export function itemFromMint(id: string, request: MintRequest, objectCid: string, dogeTxid: string): Item {
  const files: ObjectFile[] = request.files.map((file) => ({
    name: file.name,
    mime: file.mime || mimeForName(file.name),
    size: file.size,
    cid: demoCid(`${objectCid}:${file.name}`),
    localUrl: file.localUrl,
    text: file.text,
  }));
  const main = files.find((file) => file.name === request.mainFileName) ?? files[0];
  const kind = objectKind(files, main?.name ?? '');
  const image = files.find((file) => fileKind(file.name, file.mime) === 'image');
  const royalties: Record<string, number> = {};
  if (request.royaltyPercent && request.royaltyPercent > 0) {
    royalties.you = request.royaltyPercent;
  }
  return {
    id,
    name: request.name.trim(),
    blurb: request.blurb.trim() || 'Minted in this demo.',
    art: null,
    localImageUrl: kind === 'image' ? main?.localUrl ?? null : null,
    creatorHandle: 'you',
    ownerHandle: 'you',
    previewMeowe: null,
    cid: objectCid,
    dogeTxid,
    forgedHere: true,
    urn: request.urn.trim() || (main ? `IPFS:${main.cid}/${main.name}` : objectCid),
    uri: request.uri,
    img: image ? `IPFS:${image.cid}/${image.name}` : null,
    attributes: request.attributes,
    license: request.license,
    max: request.max,
    qty: 1,
    creators: ['you'],
    royalties,
    mintedLabel: 'Just now',
    kind,
    files,
    mainFileName: main?.name ?? '',
  };
}
