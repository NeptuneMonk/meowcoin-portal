import { Link } from 'react-router-dom';
import { Avatar } from '../components/Avatar';
import { GUEST_HANDLE } from '../services/catalog';
import { useProfiles } from '../services/hooks';
import { usePageTitle } from '../usePageTitle';

export function FriendsPage() {
  usePageTitle('Friends — The Forge');
  const profiles = useProfiles();
  const cats = profiles.filter((profile) => profile.handle !== GUEST_HANDLE);
  return (
    <section className="mpanel">
      <h1>Friends</h1>
      <p className="micro">Sample cats in this demo. Open a profile to see that storefront.</p>
      <ul>
        {cats.map((profile) => (
          <li key={profile.handle}>
            <Link className="friend" to={`/u/${profile.handle}`}>
              <Avatar profile={profile} size={40} status />
              <span>
                <strong>{profile.name}</strong>
                <span className="micro" style={{ display: 'block' }}>
                  {profile.role}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
