# Riverside Rebuild — Round 7 Fix Prompt: Transporter Bridge Icon

Paste into Claude Code once prior rounds are confirmed done.

## The problem

The current header icon (two vertical blocks with a ladder/grid pattern
inside them) doesn't read as the Tees Transporter Bridge at all — no
connecting truss, no hanging gondola, just two generic pillar shapes.

## What the real structure actually looks like

Confirmed from a real photo and general references: two tapering lattice
towers (four-legged, cross-braced, wider at the base than the top), a
horizontal lattice truss connecting the tops of both towers, and — the
single most distinctive and most commonly-missed feature — a gondola/car
that hangs on vertical cables well below that top truss, down near
road/water level, not up near the towers. It's genuinely described as "a
giant crane-like structure, a cross between a ferry and a bridge" — the
silhouette should read as heavy ironwork, not a delicate arch or a
suspension bridge's sagging cables.

## Build spec — thin-line outline, matching existing icon style

Keep the stroke weight consistent with the current sponsor/pictogram icons
already in the app (same line thickness, same visual family) — this
should look like it belongs next to them, not like a different illustration
style dropped in.

**Construction, simplified for small size:**

1. **Two towers** — each a pair of vertical lines that lean slightly
   outward at the base and taper inward toward the top (not perfectly
   parallel — the real towers taper). Add one or two short diagonal lines
   between each pair to hint at the lattice cross-bracing without trying to
   draw the full X-pattern — at this size, a hint is enough, more than that
   will just turn to visual noise.
2. **One horizontal line** connecting the tops of both towers — the top
   truss/gantry. Keep it level, not curved or sagging.
3. **A short vertical line (or two close parallel lines) hanging down**
   from around the midpoint of that top horizontal line, ending in a small
   rectangle — the gondola. This needs to hang genuinely low, at or near
   the bottom of the icon's bounding box, well below the towers'
   midpoint — that low hang is what makes it recognizably *this* bridge
   rather than a generic bridge icon. Don't compromise this detail even
   under space pressure; it's the one feature that actually differentiates
   it.
4. Optional, only if it doesn't crowd the icon: a short horizontal baseline
   at the very bottom to ground the shape.

**Two sizes, two treatments:**

- **Header badge** (next to the "Riverside Rebuild" wordmark) — this can
  use a wider, non-square bounding box, since the bridge's real proportions
  are much wider than tall. Don't force it into a square and squash the
  towers together; let it sit as a small landscape-oriented mark. Include
  all four elements above.
- **Browser tab favicon** — conventionally square and rendered as small as
  16px, which is too small to hold all four elements cleanly. At this
  size, it's fine to simplify further: towers + top truss is enough: drop
  the hanging gondola if including it turns to mush at 16px. Test at
  actual favicon size before finalizing, not just at the size it's authored.

## Definition of done

- Header badge shows towers, top truss, and the low-hanging gondola —
  check the gondola specifically, it's the detail most likely to get lost
  or shortcut
- Favicon is legible as a bridge-like shape at actual 16px size, tested at
  that size, not just visually approximated
- Line weight matches the existing icon set already in the app
