import { Link } from 'react-router-dom';
import { formatMeowe, formatUsd } from '../format';
import { MINT_QUOTE, POST_QUOTE, PROFILE_QUOTE } from '../services/pricing';
import { usePageTitle } from '../usePageTitle';

const CHOICES = [
  {
    to: '/try/profile',
    title: 'Create a profile',
    body: 'Name your cat, pick a look, and see the profile fee.',
    quote: PROFILE_QUOTE,
  },
  {
    to: '/try/post',
    title: 'Post a meme',
    body: 'Write something, watch the penny split, and stop before it is sent.',
    quote: POST_QUOTE,
  },
  {
    to: '/try/mint',
    title: 'Mint an item',
    body: 'Make a Dogecoin-style object. It will not be listed for sale.',
    quote: MINT_QUOTE,
  },
];

export function TryHub() {
  usePageTitle('Try it — The Forge');

  return (
    <div className="wrap page narrow">
      <header className="page-head">
        <p className="kicker">Guest walkthrough</p>
        <h1>Try it</h1>
        <p>
          Four steps: compose, see the price, watch the split, then a simulated Dogecoin record.
          You finish on a demo screen. Nothing is signed or paid.
        </p>
      </header>
      <ul className="choice-grid">
        {CHOICES.map((choice) => (
          <li key={choice.to}>
            <Link className="choice" to={choice.to}>
              <span className="kicker">
                {formatUsd(choice.quote.usd)} · {formatMeowe(choice.quote.meowe)} MEOWE
              </span>
              <strong>{choice.title}</strong>
              <span>{choice.body}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
