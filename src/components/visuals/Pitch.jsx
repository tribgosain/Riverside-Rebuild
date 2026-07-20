// Pitch markings only — an absolutely-positioned SVG behind the slot
// buttons. viewBox matches the container's aspect-ratio so circles/arcs
// aren't stretched.
export default function Pitch() {
  return (
    <svg className="pitch__markings" viewBox="0 0 68 100" preserveAspectRatio="none" aria-hidden="true">
      <rect x="1" y="1" width="66" height="98" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="0.4" />
      <line x1="1" y1="50" x2="67" y2="50" stroke="rgba(255,255,255,0.35)" strokeWidth="0.4" />
      <circle cx="34" cy="50" r="9.15" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="0.4" />
      <circle cx="34" cy="50" r="0.6" fill="rgba(255,255,255,0.35)" />
      <rect x="13.84" y="1" width="40.32" height="16.5" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="0.4" />
      <rect x="24.84" y="1" width="18.32" height="5.5" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="0.4" />
      <rect x="13.84" y="82.5" width="40.32" height="16.5" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="0.4" />
      <rect x="24.84" y="93.5" width="18.32" height="5.5" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="0.4" />
    </svg>
  );
}
