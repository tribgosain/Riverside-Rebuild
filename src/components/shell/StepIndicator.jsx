const STEPS = [
  { key: 'sell', label: 'Sell' },
  { key: 'sign', label: 'Sign' },
  { key: 'xi', label: 'XI' },
];

// Standard breadcrumb/stepper behaviour: the current step and any already-
// completed step are clickable and jump straight there; a future step you
// haven't reached yet stays inert until you get to it the normal way.
export default function StepIndicator({ current, tasks, dispatch }) {
  return (
    <div className="step-indicator">
      {STEPS.map((s, i) => {
        const done = tasks[s.key];
        const active = current === s.key;
        const reachable = done || active;
        return (
          <div className="step-indicator__item" key={s.key}>
            <button
              type="button"
              disabled={!reachable}
              className={`step-indicator__circle${active ? ' step-indicator__circle--active' : ''}${done ? ' step-indicator__circle--done' : ''}${!reachable ? ' step-indicator__circle--locked' : ''}`}
              onClick={() => reachable && dispatch({ type: 'GO_TO', payload: { screen: s.key } })}
            >
              {done ? '✓' : i + 1}
            </button>
            <span className="step-indicator__label">{s.label}</span>
            {i < STEPS.length - 1 && <span className="step-indicator__connector" />}
          </div>
        );
      })}
    </div>
  );
}
