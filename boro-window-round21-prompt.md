# Riverside Rebuild — Round 21: More Targets, Remove Quote, Real Share Flow

Paste into Claude Code once round20 is confirmed done.

## 1. More Stars-tier targets — two real, well-sourced additions

Boro's actual confirmed priorities this window (Teesside Live, current):
a new starting striker is the top priority, and a new left-back is needed
following the confirmed decision not to make Matt Targett's loan
permanent. Two real players fit, both genuinely Stars-tier:

- **Kevin Denkey** — striker, FC Cincinnati (MLS). Boro are genuinely
  competing with Coventry City to sign him, matches the explicitly
  confirmed "new number nine" priority.
- **Max Arfsten** — left-back, Columbus Crew (MLS), full USMNT
  international. Boro have pursued him in back-to-back transfer windows
  already, matches the confirmed left-back need after Targett.

**Both happen to be MLS/American — classify them as Stars anyway, not
Project.** The Project tier is about *unproven, speculative* profiles;
these two are established internationals with genuine competitive
interest from other clubs, which is exactly what Stars-tier means. Don't
mechanically bucket by geography — profile and proven status decide the
tier, not league location.

## 2. More Project-tier targets — round20's seed was too thin

Only three example profiles existed after round20. Expand to proper
coverage across positions — suggest at least 6-8 total across GK, DF, MF,
and FW, keeping the same spirit (South American, Nordic, or MLS-developed,
young, cheap, unproven in English football, real upside). Build out
beyond the original three examples rather than just leaving them as-is.

## 3. Remove the results-page quote entirely — final decision

This has been asked about across two rounds now and is still showing.
Stop trying to fix the generated-recap version — just remove the line
completely. Keep the hard stats (record, points, grade, etc.), drop the
closing quote/recap sentence with nothing replacing it.

## 4. Consolidate Results buttons into one real Share button

Currently too many buttons at the end (copy text, copy link, save image,
etc., per whichever of these actually got built across prior rounds).
Consolidate all of the *sharing*-related actions into a single "Share"
button. Keep "Run it back" and "New window" separate — those are replay
actions, not sharing, functionally distinct.

**What the Share button should actually do, in order:**

1. Render the Results card to an image client-side — use a library like
   `html2canvas` or `dom-to-image` for this, well-established, no backend
   needed.
2. Copy that image to the clipboard via the Clipboard API
   (`navigator.clipboard.write()` with an image blob). Support varies
   slightly by browser — if the browser doesn't support image clipboard
   writes, fall back to triggering a direct download of the image instead,
   don't just fail silently.
3. Open X's share intent in a new tab with clean, short pre-filled text
   (the "nonsense" text bug from round19 should already be fixed — verify
   it still is while touching this).
4. The person pastes (or attaches, if it fell back to download) the image
   into the already-open X compose box — this last step is a real
   platform limit, not something to keep trying to remove. No website can
   pre-attach media to a post on any social platform via a link; this is
   the actual ceiling, and it's already a good result: one click gets the
   image made, copied, and X open and ready.

## Definition of done

- Denkey and Arfsten added as real Stars-tier targets, correctly tagged
  despite being MLS-based
- Project tier has real coverage across positions, not just three examples
- Results-page quote/recap line is gone entirely, confirmed by checking a
  live result, not just the code
- Results screen has one Share button (plus separate Run it back / New
  window), which generates the image, copies it, and opens X with clean
  text — test the actual clipboard behaviour, not just that the function
  runs without erroring
