import { Link, NavLink, Outlet, useLocation, useMatch } from 'react-router-dom';
import mark from '../assets/coin-mark.png';
import { GUEST_HANDLE } from '../services/catalog';
import {
  useAllMessages,
  useChannels,
  useCommunities,
  useGuest,
  useJoinedCommunities,
  useMemberships,
  useProfiles,
  useRecentChats,
} from '../services/hooks';
import { CommunityMark } from './CommunityMark';
import { ProfileFace } from './ProfileFace';

export function AppShell() {
  const { pathname } = useLocation();
  const communityOnly = useMatch('/c/:communityId');
  const channelMatch = useMatch('/c/:communityId/:channelId');
  const communityId = channelMatch?.params.communityId ?? communityOnly?.params.communityId;
  const channelId = channelMatch?.params.channelId;
  const inThread = Boolean(channelId);
  const focused =
    pathname === '/mint' || pathname === '/communities/new' || pathname.startsWith('/item/');
  const hideTabs = inThread || focused;
  const joined = useJoinedCommunities();

  return (
    <div className={`app-frame${hideTabs ? ' focus-mode' : ''}${inThread ? ' in-thread' : ''}`}>
      <nav className="server-rail" aria-label="Communities">
        <Link className={`rail-home${pathname === '/chats' ? ' on' : ''}`} to="/chats" aria-label="Chats">
          <img src={mark} width={96} height={96} alt="" />
        </Link>
        <div className="rail-list">
          {joined.map((community) => (
            <Link
              key={community.id}
              className={`rail-btn${community.id === communityId ? ' on' : ''}`}
              to={`/c/${community.id}`}
              aria-label={community.name}
              aria-current={community.id === communityId ? 'page' : undefined}
              title={community.name}
            >
              <CommunityMark community={community} />
            </Link>
          ))}
        </div>
        <Link className="rail-btn add" to="/communities/new" aria-label="Create community">
          +
        </Link>
      </nav>

      <div className="pane-side">
        {communityId ? (
          <ChannelList communityId={communityId} activeId={channelId} />
        ) : (
          <ChatList />
        )}
      </div>

      <div className="pane-main">
        <Outlet />
      </div>

      <div className="pane-members">
        {communityId ? <MemberPanel communityId={communityId} /> : <YouCard />}
      </div>

      {hideTabs ? null : (
        <nav className="tabbar" aria-label="Primary">
          <NavLink className="tab" to="/chats" end>
            <IconChat />
            <span>Chats</span>
          </NavLink>
          <NavLink
            className={() =>
              pathname.startsWith('/communities') || pathname.startsWith('/c/') ? 'tab active' : 'tab'
            }
            to="/communities"
          >
            <IconCommunities />
            <span>Communities</span>
          </NavLink>
          <NavLink className={() => (pathname === '/store' || pathname === '/mint' ? 'tab active' : 'tab')} to="/store">
            <IconStore />
            <span>My Store</span>
          </NavLink>
          <NavLink className="tab" to="/me">
            <IconProfile />
            <span>Profile</span>
          </NavLink>
        </nav>
      )}
    </div>
  );
}

