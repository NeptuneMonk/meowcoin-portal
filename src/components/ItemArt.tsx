import type { ItemArtId } from '../services/types';

export const ITEM_ARTS: { id: ItemArtId; label: string }[] = [
  { id: 'medallion', label: 'Medallion' },
  { id: 'plate', label: 'Plate' },
  { id: 'hammer', label: 'Hammer' },
  { id: 'stamp', label: 'Stamp' },
  { id: 'scroll', label: 'Scroll' },
  { id: 'crown', label: 'Crown' },
];

const LABELS: Record<ItemArtId, string> = {
  medallion: 'Gold medallion marked with a 9',
  plate: 'Round plate with a cat face',
  hammer: 'Gold forge hammer',
  stamp: 'Round burn stamp',
  scroll: 'Rolled scroll',
  crown: 'Nine-point crown',
};

export function ItemArt({ id, decorative = false }: { id: ItemArtId; decorative?: boolean }) {
  const a11y = decorative
    ? ({ 'aria-hidden': true } as const)
    : ({ role: 'img', 'aria-label': LABELS[id] } as const);

  return (
    <svg className="item-art" viewBox="0 0 200 200" {...a11y}>
      <rect width="200" height="200" rx="28" fill="#16130b" />
      <rect x="10" y="10" width="180" height="180" rx="22" fill="none" stroke="#d4b235" strokeOpacity="0.45" />
      {id === 'medallion' ? <Medallion /> : null}
      {id === 'plate' ? <Plate /> : null}
      {id === 'hammer' ? <Hammer /> : null}
      {id === 'stamp' ? <Stamp /> : null}
      {id === 'scroll' ? <Scroll /> : null}
      {id === 'crown' ? <Crown /> : null}
    </svg>
  );
}

function Medallion() {
  return (
    <g>
      <circle cx="100" cy="100" r="62" fill="#3a2f0e" stroke="#f0d36a" strokeWidth="6" />
      <circle cx="100" cy="100" r="46" fill="none" stroke="#d4b235" strokeWidth="2" />
      <text
        x="100"
        y="114"
        textAnchor="middle"
        fill="#f0d36a"
        fontSize="48"
        fontWeight="800"
        fontFamily="ui-rounded, system-ui, sans-serif"
      >
        9
      </text>
    </g>
  );
}

function Plate() {
  return (
    <g>
      <circle cx="100" cy="100" r="64" fill="#2a2416" stroke="#e2c25a" strokeWidth="8" />
      <circle cx="100" cy="108" r="36" fill="#e2c25a" />
      <path d="M78 100 L86 72 L100 96 Z" fill="#c8922a" />
      <path d="M122 100 L114 72 L100 96 Z" fill="#c8922a" />
      <circle cx="88" cy="108" r="4" fill="#1a1406" />
      <circle cx="112" cy="108" r="4" fill="#1a1406" />
      <path d="M100 116 L96 122 H104 Z" fill="#e77fa8" />
    </g>
  );
}

function Hammer() {
  return (
    <g>
      <rect x="92" y="78" width="16" height="78" rx="6" fill="#cbbd9a" />
      <rect x="46" y="48" width="108" height="36" rx="8" fill="#f0d36a" stroke="#8a6a12" strokeWidth="3" />
      <path d="M46 66 H154" stroke="#a8861c" strokeWidth="2" />
    </g>
  );
}

function Stamp() {
  return (
    <g fontFamily="ui-rounded, system-ui, sans-serif">
      <circle cx="100" cy="100" r="58" fill="none" stroke="#e2483a" strokeWidth="6" strokeDasharray="8 6" />
      <circle cx="100" cy="100" r="46" fill="none" stroke="#e2483a" strokeWidth="2" />
      <text x="100" y="96" textAnchor="middle" fill="#e2483a" fontSize="22" fontWeight="800">
        BURN
      </text>
      <text x="100" y="122" textAnchor="middle" fill="#f4ecd6" fontSize="16" fontWeight="700">
        30%
      </text>
    </g>
  );
}

function Scroll() {
  return (
    <g>
      <rect x="48" y="40" width="104" height="120" rx="8" fill="#f4ecd6" />
      <rect x="40" y="40" width="18" height="120" rx="8" fill="#e2c25a" />
      <rect x="142" y="40" width="18" height="120" rx="8" fill="#e2c25a" />
      <path d="M70 72 H130 M70 92 H130 M70 112 H114" stroke="#a8861c" strokeWidth="3" strokeLinecap="round" />
    </g>
  );
}

function Crown() {
  return (
    <path
      d="M36 132 L28 68 L62 100 L100 44 L138 100 L172 68 L164 132 Z"
      fill="#f0d36a"
      stroke="#8a6a12"
      strokeWidth="4"
      strokeLinejoin="round"
    />
  );
}
