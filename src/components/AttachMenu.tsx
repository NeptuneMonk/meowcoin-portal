import { useEffect, useId, useRef, useState } from 'react';
import { findObject } from '../services/directory';
import { GUEST_HANDLE } from '../services/catalog';
import { useChannels, useCommunities, useItems, useMemberships, useProfiles } from '../services/hooks';
import { Icon } from './Icons';

export function AttachMenu({
  round = false,
  onFile,
  onObject,
}: {
  round?: boolean;
  onFile: (file: File | undefined) => void;
  onObject: (address: string) => void;
}) {
  const [panel, setPanel] = useState<'menu' | 'store' | 'paste' | null>(null);
  const [draft, setDraft] = useState('');
  const [missing, setMissing] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const fieldId = useId();
  const items = useItems();
  const profiles = useProfiles();
  const spaces = useCommunities();
  const channels = useChannels();
  const memberships = useMemberships();
  const held = items.filter((item) => item.ownerHandle === GUEST_HANDLE);

  useEffect(() => {
    if (!panel) return;
    function onPointer(event: PointerEvent) {
      if (!root.current?.contains(event.target as Node)) setPanel(null);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setPanel(null);
    }
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [panel]);

  function close() {
    setPanel(null);
    setMissing(false);
  }

  function lookup() {
    const found = findObject(draft, { items, profiles, spaces, channels, memberships });
    if (!found) {
      setMissing(true);
      return;
    }
    onObject(found.address);
    setDraft('');
    close();
  }

  return (
    <div className="attach" ref={root}>
      <button
        className={round ? 'pl' : 'ico'}
        type="button"
        aria-label="Attach"
        aria-expanded={panel !== null}
        aria-haspopup="menu"
        onClick={() => setPanel((current) => (current ? null : 'menu'))}
      >
        <Icon name={round ? 'plus' : 'add'} />
      </button>
      {panel ? (
        <div className="attach-pop" role="menu">
          {panel === 'menu' ? (
            <>
              <label className="menu-row">
                <Icon name="image" className="i tiny" />
                Upload a file
                <input
                  className="file-input"
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    event.target.value = '';
                    onFile(file);
                    close();
                  }}
                />
              </label>
              <button className="menu-row" type="button" role="menuitem" onClick={() => setPanel('store')}>
                <Icon name="store" className="i tiny" />
                From your store
              </button>
              <button className="menu-row" type="button" role="menuitem" onClick={() => setPanel('paste')}>
                <Icon name="chain" className="i tiny" />
                Paste an object address
              </button>
            </>
          ) : null}
          {panel === 'store' ? (
            <div className="store-pick">
              <button className="menu-row back" type="button" onClick={() => setPanel('menu')}>
                <Icon name="back" className="i tiny" />
                From your store
              </button>
              {held.length === 0 ? (
                <p className="micro pick-empty">You do not hold an object in this demo yet.</p>
              ) : (
                <ul>
                  {held.map((item) => (
                    <li key={item.id}>
                      <button
                        className="menu-row"
                        type="button"
                        onClick={() => {
                          onObject(item.address);
                          close();
                        }}
                      >
                        {item.name}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : null}
          {panel === 'paste' ? (
            <div className="paste-pick">
              <button className="menu-row back" type="button" onClick={() => setPanel('menu')}>
                <Icon name="back" className="i tiny" />
                Paste an object address
              </button>
              <label className="sr-only" htmlFor={fieldId}>
                Object address
              </label>
              <input
                id={fieldId}
                value={draft}
                placeholder="Store item, profile, Space, or channel"
                autoComplete="off"
                spellCheck={false}
                onChange={(event) => {
                  setDraft(event.target.value);
                  setMissing(false);
                }}
                onKeyDown={(event) => {
                  if (event.key !== 'Enter') return;
                  event.preventDefault();
                  event.stopPropagation();
                  lookup();
                }}
              />
              <button
                className="btn sec"
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  lookup();
                }}
              >
                Look up
              </button>
              {missing ? (
                <p className="obj-miss" role="status">
                  That address is not found in demo data.
                </p>
              ) : (
                <p className="micro">Any object: a store item, a profile, a Space, or a channel.</p>
              )}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
