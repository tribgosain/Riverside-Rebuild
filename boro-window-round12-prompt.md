# Riverside Rebuild — Round 12 Fix Prompt: Bridge (Complete Rebuild) + Fry Data Bug

Paste into Claude Code once round11 is confirmed done.

## Part A — Bridge icon: stop merging, replace it wholesale

This has now been asked for across three prior rounds without landing —
worth changing approach rather than trying the same fix a fourth time.
Below is a **complete, standalone icon component**, not pieces to merge
into whatever exists. Find wherever the current bridge icon is defined and
**replace the whole thing** with this:

```svg
<svg viewBox="0 0 120 56" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
  <!-- Tower 1 -->
  <path d="M18 50 L28 10" />
  <path d="M38 50 L28 10" />
  <path d="M21 34 L35 34" />
  <path d="M18 50 L38 50" />

  <!-- Tower 2 -->
  <path d="M82 50 L92 10" />
  <path d="M102 50 L92 10" />
  <path d="M85 34 L99 34" />
  <path d="M82 50 L102 50" />

  <!-- Top truss connecting both tower tops -->
  <path d="M28 10 L92 10" />

  <!-- Gondola: hangs from the middle of the truss -->
  <path d="M60 10 L60 38" />
  <rect x="52" y="38" width="16" height="8" />
</svg>
```

**After making this change, verify it actually took effect** — don't just
report that the edit was made. Actually load the app, look at the header
badge and the favicon at their real rendered size, and confirm you can
see: two towers, a horizontal line connecting their tops, and a small
rectangle hanging below the middle of that line. If any of those three
things aren't visibly there, the change didn't land correctly and needs
to be debugged before moving on — check whether there's a build cache,
duplicate icon definition elsewhere in the codebase, or an SVG file being
served from a different location than the one that got edited.

## Part B — Dael Fry is showing as available, and he shouldn't be

This is confirmed, fully reported, not ambiguous: Fry's Boro contract
expired June 30, and he signed a free transfer to Birmingham City on a
three-year deal (through 2029) on July 2nd. He is not a Boro player and
not a realistic target — he plays for a Championship rival now. The
game's own opening brief already says "Fry's gone," so him still
appearing as purchasable directly contradicts the app's own premise.

**Fix:**

- Remove Dael Fry from every data source he might appear in — squad data
  (he should already have been excluded per brief §6, verify he actually
  was) and the Sign-screen target list (verify he isn't there either,
  which would be a separate, worse bug — presenting a rival club's
  player as signable).
- **Audit the rest of the confirmed-departed list while in there** —
  this is the second time a confirmed-gone player has resurfaced (Hackney
  was the first, back in the original squad corrections). Check that
  Hackney, Darragh Lenihan, and Alex Gilbert are also fully absent from
  both squad and sign-target data, not just Fry. If Matt Targett's status
  was never resolved from the earlier flag in round2, resolve it now too.

## Definition of done

- Bridge icon visibly shows two towers, a connecting truss, and a hanging
  gondola — verified at actual rendered size, not just in the source code
- Dael Fry does not appear in squad data or the Sign target list anywhere
- Hackney, Lenihan, Gilbert, and Targett's status all spot-checked while
  in the data, not just Fry
