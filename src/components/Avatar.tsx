import { presenceOf } from '../avatars';
import type { Profile } from '../services/types';
import { faceSrc } from './useAccent';

export function Avatar({
  profile,
  size,
  status = false,
  decorative = false,
}: {
  profile: Profile;
  size: number;
  status?: boolean;
  decorative?: boolean;
}) {
  const presence = presenceOf(profile.handle);
  return (
    <span className="av" style={{ width: size, height: size }}>
      <img
        src={faceSrc(profile)}
        alt={decorative ? '' : profile.name}
        width={size}
        height={size}
      />
      {status ? <span className={presence === 'online' ? 'st' : 'st off'} /> : null}
    </span>
  );
}
