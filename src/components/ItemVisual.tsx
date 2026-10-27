import type { Item } from '../services/types';
import { ItemArt } from './ItemArt';

export function ItemVisual({ item }: { item: Item }) {
  if (item.localImageUrl) {
    return <img className="item-photo" src={item.localImageUrl} alt={item.name} />;
  }
  if (item.art) return <ItemArt id={item.art} />;
  return null;
}
