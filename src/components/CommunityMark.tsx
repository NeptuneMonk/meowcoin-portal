import type { Community } from '../services/types';

export function CommunityMark({ community }: { community: Community }) {
  return (
    <span className="community-mark" style={{ background: community.hue }} aria-hidden="true">
      {community.mark}
    </span>
  );
}
