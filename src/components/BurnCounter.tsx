import { formatCompact, formatMeowe, formatMillion, formatShare } from '../format';
import { ALREADY_BURNED, burnIllustration, CURRENT_SUPPLY, LAUNCH_SUPPLY } from '../services/pricing';
import { useCountUp } from './useCountUp';

export function BurnCounter() {
  const year = burnIllustration();
  const shown = useCountUp(year.burned);

  return (
    <section className="card burn-card" aria-labelledby="burn-heading">
      <p className="kicker" id="burn-heading">
        Simulated burn
      </p>
      <p className="pill">Illustration · not live</p>
      <p className="burn-num" aria-label={`${formatMeowe(year.burned)} MEOWE`}>
        {formatCompact(shown)}
      </p>
      <p className="burn-unit">MEOWE in a year, if 1,000 messages happened every day</p>
      <p>
        One message in this demo burns <strong>{formatMeowe(year.perPost)} MEOWE</strong>. At 1,000
        messages a day that is {formatMillion(year.burned)} a year, about {formatShare(year.share)} of
        the {formatMillion(CURRENT_SUPPLY)} still out there. About {formatMillion(year.left)} would be
        left.
      </p>
      <p className="micro">
        This counter does not read a chain. Nothing is burned. A message is priced in pennies, so the
        same cent burns fewer tokens if MEOWE is worth more. The burn stays a share of what is left
        and does not run the supply to zero.
      </p>
      <dl className="stat-row">
        <div>
          <dt>At launch</dt>
          <dd>{formatCompact(LAUNCH_SUPPLY)}</dd>
        </div>
        <div>
          <dt>Out now</dt>
          <dd>{formatCompact(CURRENT_SUPPLY)}</dd>
        </div>
        <div>
          <dt>Already burned</dt>
          <dd>{formatCompact(ALREADY_BURNED)}</dd>
        </div>
      </dl>
    </section>
  );
}
