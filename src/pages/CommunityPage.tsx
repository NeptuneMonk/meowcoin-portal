import { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ChannelDetails, ChannelInfoButton } from '../components/ChannelDetails';
import { Icon } from '../components/Icons';
import { OnChainCard } from '../components/chrome';
import { useMedia } from '../components/useMedia';
import { GUEST_HANDLE } from '../services/catalog';
import { listedChannels } from '../services/directory';
import { useChannels, useCommunities } from '../services/hooks';
import type { Channel } from '../services/types';
import { usePageTitle } from '../usePageTitle';
import { NotFound } from './NotFound';

export function CommunityPage() {
  const { communityId } = useParams();
  const mobile = useMedia('(max-width: 699px)');
  const communities = useCommunities();
  const channels = useChannels();
  const [detail, setDetail] = useState<Channel | null>(null);
  const space = communities.find((entry) => entry.id === communityId);
  usePageTitle(space ? `${space.name} — The Forge` : 'Space — The Forge');
  if (!communityId || !space) return <NotFound />;
  const mine = listedChannels(space, channels);
  const general = mine.find((channel) => channel.name === 'general') ?? mine[0];
  if (!mobile && general) return <Navigate to={`/c/${space.id}/${general.id}`} replace />;
  const owner = space.ownerHandle === GUEST_HANDLE;

  return (
    <section className="mpanel">
      <h1 style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {space.name} <Icon name="down" />
      </h1>
      <OnChainCard space={space} />
      <div className="chcat">
        <span>Text channels</span>
        {owner ? (
          <Link className="add" to={`/c/${space.id}/new-channel`} aria-label="Mint a channel">
            <Icon name="plus" className="i tiny" />
          </Link>
        ) : null}
      </div>
      {mine.map((channel) => (
        <div className="mch-row" key={channel.id}>
          <Link className={`mch${channel.name === 'general' ? ' on' : ''}`} to={`/c/${space.id}/${channel.id}`}>
            <span className="hash">#</span>
            {channel.name}
          </Link>
          <ChannelInfoButton channelName={channel.name} onOpen={() => setDetail(channel)} />
        </div>
      ))}
      <div className="chcat">Shelf</div>
      <Link className="mch" to={`/u/${space.ownerHandle}/store`}>
        <span className="hash">
          <Icon name="store" />
        </span>
        storefronts
      </Link>
      {detail ? <ChannelDetails space={space} channel={detail} onClose={() => setDetail(null)} /> : null}
    </section>
  );
}
