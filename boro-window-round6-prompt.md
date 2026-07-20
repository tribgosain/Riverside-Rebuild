# The Window: Boro / Riverside Rebuild — Round 6 Fix Prompt

Paste into Claude Code once prior rounds are confirmed done. Four fixes and
one optional addition.

## 1. Playoff outcome is ambiguous — fix the results/grade screen

Reaching the playoffs and getting an "A" grade with no clear statement of
whether the final was won or lost is a real gap, not just polish. The
Results screen must say, unambiguously and prominently: **"PROMOTED"** if
the final was won, or **"Playoff final defeat"** (or similar, direct
language) if it was lost — as its own clearly readable line, not something
implied only by the grade letter or buried in recap prose. Check this
against brief §16 (Playoffs) — the grade bands there already account for
promotion vs. defeat, but the *display* of which one happened needs to be
explicit regardless of what grade it produced.

## 2. The transporter bridge is structurally wrong — rebuild it

Reference: the real Tees Transporter Bridge. Current build doesn't match
its actual structure. Correct structure, precisely:

- **Two towers**, each a tapering lattice/truss structure (like an
  electricity pylon or crane tower) — four legs with diagonal X-braced
  cross-bracing between them, wider at the base, narrowing toward the top.
  Not a smooth solid triangle or A-frame.
- **A horizontal lattice truss girder** spans between the tops of the two
  towers — this is also X-braced lattice construction, sitting roughly
  level/flat, not a curved or sagging cable.
- **A gondola/car hangs well below this top truss**, suspended by multiple
  vertical cables from a trolley that runs along the underside of the top
  truss — critically, the gondola sits down near road/water level, not up
  near the towers. This is the single most important correction: the
  current version likely has the moving element in the wrong place
  entirely.
- Overall silhouette: an inverted-U / goalpost shape with a deep drop to
  the gondola — clearly not a suspension bridge (no sagging main cables
  from tower to tower) and not an arch bridge.

If you have any way to look up a reference image of the actual Tees
Transporter Bridge, do that before redrawing — the structure is
distinctive and specific, worth getting right rather than approximating
from description alone.

## 3. Sell-on clause windfall — real, not invented

This is real and current, not a flavour invention: Boro hold a genuine 20%
sell-on clause on Morgan Rogers from his January 2024 sale to Aston Villa
(£15m fee). There's live transfer speculation right now — Arsenal, Chelsea,
PSG, and Man Utd have all been linked, with valuations reported between
£90m and £130m. If that sale happens, Boro's real cut would land somewhere
around £18-26m.

**Build this as a rare, random, mid-window surprise event:**

- Low probability (suggest ~8-15% chance per playthrough), fires at most
  once, at a random point during the Sell/Sign phase — genuinely a
  surprise, not something the player triggers or can predict
- When it fires: a ticker-bar announcement (e.g. "BREAKING — Arsenal agree
  £[X]m for Morgan Rogers. Boro's 20% cut: £[Y]m, straight into the
  budget.") with the fee randomised within the real reported £90-130m
  range each time, cut calculated as exactly 20% of it
- The windfall adds directly to available budget, same as a sale would
  — it's found money, doesn't cost squad depth or wage cap room
- **Don't use Hackney for this** — he only just left for Everton this
  summer, so a same-window resale isn't realistic even as a game event.
  His sell-on clause is real background fact (worth a line in his player
  history/flavour text if he still appears anywhere in the data) but
  shouldn't be an active trigger.
- If you want a second event in the pool for replay variety, invent one in
  the same spirit (a past Boro sale, a sell-on clause, a surprise fee) —
  just don't present an invented one with the same specificity/confidence
  as the real Rogers case, keep the real one clearly the "big" one

## 4. Local-lad badge accuracy — confirmed miss, and a likely broader issue

Nathan Wood (Southampton, centre-back) is a genuine Middlesbrough academy
product, born in Middlesbrough — a real Teesside lad, currently missing
the local-lad badge if he appears anywhere in the data. Fix him
specifically, and treat this as a signal to audit the rest of the
local-lad tagging: check whether it was set from actual researched
birthplaces or guessed/assumed, since one confirmed miss suggests there
may be others.

**Optional bonus, not required:** Nathan Wood is also a real, plausible
Sign target — genuine Championship-level centre-back, market value roughly
€4-10m depending on source, and he's a boyhood-return story (left Boro's
academy, now playing elsewhere, could come home) that fits the "Centre-back
depth post Fry/Lenihan" squad need already established. Worth considering
for the Sign list if there's room, not essential.

## 5. Optional — "ask the scout for more" on the Sign screen

Not essential, build only if the above is done and there's appetite. A
button (e.g. "Ask the scout for more options") that reveals 1-2 additional
targets in whichever position category it's clicked from, for someone who's
looked at the initial shortlist and wants more choices before committing.
Simplest version: reveal 1-2 more invented composite targets already
prepared but not initially shown, rather than generating anything live.

## Definition of done

- Results screen states PROMOTED or playoff-defeat explicitly and clearly,
  not just implied by grade
- Bridge redraw matches the real structure — towers, top truss, and a
  gondola hanging low near road level, not near the towers
- Sell-on windfall event exists, uses the real Morgan Rogers clause and
  fee range, fires rarely and randomly, doesn't involve Hackney as an
  active trigger
- Nathan Wood has the local-lad badge if he's in the data; local-lad
  tagging has been spot-checked elsewhere, not just patched for one player
