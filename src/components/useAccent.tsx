import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { NEUTRAL, dominant, paletteFrom, type Palette } from '../accent';
import { avatarUrl } from '../avatars';
import { useProfiles } from '../services/hooks';
import type { Profile } from '../services/types';

const AccentContext = createContext<Readonly<Record<string, Palette>>>({});

export function faceSrc(profile: Profile): string {
  return profile.localImageUrl ?? avatarUrl(profile.handle);
}

export function AccentProvider({ children }: { children: ReactNode }) {
  const profiles = useProfiles();
  const [map, setMap] = useState<Readonly<Record<string, Palette>>>({});
  const key = useMemo(
    () => profiles.map((profile) => `${profile.handle}:${faceSrc(profile)}`).join('|'),
    [profiles],
  );

  useEffect(() => {
    let cancel = false;
    const current = profiles;
    void (async () => {
      const next: Record<string, Palette> = {};
      await Promise.all(
        current.map(async (profile) => {
          const src = faceSrc(profile);
          const color = await dominant(src);
          next[profile.handle] = color ? paletteFrom(color) : NEUTRAL;
        }),
      );
      if (cancel) return;
      setMap(next);
      document.body.dataset.accents = '1';
    })();
    return () => {
      cancel = true;
    };
    // key captures the avatar sources. profiles is read from that render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return <AccentContext.Provider value={map}>{children}</AccentContext.Provider>;
}

export function useAccent(handle: string | undefined): Palette {
  const map = useContext(AccentContext);
  if (!handle) return NEUTRAL;
  return map[handle] ?? NEUTRAL;
}
