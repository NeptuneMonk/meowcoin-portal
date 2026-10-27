import { Link } from 'react-router-dom';
import { formatMeowe } from '../format';
import { useProfiles } from '../services/hooks';
import type { Item } from '../services/types';
import { ItemArt } from './ItemArt';

export function ItemCard({ item }: { item: Item }) {
  const profiles = useProfiles();
  const creator = profiles.find((profile) => profile.handle === item.creatorHandle);

  return (
    <Link className="item-card" to={`/market/${item.id}`}>
      <ItemArt id={item.art} decorative />
      {item.forgedHere ? <span className="ribbon">Forged in this demo</span> : null}
      <h2>{item.name}</h2>
      <p>{creator ? creator.name : 'You'}</p>
      <p className="price">
        {item.previewMeowe === null ? 'Not listed' : `${formatMeowe(item.previewMeowe)} MEOWE`}
      </p>
      <p className="micro">P2FK · Dogecoin</p>
    </Link>
  );
}
