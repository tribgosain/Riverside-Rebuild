# Riverside Rebuild — Round 28: Diagnose Round27, Fix Broken Girder Motif

Paste into Claude Code.

## 1. The girder motif is now visibly broken — fix immediately

It's rendering as a solid red block with diagonal hazard-stripe shading,
not the thin diagonal accent line it's supposed to be. This looks like a
bug, not a design choice — a broken-looking stripe box is worse than
having no motif at all. Find this element and either fix it back to a
clean thin diagonal line, or remove it entirely if it can't be fixed
cleanly right now. Don't leave it in this state.

## 2. Diagnose why round27 doesn't look meaningfully different — don't just retry

A real screenshot of the live site shows the whitespace, layout
centering, and red-accent restraint from round27 not visibly applied,
despite being reported as done. Before making any more changes:

- Show the actual `git diff` or `git show` for round27's commit — what
  genuinely changed, line by line
- Confirm whether that commit is actually what's deployed right now on
  the live Cloudflare URL, or whether the live site is showing an older
  build — check the deployment history/log, don't assume the latest push
  is what's live
- If the commit shows real changes but the live site doesn't reflect
  them, that's a deploy problem, not a design problem, and needs fixing
  first before any more visual work happens
- If the commit genuinely doesn't contain the changes round27 asked for,
  that's a different problem — report honestly which one it is

## 3. Once the above is resolved, re-verify the round27 items properly

Don't just re-apply the same instructions — check actual computed values
this time: inspect the real rendered spacing (not just the CSS source) to
confirm whitespace actually increased, count how many places red actually
appears on the rendered page, and confirm the content block is actually
centred on a wide viewport by checking its real bounding box, not by
eyeballing a screenshot.

## Definition of done

- Girder motif no longer renders as a broken stripe box
- Root cause of round27 not visibly landing is identified and stated
  plainly — either a deploy issue or an implementation gap, not left
  ambiguous
- Round27's items re-verified against actual rendered/computed values,
  not just source code or a repeated claim
- Fresh screenshot shown after all of the above, on the actual live URL
