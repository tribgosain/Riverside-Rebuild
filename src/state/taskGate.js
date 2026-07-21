// Checks whether the currently-selected XI (array of player objects) is a
// legal fielding. Returns { legal, reasons } so callers can show a
// specific message rather than a generic error.
//
// Deliberately NOT checking position/role distribution against the
// formation shape — any squad player can be fielded in any slot
// regardless of their own listed position (a forward can play in a
// midfield slot, etc.). The formation's shape is enforced by there being
// exactly 11 pitch slots to fill in the UI (see XITask.jsx), not by
// cross-checking each player's own pos label here — that's what
// previously blocked legitimately full, deliberately-assembled XIs from
// progressing whenever a player's labelled position didn't match the
// slot they were placed in.
export function checkXILegality(xi) {
  const reasons = [];

  if (xi.length !== 11) {
    reasons.push(`Need 11 players selected, have ${xi.length}.`);
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
  return checkXILegality(xiPlayers).legal;
}

export function canSimulatePlayoff(state) {
  if (!state.playoffXi || state.playoffXi.length !== 11) return false;
  const xiPlayers = state.playoffXi.map((id) => state.squad.find((p) => p.id === id)).filter(Boolean);
  if (xiPlayers.length !== 11) return false;
  return checkXILegality(xiPlayers).legal;
}
