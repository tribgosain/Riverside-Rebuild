# The Window: Boro — Build Brief

A single-session, no-login, £0-to-host transfer window simulator for Middlesbrough
fans. You put your own name in and handle one summer, start to finish: sell,
sign, pick your XI, then watch the 2026/27 Championship season play out.
Modelled directly on
[kef-transfer-game.netlify.app](https://kef-transfer-game.netlify.app) (Kop End
Fracas' Liverpool version) — same shape, same voice, Boro-specific content and data.

**A note on identity, worth pinning down explicitly:** the player is never
named as, or depicted as, a specific real member of Boro's staff. In reality
Kieran Scott (Head of Football) handles recruitment and Kim Hellberg (Head
Coach) handles tactics — two different jobs. Since this deliberately combines
both under one player-controlled role, it stays an abstracted "you're in
charge" framing with the player's own entered name, not a roleplay of either
real person. Real staff can still be referenced factually in copy — the cold
open quotes Hellberg, mandate flavor mentions Gibson — but the player is
never depicted as being them or acting through them. Worth keeping firm as
the copy gets built out, not just a note for this draft.

This doc is meant to be handed to Claude Code with no other context required.

---

## 1. Product vision

The reference points, and what we're taking from each:

- **The Window (KEF, Liverpool)** — the primary template. Editorial cold-open
  copy, a single "board mandate" choice that fixes budget + difficulty at once
  (no slider), a live net-spend scorecard, a lean 3-step flow, and an outcome
  that's a letter grade + narrative recap + social card, not just a league table.
- **Sporting Director Simulator (flameosumeet)** — confirms the task-gated
  shape and the "Simulate → results modal → Play Again" loop works at scale
  (800K+ views on the reveal tweet).
- **LFC Armchair Director (lfcglobe.co.uk)** — contributes one mechanic worth
  keeping: a **wage cap** as a second constraint alongside transfer budget, and
  a **shareable link** that encodes your build so a result is a challenge, not
  just a brag.

None of these needed a backend. Neither does this.

## 2. Voice & the cold open

This is the single biggest quality lever, and it should be almost entirely
true rather than invented. Real material from this summer:

- Hayden Hackney (reigning Championship Player of the Season) and Dael Fry
  (Boro's best defender down the stretch) have both left. Hellberg said
  directly: *"We have lost four of the players who played almost every game
  in Dael, Browney, Matt, and Hayden."*
- The playoff final defeat to Hull City is a genuinely brutal, specific stat:
  70% possession, zero shots on target.
- By the back end of last season Hellberg was down to "maybe 13-15 players at
  best" he trusted — squad depth, not just XI quality, was the failure.
- Real signings already in, keep these as the starting point, not the target:
  Kyle Joseph (ST, ~£4m from Hull), Jeremy Sarmiento (LW, £3.19m from
  Brighton), Myles Peart-Harris (free, ex-Oxford).
- Abdoulaye Kanté's future is in doubt after a loan spell at Saint-Étienne —
  usable as a "one to consider moving on" nudge, not a forced removal.
- The real financial mechanism to name is **SCR (Squad Cost Ratio)** — the
  actual current EFL Championship financial regulation — not PSR, which is
  the Premier League's version and belongs to the Liverpool original, not us.

Suggested cold-open copy (Claude Code should treat this as a strong draft, not
gospel — refine it, but keep the specificity and the present-tense urgency):

> Hackney's gone. Fry's gone. You blew a playoff final without registering a
> single shot on target. Hellberg's spent the second half of last season
> working with thirteen players he actually trusted, and he wants pace, a
> plan-B striker, and a squad deep enough to survive a bad month. Sarmiento
> and Joseph are already through the door. The rest of the window is yours.

## 3. Core loop

```
Setup (name, board mandate)
   → Sell
   → Sign
   → XI (formation + starting XI)
   → Simulate
   → Results (grade, table position, recap, social card)
       ├─ if finished 3rd-6th → Playoffs (§16) → Results (playoff variant)
       └─ Run it back (same mandate) | New window (reset)
```

Three gated steps — **Sell → Sign → XI** — not five. Earlier drafts of this
spec included separate Sponsor and Loan tasks; drop both. KEF's leaner
version is the better-tested shape, and neither adds enough gameplay to earn
a dedicated step. (A loan toggle can live inside Sign as a checkbox — "loan"
vs "buy" — if it's cheap to add; not required for v1.)

Steps can be visited in any order and revisited before Simulate; Simulate is
disabled until all three are marked done **and** the XI is legal (see
edge cases). A 3rd-6th finish branches into a short playoff sequence (§16)
before reaching Results — everything else finishes straight to Results.

## 4. Board mandate (replaces a budget slider)

Three fixed tiers, chosen once at setup, no slider, no changing mid-window:

| Tier | Budget | Wage cap (£k/wk) | Flavor |
|---|---|---|---|
| **Backed** | £16m | £185k | "Gibson's opened the chequebook. Delivery is now the only excuse." |
| **Sensible** | £10m | £150k | "A normal Championship summer. Spend well, not much." |
| **SCR Watch** | £4m (sale-funded only above this) | £120k | "One bad signing away from a headline about the board." |

Both budget *and* wage cap are hard constraints, checked independently — you
can afford a fee and still fail the wage cap, same as real recruitment. This
is the Armchair Director contribution: a single budget number is a weaker
constraint than two.

## 5. Net-spend scorecard

Shown live, not just at the end:

```
IN   £4.0m    (signings)
OUT  £6.5m    (sales)
NET  −£2.5m   (against your mandate ceiling)
WAGES  £142k / £150k p/w
```

## 6. Squad data — corrections needed before this is trustworthy

The seed squad used in the first prototype is stale. Before build:

- **Remove:** Hayden Hackney, Dael Fry (both departed this summer)
- **Add:** Kyle Joseph (ST, age ~24), Jeremy Sarmiento (LW, age ~23), Myles
  Peart-Harris (AM/W, age ~22) — set OVR/value/wage using the same estimation
  curve as the rest of the seed data (see `mkPlayer` formula below)
- **Flag, don't force:** Abdoulaye Kanté — real doubt over his future, good
  candidate for a "the board would understand if you moved him on" nudge in
  copy, but leave the sell/keep decision to the player
- Re-verify the rest of the squad list against a current source before
  treating any of it as fact — transfer windows move fast and some of this
  will already be stale by the time this is built

## 7. Architecture

Static single-page app. No backend, no database, no build-time API calls.
Same low-cost reasoning as before, now confirmed by three independent
reference products all shipping this way:

- **Hosting:** push to GitHub, connect to Cloudflare Pages (or Netlify)
  free tier. £0/month.
- **Build:** Vite + React. (The in-chat prototype used CDN React + in-browser
  Babel to get a working demo with zero build step — fine for a prototype,
  wrong for something you're going to maintain. Use a real Vite build here.)
- **State:** React state, autosaved to `localStorage` with an in-memory
  fallback (see §9 — this isn't optional, sandboxed/private-browsing contexts
  will throw on `localStorage` access).
- **Sharing:** results screen gets both a text share (grade + position, for
  X/WhatsApp) and a link share that encodes `{mandate, squad diff, formation}`
  into the URL (base64 in a query param is sufficient — no server needed to
  make a link "shareable").

v2, not now: a public leaderboard would be the one thing that justifies a
backend — a single write-only endpoint (name, grade, position) behind a
Cloudflare Worker + KV, called only from the results screen. Don't build this
until the core loop is proven.

## 8. Folder structure

```
boro-window/
  src/
    data/
      squad.json        # corrected per §6
      market.json
      clubs.json         # real 2026/27 Championship opponents
      copy.js             # cold-open text, mandate flavor, grade copy
    engine/
      simulate.js         # season simulation — poisson-based, carried over
      strength.js          # squad/XI strength calculation
      table.js              # standings computation
      grade.js               # finishing position + mandate → letter grade
    state/
      gameReducer.js
      taskGate.js           # single source of truth for "can Simulate run"
      persistence.js        # localStorage wrapper w/ in-memory fallback
      shareLink.js            # encode/decode state to/from URL
    components/
      Setup.jsx
      TaskHub.jsx
      tasks/
        SellTask.jsx
        SignTask.jsx
        XITask.jsx
      SeasonSim.jsx          # vidiprinter-style reveal
      ResultsModal.jsx
    App.jsx
    main.jsx
  index.html
  package.json
  vite.config.js
```

## 9. State shape

```js
GameState = {
  manager: { name: string, mandate: 'backed' | 'sensible' | 'scr_watch' },
  budget: number,
  wageCapRemaining: number,
  squad: Player[],           // { id, name, pos, age, ovr, value, wage }
  market: Player[],
  formation: '4-3-3' | '4-4-2' | '3-5-2' | '5-3-2',
  tasks: { sell: boolean, sign: boolean, xi: boolean },
  screen: 'setup' | 'hub' | 'sell' | 'sign' | 'xi' | 'simulating' | 'results',
  season: SeasonResult | null,   // { standings, boroLog, boroStrength, grade }
}
```

`taskGate.js` is a single pure function — `canSimulate(state) -> boolean` —
that checks all three tasks are marked done AND the XI is legal for the
chosen formation. This logic must live in exactly one place; don't duplicate
the legality check between the XI screen and the Simulate button.

## 10. Engine (carried over from the working prototype, already tested)

This logic was built and headlessly tested (Playwright, full flow +
edge cases, zero runtime errors) in the earlier prototype. Port it as-is:

- **Squad strength:** best-XI-by-formation, weighted average OVR, small
  depth bonus for squad size beyond the floor.
- **Match simulation:** Poisson-distributed goals per side, home advantage
  constant, per-match strength variance (±5) so results aren't deterministic
  run-to-run — replay value comes from variance, not from picking a "correct"
  squad. Goals capped at 8 per side to keep scorelines plausible.
- **Fixtures:** double round-robin across all 24 Championship teams (23 real
  opponents + Boro) — every ordered pair plays once, which is equivalent to
  every pair playing home and away.
- **Standings:** standard points/GD/GF sort.
- **Grade (new for this version):** derive a letter grade from finishing
  position *relative to mandate* — finishing 6th on a "Backed" mandate should
  grade worse than finishing 6th on "SCR Watch." Suggested bands per mandate,
  tune to taste:

  ```
  Backed:     1-2 → A · 3-6 → B · 7-12 → C · 13-21 → D · 22-24 → F
  Sensible:   1-2 → A+ (overachieved) · 3-6 → A · 7-12 → B · 13-21 → C · 22-24 → D
  SCR Watch:  1-6 → A+ · 7-12 → A · 13-21 → B · 22-24 → C  (survival is success)
  ```

## 11. Edge cases & handling

Everything below was identified across three planning passes; treat this as
the complete list, not a starting point.

| # | Edge case | Handling |
|---|---|---|
| 1 | Selling below a playable squad size | Hard floor (16 players). Sell disables at the floor with inline copy explaining why. |
| 2 | Overspending transfer budget | Buy actions validate against remaining budget before landing; unaffordable signings show disabled "Can't afford." |
| 3 | Breaching the wage cap | Same pattern as budget — independent check, a cheap-fee/high-wage player can be blocked even with budget spare. |
| 4 | Unbounded squad growth | Ceiling ~38 (real seed squad ~34, headroom to sign without forced sales). |
| 5 | XI illegal for chosen formation | Live per-position check against squad; blocks Simulate with a specific message ("need 4 DF, have 2"), not a generic error. |
| 6 | Sell/Sign tasks marked done with zero actions | Valid — tasks are satisfied by visiting and confirming, not by a forced minimum transaction count. Matches reference product's own framing ("or don't, you're the sporting director"). XI legality is the only hard gate. |
| 7 | User revisits a completed task and changes it | Task stays marked complete; Simulate re-validates on every state change, not just at completion time. |
| 8 | Name field: empty, very long, or unusual characters | Trim + cap length (~24 chars) client-side. Display-only text, never executed or transmitted — a layout concern, not a security one. |
| 9 | Refresh/back mid-simulation reveal | Full season result computes synchronously *before* the reveal animation starts and is autosaved immediately; a refresh loses the animation, never the outcome. |
| 10 | "Play again" ambiguity | Two distinct actions: "Run it back" (same manager/mandate, fresh transfer window) vs. "New window" (full reset, re-pick name and mandate). Don't conflate into one button. |
| 11 | Corrupted localStorage save | JSON parse wrapped in try/catch; falls back to a fresh game rather than a white screen. |
| 12 | localStorage unavailable (private browsing, sandboxed contexts, cookies blocked) | Storage layer degrades to an in-memory store transparently — same interface either way. This is not optional; verify it explicitly, e.g. by stubbing `window.localStorage` to throw in a test and confirming the app still runs. |
| 13 | Lopsided simulated scorelines | Goals capped at 8 per side in the Poisson sampler. |
| 14 | Share link with stale/invalid encoded state | Decode wrapped in try/catch; invalid or unparseable link falls through to a fresh Setup screen rather than crashing. |
| 15 | Duplicate sign action (double-click, etc.) | Reducer guards against signing a player already in the squad. |
| 16 | Philosophy pick (§14c) changed after squad/XI already set | Purely a `simulateMatch` parameter — safe to change any time before Simulate is pressed, no dependency on squad or formation state. No special handling needed, but worth a test to confirm changing it doesn't require re-visiting the XI task. |

## 12. Performance notes

- Full season simulation is ~550 trivial matches — sub-100ms, no need to
  worry about this even on low-end devices.
- Compute the entire season result *before* starting any reveal animation;
  never re-run simulation logic per animation frame.
- No images, no heavy assets — a text/SVG social card (rendered to canvas
  client-side for the "download image" option, if built) is the only
  moderately expensive operation, and it's a one-shot user-triggered action,
  not something that needs to be fast by default.

## 13. Explicitly out of scope for v1

Multi-season saves, in-window negotiation/haggling, injuries, a public
leaderboard. Don't build these now — the core loop needs to prove itself
first.

**January transfer window** — deferred deliberately, not for difficulty.
Mechanically it's not hard — splitting the season sim into two halves
(~23 games, pause, second Sell/Sign screen, resume) reuses everything
already built. The reason to hold it is product, not engineering: this is
pitched as a 3-minute toy — open link, do business, watch it play out,
share — and a January window roughly doubles session length and turns that
into something closer to a real management game. That might be a genuinely
better product, but it's a different one, and it should be a deliberate v2
decision made after the single-window version has proven itself, not
something that quietly creeps into v1 and stretches build time before v1
ever ships.

**Canvas-rendered downloadable PNG of the results card** — deferred, but
narrowly. The results screen itself must be screenshot-friendly in v1
(§14e is not deferred, it's a v1 requirement); what's deferred is only the
extra step of rendering that same card to canvas and offering a "Download
Image" button. Native screenshot covers the growth loop for v1 — build the
one-click download later if it turns out people actually want it over just
screenshotting.

**Fan forum reactions** — deferred, not dropped. Spec is worth keeping so
it's not lost: a small bank of Teesside-forum-voice one-liners, triggered by
thresholds during Sell/Sign and shown as toast/chat-bubble pop-ins (not
full-screen). Draw randomly from 2-3 lines per trigger so repeat plays don't
feel scripted. Suggested triggers: a big sale ("sold [player] to fund THAT?
sound as."), a marquee signing ("actually behaving like a big club for
once"), a deadline-day panic buy with budget nearly exhausted ("we've panic
bought again haven't we"), zero transfer activity before hitting Simulate
("same old boro, all mouth no window"), and grade-based reactions on the
results screen. Nice texture, adds no gameplay weight — good v1.1 candidate
once the core loop is proven, not worth the extra copy-writing and trigger
logic before that.

## 14. Pre-window personalization

Three additions, all zero-touch on the simulation engine except where noted
— they live entirely in Setup and small copy banks. Purpose is atmosphere:
making the app feel alive and specific to Boro rather than a clean form.

### 14a. Kit sponsor

Nine options, three tiers. Two are real (kept real deliberately, for
authenticity); everything above local scale is a parody name, not a real
logo — keeps this legally clean and is funnier anyway.

| Sponsor | Tier | Copy | Effect |
|---|---|---|---|
| **Evening Gazette** | Local (real) | "Teesside's paper of record backs the badge." | Small board-patience nudge |
| **Manjaros** | Local (real) | "Flame-grilled peri-peri, straight outta Boro." | Small budget bump |
| **Sports Direkt** | National (spoof of Sports Direct) | "Every shirt, every size, every till receipt as long as your arm." | Decent budget bump; recap copy needles you about shirt sales over points |
| **Bet366** | National (spoof of Bet365) | "The odds-on favourite for your shirt front." | Biggest budget bump on offer; small board-patience hit specifically on the SCR Watch mandate |
| **Greggo's** | National (spoof of Greggs) | "Half-time pasty, full-time loyalty." | Almost no mechanical effect — pure flavor |
| **Emirate Airways** | International (spoof of Emirates) | "Fly the flag. Literally, it's on your sleeve." | Strong budget bump, but only available on Backed/Sensible mandates |
| **Cryptonite.io** | International (spoof, crypto exchange) | "Sponsor nobody quite understands, backed by money nobody can explain." | High budget bump, offset by a small board-patience hit — nods to the real backlash pattern around crypto sponsors |
| **Just Eaten** | International (spoof of Just Eat) | "Delivering hope, thirty minutes late." | Modest steady budget bump, no downside — safe filler pick |
| **Nyke** | International (spoof of Nike) | "The kit manufacturer, not that other one." | Small budget bump; this is the pick that should visually pair with the shirt colourway below — it's your kit deal, not just a shirt-front sticker |

One-time choice at Setup, shown as a simple card grid, three columns
(Local / National / International).

### 14b. Shirt colourway

Four options, cosmetic only — re-skins the app's accent colour for the
session (swaps the `--red` CSS variable and a couple of derived tones), no
gameplay effect whatsoever:

| Name | Base colour | Note |
|---|---|---|
| **Riverside Red** | Boro red (default) | The safe pick, what most people will leave it on |
| **Trafalgar White** | Off-white with red trim | The classic away-kit read |
| **Smoggy Black** | Charcoal black with red accent | Third-kit energy, a wink at Teesside's industrial heritage |
| **Ayresome Blue** | Blue with white trim | Nostalgia pick, nod to the old ground |
| **Design your own** | Custom | Two colour pickers (primary + trim) bound to the same CSS-variable mechanism as the presets, plus a pattern toggle — solid / hoops / sash, a nod to actual kit history rather than an arbitrary option |

Shown as a swatch picker, single select, directly below or beside the Nyke
sponsor card if Nyke is chosen — reads as "here's your actual kit," not two
unrelated menus. "Design your own" opens the same picker inline rather than
a separate screen — keep it to two colour inputs and one pattern selector,
resist scope-creeping this into a full kit editor.

### 14c. Manager philosophy

Four options, chosen once at Setup. These do have a small, real effect on
the simulation — documented parameters on top of the existing engine
(§10), not a new system:

| Style | Copy | Effect on `simulateMatch` |
|---|---|---|
| **High Press** | "Win it back in their half or die trying." | Widens the per-match variance range (±5 → ±8); frantic, higher-scoring games in both directions |
| **Control Possession** | "If they don't have the ball, they can't hurt you." | Narrows variance (±5 → ±3); rewards a genuinely higher-OVR XI more directly, fewer upsets either way |
| **Counter-Attack** | "Let them come. We'll punish the space." | Widens variance specifically on the road (away fixtures get ±7, home stays ±5) — boom-or-bust, better suited to an underdog squad |
| **Route One** | "Get it in the mixer." | Minimal mechanical change (+1 home advantage constant, nod to physical/direct play suiting the Riverside) — mostly a flavor pick, and should read as the funniest option in the copy |

This is the one addition that touches `engine/simulate.js` — pass a
`variance` and `homeAdvantage` override into `simulateMatch` based on the
chosen style rather than hardcoding the constants. Small change, keep it
contained to that one function signature.

### 14d. In-play immersion touches

Five small additions, all built from data the engine is already computing
or state already being tracked — no new systems, just new ways of surfacing
what already exists.

- **Streak banners during the vidiprinter reveal.** The reveal (§10) is
  already ticking through Boro's results one at a time — track consecutive
  W/L while revealing and pop a small inline banner at 3+ ("FIVE IN A ROW"
  / "WINLESS IN FOUR"). No new state beyond a running counter in the reveal
  component.
- **"Elsewhere in the Championship" strip** alongside the vidiprinter — a
  couple of other fixtures' scorelines scrolling in smaller text next to
  Boro's own results. The full season (all 552 matches) is already
  simulated for the table; this surfaces a handful instead of discarding
  them. Makes it read as a whole league happening, not just Boro's fixtures.
- **Board Patience meter.** Reuses the "board-patience" effect already
  wired into the sponsor table (§14a) and gives it a small visual — but
  deliberately designed to barely move under normal play, not a twitchy
  gauge. This matters specifically for Boro: Gibson's real reputation is
  patience, so a meter that swings to "furious" over a mid-table finish
  would be wrong, not funny. Set thresholds so it only visibly tips at
  genuine extremes (relegation, or reckless spend with nothing to show for
  it) — copy at rest can even lean into it ("Board Patience: steady. You'd
  have to properly embarrass him."). The restraint is the joke.
- **"Local lad" badge** on Teesside-born players across Sell/Sign/XI lists —
  one boolean flag added to existing player data (`data/squad.json`,
  `data/market.json`), a small pin/badge in the UI. Cheap, and it's the
  detail that actually lands with people who follow the club closely.
- **Auto-generated nickname for your best signing** — a small bank of
  nickname templates keyed to position/stat profile ("The Riverside Rocket"
  for a fast forward, "The Wall" for a high-OVR CB), applied to whichever
  signing has the highest OVR at Simulate time. Pure text generation off
  data already in state, shown once on the Results screen.

Loading-screen flavor text (cycling status lines like "Telling the board
it'll be fine this time" instead of a generic spinner while the season
computes) is a trivial addition too — an array of strings on a timer — and
worth including here since it costs nothing, but isn't essential in the way
the five above are.

### 14e. Shareable results card

This is the actual growth mechanism, worth treating as a first-class part
of the Results screen rather than a bolt-on "share" button — and it doesn't
need image export or canvas rendering to work. **Design the Results screen
itself as a card, and let people use their phone's native screenshot.**

Requirements:

- **Fits in one viewport, portrait, no scrolling required** to see the
  headline info — manager name, final position, letter grade, record
  (W/D/L), points, net spend, and the auto-generated nickname from §14d if
  built. If it needs a scroll to screenshot cleanly, it's failed the brief.
- **A visible site watermark/URL** somewhere on the card (small, bottom
  corner is fine) — the whole point is this gets screenshotted and posted
  out of context on X; without a URL on the card itself, a screenshot is a
  dead end instead of bringing the next player in.
- **High contrast, works as a compressed JPEG.** X/Twitter recompresses
  images hard — avoid relying on subtle gradients or fine text that'll
  degrade; keep the key numbers large and high-contrast against the
  background.
- **Reflects the personalization picks** (§14a-14c) — the chosen kit
  colourway and sponsor should visibly appear on the card, so two people's
  results cards actually look different from each other, not just the
  numbers.
- Text-share and link-share (§7) stay as secondary options for the same
  Results screen, not a replacement for it — copy-to-clipboard for people
  who can't or don't want to screenshot. The card being screenshot-friendly
  is the primary mechanism; treat a canvas-rendered downloadable PNG (listed
  as deferred in §13) as a nice-to-have upgrade to this, not a prerequisite
  for it.

## 15. Mobile-first requirements

This will be played almost entirely on a phone — shared as a link in a group
chat, opened one-handed, in a pub or on a bus. Build for that screen first
and scale up, not the other way round.

- **CSS mobile-first, literally.** Base (unprefixed) styles target a ~375px
  viewport; use `min-width` media queries to add layout for tablet (~768px)
  and desktop (~1024px+), never the reverse. Don't design the desktop layout
  first and squeeze it down.
- **Single column by default.** Task Hub, Sell/Sign lists, and the results
  screen all stack vertically on mobile. Anything currently speced as a
  grid (the sponsor card grid in §14a, position filter tabs) should collapse
  to a horizontally scrollable row of chips on narrow screens rather than
  wrapping into a cramped multi-row grid.
- **Touch targets ≥44×44px**, per standard iOS/Android guidance — this
  affects the Sell/Sign action buttons and the sponsor/shirt/philosophy swatch
  pickers specifically, since those were speced as compact cards and need
  enough tap area on a phone.
- **Primary action stays reachable.** Simulate, and the mandate/task
  confirm buttons, should sit in a sticky bottom bar on mobile rather than at
  the bottom of a long scroll — one-thumb reachable, not a scroll-and-hunt.
- **No hover-dependent interaction.** Everything speced so far is
  click/tap-based already — worth stating explicitly so nothing sneaks in a
  hover-to-reveal pattern (tooltips on player stats, for instance) that's
  invisible on touch.
- **Inputs at ≥16px font size** (the name field in Setup) — anything smaller
  triggers an automatic zoom-in on iOS Safari that's disorienting to back out
  of.
- **Top bar (budget / wage cap / squad count) needs a compact mobile
  variant** — the three-stat header from the original prototype was designed
  for desktop width; on mobile this should either abbreviate (numbers only,
  no labels) or move into a collapsible drawer rather than wrapping onto a
  second line.
- **League table and vidiprinter reveal (§10) need small-screen treatment**
  — the standings table has 8 columns, too wide for 375px at a readable
  font size. Either horizontal scroll with the club name column pinned, or a
  condensed mobile view (position, club, points, form) with a tap-to-expand
  for the full row. The vidiprinter log itself is single-column text and
  should be fine as-is.
- **Respect safe-area insets** (`env(safe-area-inset-*)`) for the sticky
  bottom action bar, so it doesn't sit under the home-indicator bar on
  notched iPhones.
- **Test at three widths minimum before calling this done:** ~375px (iPhone
  SE / small Android), ~390-430px (modern iPhone), and desktop (~1024px+).
  Tablet can be a lower priority — this isn't a tablet-first use case — but
  shouldn't visibly break.
- **The results card (§14e) needs its own explicit mobile check** — take an
  actual screenshot on a ~375-430px viewport and confirm nothing's cropped,
  the watermark is legible, and it doesn't need a scroll. This is the one
  screen where mobile layout directly determines whether the growth loop
  works at all, not just whether the UI looks fine.

## 16. Playoffs (conditional path)

Only triggers if Boro finish 3rd-6th at the end of the simulated season
(§10 classify()). Deliberately scoped down from "full player stats and a
proper XI pick" — that version needs a real per-player stat-tracking system
(attributing goals to individuals across every simulated match, aggregating
across a season), which is disproportionate to what it buys here. This is
the cheaper version that still gets the real payoff: a second decision
point and a livelier finish, without a season-long stats architecture.

**What actually happens:**

1. On qualifying, run a **one-time, bounded calculation** — not a running
   stats system — that probabilistically attributes Boro's already-known
   season goal tally (a number the table already has) across the squad,
   weighted by position and OVR. Output: a small "Season's Top Scorer" /
   "Standout XI" snapshot. This is one function call at the moment of
   qualification, not new state tracked throughout the season.
2. Show that snapshot as part of the transition into the playoff screen —
   it's the payoff for engagement, and it's also just good copy ("Strelec's
   your top scorer with 19. Backed him all window, did you?").
3. Let the player **re-pick formation and XI** (reusing the exact §9 `xi`
   task UI, no new component) informed by that snapshot, for a two-legged
   semi-final and a final. Squad itself is frozen — no window transfers are
   possible during the playoffs, consistent with there being no January
   window (§13).
4. Simulate the three matches using the existing engine (§10) — semi-final
   is a two-legged tie (aggregate score, away-goals-irrelevant is fine to
   assume — actual EFL playoffs haven't used away goals since 2021, so this
   is accurate, not just simpler), then a single final at a neutral venue
   (no home advantage constant applied).
5. Win the final → promoted, overrides whatever grade the league table
   alone would have produced. Lose at any stage → same grade as finishing
   outside the automatic spots, with playoff-specific recap copy either
   way ("Wembley again — this time you got over the line" / "Beaten in the
   final. Some things don't change.") — the second line is a deliberate
   callback to Boro's actual current story, not filler.

**Edge cases specific to this path:**

| Edge case | Handling |
|---|---|
| Boro finish outside 3rd-6th | Skip straight to the normal Results screen (§14e) — this entire section doesn't trigger, no special handling needed beyond the existing classify() branch already returning a non-playoff result |
| Player leaves the playoff XI screen without confirming | Same task-gate pattern as §9's `taskGate.js` — playoff simulation is blocked until a legal XI is confirmed, identical rule reused, not a new one |
| Two-legged semi ends level on aggregate | Standard extra time/penalties assumption is fine to abstract — a single weighted coin-flip (using the same strength calculation as regular matches) rather than simulating actual extra time, since nobody needs penalty-by-penalty detail here |
| Results card (§14e) after a playoff run | Needs a variant that shows promotion/playoff-final-defeat instead of league position — same card, conditional content, not a second card design |

## 17. Deploy

`npm run build` → push `dist/` (or connect the repo directly) to Cloudflare
Pages or Netlify, free tier. No environment variables, no secrets, no backend
to provision. This should be a same-day deploy once the app itself is done.

## 18. Round 1 build review — fixes

v1 got built and reviewed against real screenshots. This section is the
punch list from that review, ordered bugs-first, then visual system, then
content/data, then flow, then the biggest lift last. A couple of items here
**revise** earlier sections based on what actually using it showed — noted
explicitly where that happens, rather than silently overriding.

### 18a. Actual bugs (not taste, fix regardless of anything else here)

- **Formation slot assignment is broken.** Clicking a specific pitch slot
  (e.g. right-side FW) doesn't bind the selected player to that slot —
  selections fill left-to-right regardless of which slot was clicked. The
  click handler needs to assign to the specific slot's ID/index, not push
  into the next available array position.
- **Results card has a broken string** — rendering as "free's Boro" instead
  of the manager's actual name. Almost certainly a template literal falling
  back to a placeholder value instead of state (`${name}'s Boro` where
  `name` is empty/undefined at render time) — check the name is actually
  being read from state at the point the card renders, not from a default.
- **Season-simulation screen has no clear way forward.** In testing, it
  wasn't obvious that "Skip to results" needed to be clicked — it reads as
  still-loading, not paused-waiting-for-you. Either auto-advance to Results
  once the reveal finishes (no click required at all), or make the
  affordance to continue much more obviously a required action, not an
  optional skip sitting at the bottom of what looks like a loading screen.

### 18b. Visual system (the general critique, now written down properly)

This is the root cause behind "feels cheap/amateur rather than premium" —
confirmed across every screen in review, not just one. Concrete, in
priority order:

- **No headline moment anywhere.** "THE WINDOW: BORO" sits at nav-sized
  weight in the top-left of every screen — same visual weight as
  everything else. There should be one dominant, oversized, condensed-bold
  headline per major screen (Setup, Results especially) the way KEF's
  reference has "THE WINDOW." as an actual centrepiece, not a logotype.
- **Uniform rounded corners everywhere** — buttons, cards, inputs, badges,
  progress bar segments. This is the single strongest "unstyled component
  library" signal. Move to sharp/flat corners (0px or near-0px) as a
  deliberate, consistent choice, matching the reference.
- **Default browser focus ring on the name input** — a blue outline that
  doesn't match anything else on screen. Restyle focus states to the
  palette (a red or white ring, not browser-default blue) across every
  input, not just this one.
- **Every content type uses the same card treatment.** Brief text, mandate
  options, sponsor options, task hub, stat panel — all identical
  dark-grey-box-with-border. Vary this deliberately: e.g. the cold-open
  brief shouldn't be boxed at all, just text under a real headline (matches
  the reference); reserve the boxed-card treatment for genuinely
  card-shaped content (options to choose between).
- **Completely flat, no depth anywhere** — solid black background, no
  gradient, texture, or imagery at any point except the results card. Even
  a subtle vignette or grain on the Setup/hero screen would read as
  intentional rather than default.
- **Desktop layout doesn't use the width.** Content sits in the left third
  of a 1440px+ viewport with a large unused void on the right. Either
  design deliberately for that space (KEF uses a genuine two-column split)
  or constrain the max-width and centre the content — right now it reads
  as unfinished, not minimal.
- **Setup is a 6-step wizard with a progress bar** — still not collapsed
  per the earlier ask. Name, mandate, and sponsor should be reachable
  without stepping through a linear wizard with a progress indicator; that
  pattern itself reads as generic SaaS onboarding regardless of styling.

### 18c. Content & data accuracy

- **Sponsor icons need real mockup marks, not generated initials.**
  Currently rendering as auto-generated two-letter avatar squares (EG, SD,
  366) — reads as an unfilled placeholder, not a joke brand. Build actual
  small logomarks that evoke each real brand's colour palette and rough
  silhouette. **Caution, see the note above this list:** keep the
  resemblance loose — colour and vibe, not a redrawn logo — and be most
  conservative with Nyke specifically, since the swoosh is about as
  recognisable as a mark gets and a close mimic is a meaningfully
  different risk than a spoofed name.
- **Kit system needs restructuring into equal home/away pairs**, not a
  flat list of four differently-themed one-offs. E.g. two home options,
  two away options, clearly labelled as such.
- **Custom kit builder needs real depth**, more than the original
  two-colour-plus-pattern spec: trim colour (neck and sleeves, separate
  from body colour), neck style (V-neck / crew / collar), and a pattern
  choice of band / pinstripes / plain (hoops from the original spec can
  fold into this same control). This is a bigger component than originally
  scoped — realistically wants a live SVG shirt preview that actually
  updates as each option changes, not just a set of dropdowns. Worth
  budgeting real time for; it's the one part of personalization that's
  become a genuine small feature rather than a copy/CSS token swap.
- **Player valuations need re-grounding in real data.** Confirmed example:
  Solomon Brynn is priced at £7.5m in the current build; his actual market
  value (Soccerway, FotMob) is around £2m, and he's Boro's clear #1 this
  season (48 starts, started the actual playoff final) — not a backup, as
  the price might suggest either way. This isn't a one-player fix: the
  underlying formula (deriving value from an invented OVR curve) is
  unreliable generally. Rebuild the dataset the other way round — look up
  real reported market values for every real player (Transfermarkt,
  Soccerway, FotMob) and derive OVR from that plus role/minutes, rather
  than inventing OVR first and formula-deriving a value from it.
- **"Local lad" badge is a map-pin emoji**, which reads as a location/
  distance marker, not "born here" — semantically the wrong icon family for
  what it means. Replace with a text badge in the same visual language as
  the existing SURPLUS / OVERSTOCKED / BARGAIN / UPGRADE / COVER NEEDED
  tags, e.g. "TEESSIDE", rather than an icon.

### 18d. Flow — revises §10 and §14d based on actual playtesting

Real use surfaced that part of the original reveal spec doesn't earn its
place. Worth being direct about this rather than defending the original
plan: **cut or heavily simplify the full match-by-match list and the
"elsewhere in the Championship" ticker.** Neither added anything in
practice — the streak banner (e.g. "WINLESS IN THREE") is worth keeping,
that's a real moment — but scrolling through a full 46-game list plus a
secondary ticker of other scores turned a fast, punchy reveal into
something that just looks like it's stuck. Recommend replacing that whole
screen with something closer to: a short animated counter/progress
indicator, 1-2 headline streak/moment callouts if they occur, then
automatic advance to Results — no scrollable match list, no separate
ticker, and no click required to proceed unless the person wants to skip
ahead of the animation.

- **Manager philosophy (§14c) needs a real layout pass** — currently reads
  as "jumbled" and visually flat. Give each style a distinct small icon or
  visual motif (e.g. a tight/wide variance indicator, a simple graphic
  rather than just a text card) and a clearer grid, not four identical
  text blocks in a row.

### 18e. Results card — needs a real redesign, not a fix

The direct ask: make this feel like **Spotify Wrapped**, not a stats
summary in a rounded box. That means moving away from centred-stack
text-on-a-gradient toward something with genuine composition — layered
elements, asymmetry, oversized numerals treated as graphic elements rather
than just large text, the kit/sponsor visuals (once real, per §18c)
actually integrated into the card rather than named in small text at the
top corners. This is the highest-leverage single screen to get right,
since it's the one screen designed to leave the app entirely (§14e) — worth
treating as its own dedicated design pass rather than a pass alongside
everything else, and worth doing after 18b's system-level fixes land, not
before, since it should inherit the corrected type/colour/spacing system
rather than be fixed twice.

## 19. Round 2 addendum

A second review round (after §18's fixes were partially applied) produced
a separate, standalone document — `boro-window-round2-prompt.md` — covering
a concrete, differentiated visual identity system (real font choices, not
just "pick something different"), a full structural rebuild spec for
Sell/Sign/XI modeled on what actually makes the reference work, and real
current Boro transfer-target data for the Sign screen. That file is written
to be pasted directly into Claude Code and is self-contained; this entry
just ensures anyone picking up this brief later knows it exists and should
be read alongside §18, not instead of it.
