import { useState } from 'react';
import { TICKER_OPENING, TICKER_REACTIONS } from '../../data/copy.js';
import GameShell from '../shell/GameShell.jsx';
import XITask from './XITask.jsx';

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function isFreshWindow(state) {
  return (
    !state.tasks.sell &&
    !state.tasks.sign &&
    !state.tasks.xi &&
    state.transfersIn.length === 0 &&
    state.transfersOut.length === 0
  );
}

// Thin shell wrapper around the reusable XITask for the main Sell→Sign→XI
// flow — owns ticker state and the "where does Confirm actually go" logic,
// which the playoff XI screen (PlayoffTask.jsx) doesn't need since it
// renders XITask directly inside its own layout.
export default function XIScreen({ state, dispatch }) {
  const [ticker, setTicker] = useState(() =>
    isFreshWindow(state) ? TICKER_OPENING(state.manager.name, state.budgetTotal) : null
  );

  function handleConfirm() {
    dispatch({ type: 'MARK_TASK_DONE', payload: { task: 'xi' } });
    if (state.tasks.sell && state.tasks.sign) {
      dispatch({ type: 'GO_TO', payload: { screen: 'simulating' } });
    } else {
      dispatch({ type: 'GO_TO', payload: { screen: 'hub' } });
    }
  }

  return (
    <GameShell state={state} dispatch={dispatch} step="xi" tickerMessage={ticker}>
      <XITask
        squad={state.squad}
        formation={state.formation}
        xi={state.xi}
        onSetFormation={(f) => dispatch({ type: 'SET_FORMATION', payload: { formation: f } })}
        onToggle={(id) => {
          const has = state.xi.includes(id);
          const next = has ? state.xi.filter((x) => x !== id) : [...state.xi, id];
          dispatch({ type: 'SET_XI', payload: { playerIds: next } });
        }}
        onSetXi={(ids) => dispatch({ type: 'SET_XI', payload: { playerIds: ids } })}
        onConfirm={handleConfirm}
        onIllegalAttempt={() => setTicker(pick(TICKER_REACTIONS.xi_illegal))}
        confirmLabel="Close window & grade me"
        title="Pick your XI"
      />
    </GameShell>
  );
}
