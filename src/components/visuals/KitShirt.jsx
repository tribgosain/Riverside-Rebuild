// Inline SVG shirt preview — renders the chosen primary/trim colours,
// pattern (plain / band / polka / pinstripe), and neck style (v / crew /
// collar) so a kit pick reads as an actual kit. "band" is Boro's real kit
// hallmark (the 1973 Jack Charlton chest band); "polka" nods to the oldest
// surviving Boro kit, worn 1886-1890.

const SHIRT_PATH =
  'M30,10 L41,4 Q50,13 59,4 L70,10 L84,27 L71,36 L71,92 L29,92 L29,36 L16,27 Z';

const NECK_PATHS = {
  v: 'M41,4 Q50,13 59,4',
  crew: 'M40,5 Q50,10 60,5',
  collar: 'M38,4 L41,4 Q50,13 59,4 L62,4',
};

function polkaDots(trim) {
  const dots = [];
  for (let row = 0; row < 5; row += 1) {
    for (let col = 0; col < 6; col += 1) {
      const x = 20 + col * 12 + (row % 2 === 0 ? 0 : 6);
      const y = 44 + row * 10;
      dots.push(<circle key={`${row}-${col}`} cx={x} cy={y} r="2.2" fill={trim} opacity="0.85" />);
    }
  }
  return dots;
}

function pinstripes(trim) {
  const lines = [];
  for (let i = 0; i < 9; i += 1) {
    const x = 20 + i * 7.5;
    lines.push(<rect key={i} x={x} y="10" width="2" height="82" fill={trim} opacity="0.55" />);
  }
  return lines;
}

export default function KitShirt({
  primary = '#E2231A',
  trim = '#FFFFFF',
  pattern = 'solid',
  neck = 'v',
  size = 72,
  uid = 'default',
}) {
  const clipId = `shirt-clip-${uid}`;
  const neckPath = NECK_PATHS[neck] || NECK_PATHS.v;

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label="Kit preview">
      <defs>
        <clipPath id={clipId}>
          <path d={SHIRT_PATH} />
        </clipPath>
      </defs>

      <path d={SHIRT_PATH} fill={primary} stroke="rgba(0,0,0,0.25)" strokeWidth="1.5" />

      <g clipPath={`url(#${clipId})`}>
        {pattern === 'band' && <rect x="0" y="32" width="100" height="15" fill={trim} opacity="0.95" />}
        {pattern === 'polka' && polkaDots(trim)}
        {pattern === 'pinstripe' && pinstripes(trim)}
      </g>

      {/* Collar (varies by neck style) + cuff trim */}
      <path d={neckPath} stroke={trim} strokeWidth="3" fill="none" strokeLinecap="round" />
      {neck === 'collar' && (
        <>
          <path d="M35,3 L41,9" stroke={trim} strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M65,3 L59,9" stroke={trim} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </>
      )}
      <path d="M16,27 L29,36" stroke={trim} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M84,27 L71,36" stroke={trim} strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}
