// Round 29 balance investigation — uses the real engine/data modules
// directly (no browser), so results reflect the actual shipped logic.
import squad from '../src/data/squad.json' with { type: 'json' };
import market from '../src/data/market.json' with { type: 'json' };
import clubs from '../src/data/clubs.json' with { type: 'json' };
import { xiStrength, bestXI, SQUAD_CEILING, FORMATIONS, formationRequirements } from '../src/engine/strength.js';
import { PITCH_LAYOUT } from '../src/engine/pitchLayout.js';
import { simulateSeason, simulateMatch } from '../src/engine/simulate.js';
import { computeStandings, findPosition } from '../src/engine/table.js';
import { computeSquadStats, tagSignTarget, computeBargainThreshold } from '../src/engine/recommendations.js';

const BORO_ID = 'boro';
const BACKED = { budget: 14, wageCap: 185 };
const PHIL_HIGH_PRESS = { variance: 8, homeAdvantage: 3 };

function buildOptimalSquad() {
  // "Buy every affordable upgrade" — same 'upgrade' tag the UI itself
  // uses, signed in descending OVR order until budget/wage/squad cap runs out.
  let currentSquad = [...squad];
  let budget = BACKED.budget;
  let wageCap = BACKED.wageCap;
  const upgrades = market
    .map((p) => {
      const stats = computeSquadStats(currentSquad);
      const tags = tagSignTarget(p, stats, computeBargainThreshold(market));
      return { p, tags };
    })
    .filter((x) => x.tags.includes('upgrade'))
    .map((x) => x.p)
    .sort((a, b) => b.ovr - a.ovr);

  for (const p of upgrades) {
    if (currentSquad.length >= SQUAD_CEILING) break;
    if (p.value > budget || p.wage > wageCap) continue;
    currentSquad.push(p);
    budget -= p.value;
    wageCap -= p.wage;
  }
  return currentSquad;
}

function buildRealisticSquad() {
  // A reasonable, good-faith window: sign the critical-need roles plus a
  // handful of sensible mid-tier ("solid") upgrades — not literally every
  // affordable upgrade, not a min-maxed squad-cap-out.
  let currentSquad = [...squad];
  let budget = BACKED.budget;
  let wageCap = BACKED.wageCap;
  const solidPicks = market
    .filter((p) => p.tier === 'solid' || p.tier === 'star')
    .sort((a, b) => b.ovr - a.ovr)
    .slice(0, 8); // a plausible number of signings for one window, not all 46

  for (const p of solidPicks) {
    if (currentSquad.length >= SQUAD_CEILING) break;
    if (p.value > budget || p.wage > wageCap) continue;
    currentSquad.push(p);
    budget -= p.value;
    wageCap -= p.wage;
  }
  return currentSquad;
}

function bestFormationXi(sq) {
  let best = null;
  for (const formation of Object.keys(FORMATIONS)) {
    const slotMap = bestXI(sq, formation);
    const ids = Object.values(slotMap);
    const xiPlayers = ids.map((id) => sq.find((p) => p.id === id)).filter(Boolean);
    if (xiPlayers.length < 11) continue; // squad can't fill this formation's roles
    const strength = xiStrength(xiPlayers, sq.length);
    if (!best || strength > best.strength) best = { formation, strength, xiPlayers, slotMap };
  }
  return best;
}

function runSeasons(boroStrength, n, philosophy = PHIL_HIGH_PRESS) {
  const positions = [];
  for (let i = 0; i < n; i += 1) {
    const teams = [...clubs, { id: BORO_ID, name: 'Middlesbrough', strength: boroStrength }];
    const matches = simulateSeason(teams, philosophy, BORO_ID);
    const standings = computeStandings(teams, matches);
    positions.push(findPosition(standings, BORO_ID));
  }
  return positions;
}

function stats(positions) {
  const avg = positions.reduce((a, b) => a + b, 0) / positions.length;
  const playoffs = positions.filter((p) => p >= 3 && p <= 6).length;
  return {
    n: positions.length,
    avg: avg.toFixed(2),
    min: Math.min(...positions),
    max: Math.max(...positions),
    playoffRate: `${playoffs}/${positions.length} (${((playoffs / positions.length) * 100).toFixed(0)}%)`,
    positions: [...positions].sort((a, b) => a - b),
  };
}

console.log('=== 1. Opponent CLUBS tier audit ===');
const optimalSquad = buildOptimalSquad();
const optimalXi = bestFormationXi(optimalSquad);
console.log(`Optimal squad size: ${optimalSquad.length}/${SQUAD_CEILING}`);
console.log(`Optimal best-XI strength (maxed-out ceiling): ${optimalXi.strength.toFixed(2)} (formation ${optimalXi.formation})`);
const sortedClubs = [...clubs].sort((a, b) => b.strength - a.strength);
const aboveCeiling = sortedClubs.filter((c) => c.strength >= optimalXi.strength);
console.log(`Opponents at/above maxed-out Boro ceiling (${optimalXi.strength.toFixed(1)}): ${aboveCeiling.length}/23`);
console.log(aboveCeiling.map((c) => `${c.name} (${c.strength})`).join(', '));
console.log('Full sorted club strengths:', sortedClubs.map((c) => `${c.short}:${c.strength}`).join(' '));

