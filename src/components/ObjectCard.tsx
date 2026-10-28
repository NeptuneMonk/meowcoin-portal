import { useState } from 'react';
import { Link } from 'react-router-dom';
import { accentVars, nameColor } from '../accent';
import { displayHandle } from '../avatars';
import { findObject, type ObjectDirectory } from '../services/directory';
import { GUEST_HANDLE } from '../services/catalog';
import { useChannels, useCommunities, useItems, useMemberships, useProfiles } from '../services/hooks';
import { Avatar } from './Avatar';
import { ItemVisual } from './ItemVisual';
import { useAccent } from './useAccent';

export function ObjectCard({ address }: { address: string }) {
  const items = useItems();
  const profiles = useProfiles();
  const spaces = useCommunities();
  const channels = useChannels();
  const memberships = useMemberships();
  const found = findObject(address, { items, profiles, spaces, channels, memberships } satisfies ObjectDirectory);
  if (!found) {
    return (
      <p className="obj-miss" role="status">
        That address is not found in demo data.
      </p>
    );
  }
  if (found.kind === 'item') {
    const owner = profiles.find((profile) => profile.handle === found.item.ownerHandle);
    return (
      <div className="obj-card">
        <div className="thumb">
          <ItemVisual item={found.item} />
        </div>
        <div className="meta">
          <b>{found.item.name}</b>
          <span className="micro">Held by {owner?.name ?? found.item.ownerHandle}</span>
          <Link className="btn sec" to={`/item/${found.item.id}`}>
            View
          </Link>
        </div>
      </div>
    );
  }
  if (found.kind === 'profile') return <ProfileCard handle={found.profile.handle} />;
  if (found.kind === 'space') {
    return (
      <div className="obj-card">
        <span className="space-pill" style={{ background: found.space.hue }}>
          {found.space.mark}
        </span>
        <div className="meta">
          <b>{found.space.name}</b>
          <span className="micro">
            {found.memberCount} {found.memberCount === 1 ? 'member' : 'members'}
          </span>
          <Link className="btn sec" to={`/c/${found.space.id}`}>
            Open Space
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="obj-card">
      <span className="chan-mark">#</span>
      <div className="meta">
        <b>#{found.channel.name}</b>
        <span className="micro">in {found.space.name}</span>
        <Link className="btn sec" to={`/c/${found.space.id}/${found.channel.id}`}>
          Open channel
        </Link>
      </div>
    </div>
  );
}

function ProfileCard({ handle }: { handle: string }) {
  const profiles = useProfiles();
  const profile = profiles.find((entry) => entry.handle === handle);
  const accent = useAccent(handle);
  const [note, setNote] = useState('');
  if (!profile) {
    return (
      <p className="obj-miss" role="status">
        That address is not found in demo data.
      </p>
    );
  }
  return (
    <div className="obj-card profile" style={accentVars(accent)}>
      <div className="who">
        <Avatar profile={profile} size={44} />
        <div>
          <b style={{ color: nameColor(accent) }}>{profile.name}</b>
          <span className="micro">@{displayHandle(handle)}</span>
        </div>
      </div>
      <div className="acts">
        <button
          className="btn sec"
          type="button"
          onClick={() => setNote('Follows are paid in MEOWE. Nothing is followed in this demo.')}
        >
          Follow
        </button>
        <Link className="btn" to={handle === GUEST_HANDLE ? '/me' : `/u/${handle}`}>
          View
        </Link>
      </div>
      {note ? <p className="micro follow-note">{note}</p> : null}
    </div>
  );
}
