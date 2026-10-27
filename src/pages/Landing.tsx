import { Link } from 'react-router-dom';
import coin from '../assets/coin.webp';
import { BurnCounter } from '../components/BurnCounter';
import { FeeSplit } from '../components/FeeSplit';
import { formatMeowe, formatUsd } from '../format';
import { MINT_QUOTE, POST_QUOTE, PROFILE_QUOTE } from '../services/pricing';
import { usePageTitle } from '../usePageTitle';

const STEPS = [
  {
    title: 'Compose',
    body: 'Make a profile, post a meme, or mint an item. You pay only in MEOWE.',
  },
  {
    title: 'Price in pennies',
    body: 'A post is one cent. A profile is fifteen cents. The portal turns that into MEOWE.',
  },
  {
    title: 'Split the fee',
    body: '30% is burned forever. 60% is swapped to DOGE to write the record. 10% goes to community nodes.',
  },
  {
    title: 'Keep the record',
    body: 'The file is pinned on IPFS. A Solana memo carries the content id. Profiles and items are written on Dogecoin.',
  },
];

export function Landing() {
  usePageTitle('The Forge — MEOWE Portal');
  const prices = [POST_QUOTE, MINT_QUOTE, PROFILE_QUOTE];
  const labels: Record<string, string> = {
    post: 'Post a meme',
    mint: 'Mint an item',
    profile: 'Create a profile',
  };

  return (
    <div className="wrap landing">
      <section className="hero">
        <div className="hero-copy">
          <p className="kicker">Guest demo</p>
          <h1>
            Enter <span className="grad">the Forge</span>
          </h1>
          <p className="tagline">Memes are forever on Doge.</p>
          <p className="lead">
            A penny of MEOWE posts a meme, burns a little supply, and leaves a record on Dogecoin.
            This is a tour of the portal. Nothing here is live.
          </p>
          <div className="btn-row">
            <Link className="btn btn-primary" to="/try/post">
              Try a post
            </Link>
            <Link className="btn btn-ghost" to="/explore">
              Explore the feed
            </Link>
          </div>
          <p className="micro">No wallet. No seed phrase. No payment.</p>
        </div>
        <div className="hero-art">
          <div className="coin-orbit">
            <img src={coin} width={480} height={480} alt="Meowecoin coin, a gold cat in shades" />
          </div>
        </div>
      </section>

      <section className="card demo-card" aria-labelledby="demo-heading">
        <h2 id="demo-heading">You are in demo mode</h2>
        <ul>
          <li>Nothing on this page touches Solana, Dogecoin, IPFS, or a wallet.</li>
          <li>The cats, posts, and items are samples drawn for the tour.</li>
          <li>Try it walks the real steps, then stops before anything is sent.</li>
          <li>There is no seed phrase. If a site asks for one, it is not this demo.</li>
        </ul>
      </section>

      <div className="econ">
        <BurnCounter />
        <FeeSplit quote={POST_QUOTE} heading={`On one post · ${formatUsd(POST_QUOTE.usd)}`} />
      </div>

      <section className="section" aria-labelledby="how-heading">
        <h2 id="how-heading">How it works</h2>
        <p className="section-lead">
          The same screens will run the live portal. Today every result is simulated.
        </p>
        <ol className="steps">
          {STEPS.map((step) => (
            <li key={step.title}>
              <div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="micro">The marketplace is a preview. Trading comes later.</p>
      </section>

      <section className="section" aria-labelledby="price-heading">
        <h2 id="price-heading">Prices in pennies</h2>
        <ul className="price-grid">
          {prices.map((quote) => (
            <li key={quote.action} className="card">
              <p className="kicker">{labels[quote.action]}</p>
              <p className="price-xl">{formatUsd(quote.usd)}</p>
              <p>{formatMeowe(quote.meowe)} MEOWE</p>
              <p className="micro">Burns {formatMeowe(quote.split.burn)} MEOWE</p>
            </li>
          ))}
        </ul>
        <p className="micro">
          One demo rate covers every price: one penny is {formatMeowe(POST_QUOTE.meowe)} MEOWE. You
          only pay in MEOWE.
        </p>
        <div className="btn-row">
          <Link className="btn btn-primary" to="/try">
            Try the steps
          </Link>
          <Link className="btn btn-ghost" to="/market">
            Preview the marketplace
          </Link>
        </div>
      </section>
    </div>
  );
}
