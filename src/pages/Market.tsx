import { Link } from 'react-router-dom';
import { ItemCard } from '../components/ItemCard';
import { useItems } from '../services/hooks';
import { usePageTitle } from '../usePageTitle';

export function Market() {
  usePageTitle('Marketplace — The Forge');
  const items = useItems();

  return (
    <div className="wrap page">
      <header className="page-head">
        <p className="kicker">Preview only</p>
        <h1>Marketplace</h1>
        <p>
          Dogecoin P2FK objects from the demo. You can look. You cannot buy. Trading comes later,
          and it will be priced in MEOWE.
        </p>
      </header>
      <div className="card soon-banner">
        <p>
          <strong>Trading coming soon.</strong> Prices on these cards are illustrations, so you can
          see the shape of a listing.
        </p>
        <Link to="/try/mint">Mint an item in the demo</Link>
      </div>
      <ul className="market-grid">
        {items.map((item) => (
          <li key={item.id}>
            <ItemCard item={item} />
          </li>
        ))}
      </ul>
    </div>
  );
}
