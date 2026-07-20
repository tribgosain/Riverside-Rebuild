import { MANDATES, BOARD_PATIENCE_COPY } from '../data/copy.js';
import { canSimulate } from '../state/taskGate.js';

function patienceBand(patience) {
  if (patience <= 20) return 'furious';
  if (patience <= 40) return 'wobble';
  return 'steady';
}

export default function TaskHub({ state, dispatch }) {
  const mandate = MANDATES[state.manager.mandate];
  const totalIn = state.transfersIn.reduce((s, t) => s + t.fee, 0);
  const totalOut = state.transfersOut.reduce((s, t) => s + t.fee, 0);
  const net = round2(totalIn - totalOut);
  const wageSpent = state.wageCapTotal - state.wageCapRemaining;
  const ready = canSimulate(state);
  const band = patienceBand(state.boardPatience);

  const tasks = [
    { key: 'sell', label: 'Sell', done: state.tasks.sell, desc: 'Move players on, free up budget & squad space.' },
    { key: 'sign', label: 'Sign', done: state.tasks.sign, desc: 'Bring players in within budget & wage cap.' },
    { key: 'xi', label: 'XI', done: state.tasks.xi, desc: 'Pick a formation and a legal starting XI.' },
  ];

  return (
    <div className="screen hub-screen">
      <div className="scorecard rivet-corners">
        <div className="scorecard__hero">
          <span className="scorecard__hero-label">Net spend</span>
          <span className="scorecard__hero-value">
            {net >= 0 ? '+' : ''}£{net.toFixed(2)}m
          </span>
          <span className="scorecard__hero-sub">of £{mandate.budget}m mandate ceiling</span>
        </div>
        <div className="scorecard__grid">
          <div className="scorecard__stat">
            <span className="scorecard__stat-label">IN</span>
            <span className="scorecard__stat-value">£{totalIn.toFixed(2)}m</span>
          </div>
          <div className="scorecard__stat">
            <span className="scorecard__stat-label">OUT</span>
            <span className="scorecard__stat-value">£{totalOut.toFixed(2)}m</span>
          </div>
          <div className="scorecard__stat">
            <span className="scorecard__stat-label">Wages</span>
            <span className="scorecard__stat-value">£{wageSpent}k/{state.wageCapTotal}k</span>
          </div>
          <div className="scorecard__stat">
            <span className="scorecard__stat-label">Budget left</span>
            <span className="scorecard__stat-value">£{state.budget.toFixed(2)}m</span>
          </div>
          <div className="scorecard__stat">
            <span className="scorecard__stat-label">Squad</span>
            <span className="scorecard__stat-value">{state.squad.length}</span>
          </div>
        </div>
      </div>

      <div className="patience-meter">
        {BOARD_PATIENCE_COPY[band]}
      </div>

      <div className="task-tiles">
        {tasks.map((t) => (
          <button
            key={t.key}
            type="button"
            className={`task-tile${t.done ? ' task-tile--done' : ''}`}
            onClick={() => dispatch({ type: 'GO_TO', payload: { screen: t.key } })}
          >
            <div className="task-tile__check">{t.done ? '✓' : ''}</div>
            <div className="task-tile__label">{t.label}</div>
            <div className="task-tile__desc">{t.desc}</div>
          </button>
        ))}
      </div>

      <div className="sticky-bar">
        <button
          type="button"
          className="primary-btn"
          disabled={!ready}
          onClick={() => dispatch({ type: 'GO_TO', payload: { screen: 'simulating' } })}
        >
          {ready ? 'Simulate the season' : 'Complete Sell, Sign & XI first'}
        </button>
      </div>
    </div>
  );
}

function round2(n) {
  return Math.round(n * 100) / 100;
}
