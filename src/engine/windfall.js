// Rare windfall: a Morgan Rogers sell-on clause payout. Rolled once, right
// as a fresh window opens — before the player has sold or signed anyone —
// not mid-action. Round31 follow-up #3: moved off a per-action cumulative
// roll (which could land at any point mid-Sell/Sign) to a single roll at
// window start, matching how this should read as breaking news waiting
// for you at the desk, not something that interrupts you partway through
// business.
//
// Morgan Rogers is real, current fact — not a flavour invention: Boro hold
// a genuine 20% sell-on clause from his January 2024 sale to Aston Villa
// (£15m fee). Villa are fielding real interest, and reporting has since
// firmed up specifically on Chelsea (valuations reported £90-117m).
// Deliberately NOT Hackney: he only just left for Everton this summer, so
// a same-window resale isn't realistic even as a game event.
//
// Sell-on clauses are conventionally a cut of PROFIT, not the full resale
// fee — Boro's 20% applies to what Villa actually made on the deal (resale
// fee minus the £15m they paid Boro), not 20% of the headline fee. That's
// also the correct model for the earlier, separate transaction where Man
// City (who developed Rogers) held their own clause on Boro's original
// profit from selling him to Villa — but that clause was already settled
// back in Jan 2024 and has no bearing on what Boro receive from Villa's
// resale now, so it isn't modelled here. At fee £90-117m: profit £75-102m,
// Boro's 20% cut £15-20.4m, first installment (11-19% of that) ~£1.65-3.9m.
//
// Round31: verified the trigger logic was genuinely wired correctly, then
// re-verified with real loop tests (scripts/round31-rogers-check.mjs) after
// reports it "never fires" — root cause across several follow-ups turned
// out to be probability tuned too low, then a visibility bug (screen-local
// ticker text getting silently overwritten by the next action before a
// real player could register it), not a wiring bug. WINDOW_CHANCE below is
// tuned to land Rogers in ~50% of individual windows.
const WINDOW_CHANCE = 0.5;

export const WINDFALL_EVENT = {
  id: 'morgan_rogers',
  minFee: 90,
  maxFee: 117,
  // The £15m Villa paid Boro for Rogers in Jan 2024 — the cut applies to
  // profit above this, not the full resale fee (see file header).
  originalFee: 15,
  cutPercent: 20,
  // A fee this size is paid in installments over several seasons in
  // reality, not as one lump sum on completion — award only the first
  // tranche, not the full sell-on cut. Randomised within this range
  // (not a fixed fraction) so the installment itself varies a bit run to
  // run — lands roughly £1.65-3.9m across the fee range.
  installmentFractionRange: [0.11, 0.19],
  club: 'Chelsea',
  buildMessage: (fee, fullCut, awarded, club) =>
    `${club} agree £${fee}m fee for Morgan Rogers. Boro's 20% cut: £${fullCut}m — £${awarded}m lands in the budget now.`,
};

function randomInt(min, max) {
  return Math.floor(min + Math.random() * (max - min + 1));
}

// Call once when a fresh window opens (see gameReducer's mkFreshGame).
// Returns null most of the time; returns { message, amount } on the roll
// that hits.
export function rollWindfall() {
  if (Math.random() > WINDOW_CHANCE) return null;

  const event = WINDFALL_EVENT;
  const fee = randomInt(event.minFee, event.maxFee);
  const profit = fee - event.originalFee;
  const fullCut = Math.round(profit * (event.cutPercent / 100) * 10) / 10;
  const [min, max] = event.installmentFractionRange;
  const fraction = min + Math.random() * (max - min);
  const awarded = Math.round(fullCut * fraction * 10) / 10;

  return { message: event.buildMessage(fee, fullCut, awarded, event.club), amount: awarded };
}
