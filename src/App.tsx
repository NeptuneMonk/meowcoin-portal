import { HashRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Explore } from './pages/Explore';
import { ItemPage } from './pages/ItemPage';
import { Landing } from './pages/Landing';
import { Market } from './pages/Market';
import { NotFound } from './pages/NotFound';
import { ProfilePage } from './pages/ProfilePage';
import { TryFlow } from './pages/TryFlow';
import { TryHub } from './pages/TryHub';
import { ServicesProvider } from './services/provider';

export function App() {
  return (
    <ServicesProvider>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Landing />} />
            <Route path="explore" element={<Explore />} />
            <Route path="profile/:handle" element={<ProfilePage />} />
            <Route path="market" element={<Market />} />
            <Route path="market/:id" element={<ItemPage />} />
            <Route path="try" element={<TryHub />} />
            <Route path="try/:action" element={<TryFlow />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </HashRouter>
    </ServicesProvider>
  );
}
