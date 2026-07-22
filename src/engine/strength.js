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

// Round30: WILDCARD-tagged players (market.json's genuine unknowns — raw
// foreign prospects, smokescreen-or-real rumours) previously carried the
// tag purely as UI flavour (a chip + a ticker line) with zero mechanical
// effect — they contributed the exact same fixed OVR as any other
// signing every single time, which isn't what "wildcard" is supposed to
// mean. This applies a real per-simulation swing instead: a wildcard's
// effective contribution is randomised within +/-WILDCARD_VARIANCE OVR
// points, re-rolled fresh each time xiStrength is actually called (i.e.
// each time a season or playoff round is simulated — see SeasonSim.jsx/
// PlayoffTask.jsx), so the same wildcard signing can bust well below a
// normal squad player or boom into genuine star territory depending on
// the run. Deliberately not touching bestXI()'s selection order (still
// sorts by raw ovr) — you pick a wildcard on its known ceiling/reputation
// same as real recruitment, and only find out how it actually turned out
// once the season plays.
const WILDCARD_VARIANCE = 12;

function effectiveOvr(player) {
  if (!player.wildcard) return { value: player.ovr, swing: 0 };
  const swing = (Math.random() * 2 - 1) * WILDCARD_VARIANCE;
  return { value: Math.max(30, player.ovr + swing), swing };
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
// Round31: split out from xiStrength so the results recap can report which
// wildcard signings boomed or busted using the *actual* roll that decided
// this season's simulation, rather than sampling a fresh independent swing
// that wouldn't match what really happened in the sim.
export function xiStrengthDetailed(xi, squadSize) {
  if (!xi || xi.length === 0) return { strength: 0, wildcards: [] };
  const wildcards = [];
  let sum = 0;
  for (const p of xi) {
    const { value, swing } = effectiveOvr(p);
    sum += value;
    if (p.wildcard) {
      wildcards.push({
        id: p.id,
        name: p.name,
        baseOvr: p.ovr,
        effectiveOvr: Math.round(value * 10) / 10,
        swing: Math.round(swing * 10) / 10,
      });
    }
  }
  const avgOvr = sum / xi.length;
  const depthBeyondFloor = Math.max(0, squadSize - SQUAD_FLOOR);
  const depthBonus = Math.min(12, depthBeyondFloor * 0.5);
  return { strength: avgOvr + depthBonus, wildcards };
}

export function xiStrength(xi, squadSize) {
  return xiStrengthDetailed(xi, squadSize).strength;
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
