import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ScreenHead } from '../components/AppShell';
import { CopyButton } from '../components/CopyButton';
import { FeeSplit } from '../components/FeeSplit';
import { ImagePick, LocalPreview } from '../components/ImagePick';
import { ProfileFace } from '../components/ProfileFace';
import { ComingSoon, Forging, useSimulatedSubmit } from '../components/RecordFlow';
import { formatMeowe, shortHash } from '../format';
import { GUEST_HANDLE } from '../services/catalog';
import {
  useAllMessages,
  useChannels,
  useCommunities,
  useProfiles,
} from '../services/hooks';
import { MESSAGE_QUOTE } from '../services/pricing';
import type { ChatMessage } from '../services/types';
import { usePageTitle } from '../usePageTitle';
import { NotFound } from './NotFound';

export function ChatPage() {
  const { communityId, channelId } = useParams();
  const communities = useCommunities();
  const channels = useChannels();
  const messages = useAllMessages();
  const profiles = useProfiles();
  const community = communities.find((entry) => entry.id === communityId);
  const channel = channels.find(
    (entry) => entry.id === channelId && entry.communityId === communityId,
  );
  const thread = messages.filter((message) => message.channelId === channel?.id);
  const flow = useSimulatedSubmit();
  const [text, setText] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const scroller = useRef<HTMLDivElement>(null);
  usePageTitle(channel ? `#${channel.name} — The Forge` : 'Chat — The Forge');

  useEffect(() => {
    const node = scroller.current;
    if (!node || flow.step !== 'edit') return;
    node.scrollTop = node.scrollHeight;
  }, [thread.length, flow.step]);

  if (!community || !channel) return <NotFound />;

  const canSend = text.trim().length > 0 || Boolean(image);

  function reset() {
    setText('');
    setImage(null);
    flow.setStep('edit');
  }

  return (
    <div className="thread-screen">
      <ScreenHead
        title={`#${channel.name}`}
        backTo={`/c/${community.id}`}
        backLabel={community.name}
      />
      <p className="micro thread-topic">
        {community.name} · {channel.topic}{' '}
        <Link to={`/u/${community.ownerHandle}/store`}>Owner’s storefront</Link>
      </p>

      {flow.step === 'edit' ? (
        <>
          <div className="thread" ref={scroller}>
            {thread.length === 0 ? (
              <p className="micro">No messages yet. The first one is about one cent.</p>
            ) : (
              <ul className="bubbles">
                {thread.map((message) => {
                  const author = profiles.find((profile) => profile.handle === message.handle);
                  return (
                    <Message
                      key={message.id}
                      message={message}
                      name={author?.name ?? message.handle}
                      mine={message.handle === GUEST_HANDLE}
                      profile={author}
                    />
                  );
                })}
              </ul>
            )}
          </div>
          <form
            className="composer"
            onSubmit={(event) => {
              event.preventDefault();
              if (!canSend) return;
              flow.setStep('quote');
            }}
          >
            {image ? (
              <div className="composer-preview">
                <LocalPreview src={image} alt="Image that stays on this device" />
                <button className="btn btn-ghost" type="button" onClick={() => setImage(null)}>
                  Remove
                </button>
              </div>
            ) : null}
            <p className="micro stay">Your image stays on your device in demo mode.</p>
            <div className="composer-row">
              <ImagePick label="Image" onPick={setImage} quiet />
              <label className="composer-text">
                <span className="sr-only">Message</span>
                <textarea
                  value={text}
                  maxLength={280}
                  rows={2}
                  placeholder="Message this channel"
                  onChange={(event) => setText(event.target.value)}
                />
              </label>
              <button className="btn btn-primary" type="submit" disabled={!canSend}>
                Send
              </button>
            </div>
          </form>
        </>
      ) : null}

      {flow.step === 'quote' ? (
        <div className="pad flow">
          {image ? <LocalPreview src={image} alt="Image that stays on this device" /> : null}
          {text ? <p className="draft">“{text.trim()}”</p> : null}
          <p className="price-xl">{formatMeowe(MESSAGE_QUOTE.meowe)} MEOWE</p>
          <p>About one cent. Nothing is sent until you confirm, and even then it is simulated.</p>
          <FeeSplit quote={MESSAGE_QUOTE} heading="On this message · $0.01" />
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
                  action: 'message',
                  channelId: channel.id,
                  text: text.trim(),
                  localImageUrl: image,
                  quote: MESSAGE_QUOTE,
                })
              }
            >
              Send it (demo)
            </button>
          </div>
        </div>
      ) : null}

      {flow.step === 'forging' ? (
        <div className="pad">
          <Forging phase={flow.phase} />
        </div>
      ) : null}

      {flow.step === 'done' && flow.receipt ? (
        <div className="pad">
          <ComingSoon>
            <p className="micro">Burned {formatMeowe(flow.receipt.burned)} MEOWE.</p>
            <button className="btn btn-primary" type="button" onClick={reset}>
              Back to the chat
            </button>
          </ComingSoon>
        </div>
      ) : null}
    </div>
  );
}

function Message({
  message,
  name,
  mine,
  profile,
}: {
  message: ChatMessage;
  name: string;
  mine: boolean;
  profile: ReturnType<typeof useProfiles>[number] | undefined;
}) {
  return (
    <li className={mine ? 'bubble mine' : 'bubble'}>
      {profile ? <ProfileFace profile={profile} size="sm" decorative /> : <span className="avatar avatar-sm" />}
      <div>
        <p className="bubble-name">
          {name} <time>{message.createdLabel}</time>
        </p>
        {message.text ? <p>{message.text}</p> : null}
        {message.localImageUrl ? (
          <>
            <img src={message.localImageUrl} alt="Image sent from this device" />
            <p className="micro">Your image stays on your device in demo mode.</p>
          </>
        ) : null}
        <details className="burn-chip">
          <summary>Burned {formatMeowe(message.burned)} MEOWE</summary>
          <p className="micro">Simulated record for this message.</p>
          <CopyButton label="IPFS CID" value={message.cid} display={shortHash(message.cid, 10, 6)} />
          <CopyButton
            label="Dogecoin record"
            value={message.dogeTxid}
            display={shortHash(message.dogeTxid, 8, 4)}
          />
        </details>
      </div>
    </li>
  );
}
