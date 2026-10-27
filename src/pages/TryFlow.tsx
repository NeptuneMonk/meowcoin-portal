import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ACCESSORIES, FUR_CHOICES, lookFrom } from '../content/looks';
import { SITE } from '../content/site';
import { CatAvatar } from '../components/CatAvatar';
import { CopyButton } from '../components/CopyButton';
import { FeeSplit } from '../components/FeeSplit';
import { ItemArt, ITEM_ARTS } from '../components/ItemArt';
import { MemeArt, MEMES } from '../components/MemeArt';
import { SpinningCoin } from '../components/SpinningCoin';
import { prefersReducedMotion, useCountUp } from '../components/useCountUp';
import { formatMeowe, formatUsd, shortHash } from '../format';
import { useProfiles } from '../services/hooks';
import { useServices } from '../services/provider';
import { slugHandle } from '../services/ids';
import { POST_QUOTE, quoteAction } from '../services/pricing';
import type {
  Accessory,
  FeeQuote,
  ForgeReceipt,
  ForgeRequest,
  ItemArtId,
  MemeId,
  PortalAction,
  PublicWallet,
} from '../services/types';
import { usePageTitle } from '../usePageTitle';
import { NotFound } from './NotFound';

const ACTIONS: PortalAction[] = ['post', 'profile', 'mint'];

const PHASES = [
  'Pinning the file on IPFS',
  'Splitting the fee',
  'Burning MEOWE',
  'Writing the Dogecoin record',
] as const;

const TITLES: Record<PortalAction, string> = {
  post: 'Post a meme',
  profile: 'Create a profile',
  mint: 'Mint an item',
};

export function TryFlow() {
  const { action: param } = useParams();
  if (!param || !ACTIONS.includes(param as PortalAction)) {
    return <NotFound />;
  }
  return <Flow action={param as PortalAction} />;
}

