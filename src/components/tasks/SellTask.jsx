import { useState } from 'react';
import { SQUAD_FLOOR } from '../../engine/strength.js';
import { computeSquadStats, computeKeyAssetIds, computeOverstockedIds, tagSellCandidate } from '../../engine/recommendations.js';
import { groupByRole } from '../../engine/positionGroups.js';
import { TICKER_OPENING, TICKER_REACTIONS } from '../../data/copy.js';
import { rollWindfall } from '../../engine/windfall.js';
import GameShell from '../shell/GameShell.jsx';
import PlayerRow from '../shell/PlayerRow.jsx';

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

export default function SellTask({ state, dispatch }) {
  const [ticker, setTicker] = useState(() =>
    isFreshWindow(state) ? TICKER_OPENING(state.manager.name, state.budgetTotal) : null
  );
  const atFloor = state.squad.length <= SQUAD_FLOOR;

  const squadStats = computeSquadStats(state.squad);
  const keyAssetIds = computeKeyAssetIds(state.squad);
  const overstockedIds = computeOverstockedIds(state.squad, keyAssetIds);

  const tagged = state.squad.map((p) => ({ player: p, tags: tagSellCandidate(p, squadStats, keyAssetIds, overstockedIds) }));
  const surplusIds = tagged.filter((t) => t.tags.includes('surplus')).map((t) => t.player.id);

  const groups = groupByRole(state.squad).map((g) => ({
    ...g,
    rows: g.players
      .map((p) => tagged.find((t) => t.player.id === p.id))
      .sort((a, b) => {
        const af = a.tags.length > 0 ? 1 : 0;
        const bf = b.tags.length > 0 ? 1 : 0;
        if (af !== bf) return bf - af;
        return a.player.ovr - b.player.ovr;
      }),
  }));

  function handleSell(player, tags) {
    dispatch({ type: 'SELL_PLAYER', payload: { playerId: player.id } });
    const windfall = rollWindfall(state);
    if (windfall) {
      // Shown via the persistent top-level windfall banner (App.jsx), not
      // the local ticker — a screen-local ticker line gets overwritten by
      // the very next action and is too easy to miss entirely.
      dispatch({ type: 'WINDFALL_EVENT', payload: { amount: windfall.amount, message: windfall.message } });
      return;
    }
    if (tags.includes('key_asset')) setTicker(pick(TICKER_REACTIONS.sell_key_asset));
    else if (tags.includes('surplus')) setTicker(pick(TICKER_REACTIONS.sell_surplus));
  }

  function handleAutoTrim() {
    let remaining = state.squad.length;
    for (const id of surplusIds) {
      if (remaining <= SQUAD_FLOOR) break;
      dispatch({ type: 'SELL_PLAYER', payload: { playerId: id } });
      remaining -= 1;
    }
    const windfall = surplusIds.length > 0 ? rollWindfall(state) : null;
    if (windfall) {
      // Shown via the persistent top-level windfall banner (App.jsx), not
      // the local ticker — a screen-local ticker line gets overwritten by
      // the very next action and is too easy to miss entirely.
      dispatch({ type: 'WINDFALL_EVENT', payload: { amount: windfall.amount, message: windfall.message } });
      return;
    }
    if (surplusIds.length > 0) setTicker(pick(TICKER_REACTIONS.sell_surplus));
  }

  const soldCount = state.transfersOut.length;
  const raised = state.transfersOut.reduce((s, t) => s + t.fee, 0);

  return (
    <GameShell
      state={state}
      dispatch={dispatch}
      step="sell"
      tickerMessage={ticker}
      footer={
        <div className="sticky-bar sticky-bar--footer">
          <div className="footer-counter">
            {soldCount} sold &middot; £{raised.toFixed(2)}m raised
          </div>
          <div className="footer-actions">
            <button type="button" className="secondary-btn" disabled={surplusIds.length === 0 || atFloor} onClick={handleAutoTrim}>
              Auto-trim surplus
            </button>
            <button
              type="button"
              className="primary-btn"
              onClick={() => {
                dispatch({ type: 'MARK_TASK_DONE', payload: { task: 'sell' } });
                dispatch({ type: 'GO_TO', payload: { screen: 'sign' } });
              }}
            >
              Done selling
            </button>
          </div>
        </div>
      }
    >
      <h1 className="task-title">Sell</h1>
      <p className="task-subtitle">
        Squad: {state.squad.length} (floor {SQUAD_FLOOR}). {atFloor && "You're at the floor — can't sell any further."}
      </p>

      {groups.map((g) => (
        <div key={g.role} className="position-group">
          <div className="position-group__header">
            {g.label} <span className="position-group__count">({g.rows.length})</span>
          </div>
          <ul className="player-list">
            {g.rows.map(({ player: p, tags }) => (
              <PlayerRow
                key={p.id}
                player={p}
                tags={tags}
                actionLabel={`Sell £${p.value}m`}
                actionDisabled={atFloor}
                actionClass="action-btn--sell"
                onAction={() => handleSell(p, tags)}
              />
            ))}
          </ul>
        </div>
      ))}
    </GameShell>
  );
}
