import { Link } from 'react-router-dom';
import { ScreenHead } from '../components/AppShell';
import { ItemVisual } from '../components/ItemVisual';
import { GUEST_HANDLE } from '../services/catalog';
import { useOwnedCommunities, useProfile, useShelf } from '../services/hooks';
import type { Item } from '../services/types';
import { usePageTitle } from '../usePageTitle';

export function StorePage() {
  usePageTitle('My store — The Forge');
  return (
    <div className="fill pad">
      <ScreenHead title="My store" />
      <Storefront handle={GUEST_HANDLE} mine />
    </div>
  );
}

export function Storefront({ handle, mine = false }: { handle: string; mine?: boolean }) {
  const profile = useProfile(handle);
  const items = useShelf(handle);
  const owned = useOwnedCommunities(handle);
  if (!profile) return <p>That profile is not in this demo.</p>;

  return (
    <div>
      <p className="micro">
        {mine ? 'Items you mint show up here.' : `Items ${profile.name} minted or holds.`} Trading
        is not on.
      </p>
      {mine ? (
        <div className="btn-row">
          <Link className="btn btn-primary" to="/mint">
            Mint an item
          </Link>
        </div>
      ) : null}
      {items.length === 0 ? (
        <p className="card">The shelf is empty.</p>
      ) : (
        <ul className="shelf">
          {items.map((item) => (
            <li key={item.id}>
              <ItemTile item={item} />
            </li>
          ))}
        </ul>
      )}
      <h2>Communities</h2>
      {owned.length === 0 ? (
        <p className="micro">
          {mine ? 'You have not created a community yet.' : `${profile.name} does not own one here.`}
        </p>
      ) : (
        <ul className="plain-list">
          {owned.map((community) => (
            <li key={community.id}>
              <Link to={`/c/${community.id}`}>{community.name}</Link>
              <span className="micro"> {community.topic}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ItemTile({ item }: { item: Item }) {
  return (
    <Link className="shelf-card" to={`/item/${item.id}`}>
      <ItemVisual item={item} />
      <span>
        <strong>{item.name}</strong>
        <small>{item.forgedHere ? 'Forged in this demo' : 'Sample item'}</small>
      </span>
    </Link>
  );
}
