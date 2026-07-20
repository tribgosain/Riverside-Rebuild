// Season-simulation progress indicator — a plain animated bar, not another
// attempt at bridge iconography. Diagonal red stripe fill reuses the same
// girder motif as the rest of the app (masthead-hero__girder,
// girder-divider) so it stays in the existing ink/cream/red visual
// language: sharp edges, no rounded corners, nothing bridge-shaped.
export default function ProgressBar({ progress = 0 }) {
  const pct = Math.max(0, Math.min(1, progress)) * 100;

  return (
    <div className="sim-progress">
      <div className="sim-progress__track">
        <div className="sim-progress__fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
