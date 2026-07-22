// Investigating a player report: "tried many different approaches, never
// finished above 6th — is top-6 even possible?" Uses the real engine/data
// modules directly (no browser), same methodology as round29's balance
// check but across all 3 mandates and a larger sample size, since the
// question is specifically about the achievable position ceiling.
import squad from '../src/data/squad.json' with { type: 'json' };
import market from '../src/data/market.json' with { type: 'json' };
import clubs from '../src/data/clubs.json' with { type: 'json' };
import { xiStrength, bestXI, SQUAD_CEILING, FORMATIONS } from '../src/engine/strength.js';
import { simulateSeason } from '../src/engine/simulate.js';
import { computeStandings, findPosition } from '../src/engine/table.js';
import { computeSquadStats, tagSignTarget, computeBargainThreshold } from '../src/engine/recommendations.js';

const BORO_ID = 'boro';
const MANDATES = {
  backed: { budget: 14, wageCap: 185 },
  sensible: { budget: 8.5, wageCap: 150 },
  scr_watch: { budget: 3.5, wageCap: 120 },
};
const PHIL_HIGH_PRESS = { variance: 8, homeAdvantage: 3 };
const PHIL_CONTROL = { variance: 3, homeAdvantage: 3 };

function buildOptimalSquad(mandate) {
  let currentSquad = [...squad];
  let budget = mandate.budget;
  let wageCap = mandate.wageCap;
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

function bestFormationXi(sq) {
  let best = null;
  for (const formation of Object.keys(FORMATIONS)) {
    const slotMap = bestXI(sq, formation);
    const ids = Object.values(slotMap);
    const xiPlayers = ids.map((id) => sq.find((p) => p.id === id)).filter(Boolean);
    if (xiPlayers.length < 11) continue;
    const strength = xiStrength(xiPlayers, sq.length);
    if (!best || strength > best.strength) best = { formation, strength, xiPlayers, slotMap };
  }
  return best;
}

function runSeasons(boroStrength, n, philosophy) {
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
  const top2 = positions.filter((p) => p <= 2).length;
  const top5 = positions.filter((p) => p <= 5).length;
  const top6 = positions.filter((p) => p <= 6).length;
  const n = positions.length;
  return {
    n,
    avg: avg.toFixed(2),
    min: Math.min(...positions),
    max: Math.max(...positions),
    'top2 (promotion)': `${top2}/${n} (${((top2 / n) * 100).toFixed(0)}%)`,
    'top5 (above 6th)': `${top5}/${n} (${((top5 / n) * 100).toFixed(0)}%)`,
    'top6 (playoffs)': `${top6}/${n} (${((top6 / n) * 100).toFixed(0)}%)`,
  };
}

const N = 200;
const sortedClubs = [...clubs].sort((a, b) => b.strength - a.strength);

for (const [mandateKey, mandate] of Object.entries(MANDATES)) {
  const optimalSquad = buildOptimalSquad(mandate);
  const optimalXi = bestFormationXi(optimalSquad);
  const strength = optimalXi.strength;
  const aboveCeiling = sortedClubs.filter((c) => c.strength >= strength);

  console.log(`\n=== Mandate: ${mandateKey} (£${mandate.budget}m budget) — optimal squad-build ===`);
  console.log(`Squad size: ${optimalSquad.length}/${SQUAD_CEILING}, best-XI strength: ${strength.toFixed(2)} (${optimalXi.formation})`);
  console.log(`Opponents at/above this ceiling: ${aboveCeiling.length}/23 (${aboveCeiling.map((c) => c.short).join(', ')})`);

  for (const [philName, phil] of [['High Press (var 8)', PHIL_HIGH_PRESS], ['Control Possession (var 3)', PHIL_CONTROL]]) {
    const positions = runSeasons(strength, N, phil);
    console.log(`  -- ${philName}, ${N} simulated seasons --`);
    console.log('  ', JSON.stringify(stats(positions)));
  }
}
