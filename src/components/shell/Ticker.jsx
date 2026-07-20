export default function Ticker({ message }) {
  if (!message) return null;
  return (
    <div className="ticker">
      <span className="ticker__text">{message}</span>
    </div>
  );
}
