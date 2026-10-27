import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ScreenHead } from '../components/AppShell';
import { FeeSplit } from '../components/FeeSplit';
import { ImagePick, LocalPreview } from '../components/ImagePick';
import { ComingSoon, Forging, useSimulatedSubmit } from '../components/RecordFlow';
import { formatMeowe, formatUsd } from '../format';
import { MINT_QUOTE } from '../services/pricing';
import { usePageTitle } from '../usePageTitle';

export function MintPage() {
  usePageTitle('Mint an item — The Forge');
  const flow = useSimulatedSubmit();
  const [image, setImage] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [blurb, setBlurb] = useState('');
  const ready = Boolean(image) && name.trim().length >= 2;

  return (
    <div className="fill pad">
      <ScreenHead title="Mint an item" backTo="/store" backLabel="My store" />
      {flow.step === 'edit' ? (
        <form
          className="card flow"
          onSubmit={(event) => {
            event.preventDefault();
            if (ready) flow.setStep('quote');
          }}
        >
          <ImagePick label="Choose an image" onPick={setImage} />
          {image ? <LocalPreview src={image} alt="Item image on this device" /> : null}
          <label className="field">
            <span>Name</span>
            <input
              value={name}
              maxLength={40}
              required
              onChange={(event) => setName(event.target.value)}
            />
          </label>
          <label className="field">
            <span>Note</span>
            <textarea
              value={blurb}
              maxLength={180}
              rows={3}
              onChange={(event) => setBlurb(event.target.value)}
            />
          </label>
          <button className="btn btn-primary btn-block" type="submit" disabled={!ready}>
            See the price
          </button>
        </form>
      ) : null}

      {flow.step === 'quote' && image ? (
        <div className="flow">
          <LocalPreview src={image} alt="Item image on this device" />
          <h2>{name.trim()}</h2>
          {blurb.trim() ? <p>{blurb.trim()}</p> : null}
          <p className="price-xl">{formatUsd(MINT_QUOTE.usd)}</p>
          <p>{formatMeowe(MINT_QUOTE.meowe)} MEOWE</p>
          <FeeSplit quote={MINT_QUOTE} heading={`On this item · ${formatUsd(MINT_QUOTE.usd)}`} />
          {flow.error ? (
            <p className="alert" role="alert">
              {flow.error}
            </p>
          ) : null}
          <div className="btn-row">
            <button className="btn btn-ghost" type="button" onClick={() => flow.setStep('edit')}>
              Back
            </button>
            <button
              className="btn btn-primary"
              type="button"
              onClick={() =>
                void flow.submit({
                  action: 'mint',
                  name: name.trim(),
                  blurb: blurb.trim(),
                  localImageUrl: image,
                  quote: MINT_QUOTE,
                })
              }
            >
              Mint it (demo)
            </button>
          </div>
        </div>
      ) : null}

      {flow.step === 'forging' ? <Forging phase={flow.phase} /> : null}

      {flow.step === 'done' && flow.receipt ? (
        <ComingSoon>
          <Link className="btn btn-primary" to={`/item/${flow.receipt.entityId}`}>
            See the item
          </Link>
          <Link className="btn btn-ghost" to="/store">
            Back to my store
          </Link>
        </ComingSoon>
      ) : null}
    </div>
  );
}
