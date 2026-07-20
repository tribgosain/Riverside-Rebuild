// Full logo lockup per sponsor — icon + wordmark combined in one SVG, the
// way a real brand mark actually reads, not an icon-in-a-box next to a
// plain text label. Used on the spacious Setup sponsor-picker cards.
//
// Trademark caution (brief §18c): the brief is *evoke*, not *recreate*.
// Palette, rough shape language, and typographic feel read as "clearly
// parodying X," not a redrawn version of X's protected mark. Nyke gets the
// most caution of all nine — an abstract angled checkmark, not the
// swoosh's actual curve or proportions.

function Lockup({ id }) {
  switch (id) {
    case 'gazette':
      // Real, local, respectful reference — a clean masthead wordmark, no
      // icon-in-a-box. Sits on the card's own background, not a colour field.
      return (
        <g>
          <line x1="14" y1="12" x2="162" y2="12" stroke="#1b3a5c" strokeWidth="1" />
          <text x="88" y="35" textAnchor="middle" fontFamily="'Zilla Slab', serif" fontWeight="700" fontSize="17" fill="#1b3a5c">
            Evening Gazette
          </text>
          <line x1="14" y1="44" x2="162" y2="44" stroke="#1b3a5c" strokeWidth="1" />
        </g>
      );
    case 'manjaros':
      // Flame mark (already the right idea) paired with a warm script-ish
      // wordmark, no background field — reads as a small local business mark.
      return (
        <g>
          <path
            d="M30 14c6 6 10 11 10 17 0 6.5-4.4 10.5-10 10.5s-10-4-10-10.5c0-3.2 1.6-5.6 3.6-8-0.2 2.4 0.8 3.7 2.1 3.7 1.6 0-0.8-4.8 4.3-12.7z"
            fill="#d9622b"
          />
          <text x="50" y="35" fontFamily="'Zilla Slab', serif" fontStyle="italic" fontWeight="600" fontSize="19" fill="#7a3b1e">
            Manjarro&apos;s
          </text>
        </g>
      );
    case 'sports_direkt':
      // Bold condensed wordmark, blue field — utilitarian discount-retail
      // energy, not an athletic icon. No icon at all, per spec.
      return (
        <g>
          <rect x="1" y="1" width="174" height="54" rx="4" fill="#0057b8" />
          <text
            x="88"
            y="34"
            textAnchor="middle"
            fontFamily="Arial, sans-serif"
            fontWeight="900"
            fontSize="19"
            letterSpacing="-0.5"
            fill="#ffffff"
            transform="scale(0.94 1)"
            style={{ transformOrigin: '88px 34px' }}
          >
            SPORTS DIREKT
          </text>
        </g>
      );
    case 'bet366':
      // Wordmark-in-pill, green + white, soft rounded lowercase lettering —
      // matches the real brand's rounded typographic feel.
      return (
        <g>
          <rect x="1" y="1" width="174" height="54" rx="27" fill="#0a8a3e" />
          <text x="88" y="34" textAnchor="middle" fontFamily="'Work Sans', sans-serif" fontWeight="700" fontSize="22" fill="#ffffff">
            bet366
          </text>
        </g>
      );
    case 'greggos':
      // Navy badge/shield with a gold script wordmark inside — bakery-badge
      // energy, not a tech icon.
      return (
        <g>
          <ellipse cx="88" cy="28" rx="86" ry="26" fill="#0b2545" />
          <ellipse cx="88" cy="28" rx="80" ry="20" fill="none" stroke="#d4af37" strokeWidth="1" />
          <text x="88" y="35" textAnchor="middle" fontFamily="'Zilla Slab', serif" fontStyle="italic" fontWeight="700" fontSize="20" fill="#d4af37">
            Greggo&apos;s
          </text>
        </g>
      );
    case 'emirate':
      // Gold field, an elegant abstract swoosh, clean wordmark — airline
      // livery feel, understated, not cartoonish.
      return (
        <g>
          <rect x="1" y="1" width="174" height="54" rx="4" fill="#b7862c" />
          <path d="M14 20 Q88 2 162 20" stroke="#f8ecd0" strokeWidth="2" fill="none" />
          <text x="88" y="42" textAnchor="middle" fontFamily="'Zilla Slab', serif" fontWeight="600" fontSize="16" letterSpacing="2" fill="#f8ecd0">
            EMIRATE
          </text>
        </g>
      );
    case 'cryptonite':
      // Abstract faceted polygon + lowercase geometric sans — generic
      // "try-hard crypto startup" visual language.
      return (
        <g>
          <defs>
            <linearGradient id="cryptoGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#7c3aed" />
              <stop offset="1" stopColor="#4c1d95" />
            </linearGradient>
          </defs>
          <rect x="1" y="1" width="174" height="54" rx="4" fill="url(#cryptoGrad)" />
          <path d="M22 18 H34 L40 28 L28 40 L16 28 Z" fill="#e9d5ff" opacity="0.9" />
          <text x="98" y="34" textAnchor="middle" fontFamily="'Work Sans', sans-serif" fontWeight="600" fontSize="15" fill="#ffffff">
            cryptonite.io
          </text>
        </g>
      );
    case 'justeaten':
      // Orange/coral field, simple white cutlery mark, rounded wordmark.
      return (
        <g>
          <rect x="1" y="1" width="174" height="54" rx="4" fill="#ff5a3c" />
          <g stroke="#ffffff" strokeWidth="2" strokeLinecap="round" fill="none">
            <line x1="24" y1="16" x2="24" y2="40" />
            <line x1="20" y1="16" x2="20" y2="24" />
            <line x1="28" y1="16" x2="28" y2="24" />
            <path d="M40 16 V40 M40 16 a5 6 0 0 1 0 12" />
          </g>
          <text x="98" y="34" textAnchor="middle" fontFamily="'Work Sans', sans-serif" fontWeight="700" fontSize="16" fill="#ffffff">
            Just Eaten
          </text>
        </g>
      );
    case 'nyke':
      // Most caution of all nine — bold black/white minimal treatment, an
      // abstract angled check that gestures at "swoosh energy" without the
      // swoosh's actual curve or proportions. Straight angled lines only.
      return (
        <g>
          <rect x="1" y="1" width="174" height="54" rx="4" fill="#111111" />
          <path d="M18 32 L30 40 L48 16" stroke="#ffffff" strokeWidth="4" fill="none" strokeLinecap="square" strokeLinejoin="miter" />
          <text x="106" y="34" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="20" letterSpacing="-0.5" fill="#ffffff" transform="scale(0.92 1)" style={{ transformOrigin: '106px 34px' }}>
            NYKE
          </text>
        </g>
      );
    default:
      return null;
  }
}

export default function SponsorMark({ sponsor, width = 176 }) {
  if (!sponsor) return null;
  const height = (width / 176) * 56;
  return (
    <svg width={width} height={height} viewBox="0 0 176 56" role="img" aria-label={sponsor.name}>
      <Lockup id={sponsor.id} />
    </svg>
  );
}
