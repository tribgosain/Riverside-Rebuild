# Riverside Rebuild — Round 31: Brief Update, Results Diagnostic, Rogers Proof

Paste into Claude Code.

## 1. Add Lankshear to the opening brief text

Will Lankshear has now officially signed (already reflected in squad
data per a prior fix). The cold-open brief paragraph on the Landing
screen still only credits Sarmiento and Joseph as already through the
door. Update it to include Lankshear too — smallest possible edit:

Current: "...Sarmiento and Joseph are already through the door."
Change to: "...Sarmiento, Joseph, and Lankshear are already through the
door."

Verify he's genuinely absent from the Sign screen's target list now that
he's a confirmed signing, not still listed as available to sign — if
that's not already the case, fix it while in here.

## 2. Results screen needs real diagnostic explanation, not just a summary line

Currently the recap explains roughly what happened but not genuinely
*why* — what actually went well or badly across the season. Build this
from data the engine already has:

- **Attack vs league average**: goals scored (GF) compared to the
  division average — was this a strong or weak attacking season?
- **Defence vs league average**: goals conceded (GA) compared to the
  division average — solid or leaky?
- **Consistency**: reference the longest win streak and any notable
  winless run (this data already exists for the streak-banner feature
  from earlier rounds) — a team that was streaky/inconsistent reads
  differently to one that was steady all season.
- **If the wildcard variance mechanic from round30 exists**: whether any
  wildcard signings specifically overperformed or underperformed relative
  to their base rating, and call that out specifically if it's a
  meaningful factor in the season's story.

Combine 2-3 of these into a genuine short diagnostic — e.g. "Boro's
attack was the best in the bottom half of the table, but a defence that
shipped more than the league average undid it" — rather than just
restating the final position. Keep it to a couple of sentences, this is
an addition to the existing recap, not a replacement for its length
constraints.

## 3. Morgan Rogers event — prove it works, don't just claim it again

This was already asked for in round30 (item 9) and there's no
confirmation it was actually verified — the follow-up session covered
different work. Given several real playthroughs with zero occurrences,
treat this as genuinely unresolved rather than bad luck. This round,
**prove it one way or the other with actual evidence, not another
assurance**:

- Find the trigger code and confirm it's actually called somewhere in the
  Sell/Sign flow — paste back the actual code path showing where it's
  invoked, not just where it's defined
- Write a quick test harness that runs the trigger check in a loop (e.g.
  1,000 iterations) and counts how many times it fires — report the
  actual observed rate against whatever probability was intended
- If it never fires in that test, the bug is in the trigger logic itself
  (wrong condition, not actually being called, or similar) — find and fix
  the real cause, don't just adjust a probability number blind
- If it does fire at roughly the intended rate in the test but real
  players still aren't seeing it, the probability itself is likely just
  too low for real play — raise it to something a player would
  realistically encounter within a handful of playthroughs (e.g. high
  enough that a 10-run manual test would be very likely to see it at
  least once)
- Either way, end with an actual demonstrated occurrence — force the
  event to fire once in a real playthrough (temporarily, for testing) and
  confirm the ticker copy and budget effect both work correctly

## Definition of done

- Cold-open brief mentions Lankshear alongside Sarmiento and Joseph, and
  he's confirmed absent from the Sign target list
- Results recap includes genuine diagnostic content (attack/defence vs
  league average, consistency, wildcard performance if applicable), not
  just a restated summary
- Rogers event proven working via actual test evidence — a real fire
  count from a loop test, not a repeated claim — with the root cause
  (trigger bug vs. just low probability) explicitly identified and fixed
