import { Component, useEffect, useRef, type ReactNode } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

export function Layout() {
  return (
    <div className="shell">
      <button type="button" className="skip" onClick={() => document.getElementById('main')?.focus()}>
        Skip to content
      </button>
      <ScrollToTop />
      <main id="main" tabIndex={-1}>
        <DemoBoundary>
          <Outlet />
        </DemoBoundary>
      </main>
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
    const main = document.getElementById('main');
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
        <p className="pad alert" role="alert">
          The demo hit a snag. Refresh the page. Nothing was sent anywhere.
        </p>
      );
    }
    return this.props.children;
  }
}
