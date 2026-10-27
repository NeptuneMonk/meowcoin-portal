import { Link } from 'react-router-dom';
import coin from '../assets/coin.webp';
import { BurnCounter } from '../components/BurnCounter';
import { FeeSplit } from '../components/FeeSplit';
import { formatMeowe, formatUsd } from '../format';
import {
  COMMUNITY_QUOTE,
  MESSAGE_QUOTE,
  MINT_QUOTE,
  POST_QUOTE,
  PROFILE_QUOTE,
} from '../services/pricing';
import { usePageTitle } from '../usePageTitle';

const STEPS = [
  {
    title: 'Open a community',
    body: 'A profile can run its own community, with text channels for the people in it.',
  },
  {
    title: 'A message is a penny',
    body: 'Sending a message costs about one cent in MEOWE. You can attach a picture from your device.',
  },
  {
    title: 'Split the fee',
    body: '30% is burned forever. 60% is swapped to DOGE to write the record. 10% goes to community nodes.',
  },
  {
    title: 'Keep a storefront',
    body: 'Each profile has a shelf of items that cat minted. Trading comes later.',
  },
];

const PRICES = [
  { quote: MESSAGE_QUOTE, label: 'A chat message' },
  { quote: MINT_QUOTE, label: 'Mint an item' },
  { quote: PROFILE_QUOTE, label: 'Profile picture' },
  { quote: COMMUNITY_QUOTE, label: 'A community' },
];

export function Landing() {
  usePageTitle('The Forge — MEOWE Portal');

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
            Communities, chats, and a storefront on every profile. A message is about one cent of
            MEOWE and leaves a record on Dogecoin. This is a tour. Nothing here is live.
          </p>
          <div className="btn-row">
            <Link className="btn btn-primary" to="/chats">
              Enter the Forge
            </Link>
            <Link className="btn btn-ghost" to="/communities">
              See communities
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
          <li>The cats, communities, and messages are samples drawn for the tour.</li>
          <li>A picture you pick stays on this device. It is not uploaded.</li>
          <li>There is no seed phrase. If a site asks for one, it is not this demo.</li>
        </ul>
      </section>

      <div className="econ">
        <BurnCounter />
        <FeeSplit quote={POST_QUOTE} heading={`On one message · ${formatUsd(POST_QUOTE.usd)}`} />
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
      </section>

      <section className="section" aria-labelledby="price-heading">
        <h2 id="price-heading">Prices in pennies</h2>
        <ul className="price-grid">
          {PRICES.map(({ quote, label }) => (
            <li key={label} className="card">
              <p className="kicker">{label}</p>
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
          <Link className="btn btn-primary" to="/chats">
            Enter the Forge
          </Link>
          <Link className="btn btn-ghost" to="/mint">
            Mint an item
          </Link>
        </div>
      </section>
    </div>
  );
}
