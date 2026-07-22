// Results-screen diagnostic — a genuine, causal read on the season, not a
// stat-comparison sentence. Built from data the engine already produces
// (goals vs league average, streaks, wildcard variance, XI age profile),
// but written as a verdict ("a defence that leaked goals when it mattered
// most") rather than a citation ("shipped 12 more than the league
// average") — round32, per explicit request: this needs to read as
// insight, not a restated box score. Shared by ResultsModal so the
// on-screen recap and the shareable card say the same thing.

// A season-long gap smaller than this (goals, either direction) reads as
// "roughly average" rather than a genuine strength/weakness worth calling out.
const NOTABLE_GOAL_GAP = 6;
// Streak length worth naming specifically. Checked empirically
// (scripts/round31-recap-check.mjs) against real simulated seasons across
// the philosophy variance range: a 46-game season produces a 4+ game
// streak almost every single time (median bestWin ~6, median bestWinless
// ~8), so a low threshold here would fire on essentially every result and
// say nothing. These thresholds land around the top ~20% of seasons —
// genuinely streaky, not "every season has some ups and downs."
const NOTABLE_WIN_STREAK = 10;
const NOTABLE_WINLESS_STREAK = 11;
// Wildcard OVR swing magnitude worth calling out by name.
const NOTABLE_WILDCARD_SWING = 6;
// XI average age worth calling out. Baseline squad's best XI sits ~25-25.7
// regardless of formation (checked empirically) — these thresholds mark a
// genuine deviation from that, not just normal squad-building variance.
const YOUNG_XI_AGE = 23.5;
const EXPERIENCED_XI_AGE = 27.5;

function leagueAvgGoals(standings) {
  const total = standings.reduce((sum, row) => sum + row.gf, 0);
  return total / standings.length;
}

function attackClause(gf, avg) {
  const diff = gf - avg;
  if (diff >= NOTABLE_GOAL_GAP) return { tone: 'strong', text: 'an attack that could trouble anyone in this league' };
  if (diff <= -NOTABLE_GOAL_GAP) return { tone: 'weak', text: 'an attack that never really turned up' };
  return { tone: 'mid', text: 'an attack that did just enough, rarely more' };
}

function defenceClause(ga, avg) {
  const diff = avg - ga; // positive = fewer conceded than average (good)
  if (diff >= NOTABLE_GOAL_GAP) return { tone: 'strong', text: 'a defence that was genuinely hard to break down' };
  if (diff <= -NOTABLE_GOAL_GAP) return { tone: 'weak', text: 'a defence that leaked goals when it mattered most' };
  return { tone: 'mid', text: 'a defence that did just enough, rarely more' };
}

function combineAttackDefence(attack, defence) {
  // Contrast framing when one end was genuinely strong and the other
  // genuinely weak — that tension is the actual story of the season.
  if (attack.tone === 'strong' && defence.tone === 'weak') {
    return `Boro could score with anyone but never learned how to defend a lead — that's what cost the season.`;
  }
  if (defence.tone === 'strong' && attack.tone === 'weak') {
    return `This was a season built on defensive resolve, not goals — the team leaned on it because it had to.`;
  }
  if (attack.tone === 'strong' && defence.tone === 'strong') {
    return `A complete team performance at both ends — genuinely hard to beat, and always a threat.`;
  }
  if (attack.tone === 'weak' && defence.tone === 'weak') {
    return `Leaky at the back and toothless up front — there was no foundation to build a season on.`;
  }
  // At least one side landed near the league average — lead with whichever
  // end actually had something to say.
  if (attack.tone === 'strong') return `The attack carried this team all season.`;
  if (defence.tone === 'strong') return `The defence did the heavy lifting all season.`;
  if (attack.tone === 'weak') return `A season undone by a blunt attack — ${defence.text}, but goals were always the problem.`;
  if (defence.tone === 'weak') return `A season undone by defensive frailty — ${attack.text}, but the goals conceded kept undoing it.`;
  return `A season with no real identity at either end of the pitch.`;
}

