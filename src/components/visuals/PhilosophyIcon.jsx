// Small motif per philosophy, visualising what it actually does to the
// simulation (variance spread / narrow / asymmetric / direct) rather than
// four identical text blocks with no visual distinction.
export default function PhilosophyIcon({ id, size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" role="img" aria-hidden="true">
      <circle cx="20" cy="20" r="19" fill="none" stroke="var(--border)" strokeWidth="1.5" />
      {id === 'high_press' && (
        <g stroke="var(--kit-primary)" strokeWidth="2.5" strokeLinecap="round">
          <line x1="20" y1="20" x2="9" y2="9" />
          <line x1="20" y1="20" x2="31" y2="9" />
          <line x1="20" y1="20" x2="9" y2="31" />
          <line x1="20" y1="20" x2="31" y2="31" />
        </g>
      )}
      {id === 'control_possession' && (
        <g>
          <circle cx="20" cy="20" r="10" fill="none" stroke="var(--kit-primary)" strokeWidth="2.5" />
          <circle cx="20" cy="20" r="2.5" fill="var(--kit-primary)" />
        </g>
      )}
      {id === 'counter_attack' && (
        <g stroke="var(--kit-primary)" strokeWidth="2.5" strokeLinecap="round" fill="none">
          <line x1="10" y1="30" x2="28" y2="12" />
          <path d="M20,12 H28 V20" />
        </g>
      )}
      {id === 'route_one' && (
        <path
          d="M10,30 Q20,6 30,12"
          stroke="var(--kit-primary)"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="1 5"
        />
      )}
    </svg>
  );
}
