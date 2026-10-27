import { Link, useParams } from 'react-router-dom';
import { ScreenHead } from '../components/AppShell';
import { ProfileFace } from '../components/ProfileFace';
import { useProfile } from '../services/hooks';
import { usePageTitle } from '../usePageTitle';
import { NotFound } from './NotFound';
import { Storefront } from './StorePage';

export function ProfilePage() {
  const { handle, tab } = useParams();
  const profile = useProfile(handle);
  const store = tab === 'store';
  usePageTitle(profile ? `${profile.name} — The Forge` : 'Profile — The Forge');
  if (!handle || !profile) return <NotFound />;

  return (
    <div className="fill pad">
      <ScreenHead title={profile.name} backTo="/communities" backLabel="Communities" />
      <div className="profile-switch" role="tablist" aria-label="Profile sections">
        <Link role="tab" aria-selected={!store} className={store ? '' : 'on'} to={`/u/${handle}`}>
          Profile
        </Link>
        <Link
          role="tab"
          aria-selected={store}
          className={store ? 'on' : ''}
          to={`/u/${handle}/store`}
        >
          Storefront
        </Link>
      </div>
      {store ? (
        <Storefront handle={handle} />
      ) : (
        <ProfileBody handle={handle} />
      )}
    </div>
  );
}

export function ProfileBody({ handle }: { handle: string }) {
  const profile = useProfile(handle);
  if (!profile) return null;
  return (
    <div className="profile-body">
      <ProfileFace profile={profile} size="xl" />
      <p className="kicker">{profile.role}</p>
      <p>{profile.bio}</p>
      {profile.localImageUrl ? (
        <p className="micro">Your image stays on your device in demo mode.</p>
      ) : null}
      <p className="micro">Joined {profile.joinedLabel}.</p>
    </div>
  );
}
