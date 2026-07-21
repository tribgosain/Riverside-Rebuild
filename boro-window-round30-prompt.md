# Riverside Rebuild — Round 30: Finishing Touches

Paste into Claude Code. Nine items — some are quick UI fixes, two (items
7 and 8) are substantial and worth real care.

## 1. Grading philosophy: playoffs is the minimum, promotion is the goal — regardless of budget

Replace the mandate-tiered grade bands (round23) with **one consistent
standard applied regardless of which mandate was chosen**. The real
narrative anchor doesn't change based on budget — this club reached a
playoff final last season, so anything short of playoffs is
underachievement no matter how constrained the resources were.

```
1st-2nd    A+  (promotion — the actual goal)
3rd-6th    A   (playoffs — the floor, minimum acceptable)
7th-10th   C   (missed the minimum expectation)
11th-16th  D
17th-24th  F
```

Same bands for Backed, Sensible, and SCR Watch — no mandate-based
adjustment. Note: if round29's engine rebalancing work has landed and
changed what's realistically achievable, these exact cutoffs may need a
follow-up tune once you can see real distributions again — the
*philosophy* (uniform standard, playoffs-as-floor) is the firm
requirement, the specific position numbers can flex slightly to match
what the rebalanced engine actually produces.

## 2. Remove Board Patience from Sell/Sign entirely

Judged as adding nothing. Remove the indicator/copy from both screens.

## 3. Remove the "of £Xm mandate ceiling" line

Confusing, not adding clarity. Remove this specific piece of copy from
the net-spend scorecard. Keep the actual numbers (Budget Left / In / Out
/ Net) — those are clear on their own without this line.

## 4 & 6. Position counts next to every category header on Sell AND Sign

Add a live count next to each position category header (e.g. "CENTRE
BACKS (3)") on both screens, updating dynamically as players are sold or
signed — so squad gaps are visible while scrolling through either list,
without needing to scroll back to a summary at the top.

## 5. Correct Kanté's value to £1.8m

Current £4.5m doesn't reflect his real situation — his future is
genuinely in doubt following a loan spell away, and a distressed/uncertain
transfer situation like his typically produces a real fee well below
clean market value. Update to £1.8m.

## 7. Results/share card — full redesign for a stranger seeing it on X, not the player

Think about this from the perspective of someone who has never heard of
this app, scrolling past it on Twitter. It needs to work as a standalone,
self-explanatory, shareable artifact — closer to a Wordle result or
Spotify Wrapped card than an in-app summary screen. Specific content
hierarchy, in this order, top to bottom:

1. **"Riverside Rebuild" branding, clearly visible** — a stranger must be
   able to tell what this is at a glance, out of context, with zero prior
   knowledge of the app.
2. **Overall grade and final position, big and unmissable** — this is the
   headline of the card, should dominate the composition.
3. **Season stats** (record, points, net spend, etc.)
4. **The season recap/explanation text**
5. **If there's room: the final league table** — lowest priority, only
   include if it doesn't compromise the hierarchy above.

**Also fix:** the mandate label ("Sensible," "Backed," "SCR Watch") needs
to be self-explanatory to a stranger, not just a name — show what it
actually means in context (e.g. pairing the label with the budget or a
short descriptor) rather than a bare tag that only makes sense to someone
who's already played.

This is the single highest-leverage item in this round — it's the one
artifact designed to leave the app and be seen by people who've never
used it. Worth real design attention, not just fitting the content in.

## 8. Audit the grading methodology — must trace to real player decisions, and wildcards need genuine variance

Two things to check and fix:

- **Confirm the grade genuinely reflects decisions the player actually
  made** — signings, sales, XI selection — not factors outside their
  control. This should now be simpler to verify given item 1's uniform
  standard removes the mandate-relative complexity that made this harder
  to reason about before.
- **Check whether WILDCARD-tagged players currently have any real
  variance mechanic**, or whether the tag is purely flavour text with no
  mechanical effect. A genuine wildcard should be able to turn out
  excellent, poor, or unremarkable across different playthroughs — not
  contribute a fixed, predictable value every time. If there's no
  variance mechanic currently, add one: a randomised modifier applied to
  a wildcard player's effective contribution to squad strength each time
  a season is simulated, so signing one is a genuine gamble rather than a
  reliable, predictable pickup. Report whether this already existed or
  needed building.

## 9. Verify the Morgan Rogers event is actually firing

It's been specced and adjusted across several rounds (round6, round21,
round24, round29) but hasn't actually been seen firing in real
playthroughs yet. Given this project's track record of things being
specced without landing, don't assume this is just low-probability bad
luck — verify directly: confirm the trigger logic is actually wired into
the Sell/Sign flow, and test it enough times to confirm it can genuinely
fire (e.g. run enough simulated playthroughs to see it trigger at least
once). If the probability is low enough that a real player would rarely
see it across a handful of tries, consider whether it should be raised
slightly — this is meant to be a rare delight, not something that never
actually appears in practice.

## Definition of done

- Grade bands are uniform across all mandates, playoffs-as-floor
  philosophy applied
- Board Patience removed from Sell/Sign
- "Mandate ceiling" line removed
- Position counts visible and live-updating on both Sell and Sign
- Kanté corrected to £1.8m
- Results card redesigned to the exact hierarchy in item 7, tested by
  imagining someone with zero app context seeing only the card image
- Grading methodology confirmed tied to real player decisions; wildcard
  variance mechanic confirmed present or built
- Rogers event confirmed actually firing, with a test showing it trigger
  at least once
