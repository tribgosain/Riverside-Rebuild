# The Window: Boro → Riverside Rebuild — Round 5 Fix Prompt

Paste into Claude Code once the current task (cream theme verification
across Sell/Sign/XI/Results, then round4's sponsor logo rebuild) is fully
done — don't interrupt that work with this. This round covers a rename and
transporter bridge iconography.

## 1. Rename: "The Window: Boro" → "Riverside Rebuild"

Find and replace throughout — not just the header wordmark:

- Header/nav wordmark
- Browser tab `<title>`
- Any `og:title` / meta tags
- Any in-copy references to the old name (cold-open text, results-card
  copy, share text templates, loading-screen text)
- The results-card URL watermark, if it references the old name anywhere

Check the whole codebase for the literal string rather than assuming it
only lives in one component — names like this tend to be hardcoded in more
places than expected (page title, share text, meta tags).

## 2. Transporter bridge iconography

Two priority builds, then two optional stretch items if there's appetite
left after.

### 2a. Priority — loading/simulate screen progress indicator

Replace whatever's currently indicating progress on the season-simulation
screen with a simple line-art transporter bridge: two towers, a horizontal
gantry line between them, and a small gondola car that actually slides
left to right along the gantry as the simulation progresses. This isn't
decoration next to a progress bar — it *is* the progress bar. Gondola
position maps to how far through the reveal the person is.

Keep it simple line art (ink-coloured strokes, matches the cream/newsprint
system), not a detailed illustration — it needs to read clearly at
whatever size this section renders at, including on mobile.

### 2b. Priority — wordmark badge

Currently the header is text-only. Add a small simplified bridge silhouette
(two towers, gantry line, no gondola needed at this size) as a badge/mark
next to "Riverside Rebuild" in the header. Keep it simple enough to still
read clearly shrunk down to favicon size, and use it as the actual favicon
too rather than maintaining two separate marks.

### 2c. Optional — Setup screen watermark

If 2a and 2b land well and there's appetite for more: a faint bridge
silhouette in line art, low opacity, sitting in the negative space on the
Setup screen (which has room now that it's a single scrolling page rather
than a wizard). Should sit behind or beside the headline, not compete with
it for attention — this is texture, not a second focal point.

### 2d. Optional — results/share card mark

Same logic as 2c: a small bridge mark next to the site URL watermark on
the Results card, reinforcing what the screenshot actually is when it's
posted out of context. Keep it small and secondary to the URL text, not a
competing element on a card that's already doing a lot of work.

## Definition of done

- "Riverside Rebuild" appears everywhere the old name did — verified by
  searching the codebase for the old string, not just checking the visible
  header
- The loading screen's progress indicator is the bridge-and-gondola
  animation, not a generic bar with a bridge next to it
- Favicon and header badge use the same bridge mark, not two different ones
- 2c/2d only attempted if 2a/2b are done and look right first
