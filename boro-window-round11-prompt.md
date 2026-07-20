# Riverside Rebuild — Round 11 Fix Prompt: Tag Logic Still Misfiring

Paste into Claude Code once round10 is confirmed done. Five more confirmed
wrong tags, same underlying problem as round10's Part B — the fix there
didn't fully land, or wasn't strict enough. This round adds a concrete
self-consistency rule so this stops being a whack-a-mole of individual
player patches.

## Five confirmed wrong tags

- **Jeremy Sarmiento (LW, £4.3m)** — tagged KEY ASSET, but his own
  scouting blurb says "Pace to burn, end product still developing." A
  permanent signing this summer with an explicitly unproven end product
  is not a key asset yet, regardless of potential. Remove the tag.
- **Leo Castledine (AM, £1.7m)** — tagged KEY ASSET. 20-year-old academy
  player, low value, blurb reads as a development prospect ("presses well
  for a No.10, good engine off the ball"), not an established first-team
  fixture. Remove the tag.
- **Riley McGree (CM, £3m)** — NOT tagged KEY ASSET, should be. Checked
  against real data: his actual market value is genuinely around €2-3.5m
  depending on source, so the £3m price is roughly accurate already, no
  need to inflate it. What's wrong is the tag: he's been at Boro since
  2022, contract through 2028, established and proven — this is a squad-
  importance gap, not a valuation gap. Add KEY ASSET.
- **Law McCabe (CM, £0.1m, TEESSIDE)** — tagged SURPLUS. 20-year-old
  academy player. Being cheap and young is not the same as being surplus
  to requirements — if anything it's the opposite signal, a development
  asset worth keeping rather than selling. Remove the tag.
- **Alex Bangura (LB, £0.6m)** — tagged KEY ASSET, but his own blurb says
  "Solid one-v-one, limited going forward" — a mixed, hedged assessment,
  not a ringing endorsement. He also has real injury history (an Achilles
  injury that required surgery and kept him out for the majority of a
  season) which further undercuts "key asset." Remove the tag.

## The actual fix — a self-consistency check, not five individual patches

Round10 already added recency-awareness (don't tag recent signings
SURPLUS). This round adds the piece that's still missing: **the tag logic
needs to check its own generated flavour text for hedging/limiting
language before applying KEY ASSET, and check age/value together before
applying SURPLUS**, rather than deriving each tag independently with no
cross-check.

Concretely:

- **KEY ASSET should require all of:** not a recent signing (already
  covered), some minimum real tenure/experience at the club (not a
  brand-new academy graduate or first-window signing), and — new this
  round — **the player's own scouting blurb must not contain hedging
  language** ("still developing," "limited going forward," "needs a
  stronger runner alongside," similar). If the blurb hedges, the tag
  shouldn't fire, full stop — this is the exact contradiction present in
  three of the five examples above.
- **SURPLUS should require:** not a recent signing (already covered), and
  — new this round — **not simultaneously young** (suggest age ≤21 as a
  floor) **unless there's a genuine, explicit reason beyond low value**
  (e.g. a real positional log-jam). Cheap-and-young should never be
  sufficient on its own to trigger SURPLUS.

This should be implemented as an actual check in the tag-generation logic
— e.g. generate the candidate tag, then verify it doesn't contradict the
player's own blurb or basic profile (age, tenure) before applying it —
not as a list of named-player exceptions. Named exceptions are exactly
what's produced this whack-a-mole pattern across two rounds now.

## Definition of done

- All five players above show the corrected tag state
- Spot-check at least three *other* players not listed here to confirm the
  self-consistency rule is actually catching contradictions generally, not
  just resolving the five named cases
- Verify by reading the actual tag-generation code that a check now exists
  comparing the tag against blurb/age/tenure, not just that the five
  examples happen to look right in the UI
