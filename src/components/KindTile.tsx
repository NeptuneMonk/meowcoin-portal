import type { Item } from '../services/types';
import { Icon, type TileKind } from './Icons';

export function tileKind(item: Item): TileKind {
  if (item.kind === 'pdf') return 'book';
  if (item.kind === 'audio') return 'audio';
  if (item.kind === 'video') return 'video';
  if (item.kind === 'app') return 'app';
  if (item.art === 'scroll' || item.kind === 'file') return 'text';
  return 'image';
}

export function editionLabel(item: Item): string {
  if (item.max > 1) return `edition of ${item.max}`;
  return '1 of 1';
}

const TILE_LABEL: Record<TileKind, string> = {
  image: 'Image',
  audio: 'Audio',
  video: 'Video',
  book: 'Book',
  app: 'App',
  text: 'Text',
};

export function KindTile({ item, label = true }: { item?: Item; kind?: TileKind; label?: boolean }) {
  const kind = item ? tileKind(item) : 'image';
  return (
    <div className="tile" role="img" aria-label={TILE_LABEL[kind]}>
      {label ? <span className="k">{kind}</span> : null}
      <Icon name={kind} className="tile-ico" />
    </div>
  );
}
