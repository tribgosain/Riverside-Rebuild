# The Window: Boro — Round 2 Fix Prompt

Paste this directly into Claude Code. It assumes the repo already exists from
Round 1 and `boro-window-brief.md` §18 is in the repo as prior context —
this doc extends that, it doesn't replace it. Where something's already
fully specced in §18 (bugs in 18a, sponsor logo caution in 18c, results
card in 18e) this doc just points back rather than repeating it.

**The core problem this round is solving:** the last pass copied KEF's
reference too literally (identical fonts, near-identical headline layout)
while the actual functional screens — Sell, Sign, XI — barely changed from
before it and still don't. This prompt gives you a real, different visual
identity, and a concrete structural spec for those three screens modeled on
what makes KEF's version work, translated into Boro's own system rather than
copied.

---

## 1. Visual identity — concrete tokens, not a reskin

Genuinely different font *family*, not just a different name in the same
genre as Barlow Condensed. Direction: heavy slab serif for headlines reads
as tabloid back-page, not clean editorial app — different texture, not just
different name.

```
Display/headline:  "Zilla Slab", weight 800/900 (Black)
Body/UI:            "Work Sans", weights 400/500/600
Data/stats/ledger:  "IBM Plex Mono" (this is ours from round 1 — keep it,
                     it's not KEF's and it's the right texture for
                     scorelines and budget figures)
```

All three are free on Google Fonts.

**Colour:** keep the dark near-black base and Boro red as primary — that's
correct, not a copy, it's the club's actual colour. What needs to change is
the palette isn't otherwise identical to KEF's red/black/white. Add a
secondary accent: a muted steel-teal (`#3E6E68` or similar desaturated
teal-grey) — nods to the Tees and to steel without being literal — used for
secondary UI (the ticker bar background tint, secondary badge outlines),
never competing with red as the primary action colour.

**Signature motif (KEF has nothing equivalent — this is the differentiator):**
a thin diagonal line motif, ~1-2px, at a consistent angle, nodding to the
Transporter Bridge's girder structure. Use it sparingly as section dividers
instead of plain horizontal rules, and optionally as small corner accents
("rivets" — tiny square marks) on card corners. Restrained, not decorative
overload — one recurring detail that reads as *this app's*, not a generic
dark-mode template.

## 2. Structural rebuild — Sell, Sign, and XI

These three screens need to actually change, not just receive new colours.
Build a shared shell all three inherit from:

**Persistent header** (not just shown on the hub): manager name, role line
("SPORTING DIRECTOR · MIDDLESBROUGH · 2026-27" or similar), and the stat
cluster (Budget left / In / Out / Net spend) — visible at the top of Sell,
Sign, and XI, not just the hub screen.

**Step indicator**: three connected numbered circles — SELL / SIGN / XI —
not the flat progress bar from Round 1. Current step highlighted, completed
steps show a distinct state (checkmark or filled), matches the visual
system from §1, not KEF's exact styling.

**System ticker bar** (coloured strip at the very top, above the header):
shows a contextual message that changes based on state —