// "A" vs "An" for a spoken number — only needs to handle the realistic
// streak-length range (roughly 8-30ish games in a 46-game season), not
// every integer, so this is a small lookup rather than a full
// number-to-words implementation.
function articleFor(n) {
  return [8, 11, 18].includes(n) || (n >= 80 && n <= 89) ? 'An' : 'A';
}

function consistencyClause(streaks) {
  const { bestWin, bestWinless } = streaks;
  if (bestWin >= NOTABLE_WIN_STREAK && bestWinless >= NOTABLE_WINLESS_STREAK) {
    return `Capable of a ${bestWin}-game win streak and ${articleFor(bestWinless).toLowerCase()} ${bestWinless}-game winless run in the same season — brilliant one month, anonymous the next.`;
  }
  if (bestWin >= NOTABLE_WIN_STREAK) {
    return `${articleFor(bestWin)} ${bestWin}-game win streak was doing all the work.`;
  }
  if (bestWinless >= NOTABLE_WINLESS_STREAK) {
    return `${articleFor(bestWinless)} ${bestWinless}-game winless run undid months of good work.`;
  }
  return null;
}

function wildcardClause(wildcardOutcomes) {
  if (!wildcardOutcomes || wildcardOutcomes.length === 0) return null;
  const ranked = [...wildcardOutcomes].sort((a, b) => Math.abs(b.swing) - Math.abs(a.swing));
  const standout = ranked[0];
  if (Math.abs(standout.swing) < NOTABLE_WILDCARD_SWING) return null;
  return standout.swing > 0
    ? `The wildcard gamble came off — ${standout.name} was a genuine difference-maker nobody saw coming.`
    : `The wildcard gamble never came off — ${standout.name} was nowhere near it.`;
}

// The flagship new insight (round32): ties squad age directly to how the
// defence actually performed, rather than reporting either fact in
// isolation — a young back line with a leaky defence has a real, specific
// story ("lacked leadership"); an experienced one that still leaked is a
// different, less flattering story ("should have known better").
function squadProfileClause(xiAvgAge, defenceTone) {
  if (xiAvgAge == null) return null;
  if (xiAvgAge <= YOUNG_XI_AGE) {
    if (defenceTone === 'weak') {
      return `A back line with barely a senior head among them was left exposed all season — the experience just wasn't there when it counted.`;
    }
    if (defenceTone === 'strong') {
      return `A young defence that played with composure well beyond its years.`;
    }
    return null;
  }
  if (xiAvgAge >= EXPERIENCED_XI_AGE) {
    if (defenceTone === 'weak') {
      return `This defence had the experience to know better — age wasn't the excuse here, quality was.`;
    }
    if (defenceTone === 'strong') {
      return `A settled, experienced back line that rarely looked troubled.`;
    }
    return null;
  }
  return null;
}

// season: the object built by SeasonSim's computeSeason (boroRow,
// standings, streaks, wildcardOutcomes, xiAvgAge all present).
export function buildDiagnostic(season) {
  const avg = leagueAvgGoals(season.standings);
  const attack = attackClause(season.boroRow.gf, avg);
  const defence = defenceClause(season.boroRow.ga, avg);

  const sentences = [combineAttackDefence(attack, defence)];

  // Priority order: the age/defence insight is the most specific (two data
  // axes combined into one causal read), then wildcard, then consistency —
  // capped at one secondary sentence so this stays a couple of lines, not
  // a stat dump.
  const squadProfile = squadProfileClause(season.xiAvgAge, defence.tone);
  const wildcard = wildcardClause(season.wildcardOutcomes);
  const consistency = consistencyClause(season.streaks || { bestWin: 0, bestWinless: 0 });
  const second = squadProfile || wildcard || consistency;
  if (second) sentences.push(second);

  return sentences.join(' ');
}
