import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ScreenHead } from '../components/AppShell';
import { FeeSplit } from '../components/FeeSplit';
import { ImagePick, LocalPreview } from '../components/ImagePick';
import { ProfileFace } from '../components/ProfileFace';
import { ComingSoon, Forging, useSimulatedSubmit } from '../components/RecordFlow';
import { formatMeowe, formatUsd } from '../format';
import { GUEST_HANDLE } from '../services/catalog';
import { useGuest, useOwnedCommunities } from '../services/hooks';
import { PROFILE_QUOTE } from '../services/pricing';
import { usePageTitle } from '../usePageTitle';

export function MePage() {
  usePageTitle('Profile — The Forge');
  const guest = useGuest();
  const owned = useOwnedCommunities(GUEST_HANDLE);
  const flow = useSimulatedSubmit();
  const [image, setImage] = useState<string | null>(null);

  if (!guest) return null;

  return (
    <div className="fill pad">
      <ScreenHead title="Profile" />
      {flow.step === 'edit' ? (
        <div className="profile-body">
          <ProfileFace profile={guest} size="xl" />
          <p className="kicker">{guest.role}</p>
          <p>{guest.bio}</p>
          <ImagePick label="Choose a profile picture" onPick={setImage} />
          {image ? (
            <>
              <LocalPreview src={image} alt="New profile picture on this device" round />
              <button className="btn btn-primary" type="button" onClick={() => flow.setStep('quote')}>
                See the price
              </button>
            </>
          ) : null}
          <h2>Your communities</h2>
          {owned.length === 0 ? (
            <p className="micro">
              None yet. <Link to="/communities/new">Create one</Link>.
            </p>
          ) : (
            <ul className="plain-list">
              {owned.map((community) => (
                <li key={community.id}>
                  <Link to={`/c/${community.id}`}>{community.name}</Link>
                </li>
              ))}
            </ul>
          )}
          <Link className="btn btn-ghost" to="/store">
            Open my store
          </Link>
        </div>
      ) : null}

      {flow.step === 'quote' && image ? (
        <div className="flow">
          <LocalPreview src={image} alt="New profile picture on this device" round />
          <p className="price-xl">{formatUsd(PROFILE_QUOTE.usd)}</p>
          <p>{formatMeowe(PROFILE_QUOTE.meowe)} MEOWE</p>
          <FeeSplit
            quote={PROFILE_QUOTE}
            heading={`On this picture · ${formatUsd(PROFILE_QUOTE.usd)}`}
          />
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
            className="btn btn-primary"
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
  );
}
