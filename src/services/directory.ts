import { demoAddress } from './ids';
import type { Channel, Community, Item, Membership, Profile } from './types';

/** Space object license. A Cthulhu parent used `cthulhu:tether`. */
export const SPACE_LICENSE = 'meowe:space';

/** Channel object license. A Cthulhu topic used `cthulhu:tether:topic`. */
export const CHANNEL_LICENSE = 'meowe:space:channel';

export function profileAddress(handle: string): string {
  return demoAddress(`obj:profile:${handle}`);
}

export function itemAddress(id: string): string {
  return demoAddress(`obj:item:${id}`);
}

export function spaceAddress(id: string): string {
  return demoAddress(`obj:space:${id}`);
}

export function channelAddress(id: string): string {
  return demoAddress(`obj:channel:${id}`);
}

/** A channel counts only when its creator is the Space owner. */
export function listedChannels(space: Community, channels: readonly Channel[]): Channel[] {
  return channels.filter(
    (channel) => channel.communityId === space.id && channel.creatorHandle === space.ownerHandle,
  );
}

/** Giving a Space also gives the channels its owner holds. */
export function channelsCarriedWithSpace(space: Community, channels: readonly Channel[]): Channel[] {
  return channels.filter(
    (channel) => channel.communityId === space.id && channel.ownerHandle === space.ownerHandle,
  );
}

export interface ChannelObjectPreview {
  nme: string;
  dsc: string;
  lic: typeof CHANNEL_LICENSE;
  uri: string;
  cre: string;
  own: string;
}

/** OBJ fields for a channel minted directly on Dogecoin. */
export function channelObjectPreview(input: {
  name: string;
  description: string;
  spaceAddress: string;
  creatorAddress: string;
  ownerAddress: string;
}): ChannelObjectPreview {
  return {
    nme: input.name,
    dsc: input.description,
    lic: CHANNEL_LICENSE,
    uri: input.spaceAddress,
    cre: input.creatorAddress,
    own: input.ownerAddress,
  };
}

export interface ObjectDirectory {
  items: readonly Item[];
  profiles: readonly Profile[];
  spaces: readonly Community[];
  channels: readonly Channel[];
  memberships: readonly Membership[];
}

export type FoundObject =
  | { kind: 'item'; address: string; item: Item }
  | { kind: 'profile'; address: string; profile: Profile }
  | { kind: 'space'; address: string; space: Community; memberCount: number }
  | { kind: 'channel'; address: string; channel: Channel; space: Community };

export function findObject(address: string, data: ObjectDirectory): FoundObject | null {
  const query = address.trim();
  if (!query) return null;
  const item = data.items.find((entry) => entry.address === query);
  if (item) return { kind: 'item', address: query, item };
  const profile = data.profiles.find((entry) => entry.address === query);
  if (profile) return { kind: 'profile', address: query, profile };
  const space = data.spaces.find((entry) => entry.address === query);
  if (space) {
    const memberCount = data.memberships.filter((entry) => entry.communityId === space.id).length;
    return { kind: 'space', address: query, space, memberCount };
  }
  const channel = data.channels.find((entry) => entry.address === query);
  if (channel) {
    const parent = data.spaces.find((entry) => entry.id === channel.communityId);
    if (!parent) return null;
    if (channel.creatorHandle !== parent.ownerHandle) return null;
    return { kind: 'channel', address: query, channel, space: parent };
  }
  return null;
}
