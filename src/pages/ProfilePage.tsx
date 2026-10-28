import { useParams } from 'react-router-dom';
import { MobileProfile, StorefrontView } from '../components/StorefrontView';
import { useMedia } from '../components/useMedia';
import { useProfile } from '../services/hooks';
import { usePageTitle } from '../usePageTitle';
import { NotFound } from './NotFound';

export function ProfilePage() {
  const { handle } = useParams();
  const profile = useProfile(handle);
  const mobile = useMedia('(max-width: 699px)');
  usePageTitle(profile ? `${profile.name} — The Forge` : 'Profile — The Forge');
  if (!handle || !profile) return <NotFound />;
  if (mobile) return <MobileProfile handle={handle} />;
  return <StorefrontView handle={handle} />;
}
