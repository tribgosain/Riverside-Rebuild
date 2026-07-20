# Riverside Rebuild — Round 20: Sign Screen Scouting Tabs

Paste into Claude Code once round19 is confirmed done.

## The change

Restructure the Sign screen around three top-level tabs — a scouting-
category filter, sitting above the existing position filter chips (which
stay as a secondary filter within each tab, not replaced). Each target
player gets a new `tier: 'star' | 'solid' | 'project'` field.

**Stars** — high-end Championship / low-end Premier League calibre.
Genuinely aspirational signings, the kind that would be a real coup for a
Championship club. Suggested banding: OVR 75+, fee roughly £4m-£15m+,
wages to match. Of the existing real headline targets (brief §14, round
data), **Will Lankshear fits here** — Boro already bid ~£15m for him in
January, that's Stars-tier money.

**Solid** — dependable, proven, English/Championship-experienced players.
The bulk tier, sensible business rather than a statement signing.
Suggested banding: OVR 65-75, fee roughly £1m-£4m. **Josh Mulligan, David
Ozoh, Dennis Cirkin, and Daniel Jebbison fit here** — all real, English or
Scottish, Championship-level profiles, none of them a marquee name but all
legitimate depth/upgrade signings.

**Project** — younger players from foreign, less-scouted leagues:
South America, the Nordics, MLS/USA. Cheaper, speculative, higher
variance — the "hidden gem or bust" tier. Suggested banding: OVR 55-68
(lower proven floor since unproven in English football, but real upside),
fee roughly £0.3m-£2m, lower wages. **None of the existing real-sourced
targets fit this tier** — this needs genuinely new invented composite
profiles, in the same spirit as the original `market.json` seed data (real
positions and realistic valuations, invented names/backstories). Suggested
starting seed, extend from here:

- A young Brazilian or Argentine winger/forward, cheap, raw pace and
  end product still unclear
- A Scandinavian (Swedish/Norwegian/Danish) young centre-back or
  midfielder — physically ready, tactically raw
- An MLS-developed young full-back or midfielder, athletic profile,
  minimal European experience

## How this interacts with existing tags

The WILDCARD tag (round10/17) stays orthogonal to tier, not redundant
with Project — a Solid or even a Stars player could still carry WILDCARD
if there's a real reason (injury history, disciplinary risk, etc.), and
not every Project-tier player needs the tag even though the tier itself
is inherently higher-variance by definition. Keep both systems, don't
collapse them.

## UI

Three tabs (Stars / Solid / Project) as the primary control at the top of
the Sign screen, above the existing GK/DF/MF/FW filter chips, which
remain available within whichever tab is active. Brief/Squad Needs
sidebar (round19 fix) stays in place above the list regardless of which
tab is selected.

## Definition of done

- Every Sign-screen target has a tier assigned, no unclassified entries
- Lankshear is Stars; Mulligan, Ozoh, Cirkin, and Jebbison are Solid
- At least a handful of genuinely new Project-tier composite targets exist
  across South American, Nordic, and MLS profiles
- Tabs work as the primary filter, position chips still function within
  each tab
- Brief/Squad Needs sidebar position from round19 is unaffected by this
  change
