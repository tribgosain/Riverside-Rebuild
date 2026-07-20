export default function Header({ onRestart }) {
  return (
    <header className="masthead">
      <div className="masthead__inner">
        <span className="masthead__brand">
          <span className="masthead__wordmark">
            RIVERSIDE <em>REBUILD</em>
          </span>
        </span>
        {onRestart && (
          <button type="button" className="masthead__restart" onClick={onRestart}>
            Restart
          </button>
        )}
      </div>
    </header>
  );
}
