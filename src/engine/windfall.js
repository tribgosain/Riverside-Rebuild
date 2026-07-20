// Rare mid-window surprise: a sell-on clause windfall. Rolled after each
// sell/sign action (small per-action chance) so it can land at any random
// point during the Sell/Sign phase, fires at most once per window.
//
// Morgan Rogers is real, current fact — not a flavour invention: Boro hold
// a genuine 20% sell-on clause from his January 2024 sale to Aston Villa
// (£15m fee). Villa are fielding real interest, and reporting has since
// firmed up specifically on Chelsea (valuations reported £90-130m) — if
// that sale happens, Boro's cut lands roughly £18-26m. Deliberately NOT
// Hackney: he only just left for Everton this summer, so a same-window
// resale isn't realistic even as a game event.

const PER_ACTION_CHANCE = 0.01; // ~8-15% cumulative across a typical window's sell/sign actions

export const WINDFALL_EVENTS = [
  {
    id: 'morgan_rogers',
    weight: 4,
    minFee: 90,
    maxFee: 130,
    cutPercent: 20,
    clubs: ['Chelsea'],
    buildMessage: (fee, cut, club) =>
      `BREAKING — ${club} agree £${fee}m for Morgan Rogers. Boro's 20% sell-on cut: £${cut}m, straight into the budget.`,
  },
  {
    id: 'academy_clause',
    weight: 1,
    minFee: 18,
    maxFee: 35,
    cutPercent: 15,
    clubs: ['a Premier League club', 'a side in Serie A'],
    buildMessage: (fee, cut, club) =>
      `Small windfall — an old academy sell-on clause just paid out. £${fee}m fee to ${club}, Boro's cut: £${cut}m.`,
  },
];

function pickWeighted(events) {
  const total = events.reduce((s, e) => s + e.weight, 0);
  let r = Math.random() * total;
  for (const e of events) {
    r -= e.weight;
    if (r <= 0) return e;
  }
  return events[events.length - 1];
}

function randomInt(min, max) {
  return Math.floor(min + Math.random() * (max - min + 1));
}

// Call after a sell/sign action completes. Returns null most of the time;
// returns { message, amount } on the rare roll that hits.
export function rollWindfall(state) {
  if (state.windfallFired) return null;
  if (Math.random() > PER_ACTION_CHANCE) return null;

  const event = pickWeighted(WINDFALL_EVENTS);
  const fee = randomInt(event.minFee, event.maxFee);
  const cut = Math.round(fee * (event.cutPercent / 100) * 10) / 10;
  const club = event.clubs[Math.floor(Math.random() * event.clubs.length)];

  return { message: event.buildMessage(fee, cut, club), amount: cut };
}
