import { ROLE_LINE } from '../../data/copy.js';
import Ticker from './Ticker.jsx';
import StepIndicator from './StepIndicator.jsx';
import SquadNeedsSidebar from './SquadNeedsSidebar.jsx';

// Shared shell for Sell, Sign, and XI — persistent header/ticker/stepper/
// sidebar so the three screens read as one system instead of three
// independently-styled pages. Screen-specific content goes in `children`
// (right column) and `footer` (sticky bottom bar).
export default function GameShell({ state, dispatch, step, tickerMessage, children, footer }) {
  const totalIn = state.transfersIn.reduce((s, t) => s + t.fee, 0);
  const totalOut = state.transfersOut.reduce((s, t) => s + t.fee, 0);
  const net = round2(totalIn - totalOut);

  return (
    <div className="game-shell">
      <Ticker message={tickerMessage} />

      <div className="game-shell__header">
        <div className="game-shell__identity">
          <div className="game-shell__name">{state.manager.name}</div>
          <div className="game-shell__role">{ROLE_LINE}</div>
        </div>
        <div className="game-shell__stats">
          <div className="game-shell__stat">
            <span className="game-shell__stat-label">Budget</span>
            <span className="game-shell__stat-value">£{state.budget.toFixed(2)}m</span>
          </div>
          <div className="game-shell__stat">
            <span className="game-shell__stat-label">In</span>
            <span className="game-shell__stat-value">£{totalIn.toFixed(2)}m</span>
          </div>
          <div className="game-shell__stat">
            <span className="game-shell__stat-label">Out</span>
            <span className="game-shell__stat-value">£{totalOut.toFixed(2)}m</span>
          </div>
          <div className="game-shell__stat">
            <span className="game-shell__stat-label">Net</span>
            <span className="game-shell__stat-value">
              {net >= 0 ? '+' : ''}£{net.toFixed(2)}m
            </span>
          </div>
        </div>
      </div>

      <StepIndicator current={step} tasks={state.tasks} dispatch={dispatch} />

      <div className="game-shell__body">
        <SquadNeedsSidebar transfersIn={state.transfersIn} />
        <div className="game-shell__main">{children}</div>
      </div>

      {footer}
    </div>
  );
}

function round2(n) {
  return Math.round(n * 100) / 100;
}
