# Riverside Rebuild — Round 23: Native Mobile Share, More Targets, Real Grade Bands

Paste into Claude Code once round22 is confirmed done.

## 1. Use the Web Share API on mobile, not just clipboard-copy

Current Share button (round21) copies the image and opens X in a new tab
— works, but on mobile there's a better native mechanism that also solves
the "how do I save this to my phone" question in the same motion.

**Feature-detect `navigator.share` with file support:**

```js
if (navigator.canShare && navigator.canShare({ files: [imageFile] })) {
  await navigator.share({
    files: [imageFile],
    text: shareText,
  });
} else {
  // existing clipboard-copy + open X tab fallback for desktop
}
```

On supporting mobile browsers (iOS Safari, Android Chrome), this opens
the real OS-level share sheet — the same one used sharing a photo from
the camera roll. From there: "Save Image" saves directly to Photos, and
tapping the X app icon (if installed) hands the image directly to the X
app itself, no manual paste required. This is a genuinely better result
than the desktop flow, not just a different one — implement it as the
primary path on mobile, keep the existing clipboard/open-tab approach as
the desktop fallback where Web Share's file support isn't available.

Test on an actual phone, not just responsive dev tools — Web Share API
behaviour doesn't reliably simulate in desktop browser emulation.

## 2. More Sign targets across all three tiers, not just Stars/Project

Solid tier likely also needs expansion, not just the two flagged
previously. Aim for a healthy minimum — suggest at least 8 targets per
tier across relevant positions. Continue the established pattern: a
handful of real, sourced names anchor each tier (already have several),
the rest are invented composites in the same style as the original
`market.json` seed data. Invented depth is the expected norm here, not a
shortcut — real transfer gossip for a single Championship club's window
only stretches so far before further "real" additions would mean
inventing specificity that isn't actually reported anywhere.

## 3. Grade bands — calibrated against real simulation data, not a narrative guess

The original problem stands: Boro reached the playoff final last season —
established fact, already in the app's own cold-open copy — and grades
that treat a mediocre finish as "in line with expectations" ignore that.
**But the first attempt at fixing this (an earlier draft of this same
prompt) was itself miscalibrated, and it's worth knowing why**, since it
matters for getting this right the first time: a real 25-run balance test
was performed through the actual app UI before this prompt was finalized.
Results:

```
Strong squad (Backed mandate, every affordable Stars+Solid upgrade,
  auto-picked XI): 25 runs, average position 7.28, range 4th-12th,
  only 7 of 25 runs (28%) actually reached the playoffs.

Weak squad (sold the 9 best players, signed nothing, auto-picked XI):
  25 runs, average position 19.84, range 16th-24th.
```

Zero overlap between the two distributions — strong squad's worst result
(12th) beat weak squad's best (16th) in every run. The engine itself is
correctly balanced; squad quality clearly and reliably drives outcome.

**What this data reveals for grading specifically:** even with genuinely
optimal play on the top mandate, missing the playoffs is the *normal*
outcome (72% of strong-squad runs), not a failure. Bands must reflect
that reality, not a narrative assumption about what "should" be
achievable. Use this table instead:

```
Position    Backed    Sensible    SCR Watch
1st-2nd     A+        A+          A+
3rd-8th     A         A           B
9th-13th    B         B           B
14th-18th   C         C           C
19th-24th   D/F       D           D
```

This covers strong-squad's real observed range (4th-12th) with A/B
grades, since that range is what good play actually produces, while
still cleanly separating from weak-squad's real observed range
(16th-24th) at the bottom. 13th-15th is a middle zone neither
distribution actually hit in testing, graded as a plain C.

Update the grade-explanation text from round22 to match this — it should
correctly reflect that missing the playoffs on a strong budget is common
even with good play, not automatically a poor result, while a genuinely
bottom-half or worse finish still reads as clearly below expectations.

## Definition of done

- Web Share API implemented and tested on an actual phone, with desktop
  fallback intact
- All three Sign tiers have a genuinely healthy target count, not just
  Stars/Project touched
- New grade bands implemented exactly as the table above, verified by
  checking that a 12th-place Backed-mandate result now grades as A (it's
  within the real observed range of strong play), and that a genuinely
  bottom-half finish (14th+) still grades as clearly below expectations
