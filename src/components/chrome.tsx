import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { accentVars, nameColor } from '../accent';
import { displayHandle, presenceOf } from '../avatars';
import { SAMPLE_THREADS } from '../content/samples';
import { PRIVATE_DMS } from '../content/site';
import { shortHash } from '../format';
import { GUEST_HANDLE } from '../services/catalog';
import { SPACE_LICENSE, listedChannels } from '../services/directory';
import {
  useChannels,
  useCommunities,
  useGuest,
  useJoinedCommunities,
  useMemberships,
  useProfile,
  useProfiles,
  useShelf,
} from '../services/hooks';
import type { Community } from '../services/types';
import type { Channel } from '../services/types';
import { Avatar } from './Avatar';
import { ChannelDetails, ChannelInfoButton } from './ChannelDetails';
import { Icon } from './Icons';
import { KindTile } from './KindTile';
import { useAccent } from './useAccent';

export function Rail({
  messagesOn,
  spaceId,
  mintOn,
  forgeOn,
}: {
  messagesOn: boolean;
  spaceId?: string;
  mintOn: boolean;
  forgeOn: boolean;
}) {
  const joined = useJoinedCommunities();
  return (
    <nav className="rail" aria-label="Spaces">
      <Link className={`ri dm${messagesOn ? ' on' : ''}`} to="/chats" title="Messages" aria-label="Messages" aria-current={messagesOn ? 'page' : undefined}>
        {messagesOn ? <span className="pip sel" /> : null}
        <Icon name="bubble" />
      </Link>
      <div className="sep" />
      <Link className={`ri sp${forgeOn ? ' on' : ''}`} to="/about" title="The Forge" aria-label="The Forge" style={{ background: '#5865f2', color: '#fff' }}>
        {forgeOn ? <span className="pip sel" /> : null}
        <span className="emoji">🐾</span>
      </Link>
      {joined.map((space) => {
        const on = space.id === spaceId;
        return (
          <Link
            key={space.id}
            className={`ri sp${on ? ' on' : ''}`}
            style={{ background: space.hue, color: '#fff' }}
            to={`/c/${space.id}`}
            title={space.name}
            aria-label={space.name}
            aria-current={on ? 'page' : undefined}
          >
            {on ? <span className="pip sel" /> : null}
            <Mark mark={space.mark} />
          </Link>
        );
      })}
      <Link className={`ri plus${mintOn ? ' on' : ''}`} to="/communities/new" title="Mint a Space" aria-label="Mint a Space" aria-current={mintOn ? 'page' : undefined}>
        {mintOn ? <span className="pip sel" /> : null}
        <Icon name="plus" />
      </Link>
      <div className="gap" />
    </nav>
  );
}

function Mark({ mark }: { mark: string }) {
  const emoji = /\p{Extended_Pictographic}/u.test(mark);
  return <span className={emoji ? 'emoji' : undefined}>{mark}</span>;
}

export function DmSide({ active }: { active?: string }) {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  const threads = SAMPLE_THREADS.filter((thread) => thread.handle.includes(q) || thread.preview.toLowerCase().includes(q));
  const profiles = useProfiles();
  return (
    <aside className="side">
      <div className="side-h search-h">
        <label className="search">
          <span className="sr-only">Find or start a conversation</span>
          <input value={query} placeholder="Find or start a conversation" onChange={(event) => setQuery(event.target.value)} />
        </label>
      </div>
      <div className="side-b">
        <NavLink className={({ isActive }) => `nav${isActive ? ' on' : ''}`} to="/friends">
          <Icon name="friends" /> Friends
        </NavLink>
        <NavLink className={({ isActive }) => `nav${isActive ? ' on' : ''}`} to="/store">
          <Icon name="cube" /> My objects
        </NavLink>
        <NavLink className={({ isActive }) => `nav${isActive ? ' on' : ''}`} to="/market">
          <Icon name="store" /> Marketplace <span className="chip">SOON</span>
        </NavLink>
        <div className="cat">
          <span>Direct messages</span>
          <Icon name="plus" className="i tiny" />
        </div>
        {threads.map((thread) => {
          const profile = profiles.find((entry) => entry.handle === thread.handle);
          if (!profile) return null;
          const on = thread.handle === active;
          return (
            <NavLink key={thread.handle} className={`dmrow${on ? ' on' : ''}`} to={`/chats/${thread.handle}`} style={{ ['--ring' as string]: on ? 'var(--bg-4)' : 'var(--bg-1)' }}>
              <Avatar profile={profile} size={32} status />
              <span className="tx">
                <span className="nm">{profile.name}</span>
                <span className="sub">{thread.preview}</span>
              </span>
            </NavLink>
          );
        })}
      </div>
    </aside>
  );
}

