import { Component, useEffect, useRef, type ReactNode } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import mark from '../assets/coin-mark.png';
import { SITE } from '../content/site';
import { shortHash } from '../format';
import { CopyButton } from './CopyButton';

export function Layout() {
  const { pathname } = useLocation();
  const home = pathname === '/';

  return (
    <div className={home ? 'shell shell-home' : 'shell shell-app'}>
      <button
        type="button"
        className="skip"
        onClick={() => document.getElementById('main')?.focus()}
      >
        Skip to content
      </button>
      <div className="chrome">
        <header className="site-header">
          <div className="wrap header-bar">
            <Link className="brand" to="/">
              <img src={mark} width={96} height={96} alt="" />
              <span>
                The Forge
                <small>MEOWE Portal</small>
              </span>
            </Link>
            {home ? (
              <nav className="nav-desktop" aria-label="Primary">
                <Link to="/chats">Chats</Link>
                <Link to="/communities">Communities</Link>
                <Link to="/store">My store</Link>
              </nav>
            ) : null}
          </div>
        </header>
        <p className="demo-banner">DEMO MODE — no real transactions</p>
        {home ? null : <p className="fine-print">Not financial advice. DYOR.</p>}
      </div>
      <ScrollToTop />
      <main id="main" tabIndex={-1}>
        <DemoBoundary>
          <Outlet />
        </DemoBoundary>
      </main>
      {home ? <SiteFooter /> : null}
    </div>
  );
}

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div>
          <p className="footer-brand">The Forge</p>
          <p>{SITE.tagline}</p>
          <p className="micro">
            Meowecoin (MEOWE) on Solana, paired with wrapped DOGE on PumpSwap. This demo does not
            connect a wallet, sign, or send a transaction.
          </p>
        </div>
        <div>
          <p className="kicker">Community</p>
          <ul className="footer-links">
            <li>
              <a href={SITE.website} target="_blank" rel="noopener noreferrer">
                meoweco.in
              </a>
            </li>
            <li>
              <a href={SITE.x} target="_blank" rel="noopener noreferrer">
                X {SITE.xHandle}
              </a>
            </li>
            <li>
              <a href={SITE.telegram} target="_blank" rel="noopener noreferrer">
                Telegram
              </a>
            </li>
          </ul>
        </div>
        <div>
          <p className="kicker">Contract</p>
          <CopyButton label="Solana CA" value={SITE.ca} display={shortHash(SITE.ca, 6, 4)} />
        </div>
      </div>
      <p className="disclaimer">Not financial advice. DYOR.</p>
    </footer>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const main = document.getElementById('main');
    if (main && document.querySelector('.app-frame')) {
      main.focus({ preventScroll: true });
      return;
    }
    window.scrollTo(0, 0);
    main?.focus({ preventScroll: true });
  }, [pathname]);
  return null;
}

class DemoBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError(): { failed: boolean } {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return (
        <p className="wrap alert" role="alert">
          The demo hit a snag. Refresh the page. Nothing was sent anywhere.
        </p>
      );
    }
    return this.props.children;
  }
}
