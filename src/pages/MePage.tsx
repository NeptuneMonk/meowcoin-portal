import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FeeSplit } from '../components/FeeSplit';
import { ImagePick, LocalPreview } from '../components/ImagePick';
import { ComingSoon, Forging, useSimulatedSubmit } from '../components/RecordFlow';
import { MobileProfile, StorefrontView } from '../components/StorefrontView';
import { useMedia } from '../components/useMedia';
import { formatMeowe, formatUsd } from '../format';
import { GUEST_HANDLE } from '../services/catalog';
import { useGuest } from '../services/hooks';
import { PROFILE_QUOTE } from '../services/pricing';
import { usePageTitle } from '../usePageTitle';

export function MePage() {
  usePageTitle('Profile — The Forge');
  const guest = useGuest();
  const mobile = useMedia('(max-width: 699px)');
  const flow = useSimulatedSubmit();
  const [image, setImage] = useState<string | null>(null);
  if (!guest) return null;

  return (
    <div className="fill">
      {mobile ? <MobileProfile handle={GUEST_HANDLE} /> : <StorefrontView handle={GUEST_HANDLE} mine />}
      <div className="pad page-narrow">
        <h2>Profile picture</h2>
        <p className="micro">
          The picture stays on this device. Its dominant colour becomes your accent. A plain grey cat
          keeps a neutral accent.
        </p>
        {flow.step === 'edit' ? (
          <>
            <ImagePick label="Choose a profile picture" onPick={setImage} />
            {image ? (
              <>
                <LocalPreview src={image} alt="New profile picture on this device" round />
                <button className="btn" type="button" onClick={() => flow.setStep('quote')}>
                  See the price
                </button>
              </>
            ) : null}
            <p>
              <Link to="/communities/new">Mint a Space</Link>
            </p>
          </>
        ) : null}
        {flow.step === 'quote' && image ? (
          <div className="flow">
            <LocalPreview src={image} alt="New profile picture on this device" round />
            <p className="price-xl">{formatUsd(PROFILE_QUOTE.usd)}</p>
            <p>{formatMeowe(PROFILE_QUOTE.meowe)} MEOWE</p>
            <FeeSplit quote={PROFILE_QUOTE} heading={`On this picture · ${formatUsd(PROFILE_QUOTE.usd)}`} />
            {flow.error ? (
              <p className="alert" role="alert">
                {flow.error}
              </p>
            ) : null}
            <div className="btn-row">
              <button className="btn ghost" type="button" onClick={() => flow.setStep('edit')}>
                Back
              </button>
              <button
                className="btn"
                type="button"
                onClick={() =>
                  void flow.submit({
                    action: 'profile',
                    localImageUrl: image,
                    quote: PROFILE_QUOTE,
                  })
                }
              >
                Save it (demo)
              </button>
            </div>
          </div>
        ) : null}
        {flow.step === 'forging' ? <Forging phase={flow.phase} /> : null}
        {flow.step === 'done' ? (
          <ComingSoon>
            <button
              className="btn"
              type="button"
              onClick={() => {
                setImage(null);
                flow.setStep('edit');
              }}
            >
              Back to your profile
            </button>
          </ComingSoon>
        ) : null}
      </div>
    </div>
  );
}
