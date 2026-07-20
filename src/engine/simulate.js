// Match & season simulation. Poisson-distributed goals per side, home
// advantage constant, per-match strength variance so results aren't
// deterministic run to run. Goals capped at 8/side to keep scorelines
// plausible. Pure functions — no DOM, no timers, safe to run synchronously
// before any reveal animation starts (see §12 of the brief).

const BASE_GOALS = 1.35;
const GOAL_CAP = 8;
// Goals-per-strength-point slope. Round29 balance investigation found this
// too flat relative to per-match variance to reward a well-built squad
// over a full season — /12 only separated a genuinely strong team from a
// mid-table one by a modest win-rate margin. /9 makes real strength gaps
// count for more without eliminating variance (still well short of
// deterministic).
const STRENGTH_SLOPE = 9;

// Knuth's algorithm — fine at these small lambdas, no need for anything fancier.
function poissonSample(lambda) {
  const L = Math.exp(-lambda);
  let k = 0;
  let p = 1;
  do {
    k += 1;
    p *= Math.random();
  } while (p > L);
  return k - 1;
}

function noise(range) {
  return (Math.random() * 2 - 1) * range;
}

// strengths: { home: number, away: number }
// opts: { variance, varianceAway, homeAdvantage, neutralVenue }
export function simulateMatch(strengths, opts = {}) {
  const { variance = 5, varianceAway, homeAdvantage = 3, neutralVenue = false } = opts;
  const awayVariance = varianceAway ?? variance;

  const homeEff = strengths.home + (neutralVenue ? 0 : homeAdvantage) + noise(variance);
  const awayEff = strengths.away + noise(awayVariance);
  const diff = homeEff - awayEff;

  const homeLambda = Math.max(0.15, BASE_GOALS + diff / STRENGTH_SLOPE);
  const awayLambda = Math.max(0.15, BASE_GOALS - diff / STRENGTH_SLOPE);

  const homeGoals = Math.min(GOAL_CAP, poissonSample(homeLambda));
  const awayGoals = Math.min(GOAL_CAP, poissonSample(awayLambda));

  return { homeGoals, awayGoals };
}

// Builds the full 24-team fixture list: every ordered pair plays once,
// which is equivalent to every pair playing home and away (double
// round-robin). teams: array of { id, name, strength }, one of which must
// be the Boro entry.
export function buildFixtures(teams) {
  const fixtures = [];
  for (const home of teams) {
    for (const away of teams) {
      if (home.id === away.id) continue;
      fixtures.push({ homeId: home.id, awayId: away.id });
    }
  }
  return fixtures;
}

// Runs the entire season synchronously and returns every match result.
// teams: array of { id, name, strength }. philosophy: entry from
// data/copy.js PHILOSOPHIES (variance/homeAdvantage/varianceAway).
export function simulateSeason(teams, philosophy, boroId = 'boro') {
  const byId = Object.fromEntries(teams.map((t) => [t.id, t]));
  const fixtures = buildFixtures(teams);

  return fixtures.map((fx) => {
    const home = byId[fx.homeId];
    const away = byId[fx.awayId];
    const isBoroAway = fx.awayId === boroId;
    const varianceAway =
      isBoroAway && philosophy.varianceAway !== undefined ? philosophy.varianceAway : undefined;

    const { homeGoals, awayGoals } = simulateMatch(
      { home: home.strength, away: away.strength },
      {
        variance: philosophy.variance,
        varianceAway,
        homeAdvantage: philosophy.homeAdvantage,
      }
    );

    return { homeId: fx.homeId, awayId: fx.awayId, homeGoals, awayGoals };
  });
}

// Two-legged tie, aggregate score, away-goals not used (matches the real
// EFL playoff rule since 2021). Extra time/penalties abstracted to a single
// weighted coin-flip using the same strength calc as regular matches.
export function simulateTwoLeggedTie(teamA, teamB, philosophy) {
  const leg1 = simulateMatch(
    { home: teamA.strength, away: teamB.strength },
    { variance: philosophy.variance, homeAdvantage: philosophy.homeAdvantage }
  );
  const leg2 = simulateMatch(
    { home: teamB.strength, away: teamA.strength },
    { variance: philosophy.variance, homeAdvantage: philosophy.homeAdvantage }
  );

  const aggA = leg1.homeGoals + leg2.awayGoals;
  const aggB = leg1.awayGoals + leg2.homeGoals;

  let winnerId;
  let wentToPenalties = false;
  if (aggA > aggB) winnerId = teamA.id;
  else if (aggB > aggA) winnerId = teamB.id;
  else {
    wentToPenalties = true;
    // Weighted coin-flip off relative strength, not a "detail" anyone needs.
    const total = teamA.strength + teamB.strength;
    winnerId = Math.random() * total < teamA.strength ? teamA.id : teamB.id;
  }

  return { leg1, leg2, aggA, aggB, winnerId, wentToPenalties };
}

// Single match at a neutral venue — no home advantage.
export function simulateFinal(teamA, teamB, philosophy) {
  const result = simulateMatch(
    { home: teamA.strength, away: teamB.strength },
    { variance: philosophy.variance, homeAdvantage: 0, neutralVenue: true }
  );
  let winnerId;
  if (result.homeGoals > result.awayGoals) winnerId = teamA.id;
  else if (result.awayGoals > result.homeGoals) winnerId = teamB.id;
  else {
    const total = teamA.strength + teamB.strength;
    winnerId = Math.random() * total < teamA.strength ? teamA.id : teamB.id;
  }
  return { result, winnerId };
}
