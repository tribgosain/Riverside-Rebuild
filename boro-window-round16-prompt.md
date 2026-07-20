# Riverside Rebuild — Round 16: Glossy Setup Hero, Newsprint-Treated Photo

Paste into Claude Code once prior rounds are confirmed done.

## The goal

Make the Setup screen feel richer and more "glossy" without reverting to
KEF's saturated dark-photo-hero pattern — the whole reason this app moved
to a cream/newsprint identity was to be visibly different from that. The
way to add photographic richness *without* re-copying that pattern: treat
the photo like an actual halftone newspaper photograph, not a full-colour
hero image.

## Source image — real, licensed, don't generate or approximate one

**https://commons.wikimedia.org/wiki/File:Middlesbrough_riverside_stadium.jpg**
— aerial photo of the Riverside Stadium, photographer Arne Müseler,
licensed CC BY-SA 3.0 DE.

Also worth checking, in the same Wikimedia Commons category
(**commons.wikimedia.org/wiki/Category:Riverside_Stadium**): a photo
titled "The Riverside Stadium seen from the Transporter Bridge" — if
usable, this ties two established landmarks into one image rather than
one. Either works; pick whichever crops better for a wide hero treatment.

**Licence terms, don't skip this:** CC BY-SA requires (1) visible
attribution to the photographer and licence, and (2) that a modified
version, if redistributed, carries a compatible licence. For our use, the
practical requirement is a real, visible photo credit — not buried in a
footer nobody reads. Newspapers caption their photos directly beneath
them; do the same here: a small italic caption line under the image
("Riverside Stadium — Arne Müseler, CC BY-SA 3.0 DE, via Wikimedia
Commons") is both compliant and correctly on-brand for this design
language.

## Treatment — duotone halftone, not full colour

1. Convert the photo to **duotone**: shadows mapped to the app's ink
   colour (#1A1714), highlights mapped to the cream background colour
   (#F2ECE1) — this alone will make it look considered rather than a
   stock photo dropped in.
2. Overlay a **subtle halftone dot pattern** — small, consistent dot
   texture across the image, mimicking actual newspaper photo
   reproduction. This can be a CSS/SVG pattern overlay at low opacity
   rather than needing to bake it into the image file itself, which
   keeps it easy to adjust.
3. **Fade the bottom edge into the page background** — a gradient from
   the photo into solid #F2ECE1, so it transitions smoothly into the rest
   of the Setup screen rather than having a hard edge.

## Layout

Photo sits as a hero band at the top of Setup, full width. Everything
already built — the "MIDDLESBROUGH · SUMMER 2026" kicker, the "RIVERSIDE
REBUILD." headline, the girder motif, "THE BRIEF" pull-quote, and the name
input — stays exactly as it is, just sitting below or overlaid on this
new photo band rather than on plain cream background at the very top.
Don't redesign those elements, this round is purely about adding the
photo treatment above/behind them.

## Definition of done

- The actual Wikimedia Commons photo is used, not a generated or
  approximated substitute
- Duotone + halftone treatment applied — should read as a newspaper
  photograph, not a colour hero image
- Photo credit caption visible directly under/near the image, not just in
  a footer
- Existing headline/brief/name-input elements are unchanged, just
  repositioned relative to the new hero band
- Checked at both desktop and mobile widths — a wide hero photo needs
  verifying it doesn't awkwardly crop or dominate the screen on a phone
