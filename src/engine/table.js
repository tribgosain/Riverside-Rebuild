// Standard points/GD/GF standings computation from a list of match results.

export function computeStandings(teams, matches) {
  const table = Object.fromEntries(
    teams.map((t) => [
      t.id,
      { id: t.id, name: t.name, short: t.short, played: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
    ])
  );

  for (const m of matches) {
    const home = table[m.homeId];
    const away = table[m.awayId];
    if (!home || !away) continue;

    home.played += 1;
    away.played += 1;
    home.gf += m.homeGoals;
    home.ga += m.awayGoals;
    away.gf += m.awayGoals;
    away.ga += m.homeGoals;

    if (m.homeGoals > m.awayGoals) {
      home.w += 1;
      home.pts += 3;
      away.l += 1;
    } else if (m.awayGoals > m.homeGoals) {
      away.w += 1;
      away.pts += 3;
      home.l += 1;
    } else {
      home.d += 1;
      away.d += 1;
      home.pts += 1;
      away.pts += 1;
    }
  }

  const standings = Object.values(table).map((t) => ({ ...t, gd: t.gf - t.ga }));

  standings.sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf || a.name.localeCompare(b.name));

  return standings.map((row, i) => ({ ...row, position: i + 1 }));
}

export function findPosition(standings, teamId) {
  const row = standings.find((r) => r.id === teamId);
  return row ? row.position : null;
}
