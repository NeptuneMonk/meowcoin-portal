import { useCallback, useSyncExternalStore } from 'react';
import { useServices } from './provider';
import type { Item, Post, Profile } from './types';

export function usePosts(): readonly Post[] {
  const { indexer } = useServices();
  const subscribe = useCallback((cb: () => void) => indexer.subscribe(cb), [indexer]);
  const getSnapshot = useCallback(() => indexer.getPostsSnapshot(), [indexer]);
  return useSyncExternalStore(subscribe, getSnapshot);
}

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

export function useProfile(handle: string | undefined): Profile | undefined {
  const profiles = useProfiles();
  if (!handle) return undefined;
  return profiles.find((profile) => profile.handle === handle);
}

export function useItem(id: string | undefined): Item | undefined {
  const items = useItems();
  if (!id) return undefined;
  return items.find((item) => item.id === id);
}
