// Round31: genuine diagnostic explanation for the results screen — built
// from data the engine already produces (goals vs league average, streaks,
// wildcard variance), not just a restated position/grade. Shared by
// ResultsModal so the on-screen recap and the shareable card say the same
// thing. Referenced from engine/streaks.js's original comment, which
// pointed at this file before it existed.

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

function leagueAvgGoals(standings) {
  const total = standings.reduce((sum, row) => sum + row.gf, 0);
  return total / standings.length;
}

function attackClause(gf, avg) {
  const diff = gf - avg;
  if (diff >= NOTABLE_GOAL_GAP) return { tone: 'strong', text: `an attack that outscored the league average by ${Math.round(diff)}` };
  if (diff <= -NOTABLE_GOAL_GAP) return { tone: 'weak', text: `an attack that managed ${Math.round(Math.abs(diff))} fewer goals than the league average` };
  return { tone: 'mid', text: 'an attack that landed right around the league average' };
}

function defenceClause(ga, avg) {
  const diff = avg - ga; // positive = fewer conceded than average (good)
  if (diff >= NOTABLE_GOAL_GAP) return { tone: 'strong', text: `a defence that shipped ${Math.round(diff)} fewer than the league average` };
  if (diff <= -NOTABLE_GOAL_GAP) return { tone: 'weak', text: `a defence that leaked ${Math.round(Math.abs(diff))} more than the league average` };
  return { tone: 'mid', text: 'a defence that conceded right around the league average' };
}

function combineAttackDefence(attack, defence) {
  // Contrast framing when one end was genuinely strong and the other
  // genuinely weak — that tension is the actual story of the season.
  if (attack.tone === 'strong' && defence.tone === 'weak') {
    return `Boro's season came down to ${attack.text}, undone by ${defence.text}.`;
  }
  if (defence.tone === 'strong' && attack.tone === 'weak') {
    return `Boro leaned on ${defence.text}, but ${attack.text}.`;
  }
  if (attack.tone === 'strong' && defence.tone === 'strong') {
    return `A complete season: ${attack.text}, and ${defence.text}.`;
  }
  if (attack.tone === 'weak' && defence.tone === 'weak') {
    return `Boro struggled at both ends — ${attack.text}, and ${defence.text}.`;
  }
  // At least one side landed near the league average — lead with whichever
  // end actually had something to say.
  if (attack.tone !== 'mid') return `Boro's campaign was defined by ${attack.text}, with ${defence.text}.`;
  if (defence.tone !== 'mid') return `Boro's campaign was defined by ${defence.text}, with ${attack.text}.`;
  return `A quiet season at both ends — ${attack.text}, and ${defence.text}.`;
}

function consistencyClause(streaks) {
  const { bestWin, bestWinless } = streaks;
  if (bestWin >= NOTABLE_WIN_STREAK && bestWinless >= NOTABLE_WINLESS_STREAK) {
    return `A genuinely streaky season — a ${bestWin}-game win run followed by ${bestWinless} without a win.`;
  }
  if (bestWin >= NOTABLE_WIN_STREAK) {
    return `A ${bestWin}-game win streak did the heavy lifting.`;
  }
  if (bestWinless >= NOTABLE_WINLESS_STREAK) {
    return `A ${bestWinless}-game winless run was the low point.`;
  }
  return null;
}

function wildcardClause(wildcardOutcomes) {
  if (!wildcardOutcomes || wildcardOutcomes.length === 0) return null;
  const ranked = [...wildcardOutcomes].sort((a, b) => Math.abs(b.swing) - Math.abs(a.swing));
  const standout = ranked[0];
  if (Math.abs(standout.swing) < NOTABLE_WILDCARD_SWING) return null;
  return standout.swing > 0
    ? `The wildcard bet paid off — ${standout.name} played well above their ${standout.baseOvr} rating all season.`
    : `The wildcard didn't come off — ${standout.name} never got close to their ${standout.baseOvr} rating.`;
}

// season: the object built by SeasonSim's computeSeason (boroRow, standings,
// streaks, wildcardOutcomes all present).
export function buildDiagnostic(season) {
  const avg = leagueAvgGoals(season.standings);
  const attack = attackClause(season.boroRow.gf, avg);
  const defence = defenceClause(season.boroRow.ga, avg);

  const sentences = [combineAttackDefence(attack, defence)];

  const consistency = consistencyClause(season.streaks || { bestWin: 0, bestWinless: 0 });
  const wildcard = wildcardClause(season.wildcardOutcomes);
  // Cap at 2-3 factors total (attack+defence already counts as one combined
  // factor) so this stays a couple of sentences, not a stat dump.
  const second = wildcard || consistency;
  if (second) sentences.push(second);

  return sentences.join(' ');
}
