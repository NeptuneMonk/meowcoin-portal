import { Link, useParams } from 'react-router-dom';
import { ChannelList, ScreenHead } from '../components/AppShell';
import { CommunityMark } from '../components/CommunityMark';
import { useChannels, useCommunities, useProfile } from '../services/hooks';
import { usePageTitle } from '../usePageTitle';
import { NotFound } from './NotFound';

export function CommunityPage() {
  const { communityId } = useParams();
  const communities = useCommunities();
  const channels = useChannels();
  const community = communities.find((entry) => entry.id === communityId);
  const owner = useProfile(community?.ownerHandle);
  usePageTitle(community ? `${community.name} — The Forge` : 'Community — The Forge');

  if (!communityId || !community) return <NotFound />;
  const mine = channels.filter((channel) => channel.communityId === community.id);

  return (
    <div className="fill pad">
      <div className="mobile-only">
        <ScreenHead title={community.name} backTo="/communities" backLabel="Communities" />
      </div>
      <div className="desktop-only">
        <ScreenHead title={community.name} />
      </div>
      <div className="community-hero">
        <CommunityMark community={community} />
        <div>
          <p>{community.topic}</p>
          <p className="micro">
            Owned by {owner ? owner.name : community.ownerHandle}.
            {community.forgedHere ? ' Forged in this demo.' : ''}
          </p>
        </div>
      </div>
      <Link className="btn btn-ghost" to={`/u/${community.ownerHandle}/store`}>
        Owner’s storefront
      </Link>
      <div className="mobile-only">
        <h2>Channels</h2>
        <ChannelList communityId={community.id} bare />
      </div>
      <div className="desktop-only">
        <p className="micro">Choose a channel on the left. {mine.length} in this community.</p>
      </div>
    </div>
  );
}
