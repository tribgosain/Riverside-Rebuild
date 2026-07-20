// Squad/XI strength calculation. Deliberately simple: a weighted average of
// the picked XI's OVR, plus a small bonus for having depth beyond the
// playable-squad floor (a bigger squad survives a bad month better, which
// the flavor text explicitly cares about).

import { PITCH_LAYOUT } from './pitchLayout.js';

export const SQUAD_FLOOR = 16;
export const SQUAD_CEILING = 38;

export const FORMATIONS = {
  '4-3-3': { DF: 4, MF: 3, FW: 3 },
  '4-4-2': { DF: 4, MF: 4, FW: 2 },
  '3-5-2': { DF: 3, MF: 5, FW: 2 },
  '5-3-2': { DF: 5, MF: 3, FW: 2 },
};

// Every formation fields exactly 1 GK + 10 outfield players.
export function formationRequirements(formation) {
  const shape = FORMATIONS[formation];
  if (!shape) throw new Error(`Unknown formation: ${formation}`);
  return { GK: 1, ...shape };
}

// xi: array of player objects (length 11, any order). Returns a 0-100ish
// strength number used directly by the match simulator.
//
// The best-XI's own OVR ceiling is nearly fixed by the data — the strongest
// possible XI pulled from the whole squad+market pool at once averages only
// ~73.5, barely above what the untouched starting squad already fields, so
// individual transfer picks alone can't meaningfully move this number. Real
// squad-building headroom lives in depth: how much of the roster beyond the
// bare-minimum floor you actually invest in. depthBonus is weighted
// accordingly so a genuinely maxed-out, fully-invested squad (near
// SQUAD_CEILING) can meaningfully outweigh a squad that just fields a decent
// XI and stops there — verified against real simulation runs (round17).
export function xiStrength(xi, squadSize) {
  if (!xi || xi.length === 0) return 0;
  const avgOvr = xi.reduce((sum, p) => sum + p.ovr, 0) / xi.length;
  const depthBeyondFloor = Math.max(0, squadSize - SQUAD_FLOOR);
  const depthBonus = Math.min(12, depthBeyondFloor * 0.5);
  return avgOvr + depthBonus;
}

// Greedy best-XI-by-formation: for each pitch slot, prefer the
// highest-OVR unassigned player whose specific role matches the slot,
// falling back to anyone in the slot's broad position if no exact-role
// player remains (a squad rarely has a natural fit for every labelled
// slot). Returns a { [layoutIndex]: playerId } map, same shape XITask
// keeps as its own slot-assignment state.
export function bestXI(squad, formation) {
  const layout = PITCH_LAYOUT[formation];
  if (!layout) throw new Error(`Unknown formation: ${formation}`);

  const used = new Set();
  const slotMap = {};

  // Fill exact role matches first across all slots, then fall back to
  // broad-position matches, so specific roles don't get stolen by a
  // same-position slot processed earlier.
  layout.forEach((slot, i) => {
    const exact = squad
      .filter((p) => p.role === slot.role && !used.has(p.id))
      .sort((a, b) => b.ovr - a.ovr)[0];
    if (exact) {
      slotMap[i] = exact.id;
      used.add(exact.id);
    }
  });

  layout.forEach((slot, i) => {
    if (slotMap[i]) return;
    const fallback = squad
      .filter((p) => p.pos === slot.pos && !used.has(p.id))
      .sort((a, b) => b.ovr - a.ovr)[0];
    if (fallback) {
      slotMap[i] = fallback.id;
      used.add(fallback.id);
    }
  });

  return slotMap;
}
