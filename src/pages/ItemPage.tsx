import { Link, useParams } from 'react-router-dom';
import { ScreenHead } from '../components/AppShell';
import { CopyButton } from '../components/CopyButton';
import { ItemVisual } from '../components/ItemVisual';
import { formatMeowe, shortHash } from '../format';
import { GUEST_HANDLE } from '../services/catalog';
import { useItem, useProfile } from '../services/hooks';
import { usePageTitle } from '../usePageTitle';
import { NotFound } from './NotFound';

export function ItemPage() {
  const { id } = useParams();
  const item = useItem(id);
  const creator = useProfile(item?.creatorHandle);
  const owner = useProfile(item?.ownerHandle);
  usePageTitle(item ? `${item.name} — The Forge` : 'Item — The Forge');
  if (!item) return <NotFound />;

  const back =
    item.ownerHandle === GUEST_HANDLE ? '/store' : `/u/${item.ownerHandle}/store`;

  return (
    <div className="fill pad">
      <ScreenHead title={item.name} backTo={back} backLabel="Storefront" />
      <div className="item-detail">
        <ItemVisual item={item} />
        <div>
          <p>{item.blurb}</p>
          {item.localImageUrl ? (
            <p className="micro">Your image stays on your device in demo mode.</p>
          ) : null}
          <p>
            Minted by{' '}
            {creator ? <Link to={`/u/${creator.handle}`}>{creator.name}</Link> : item.creatorHandle}
            . Held by{' '}
            {owner ? <Link to={`/u/${owner.handle}/store`}>{owner.name}</Link> : item.ownerHandle}.
          </p>
          {item.previewMeowe ? (
            <p className="micro">Shelf illustration: {formatMeowe(item.previewMeowe)} MEOWE. Not for sale.</p>
          ) : (
            <p className="micro">Not listed. Trading is not on.</p>
          )}
          <div className="badge-row">
            <CopyButton label="IPFS CID" value={item.cid} display={shortHash(item.cid, 10, 6)} />
            <CopyButton
              label="Dogecoin record"
              value={item.dogeTxid}
              display={shortHash(item.dogeTxid, 8, 4)}
            />
          </div>
          <button className="btn btn-primary btn-block" type="button" disabled>
            Trading coming soon
          </button>
        </div>
      </div>
    </div>
  );
}
