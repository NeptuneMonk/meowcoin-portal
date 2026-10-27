import { ChatList, ScreenHead } from '../components/AppShell';
import { usePageTitle } from '../usePageTitle';

export function ChatsPage() {
  usePageTitle('Chats — The Forge');
  return (
    <>
      <div className="mobile-only fill">
        <ScreenHead title="Chats" />
        <ChatList />
      </div>
      <div className="desktop-only empty-main">
        <h1>Chats</h1>
        <p>Pick a conversation on the left.</p>
        <p className="micro">
          A message costs about one cent. 374 MEOWE is burned. Tap the burn on a message to see the
          content id and the Dogecoin record.
        </p>
      </div>
    </>
  );
}
