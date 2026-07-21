import { useState } from 'react';
import { SQUAD_CEILING } from '../../engine/strength.js';
import { computeSquadStats, computeBargainThreshold, tagSignTarget } from '../../engine/recommendations.js';
import { groupByRole } from '../../engine/positionGroups.js';
import { TICKER_OPENING, TICKER_REACTIONS, SQUAD_NEEDS } from '../../data/copy.js';
import { rollWindfall } from '../../engine/windfall.js';
import GameShell from '../shell/GameShell.jsx';
import PlayerRow from '../shell/PlayerRow.jsx';

const TIERS = [
  { key: 'star', label: 'Stars', blurb: 'Genuine coups — Championship-elite, real fee, real risk of missing out.' },
  { key: 'solid', label: 'Solid', blurb: 'Proven, sensible business. The bulk of a realistic window.' },
  { key: 'project', label: 'Project', blurb: 'Cheap, foreign, unproven in England. Hidden gem or bust.' },
];

const POSITIONS = ['ALL', 'GK', 'DF', 'MF', 'FW'];

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

export default function SignTask({ state, dispatch }) {
  const [ticker, setTicker] = useState(() =>
    isFreshWindow(state) ? TICKER_OPENING(state.manager.name, state.budgetTotal) : null
  );
  const [scoutRevealed, setScoutRevealed] = useState(false);
  const [activeTier, setActiveTier] = useState('star');
  const [activePos, setActivePos] = useState('ALL');
  const atCeiling = state.squad.length >= SQUAD_CEILING;

  const hiddenTargets = state.market.filter((p) => p.hidden);
  // The full pool, tier/position filtering aside — Auto-fill needs and the
  // windfall roll search across everything, not just whichever tab/chip the
  // person happens to be looking at.
  const visibleMarket = state.market.filter((p) => !p.hidden || scoutRevealed);

  const tierFilteredMarket = visibleMarket.filter((p) => p.tier === activeTier);
  const tabMarket = activePos === 'ALL' ? tierFilteredMarket : tierFilteredMarket.filter((p) => p.pos === activePos);

  const squadStats = computeSquadStats(state.squad);
  const bargainThreshold = computeBargainThreshold(state.market);

  const tagged = tabMarket.map((p) => ({ player: p, tags: tagSignTarget(p, squadStats, bargainThreshold) }));

  const groups = groupByRole(tabMarket).map((g) => ({
    ...g,
    rows: g.players
      .map((p) => tagged.find((t) => t.player.id === p.id))
      .sort((a, b) => b.tags.length - a.tags.length || b.player.ovr - a.player.ovr),
  }));

  // Squad count at this role, not the market list's row count — the point
  // is surfacing squad gaps ("you only have 1 CB") while browsing targets
  // for that position, not how many are available to buy.
  const squadCountByRole = {};
  for (const p of state.squad) {
    squadCountByRole[p.role] = (squadCountByRole[p.role] || 0) + 1;
  }

  function handleSign(player, tags) {
    dispatch({ type: 'SIGN_PLAYER', payload: { playerId: player.id } });
    const windfall = rollWindfall(state);
    if (windfall) {
      dispatch({ type: 'WINDFALL_EVENT', payload: { amount: windfall.amount } });
      setTicker(windfall.message);
      return;
    }
    if (player.value >= 6) setTicker(pick(TICKER_REACTIONS.sign_headline));
    else if (tags.includes('wildcard')) setTicker(pick(TICKER_REACTIONS.sign_wildcard));
  }

  function handleBlockedAttempt(reason) {
    setTicker(pick(TICKER_REACTIONS[reason]));
  }

  function handleAutoFill() {
    const criticalNeeds = SQUAD_NEEDS.filter((n) => n.priority === 'CRITICAL');
    const alreadySignedRoles = new Set(state.transfersIn.map((t) => t.player.role));
    let budget = state.budget;
    let wageCap = state.wageCapRemaining;
    let squadSize = state.squad.length;
    let filledAny = false;

    for (const need of criticalNeeds) {
      if (alreadySignedRoles.has(need.role)) continue;
      if (squadSize >= SQUAD_CEILING) continue;
      const candidate = visibleMarket
        .filter((p) => p.role === need.role && p.value <= budget + 1e-9 && p.wage <= wageCap)
        .sort((a, b) => b.ovr - a.ovr)[0];
      if (!candidate) continue;
      dispatch({ type: 'SIGN_PLAYER', payload: { playerId: candidate.id } });
      budget -= candidate.value;
      wageCap -= candidate.wage;
      squadSize += 1;
      filledAny = true;
    }
    const windfall = filledAny ? rollWindfall(state) : null;
    if (windfall) {
      dispatch({ type: 'WINDFALL_EVENT', payload: { amount: windfall.amount } });
      setTicker(windfall.message);
      return;
    }
    setTicker(filledAny ? pick(TICKER_REACTIONS.sign_headline) : pick(TICKER_REACTIONS.budget_wall));
  }

  const signedCount = state.transfersIn.length;
  const spent = state.transfersIn.reduce((s, t) => s + t.fee, 0);

  return (
    <GameShell
      state={state}
      dispatch={dispatch}
      step="sign"
      tickerMessage={ticker}
      footer={
        <div className="sticky-bar sticky-bar--footer">
          <div className="footer-counter">
            {signedCount} signed &middot; £{spent.toFixed(2)}m spent &middot; £{state.budget.toFixed(2)}m left &middot; £{state.wageCapRemaining}k/wk wage cap left
          </div>
          <div className="footer-actions">
            {!scoutRevealed && hiddenTargets.length > 0 && (
              <button
                type="button"
                className="secondary-btn"
                onClick={() => {
                  setScoutRevealed(true);
                  setTicker("Scout's dug up one more name — check the list.");
                }}
              >
                Ask the scout for more
              </button>
            )}
            <button type="button" className="secondary-btn" onClick={handleAutoFill}>
              Auto-fill needs
            </button>
            <button
              type="button"
              className="primary-btn"
              onClick={() => {
                dispatch({ type: 'MARK_TASK_DONE', payload: { task: 'sign' } });
                dispatch({ type: 'GO_TO', payload: { screen: 'xi' } });
              }}
            >
              Done signing
            </button>
          </div>
        </div>
      }
    >
      <h1 className="task-title">Sign</h1>
      <p className="task-subtitle">
        Budget £{state.budget.toFixed(2)}m &middot; Wage cap £{state.wageCapRemaining}k/wk left &middot; Squad {state.squad.length}/{SQUAD_CEILING}
      </p>

      <div className="scout-tabs">
        {TIERS.map((t) => (
          <button
            key={t.key}
            type="button"
            className={`scout-tabs__tab${activeTier === t.key ? ' scout-tabs__tab--active' : ''}`}
            onClick={() => setActiveTier(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <p className="scout-tabs__blurb">{TIERS.find((t) => t.key === activeTier)?.blurb}</p>

      <div className="chip-row chip-row--filters">
        {POSITIONS.map((pos) => (
          <button
            key={pos}
            type="button"
            className={`filter-chip${activePos === pos ? ' filter-chip--active' : ''}`}
            onClick={() => setActivePos(pos)}
          >
            {pos}
          </button>
        ))}
      </div>

      {groups.length === 0 && (
        <p className="task-subtitle">No {activePos === 'ALL' ? '' : `${activePos} `}targets in this tier right now.</p>
      )}

      {groups.map((g) => (
        <div key={g.role} className="position-group">
          <div className="position-group__header">
            {g.label} <span className="position-group__count">({squadCountByRole[g.role] || 0})</span>
          </div>
          <ul className="player-list">
            {g.rows.map(({ player: p, tags }) => {
              const canAffordFee = p.value <= state.budget + 1e-9;
              const canAffordWage = p.wage <= state.wageCapRemaining;
              const walled = !canAffordFee || !canAffordWage;
              let label = p.value > 0 ? `Sign £${p.value}m` : 'Sign (Free)';
              if (atCeiling) label = 'Squad full';
              else if (!canAffordFee) label = "Can't afford";
              else if (!canAffordWage) label = 'Over wage cap';

              return (
                <PlayerRow
                  key={p.id}
                  player={p}
                  tags={tags}
                  actionLabel={label}
                  actionDisabled={atCeiling}
                  actionBlocked={walled}
                  actionClass="action-btn--sign"
                  showClub
                  onAction={() => {
                    if (walled) {
                      if (!canAffordFee) handleBlockedAttempt('budget_wall');
                      else handleBlockedAttempt('wage_wall');
                      return;
                    }
                    handleSign(p, tags);
                  }}
                />
              );
            })}
          </ul>
        </div>
      ))}
    </GameShell>
  );
}
