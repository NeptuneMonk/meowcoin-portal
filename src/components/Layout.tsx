import { Component, useEffect, useRef, type ReactNode } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import mark from '../assets/coin-mark.png';
import { SITE } from '../content/site';
import { shortHash } from '../format';
import { CopyButton } from './CopyButton';

const LINKS = [
  { to: '/', label: 'Home', end: true, icon: <IconHome /> },
  { to: '/explore', label: 'Explore', end: false, icon: <IconFeed /> },
  { to: '/market', label: 'Market', end: false, icon: <IconGem /> },
  { to: '/try', label: 'Try', end: false, icon: <IconSpark /> },
] as const;

export function Layout() {
  return (
    <div className="shell">
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
            <nav className="nav-desktop" aria-label="Primary">
              {LINKS.map((link) => (
                <NavLink key={link.to} to={link.to} end={link.end}>
                  {link.label === 'Home' ? 'Enter' : link.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </header>
        <p className="demo-banner">DEMO MODE — no real transactions</p>
      </div>
      <ScrollToTop />
      <main id="main" tabIndex={-1}>
        <DemoBoundary>
          <Outlet />
        </DemoBoundary>
      </main>
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
      <nav className="tabbar" aria-label="Primary">
        {LINKS.map((link) => (
          <NavLink key={link.to} to={link.to} end={link.end} className="tab">
            {link.icon}
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
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
    window.scrollTo(0, 0);
    document.getElementById('main')?.focus({ preventScroll: true });
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

function IconHome() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 11.2 12 4l8 7.2V20h-5.2v-6.2H9.2V20H4Z" fill="currentColor" />
    </svg>
  );
}

function IconFeed() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="5" width="16" height="3.2" rx="1.4" fill="currentColor" />
      <rect x="4" y="10.4" width="16" height="3.2" rx="1.4" fill="currentColor" />
      <rect x="4" y="15.8" width="10" height="3.2" rx="1.4" fill="currentColor" />
    </svg>
  );
}

function IconGem() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 4h10l4 6-9 10L3 10l4-6Z" fill="currentColor" />
    </svg>
  );
}

function IconSpark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2.5 14.2 9H21l-5.4 4.1 2 6.4L12 15.8 6.4 19.5l2-6.4L3 9h6.8L12 2.5Z" fill="currentColor" />
    </svg>
  );
}
