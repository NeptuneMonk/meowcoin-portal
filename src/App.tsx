import { HashRouter, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/AppShell';
import { Layout } from './components/Layout';
import { ChatPage } from './pages/ChatPage';
import { CommunitiesPage } from './pages/CommunitiesPage';
import { CommunityPage } from './pages/CommunityPage';
import { ChatsPage } from './pages/ChatsPage';
import { CreateCommunity } from './pages/CreateCommunity';
import { FriendsPage } from './pages/FriendsPage';
import { ItemPage } from './pages/ItemPage';
import { Landing } from './pages/Landing';
import { MarketPage } from './pages/MarketPage';
import { MePage } from './pages/MePage';
import { MintPage } from './pages/MintPage';
import { NotFound } from './pages/NotFound';
import { ProfilePage } from './pages/ProfilePage';
import { StorePage } from './pages/StorePage';
import { ServicesProvider } from './services/provider';

export function App() {
  return (
    <ServicesProvider>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route element={<AppShell />}>
              <Route index element={<ChatsPage />} />
              <Route path="chats" element={<ChatsPage />} />
              <Route path="chats/:handle" element={<ChatsPage />} />
              <Route path="about" element={<Landing />} />
              <Route path="friends" element={<FriendsPage />} />
              <Route path="market" element={<MarketPage />} />
              <Route path="communities" element={<CommunitiesPage />} />
              <Route path="communities/new" element={<CreateCommunity />} />
              <Route path="c/:communityId" element={<CommunityPage />} />
              <Route path="c/:communityId/:channelId" element={<ChatPage />} />
              <Route path="store" element={<StorePage />} />
              <Route path="me" element={<MePage />} />
              <Route path="u/:handle/:tab" element={<ProfilePage />} />
              <Route path="u/:handle" element={<ProfilePage />} />
              <Route path="item/:id" element={<ItemPage />} />
              <Route path="mint" element={<MintPage />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Route>
        </Routes>
      </HashRouter>
    </ServicesProvider>
  );
}
