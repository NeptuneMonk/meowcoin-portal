import { Link } from 'react-router-dom';
import { usePageTitle } from '../usePageTitle';

export function MarketPage() {
  usePageTitle('Marketplace — The Forge');
  return (
    <section className="mpanel">
      <h1>Marketplace</h1>
      <p className="chip">SOON</p>
      <p>Trading coming soon.</p>
      <p className="micro">No global marketplace yet. Listings are per-profile, on that cat’s storefront.</p>
      <Link className="btn" to="/u/ninelives">
        Ninelives’ storefront
      </Link>
    </section>
  );
}
