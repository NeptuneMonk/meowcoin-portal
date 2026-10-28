import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icons';
import { Forging, useSimulatedSubmit } from '../components/RecordFlow';
import { useMedia } from '../components/useMedia';
import { localImageUrl } from '../services/images';
import { COMMUNITY_QUOTE } from '../services/pricing';
import { usePageTitle } from '../usePageTitle';
import { ChatPage } from './ChatPage';

export function CreateCommunity() {
  usePageTitle('Mint a Space — The Forge');
  const mobile = useMedia('(max-width: 699px)');
  const flow = useSimulatedSubmit();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [topic, setTopic] = useState('');
  const [icon, setIcon] = useState<string | null>(null);
  const ready = name.trim().length >= 2;

  const form = (
    <MintFields
      name={name}
      topic={topic}
      icon={icon}
      mobile={mobile}
      onName={setName}
      onTopic={setTopic}
      onIcon={setIcon}
    />
  );

  if (mobile) {
    return (
      <section className="mpanel">
        <h1 style={{ marginBottom: 4 }}>Mint a Space</h1>
        <p className="lead" style={{ color: 'var(--text-2)', margin: '0 4px 16px' }}>
          A Space is an on-chain object on Dogecoin (P2FK). You own it and can give it like any other object.
        </p>
        {form}
        {flow.step === 'edit' ? (
          <>
            <button
              className="btn"
              type="button"
              style={{ width: '100%', height: 46, borderRadius: 10, marginTop: 14 }}
              disabled={!ready}
              onClick={() =>
                void flow.submit({
                  action: 'community',
                  name: name.trim(),
                  topic: topic.trim(),
                  quote: COMMUNITY_QUOTE,
                })
              }
            >
              Mint Space
            </button>
            <p className="fine">
              Demo only. Nothing is minted. Like any object, the Space can be given or transferred later from your objects. The icon stays on this device.
            </p>
          </>
        ) : null}
        {flow.step === 'forging' ? <Forging phase={flow.phase} /> : null}
        {flow.step === 'done' && flow.receipt ? (
          <p className="fine">
            Nothing was written to Dogecoin. This Space stays in the browser until you refresh.{' '}
            <Link to={`/c/${flow.receipt.entityId}`}>Open {name.trim()}</Link>
          </p>
        ) : null}
        {flow.error ? (
          <p className="alert" role="alert">
            {flow.error}
          </p>
        ) : null}
      </section>
    );
  }

  return (
    <>
      <ChatPage communityId="nine-lives" channelId="nine-lives-general" inert />
      <div className="scrim">
        <div className="modal" role="dialog" aria-labelledby="mint-title">
          <div className="hd">
            <h2 id="mint-title">Mint a Space</h2>
            <p className="lead">
              A Space is minted as an on-chain object on Dogecoin via P2FK. You own it, and you can give or transfer it like any other object.
            </p>
          </div>
          <div className="bd">
            {flow.step === 'forging' ? <Forging phase={flow.phase} /> : form}
            {flow.step === 'done' && flow.receipt ? (
              <p className="fine">
                Nothing was minted on Dogecoin. Cost in this demo: — MEOWE. The Space stays in this browser until you refresh.
              </p>
            ) : (
              <p className="fine">Demo only. Nothing is minted in this demo.</p>
            )}
            {flow.error ? (
              <p className="alert" role="alert">
                {flow.error}
              </p>
            ) : null}
          </div>
          <div className="ft">
            <button className="btn ghost" type="button" onClick={() => navigate('/c/nine-lives/nine-lives-general')}>
              Back
            </button>
            {flow.step === 'done' && flow.receipt ? (
              <Link className="btn" to={`/c/${flow.receipt.entityId}`}>
                Open Space
              </Link>
            ) : (
              <button
                className="btn"
                type="button"
                disabled={!ready || flow.step === 'forging'}
                onClick={() =>
                  void flow.submit({
                    action: 'community',
                    name: name.trim(),
                    topic: topic.trim(),
                    quote: COMMUNITY_QUOTE,
                  })
                }
              >
                Mint Space
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function MintFields({
  name,
  topic,
  icon,
  mobile,
  onName,
  onTopic,
  onIcon,
}: {
  name: string;
  topic: string;
  icon: string | null;
  mobile: boolean;
  onName: (value: string) => void;
  onTopic: (value: string) => void;
  onIcon: (value: string | null) => void;
}) {
  return (
    <div className={mobile ? 'mform' : undefined}>
      <label className="upl">
        {icon ? <img src={icon} alt="" /> : <Icon name="camera" />}
        {icon ? null : <span>ICON</span>}
        <span className="plus">+</span>
        <input
          className="file-input"
          type="file"
          accept="image/*"
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = '';
            if (!file || !file.type.startsWith('image/')) return;
            onIcon(localImageUrl(file));
          }}
        />
      </label>
      <label className="lbl" htmlFor="space-name">
        Space name
      </label>
      <input id="space-name" className="inp" placeholder="e.g. Midnight Zoomies" value={name} maxLength={32} onChange={(event) => onName(event.target.value)} />
      <label className="lbl" htmlFor="space-about">
        Description
      </label>
      <textarea id="space-about" className="inp" placeholder="What is this Space about?" value={topic} maxLength={140} onChange={(event) => onTopic(event.target.value)} />
      <div className="facts">
        <div className="r">
          <span>Minted as</span>
          <b>{mobile ? 'Object · Doge (P2FK)' : 'On-chain object · Dogecoin (P2FK)'}</b>
        </div>
        <div className="r">
          <span>Owner</span>
          <b>@NeptuneMonk</b>
        </div>
        <div className="r">
          <span>Transferable</span>
          <b>Yes, like any object</b>
        </div>
        <div className="r">
          <span>Cost</span>
          <b>— MEOWE</b>
        </div>
      </div>
    </div>
  );
}
