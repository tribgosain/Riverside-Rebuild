# Riverside Rebuild — Round 17: Kit Flow, Defaults, Navigation, Balance, Sharing

Paste into Claude Code once round16 is confirmed done. Seven items, roughly
ordered from quick fixes to the one requiring real testing (item 6).

## 1. Require both a home AND away kit selection

Currently kit selection appears to be one flat choice. Split into two
required picks: **Home Kit** and **Away Kit**, each from the relevant
presets. **"Design your own" should sit within the Home Kit section**,
alongside the home presets — not as a separate global option.

## 2. Nothing pre-selected by default, anywhere in Setup

Board mandate, kit sponsor, home kit, away kit, manager philosophy — all
of these should load with **no option pre-highlighted**. The person must
actively choose each one. The "Take charge" CTA should stay disabled
until every required choice has actually been made, not just the name
field — same principle already applied to the name input, extend it to
cover all Setup decisions.

## 3. Easier back-navigation between Sell / Sign / XI

Currently going backward through these steps is more awkward than it
should be. Make the step indicator itself navigable — clicking "1 SELL" or
"2 SIGN" from any point should jump straight there, not just a linear
"Back" button that only steps one screen at a time. Standard breadcrumb/
stepper behaviour: any completed or current step is clickable.

## 4. Micah Hamilton — confirmed wrong tag

Tagged KEY ASSET currently, shouldn't be — same category of issue as
round11. Confirmed real: he's not in Boro's pre-season squad this summer,
hasn't scored in 21 Championship appearances, is well down the pecking
order under Hellberg, and is widely expected to leave this window (loan
or permanent — Man City hold a buy-back clause from his original transfer).
Remove KEY ASSET. While in there, his real market value is roughly €1.8m
(Transfermarkt) — worth checking the in-game figure against that too,
same as the Sol Brynn and McGree checks in earlier rounds.

## 5. Results-page closing line doesn't make sense — replace with a real recap

Currently pulling from what sounds like a generic quote bank that doesn't
reliably match the actual season that happened. Replace with a short,
**generated recap paragraph** built from the actual season data: finishing
position, record, any notable streaks, the standout signing or top
performer, whether the sell-on windfall event fired, and whether it ended
in promotion or a playoff defeat if relevant. This should read as "here's
what actually happened," not a mood-matched one-liner pulled from an
unrelated pool.

## 6. Engine balance — top-6-or-better every time, needs real testing

Every simulation run so far has finished top 6 regardless of transfer
decisions, which suggests squad-building choices aren't meaningfully
affecting the outcome — a real balance problem, not a small tweak.
Likely cause: Boro's starting best-XI strength (from `squadStrength()` in
the engine) may simply be calibrated higher than most of the division's
opponent tiers in `CLUBS`, meaning the club starts favoured regardless of
what the player does in the transfer window.

**This needs actual testing to fix, not just a code change reported as
done:**

- Compare Boro's baseline best-XI average OVR against the full spread of
  opponent tier values — if Boro's default is already sitting above most
  of the division, that's the root cause, fix by rebalancing either the
  tiers or the strength formula so Boro starts mid-table, not
  pre-favoured
- Run the simulation multiple times with a **deliberately weakened**
  squad (sell key players, sign nothing, leave the wage cap unused) and
  confirm a bottom-half or relegation-threatened finish is actually
  reachable — if it isn't, the variance and/or baseline still needs
  further widening
- Run it again with a **deliberately strengthened** squad and confirm
  top-2 automatic promotion is reachable
- Report back the actual range of finishing positions observed across
  several test runs at both extremes, not just a claim that variance was
  increased

## 7. Add a native "Share to X" button on the Results screen

Alongside the existing "Copy result text" / "Copy challenge link" buttons,
add a proper share-to-X button using the standard web intent URL —
`https://twitter.com/intent/tweet?text=<encoded result text>&url=<encoded
site url>`, opened in a new tab. No API or backend needed, this is a
plain link.

## Definition of done

- Home and away kit both required, Design Your Own sits under Home Kit
- Nothing in Setup is pre-selected; CTA gated on all choices being made
- Step indicator is clickable for navigation between Sell/Sign/XI
- Hamilton's tag and value corrected
- Results recap is generated from actual season data, not a mismatched
  quote bank
- Engine balance actually tested at both extremes with real simulation
  runs, results reported, not just claimed
- Share-to-X button present and functional on Results