function Flow({ action }: { action: PortalAction }) {
  usePageTitle(`${TITLES[action]} — The Forge`);
  const services = useServices();
  const profiles = useProfiles();
  const [step, setStep] = useState<'compose' | 'quote' | 'forging' | 'done'>('compose');
  const [quote, setQuote] = useState<FeeQuote>(() => quoteAction(action));
  const [wallet, setWallet] = useState<PublicWallet | null>(null);
  const [phase, setPhase] = useState(0);
  const [receipt, setReceipt] = useState<ForgeReceipt | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [text, setText] = useState('');
  const [meme, setMeme] = useState<MemeId | 'none'>('forever');
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [fur, setFur] = useState<string>(FUR_CHOICES[0].id);
  const [accessory, setAccessory] = useState<Accessory>('crown');
  const [itemName, setItemName] = useState('');
  const [blurb, setBlurb] = useState('');
  const [art, setArt] = useState<ItemArtId>('medallion');

  const busy = useRef(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    let on = true;
    services.pricing.quote(action).then((next) => {
      if (on) setQuote(next);
    });
    if (action === 'profile') {
      services.wallet.createWallet().then((next) => {
        if (on) setWallet(next);
      });
    }
    return () => {
      on = false;
    };
  }, [action, services]);

  const handle = slugHandle(name);
  const handleTaken = handle.length >= 3 && profiles.some((profile) => profile.handle === handle);
  const handleReserved = handle === 'you';
  const look = lookFrom(fur, accessory);

  const canContinue =
    action === 'post'
      ? text.trim().length > 0
      : action === 'profile'
        ? name.trim().length >= 2 && handle.length >= 3 && !handleTaken && !handleReserved
        : itemName.trim().length >= 2;

  function onContinue() {
    if (!canContinue) return;
    setError(null);
    setStep('quote');
  }

  function buildRequest(): ForgeRequest {
    if (action === 'post') {
      return {
        action: 'post',
        text: text.trim(),
        meme: meme === 'none' ? null : meme,
        quote,
      };
    }
    if (action === 'profile') {
      return {
        action: 'profile',
        name: name.trim(),
        handle,
        bio: bio.trim(),
        look,
        walletLabel: wallet?.publicAddress ?? 'demo',
        quote,
      };
    }
    return {
      action: 'mint',
      name: itemName.trim(),
      blurb: blurb.trim(),
      art,
      quote,
    };
  }

  async function forge() {
    if (busy.current || (action === 'profile' && !wallet)) return;
    busy.current = true;
    setError(null);
    setStep('forging');
    setPhase(0);
    try {
      const animated = playAnimation(setPhase, () => mounted.current);
      const next = await services.relayer.submit(buildRequest());
      await animated;
      if (!mounted.current) return;
      setReceipt(next);
      setStep('done');
    } catch {
      if (!mounted.current) return;
      setStep('quote');
      setError('The demo could not finish that. Nothing was sent. Try again.');
    } finally {
      busy.current = false;
    }
  }

  const stepIndex = step === 'compose' ? 0 : step === 'quote' ? 1 : step === 'forging' ? 2 : 3;
  const stepLabel = ['Compose', 'Price', 'Forge', 'Record'][stepIndex];

  return (
    <div className="wrap page narrow">
      <p>
        <Link to="/try">All try-it paths</Link>
      </p>
      <p className="kicker">{TITLES[action]}</p>
      <h1>{step === 'done' ? 'Record written to Dogecoin' : TITLES[action]}</h1>
      <p className="stepper" aria-live="polite">
        Step {stepIndex + 1} of 4 · {stepLabel}
      </p>
      <div className="stepper-bar" aria-hidden="true">
        {[0, 1, 2, 3].map((index) => (
          <span key={index} className={index <= stepIndex ? 'on' : ''} />
        ))}
      </div>

      {error ? (
        <p className="alert" role="alert">
          {error}
        </p>
      ) : null}

      {step === 'compose' ? (
        <form
          className="card try-card"
          onSubmit={(event) => {
            event.preventDefault();
            onContinue();
          }}
        >
          {action === 'post' ? (
            <PostFields text={text} setText={setText} meme={meme} setMeme={setMeme} />
          ) : null}
          {action === 'profile' ? (
            <ProfileFields
              name={name}
              setName={setName}
              bio={bio}
              setBio={setBio}
              fur={fur}
              setFur={setFur}
              accessory={accessory}
              setAccessory={setAccessory}
              look={look}
              handle={handle}
              handleTaken={handleTaken}
              handleReserved={handleReserved}
            />
          ) : null}
          {action === 'mint' ? (
            <MintFields
              itemName={itemName}
              setItemName={setItemName}
              blurb={blurb}
              setBlurb={setBlurb}
              art={art}
              setArt={setArt}
            />
          ) : null}
          <button className="btn btn-primary btn-block" type="submit" disabled={!canContinue}>
            See the price
          </button>
        </form>
      ) : null}

      {step === 'quote' ? (
        <div className="try-card">
          <section className="card quote-hero">
            <p className="kicker">Demo price</p>
            <p className="price-xl">{formatUsd(quote.usd)}</p>
            <p>
              That is <strong>{formatMeowe(quote.meowe)} MEOWE</strong> at the demo rate, where one
              penny is {formatMeowe(POST_QUOTE.meowe)} MEOWE. You would pay only in MEOWE.
            </p>
            <QuotePreview
              action={action}
              text={text}
              meme={meme}
              name={name}
              look={look}
              itemName={itemName}
              art={art}
            />
            {action === 'profile' ? (
              <p className="micro">
                {wallet
                  ? `Portal wallet (demo) ${shortHash(wallet.publicAddress, 6, 4)}. No key was created.`
                  : 'Preparing a demo wallet label…'}
              </p>
            ) : null}
          </section>
          <FeeSplit quote={quote} heading="Where this fee goes" />
          <div className="btn-row">
            <button className="btn btn-ghost" type="button" onClick={() => setStep('compose')}>
              Back
            </button>
            <button
              className="btn btn-primary"
              type="button"
              onClick={forge}
              disabled={action === 'profile' && !wallet}
            >
              Forge it (demo)
            </button>
          </div>
        </div>
      ) : null}

      {step === 'forging' ? <Forging phase={phase} burn={quote.split.burn} /> : null}

      {step === 'done' && receipt ? (
        <Done action={action} receipt={receipt} />
      ) : null}
    </div>
  );
}

