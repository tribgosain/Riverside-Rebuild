# Riverside Rebuild — Round 22: Quote Diagnostic, Share Microcopy, Real Balance Test

Paste into Claude Code once round21 is confirmed done.

## 1. The results quote — diagnose properly this time, don't just retry

This has been asked for three times and is still showing. Same lesson as
the bridge icon saga: stop guessing and diagnose first.

- Find and paste back **every** piece of code on the Results screen that
  generates or displays any text beyond the hard stats (record, points,
  grade, position). There may be more than one source — an original
  mandate-flavour quote, a "recap paragraph" attempt from an earlier
  round, and a grade-based line could all exist simultaneously, with fixes
  in past rounds only ever touching one of them while another kept
  showing.
- Remove all of them. Confirm with an actual screenshot of a real result
  afterward — not a claim, an image.

**Also, make the grade itself clearer while in there.** Add a short,
plain explanation of *why* that grade was given — tied directly to the
real grading criteria (finishing position relative to the chosen board
mandate, per brief §10's grade bands), not vague flavour text. E.g.
something like "9th on a Sensible mandate — mid-table, in line with
expectations" or "12th on a Backed mandate — below what the board backed
you to deliver." This should read as a transparent explanation of the
actual scoring logic, not another quote-bank line — which also directly
helps with the fairness question in item 3 below, since seeing the real
criteria makes the grade feel earned rather than arbitrary.

## 2. Share button needs clear microcopy explaining the two steps

The Share button (round21) generates the card image, copies it, and opens
X — but nothing currently tells the person that's what's happening or
that they need to paste it themselves. Add clear, brief copy: something
visible before or immediately after the click, e.g. "Downloads your
result card — paste it into the X post that opens." This isn't a
technical change, just making the real two-step process (which is a
genuine platform limit, not a bug) legible to the person using it, so it
doesn't feel broken or confusing.

## 3. Is squad strength actually correlated with results? Test it properly

Real concern, worth real evidence rather than reassurance: a strong squad
finished 12th, a weak squad finished 9th, in two actual playthroughs.
Two data points isn't much on its own — real football has plenty of
upsets, and that's not automatically a bug — but round19 already flagged
that philosophy/variance needed verifying and that check may not have
gone deep enough. Do this properly now:

- Run the simulation **20-30 times** with a clearly strong squad (best
  available signings, high budget spend, optimal XI) and record the
  finishing position each time.
- Run it **20-30 times** with a clearly weak squad (worst available
  retained squad, minimal signings, suboptimal XI) and record the
  finishing position each time.
- Report the actual average finishing position and the range (best/worst)
  for each set. This is the real test — if the strong-squad average isn't
  meaningfully better than the weak-squad average across 20-30 runs, that
  confirms a genuine balance problem, not just bad luck on two attempts.
- If the correlation is weak or absent, investigate the actual cause
  rather than just widening or narrowing variance blindly — check
  specifically: is `squadStrength()` correctly reflecting new signings and
  the actual selected XI at the point Simulate is pressed (not a stale
  value from before Sign/XI were completed)? Is the strength-to-expected-
  goals slope in `simulateMatch` too flat relative to the per-match
  variance, such that variance is swamping the signal even over a full
  season? Report which of these (if either) is the actual cause before
  fixing it.

## Definition of done

- Every text source on Results beyond hard stats has been found, removed,
  and verified gone via a real screenshot — not just the ones touched in
  past rounds
- Grade is accompanied by a plain, transparent explanation tied to the
  real mandate-vs-position criteria
- Share button has clear microcopy explaining the two-step process
- 20-30 run test actually performed for both a strong and weak squad,
  real average/range numbers reported, and if correlation is weak, the
  actual root cause identified and fixed — not just variance tweaked
  blindly