export function ChatList() {
  const rows = useRecentChats();
  const profiles = useProfiles();
  return (
    <div className="list-pane">
      <p className="pane-label">Chats</p>
      <ul className="chat-list">
        {rows.map(({ channel, community, last }) => {
          const author = last ? profiles.find((profile) => profile.handle === last.handle) : undefined;
          const preview = last ? last.text || 'Image' : 'No messages yet';
          return (
            <li key={channel.id}>
              <Link className="row-link" to={`/c/${community.id}/${channel.id}`}>
                <CommunityMark community={community} />
                <span className="row-copy">
                  <strong>
                    {community.name} <span className="channel-name">#{channel.name}</span>
                  </strong>
                  <small>
                    {author ? `${author.name}: ` : ''}
                    {preview}
                  </small>
                </span>
                {last ? <time>{last.createdLabel}</time> : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function ChannelList({
  communityId,
  activeId,
  bare = false,
}: {
  communityId: string;
  activeId?: string;
  bare?: boolean;
}) {
  const communities = useCommunities();
  const channels = useChannels();
  const community = communities.find((entry) => entry.id === communityId);
  const mine = channels.filter((channel) => channel.communityId === communityId);
  if (!community) return null;
  const list = (
    <ul className="channel-list">
      {mine.map((channel) => (
        <li key={channel.id}>
          <Link
            className={channel.id === activeId ? 'channel-link on' : 'channel-link'}
            to={`/c/${community.id}/${channel.id}`}
            aria-current={channel.id === activeId ? 'page' : undefined}
          >
            <span aria-hidden="true">#</span> {channel.name}
          </Link>
        </li>
      ))}
    </ul>
  );
  if (bare) return list;
  return (
    <div className="list-pane">
      <p className="pane-label">{community.name}</p>
      <p className="micro pane-topic">{community.topic}</p>
      {list}
      <Link className="text-link" to={`/u/${community.ownerHandle}/store`}>
        Owner’s storefront
      </Link>
    </div>
  );
}

function MemberPanel({ communityId }: { communityId: string }) {
  const communities = useCommunities();
  const memberships = useMemberships();
  const profiles = useProfiles();
  const community = communities.find((entry) => entry.id === communityId);
  if (!community) return null;
  const handles = memberships
    .filter((membership) => membership.communityId === communityId)
    .map((membership) => membership.handle);
  return (
    <div className="members">
      <p className="pane-label">Members</p>
      <ul className="member-list">
        {handles.map((handle) => {
          const profile = profiles.find((entry) => entry.handle === handle);
          if (!profile) return null;
          return (
            <li key={handle}>
              <Link to={handle === GUEST_HANDLE ? '/me' : `/u/${handle}`}>
                <ProfileFace profile={profile} size="sm" decorative />
                <span>
                  {profile.name}
                  {handle === community.ownerHandle ? <small>Owner</small> : null}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
      <Link className="btn btn-ghost btn-block" to={`/u/${community.ownerHandle}/store`}>
        Owner’s storefront
      </Link>
    </div>
  );
}

function YouCard() {
  const guest = useGuest();
  if (!guest) return null;
  return (
    <div className="members">
      <p className="pane-label">You</p>
      <Link className="you-card" to="/me">
        <ProfileFace profile={guest} size="lg" />
        <span>
          <strong>{guest.name}</strong>
          <small>{guest.bio}</small>
        </span>
      </Link>
      <Link className="btn btn-ghost btn-block" to="/store">
        My store
      </Link>
    </div>
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
    <div className="screen-head">
      {backTo ? (
        <Link className="back" to={backTo}>
          {backLabel}
        </Link>
      ) : null}
      <h1>{title}</h1>
    </div>
  );
}

export function CommunityDirectory() {
  const communities = useJoinedCommunities();
  const channels = useChannels();
  const messages = useAllMessages();
  return (
    <ul className="directory">
      {communities.map((community) => {
        const count = channels.filter((channel) => channel.communityId === community.id).length;
        const latest = [...messages]
          .reverse()
          .find((message) =>
            channels.some(
              (channel) => channel.id === message.channelId && channel.communityId === community.id,
            ),
          );
        return (
          <li key={community.id}>
            <Link className="row-link" to={`/c/${community.id}`}>
              <CommunityMark community={community} />
              <span className="row-copy">
                <strong>{community.name}</strong>
                <small>{community.topic}</small>
              </span>
              <span className="row-meta">
                {count} {count === 1 ? 'channel' : 'channels'}
                {latest ? <time>{latest.createdLabel}</time> : null}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function IconChat() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M5 5.5h14a1.5 1.5 0 0 1 1.5 1.5v8A1.5 1.5 0 0 1 19 16.5H9l-4 3v-3H5A1.5 1.5 0 0 1 3.5 15V7A1.5 1.5 0 0 1 5 5.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function IconCommunities() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="8" cy="9" r="3" fill="currentColor" />
      <circle cx="16" cy="9" r="3" fill="currentColor" />
      <path d="M3.5 18.5c.6-2.4 2.5-3.5 4.5-3.5s3.9 1.1 4.5 3.5H3.5Zm8 0c.4-1.6 1.6-2.8 3.5-3.3 1.6.4 2.8 1.6 3.5 3.3h-7Z" fill="currentColor" />
    </svg>
  );
}

function IconStore() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 9.5 6 4.5h12l2 5v2H4v-2Z" fill="currentColor" />
      <path d="M5 12.5h14V20H5v-7.5Zm3 2.2V18h3v-3.3H8Z" fill="currentColor" />
    </svg>
  );
}

function IconProfile() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="8" r="3.2" fill="currentColor" />
      <path d="M5.5 19.2c1-3 3.2-4.4 6.5-4.4s5.5 1.4 6.5 4.4H5.5Z" fill="currentColor" />
    </svg>
  );
}
