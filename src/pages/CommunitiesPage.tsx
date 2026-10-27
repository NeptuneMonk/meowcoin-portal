import { Link } from 'react-router-dom';
import { CommunityDirectory, ScreenHead } from '../components/AppShell';
import { usePageTitle } from '../usePageTitle';

export function CommunitiesPage() {
  usePageTitle('Communities — The Forge');
  return (
    <div className="fill pad">
      <ScreenHead title="Communities" />
      <p className="micro">Communities you’re in. Each one has text channels and an owner’s shelf.</p>
      <div className="btn-row">
        <Link className="btn btn-primary" to="/communities/new">
          Create community
        </Link>
      </div>
      <CommunityDirectory />
    </div>
  );
}
