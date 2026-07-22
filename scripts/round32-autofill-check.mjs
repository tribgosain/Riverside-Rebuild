// Checks what position range a player relying on the in-app "Auto-fill
// needs" button (rather than manually buying every upgrade) can actually
// expect — Auto-fill only fills CRITICAL-priority squad-need roles
// (currently 2: RB, ST), which is a much smaller intervention than either
// round29's "optimal" or "realistic" benchmark squads.
import squad from '../src/data/squad.json' with { type: 'json' };
import market from '../src/data/market.json' with { type: 'json' };
import clubs from '../src/data/clubs.json' with { type: 'json' };
import { xiStrength, bestXI, FORMATIONS } from '../src/engine/strength.js';
import { simulateSeason } from '../src/engine/simulate.js';
import { computeStandings, findPosition } from '../src/engine/table.js';

const BORO_ID = 'boro';
const BACKED = { budget: 14, wageCap: 185 };
const PHIL_HIGH_PRESS = { variance: 8, homeAdvantage: 3 };
const CRITICAL_ROLES = ['RB', 'ST'];

function buildAutoFillOnlySquad(mandate) {
  let currentSquad = [...squad];
  let budget = mandate.budget;
  let wageCap = mandate.wageCap;
  for (const role of CRITICAL_ROLES) {
    const candidate = market
      .filter((p) => p.role === role && p.value <= budget + 1e-9 && p.wage <= wageCap)
      .sort((a, b) => b.ovr - a.ovr)[0];
    if (!candidate) continue;
    currentSquad.push(candidate);
    budget -= candidate.value;
    wageCap -= candidate.wage;
  }
  return currentSquad;
}

function bestFormationXi(sq) {
  let best = null;
  for (const formation of Object.keys(FORMATIONS)) {
    const slotMap = bestXI(sq, formation);
    const ids = Object.values(slotMap);
    const xiPlayers = ids.map((id) => sq.find((p) => p.id === id)).filter(Boolean);
    if (xiPlayers.length < 11) continue;
    const strength = xiStrength(xiPlayers, sq.length);
    if (!best || strength > best.strength) best = { formation, strength };
  }
  return best;
}

function runSeasons(boroStrength, n) {
  const positions = [];
  for (let i = 0; i < n; i += 1) {
    const teams = [...clubs, { id: BORO_ID, name: 'Middlesbrough', strength: boroStrength }];
    const matches = simulateSeason(teams, PHIL_HIGH_PRESS, BORO_ID);
    const standings = computeStandings(teams, matches);
    positions.push(findPosition(standings, BORO_ID));
  }
  return positions;
}

function stats(positions) {
  const n = positions.length;
  const avg = positions.reduce((a, b) => a + b, 0) / n;
  const top5 = positions.filter((p) => p <= 5).length;
  const top6 = positions.filter((p) => p <= 6).length;
  return {
    n,
    avg: avg.toFixed(2),
    min: Math.min(...positions),
    max: Math.max(...positions),
    'top5 (above 6th)': `${top5}/${n} (${((top5 / n) * 100).toFixed(0)}%)`,
    'top6 (playoffs)': `${top6}/${n} (${((top6 / n) * 100).toFixed(0)}%)`,
  };
}

// Baseline: untouched starting squad, no signings at all.
const untouchedXi = bestFormationXi(squad);
console.log('=== Untouched starting squad (no Sell/Sign action at all) ===');
console.log(`Strength: ${untouchedXi.strength.toFixed(2)} (${untouchedXi.formation})`);
console.log(' ', JSON.stringify(stats(runSeasons(untouchedXi.strength, 200))));

// Auto-fill needs only (2 CRITICAL roles: RB, ST) — no other signings, no selling.
const autoFillSquad = buildAutoFillOnlySquad(BACKED);
const autoFillXi = bestFormationXi(autoFillSquad);
console.log('\n=== Auto-fill needs only (Backed mandate, no other signings) ===');
console.log(`Squad size: ${autoFillSquad.length}, strength: ${autoFillXi.strength.toFixed(2)} (${autoFillXi.formation})`);
console.log(' ', JSON.stringify(stats(runSeasons(autoFillXi.strength, 200))));
