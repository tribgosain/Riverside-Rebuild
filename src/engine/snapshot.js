// One-time, bounded calculation run only when Boro qualify for the
// playoffs — probabilistically attributes the season's already-known Boro
// goal tally across the XI, weighted by position and OVR. This is a single
// function call at the moment of qualification, NOT a running stats system
// tracked throughout the season (see §16 of the brief).

const POSITION_WEIGHT = { FW: 3, MF: 1.5, DF: 0.5, GK: 0.1 };

export function attributeSeasonGoals(xiPlayers, totalGoals) {
  const weights = xiPlayers.map((p) => (POSITION_WEIGHT[p.pos] || 1) * (p.ovr / 70));
  const totalWeight = weights.reduce((a, b) => a + b, 0);

  const tally = xiPlayers.map(() => 0);
  for (let i = 0; i < totalGoals; i += 1) {
    let r = Math.random() * totalWeight;
    let idx = 0;
    for (let j = 0; j < weights.length; j += 1) {
      r -= weights[j];
      if (r <= 0) {
        idx = j;
        break;
      }
    }
    tally[idx] += 1;
  }

  const scored = xiPlayers.map((p, i) => ({ player: p, goals: tally[i] }));
  scored.sort((a, b) => b.goals - a.goals);

  return {
    topScorer: scored[0],
    standoutXI: scored.slice(0, 3),
  };
}