function PostFields({
  text,
  setText,
  meme,
  setMeme,
}: {
  text: string;
  setText: (value: string) => void;
  meme: MemeId | 'none';
  setMeme: (value: MemeId | 'none') => void;
}) {
  return (
    <>
      <label className="field">
        <span>Your post</span>
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value.slice(0, 280))}
          rows={4}
          required
          placeholder="Memes are forever on Doge."
        />
        <small>{text.trim().length} / 280</small>
      </label>
      <fieldset>
        <legend>Meme card</legend>
        <div className="picks memes">
          {MEMES.map((entry) => (
            <label key={entry.id} className="pick">
              <input
                type="radio"
                name="meme"
                value={entry.id}
                checked={meme === entry.id}
                onChange={() => setMeme(entry.id)}
              />
              <MemeArt id={entry.id} decorative />
              <span>{entry.label}</span>
            </label>
          ))}
          <label className="pick">
            <input
              type="radio"
              name="meme"
              value="none"
              checked={meme === 'none'}
              onChange={() => setMeme('none')}
            />
            <span className="pick-plain">Message only</span>
          </label>
        </div>
      </fieldset>
    </>
  );
}

function ProfileFields({
  name,
  setName,
  bio,
  setBio,
  fur,
  setFur,
  accessory,
  setAccessory,
  look,
  handle,
  handleTaken,
  handleReserved,
}: {
  name: string;
  setName: (value: string) => void;
  bio: string;
  setBio: (value: string) => void;
  fur: string;
  setFur: (value: string) => void;
  accessory: Accessory;
  setAccessory: (value: Accessory) => void;
  look: ReturnType<typeof lookFrom>;
  handle: string;
  handleTaken: boolean;
  handleReserved: boolean;
}) {
  return (
    <>
      <div className="profile-preview">
        <CatAvatar look={look} label="Preview of your cat" size="lg" />
        <div>
          <strong>{name.trim() || 'Your cat'}</strong>
          <p className="micro">{handle ? `@${handle}` : 'Type a name'}</p>
        </div>
      </div>
      <label className="field">
        <span>Name</span>
        <input
          value={name}
          onChange={(event) => setName(event.target.value.slice(0, 24))}
          required
          autoComplete="off"
          placeholder="Goldpaw"
        />
      </label>
      {handleTaken ? <p className="alert">That name is already in this demo.</p> : null}
      {handleReserved ? <p className="alert">Pick another name.</p> : null}
      <label className="field">
        <span>Bio</span>
        <textarea
          value={bio}
          onChange={(event) => setBio(event.target.value.slice(0, 160))}
          rows={3}
          placeholder="Nine lives. Still here."
        />
        <small>{bio.length} / 160</small>
      </label>
      <fieldset>
        <legend>Fur</legend>
        <div className="fur-row">
          {FUR_CHOICES.map((choice) => (
            <label key={choice.id} className="fur">
              <input
                type="radio"
                name="fur"
                value={choice.id}
                checked={fur === choice.id}
                onChange={() => setFur(choice.id)}
              />
              <span className="swatch-dot" style={{ background: choice.fur }} />
              <span>{choice.label}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend>Accessory</legend>
        <div className="filters">
          {ACCESSORIES.map((choice) => (
            <label key={choice.id} className="chip-choice">
              <input
                type="radio"
                name="accessory"
                value={choice.id}
                checked={accessory === choice.id}
                onChange={() => setAccessory(choice.id)}
              />
              {choice.label}
            </label>
          ))}
        </div>
      </fieldset>
    </>
  );
}

function MintFields({
  itemName,
  setItemName,
  blurb,
  setBlurb,
  art,
  setArt,
}: {
  itemName: string;
  setItemName: (value: string) => void;
  blurb: string;
  setBlurb: (value: string) => void;
  art: ItemArtId;
  setArt: (value: ItemArtId) => void;
}) {
  return (
    <>
      <label className="field">
        <span>Item name</span>
        <input
          value={itemName}
          onChange={(event) => setItemName(event.target.value.slice(0, 32))}
          required
          autoComplete="off"
          placeholder="Sunbeam Medallion"
        />
      </label>
      <label className="field">
        <span>One line about it</span>
        <textarea
          value={blurb}
          onChange={(event) => setBlurb(event.target.value.slice(0, 140))}
          rows={3}
          placeholder="A small object, kept on Dogecoin."
        />
        <small>{blurb.length} / 140</small>
      </label>
      <fieldset>
        <legend>Artwork</legend>
        <div className="picks arts">
          {ITEM_ARTS.map((entry) => (
            <label key={entry.id} className="pick">
              <input
                type="radio"
                name="art"
                value={entry.id}
                checked={art === entry.id}
                onChange={() => setArt(entry.id)}
              />
              <ItemArt id={entry.id} decorative />
              <span>{entry.label}</span>
            </label>
          ))}
        </div>
      </fieldset>
    </>
  );
}

function QuotePreview({
  action,
  text,
  meme,
  name,
  look,
  itemName,
  art,
}: {
  action: PortalAction;
  text: string;
  meme: MemeId | 'none';
  name: string;
  look: ReturnType<typeof lookFrom>;
  itemName: string;
  art: ItemArtId;
}) {
  if (action === 'post') {
    return (
      <div className="preview-block">
        {meme === 'none' ? null : <MemeArt id={meme} />}
        <p className="post-text">{text}</p>
      </div>
    );
  }
  if (action === 'profile') {
    return (
      <div className="profile-preview">
        <CatAvatar look={look} label="" decorative size="lg" />
        <strong>{name}</strong>
      </div>
    );
  }
  return (
    <div className="preview-block">
      <ItemArt id={art} decorative />
      <p>
        <strong>{itemName}</strong>
      </p>
    </div>
  );
}

function Forging({ phase, burn }: { phase: number; burn: number }) {
  const shown = useCountUp(phase >= 2 ? burn : 0, 500);
  return (
    <section className="card try-card" aria-live="polite">
      <p className="kicker">Simulated</p>
      <p className="burn-num">{formatMeowe(shown)}</p>
      <p className="burn-unit">MEOWE burned in this demo</p>
      <ol className="forge-list">
        {PHASES.map((label, index) => (
          <li key={label} className={index < phase ? 'done' : index === phase ? 'active' : ''}>
            {label}
          </li>
        ))}
      </ol>
    </section>
  );
}

function Done({ action, receipt }: { action: PortalAction; receipt: ForgeReceipt }) {
  const next =
    action === 'profile'
      ? { to: `/profile/${receipt.handle}`, label: 'See your profile' }
      : action === 'mint'
        ? { to: `/market/${receipt.entityId}`, label: 'See the item' }
        : { to: '/explore', label: 'See it in the feed' };

  return (
    <div className="try-card">
      <section className="card">
        <p className="kicker">Simulated confirmation</p>
        <ul className="checks">
          <li>Burned {formatMeowe(receipt.burned)} MEOWE</li>
          <li>File pinned on IPFS</li>
          <li>Solana memo carries the content id</li>
          <li>Dogecoin record written</li>
        </ul>
        <div className="badge-row">
          <CopyButton label="IPFS CID" value={receipt.cid} display={shortHash(receipt.cid, 10, 6)} />
          <CopyButton
            label="Dogecoin record"
            value={receipt.dogeTxid}
            display={shortHash(receipt.dogeTxid, 8, 4)}
          />
        </div>
        <details>
          <summary>Show the full demo record</summary>
          <p className="micro">Solana memo</p>
          <code className="block">{receipt.memo}</code>
          <p className="micro">Solana signature (demo)</p>
          <code className="block">{receipt.solanaSignature}</code>
        </details>
      </section>
      <section className="card coming">
        <SpinningCoin />
        <h2>This is a demo — coming soon.</h2>
        <p>Nothing was signed or sent. The real Forge will use these same screens.</p>
        <div className="btn-row">
          <a className="btn btn-primary" href={SITE.website} target="_blank" rel="noopener noreferrer">
            meoweco.in
          </a>
          <a className="btn btn-ghost" href={SITE.x} target="_blank" rel="noopener noreferrer">
            X {SITE.xHandle}
          </a>
          <a className="btn btn-ghost" href={SITE.telegram} target="_blank" rel="noopener noreferrer">
            Telegram
          </a>
        </div>
        <Link className="btn btn-ghost btn-block" to={next.to}>
          {next.label}
        </Link>
      </section>
    </div>
  );
}

function playAnimation(setPhase: (phase: number) => void, alive: () => boolean): Promise<void> {
  if (prefersReducedMotion()) {
    if (alive()) setPhase(3);
    return Promise.resolve();
  }
  return (async () => {
    for (let phase = 0; phase < PHASES.length; phase += 1) {
      if (!alive()) return;
      setPhase(phase);
      await new Promise((resolve) => window.setTimeout(resolve, 420));
    }
  })();
}