export function SpaceSide({
  communityId,
  activeChannelId,
}: {
  communityId: string;
  activeChannelId?: string;
}) {
  const communities = useCommunities();
  const channels = useChannels();
  const [detail, setDetail] = useState<Channel | null>(null);
  const space = communities.find((entry) => entry.id === communityId);
  if (!space) return null;
  const mine = listedChannels(space, channels);
  const owner = space.ownerHandle === GUEST_HANDLE;
  return (
    <aside className="side">
      <div className="side-h">
        <span>{space.name}</span>
        <Link className="tool" to="/communities" aria-label="All Spaces">
          <Icon name="down" />
        </Link>
      </div>
      <div className="side-b">
        <OnChainCard space={space} />
        <div className="cat">
          <span>Text channels</span>
          {owner ? (
            <Link className="add" to={`/c/${space.id}/new-channel`} aria-label="Mint a channel">
              <Icon name="plus" className="i tiny" />
            </Link>
          ) : null}
        </div>
        {mine.map((channel) => (
          <div className="ch-row" key={channel.id}>
            <NavLink
              className={({ isActive }) => `ch${isActive || channel.id === activeChannelId ? ' on' : ''}`}
              to={`/c/${space.id}/${channel.id}`}
            >
              <span className="hash">#</span> {channel.name}
            </NavLink>
            <ChannelInfoButton channelName={channel.name} onOpen={() => setDetail(channel)} />
          </div>
        ))}
        <div className="cat">
          <span>Shelf</span>
        </div>
        <NavLink className="ch" to={`/u/${space.ownerHandle}/store`}>
          <span className="hash">
            <Icon name="store" className="i tiny" />
          </span>
          storefronts
        </NavLink>
      </div>
      {detail ? <ChannelDetails space={space} channel={detail} onClose={() => setDetail(null)} /> : null}
    </aside>
  );
}

export function OnChainCard({ space }: { space: Community }) {
  return (
    <div className="spacecard">
      <div className="card-k">
        <span className="chip chain">
          <Icon name="chain" /> ON-CHAIN SPACE
        </span>
      </div>
      <div className="row">
        <span>Owner</span>
        <b>@{displayHandle(space.ownerHandle)}</b>
      </div>
      <div className="row">
        <span>License</span>
        <b>{SPACE_LICENSE}</b>
      </div>
      <div className="row">
        <span>Address</span>
        <b title={space.address}>{shortHash(space.address, 6, 4)}</b>
      </div>
      <div className="row">
        <span>Minted on</span>
        <b>Dogecoin · P2FK</b>
      </div>
      <div className="row">
        <span>Transferable</span>
        <b>Yes</b>
      </div>
      <p className="carry">Giving this Space also gives the channels its owner holds.</p>
    </div>
  );
}

export function MemberPanel({ communityId }: { communityId: string }) {
  const communities = useCommunities();
  const memberships = useMemberships();
  const profiles = useProfiles();
  const space = communities.find((entry) => entry.id === communityId);
  if (!space) return null;
  const handles = memberships
    .filter((membership) => membership.communityId === communityId)
    .map((membership) => membership.handle);
  const owner = handles.filter((handle) => handle === space.ownerHandle);
  const rest = handles.filter((handle) => handle !== space.ownerHandle);
  const online = rest.filter((handle) => presenceOf(handle) === 'online');
  const offline = rest.filter((handle) => presenceOf(handle) === 'offline');

  const group = (title: string, list: string[]) => (
    <>
      <div className="cat">
        {title} — {list.length}
      </div>
      {list.map((handle) => {
        const profile = profiles.find((entry) => entry.handle === handle);
        if (!profile) return null;
        const off = presenceOf(handle) === 'offline';
        return (
          <MemberLink key={handle} handle={handle} off={off} />
        );
      })}
    </>
  );

  return (
    <aside className="members right">
      {group('Owner', owner)}
      {group('Online', online)}
      {group('Offline', offline)}
    </aside>
  );
}

