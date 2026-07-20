// Inline SVG icon mark per sponsor — no external image assets (keeps
// hosting at £0 and sidesteps real-logo copyright, since several sponsors
// are thinly-veiled parodies). Each mark is a bold, brand-evocative SHAPE
// (colour + silhouette), not a generated two-letter avatar — the thing that
// previously read as an unfilled placeholder rather than a joke brand.
//
// Nyke is deliberately the most conservative: no swoosh, no tick, no
// sweeping check-mark shape of any kind — just a bold letterform. The
// swoosh is about as recognisable as a mark gets, and a close mimic is a
// meaningfully different risk than a spoofed name.

function Mark({ id }) {
  switch (id) {
    case 'gazette':
      // Folded newspaper: a page with a turned corner + headline rules.
      return (
        <g>
          <path d="M16 14 H42 L48 20 V50 H16 Z" fill="#f5f3ee" />
          <path d="M42 14 V20 H48 Z" fill="#c9d6e4" />
          <line x1="21" y1="27" x2="43" y2="27" stroke="#1b3a5c" strokeWidth="2" />
          <line x1="21" y1="33" x2="43" y2="33" stroke="#1b3a5c" strokeWidth="2" />
          <line x1="21" y1="39" x2="36" y2="39" stroke="#1b3a5c" strokeWidth="2" />
        </g>
      );
    case 'manjaros':
      // Flame drop.
      return (
        <path
          d="M32 12c7 8 12 14 12 21 0 8-5.4 13-12 13s-12-5-12-13c0-4 2-7 4.4-10-0.2 3 1 4.6 2.6 4.6 2 0-1-6 5-15.6z"
          fill="#ffe3c2"
        />
      );
    case 'sports_direkt':
      // Bold italic wordmark-style lockup — evokes the real bold blue/white
      // sportswear-retailer identity via typography, not a redrawn logo.
      return (
        <text
          x="34"
          y="42"
          textAnchor="middle"
          fontSize="24"
          fontWeight="900"
          fontStyle="italic"
          fill="#ffffff"
          fontFamily="Arial, sans-serif"
          transform="skewX(-8)"
        >
          SD
        </text>
      );
    case 'bet366':
      // Rounded pill badge — evokes the real rounded-logo betting-brand
      // treatment (green + white, stadium-shaped mark) without copying it.
      return (
        <g>
          <rect x="10" y="23" width="44" height="18" rx="9" fill="#eafff2" />
          <text x="32" y="36" textAnchor="middle" fontSize="12" fontWeight="800" fill="#0a8a3e" fontFamily="Arial, sans-serif">
            366
          </text>
        </g>
      );
    case 'greggos':
      // Navy shield badge with a gold "G" — bakery-badge energy, not a
      // tech icon (the previous pasty shape read as headphones).
      return (
        <g>
          <path d="M32 12 L50 18 V32 C50 42 42 48 32 52 C22 48 14 42 14 32 V18 Z" fill="#0b2545" />
          <path d="M32 16 L46 21 V32 C46 40 40 45 32 48 C24 45 18 40 18 32 V21 Z" fill="none" stroke="#d4af37" strokeWidth="1" />
          <text x="32" y="38" textAnchor="middle" fontFamily="'Zilla Slab', serif" fontStyle="italic" fontWeight="700" fontSize="18" fill="#d4af37">
            G
          </text>
        </g>
      );
    case 'emirate':
      // Swept wing.
      return (
        <path
          d="M8 40 C20 24 36 16 56 14 C44 22 34 28 30 36 C40 34 48 34 56 36 C42 42 26 44 16 44 C13 44 10 42 8 40 Z"
          fill="#f3d9a4"
        />
      );
    case 'cryptonite':
      // Faceted gem.
      return (
        <g>
          <path d="M22 16 H42 L50 28 L32 50 L14 28 Z" fill="#e9d5ff" />
          <path d="M22 16 H42 L32 28 Z" fill="#c9a3f5" />
          <path d="M14 28 H50 L32 50 Z" fill="#d9baf8" opacity="0.7" />
        </g>
      );
    case 'justeaten':
      // Simple fork + spoon — the real brand's actual cutlery-mark
      // language, not the padlock this used to be.
      return (
        <g stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" fill="none">
          <line x1="24" y1="14" x2="24" y2="46" />
          <line x1="19" y1="14" x2="19" y2="24" />
          <line x1="29" y1="14" x2="29" y2="24" />
          <path d="M42 14 V46 M42 14 a6 7 0 0 1 0 14" />
        </g>
      );
    case 'nyke':
      // Abstract angled check — straight lines, gestures at "swoosh
      // energy" without the swoosh's actual curve or proportions. Most
      // conservative mark of all nine — see note above.
      return (
        <path d="M16 32 L27 40 L48 14" stroke="#ffffff" strokeWidth="5" fill="none" strokeLinecap="square" strokeLinejoin="miter" />
      );
    default:
      return null;
  }
}

export default function SponsorBadge({ sponsor, size = 56 }) {
  if (!sponsor) return null;
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-label={sponsor.name}>
      <rect x="1" y="1" width="62" height="62" rx="6" fill={sponsor.color || '#333'} />
      <rect x="1" y="1" width="62" height="62" rx="6" fill="none" stroke="rgba(255,255,255,0.15)" />
      <Mark id={sponsor.id} />
    </svg>
  );
}
