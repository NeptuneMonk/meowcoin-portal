import { Link } from 'react-router-dom';
import { nameColor } from '../accent';
import { GUEST_HANDLE } from '../services/catalog';
import { useProfiles } from '../services/hooks';
import { CopyButton } from './CopyButton';
import { Avatar } from './Avatar';
import { Icon } from './Icons';
import { ObjectCard } from './ObjectCard';
import { useAccent } from './useAccent';
import { shortHash } from '../format';
import { formatMeowe } from '../format';

export interface StreamRecord {
  burned: number;
  cid: string;
  dogeTxid: string;
  sentTo?: string;
}

export type StreamItem =
  | { type: 'day'; label: string }
  | {
      type: 'msg';
      key: string;
      handle: string;
      text: string;
      time: string;
      cont?: boolean;
      image?: string | null;
      owner?: boolean;
      sharedAddress?: string | null;
      record?: StreamRecord;
    };

export function MessageStream({ items }: { items: StreamItem[] }) {
  const profiles = useProfiles();
  return (
    <>
      {items.map((item) => {
        if (item.type === 'day') {
          return (
            <div className="day" key={`day-${item.label}`}>
              {item.label}
            </div>
          );
        }
        const profile = profiles.find((entry) => entry.handle === item.handle);
        if (item.cont) {
          return (
            <div className="msg cont" key={item.key}>
              <div className="tx">
                {item.text ? <p>{item.text}</p> : null}
                {item.sharedAddress ? <ObjectCard address={item.sharedAddress} /> : null}
                {item.image ? (
                  <img className="msg-pic" src={item.image} alt="Image sent from this device" />
                ) : null}
              </div>
            </div>
          );
        }
        return (
          <MessageRow key={item.key} item={item} name={profile?.name ?? item.handle} profile={profile} />
        );
      })}
    </>
  );
}

function MessageRow({
  item,
  name,
  profile,
}: {
  item: Extract<StreamItem, { type: 'msg' }>;
  name: string;
  profile: ReturnType<typeof useProfiles>[number] | undefined;
}) {
  const accent = useAccent(item.handle);
  const color = nameColor(accent);
  return (
    <div className="msg">
      {profile ? (
        <Link to={item.handle === GUEST_HANDLE ? '/me' : `/u/${item.handle}`} aria-label={name}>
          <Avatar profile={profile} size={40} decorative />
        </Link>
      ) : (
        <span className="av" style={{ width: 40, height: 40 }} />
      )}
      <div className="tx">
        <div className="who">
          <b style={{ color }}>{name}</b>
          {item.owner ? <span className="chip chain">OWNER</span> : null}
          <time>{item.time}</time>
          {item.record ? <RecordChip record={item.record} /> : null}
        </div>
        {item.text ? <p>{item.text}</p> : null}
        {item.sharedAddress ? <ObjectCard address={item.sharedAddress} /> : null}
        {item.image ? (
          <>
            <img className="msg-pic" src={item.image} alt="Image sent from this device" />
            <p className="micro">Your image stays on your device in demo mode.</p>
          </>
        ) : null}
      </div>
    </div>
  );
}

function RecordChip({ record }: { record: StreamRecord }) {
  return (
    <details className="rec">
      <summary aria-label="Kept on Doge">
        <Icon name="chain" />
      </summary>
      <p className="micro">Simulated record. Burned {formatMeowe(record.burned)} MEOWE.</p>
      {record.sentTo ? (
        <CopyButton label="Sent to channel" value={record.sentTo} display={shortHash(record.sentTo, 8, 4)} />
      ) : null}
      <CopyButton label="IPFS CID" value={record.cid} display={shortHash(record.cid, 10, 6)} />
      <CopyButton label="Dogecoin record" value={record.dogeTxid} display={shortHash(record.dogeTxid, 8, 4)} />
    </details>
  );
}
