# Riverside Rebuild — Round 13: Simplify the Bridge Mark, Diagnose Why Fixes Aren't Landing

Paste into Claude Code. This has failed across four prior rounds despite
exact working SVG being provided each time — treat this round as partly a
debugging exercise, not just another design tweak.

## Step 1 — before changing anything, show the current state

Find the file(s) that actually define the header badge icon and the
favicon. Paste back their exact current content. This is worth doing
first: if a previous round's edit genuinely isn't in the file, that's a
different problem (the edit didn't save, or is being made to the wrong
file) than if it's in the file but something else is overriding it at
render time (a build cache, a duplicate definition elsewhere, an old
favicon file still being served). Identify which of those it is before
making another change blind.

## Step 2 — replace with this drastically simplified mark

The gondola has been the failure point in every previous attempt — drop
it entirely rather than trying a fifth time to get it right. This is the
simplest possible version that still references the bridge: two towers, one
connecting line, nothing else.

```svg
<svg viewBox="0 0 120 56" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
  <path d="M20 50 L30 12" />
  <path d="M40 50 L30 12" />
  <path d="M80 50 L90 12" />
  <path d="M100 50 L90 12" />
  <path d="M30 12 L90 12" />
</svg>
```

Five lines total. Two towers (each just two legs meeting at a point, no
cross-bracing detail — that's also being dropped for reliability), one
horizontal line connecting the tower tops. Nothing else. This should be
close to impossible to get wrong.

## Step 3 — verify, actually

Load the app. Screenshot the header badge and the favicon at their real
rendered size. Confirm you can see two peaked shapes with a line between
them. If you can't, stop and report exactly what you see instead, rather
than saying it's done — the pattern across every previous round has been
reporting success without the change actually being visible, and that
needs to stop here.

## Note for later, not this round

A richer "Teesside skyline" mark (bridge plus the Riverside Stadium
roofline, say) is a good idea for somewhere with more room — a Setup-
screen watermark, not the header badge or favicon. Don't attempt that
here; the small-size mark needs to stay this simple for now given the
track record.

## Definition of done

- The exact current file content was shown before any edit was made
- The five-line SVG above is what's actually in the icon file after the
  edit — paste it back to confirm
- A real screenshot at actual rendered size shows two peaks connected by a
  line, not just a claim that it does
