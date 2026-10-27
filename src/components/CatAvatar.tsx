import type { CatLook } from '../services/types';

type Size = 'sm' | 'md' | 'lg' | 'xl';

export function CatAvatar({
  look,
  label,
  decorative = false,
  size = 'md',
}: {
  look: CatLook;
  label: string;
  decorative?: boolean;
  size?: Size;
}) {
  const a11y = decorative
    ? ({ 'aria-hidden': true } as const)
    : ({ role: 'img', 'aria-label': label } as const);

  return (
    <span className={`avatar avatar-${size}`}>
      <svg viewBox="0 0 80 80" {...a11y}>
        <circle cx="40" cy="40" r="40" fill="#140f09" />
        <path d="M16 42 L23 16 L36 34 Z" fill={look.fur} />
        <path d="M64 42 L57 16 L44 34 Z" fill={look.fur} />
        <path d="M21 36 L26 20 L33 33 Z" fill="#f3b7c9" />
        <path d="M59 36 L54 20 L47 33 Z" fill="#f3b7c9" />
        <circle cx="40" cy="46" r="22" fill={look.fur} />
        <ellipse cx="40" cy="53" rx="11" ry="8" fill={look.belly} />
        {look.mood === 'wink' ? (
          <path
            d="M22 45 Q28 40 34 45"
            fill="none"
            stroke="#1a1406"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        ) : (
          <g>
            <ellipse cx="28" cy="44" rx="4.2" ry="5.2" fill="#1a1406" />
            <circle cx="29.4" cy="42.4" r="1.3" fill="#fff" />
          </g>
        )}
        <ellipse cx="52" cy="44" rx="4.2" ry="5.2" fill="#1a1406" />
        <circle cx="53.4" cy="42.4" r="1.3" fill="#fff" />
        <path d="M40 50.5 L36.4 54.6 Q40 56.6 43.6 54.6 Z" fill="#e2483a" />
        <path
          d="M40 55 Q35.5 59 32.5 57"
          fill="none"
          stroke="#1a1406"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
        <path
          d="M40 55 Q44.5 59 47.5 57"
          fill="none"
          stroke="#1a1406"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
        {look.mood === 'blep' ? <ellipse cx="42" cy="59" rx="3" ry="4.4" fill="#e77fa8" /> : null}
        <path
          d="M14 48 H26 M14 53 H26 M54 48 H66 M54 53 H66"
          stroke={look.belly}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {look.accessory === 'shades' ? (
          <g>
            <rect x="18" y="39" width="18" height="12" rx="4" fill="#14110c" stroke="#f0d36a" strokeWidth="1.6" />
            <rect x="44" y="39" width="18" height="12" rx="4" fill="#14110c" stroke="#f0d36a" strokeWidth="1.6" />
            <path d="M36 45 H44" stroke="#14110c" strokeWidth="2.4" />
          </g>
        ) : null}
        {look.accessory === 'beanie' ? (
          <g>
            <path d="M18 38 Q40 8 62 38 Q40 26 18 38 Z" fill={look.accent} />
            <rect x="18" y="34" width="44" height="7" rx="3" fill={look.accent} />
            <circle cx="58" cy="18" r="5" fill={look.accent} />
          </g>
        ) : null}
        {look.accessory === 'cap' ? (
          <g>
            <path d="M22 36 Q40 18 58 34 Q40 28 22 36 Z" fill={look.accent} />
            <path d="M16 36 Q40 30 68 38 Q40 34 16 36 Z" fill={look.accent} />
          </g>
        ) : null}
        {look.accessory === 'crown' ? (
          <path
            d="M16 36 L24 18 L32 30 L40 12 L48 30 L56 18 L64 36 Z"
            fill="#f0d36a"
            stroke="#8a6a12"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
        ) : null}
      </svg>
    </span>
  );
}
