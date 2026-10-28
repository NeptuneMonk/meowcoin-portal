import { Link, useParams } from 'react-router-dom';
import { nameColor } from '../accent';
import { displayHandle } from '../avatars';
import { Avatar } from '../components/Avatar';
import { Icon } from '../components/Icons';
import { MessageStream, type StreamItem } from '../components/MessageStream';
import { useAccent } from '../components/useAccent';
import { useMedia } from '../components/useMedia';
import { PRIVATE_DMS } from '../content/site';
import { isDay, sampleThread, SAMPLE_THREADS, type SampleEntry } from '../content/samples';
import { useProfiles } from '../services/hooks';
import { usePageTitle } from '../usePageTitle';
import { NotFound } from './NotFound';

export function ChatsPage() {
  const { handle } = useParams();
  const mobile = useMedia('(max-width: 699px)');
  usePageTitle('Messages — The Forge');
  if (mobile && !handle) return <MobileMessages />;
  const who = handle ?? 'voidnap';
  if (!sampleThread(who)) return <NotFound />;
  return <DmThread handle={who} />;
}

function MobileMessages() {
  const profiles = useProfiles();
  const active = SAMPLE_THREADS.slice(0, 3);
  return (
    <section className="mpanel">
      <h1>Messages</h1>
      <div className="mtools">
        <span className="b" aria-hidden="true">
          <Icon name="search" />
        </span>
        <Link className="b" to="/friends">
          <Icon name="friends" /> Friends
        </Link>
        <Link className="b" to="/store">
          <Icon name="cube" /> Objects
        </Link>
        <Link className="b p" to="/communities/new" aria-label="Mint a Space">
          <Icon name="plus" />
        </Link>
      </div>
      <div className="active-row">
        {active.map((thread) => {
          const profile = profiles.find((entry) => entry.handle === thread.handle);
          if (!profile) return null;
          return (
            <Link className="c" key={thread.handle} to={`/chats/${thread.handle}`}>
              <Avatar profile={profile} size={56} status />
              <span>{profile.name}</span>
            </Link>
          );
        })}
      </div>
      {SAMPLE_THREADS.map((thread, index) => {
        const profile = profiles.find((entry) => entry.handle === thread.handle);
        if (!profile) return null;
        return <MobileRow key={thread.handle} handle={thread.handle} preview={thread.preview} when={thread.when} on={index === 0} colored={index < 3} />;
      })}
    </section>
  );
}

function MobileRow({
  handle,
  preview,
  when,
  on,
  colored,
}: {
  handle: string;
  preview: string;
  when: string;
  on: boolean;
  colored: boolean;
}) {
  const profiles = useProfiles();
  const profile = profiles.find((entry) => entry.handle === handle);
  const accent = useAccent(handle);
  if (!profile) return null;
  return (
    <Link className={`mdm${on ? ' on' : ''}`} to={`/chats/${handle}`}>
      <Avatar profile={profile} size={44} status />
      <span className="tx">
        <span className="nm">
          <span style={{ color: colored ? nameColor(accent) : undefined }}>{profile.name}</span>
          <time>{when}</time>
        </span>
        <span className="sub">{preview}</span>
      </span>
    </Link>
  );
}

function DmThread({ handle }: { handle: string }) {
  const thread = sampleThread(handle);
  const profiles = useProfiles();
  const profile = profiles.find((entry) => entry.handle === handle);
  if (!thread || !profile) return <NotFound />;
  const rows = entriesToRows(thread.entries);
  return (
    <div className="thread-screen">
      <div className="main-h only-desk">
        <Avatar profile={profile} size={24} />
        <span className="t">{profile.name}</span>
        <div className="tools">
          <span className="tool" aria-hidden="true">
            <Icon name="pin" />
          </span>
          <span className="tool" aria-hidden="true">
            <Icon name="people" />
          </span>
          <div className="search">Search</div>
        </div>
      </div>
      <div className="mhead only-mob">
        <Link to="/chats" aria-label="Back">
          <Icon name="back" />
        </Link>
        <Avatar profile={profile} size={32} />
        <div>
          <div className="t">{profile.name}</div>
          <div className="s">Sample · not sent</div>
        </div>
      </div>
      <div className="msgs">
        <div className="msgs-inner">
          <div className="welcome">
            <Avatar profile={profile} size={80} />
            <h2>{profile.name}</h2>
            <p>
              This is the beginning of your direct message history with <b>@{displayHandle(handle)}</b>.
            </p>
            <p className="micro">{PRIVATE_DMS}</p>
          </div>
          <MessageStream items={rows} />
        </div>
      </div>
      <div className="composer only-desk" aria-hidden="true">
        <span className="ico">
          <Icon name="add" />
        </span>
        <span className="ph">Message @{displayHandle(handle)}</span>
        <span className="cost">
          <Icon name="chain" /> kept on Doge
        </span>
        <span className="ico">
          <Icon name="gift" />
        </span>
        <span className="ico">
          <Icon name="smile" />
        </span>
      </div>
      <div className="mcomp only-mob">
        <span className="pl">
          <Icon name="plus" />
        </span>
        <span className="f">
          Message @{displayHandle(handle)} <Icon name="smile" />
        </span>
      </div>
    </div>
  );
}

function entriesToRows(entries: SampleEntry[]): StreamItem[] {
  return entries.map((entry, index) => {
    if (isDay(entry)) return { type: 'day' as const, label: entry.day };
    return {
      type: 'msg' as const,
      key: `${entry.handle}-${index}`,
      handle: entry.handle,
      text: entry.text,
      time: entry.time,
      cont: entry.cont,
    };
  });
}
