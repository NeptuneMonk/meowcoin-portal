import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { displayHandle } from '../avatars';
import { CHANNEL_LICENSE } from '../services/directory';
import { GUEST_HANDLE } from '../services/catalog';
import { useProfiles } from '../services/hooks';
import type { Channel, Community } from '../services/types';
import { shortHash } from '../format';
import { CopyButton } from './CopyButton';
import { Icon } from './Icons';

export function ChannelDetails({
  space,
  channel,
  onClose,
}: {
  space: Community;
  channel: Channel;
  onClose: () => void;
}) {
  const profiles = useProfiles();
  const creator = profiles.find((profile) => profile.handle === channel.creatorHandle);
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const creatorHref = channel.creatorHandle === GUEST_HANDLE ? '/me' : `/u/${channel.creatorHandle}`;

  return (
    <div
      className="scrim"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="channel-object-title">
        <div className="hd">
          <h2 id="channel-object-title">#{channel.name}</h2>
          <p className="lead">{channel.topic}</p>
        </div>
        <div className="bd">
          <div className="facts">
            <div className="r">
              <span>Address</span>
              <b>{shortHash(channel.address, 6, 4)}</b>
            </div>
            <div className="r">
              <span>Parent Space</span>
              <b>
                <Link to={`/c/${space.id}`}>{space.name}</Link>
              </b>
            </div>
            <div className="r">
              <span>License</span>
              <b>{CHANNEL_LICENSE}</b>
            </div>
            <div className="r">
              <span>Creator</span>
              <b>
                <Link to={creatorHref}>@{displayHandle(creator?.handle ?? channel.creatorHandle)}</Link>
              </b>
            </div>
            <div className="r">
              <span>Minted</span>
              <b>Directly on Dogecoin</b>
            </div>
            <div className="r">
              <span>Transferable</span>
              <b>Yes</b>
            </div>
          </div>
          <div className="badge-row">
            <CopyButton label="Channel address" value={channel.address} display={shortHash(channel.address, 8, 4)} />
            <CopyButton label="Parent Space" value={space.address} display={shortHash(space.address, 8, 4)} />
          </div>
          <p className="fine">
            Minted directly on Dogecoin. Messages in this channel are sent to this address. A channel counts when its creator is the Space owner.
          </p>
        </div>
        <div className="ft">
          <button className="btn ghost" type="button" onClick={onClose}>
            Close
          </button>
          <Link className="btn" to={`/c/${space.id}/${channel.id}`} onClick={onClose}>
            Open channel
          </Link>
        </div>
      </div>
    </div>
  );
}

export function ChannelInfoButton({
  channelName,
  onOpen,
}: {
  channelName: string;
  onOpen: () => void;
}) {
  return (
    <button className="info-btn" type="button" aria-label={`Details for #${channelName}`} onClick={onOpen}>
      <Icon name="info" className="i tiny" />
    </button>
  );
}
