import { formationRequirements } from '../engine/strength.js';

// Checks whether the currently-selected XI (array of player objects) is a
// legal fielding for the chosen formation. Returns { legal, reasons } so
// callers can show a specific message ("need 4 DF, have 2") rather than a
// generic error.
export function checkXILegality(xi, formation) {
  const required = formationRequirements(formation);
  const reasons = [];

  if (xi.length !== 11) {
    reasons.push(`Need 11 players selected, have ${xi.length}.`);
  }

  const counts = xi.reduce((acc, p) => {
    acc[p.pos] = (acc[p.pos] || 0) + 1;
    return acc;
  }, {});

  for (const [pos, need] of Object.entries(required)) {
    const have = counts[pos] || 0;
    if (have !== need) {
      reasons.push(`Need ${need} ${pos}, have ${have}.`);
    }
  }

  return { legal: reasons.length === 0, reasons };
}

// Single source of truth for "can Simulate run" — used by both the Simulate
// button and anything that needs to know the window is ready. Never
// duplicate this check elsewhere.
export function canSimulate(state) {
  if (!state.tasks.sell || !state.tasks.sign || !state.tasks.xi) return false;
  if (!state.xi || state.xi.length !== 11) return false;
  const xiPlayers = state.xi.map((id) => state.squad.find((p) => p.id === id)).filter(Boolean);
  if (xiPlayers.length !== 11) return false;
  return checkXILegality(xiPlayers, state.formation).legal;
}

export function canSimulatePlayoff(state) {
  if (!state.playoffXi || state.playoffXi.length !== 11) return false;
  const xiPlayers = state.playoffXi.map((id) => state.squad.find((p) => p.id === id)).filter(Boolean);
  if (xiPlayers.length !== 11) return false;
  return checkXILegality(xiPlayers, state.playoffFormation || state.formation).legal;
}
