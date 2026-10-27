import { Link, useParams } from 'react-router-dom';
import { CopyButton } from '../components/CopyButton';
import { ItemArt } from '../components/ItemArt';
import { formatMeowe, shortHash } from '../format';
import { useItem, useProfiles } from '../services/hooks';
import { usePageTitle } from '../usePageTitle';

export function ItemPage() {
  const { id } = useParams();
  const item = useItem(id);
  const profiles = useProfiles();
  usePageTitle(item ? `${item.name} — The Forge` : 'Item — The Forge');

  if (!item) {
    return (
      <div className="wrap page">
        <h1>That item is not in the demo</h1>
        <Link className="btn btn-primary" to="/market">
          Back to the marketplace
        </Link>
      </div>
    );
  }

  const creator = profiles.find((profile) => profile.handle === item.creatorHandle);
  const owner = profiles.find((profile) => profile.handle === item.ownerHandle);

  return (
    <div className="wrap page narrow">
      <p>
        <Link to="/market">Back to the marketplace</Link>
      </p>
      <article className="item-detail">
        <ItemArt id={item.art} />
        <div>
          <p className="kicker">Dogecoin P2FK object</p>
          <h1>{item.name}</h1>
          {item.forgedHere ? <p className="ribbon">Forged in this demo</p> : null}
          <p>{item.blurb}</p>
          <p className="price-xl">
            {item.previewMeowe === null
              ? 'Not listed'
              : `${formatMeowe(item.previewMeowe)} MEOWE`}
          </p>
          <p className="micro">
            {item.previewMeowe === null
              ? 'Forged in the demo, and not for sale.'
              : 'Preview price only. You cannot buy this.'}
          </p>
          <button type="button" className="btn btn-primary" disabled>
            Trading coming soon
          </button>
          <dl className="facts">
            <div>
              <dt>Creator</dt>
              <dd>{creator ? <Link to={`/profile/${creator.handle}`}>{creator.name}</Link> : 'You'}</dd>
            </div>
            <div>
              <dt>Holder</dt>
              <dd>{owner ? <Link to={`/profile/${owner.handle}`}>{owner.name}</Link> : 'You'}</dd>
            </div>
            <div>
              <dt>Chain</dt>
              <dd>Dogecoin</dd>
            </div>
            <div>
              <dt>Format</dt>
              <dd>Sup-style P2FK</dd>
            </div>
          </dl>
          <div className="badge-row">
            <CopyButton label="IPFS CID" value={item.cid} display={shortHash(item.cid, 10, 6)} />
            <CopyButton
              label="Dogecoin record"
              value={item.dogeTxid}
              display={shortHash(item.dogeTxid, 8, 4)}
            />
          </div>
        </div>
      </article>
    </div>
  );
}
