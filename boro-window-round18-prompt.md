# Riverside Rebuild — Round 18: Split Setup into Landing + Decisions

Paste into Claude Code once round17 is confirmed done.

## The change

Setup is currently one long scroll — hero photo, headline, brief, name
input, board mandate, kit sponsor, all stacked on the same screen. Split
this into two distinct screens:

**Screen 1 — Landing.** Shows only: the hero photo (with its caption),
the "MIDDLESBROUGH · SUMMER 2026" kicker, the "RIVERSIDE REBUILD."
headline, the girder motif, "THE BRIEF" pull-quote, the "YOUR NAME" input,
and the CTA button. Nothing else. This should feel like an actual landing
page — a clean first impression, not the start of a form.

**Screen 2 — Decisions.** Reached by entering a name and pressing the CTA
on Screen 1. Shows: Board mandate, Kit sponsor (home + away + design your
own, per round17's structure), and Manager philosophy. All still load
unselected per round17's rule — nothing pre-picked. This screen's own CTA
(gated on every decision being made, also per round17) is what actually
proceeds into Sell.

## Notes

- This is a hard split, not a scroll position or an accordion — Screen 1's
  content shouldn't be visible/scrollable-to while on Screen 2, and vice
  versa.
- The name entered on Screen 1 should carry forward and display somewhere
  on Screen 2 (e.g. in the header, once the header pattern from Sell/Sign/
  XI applies here too) so it's clear whose window this is throughout.
- Not required, but worth doing if it's easy: a way to go back from Screen
  2 to Screen 1 to change the name, rather than only forward navigation.

## Definition of done

- Landing screen shows only photo, headline, brief, name input, and CTA —
  no decision cards visible
- Entering a name and pressing the CTA transitions to a distinct Decisions
  screen, not a scroll position on the same page
- Decisions screen contains mandate, sponsor, and philosophy, all
  unselected by default
- Name carries over and is visible on the Decisions screen
