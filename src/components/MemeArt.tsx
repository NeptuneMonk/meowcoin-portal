import { formatMeowe } from '../format';
import { POST_QUOTE } from '../services/pricing';
import type { MemeId } from '../services/types';

export const MEMES: { id: MemeId; label: string }[] = [
  { id: 'forever', label: 'Forever' },
  { id: 'ninelives', label: 'Nine lives' },
  { id: 'beside', label: 'Beside Doge' },
  { id: 'penny', label: 'One penny' },
];

const LABELS: Record<MemeId, string> = {
  forever: 'Meme card reading forever on Doge',
  ninelives: 'Meme card with nine lives and the second life marked',
  beside: 'Meme card of a cat beside a dog',
  penny: `Meme card showing one cent burns ${formatMeowe(POST_QUOTE.split.burn)} MEOWE`,
};

export function MemeArt({ id, decorative = false }: { id: MemeId; decorative?: boolean }) {
  const a11y = decorative
    ? ({ 'aria-hidden': true } as const)
    : ({ role: 'img', 'aria-label': LABELS[id] } as const);

  return (
    <svg className="meme" viewBox="0 0 320 180" {...a11y}>
      <rect width="320" height="180" rx="18" fill="#16130b" />
      <rect x="8" y="8" width="304" height="164" rx="14" fill="none" stroke="#d4b235" strokeOpacity="0.55" />
      {id === 'forever' ? <Forever /> : null}
      {id === 'ninelives' ? <NineLives /> : null}
      {id === 'beside' ? <Beside /> : null}
      {id === 'penny' ? <Penny /> : null}
    </svg>
  );
}

function Forever() {
  return (
    <g fontFamily="ui-rounded, system-ui, sans-serif">
      <text x="24" y="78" fill="#f4ecd6" fontSize="42" fontWeight="800">
        FOREVER
      </text>
      <text x="24" y="118" fill="#f0d36a" fontSize="28" fontWeight="800">
        ON DOGE
      </text>
      <circle cx="262" cy="90" r="28" fill="#e2c25a" />
      <path d="M248 86 L254 68 L262 84 Z" fill="#c8922a" />
      <path d="M276 86 L270 68 L262 84 Z" fill="#c8922a" />
      <circle cx="254" cy="92" r="3" fill="#1a1406" />
      <circle cx="270" cy="92" r="3" fill="#1a1406" />
    </g>
  );
}

function NineLives() {
  const dots = Array.from({ length: 9 }, (_, index) => {
    const col = index % 3;
    const row = Math.floor(index / 3);
    const active = index === 1;
    return (
      <circle
        key={index}
        cx={214 + col * 28}
        cy={58 + row * 28}
        r="9"
        fill={active ? '#f0d36a' : 'none'}
        stroke="#f0d36a"
        strokeWidth="2"
      />
    );
  });
  return (
    <g fontFamily="ui-rounded, system-ui, sans-serif">
      <text x="22" y="78" fill="#f4ecd6" fontSize="28" fontWeight="800">
        NINE
      </text>
      <text x="22" y="114" fill="#f0d36a" fontSize="28" fontWeight="800">
        LIVES
      </text>
      <text x="22" y="146" fill="#cbbd9a" fontSize="14" fontWeight="700">
        LIFE 2 IS LIT
      </text>
      {dots}
    </g>
  );
}

function Beside() {
  return (
    <g fontFamily="ui-rounded, system-ui, sans-serif">
      <CatMark x={78} />
      <text x="150" y="96" fill="#f0d36a" fontSize="28" fontWeight="800" textAnchor="middle">
        ×
      </text>
      <DogMark x={242} />
      <text x="78" y="150" fill="#f4ecd6" fontSize="16" fontWeight="800" textAnchor="middle">
        MEOWE
      </text>
      <text x="242" y="150" fill="#f0d36a" fontSize="16" fontWeight="800" textAnchor="middle">
        DOGE
      </text>
    </g>
  );
}

function CatMark({ x }: { x: number }) {
  return (
    <g>
      <circle cx={x} cy="78" r="34" fill="#e2c25a" />
      <path d={`M${x - 22} 70 L${x - 14} 42 L${x - 4} 66 Z`} fill="#c8922a" />
      <path d={`M${x + 22} 70 L${x + 14} 42 L${x + 4} 66 Z`} fill="#c8922a" />
      <circle cx={x - 10} cy="78" r="4" fill="#1a1406" />
      <circle cx={x + 10} cy="78" r="4" fill="#1a1406" />
    </g>
  );
}

function DogMark({ x }: { x: number }) {
  return (
    <g>
      <circle cx={x} cy="84" r="30" fill="#d9c7a1" />
      <ellipse cx={x - 24} cy="70" rx="10" ry="16" fill="#c4ad86" />
      <ellipse cx={x + 24} cy="70" rx="10" ry="16" fill="#c4ad86" />
      <ellipse cx={x} cy="92" rx="10" ry="7" fill="#f4ecd6" />
      <circle cx={x - 8} cy="78" r="3.5" fill="#1a1406" />
      <circle cx={x + 8} cy="78" r="3.5" fill="#1a1406" />
      <ellipse cx={x} cy="90" rx="3" ry="2.4" fill="#1a1406" />
    </g>
  );
}

function Penny() {
  return (
    <g fontFamily="ui-rounded, system-ui, sans-serif">
      <text x="24" y="96" fill="#f0d36a" fontSize="72" fontWeight="800">
        1¢
      </text>
      <text x="168" y="78" fill="#f4ecd6" fontSize="18" fontWeight="800">
        BURNS
      </text>
      <text x="168" y="112" fill="#e2483a" fontSize="28" fontWeight="800">
        {formatMeowe(POST_QUOTE.split.burn)}
      </text>
      <text x="168" y="136" fill="#cbbd9a" fontSize="14" fontWeight="700">
        MEOWE
      </text>
    </g>
  );
}
