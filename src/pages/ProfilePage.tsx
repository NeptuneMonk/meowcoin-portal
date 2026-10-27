import { Link, useParams } from 'react-router-dom';
import { CatAvatar } from '../components/CatAvatar';
import { ItemCard } from '../components/ItemCard';
import { PostCard } from '../components/PostCard';
import { shortHash } from '../format';
import { useItems, usePosts, useProfile } from '../services/hooks';
import { usePageTitle } from '../usePageTitle';

export function ProfilePage() {
  const { handle } = useParams();
  const profile = useProfile(handle);
  const posts = usePosts().filter((post) => post.handle === handle);
  const items = useItems();
  usePageTitle(profile ? `${profile.name} — The Forge` : 'Profile — The Forge');

  if (!profile) {
    return (
      <div className="wrap page">
        <h1>No cat by that name</h1>
        <p>That profile is not in this demo.</p>
        <Link className="btn btn-primary" to="/explore">
          Back to the feed
        </Link>
      </div>
    );
  }

  const created = items.filter((item) => item.creatorHandle === profile.handle);
  const held = items.filter(
    (item) => item.ownerHandle === profile.handle && item.creatorHandle !== profile.handle,
  );

  return (
    <div className="wrap page narrow">
      <p>
        <Link to="/explore">Back to the feed</Link>
      </p>
      <header className="profile-head card">
        <CatAvatar look={profile.look} label={`${profile.name} avatar`} size="xl" />
        <div>
          <p className="kicker">{profile.role}</p>
          <h1>{profile.name}</h1>
          <p className="handle">@{profile.handle}</p>
          <p className="lives" aria-label="9 lives">
            {Array.from({ length: 9 }, (_, index) => (
              <span key={index} className="life" aria-hidden="true" />
            ))}
            <span>9 lives</span>
          </p>
          <p>{profile.bio}</p>
          {profile.forgedHere ? <p className="ribbon">Forged in this demo</p> : null}
          <p className="micro">
            Demo wallet {shortHash(profile.walletLabel, 6, 4)}. Not a real key.
          </p>
        </div>
      </header>

      <section>
        <h2>Posts</h2>
        {posts.length === 0 ? (
          <p className="card">No posts yet. Memes you forge in this demo show up here.</p>
        ) : (
          <ul className="post-list">
            {posts.map((post) => (
              <li key={post.id}>
                <PostCard post={post} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>Items</h2>
        {created.length + held.length === 0 ? (
          <p className="card">No items yet.</p>
        ) : (
          <ul className="market-grid">
            {created.map((item) => (
              <li key={item.id}>
                <ItemCard item={item} />
              </li>
            ))}
            {held.map((item) => (
              <li key={item.id}>
                <ItemCard item={item} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
