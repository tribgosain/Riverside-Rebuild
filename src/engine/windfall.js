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
    // A fee this size is paid in installments over several seasons in
    // reality, not as one lump sum on completion — award only the first
    // tranche, not the full sell-on cut. Randomised within this range
    // (not a fixed fraction) so the installment itself varies a bit
    // run to run — lands roughly £2-5m across the fee range, a genuinely
    // meaningful but not game-swinging top-up.
    installmentFractionRange: [0.11, 0.19],
    clubs: ['Chelsea'],
    buildMessage: (fee, fullCut, awarded, club) =>
      `BREAKING — ${club} agree £${fee}m for Morgan Rogers. Boro's 20% sell-on cut: £${fullCut}m, paid in installments — the first lands now: £${awarded}m into the budget.`,
  },
  {
    id: 'academy_clause',
    weight: 1,
    minFee: 18,
    maxFee: 35,
    cutPercent: 15,
    clubs: ['a Premier League club', 'a side in Serie A'],
    buildMessage: (fee, fullCut, awarded, club) =>
      `Small windfall — an old academy sell-on clause just paid out. £${fee}m fee to ${club}, Boro's cut: £${awarded}m.`,
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
  const fullCut = Math.round(fee * (event.cutPercent / 100) * 10) / 10;
  let awarded = fullCut;
  if (event.installmentFractionRange) {
    const [min, max] = event.installmentFractionRange;
    const fraction = min + Math.random() * (max - min);
    awarded = Math.round(fullCut * fraction * 10) / 10;
  }
  const club = event.clubs[Math.floor(Math.random() * event.clubs.length)];

  return { message: event.buildMessage(fee, fullCut, awarded, club), amount: awarded };
}
