import { Link, Navigate, useParams } from 'react-router-dom';
import { Icon } from '../components/Icons';
import { OnChainCard } from '../components/chrome';
import { useMedia } from '../components/useMedia';
import { useChannels, useCommunities } from '../services/hooks';
import { usePageTitle } from '../usePageTitle';
import { NotFound } from './NotFound';

export function CommunityPage() {
  const { communityId } = useParams();
  const mobile = useMedia('(max-width: 699px)');
  const communities = useCommunities();
  const channels = useChannels();
  const space = communities.find((entry) => entry.id === communityId);
  usePageTitle(space ? `${space.name} — The Forge` : 'Space — The Forge');
  if (!communityId || !space) return <NotFound />;
  const mine = channels.filter((channel) => channel.communityId === space.id);
  const general = mine.find((channel) => channel.name === 'general') ?? mine[0];
  if (!mobile && general) return <Navigate to={`/c/${space.id}/${general.id}`} replace />;

  return (
    <section className="mpanel">
      <h1 style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {space.name} <Icon name="down" />
      </h1>
      <OnChainCard space={space} />
      <div className="chcat">Text channels</div>
      {mine.map((channel) => (
        <Link key={channel.id} className={`mch${channel.name === 'general' ? ' on' : ''}`} to={`/c/${space.id}/${channel.id}`}>
          <span className="hash">#</span>
          {channel.name}
        </Link>
      ))}
      <div className="chcat">Shelf</div>
      <Link className="mch" to={`/u/${space.ownerHandle}/store`}>
        <span className="hash">
          <Icon name="store" />
        </span>
        storefronts
      </Link>
    </section>
  );
}
