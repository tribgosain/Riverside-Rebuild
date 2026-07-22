// Rare mid-window surprise: a sell-on clause windfall. Rolled after each
// sell/sign action (small per-action chance) so it can land at any random
// point during the Sell/Sign phase, fires at most once per window.
//
// Morgan Rogers is real, current fact — not a flavour invention: Boro hold
// a genuine 20% sell-on clause from his January 2024 sale to Aston Villa
// (£15m fee). Villa are fielding real interest, and reporting has since
// firmed up specifically on Chelsea (valuations reported £90-117m). Deliberately
// NOT Hackney: he only just left for Everton this summer, so a same-window
// resale isn't realistic even as a game event.
//
// Sell-on clauses are conventionally a cut of PROFIT, not the full resale
// fee — Boro's 20% applies to what Villa actually made on the deal (resale
// fee minus the £15m they paid Boro), not 20% of the headline fee. That's
// also the correct model for the earlier, separate transaction where Man
// City (who developed Rogers) held their own clause on Boro's original
// profit from selling him to Villa — but that clause was already settled
// back in Jan 2024 and has no bearing on what Boro receive from Villa's
// resale now, so it isn't modelled here. At fee £90-117m: profit £75-102m,
// Boro's 20% cut £15-20.4m, first installment (11-19% of that) ~£1.65-3.9m
// — lands around £3m at the upper end of the range.

// Round30: verified the trigger logic was genuinely wired correctly
// (rollWindfall() is called from both Sell and Sign, on every sell/trim/
// sign/auto-fill action, and WINDFALL_EVENT correctly credits the budget
// and sets windfallFired) — the "hasn't been seen firing" reports weren't
// a wiring bug. But empirical simulation at 0.01 confirmed the concern
// anyway: at a realistic ~15 actions per window, Morgan Rogers
// specifically only fired ~11% of the time, meaning fewer than half of
// players trying 5 separate playthroughs would ever see it. Raised to
// 0.02, believed at the time to give ~20% per playthrough.
//
// Round31: re-verified with an actual 1,000-window loop test
// (scripts/round31-rogers-check.mjs) rather than trusting the round30
// comment. The wiring/trigger logic itself is confirmed correct — 0.02
// empirically produced Rogers in ~23% of windows and ~69% of 5-try
// sequences, matching round30's math. So players reporting zero sightings
// across several playthroughs were NOT hitting a bug — 0.02 was just
// genuinely too low for a player to expect to see it within a handful of
// tries. Raised to 0.035 (~35% per window), then confirmed working with a
// real unforced fire on the live production site.
//
// Round31 follow-up: explicit request to make it a coin-flip per playthrough
// rather than a rare bonus — raised again so Rogers specifically lands in
// ~50% of individual windows (see scripts/round31-rogers-check.mjs for the
// math/verification approach).
const PER_ACTION_CHANCE = 0.062; // ~50% cumulative across a typical window's sell/sign actions

export const WINDFALL_EVENTS = [
  {
    id: 'morgan_rogers',
    weight: 4,
    minFee: 90,
    maxFee: 117,
    // The £15m Villa paid Boro for Rogers in Jan 2024 — the cut applies to
    // profit above this, not the full resale fee (see file header).
    originalFee: 15,
    cutPercent: 20,
    // A fee this size is paid in installments over several seasons in
    // reality, not as one lump sum on completion — award only the first
    // tranche, not the full sell-on cut. Randomised within this range
    // (not a fixed fraction) so the installment itself varies a bit
    // run to run — lands roughly £1.65-3.9m across the fee range, a
    // genuinely meaningful but not game-swinging top-up.
    installmentFractionRange: [0.11, 0.19],
    clubs: ['Chelsea'],
    buildMessage: (fee, fullCut, awarded, club, profit) =>
      `BREAKING — ${club} agree £${fee}m for Morgan Rogers — Villa's profit on the £15m they paid Boro: £${profit}m. Boro's 20% cut: £${fullCut}m, paid in installments — the first lands now: £${awarded}m into the budget.`,
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
  // Sell-on clauses apply to profit above whatever was originally paid, not
  // the full fee — originalFee is 0 for events with no prior sale to net
  // against (e.g. academy_clause), so this collapses to the old flat-fee
  // behaviour for those.
  const profit = fee - (event.originalFee || 0);
  const fullCut = Math.round(profit * (event.cutPercent / 100) * 10) / 10;
  let awarded = fullCut;
  if (event.installmentFractionRange) {
    const [min, max] = event.installmentFractionRange;
    const fraction = min + Math.random() * (max - min);
    awarded = Math.round(fullCut * fraction * 10) / 10;
  }
  const club = event.clubs[Math.floor(Math.random() * event.clubs.length)];

  return { message: event.buildMessage(fee, fullCut, awarded, club, profit), amount: awarded };
}
