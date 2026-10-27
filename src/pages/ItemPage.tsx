import { Link, useParams } from 'react-router-dom';
import { ScreenHead } from '../components/AppShell';
import { CopyButton } from '../components/CopyButton';
import { FileList, ObjectViewer } from '../components/ObjectViewer';
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

  const back = item.ownerHandle === GUEST_HANDLE ? '/store' : `/u/${item.ownerHandle}/store`;
  const local = item.files.some((file) => file.localUrl?.startsWith('blob:'));

  return (
    <div className="fill pad">
      <ScreenHead title={item.name} backTo={back} backLabel="Storefront" />
      <div className="item-detail">
        <div className="item-stage">
          {item.files.length > 0 ? <ObjectViewer item={item} /> : <ItemVisual item={item} />}
          <FileList files={item.files} mainFileName={item.mainFileName} />
        </div>
        <div className="item-copy">
          <p>{item.blurb}</p>
          {local ? <p className="micro">Your files stay on your device in demo mode.</p> : null}
          <p className="micro">URN</p>
          <p className="wrap">{item.urn}</p>
          <p>
            Minted {item.mintedLabel}. Quantity {item.qty}
            {item.max > 0 ? ` of ${item.max}` : ''}.
          </p>
          <p>
            Creators:{' '}
            {item.creators.map((handle, index) => (
              <span key={handle}>
                {index > 0 ? ', ' : null}
                <Link to={`/u/${handle}`}>{handle}</Link>
              </span>
            ))}
            . Held by{' '}
            {owner ? <Link to={`/u/${owner.handle}/store`}>{owner.name}</Link> : item.ownerHandle}.
          </p>
          {creator ? (
            <p className="micro">
              First creator <Link to={`/u/${creator.handle}`}>{creator.name}</Link>.
            </p>
          ) : null}
          {item.license ? <p>License: {item.license}</p> : null}
          {Object.keys(item.attributes).length > 0 ? (
            <dl className="attr-list">
              {Object.entries(item.attributes).map(([key, value]) => (
                <div key={key}>
                  <dt>{key}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
          {Object.keys(item.royalties).length > 0 ? (
            <ul className="plain-list">
              {Object.entries(item.royalties).map(([handle, percent]) => (
                <li key={handle}>
                  Royalty: <Link to={`/u/${handle}`}>{handle}</Link> {percent}%
                </li>
              ))}
            </ul>
          ) : null}
          {item.previewMeowe ? (
            <p className="micro">
              Shelf illustration: {formatMeowe(item.previewMeowe)} MEOWE. Not for sale.
            </p>
          ) : (
            <p className="micro">Not listed. Trading is not on.</p>
          )}
          <div className="badge-row">
            <CopyButton label="Object CID" value={item.cid} display={shortHash(item.cid, 10, 6)} />
            {item.files.map((file) => (
              <CopyButton
                key={file.cid}
                label={`${file.name} CID`}
                value={file.cid}
                display={shortHash(file.cid, 8, 4)}
              />
            ))}
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
