import { Link } from 'react-router-dom';
import { GUEST_LOOK } from '../content/looks';
import { formatMeowe, shortHash } from '../format';
import { useProfiles } from '../services/hooks';
import type { Post } from '../services/types';
import { CatAvatar } from './CatAvatar';
import { CopyButton } from './CopyButton';
import { MemeArt } from './MemeArt';

export function PostCard({ post }: { post: Post }) {
  const profiles = useProfiles();
  const profile = profiles.find((entry) => entry.handle === post.handle);
  const look = profile?.look ?? GUEST_LOOK;
  const name = profile?.name ?? 'You';

  const identity = (
    <>
      <CatAvatar look={look} label="" decorative size="sm" />
      <span>
        <strong>{name}</strong>
        <small>{profile ? `@${profile.handle}` : 'This demo'}</small>
      </span>
    </>
  );

  return (
    <article className="post">
      <header>
        {profile ? (
          <Link className="who" to={`/profile/${profile.handle}`}>
            {identity}
          </Link>
        ) : (
          <div className="who">{identity}</div>
        )}
        <time>{post.createdLabel}</time>
      </header>
      {post.forgedHere ? <p className="ribbon">Forged in this demo</p> : null}
      {post.meme ? <MemeArt id={post.meme} /> : null}
      <p className="post-text">{post.text}</p>
      <ul className="badges">
        <li className="chip chip-burn">Burned {formatMeowe(post.burned)} MEOWE</li>
        <li>
          <CopyButton label="IPFS CID" value={post.cid} display={shortHash(post.cid, 10, 6)} />
        </li>
        <li>
          <CopyButton
            label="Dogecoin record"
            value={post.dogeTxid}
            display={shortHash(post.dogeTxid, 8, 4)}
          />
        </li>
      </ul>
    </article>
  );
}