const realisticSquad = buildRealisticSquad();
const realisticXi = bestFormationXi(realisticSquad);
console.log(`\nRealistic (good-faith) squad size: ${realisticSquad.length}/${SQUAD_CEILING}`);
console.log(`Realistic best-XI strength: ${realisticXi.strength.toFixed(2)} (formation ${realisticXi.formation})`);
const aboveRealistic = sortedClubs.filter((c) => c.strength >= realisticXi.strength);
console.log(`Opponents at/above realistic Boro strength: ${aboveRealistic.length}/23 — i.e. Boro ranks ~${aboveRealistic.length + 1}th of 24 by raw strength alone`);

console.log('\n=== 2. Strength-to-xG slope check ===');
// Empirically measure P(stronger team wins) at a few realistic strength gaps.
function winRateAtGap(gap, trials = 20000) {
  let strongerWins = 0;
  let draws = 0;
  for (let i = 0; i < trials; i += 1) {
    const { homeGoals, awayGoals } = simulateMatch(
      { home: 78 + gap, away: 78 },
      { variance: 8, homeAdvantage: 0 } // neutral, isolate the strength effect
    );
    if (homeGoals > awayGoals) strongerWins += 1;
    else if (homeGoals === awayGoals) draws += 1;
  }
  return { winPct: ((strongerWins / trials) * 100).toFixed(1), drawPct: ((draws / trials) * 100).toFixed(1) };
}
for (const gap of [4, 8, 12, 20]) {
  const r = winRateAtGap(gap);
  console.log(`Strength gap +${gap}: stronger team wins ${r.winPct}% of the time (draw ${r.drawPct}%)`);
}

console.log('\n=== 3. Formation/XI selection bug re-check ===');
for (const formation of Object.keys(FORMATIONS)) {
  const req = formationRequirements(formation);
  const layout = PITCH_LAYOUT[formation];
  const counts = {};
  layout.forEach((slot) => { counts[slot.pos] = (counts[slot.pos] || 0) + 1; });
  const layoutTotal = layout.length;
  const mismatch = Object.entries(req).some(([pos, n]) => counts[pos] !== n);
  console.log(`${formation}: required=${JSON.stringify(req)} layoutCounts=${JSON.stringify(counts)} totalSlots=${layoutTotal} (expect 11) mismatch=${mismatch}`);
}
// Confirm optimal XI strength doesn't silently drop below simple avg-OVR-of-best-11.
const naiveTop11 = [...optimalSquad].sort((a, b) => b.ovr - a.ovr).slice(0, 11);
const naiveAvg = naiveTop11.reduce((s, p) => s + p.ovr, 0) / 11;
console.log(`Naive top-11-by-OVR average (ignoring formation/role constraints): ${naiveAvg.toFixed(2)}`);
console.log(`bestXI()-selected XI average OVR: ${(optimalXi.xiPlayers.reduce((s, p) => s + p.ovr, 0) / 11).toFixed(2)}`);
console.log(`Gap (naive - actual, should be small if formation logic isn't losing strength): ${(naiveAvg - optimalXi.xiPlayers.reduce((s, p) => s + p.ovr, 0) / 11).toFixed(2)}`);

console.log('\n=== 4a. Round22 reproduction — optimal play, 25 runs ===');
const optimalResults = stats(runSeasons(optimalXi.strength, 25));
console.log(optimalResults);

console.log('\n=== 4b. Realistic manual-style play, 25 runs ===');
const realisticResults = stats(runSeasons(realisticXi.strength, 25));
console.log(realisticResults);

console.log('\n=== 6. Genuinely gutted-squad check (grade-band calibration sanity) ===');
// Sell down toward the squad floor, keeping only enough to field a legal
// XI, no replacements — round23's original "deliberately gutted" scenario.
function buildGuttedSquad() {
  const sorted = [...squad].sort((a, b) => a.ovr - b.ovr); // worst first, keep worst
  const keep = sorted.slice(0, 16); // SQUAD_FLOOR
  return keep;
}
const gutted = buildGuttedSquad();
const guttedXi = bestFormationXi(gutted);
console.log(`Gutted squad size: ${gutted.length}, XI strength: ${guttedXi ? guttedXi.strength.toFixed(2) : 'N/A (cannot fill a formation)'}`);
if (guttedXi) {
  const guttedResults = stats(runSeasons(guttedXi.strength, 25));
  console.log('Gutted squad 25-run results:', guttedResults);
}
