# Riverside Rebuild — Round 15: Use a Real Licensed Icon, Stop Hand-Coding

Paste into Claude Code. This replaces both the bridge and the hand-coded
lion attempts with an actual pre-made, properly licensed icon.

## Source

**https://game-icons.net/1x1/lorc/lion.html** — a lion icon by artist
Lorc, licensed CC BY 3.0. Free to use commercially, requires attribution.

If you have live web access, fetch the SVG directly from that page. If
not, ask me (the person you're working with) to download it manually and
drop it into the project folder, then pick up from there.

Optionally check **https://game-icons.net/tags/lion.html** for other lion
poses from the same library if this specific one (a roaring lion head,
not a rampant pose) isn't the right fit — same license terms apply across
the site, any of them are safe to use the same way.

## What to do with it

1. Download the actual SVG file, don't try to recreate it by hand.
2. Recolor its fill to the app's existing red token (the same red used
   for "REBUILD" in the wordmark) — this is a simple fill-colour change on
   a real vector file, not a redraw, so it should be reliable.
3. Add attribution somewhere appropriate and unobtrusive — the footer
   (which already carries the "unofficial fan project" disclaimer) is a
   sensible spot. Something like: "Lion icon by Lorc, game-icons.net
   (CC BY 3.0)."
4. Replace both the header badge and the favicon with this icon, removing
   the bridge and hand-coded lion attempts entirely.

## Verification

Same requirement as every round on this — show a real screenshot at
actual rendered size for both the header badge and 16px favicon, checked
in an incognito window, before reporting this as done.

## Definition of done

- The actual downloaded game-icons.net SVG is what's in the codebase, not
  a hand-coded approximation of it
- Recoloured to the app's red
- Attribution credit visible somewhere in the app (footer is fine)
- Verified at real size, in incognito, with an actual screenshot shown
