import { Link } from 'react-router-dom';
import { BurnCounter } from '../components/BurnCounter';
import { FeeSplit } from '../components/FeeSplit';
import { Icon } from '../components/Icons';
import { SITE } from '../content/site';
import { formatMeowe, formatUsd, shortHash } from '../format';
import { CopyButton } from '../components/CopyButton';
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
    title: 'Mint a Space',
    body: 'A Space is an on-chain object (meowe:space). Each text channel is its own object too. Giving the Space also gives the channels its owner holds.',
  },
  {
    title: 'A message is a penny',
    body: 'A message is sent to the channel’s object address and costs about one cent in MEOWE. You can attach a picture or share another object.',
  },
  {
    title: 'Split the fee',
    body: '30% is burned forever. 60% is swapped to DOGE to write the record. 10% goes to community nodes.',
  },
  {
    title: 'Keep a storefront',
    body: 'Each profile has its own shelf. There is no global marketplace yet. Trading comes later.',
  },
];

const PRICES = [
  { quote: MESSAGE_QUOTE, label: 'A chat message' },
  { quote: MINT_QUOTE, label: 'Mint an item' },
  { quote: PROFILE_QUOTE, label: 'Profile picture' },
  { quote: COMMUNITY_QUOTE, label: 'A Space (illustration)' },
];

export function Landing() {
  usePageTitle('The Forge — MEOWE Portal');

  return (
    <div className="fill">
      <div className="main-h">
        <Link className="tool" to="/chats" aria-label="Back to messages">
          <Icon name="back" />
        </Link>
        <h1 className="t">The Forge</h1>
      </div>
      <div className="pad page-narrow">
        <p className="kicker">Guest demo</p>
        <div className="about-hero">
          <h1>Memes are forever on Doge.</h1>
        </div>
        <p>
          Spaces, messages, and a storefront on every profile. This is a tour. Nothing here is live,
          and nothing is minted.
        </p>
        <p className="chip">DEMO MODE — no real transactions</p>
        <div className="btn-row">
          <Link className="btn" to="/chats">
            Open messages
          </Link>
          <Link className="btn sec" to="/c/nine-lives">
            Nine Lives
          </Link>
        </div>
        <p className="micro">No wallet. No seed phrase. No payment.</p>

        <section className="card" aria-labelledby="demo-heading">
          <h2 id="demo-heading">You are in demo mode</h2>
          <ul>
            <li>Nothing on this page touches Solana, Dogecoin, IPFS, or a wallet.</li>
            <li>The cats, Spaces, and messages are samples drawn for the tour.</li>
            <li>A picture you pick stays on this device. It is not uploaded.</li>
            <li>There is no seed phrase. If a site asks for one, it is not this demo.</li>
            <li>
              Private messages will be end-to-end encrypted, following Sup’s PKX and PKY. The
              Messages screen is a sample. Nothing is sent.
            </li>
          </ul>
        </section>

        <div className="econ">
          <BurnCounter />
          <FeeSplit quote={POST_QUOTE} heading={`On one message · ${formatUsd(POST_QUOTE.usd)}`} />
        </div>

        <section className="section" aria-labelledby="how-heading">
          <h2 id="how-heading">How it works</h2>
          <p className="micro">The same screens will run the live portal. Today every result is simulated.</p>
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
          <h2 id="price-heading">Illustration rates</h2>
          <p className="micro">
            These are the portal’s illustration rates. Minting a Space or a channel in this demo shows — MEOWE,
            because nothing is minted. Ownership writes go straight to Dogecoin. A message and a follow are the taxed MEOWE actions.
          </p>
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
            One demo rate covers every illustrated price: one penny is {formatMeowe(POST_QUOTE.meowe)}{' '}
            MEOWE. You only pay in MEOWE.
          </p>
        </section>

        <footer className="card">
          <p className="kicker">Links</p>
          <ul className="footer-links">
            <li>
              <a href={SITE.website} target="_blank" rel="noopener noreferrer">
                meoweco.in
              </a>
            </li>
            <li>
              <a href={SITE.x} target="_blank" rel="noopener noreferrer">
                X {SITE.xHandle}
              </a>
            </li>
            <li>
              <a href={SITE.telegram} target="_blank" rel="noopener noreferrer">
                Telegram
              </a>
            </li>
          </ul>
          <CopyButton label="Solana CA" value={SITE.ca} display={shortHash(SITE.ca, 6, 4)} />
          <p className="disclaimer">Not financial advice. DYOR.</p>
        </footer>
      </div>
    </div>
  );
}
