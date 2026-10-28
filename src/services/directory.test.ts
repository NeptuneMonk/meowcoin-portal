import { describe, expect, it } from 'vitest';
import { buildCatalog } from './catalog';
import {
  CHANNEL_LICENSE,
  SPACE_LICENSE,
  channelObjectPreview,
  channelsCarriedWithSpace,
  findObject,
  listedChannels,
  profileAddress,
} from './directory';

describe('on-chain spaces and channels', () => {
  const catalog = buildCatalog();
  const nine = catalog.communities.find((space) => space.id === 'nine-lives');

  it('gives every object a unique address', () => {
    const addresses = [
      ...catalog.profiles.map((profile) => profile.address),
      ...catalog.items.map((item) => item.address),
      ...catalog.communities.map((space) => space.address),
      ...catalog.channels.map((channel) => channel.address),
    ];
    expect(new Set(addresses).size).toBe(addresses.length);
    expect(addresses.every((address) => address.length >= 32)).toBe(true);
  });

  it('counts a channel only when its creator is the Space owner', () => {
    expect(nine).toBeTruthy();
    const listed = listedChannels(nine!, catalog.channels);
    expect(listed.map((channel) => channel.name).sort()).toEqual(['general', 'lore']);
    const aside = catalog.channels.find((channel) => channel.id === 'nine-lives-aside');
    expect(aside?.creatorHandle).toBe('goldnip');
    expect(aside?.creatorHandle).not.toBe(nine!.ownerHandle);
    expect(listed.some((channel) => channel.id === 'nine-lives-aside')).toBe(false);
  });

  it('previews a channel object whose uri is the parent Space', () => {
    const channel = catalog.channels.find((entry) => entry.id === 'nine-lives-general');
    const owner = catalog.profiles.find((profile) => profile.handle === nine!.ownerHandle);
    expect(channel).toBeTruthy();
    expect(owner).toBeTruthy();
    const preview = channelObjectPreview({
      name: channel!.name,
      description: channel!.topic,
      spaceAddress: nine!.address,
      creatorAddress: owner!.address,
      ownerAddress: owner!.address,
    });
    expect(preview).toEqual({
      nme: 'general',
      dsc: 'The front room.',
      lic: CHANNEL_LICENSE,
      uri: nine!.address,
      cre: profileAddress('ninelives'),
      own: profileAddress('ninelives'),
    });
    expect(SPACE_LICENSE).toBe('meowe:space');
    expect(preview.lic).toBe('meowe:space:channel');
    expect(preview.uri).toBe(nine!.address);
  });

  it('carries the channels the Space owner holds', () => {
    const carried = channelsCarriedWithSpace(nine!, catalog.channels);
    expect(carried.every((channel) => channel.ownerHandle === nine!.ownerHandle)).toBe(true);
    expect(carried.some((channel) => channel.id === 'nine-lives-aside')).toBe(false);
    expect(carried.map((channel) => channel.id).sort()).toEqual(['nine-lives-general', 'nine-lives-lore']);
  });

  it('resolves a store item, profile, Space, channel, and an unknown address', () => {
    const data = {
      items: catalog.items,
      profiles: catalog.profiles,
      spaces: catalog.communities,
      channels: catalog.channels,
      memberships: catalog.memberships,
    };
    const medallion = catalog.items.find((item) => item.id === 'medallion');
    const guest = catalog.profiles.find((profile) => profile.handle === 'you');
    const lore = catalog.channels.find((channel) => channel.id === 'nine-lives-lore');
    expect(findObject(medallion!.address, data)?.kind).toBe('item');
    expect(findObject(guest!.address, data)?.kind).toBe('profile');
    const space = findObject(nine!.address, data);
    expect(space?.kind).toBe('space');
    if (space?.kind === 'space') expect(space.memberCount).toBeGreaterThan(0);
    expect(findObject(lore!.address, data)?.kind).toBe('channel');
    const aside = catalog.channels.find((channel) => channel.id === 'nine-lives-aside');
    expect(findObject(aside!.address, data)).toBeNull();
    expect(findObject('not-in-the-demo', data)).toBeNull();
    expect(findObject('   ', data)).toBeNull();
  });

  it('sends sample messages to the channel address and shares a couple of objects', () => {
    const shared = catalog.messages.filter((message) => message.sharedAddress);
    expect(shared.length).toBeGreaterThanOrEqual(2);
    for (const message of catalog.messages) {
      const channel = catalog.channels.find((entry) => entry.id === message.channelId);
      expect(message.sentTo).toBe(channel?.address);
    }
  });
});
