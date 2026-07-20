# The Window: Boro — Round 4 Fix Prompt

Paste directly into Claude Code, same repo. Single focused issue: the nine
sponsor marks are generic Lucide-style pictograms (a newspaper icon, a
flame, a lightning bolt, a padlock) representing a vague *concept* rather
than evoking the *specific real brand* each one is parodying. Fix all nine.

**Build these as inline SVG** (React components or inline SVG strings), not
external image files — no hosting needed, stays at £0 to deploy, and they'll
stay crisp at any size.

**Trademark caution still applies** (see brief §18c) — the brief here is
*evoke*, not *recreate*. Palette, rough shape language, and typographic
feel should read as "clearly parodying X," not be a redrawn version of X's
actual protected mark. Nyke needs the most care, noted below.

## Per-sponsor spec

**Evening Gazette** (real, local) — this one isn't a parody, it's an actual
local paper being referenced respectfully. A clean masthead-style wordmark
is enough: serif or slab serif, black or navy ink, title case, maybe a
thin rule above or below it like a real newspaper nameplate. Drop the
document icon entirely — a wordmark alone reads more authentically
newspaper-like than an icon-in-a-box.

**Manjarro's** (real, local) — the flame mark is actually already the right
idea for a peri-peri chain. Refine it: pair the flame with a proper
wordmark lockup (flame mark + "Manjarro's" in a warm, casual script or
rounded sans) rather than flame-icon-alone in a plain square.

**Sports Direkt** (parody of Sports Direct) — drop the lightning bolt, it
has nothing to do with the real brand. Sports Direct's actual identity is
a bold, condensed, high-contrast wordmark, usually blue — utilitarian,
discount-retail energy, not athletic-icon energy. Build it as a bold
condensed wordmark lockup ("SPORTS DIREKT"), not an icon at all.

**Bet366** (parody of bet365) — closer to right already: green, rounded.
Refine into an actual wordmark-in-pill lockup — "bet366" in soft rounded
lowercase lettering, white on green, matching the real brand's soft rounded
typographic feel — rather than a plain number badge that doesn't read as
a logo.

**Greggo's** (parody of Greggs) — currently wrong shape entirely (reads
as headphones/a steering wheel). Greggs' actual identity is a navy
oval/shield badge with a gold or yellow script wordmark inside. Rebuild as
a navy badge shape with a gold script-style "Greggo's" wordmark inside —
bakery-badge energy, not tech-icon energy.

**Emirate Airways** (parody of Emirates) — reasonably close in spirit
(gold, a swoosh). Refine: gold/tan field, a simple elegant swoosh or wing
mark (abstract, not a literal copy of Emirates' specific calligraphic
mark), paired with a clean wordmark — airline livery feel, understated,
not cartoonish.

**cryptonite.io** (fully invented, no real brand to evoke) — lowest
priority, current treatment is roughly fine. If touching it, lean into
generic "try-hard crypto startup" visual language — an abstract faceted/
angular polygon mark, gradient background, lowercase geometric sans
wordmark.

**Just Eaten** (parody of Just Eat) — currently a padlock, which has no
connection to the real brand at all. Just Eat's actual identity is an
orange/coral field with a simple white cutlery or takeaway-bag mark.
Rebuild with an orange/coral background and a simple white fork-and-spoon
or takeaway-bag icon, paired with a rounded wordmark.

**Nyke** (parody of Nike) — **most caution needed of all nine**, per §18c.
Currently under-designed (a plain black square with "N," doesn't evoke
anything, which is safe but also doesn't do its job as a sponsor joke).
Right balance: bold black-and-white minimal treatment (correct athletic-
brand *language*) with an abstract angled check/tick mark that gestures at
"swoosh energy" without reproducing the swoosh's actual curve or
proportions — a straight or gently-angled checkmark shape, not a redrawn
swoosh. Paired with "NYKE" in a bold condensed sans. This is the one to be
most conservative on if in doubt.

## Definition of done

- All nine sponsor cards show a real SVG mark, not a Lucide icon standing
  in for a concept
- Nothing here is a close redraw of a real logo — check Nyke specifically
  against this before calling it done
- Marks are inline SVG, no external image requests
