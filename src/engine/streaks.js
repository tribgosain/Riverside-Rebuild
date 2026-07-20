// Longest win streak and longest winless streak found in a season's match
// list. Shared by the live reveal banner (SeasonSim) and the generated
// results recap (recap.js) so both describe the same real streaks, just
// formatted differently for their context.
export function computeStreaks(boroMatches, boroId) {
  let bestWin = 0;
  let bestWinless = 0;
  let curWin = 0;
  let curWinless = 0;
  for (const m of boroMatches) {
    const isHome = m.homeId === boroId;
    const bg = isHome ? m.homeGoals : m.awayGoals;
    const og = isHome ? m.awayGoals : m.homeGoals;
    if (bg > og) {
      curWin += 1;
      curWinless = 0;
    } else {
      curWinless += 1;
      curWin = 0;
    }
    bestWin = Math.max(bestWin, curWin);
    bestWinless = Math.max(bestWinless, curWinless);
  }
  return { bestWin, bestWinless };
}
