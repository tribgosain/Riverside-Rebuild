# Riverside Rebuild — Round 10 Fix Prompt: Bridge Icon + Squad Tag Logic

Paste into Claude Code once prior rounds are confirmed done. Two unrelated
fixes combined into one prompt — do them as separate pieces of work, not
intertwined, but no need for two separate sessions.

---

## Part A — Bridge icon: missing truss, wrong gondola shape

Carried over from round9, not yet applied. The two towers are correct and
don't need rebuilding. Two remaining issues:

1. **No horizontal truss line connecting the two tower tops.** Still
   missing — this is the main gap.
2. **The gondola is currently shaped like a third mini-tower** (same
   tapering lattice-pylon shape as the two towers, sitting on the same
   baseline), rather than reading as a small hanging car. It should be
   visually distinct: smaller, a simple rectangle, hanging from a thin
   vertical line off the middle of the truss, positioned lower than the
   tower tops — not another pylon shape standing on the ground.

**Reference SVG — towers stay as they are, just add these two elements:**

```svg
<!-- Top truss — a single line connecting the two tower tops -->
<path d="M28 10 L92 10" />

<!-- Gondola — hangs from the middle of the truss via a thin vertical
     line, ends in a small rectangle. This REPLACES whatever pylon-shaped
     element is currently sitting between the towers. -->
<path d="M60 10 L60 38" />
<rect x="52" y="38" width="16" height="8" />
```

Coordinates are illustrative — adjust to match wherever the existing tower
tops actually sit. The point: the truss spans tower-top to tower-top, and
the gondola hangs from its midpoint down to roughly base-line height,
clearly smaller and visually distinct from the towers either side of it.

**Definition of done (Part A):**
- A single horizontal line visibly spans from the top of tower one to the
  top of tower two
- The middle element is a small rectangle hanging from a thin line below
  the truss, not a third tower shape sitting on the ground
- Checked at actual rendered size (header badge and 16px favicon)

---

## Part B — Squad tag logic is producing wrong, sometimes contradictory tags

Four confirmed wrong examples, spanning three different tags — this is a
logic problem, not a one-off data typo, and needs fixing at the rule
level, not patched player-by-player:

- **Recently-signed players tagged SURPLUS.** Finn Munroe and Myles
  Peart-Harris are both showing SURPLUS despite being genuinely recent
  additions — Peart-Harris signed this summer specifically. Tagging a
  player the club just brought in as "surplus to requirements" is
  self-contradictory. Fix: exclude confirmed recent signings from SURPLUS
  eligibility entirely, regardless of their stats.
- **OVERSTOCKED is firing for the majority of players.** This tag should
  only apply when a position has genuinely excess depth (meaningfully more
  players than the formation needs plus reasonable backup cover) — it
  firing broadly suggests either an inverted condition or a threshold set
  too low, likely triggering whenever a position simply has *any* backup
  at all, which is normal squad depth, not overstocking. Find the actual
  condition/threshold in the code and recalibrate so it only fires for
  positions with real, meaningful excess — recommend something like
  "more than formation-required slots + 2" as a starting threshold, tune
  from there.
- **KEY ASSET is tagged on players whose real-world future is in doubt** —
  specifically flagged: Sol Brynn and Neto Borges. Borges is confirmed
  real and worth getting right: Brazilian left-back, signed 2024 for
  around €1.5m, contract through 2027. Spent last season on loan at
  Bristol City, who explored making the move permanent — more recent
  reporting says that's now unlikely, and he's back in Boro's pre-season
  squad with Hellberg speaking positively about him but explicitly
  framing his position as "up for grabs," not settled. That's a genuine
  "future uncertain, not a nailed-on starter" situation — tagging him
  KEY ASSET contradicts it. KEY ASSET should mean "central to the club's
  actual plans," which is in direct tension with "returned from loan,
  competing for a place, previously linked away" — these shouldn't be
  able to co-occur without at least a caveat in the tag logic.

**Root cause, worth fixing properly rather than patching the four examples
individually:** tags currently appear to be derived purely from generic
stats (OVR, age, value) with no awareness of real player-specific
situational facts (recently signed, transfer speculation, contract status).
Same category of problem as the earlier valuation-formula fix (brief
§18c, the Sol Brynn value issue) — the fix there was grounding data in
real facts instead of an invented formula, and the same principle applies
here. Recommend adding an explicit situational status field to player data
(e.g. `status: 'settled' | 'recent-signing' | 'future-uncertain'`) that tag
logic actively checks against, rather than deriving tags from stats alone
with no awareness of context.

**Definition of done (Part B):**
- No player signed this summer can be tagged SURPLUS
- OVERSTOCKED only appears on positions with genuinely excess depth — spot
  check that it's no longer showing on a majority of the squad
- Sol Brynn and Neto Borges are re-tagged to reflect their real
  situations accurately — not showing KEY ASSET while their future is
  genuinely unresolved
- The underlying tag logic references real situational data, not stats
  alone — verify this by checking the actual code change, not just the
  four examples above
