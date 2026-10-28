import { MobileProfile, StorefrontView } from '../components/StorefrontView';
import { useMedia } from '../components/useMedia';
import { GUEST_HANDLE } from '../services/catalog';
import { usePageTitle } from '../usePageTitle';

export function StorePage() {
  usePageTitle('My objects — The Forge');
  const mobile = useMedia('(max-width: 699px)');
  if (mobile) return <MobileProfile handle={GUEST_HANDLE} />;
  return <StorefrontView handle={GUEST_HANDLE} mine />;
}
