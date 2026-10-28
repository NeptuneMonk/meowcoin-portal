import { Link } from 'react-router-dom';
import { usePageTitle } from '../usePageTitle';

export function NotFound() {
  usePageTitle('Not found — The Forge');
  return (
    <div className="pad page-narrow">
      <h1>That page is not in the demo</h1>
      <p>The link does not match a screen in the Forge.</p>
      <Link className="btn btn-primary" to="/">
        Enter the Forge
      </Link>
    </div>
  );
}
