# Riverside Rebuild — Round 29: Auto-Advance, Real Balance Investigation, Rogers Installments

Paste into Claude Code.

## 1. Auto-advance to Results after the reveal finishes

Currently requires a manual "skip ahead to results" click even after the
reveal animation naturally completes. Fix: once the reveal finishes
playing through on its own, advance to Results automatically, no click
required. Keep a skip button available for people who want to jump ahead
*before* it finishes — that's still useful — but completion itself should
just proceed, not wait on an extra click.

## 2. Real engine balance investigation — round22's test wasn't the full picture

Round22's 25-run test used a specific optimal-play scenario (buy every
affordable upgrade, auto-picked XI) and found even that only reaches the
playoffs 28% of the time (7/25, average position 7.28). Real user
experience across several genuine manual playthroughs has been
consistently 10th or worse, never once cracking the top half of that
range. Given the established narrative — this club made an actual
playoff final last season — both of these numbers are worth treating as
a real balance problem, not reassured away with "that's just variance."

**Investigate all of the following, and report findings honestly for each
rather than assuming which one is the cause:**

- **Audit the opponent `CLUBS` tier values against Boro's realistic
  best-XI ceiling.** If a large number of the 23 opponents are rated at
  or above the strongest realistic Boro XI, top-6 finishes are
  structurally rare by construction, regardless of how well the player
  builds their squad. Report how many opponents currently sit above what
  a maxed-out Boro XI can realistically reach, and consider whether the
  opponent tier list needs rebalancing downward, or Boro's baseline needs
  raising, given the real-world context of a team that just reached a
  playoff final.
- **Check the strength-to-expected-goals slope in `simulateMatch`.** If
  this is too flat relative to the per-match variance, strength
  differences barely matter and outcomes are dominated by noise even over
  a full season. Test whether increasing the slope (making strength
  differences matter more) produces a healthier top-6 rate for strong
  squads without eliminating genuine variance entirely.
- **Re-verify XI/formation selection has no hidden bugs** reducing
  effective strength below what it should be — specifically re-check the
  formation slot-count logic (round8/9's original bug area) isn't
  silently still producing a weaker XI than intended in some edge case,
  even though the original reported bug was fixed.
- **Run a new test using realistic manual-style play**, not just the
  optimal auto-picked scenario — e.g. a reasonable but not min-maxed
  squad (a mix of sensible signings, not literally every affordable
  upgrade), across 20-25 runs, and report the actual average and range.
  Compare this against round22's optimal-play numbers to see how much gap
  exists between "perfect play" and "good-faith play."
- Based on what these investigations actually show, propose and implement
  a fix — likely opponent tier rebalancing and/or a steeper strength-to-
  goals slope — and re-run the 25-run test from round22 to confirm the
  fix genuinely moves the numbers, not just that a change was made.

## 3. Morgan Rogers windfall — adjust to a realistic partial installment

Real transfer fees of this size are paid in installments over several
years, not as one lump sum on completion. Adjust the event: reduce the
amount awarded to represent a first installment rather than the full 20%
cut (e.g. roughly a third to a half of the previously calculated amount —
tune to what still feels like a meaningful but not game-swinging windfall),
and update the ticker-bar copy to say something like "first installment"
or "the initial cut" rather than implying the whole sum lands at once.
This is a small, low-risk change — if it doesn't feel right once it's
live, it's easy to revert to the full lump sum.

## Definition of done

- Results screen reached automatically after the reveal finishes, no
  manual click required for the normal completion path
- Each of the four balance investigation points in item 2 has an honest,
  specific finding reported, not a single blanket conclusion
- A fix is implemented based on those findings and re-tested with a fresh
  25-run run, numbers reported
- Rogers event awards a reduced, installment-framed amount with updated
  copy
