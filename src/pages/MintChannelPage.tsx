import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Icon } from '../components/Icons';
import { useMedia } from '../components/useMedia';
import { displayHandle } from '../avatars';
import { GUEST_HANDLE } from '../services/catalog';
import { CHANNEL_LICENSE, channelObjectPreview, listedChannels, profileAddress } from '../services/directory';
import { useChannels, useCommunities, useGuest } from '../services/hooks';
import { useServices } from '../services/provider';
import { shortHash } from '../format';
import { usePageTitle } from '../usePageTitle';
import { ChatPage } from './ChatPage';
import { NotFound } from './NotFound';

export function MintChannelPage() {
  const { communityId } = useParams();
  const spaces = useCommunities();
  const channels = useChannels();
  const guest = useGuest();
  const space = spaces.find((entry) => entry.id === communityId);
  usePageTitle(space ? `Mint a channel — ${space.name}` : 'Mint a channel — The Forge');
  if (!space) return <NotFound />;
  const listed = listedChannels(space, channels);
  const background = listed.find((channel) => channel.name === 'general') ?? listed[0];
  return (
    <MintChannelForm
      spaceId={space.id}
      spaceName={space.name}
      spaceAddress={space.address}
      ownerHandle={space.ownerHandle}
      backgroundChannelId={background?.id}
      creatorAddress={guest?.address ?? profileAddress(GUEST_HANDLE)}
    />
  );
}

function MintChannelForm({
  spaceId,
  spaceName,
  spaceAddress,
  ownerHandle,
  backgroundChannelId,
  creatorAddress,
}: {
  spaceId: string;
  spaceName: string;
  spaceAddress: string;
  ownerHandle: string;
  backgroundChannelId?: string;
  creatorAddress: string;
}) {
  const mobile = useMedia('(max-width: 699px)');
  const services = useServices();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [topic, setTopic] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [madeId, setMadeId] = useState<string | null>(null);
  const owner = ownerHandle === GUEST_HANDLE;
  const ready = name.trim().length >= 2 && !busy && !madeId;
  const preview = channelObjectPreview({
    name: name.trim() || '…',
    description: topic.trim(),
    spaceAddress,
    creatorAddress,
    ownerAddress: creatorAddress,
  });

  async function mint() {
    if (!ready) return;
    setBusy(true);
    setError('');
    try {
      const receipt = await services.relayer.submit({
        action: 'channel',
        communityId: spaceId,
        name: name.trim(),
        topic: topic.trim(),
      });
      setMadeId(receipt.entityId);
    } catch {
      setError('The demo could not mint that channel. Nothing was written.');
      setBusy(false);
    }
  }

  const fields = owner ? (
    <>
      <label className="lbl" htmlFor="channel-name">
        Channel name
      </label>
      <input
        id="channel-name"
        className="inp"
        placeholder="e.g. night-watch"
        value={name}
        maxLength={32}
        onChange={(event) => setName(event.target.value)}
      />
      <label className="lbl" htmlFor="channel-about">
        Description
      </label>
      <textarea
        id="channel-about"
        className="inp"
        placeholder="What is this channel about?"
        value={topic}
        maxLength={140}
        onChange={(event) => setTopic(event.target.value)}
      />
      <p className="lbl">Object</p>
      <pre className="obj-json">{JSON.stringify(preview, null, 2)}</pre>
      <p className="fine">
        License {CHANNEL_LICENSE}. uri is this Space ({shortHash(spaceAddress, 6, 4)}). cre and own are your profile address. Minted directly on Dogecoin.
      </p>
      <div className="facts">
        <div className="r">
          <span>Minted as</span>
          <b>Object · Dogecoin</b>
        </div>
        <div className="r">
          <span>Parent</span>
          <b>{spaceName}</b>
        </div>
        <div className="r">
          <span>Cost</span>
          <b>— MEOWE</b>
        </div>
      </div>
    </>
  ) : (
    <p className="lead">Only the Space owner can mint a channel. This Space is held by @{displayHandle(ownerHandle)}.</p>
  );

  const done = madeId ? (
    <p className="fine">
      Nothing was written to Dogecoin. Cost in this demo: — MEOWE. The channel stays in this browser until you refresh.{' '}
      <Link to={`/c/${spaceId}/${madeId}`}>Open #{name.trim()}</Link>
    </p>
  ) : (
    <p className="fine">Demo only. Nothing is minted. A channel is its own object, minted directly on Dogecoin.</p>
  );

  if (mobile) {
    return (
      <section className="mpanel">
        <h1 style={{ marginBottom: 4 }}>Mint a channel</h1>
        <p className="lead" style={{ color: 'var(--text-2)', margin: '0 4px 16px' }}>
          A text channel in {spaceName}. Minted directly on Dogecoin.
        </p>
        <div className="mform">
          {madeId ? null : fields}
          {done}
          {error ? (
            <p className="alert" role="alert">
              {error}
            </p>
          ) : null}
          {madeId ? null : owner ? (
            <button className="btn" type="button" style={{ width: '100%', height: 46, borderRadius: 10, marginTop: 14 }} disabled={!ready} onClick={() => void mint()}>
              Mint channel
            </button>
          ) : null}
          <p className="fine">
            <Link to={`/c/${spaceId}`}>Back to {spaceName}</Link>
          </p>
        </div>
      </section>
    );
  }

  return (
    <>
      {backgroundChannelId ? <ChatPage communityId={spaceId} channelId={backgroundChannelId} inert /> : <div className="thread-screen" />}
      <div className="scrim">
        <div className="modal" role="dialog" aria-labelledby="mint-channel-title">
          <div className="hd">
            <h2 id="mint-channel-title">Mint a channel</h2>
            <p className="lead">
              A text channel in {spaceName} is minted directly on Dogecoin, as its own object.
            </p>
          </div>
          <div className="bd">
            {madeId ? null : fields}
            {done}
            {error ? (
              <p className="alert" role="alert">
                {error}
              </p>
            ) : null}
          </div>
          <div className="ft">
            <button className="btn ghost" type="button" onClick={() => navigate(backgroundChannelId ? `/c/${spaceId}/${backgroundChannelId}` : `/c/${spaceId}`)}>
              <Icon name="back" className="i tiny" /> Back
            </button>
            {madeId ? (
              <Link className="btn" to={`/c/${spaceId}/${madeId}`}>
                Open channel
              </Link>
            ) : owner ? (
              <button className="btn" type="button" disabled={!ready} onClick={() => void mint()}>
                Mint channel
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
