import { useCallback, useMemo, useSyncExternalStore } from 'react';
import { GUEST_HANDLE } from './catalog';
import { useServices } from './provider';
import type { Channel, ChatMessage, Community, Item, Profile } from './types';

export function useProfiles(): readonly Profile[] {
  const { indexer } = useServices();
  const subscribe = useCallback((cb: () => void) => indexer.subscribe(cb), [indexer]);
  const getSnapshot = useCallback(() => indexer.getProfilesSnapshot(), [indexer]);
  return useSyncExternalStore(subscribe, getSnapshot);
}

export function useItems(): readonly Item[] {
  const { indexer } = useServices();
  const subscribe = useCallback((cb: () => void) => indexer.subscribe(cb), [indexer]);
  const getSnapshot = useCallback(() => indexer.getItemsSnapshot(), [indexer]);
  return useSyncExternalStore(subscribe, getSnapshot);
}

export function useCommunities(): readonly Community[] {
  const { communities } = useServices();
  const subscribe = useCallback((cb: () => void) => communities.subscribe(cb), [communities]);
  const getSnapshot = useCallback(() => communities.getCommunitiesSnapshot(), [communities]);
  return useSyncExternalStore(subscribe, getSnapshot);
}

export function useChannels(): readonly Channel[] {
  const { communities } = useServices();
  const subscribe = useCallback((cb: () => void) => communities.subscribe(cb), [communities]);
  const getSnapshot = useCallback(() => communities.getChannelsSnapshot(), [communities]);
  return useSyncExternalStore(subscribe, getSnapshot);
}

export function useMemberships() {
  const { communities } = useServices();
  const subscribe = useCallback((cb: () => void) => communities.subscribe(cb), [communities]);
  const getSnapshot = useCallback(() => communities.getMembershipsSnapshot(), [communities]);
  return useSyncExternalStore(subscribe, getSnapshot);
}

export function useAllMessages(): readonly ChatMessage[] {
  const { chat } = useServices();
  const subscribe = useCallback((cb: () => void) => chat.subscribe(cb), [chat]);
  const getSnapshot = useCallback(() => chat.getMessagesSnapshot(), [chat]);
  return useSyncExternalStore(subscribe, getSnapshot);
}

export function useProfile(handle: string | undefined): Profile | undefined {
  const profiles = useProfiles();
  if (!handle) return undefined;
  return profiles.find((profile) => profile.handle === handle);
}

export function useGuest(): Profile | undefined {
  return useProfile(GUEST_HANDLE);
}

export function useItem(id: string | undefined): Item | undefined {
  const items = useItems();
  if (!id) return undefined;
  return items.find((item) => item.id === id);
}

export function useJoinedCommunities(): readonly Community[] {
  const communities = useCommunities();
  const memberships = useMemberships();
  return useMemo(
    () =>
      communities.filter((community) =>
        memberships.some(
          (membership) =>
            membership.communityId === community.id && membership.handle === GUEST_HANDLE,
        ),
      ),
    [communities, memberships],
  );
}

export function useOwnedCommunities(handle: string | undefined): readonly Community[] {
  const communities = useCommunities();
  return useMemo(
    () => (handle ? communities.filter((community) => community.ownerHandle === handle) : []),
    [communities, handle],
  );
}

export function useShelf(handle: string | undefined): readonly Item[] {
  const items = useItems();
  return useMemo(
    () =>
      handle
        ? items.filter((item) => item.creatorHandle === handle || item.ownerHandle === handle)
        : [],
    [items, handle],
  );
}

export interface RecentChat {
  channel: Channel;
  community: Community;
  last: ChatMessage | null;
}

export function useRecentChats(): readonly RecentChat[] {
  const channels = useChannels();
  const communities = useCommunities();
  const messages = useAllMessages();
  const memberships = useMemberships();
  return useMemo(() => {
    const joined = new Set(
      memberships
        .filter((membership) => membership.handle === GUEST_HANDLE)
        .map((membership) => membership.communityId),
    );
    const rows: { row: RecentChat; order: number }[] = [];
    for (const channel of channels) {
      if (!joined.has(channel.communityId)) continue;
      const community = communities.find((entry) => entry.id === channel.communityId);
      if (!community) continue;
      const last = [...messages].reverse().find((entry) => entry.channelId === channel.id) ?? null;
      const order = last ? messages.lastIndexOf(last) : -1;
      rows.push({ row: { channel, community, last }, order });
    }
    rows.sort((a, b) => b.order - a.order);
    return rows.map((entry) => entry.row);
  }, [channels, communities, messages, memberships]);
}
