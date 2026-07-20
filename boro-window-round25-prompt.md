# Riverside Rebuild — Round 25: Hero Polish, Scroll-to-Top

Paste into Claude Code. Now live and deployed, this is post-launch polish.

## 1. Photo credit caption — redesign, don't just resize

Currently a separate, fairly large, centered italic line below the hero
photo, taking up its own row of vertical space and reading as
disconnected from the rest of the page's type system. Fix:

- **Reuse the app's existing small-label style** — the same treatment
  already used for "THE BRIEF" and "YOUR NAME" (small caps, letter-spaced,
  muted grey, the mono font). Don't invent a separate italic treatment for
  this; it should look like it belongs to the same design system, not a
  different one bolted on.
- **Move it into the photo itself as a small overlay**, bottom-right
  corner, rather than a separate line below the image. Add a subtle dark
  gradient/scrim behind just that corner of the photo so the small text
  stays legible against the image regardless of what's underneath it.
- Much smaller than current — this should read as a quiet, easy-to-miss
  credit, not a second line of body copy.

## 2. General hero composition tightening

While in there: check the fade/vignette at the bottom edge of the hero
photo — in the current deploy it reads as a bit soft/undefined rather
than a clean, deliberate transition into the page background. Tighten
this so the photo-to-page transition looks intentional. Also check
overall vertical spacing between the photo, the kicker line, and the
headline — make sure it reads as one considered composition, not stacked
elements with inconsistent gaps.

## 3. Scroll position doesn't reset on screen transitions — fix everywhere, not just one instance

Reported specifically on Landing → Decisions (after entering a name and
pressing the CTA, the next screen doesn't start at the top). **This is
very likely systemic** — check every screen transition in the app
(Landing→Decisions, Decisions→Sell, Sell→Sign, Sign→XI, XI→Simulating,
Simulating→Results), not just the one that was reported, since this is
the kind of missing behaviour that's probably absent everywhere rather
than broken in one specific spot. Add a scroll-to-top on every screen
change — either a global fix at the router/screen-change level if there's
a single point all transitions pass through, or explicitly on each
transition if there isn't.

## Definition of done

- Photo caption uses the existing label typographic style, sits as a
  small overlay on the photo itself, not a separate line below it
- Hero photo's bottom edge fade looks clean and deliberate
- Scroll resets to top on every screen transition in the app, verified by
  actually testing more than just the one reported instance
