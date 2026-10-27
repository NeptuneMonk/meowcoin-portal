import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CatAvatar } from '../components/CatAvatar';
import { FeeSplit } from '../components/FeeSplit';
import { PostCard } from '../components/PostCard';
import { formatUsd } from '../format';
import { usePosts, useProfiles } from '../services/hooks';
import { POST_QUOTE } from '../services/pricing';
import { usePageTitle } from '../usePageTitle';

type Filter = 'all' | 'meme' | 'message';

export function Explore() {
  usePageTitle('Explore — The Forge');
  const posts = usePosts();
  const profiles = useProfiles();
  const [filter, setFilter] = useState<Filter>('all');
  const shown = posts.filter((post) => filter === 'all' || post.kind === filter);
  const counts = {
    all: posts.length,
    meme: posts.filter((post) => post.kind === 'meme').length,
    message: posts.filter((post) => post.kind === 'message').length,
  };

  return (
    <div className="wrap page">
      <header className="page-head">
        <p className="kicker">Sample feed</p>
        <h1>Explore</h1>
        <p>
          Posts from demo cats. The burn, the IPFS content id, and the Dogecoin record on each card
          are shaped like the real thing, and they are simulated.
        </p>
      </header>
      <div className="feed-layout">
        <div>
          <ul className="cats" aria-label="Demo cats">
            {profiles.map((profile) => (
              <li key={profile.handle}>
                <Link to={`/profile/${profile.handle}`}>
                  <CatAvatar look={profile.look} label="" decorative />
                  <span>{profile.name}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="filters" role="group" aria-label="Filter posts">
            <FilterButton
              pressed={filter === 'all'}
              onClick={() => setFilter('all')}
              label="All"
              count={counts.all}
            />
            <FilterButton
              pressed={filter === 'meme'}
              onClick={() => setFilter('meme')}
              label="Memes"
              count={counts.meme}
            />
            <FilterButton
              pressed={filter === 'message'}
              onClick={() => setFilter('message')}
              label="Messages"
              count={counts.message}
            />
          </div>
          {shown.length === 0 ? (
            <p className="card">Nothing in this filter yet.</p>
          ) : (
            <ul className="post-list">
              {shown.map((post) => (
                <li key={post.id}>
                  <PostCard post={post} />
                </li>
              ))}
            </ul>
          )}
        </div>
        <aside className="rail">
          <FeeSplit quote={POST_QUOTE} heading={`A post is ${formatUsd(POST_QUOTE.usd)}`} />
          <Link className="btn btn-primary btn-block" to="/try/post">
            Try a post
          </Link>
        </aside>
      </div>
    </div>
  );
}

function FilterButton({
  pressed,
  onClick,
  label,
  count,
}: {
  pressed: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button type="button" aria-pressed={pressed} onClick={onClick}>
      {label} <span>{count}</span>
    </button>
  );
}
