// Round 31 item 2 — sanity check buildDiagnostic() across many simulated
// seasons, using the real engine/data modules directly.
import squad from '../src/data/squad.json' with { type: 'json' };
import clubs from '../src/data/clubs.json' with { type: 'json' };
import { xiStrengthDetailed } from '../src/engine/strength.js';
import { simulateSeason } from '../src/engine/simulate.js';
import { computeStandings, findPosition } from '../src/engine/table.js';
import { computeStreaks } from '../src/engine/streaks.js';
import { gradeForPosition } from '../src/engine/grade.js';
import { buildDiagnostic } from '../src/engine/recap.js';

const BORO_ID = 'boro';
const PHIL = { variance: 8, homeAdvantage: 3 };

function runOne() {
  const xiPlayers = squad.slice(0, 11); // arbitrary XI for sampling text variety
  const { strength: boroStrength, wildcards } = xiStrengthDetailed(xiPlayers, squad.length);
  const teams = [...clubs, { id: BORO_ID, name: 'Middlesbrough', short: 'BOR', strength: boroStrength }];
  const matches = simulateSeason(teams, PHIL, BORO_ID);
  const standings = computeStandings(teams, matches);
  const boroRow = standings.find((r) => r.id === BORO_ID);
  const position = findPosition(standings, BORO_ID);
  const boroMatches = matches.filter((m) => m.homeId === BORO_ID || m.awayId === BORO_ID);
  const streaks = computeStreaks(boroMatches, BORO_ID);

  const season = {
    standings,
    boroRow,
    boroPosition: position,
    grade: gradeForPosition(position),
    streaks,
    wildcardOutcomes: wildcards,
  };

  return { season, text: buildDiagnostic(season) };
}

console.log('=== 10 sample diagnostics across varied simulated seasons ===\n');
for (let i = 0; i < 10; i++) {
  const { season, text } = runOne();
  console.log(
    `[pos ${season.boroPosition}, grade ${season.grade}, GF ${season.boroRow.gf}/GA ${season.boroRow.ga}, ` +
      `bestWin ${season.streaks.bestWin}/bestWinless ${season.streaks.bestWinless}]`
  );
  console.log(text);
  console.log();
}
