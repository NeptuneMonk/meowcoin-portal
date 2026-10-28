import { Outlet, useLocation, useMatch } from 'react-router-dom';
import { useMedia } from './useMedia';
import { AccentProvider } from './useAccent';
import {
  DmProfile,
  DmSide,
  MemberPanel,
  MobileUserBar,
  Rail,
  SpaceSide,
  UserPanel,
} from './chrome';

export function AppShell() {
  const { pathname } = useLocation();
  const mobile = useMedia('(max-width: 699px)');
  const channel = useMatch('/c/:communityId/:channelId');
  const spaceOnly = useMatch('/c/:communityId');
  const dm = useMatch('/chats/:handle');
  const profile = useMatch('/u/:handle');
  const profileTab = useMatch('/u/:handle/:tab');
  const minting = pathname === '/communities/new';
  const forgeOn = pathname === '/about';
  const routeSpace = channel?.params.communityId ?? spaceOnly?.params.communityId;
  const sideSpace = routeSpace ?? (minting && !mobile ? 'nine-lives' : undefined);
  const messagesOn = !routeSpace && !minting && !forgeOn;
  const onMessages = pathname === '/' || pathname === '/chats' || Boolean(dm);
  const activeDm =
    dm?.params.handle ??
    profile?.params.handle ??
    profileTab?.params.handle ??
    (onMessages ? 'voidnap' : undefined);
  const mode = !mobile ? 'desk' : isFull(pathname) ? 'full' : 'list';

  return (
    <AccentProvider>
      <div className={`desk mode-${mode}`}>
        <Rail messagesOn={messagesOn} spaceId={routeSpace} mintOn={minting} forgeOn={forgeOn} />
        {!mobile && sideSpace ? (
          <SpaceSide
            communityId={sideSpace}
            activeChannelId={channel?.params.channelId ?? (minting ? 'nine-lives-general' : undefined)}
          />
        ) : null}
        {!mobile && !sideSpace ? <DmSide active={activeDm} /> : null}
        <div className="stage">
          <Outlet />
        </div>
        {sideSpace && (channel || minting) ? <MemberPanel communityId={sideSpace} /> : null}
        {!sideSpace && onMessages && activeDm ? <DmProfile handle={activeDm} /> : null}
        <UserPanel />
        <MobileUserBar />
      </div>
    </AccentProvider>
  );
}

function isFull(path: string): boolean {
  if (/^\/chats\/[^/]+$/.test(path)) return true;
  if (/^\/c\/[^/]+\/[^/]+$/.test(path)) return true;
  if (path.startsWith('/u/')) return true;
  if (path.startsWith('/item/')) return true;
  return path === '/me' || path === '/mint' || path === '/about' || path === '/store';
}

export { ScreenHead } from './chrome';