- On first entering the window: an opening line ("The window's open —
  [name] takes the desk with £[X]m sanctioned. Hellberg's waiting. Sell
  first." or similar, adapted from the existing cold-open voice)
- After a significant action: a reactive one-liner. This is where the
  previously-deferred "fan forum reactions" idea (brief §13) actually
  belongs — same mechanic, different location. Draw randomly from 2-3
  variants per trigger: selling a tagged KEY ASSET, signing a headline
  target, hitting a wage-cap or budget wall, an illegal XI at the Simulate
  gate. Keep the tone as in-fiction system commentary, not a forum-post
  pastiche.

**Two-column layout below the header, on Sell/Sign/XI specifically:**

- **Left sidebar, persistent across all three screens** — not shown once
  and then dropped:
  - **"THE BRIEF"** — a short quoted excerpt, reusing/trimming the
    cold-open copy already established (Hackney/Fry gone, Hellberg wants
    pace and depth, etc.)
  - **"SQUAD NEEDS"** — a priority-tagged checklist, sourced from what's
    already real and established: Right-back cover (CRITICAL — Boro's
    actual real situation this summer), Striker depth/plan-B option
    (CRITICAL), A controlling midfielder (HIGH), Centre-back depth post
    Fry/Lenihan departures (HIGH). This list should visibly connect to
    what the player actually does — if they sign a right-back, that need
    should update or clear.
- **Right side, main content** — player list grouped by **position-category
  headers** (GOALKEEPERS, RIGHT-BACKS, CENTRE-BACKS, etc.), not a flat
  filterable list. Each row: initials avatar, name, position/age (plus
  club-of-origin on Sign targets), price, a one-line scouting/flavor blurb,
  contextual tag chips, and the action button. Tags: SURPLUS / OVERSTOCKED /
  KEY ASSET / INJURY-WATCH for Sell; UPGRADE / COVER NEEDED / BARGAIN /
  WILDCARD for Sign.

**Footer**: persistent running counter (sold count and funds raised on
Sell; in/out/net on Sign) plus one large CTA advancing to the next step.

**Auto-pick, on all three screens, not just XI:**

- **Sell:** "Auto-trim surplus" — sells everything currently tagged SURPLUS
  in one action. Doesn't touch anything else.
- **Sign:** "Auto-fill needs" — signs the best-fit suggested target for
  each CRITICAL squad need, within remaining budget and wage cap. Stops
  and does nothing further if it can't afford a need, doesn't overspend to
  force it.
- **XI:** "Auto-pick XI" — fills a legal XI using the existing `bestXI()`
  engine logic (brief §10), wired to a button instead of only running
  implicitly. Keep a "Clear" button alongside it.

**XI screen specifically — this also fixes the slot-assignment bug from
§18a:** pitch slots must show the actual formation-specific position label
(ST / LW / RW / AM / DM / CB / LB / RB / GK depending on the chosen
formation), not a generic "FW"/"MF". Assignment becomes explicit two-step —
tap a slot, then tap a player from a roster list to fill it — rather than
implicit ordering, which is what caused right-side slots to silently fill
from the left. CTA: "Close window & grade me" (or equivalent), advancing to
Simulate.

## 3. Sign screen — target list data

Per the decision to mix real headline names with invented depth: five real,
currently-circulating Boro links to use as the "headline" targets. I've
verified these are real current rumours, but **don't have fully confirmed
age/current-club/fee detail on all five — verify each before locking in
exact numbers**, rather than treating my figures below as confirmed fact:

| Name | Position | What's confirmed | Needs verifying |
|---|---|---|---|
| Josh Mulligan | MF | Real, current link; West Ham also reportedly interested — good "contested" framing | Exact age, current club, realistic fee |
| David Ozoh | MF | Real, current link | Age, current club, fee |
| Daniel Jebbison | FW | Real, loan interest from several Championship clubs including Boro, age ~22 | Parent club, realistic loan fee |
| Dennis Cirkin | LB | Real, free agent following Sunderland departure, described as a suitable fit | Age (~24), realistic free-agent wage ask |
| Will Lankshear | FW | Real — Boro bid ~£15m in January, Spurs kept him; usable "unfinished business, could revisit" framing | Current club/valuation as of now, given time's passed since the January bid |

Fill the rest of the Sign list (the bulk of it, across GK/CB/RB/W/ST etc.)
with invented composite targets, same as the original `market.json` from
brief §6 — this is where **wildcards** belong: 2-3 entries tagged WILDCARD
with a higher-variance stat profile (boom-or-bust — could be excellent or a
flop), cheap enough to be a low-risk gamble, clearly flagged as such in
copy rather than presented as a safe bet.

**One data flag surfaced during this research, worth checking before
shipping:** Matt Targett's status is genuinely unclear in current reporting
— one source suggests Boro have decided *not* to make his loan permanent,
which would mean he's not actually part of the retained squad. If Round 1's
squad data still has him as a kept player, re-verify before treating that
as settled — this is exactly the kind of squad-data accuracy issue flagged
generally in §18c.

## 4. Still outstanding from §18 — not re-specced here, don't drop these

- 18a: formation click-assignment bug (now folded into §2 above via the
  two-step tap pattern), the "free's Boro" string bug, the confusing
  simulate-screen affordance
- 18c: sponsor marks are currently generic pictograms (a newspaper icon, a
  flame, a lightning bolt, a dice grid) representing the *concept* rather
  than evoking the *specific real brand* (Sports Direct's actual bold
  blue/white wordmark style, bet365's green rounded mark, etc.) — closer
  than the original letter-avatars, but not there yet. Same trademark
  caution as before applies, especially for Nyke.
- 18c: kit system needs home/away pairing and the richer custom builder
  (trim colour, neck style, pattern)
- 18d: the simulate/reveal screen simplification (cut the full match list
  and elsewhere-ticker, keep streak banners, auto-advance)
- 18e: the results card redesign toward a real "Spotify Wrapped" style
  composition

## 5. Definition of done for this round

- Sell, Sign, and XI all share the header/stepper/ticker/sidebar shell
  described in §2 — not three independently-styled screens
- Typography is Zilla Slab + Work Sans + Plex Mono, applied consistently,
  not mixed with leftover Barlow anywhere
- XI slot assignment is bug-free — clicking a specific slot puts a player
  in that specific slot, verified by actually testing a right-side slot
- Auto-pick exists on all three screens per §2, not just XI
- Sign list includes the five real names from §3 (with verified detail,
  not placeholder numbers) plus invented depth and 2-3 tagged wildcards
- Nothing in §4's outstanding list has been silently dropped
