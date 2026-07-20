# The Window: Boro — Round 3 Fix Prompt

Paste directly into Claude Code, same repo. This is a smaller, faster round
than round2 — focused entirely on why the Setup screen still reads as a
copy of the KEF reference even after the font changed.

## 1. The wizard is back — remove it, for real this time

Setup is showing six numbered step circles (1-6) again. This was already
asked for in an earlier round and should not have regressed. Fix
permanently: **Setup is one single scrolling page** — name, board mandate,
kit sponsor, manager philosophy, shirt colourway, all visible by scrolling,
no step indicator, no "Next" button gating progress between them. One CTA
at the bottom ("Take charge" or similar) once a name is entered.

## 2. Flip to a cream/newsprint theme — this is the real fix, not a font swap

A different font alone won't stop this looking like a KEF copy, because the
*composition* is identical: bold word + italic red second word, stacked,
dark background. Changing the colour scheme entirely is what actually
solves it, and it's the correct direction anyway — the product already
talks like a newspaper (Evening Gazette sponsor, a vidiprinter, tabloid
slab-serif headlines). Newspapers are cream paper and black ink with red
masthead accents, not dark mode. Make that literal.

**New colour tokens:**

```
Background (page):     #F2ECE1   (warm cream, not stark white — same
                                   reasoning as before: a pure value reads
                                   as default/unconsidered, a warm one
                                   reads as intentional)
Ink / primary text:    #1A1714   (warm near-black, not pure #000)
Primary accent (red):  keep the existing Boro red — it works as a
                        masthead red on cream, this doesn't need to change
Secondary accent:      darken/desaturate the existing steel-teal so it
                        reads correctly on a light background (increase
                        contrast against #F2ECE1, it was tuned for dark)
Rules/borders:         thin hairline rules in a dark ink-grey, not the
                        soft dark-card borders from the dark theme —
                        think newspaper column rules, not UI card borders
Cards/panels:          where a boxed treatment is still needed, use a
                        slightly different cream shade or a thin-bordered
                        white panel with a hairline rule and minimal/no
                        shadow — reads as a newspaper "boxout," not a
                        dark-mode UI card
```

Typography stays as already set (Zilla Slab / Work Sans / Plex Mono) — it
was the right choice for this and works even better on cream than it did
on dark. The mono ledger font in particular will read like agate type
(the small dense type real papers use for scores and stats), which is
worth leaning into for the league table and stat clusters specifically.

## 3. Change the headline composition, not just its colours

Currently: "THE" (upright) + "WINDOW" (italic, red), stacked, with
"MIDDLESBROUGH" below in a second huge line. That's KEF's exact device —
bold word plus italic-coloured word — just recoloured. Change the actual
structure:

- No italics anywhere in the headline. Italic-for-emphasis is specifically
  the KEF device; dropping it is part of what makes this not read as a copy.
- Restructure as: a small kicker line above the headline (e.g.
  "MIDDLESBROUGH · SUMMER 2026" in the mono font, letter-spaced, small) —
  then the actual headline ("THE WINDOW.") as one single colour (ink black,
  not a two-tone split), one line if it fits at the target size, not
  stacked across two.
- Use the diagonal girder motif from round2 §1 as the visual signature
  here specifically — e.g. a short diagonal rule beneath or beside the
  headline — instead of a colour split doing that job. If the girder motif
  hasn't actually been built yet, build it now; this is its first real use
  case.

## 4. Give the preamble/brief text real typographic treatment

The cold-open paragraph currently sits as a plain grey wall of text below
the headline — no visual distinction from a generic paragraph. Treat it
like a proper pull-quote/callout instead:

- Constrain its line length (measure) tighter than full-width — newspaper
  columns aren't full-bleed, and neither should this be
- A left-side accent rule (thin, ink-coloured or red) running the height of
  the paragraph — standard pull-quote treatment
- Consider a small label above it in the mono font (e.g. "THE BRIEF",
  small-caps, letter-spaced) so it reads as a distinct, deliberately-placed
  element rather than body copy that happens to come first

## Definition of done

- Setup is a single scrolling page, no step circles, verified by actually
  loading it fresh
- Background is the cream token above throughout — not just the Setup
  screen, check Sell/Sign/XI/Results too, since round2's shell work may
  have been built against the dark tokens
- Headline has no italic, single colour, uses the girder motif rather than
  a colour split for emphasis
- Brief/preamble text has a distinct pull-quote treatment, not plain body text
