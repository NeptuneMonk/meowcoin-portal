import { Link } from 'react-router-dom';
import { useChannels, useJoinedCommunities } from '../services/hooks';
import { usePageTitle } from '../usePageTitle';

export function CommunitiesPage() {
  usePageTitle('Spaces — The Forge');
  const spaces = useJoinedCommunities();
  const channels = useChannels();
  return (
    <section className="mpanel">
      <h1>Spaces</h1>
      <p className="micro">
        A Space is an on-chain object on Dogecoin (P2FK). Its creator can give or transfer it like any other object.
      </p>
      <p>
        <Link className="btn" to="/communities/new">
          Mint a Space
        </Link>
      </p>
      <ul className="directory">
        {spaces.map((space) => {
          const count = channels.filter((channel) => channel.communityId === space.id).length;
          return (
            <li key={space.id}>
              <Link className="row" to={`/c/${space.id}`}>
                <span className="space-pill" style={{ background: space.hue }}>
                  {space.mark}
                </span>
                <span>
                  <strong>{space.name}</strong>
                  <span className="micro" style={{ display: 'block' }}>
                    {space.topic} · {count} {count === 1 ? 'channel' : 'channels'}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
