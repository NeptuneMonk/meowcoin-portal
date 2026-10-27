import type { Profile } from '../services/types';
import { CatAvatar } from './CatAvatar';

type Size = 'sm' | 'md' | 'lg' | 'xl';

export function ProfileFace({
  profile,
  size = 'md',
  decorative = false,
}: {
  profile: Profile;
  size?: Size;
  decorative?: boolean;
}) {
  if (profile.localImageUrl) {
    return (
      <img
        className={`avatar avatar-${size} photo`}
        src={profile.localImageUrl}
        alt={decorative ? '' : profile.name}
      />
    );
  }
  return <CatAvatar look={profile.look} label={profile.name} decorative={decorative} size={size} />;
}
