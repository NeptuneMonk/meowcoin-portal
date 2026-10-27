import { useEffect, useRef, useState, type ReactNode } from 'react';
import { SpinningCoin } from './SpinningCoin';
import { prefersReducedMotion } from './useCountUp';
import { useServices } from '../services/provider';
import type { ForgeReceipt, ForgeRequest } from '../services/types';

const PHASES = [
  'Pinning the file on IPFS',
  'Splitting the fee',
  'Burning MEOWE',
  'Writing the Dogecoin record',
] as const;

export type ForgeStep = 'edit' | 'quote' | 'forging' | 'done';

export function useSimulatedSubmit() {
  const services = useServices();
  const [step, setStep] = useState<ForgeStep>('edit');
  const [phase, setPhase] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<ForgeReceipt | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  async function submit(request: ForgeRequest) {
    setError(null);
    setStep('forging');
    setPhase(0);
    try {
      const animated = playAnimation(setPhase, () => mounted.current);
      const next = await services.relayer.submit(request);
      await animated;
      if (!mounted.current) return;
      setReceipt(next);
      setStep('done');
    } catch {
      if (!mounted.current) return;
      setStep('quote');
      setError('The demo could not finish that. Nothing was sent. Try again.');
    }
  }

  return { step, setStep, phase, error, receipt, submit };
}

export function Forging({ phase }: { phase: number }) {
  return (
    <ol className="phases" aria-live="polite">
      {PHASES.map((label, index) => (
        <li key={label} className={index <= phase ? 'on' : ''}>
          {label}
        </li>
      ))}
    </ol>
  );
}

export function ComingSoon({ children }: { children?: ReactNode }) {
  return (
    <section className="card coming">
      <p className="kicker">Record written to Dogecoin (simulated)</p>
      <SpinningCoin />
      <h2>This is a demo — coming soon.</h2>
      <p>Nothing was signed or sent. The real Forge will use these same screens.</p>
      {children}
    </section>
  );
}

function playAnimation(setPhase: (phase: number) => void, alive: () => boolean): Promise<void> {
  if (prefersReducedMotion()) {
    if (alive()) setPhase(PHASES.length - 1);
    return Promise.resolve();
  }
  return (async () => {
    for (let phase = 0; phase < PHASES.length; phase += 1) {
      if (!alive()) return;
      setPhase(phase);
      await new Promise((resolve) => window.setTimeout(resolve, 420));
    }
  })();
}
