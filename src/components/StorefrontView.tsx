import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { accentVars, nameColor } from '../accent';
import { displayHandle } from '../avatars';
import { GUEST_HANDLE } from '../services/catalog';
import { useOwnedCommunities, useProfile, useShelf } from '../services/hooks';
import type { Item } from '../services/types';
import { Avatar } from './Avatar';
import { Icon } from './Icons';
import { KindTile, editionLabel } from './KindTile';
import { useAccent } from './useAccent';

const ORDER = [
  'medallion',
  'sunbeam',
  'night-meow',
  'purr-loop',
  'field-guide',
  'cat-clicker',
  'plate',
  'hammer',
  'stamp',
  'scroll',
  'crown',
];

function sortItems(items: readonly Item[]): Item[] {
  return [...items].sort((a, b) => {
    const ai = ORDER.indexOf(a.id);
    const bi = ORDER.indexOf(b.id);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });
}

export function StorefrontView({
  handle,
  mine = false,
}: {
  handle: string;
  mine?: boolean;
}) {
  const profile = useProfile(handle);
  const shelf = useShelf(handle);
  const ownedSpaces = useOwnedCommunities(handle);
  const accent = useAccent(handle);
  const [tab, setTab] = useState<'store' | 'held' | 'spaces'>('store');
  const [query, setQuery] = useState('');
  const [note, setNote] = useState('');

  const held = useMemo(
    () => sortItems(shelf.filter((item) => item.ownerHandle === handle)),
    [shelf, handle],
  );
  const store = useMemo(() => sortItems(shelf), [shelf]);
  const shown = (tab === 'held' ? held : store).filter((item) =>
    item.name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  if (!profile) return <p className="pad">That profile is not in this demo.</p>;

  const goProfile = handle === GUEST_HANDLE ? '/me' : `/u/${handle}`;

  return (
    <div className="store" style={accentVars(accent)}>
      <div className="main-h">
        <Icon name="store" />
        <span className="t">
          {profile.name}
          {mine ? '’s objects' : '’s storefront'}
        </span>
        <div className="tools">
          <button type="button" className="tool" aria-label="Share" onClick={() => setNote('This demo does not share a link.')}>
            <Icon name="share" />
          </button>
          <label className="search">
            <span className="sr-only">Search objects</span>
            <input
              value={query}
              placeholder="Search objects"
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
        </div>
      </div>
      <div className="store-scroll">
        <div className="banner" />
        <div className="store-top">
          <span className="bigav">
            <Avatar profile={profile} size={128} status />
          </span>
          <div className="who">
            <div className="pname" style={{ fontSize: 30, color: nameColor(accent) }}>
              {profile.name}
            </div>
            <div className="phandle">
              @{displayHandle(handle)}{' '}
              <span className="chip role">{profile.role}</span>
            </div>
          </div>
          <div className="acts">
            {handle === GUEST_HANDLE ? (
              <Link className="btn acc" to="/mint">
                <Icon name="add" /> Mint an item
              </Link>
            ) : (
              <Link className="btn acc" to={`/chats/${handle}`}>
                <Icon name="bubble" /> Message
              </Link>
            )}
            <button className="btn sec" type="button" onClick={() => setNote('Giving an object is not switched on. Trading coming soon.')}>
              <Icon name="transfer" /> Give an object
            </button>
            <button className="btn sec icon-only" type="button" aria-label="Share" onClick={() => setNote('This demo does not share a link.')}>
              <Icon name="share" />
            </button>
          </div>
        </div>
        {note ? <p className="store-note">{note}</p> : null}
        <div className="store-wrap">
          <div className="store-l">
            <div className="tabs" role="tablist">
              <button type="button" className={tab === 'store' ? 'on' : ''} onClick={() => setTab('store')}>
                Storefront
              </button>
              <button type="button" className={tab === 'held' ? 'on' : ''} onClick={() => setTab('held')}>
                Objects held
              </button>
              <button type="button" className={tab === 'spaces' ? 'on' : ''} onClick={() => setTab('spaces')}>
                Spaces
              </button>
            </div>
            {tab === 'spaces' ? (
              <ul className="space-owned">
                {ownedSpaces.length === 0 ? (
                  <li className="micro">
                    {mine ? (
                      <>
                        None yet. <Link to="/communities/new">Mint a Space</Link>.
                      </>
                    ) : (
                      `${profile.name} does not own a Space in this demo.`
                    )}
                  </li>
                ) : (
                  ownedSpaces.map((space) => (
                    <li key={space.id}>
                      <Link to={`/c/${space.id}`}>
                        <span className="space-pill" style={{ background: space.hue }}>
                          {space.mark}
                        </span>
                        <span>
                          <b>{space.name}</b>
                          <small>On-chain object · transferable</small>
                        </span>
                      </Link>
                    </li>
                  ))
                )}
              </ul>
            ) : shown.length === 0 ? (
              <p className="micro">
                {mine ? 'The shelf is empty. Mint an item and it shows up here, on this device only.' : 'Nothing on this shelf.'}
              </p>
            ) : (
              <div className="grid">
                {shown.map((item) => (
                  <Link className="listing" key={item.id} to={`/item/${item.id}`}>
                    <KindTile item={item} />
                    <div className="in">
                      <div className="n">{item.name}</div>
                      <div className="m">
                        <span>{editionLabel(item)}</span>
                      </div>
                      <div className="soon">Trading coming soon</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
          <aside className="store-r">
            <div className="card">
              <h4>About</h4>
              {profile.bio}
            </div>
            <div className="card">
              <h4>Spaces owned</h4>
              {ownedSpaces.length === 0 ? (
                <div className="micro">None yet</div>
              ) : (
                ownedSpaces.map((space) => (
                  <Link key={space.id} className="owned-row" to={`/c/${space.id}`}>
                    <span className="space-pill" style={{ background: space.hue }}>
                      {space.mark}
                    </span>
                    <span>
                      <b>{space.name}</b>
                      <small>On-chain object · transferable</small>
                    </span>
                  </Link>
                ))
              )}
            </div>
            <div className="card">
              <h4>Profile colour</h4>
              <span className="swatch" />
              Picked from avatar · <b className="hex">{accent.neutral ? 'neutral' : accent.acc}</b>
              <div className="micro follow">
                Banner, name and buttons follow the picture. Change the picture, the colour follows.
              </div>
            </div>
            <div className="note">
              <Icon name="chain" /> No global marketplace yet. Listings are per-profile.
            </div>
            {mine ? (
              <p className="micro follow">
                <Link to={goProfile}>Profile picture</Link>
              </p>
            ) : null}
          </aside>
        </div>
      </div>
    </div>
  );
}

export function MobileProfile({ handle }: { handle: string }) {
  const profile = useProfile(handle);
  const shelf = useShelf(handle);
  const accent = useAccent(handle);
  const items = sortItems(shelf).slice(0, 4);
  if (!profile) return <p className="pad">That profile is not in this demo.</p>;
  const back = '/chats';

  return (
    <section className="mprof" style={accentVars(accent)}>
      <Link className="mclose" style={{ left: 12 }} to={back} aria-label="Back">
        <Icon name="back" />
      </Link>
      <div className="banner" />
      <div className="pbody">
        <span className="bigav">
          <Avatar profile={profile} size={92} status />
        </span>
        <div className="pname" style={{ fontSize: 26, color: nameColor(accent) }}>
          {profile.name}
        </div>
        <div className="phandle">
          @{displayHandle(handle)} <span className="chip role">{profile.role}</span>
        </div>
        <div className="acts">
          {handle === GUEST_HANDLE ? (
            <Link className="btn acc" to="/mint">
              <Icon name="add" /> Mint
            </Link>
          ) : (
            <Link className="btn acc" to={`/chats/${handle}`}>
              <Icon name="bubble" /> Message
            </Link>
          )}
          <span className="btn sec">
            <Icon name="transfer" /> Give
          </span>
        </div>
        <div className="card">
          <h4>About</h4>
          {profile.bio}
          <div className="micro follow">
            <span className="swatch" />
            Colour picked from avatar · <b className="hex">{accent.neutral ? 'neutral' : accent.acc}</b>
          </div>
        </div>
        <div className="tabs">
          <div className="on">Storefront</div>
          <div>Objects held</div>
          <div>Spaces</div>
        </div>
        <div className="mgrid">
          {items.map((item) => (
            <Link className="listing" key={item.id} to={`/item/${item.id}`}>
              <KindTile item={item} />
              <div className="in">
                <div className="n">{item.name}</div>
                <div className="m">
                  <span>{editionLabel(item)}</span>
                </div>
                <div className="soon">Trading coming soon</div>
              </div>
            </Link>
          ))}
        </div>
        {items.length === 0 ? <p className="micro">The shelf is empty.</p> : null}
      </div>
    </section>
  );
}