function MemberLink({ handle, off }: { handle: string; off: boolean }) {
  const profile = useProfile(handle);
  const accent = useAccent(handle);
  if (!profile) return null;
  return (
    <Link className={`mem${off ? ' off' : ''}`} to={handle === GUEST_HANDLE ? '/me' : `/u/${handle}`}>
      <Avatar profile={profile} size={32} status />
      <span>
        <span className="nm" style={{ color: nameColor(accent) }}>
          {profile.name}
        </span>
        <span className="sub">{profile.role}</span>
      </span>
    </Link>
  );
}

export function DmProfile({ handle }: { handle: string }) {
  const profile = useProfile(handle);
  const accent = useAccent(handle);
  const shelf = useShelf(handle);
  if (!profile) return null;
  const first = shelf[0];
  return (
    <aside className="dmprof right" style={accentVars(accent)}>
      <div className="banner" />
      <div className="pbody">
        <span className="bigav">
          <Avatar profile={profile} size={88} status />
        </span>
        <div className="pname">{profile.name}</div>
        <div className="phandle">
          @{displayHandle(handle)} <span className="chip role">{profile.role}</span>
        </div>
        <div className="card">
          <h4>About</h4>
          {profile.bio}
        </div>
        <div className="card">
          <h4>Storefront</h4>
          <div className="minigrid">
            {first ? <KindTile item={first} label={false} /> : <EmptyTile />}
            <EmptyTile />
            <EmptyTile />
          </div>
          <Link className="btn acc block" to={`/u/${handle}/store`}>
            <Icon name="store" className="i tiny" /> View storefront
          </Link>
        </div>
        <div className="card swatch-card">
          <span className="swatch" />
          Accent picked from avatar · <b className="hex">{accent.neutral ? 'neutral' : accent.acc}</b>
        </div>
        <div className="card">
          <h4>Private messages</h4>
          {PRIVATE_DMS}
        </div>
      </div>
    </aside>
  );
}

function EmptyTile() {
  return (
    <div className="tile empty">
      <span>—</span>
    </div>
  );
}

export function UserPanel() {
  const guest = useGuest();
  if (!guest) return null;
  return (
    <div className="upanel">
      <Link to="/me" aria-label="Your profile">
        <Avatar profile={guest} size={36} status />
      </Link>
      <div className="tx">
        <div className="nm">{guest.name}</div>
        <div className="sub">Online</div>
      </div>
      <button className="ib" type="button" aria-label="Microphone" title="Voice is not part of this demo">
        <Icon name="mic" />
      </button>
      <button className="ib" type="button" aria-label="Headphones" title="Voice is not part of this demo">
        <Icon name="head" />
      </button>
      <Link className="ib" to="/me" aria-label="Settings">
        <Icon name="gear" />
      </Link>
    </div>
  );
}

export function MobileUserBar() {
  const guest = useGuest();
  if (!guest) return null;
  return (
    <Link className="mubar" to="/me">
      <Avatar profile={guest} size={48} status />
      <span className="tx">
        <span className="nm">{guest.name}</span>
        <span className="sub">Online</span>
      </span>
      <Icon name="bell" />
    </Link>
  );
}

export function ScreenHead({
  title,
  backTo,
  backLabel = 'Back',
}: {
  title: string;
  backTo?: string;
  backLabel?: string;
}) {
  return (
    <div className="main-h screen-head">
      {backTo ? (
        <Link className="tool" to={backTo} aria-label={backLabel}>
          <Icon name="back" />
        </Link>
      ) : null}
      <h1 className="t">{title}</h1>
    </div>
  );
}
