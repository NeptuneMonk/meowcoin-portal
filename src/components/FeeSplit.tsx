import { formatMeowe } from '../format';
import type { FeeQuote } from '../services/types';

const ROWS = [
  {
    key: 'burn',
    pct: '30%',
    name: 'Burned forever',
    detail: 'Gone from supply',
    className: 'seg-burn',
  },
  {
    key: 'doge',
    pct: '60%',
    name: 'Swapped to DOGE',
    detail: 'Writes the Dogecoin record',
    className: 'seg-doge',
  },
  {
    key: 'nodes',
    pct: '10%',
    name: 'Community nodes',
    detail: 'Pin files and index the chain',
    className: 'seg-nodes',
  },
] as const;

export function FeeSplit({ quote, heading }: { quote: FeeQuote; heading: string }) {
  const amounts = {
    burn: quote.split.burn,
    doge: quote.split.doge,
    nodes: quote.split.nodes,
  };

  return (
    <figure className="split card">
      <figcaption>
        <span className="kicker">Fee split</span>
        <strong>{heading}</strong>
      </figcaption>
      <div
        className="split-bar"
        role="img"
        aria-label="30% burned forever, 60% swapped to DOGE, 10% to community nodes"
      >
        <span className="seg-burn" />
        <span className="seg-doge" />
        <span className="seg-nodes" />
      </div>
      <ul>
        {ROWS.map((row) => (
          <li key={row.key}>
            <span className={`swatch ${row.className}`} aria-hidden="true" />
            <span>
              <strong>
                {row.pct} {row.name}
              </strong>
              <small>{row.detail}</small>
            </span>
            <b>{formatMeowe(amounts[row.key])} MEOWE</b>
          </li>
        ))}
      </ul>
    </figure>
  );
}
