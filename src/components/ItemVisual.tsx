import { fileKind, kindLabel } from '../services/objects';
import type { Item } from '../services/types';
import { ItemArt } from './ItemArt';

export function ItemVisual({ item }: { item: Item }) {
  const main = item.files.find((file) => file.name === item.mainFileName) ?? item.files[0];
  const cover = item.files.find((file) => file.localUrl && fileKind(file.name, file.mime) === 'image');
  if (item.localImageUrl) {
    return <img className="item-photo" src={item.localImageUrl} alt="" />;
  }
  if (item.kind === 'image' && main?.localUrl) {
    return <img className="item-photo" src={main.localUrl} alt="" />;
  }
  if (item.kind === 'pdf' && cover?.localUrl) {
    return <img className="item-photo" src={cover.localUrl} alt="" />;
  }
  if (item.art) return <ItemArt id={item.art} />;
  return (
    <div className="kind-tile" role="img" aria-label={kindLabel(item.kind)}>
      {kindLabel(item.kind)}
    </div>
  );
}
