// Persistent, dismissible windfall notification — lives at the App level
// (not screen-local ticker state) specifically so a real player clicking
// through Sell/Sign in quick succession can't have this silently
// overwritten by the very next action's routine reaction line before they
// register it. Stays up until explicitly closed.
export default function WindfallBanner({ message, onDismiss }) {
  if (!message) return null;
  return (
    <div className="windfall-banner" role="alert">
      <div className="windfall-banner__inner">
        <span className="windfall-banner__text">{message}</span>
        <button type="button" className="windfall-banner__dismiss" onClick={onDismiss} aria-label="Dismiss">
          Got it
        </button>
      </div>
    </div>
  );
}
