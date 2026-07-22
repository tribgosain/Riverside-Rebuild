// Persistent, dismissible windfall notification — lives at the App level so
// it's visible the moment a fresh window opens (before any Sell/Sign
// action) and can't be missed or scrolled past. Styled as a rolling news
// breaking-banner: solid block colour, no gradient, a tag pill labelling
// it BREAKING, stays up until explicitly closed.
export default function WindfallBanner({ message, onDismiss }) {
  if (!message) return null;
  return (
    <div className="windfall-banner" role="alert">
      <div className="windfall-banner__inner">
        <span className="windfall-banner__tag">Breaking</span>
        <span className="windfall-banner__text">{message}</span>
        <button type="button" className="windfall-banner__dismiss" onClick={onDismiss} aria-label="Dismiss">
          Got it
        </button>
      </div>
    </div>
  );
}
