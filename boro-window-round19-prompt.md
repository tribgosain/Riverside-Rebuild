# Riverside Rebuild — Round 19: Layout, Verification, Share Fix, Sponsor Budget Tiers

Paste into Claude Code once round18 is confirmed done. Six items.

## 1. Move "The Brief" / "Squad Needs" above the player list on Sell and Sign

Currently the brief/squad-needs sidebar sits in a position where it can be
scrolled past before reaching it, on both the Sell and Sign screens —
particularly relevant on mobile, where the two-column layout stacks into
one column and the sidebar may be rendering after the player list rather
than before it. Fix: brief and squad needs should appear first, above the
scrollable player list, on both screens, in all layouts including mobile.

## 2. Verify manager philosophy actually affects simulation results

This was specced (brief §14c) to pass a `variance` and `homeAdvantage`
override into `simulateMatch` based on the chosen philosophy — High Press
wider variance, Control Possession narrower, Counter-Attack wider on away
fixtures specifically, Route One a small home-advantage bump. **Verify
this is actually wired up, don't assume it is given the pattern this
session of things being specced but not landing.** Run a quick test:
simulate the same squad/formation multiple times under two different
philosophy picks and confirm the results distributions are actually
different (e.g. High Press should show visibly more high-scoring/volatile
results than Control Possession over several runs). Report what you find.
If it's not actually wired up, fix it so it is.

## 3. Results-page quote — replace with the real recap paragraph

This was asked for last round and may not have landed — verify first, fix
if not. The closing line on Results should be a **generated recap
paragraph** built from actual season data: finishing position, record,
notable streaks, standout performer, whether the sell-on windfall event
fired, promotion vs. playoff outcome if relevant. Not a quote-bank pull.
Confirm this is actually generating from real season state before
reporting it done — check a couple of different simulated outcomes and
confirm the recap text actually changes to match what happened.

## 4. Share to X — clean up the pre-filled text, and make the card save-able

**Context worth understanding before touching this:** no website can make
X (or any platform) auto-attach an image via a share link — that's a
platform-level restriction, not something fixable in this codebase. Two
things that ARE fixable:

- The pre-filled tweet text is currently generating something messy
  ("nonsense," per feedback) — find the template generating this and
  clean it up: short, readable, matches the tone used elsewhere (grade,
  position, one clean line), no leftover formatting artifacts, no
  overly-long strings that read as garbled in the compose box.
- Make the results card itself trivially easy to save/copy so someone can
  manually attach it in the X compose window that opens. If there isn't
  already a straightforward "save/copy image" affordance on the Results
  card, add one — this is the realistic best version of "share this,"
  given the platform constraint above.

## 5. Replace the loading-screen bridge animation entirely

The bridge-and-gondola progress animation on the season-simulation screen
has the same rendering problems the header icon had. Rather than another
attempt at fixing bridge iconography specifically — replace it with a
**simple, non-bridge progress indicator**: a clean animated progress
bar or similar, in the app's existing visual language (the ink/cream/red
palette, sharp edges, no rounded defaults). Nothing bridge-shaped. This
closes out the bridge-rendering saga rather than extending it.

## 6. Sponsors contribute to the transfer budget, tiered by scale

Currently sponsor effects are inconsistent per-sponsor descriptions
(brief §14a) rather than a clean system. Restructure into three tiers with
escalating budget contribution:

```
Local sponsors (Evening Gazette, Manjarro's):        +£0.5m
National sponsors (Sports Direkt, Bet366, Greggo's):  +£1.5m
International sponsors (Emirate Airways, Cryptonite.io,
  Just Eaten, Nyke):                                  +£3m
```

**Reduce the base board-mandate budgets slightly to compensate**, so the
combined total (mandate + sponsor) lands in a similar overall range to
what mandates alone provided before, rather than every playthrough simply
getting richer once sponsor money is added on top:

```
Backed:     £16m → £14m
Sensible:   £10m → £8.5m
SCR Watch:  £4m  → £3.5m
```

These are starting figures, not final — tune if the combined totals feel
off once you can actually see them in play, but the structure (three
tiers, base reduced to compensate) is the actual requirement.

## Definition of done

- Brief/squad needs render above the player list on Sell and Sign, mobile
  included
- Philosophy pick's effect on simulation results actually verified with a
  real test, not assumed
- Results recap is confirmed generating from real season data across
  multiple different outcomes
- Share-to-X text is clean; results card has a clear save/copy affordance
- Loading screen no longer attempts a bridge shape at all
- Sponsor tiers contribute to budget as specified, base mandate figures
  reduced to compensate
