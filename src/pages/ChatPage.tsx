import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AttachMenu } from '../components/AttachMenu';
import { ChannelDetails } from '../components/ChannelDetails';
import { Icon } from '../components/Icons';
import { MessageStream, type StreamItem } from '../components/MessageStream';
import { ObjectCard } from '../components/ObjectCard';
import { ComingSoon, Forging, useSimulatedSubmit } from '../components/RecordFlow';
import { FeeSplit } from '../components/FeeSplit';
import { formatMeowe } from '../format';
import { localImageUrl } from '../services/images';
import { useChannels, useCommunities } from '../services/hooks';
import { useAllMessages } from '../services/hooks';
import { MESSAGE_QUOTE } from '../services/pricing';
import type { ChatMessage } from '../services/types';
import { usePageTitle } from '../usePageTitle';
import { NotFound } from './NotFound';

export function ChatPage({
  communityId,
  channelId,
  inert = false,
}: {
  communityId?: string;
  channelId?: string;
  inert?: boolean;
} = {}) {
  const params = useParams();
  const cid = communityId ?? params.communityId;
  const chid = channelId ?? params.channelId;
  const communities = useCommunities();
  const channels = useChannels();
  const messages = useAllMessages();
  const space = communities.find((entry) => entry.id === cid);
  const channel = channels.find((entry) => entry.id === chid && entry.communityId === cid);
  const thread = messages.filter((message) => message.channelId === channel?.id);
  const flow = useSimulatedSubmit();
  const [text, setText] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [shared, setShared] = useState<string | null>(null);
  const [details, setDetails] = useState(false);
  const [query, setQuery] = useState('');
  const scroller = useRef<HTMLDivElement>(null);
  usePageTitle(channel && !inert ? `#${channel.name} — The Forge` : 'Chat — The Forge');

  useEffect(() => {
    setText('');
    setImage(null);
    setShared(null);
    setDetails(false);
    setQuery('');
    flow.setStep('edit');
  }, [channel?.id]);

  useEffect(() => {
    const node = scroller.current;
    if (!node || flow.step !== 'edit') return;
    node.scrollTop = node.scrollHeight;
  }, [thread.length, flow.step]);

  const rows = useMemo(() => toRows(thread, space?.ownerHandle ?? '', query), [thread, space?.ownerHandle, query]);

  if (!space || !channel) return inert ? null : <NotFound />;

  const canSend = text.trim().length > 0 || Boolean(image) || Boolean(shared);

  function onFile(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    if (file.size > 8_000_000) return;
    setImage(localImageUrl(file));
  }

  return (
    <div className={`thread-screen${inert ? ' inert-chat' : ''}`} aria-hidden={inert || undefined}>
      <div className="main-h only-desk">
        <span className="hash" style={{ color: 'var(--dim)', fontSize: 24 }}>
          #
        </span>
        <button className="t name-btn" type="button" onClick={() => setDetails(true)}>
          {channel.name}
        </button>
        <span className="topic">{channel.topic}</span>
        <div className="tools">
          <button className="tool" type="button" aria-label={`Details for #${channel.name}`} onClick={() => setDetails(true)}>
            <Icon name="info" />
          </button>
          <span className="tool" aria-hidden="true">
            <Icon name="bell" />
          </span>
          <span className="tool" aria-hidden="true">
            <Icon name="pin" />
          </span>
          <span className="tool" aria-hidden="true">
            <Icon name="people" />
          </span>
          <label className="search">
            <span className="sr-only">Search {space.name}</span>
            <input
              value={query}
              placeholder={`Search ${space.name}`}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
        </div>
      </div>
      <div className="mhead only-mob">
        <Link to={`/c/${space.id}`} aria-label="Back">
          <Icon name="back" />
        </Link>
        <span style={{ color: 'var(--dim)', fontSize: 24 }}>#</span>
        <div>
          <button className="t name-btn" type="button" onClick={() => setDetails(true)}>
            {channel.name}
          </button>
          <div className="s">
            {space.name} · <Icon name="chain" /> on-chain Space
          </div>
        </div>
        <div className="r">
          <button className="tool" type="button" aria-label={`Details for #${channel.name}`} onClick={() => setDetails(true)}>
            <Icon name="info" />
          </button>
          <Icon name="search" />
          <Icon name="people" />
        </div>
      </div>

      <div className="msgs" ref={scroller}>
        <div className="msgs-inner">
          <div className="welcome">
            <div className="big">#</div>
            <h2>Welcome to #{channel.name}!</h2>
            <p>
              This is the start of the #{channel.name} channel in <b>{space.name}</b>. Messages here are sent to this channel’s object address.
            </p>
          </div>
          {rows.length === 0 ? <p className="micro pad">No messages yet.</p> : <MessageStream items={rows} />}
        </div>
      </div>

      {image || shared ? (
        <div className="attach-preview">
          {image ? <img src={image} alt="Image that stays on this device" /> : null}
          {shared ? (
            <div className="preview-card">
              <ObjectCard address={shared} />
            </div>
          ) : null}
          <button
            className="btn ghost"
            type="button"
            onClick={() => {
              setImage(null);
              setShared(null);
            }}
          >
            Remove
          </button>
          {image ? <span className="micro">Your image stays on your device in demo mode.</span> : null}
        </div>
      ) : null}

      <form
        className="composer only-desk"
        onSubmit={(event) => {
          event.preventDefault();
          if (!inert && canSend) flow.setStep('quote');
        }}
      >
        <AttachMenu key={`${channel.id}-desk`} onFile={onFile} onObject={setShared} />
        <textarea
          value={text}
          maxLength={280}
          rows={1}
          placeholder={`Message #${channel.name}`}
          aria-label={`Message #${channel.name}`}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              if (canSend) flow.setStep('quote');
            }
          }}
        />
        <span className="cost">
          <Icon name="chain" /> kept on Doge
        </span>
        <span className="ico" aria-hidden="true">
          <Icon name="gift" />
        </span>
        <button className="ico" type="submit" aria-label="Send" disabled={!canSend || inert}>
          <Icon name="smile" />
        </button>
      </form>
      <form
        className="mcomp only-mob"
        onSubmit={(event) => {
          event.preventDefault();
          if (canSend) flow.setStep('quote');
        }}
      >
        <AttachMenu key={`${channel.id}-mob`} round onFile={onFile} onObject={setShared} />
        <label className="f">
          <span className="sr-only">Message</span>
          <textarea
            value={text}
            maxLength={280}
            rows={1}
            placeholder={`Message #${channel.name}`}
            onChange={(event) => setText(event.target.value)}
          />
          <Icon name="smile" />
        </label>
      </form>

      {flow.step !== 'edit' && !inert ? (
        <div className="scrim">
          <div className="modal" role="dialog" aria-labelledby="send-title">
            <div className="hd">
              <h2 id="send-title">Send to #{channel.name}</h2>
              <p className="lead">About one cent. Nothing is sent until you confirm, and even then it is simulated.</p>
            </div>
            <div className="bd">
              {image ? <img className="upload-preview" src={image} alt="Image that stays on this device" /> : null}
              {shared ? <ObjectCard address={shared} /> : null}
              {text.trim() ? <p className="draft">“{text.trim()}”</p> : null}
              {flow.step === 'quote' ? (
                <>
                  <p className="price-xl">{formatMeowe(MESSAGE_QUOTE.meowe)} MEOWE</p>
                  <FeeSplit quote={MESSAGE_QUOTE} heading="On this message · $0.01" />
                  {flow.error ? (
                    <p className="alert" role="alert">
                      {flow.error}
                    </p>
                  ) : null}
                </>
              ) : null}
              {flow.step === 'forging' ? <Forging phase={flow.phase} /> : null}
              {flow.step === 'done' && flow.receipt ? (
                <ComingSoon>
                  <p className="micro">Burned {formatMeowe(flow.receipt.burned)} MEOWE. Simulated.</p>
                </ComingSoon>
              ) : null}
            </div>
            <div className="ft">
              <button
                className="btn ghost"
                type="button"
                onClick={() => {
                  if (flow.step === 'done') {
                    setText('');
                    setImage(null);
                    setShared(null);
                  }
                  flow.setStep('edit');
                }}
              >
                {flow.step === 'done' ? 'Back to the chat' : 'Back'}
              </button>
              {flow.step === 'quote' ? (
                <button
                  className="btn"
                  type="button"
                  onClick={() =>
                    void flow.submit({
                      action: 'message',
                      channelId: channel.id,
                      text: text.trim(),
                      localImageUrl: image,
                      sharedAddress: shared,
                      quote: MESSAGE_QUOTE,
                    })
                  }
                >
                  Send it (demo)
                </button>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
      {details ? <ChannelDetails space={space} channel={channel} onClose={() => setDetails(false)} /> : null}
    </div>
  );
}

function toRows(messages: readonly ChatMessage[], owner: string, query: string): StreamItem[] {
  const q = query.trim().toLowerCase();
  const items: StreamItem[] = [];
  let lastDay = '';
  let prev: ChatMessage | null = null;
  for (const message of messages) {
    if (q && !message.text.toLowerCase().includes(q)) continue;
    const day = message.createdLabel.startsWith('Today')
      ? 'Today'
      : message.createdLabel.startsWith('Yesterday')
        ? 'Yesterday'
        : '';
    if (day && day !== lastDay) {
      items.push({ type: 'day', label: day });
      lastDay = day;
    }
    const cont = Boolean(prev && prev.handle === message.handle && prev.createdLabel === message.createdLabel && !q);
    items.push({
      type: 'msg',
      key: message.id,
      handle: message.handle,
      text: message.text,
      time: message.createdLabel,
      cont,
      image: message.localImageUrl,
      owner: message.handle === owner,
      sharedAddress: message.sharedAddress,
      record: {
        burned: message.burned,
        cid: message.cid,
        dogeTxid: message.dogeTxid,
        sentTo: message.sentTo,
      },
    });
    prev = message;
  }
  return items;
}
