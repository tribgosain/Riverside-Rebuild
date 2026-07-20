# Riverside Rebuild — Round 26: Landing Screen, Real Layout Fix

Paste into Claude Code. This addresses the actual root cause of the
Landing screen feeling unprofessional, not another round of small tweaks.

## 1. Fix the desktop layout void — the real priority here

On desktop widths, the content block (kicker, headline, girder rule,
brief, name input) is left-aligned with a large empty void of cream
background on the right. This was flagged early in this project's design
review and never actually landed on this specific screen. This is the
single biggest thing making the page read as unfinished on desktop.

**Fix: constrain the content to a centred column with a sensible max-width**
(something like 900-1000px), with balanced space on both sides rather than
all the unused space sitting on one side only. This is the safer, lower-
risk fix — it doesn't require new content, just correct constraint.

**If there's appetite for more**, a genuine two-column layout is a
stronger result: left column keeps the headline/brief/name-input as now,
right column holds real supporting content — e.g. a small "last season"
stat card (playoff final defeat, final position, points — pulls from data
already established in this project's brief) styled like a newspaper
sidebar box. Only do this if the centred-column fix isn't enough on its
own; don't add a right column with filler content just to fill space.

## 2. Establish one consistent vertical spacing scale, apply it throughout

Currently the gaps between kicker → headline → girder rule → "THE BRIEF"
label → quote → "YOUR NAME" label → input feel arbitrary rather than
considered. Pick one spacing scale (e.g. a simple 8/16/24/32/48px system)
and apply it consistently to every gap on this screen, rather than each
gap being sized independently. This is what makes rhythm read as
deliberate rather than improvised — the actual sizes matter less than
using the same scale consistently throughout.

## 3. Refine the girder motif

Currently reads as a stray broken line rather than a deliberate mark.
Either give it more visual weight/confidence (thicker, more clearly
intentional) or reconsider its placement so it has a clearer relationship
to the elements around it — right now it sits somewhat ambiguously
between the headline and the brief section without a clear job to do.

## 4. Smooth the photo caption scrim

The dark gradient behind the bottom-right photo credit currently has a
visible hard edge rather than blending smoothly into the image. Extend
the gradient's falloff so it reads as a natural darkening of that corner,
not a rectangular patch placed on top.

## Definition of done

- Content block on desktop is properly centred/constrained, no large
  one-sided empty void — check at a genuinely wide viewport (1440px+),
  not just the width it's been eyeballed at before
- Spacing between every element on this screen follows one consistent
  scale, not independently-chosen gaps
- Girder motif reads as a deliberate design element, not a stray line
- Photo caption scrim blends smoothly, no visible hard edge
