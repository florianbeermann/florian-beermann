---
name: florian beermann & partners
description: Customer Success consulting for B2B SaaS companies whose customer base has moved upmarket.
colors:
  paper: "#f3f0e8"
  paper-deep: "#e8e3d7"
  ink: "#003b76"
  blue: "#0a55ad"
  muted: "#52626b"
  line: "rgba(0, 59, 118, 0.22)"
  on-ink: "#ffffff"
  on-ink-muted: "rgba(255, 255, 255, 0.82)"
  header-wash: "rgba(243, 240, 232, 0.62)"
  backdrop-ink: "#92785a"
typography:
  display:
    fontFamily: "Inter Tight Variable, Inter Variable, sans-serif"
    fontSize: "clamp(4rem, 6.7vw, 7rem)"
    fontWeight: 520
    lineHeight: 0.91
    letterSpacing: "-0.067em"
  headline:
    fontFamily: "Inter Tight Variable, Inter Variable, sans-serif"
    fontSize: "clamp(2.8rem, 5vw, 5.4rem)"
    fontWeight: 520
    lineHeight: 0.95
    letterSpacing: "-0.045em"
  title:
    fontFamily: "Inter Tight Variable, Inter Variable, sans-serif"
    fontSize: "clamp(1.8rem, 3vw, 3.1rem)"
    fontWeight: 520
    lineHeight: 1
    letterSpacing: "-0.045em"
  body:
    fontFamily: "Inter Variable, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(1.02rem, 1.25vw, 1.16rem)"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "Inter Variable, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.7rem"
    fontWeight: 680
    lineHeight: 1.5
    letterSpacing: "0.08em"
rounded:
  none: "0"
spacing:
  hairline: "1px"
  xs: "0.65rem"
  sm: "1.35rem"
  md: "2.4rem"
  lg: "4rem"
  section: "clamp(6rem, 10vw, 10rem)"
  container: "1240px"
components:
  button-primary:
    backgroundColor: "{colors.blue}"
    textColor: "{colors.on-ink}"
    rounded: "{rounded.none}"
    padding: "0 24px"
    height: "52px"
  button-primary-hover:
    backgroundColor: "{colors.ink}"
  button-submit:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "16px 24px"
    height: "54px"
  input-underline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0.65rem 0"
    height: "48px"
  nav-link:
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    height: "44px"
---

# Design System: florian beermann & partners

## Overview

**Creative North Star: "The Consultant's Broadsheet"**

This is a printed page that happens to be on screen. The system takes its
structure from broadsheet newspapers and consulting reports rather than from
SaaS product UI: a warm paper ground, one authoritative ink, hairline rules
that divide the page into columns and registers, and headlines set enormous
and tight because the argument is the design. There is no card, no drop
shadow, no rounded container standing in for hierarchy. Structure is carried
entirely by rules, whitespace and type scale.

The density is deliberately uneven. Display type runs to 7rem with negative
tracking and sub-1 line-height so that headlines read as one dense mass, while
body copy sits at a calm 1.6 line-height in a muted grey-blue and never
exceeds a comfortable measure. That contrast, loud structure and quiet prose,
is the whole personality. It signals a senior operator rather than a vendor,
which is the positioning PRODUCT.md commits to.

The one departure from flat paper is the portrait: a single large image carrying
the system's only shadow. It is the only human element on the page and it is
allowed to be the only thing that lifts off the surface. Its corners are square
like everything else, so the lift comes from the shadow alone rather than from
shadow and rounding together.

The page itself is a sheet. It sits inset on a backdrop showing a painting of
Hamburg at golden hour, the city the practice is run from, which makes the
broadsheet metaphor literal: a printed page laid on a surface rather than a
canvas that happens to be paper-coloured. The sheet keeps square corners and
takes no shadow. Its separation from the backdrop is carried entirely by the
tonal and textural difference between a worked, painterly ground and flat
paper, which is the same mechanism the system already uses between sections.

The backdrop is chosen for place, not decoration, and it is the only
representational imagery in the system besides the portrait.

**Key Characteristics:**
- Warm paper ground (`#f3f0e8`), never pure white
- One continuous paper sheet, inset on a painted Hamburg backdrop
- Square corners everywhere, without exception
- Hairline rules as the primary structural device
- Enormous, tightly tracked display type
- One inverted deep-ink section as the page's spine
- Near-zero motion; the page does not animate to prove it is alive. The
  exceptions both belong to the frame rather than the interface: the intro that
  reveals the backdrop, and the top band collapsing as the page is scrolled

## Colors

A three-tone editorial palette: warm paper, deep navy ink, and one lapis blue
reserved for action and emphasis.

### Primary
- **Deep Navy Ink** (`#003b76`): All headings, body emphasis, the inverted
  method section's background, and the submit button. This is the voice of the
  page; it does the work that black would do in print, but warmer and more
  specific.

### Secondary
- **Signal Lapis** (`#0a55ad`): The action colour. Used on the hero CTA, the
  second half of the H1, links, and focus states. Its job is to mark the two
  or three places on a page where the visitor can act or where the argument
  turns.

  It replaced a brighter royal blue (`#1655d8`) that had grown too loud for the
  rest of the system. The problem was hue, not just intensity: at 221° the old
  blue leaned violet, while the ink sits at 210°, so the hero's two lines read
  as two unrelated blues arguing rather than one voice raising itself. Lapis
  sits at 212° — close enough to the ink to belong to the same pen, far enough
  in value to still register as an action.

  Being deeper, it also measures better than what it replaced: **6.3:1** on
  paper and **7.2:1** under white, up from 5.6 and 6.3. The gap to the ink
  narrows to 1.55:1, which is the point — the two lines are meant to read as
  one statement, not as a two-colour headline.

  Non-blue accents were tried and rejected. Gold and bronze dissolve into the
  backdrop painting, which is roughly 90% warm ochre (hues 20–50, mean
  `#bb9360`), so a warm accent stops reading as action. Oxblood fails
  functionally rather than aesthetically: the accent is also the input focus
  border, and a red focus ring reads as a validation error on a field the
  visitor has done nothing wrong in. Verdigris cleared both bars but moved the
  brand off blue entirely, which is further than the palette should travel.

### Neutral
- **Warm Paper** (`#f3f0e8`): The page ground. Warm, slightly yellowed, never
  `#fff`. The whole sheet is this one tone; sections are divided by rules, not
  by a change of paper.
- **Deep Paper** (`#e8e3d7`): The darkest paper step, for subtle fills.
- **Backdrop Ink** (`#92785a`): The flat colour behind the sheet, shown before
  the backdrop image loads and anywhere it cannot. Sampled from the mean of the
  regions the sheet does not cover, not from the whole painting, so the
  load-in resolves into the pixels actually on screen rather than into an
  average dominated by water the visitor never sees.
- **Muted Slate** (`#52626b`): All secondary and body prose. Deliberately not
  a tint of the ink; it is a cooler grey that keeps long copy from vibrating
  against the warm ground.
- **Rule** (`rgba(0, 59, 118, 0.22)`): Every divider, field underline and
  section boundary. A transparent ink tint, so rules sit in the same colour
  family as the type instead of reading as grey furniture.

### On the Backdrop
- **Header Wash** (`rgba(243, 240, 232, 0.62)`): The glaze the navigation sits
  on — `--paper` at 62%, written as a literal rather than mixed from the token:
  an unsupported `color-mix()` would be invalid at computed-value time, drop
  `background` entirely, and put ink type straight onto the painting.
  Legibility is not something to leave to feature detection. It only works
  because the painting beneath it is bleached first (see Header Slice); over raw
  backdrop this same value reads as a stain. Measured against every pixel of
  painting the header can travel over, ink holds 6.0:1 at worst and 8.3:1 on
  average. Alpha is the dial for how much Elbphilharmonie shows.
- **Header Slice** (`saturate(0.34) contrast(0.58) brightness(1.52)`): Not a
  colour but the filter that makes one possible. Paper laid straight onto a
  sunset reads as dirt, because the sheet's ground is lighter and far less
  saturated than anything in the picture; the wash cannot close a gap that
  large. Bleaching the painting first does — it lands the gold on a warm grey at
  roughly paper's own chroma, so the glaze reads as vellum. The skyline survives
  because it is carried by value, not hue: the Elbphilharmonie's roof and the
  church towers are the darkest things in frame and stay legible once the colour
  has gone. The header ends up a watermark of Hamburg on the masthead, which is
  a better description of this practice than either an opaque bar or a blue one.

  The three numbers are measured, and the measurement corrected an instinct. The
  gap that makes a glaze read as dirt is **lightness, not hue** — the first
  version sat 23 L units darker than the sheet while already running *warmer*
  than it (R−B of 18 against the sheet's 8), so the seam looked like grime while
  the obvious fix, adding sepia, would have made it worse. Brightness is
  therefore the lever: `1.52` closes the seam to 15 units and, because the wash
  now lifts off a lighter ground, raises worst-case ink contrast from 5.5:1 to
  6.0:1 in the same move. Saturation is the weakest of the three — `0.55` down to
  `0.26` only shifts warmth from 18 to 12, at no contrast cost in either
  direction — so `0.34` halves the excess and stops short of draining the sunset
  out of the sky. Re-measure the band against the sheet, not against the
  painting, if any of this is touched.
- **On Ink Muted** (`rgba(255, 255, 255, 0.82)`): Secondary type on an inverted
  surface — the method band and the primary button, both on flat `--ink`. Not
  the header, which is paper. A tint of white rather than a second colour, for
  the same reason Muted Slate is not a tint of the ink. It composites to
  `rgb(209, 220, 230)` and measures 8.00:1 on ink, against white's own 11.13:1,
  so the figure to protect is the step down from the wordmark, not the floor.

### Named Rules
**The Two Blues Rule.** The navy is structure; the lapis is action. They
are never interchangeable. If a new element is neither a heading nor an action,
it is Muted Slate, not a third blue.

**The No Pure White Rule.** `#ffffff` appears only as type on the inverted
section and on filled buttons. Backgrounds use `--paper` or `--paper-deep`.

**The One Sheet Rule.** The page is a single piece of paper. A section never
gets its own lighter or whiter background to set itself apart, because a real
sheet does not have patches of different whiteness and the seam is visible once
the page is an inset object. Sections are separated by a rule, by vertical
space, or by full inversion. A near-white "raised paper" step existed in an
earlier version of this system and was retired when the sheet gained a
backdrop.

## Typography

**Display Font:** Inter Tight Variable (fallback: Inter Variable, sans-serif)
**Body Font:** Inter Variable (fallback: Helvetica Neue, Arial, sans-serif)

**Character:** One superfamily doing two jobs. Inter Tight's narrower fit lets
display sizes run enormous without wrapping, and its negative tracking at large
sizes reads as confident rather than cramped. Inter at 400 keeps prose neutral
and highly legible so the headline carries all the personality. Inter is a
deliberate, recorded choice here, not a default.

### Hierarchy
- **Display** (520, `clamp(4rem, 6.7vw, 7rem)`, line-height 0.91,
  tracking -0.067em): The hero H1 only. Tracking and line-height are tuned to
  Inter Tight specifically; changing the face requires re-tuning both.
- **Headline** (520, `clamp(2.8rem, 5vw, 5.4rem)`, line-height 0.95,
  tracking -0.045em): Section H2s.
- **Title** (520, `clamp(1.8rem, 3vw, 3.1rem)`, line-height 1): Engagement and
  method H3s.
- **Body** (400, `clamp(1.02rem, 1.25vw, 1.16rem)`, line-height 1.6): All
  prose, in Muted Slate, constrained to 580–650px measure.
- **Label** (680, `0.7rem`, tracking `0.08em`, uppercase): Form labels, the
  submit button, and micro-metadata. The only uppercase in the system.

### Named Rules
**The One Display Rule.** Exactly one element per page may use Display size.
A second competing headline at that scale collapses the hierarchy.

**The 0.8125rem Floor.** No text renders below `0.8125rem` (13px). Legal and
privacy microcopy sits at the floor, not beneath it.

## Layout

### The Frame

The sheet is inset from the viewport by `--frame`, set to `clamp(14px, 6vw,
104px)`, on the left, right and bottom edges — and by `--frame-top`, set to
`clamp(20px, 11vw, 190px)`, on the top. Both flatten to `14px` below 680px so
neither eats reading width on a phone. Everything else in this section describes
layout *inside* the sheet.

**The frame absorbs the device's safe area.** Every edge adds its
`env(safe-area-inset-*)` on top of its designed depth, and the page declares
`viewport-fit=cover`. Without covering, iOS keeps the layout viewport below the
status bar while still scrolling the document *under* it: `fixed` and `sticky`
layers stop at the frame line, so the scrolled sheet reappears in a strip above
its own backdrop. Covering hands that strip to the page, and the insets are what
the shell claims it back with. Adding rather than substituting matters — the
frame keeps its designed depth, the status bar sits above it over the painting,
and the header still parks clear of the clock. `--band-collapsed` carries the
same top inset so the band collapses by the distance it always did and the two
ends of the intro gesture stay in step. All four insets are `0px` off an inset
display, so nothing else in this document changes.

The frame is deliberately generous at desktop. The sheet covers the backdrop's
entire centre, so only the outer band is ever seen: a thin border crops the
image to unreadable noise, while a wide one lets the skyline register. Frame width is therefore a content decision, not a
margin decision, and should not be trimmed for extra column width.

The top edge is deeper than the other three, which is the mat convention of
weighting one edge, put to work. The top band is the only place a skyline can be
read — the side strips are too narrow and the bottom is below the fold — and at
`6vw` it held a sliver too thin to carry a building. At `11vw` it holds
6.6–13.2% of the image's height across desktop sizes, the low end on ultrawide
monitors where the same 190px covers proportionally less. **That resting range
is the composition brief for any future backdrop: anything that must be seen
belongs in the top ~6.6% of the image.**

The band then collapses to `--band-collapsed` on scroll, falling to 1.1–2.4%.
That floor is deliberately *not* a composition target. The band's job changes as
the visitor moves: while the backdrop is the subject it must carry a building,
and once the page is the subject it is only a margin, so asking it to still hold
a skyline would be asking it to serve a reader who has stopped looking at it.
Compose for the resting band and let the collapsed band be a colour.

The alternative was cropping the image to force its skyline upward, and it
was tried and reverted. Deepening the frame costs vertical space in the hero;
cropping costs resolution everywhere, permanently. Space is the cheaper currency.

Three consequences worth knowing before changing anything here:

- **The sticky header parks at the frame line** (`top: var(--band)`), not at the
  viewport top, and it is a glaze of bleached painting under paper rather than a
  solid. Three versions have shipped and the third is the reconciliation. Opaque
  paper is honest but hides the one thing the header is standing on. A *paper*
  glaze over the raw painting reads as dirt — the sheet's ground is too light
  and too dull to sit on a sunset, so it looks like a stain rather than glass;
  that reading is correct and is why the first attempt was abandoned. An *ink*
  glaze avoided it by not pretending to be paper at all, but made the navigation
  the loudest object on a page whose argument is set in the same navy. Bleaching
  the painting before the paper lands on it removes the premise of the dirt
  problem: there is no saturated gold left to muddy. The header becomes paper
  with Hamburg watermarked into it.
- **The header carries a masthead rule** (`border-bottom: 1px solid var(--line)`).
  It is on at every scroll position rather than faded in once the page moves,
  because it has two jobs: it is the rule a broadsheet prints under its
  masthead, and it is the edge between the glaze and the sheet. Those two
  grounds are close by design — that is the whole point of a paper glaze — so
  the boundary has to be drawn rather than inferred. `box-sizing` is inherited
  as `border-box`, so the rule is drawn inside `--header-height` and the box
  stays exactly the measurement the anchor offsets and the slice's clip assume.
- **The header owns a third copy of the backdrop.** It cannot simply be
  transparent: once the sheet scrolls, the paper behind the header would show
  the page's own content through it. So the header carries a fixed backdrop
  layer of its own, clipped to the header's box, and the glaze sits on top of
  that. Painting, never content. The filter lives on this layer rather than as a
  `backdrop-filter` on the glaze for exactly that reason — this layer is only
  ever painting, so there is nothing else it can accidentally bleach — and
  because a filter on a fixed layer that does not move is painted once instead
  of every frame.
- **That slice is clipped on all four sides, not two.** It is viewport-fixed and
  full-bleed, which cost nothing while it was an untouched copy of the backdrop:
  the overhang was pixel-identical to the backdrop beside it and therefore
  invisible. A filter ends that immediately — anything outside the header's box
  shows as a bleached band running off both edges of the sheet. The horizontal
  inset is `--frame`, because the sheet is flush to it with no max-width
  centring to account for.
- **A fixed matte repaints the top band.** Once the sheet scrolls past the
  viewport top its paper would cover the backdrop's top strip, so a fixed layer
  clipped to `--band` redraws it. The matte and the backdrop share identical
  fixed geometry so they register exactly.
- **The matte and the header must read the same variable.** Both define the
  same edge — the matte paints down to it, the header parks on it. Split them
  across two values and any drift shows as a strip of paper above the header or
  a backdrop band that outruns it.
- **Anchor targets clear the frame as well as the header**, via
  `scroll-margin-top: calc(var(--band-collapsed) + var(--header-height) + 12px)`,
  using the collapsed band because anchors are always landed on well past the
  collapse range. Under `prefers-reduced-motion` the band never collapses, so
  that same rule reverts to `--frame-top` there or every anchor lands 130px off.
- **The document refuses elastic overscroll** (`overscroll-behavior-y: none`).
  Everything above rests on `fixed` layers and the flow agreeing on where the
  frame line is. Rubber-banding past the top breaks that agreement by design: it
  translates the scrolling contents — sheet, and the header stuck to it — while
  the `fixed` painting layers stay welded to the viewport. The header rides down,
  its clipped slice does not, and the glaze overhangs onto the paper as a flat
  strip that detaches the nav from the hero. No layer is misconfigured; the
  bounce is simply prising apart two coordinate systems this design treats as
  one. The frame is meant to be the edge of the window, and a window does not
  bounce. This costs pull-to-refresh on Android and the bounce on iOS 16+, which
  is the right trade for a page whose whole premise is a still frame.

The backdrop is a fixed layer rather than a body background. As a scrolling
body background, `cover` resolves against full document height and zooms the
image to a smear on tall mobile pages.

### Inside the sheet

A single centred column of `min(92%, 1240px)`, with full-bleed section
backgrounds and inner content constrained to the container. Sections are
separated by `clamp(6rem, 10vw, 10rem)` of vertical padding and, where the
background does not change, a 1px rule.

Widths inside the sheet resolve against the sheet, not the viewport. Centring
maths must use `100%`, never `100vw`, or a section drifts off-centre by the
frame width.

Section headings use a two-column grid (`1fr 0.75fr`) placing the H2 against a
supporting paragraph, so the page reads as an argument with a margin note
rather than centred marketing. The method section uses a four-column signal
flow; engagements use a two-column split of title against detail.

Breakpoints are `900px`, `768px`, `680px` and `360px`. Multi-column grids
collapse to single column at 680px, and the display clamp switches to a
steeper viewport-relative curve (`clamp(2.9rem, 12.5vw, 4rem)`) so the H1
holds at four lines on a 390px screen rather than seven.

Horizontal page padding is `4vw` at desktop and a fixed `1.35rem` below 680px.

## Elevation & Depth

**This system is flat by doctrine.** There are no elevation levels, no card
shadows, and no layered surfaces. Depth is expressed three ways: by the sheet
sitting inset on the backdrop, by full inversion (the deep-ink method section),
and by hairline rules. A shadow used to separate a block from its background is
a defect in this system, not a choice.

The sheet-on-backdrop separation is the one place the page reads as two planes,
and it still obeys the doctrine: no shadow, no radius, no border. Tonal and
textural contrast between painted ground and flat paper does all the work.

### Shadow Vocabulary
- **Portrait lift** (`box-shadow: 0 28px 70px rgba(0, 59, 118, 0.14)`): The
  single sanctioned shadow, on the hero portrait only.
- **Focus underline** (`box-shadow: 0 1px 0 var(--blue)`): Used on focused form
  controls to thicken the underline to 2px without shifting layout.

### Named Rules
**The Flat Paper Rule.** New surfaces get a rule, vertical space, or full
inversion. They do not get a lighter background (see The One Sheet Rule), a
shadow, or a border radius.

**The Frame Is Content Rule.** `--frame` and `--frame-top` exist so the backdrop
is legible, not to create breathing room. Narrowing them to reclaim column width
crops the image to noise and removes the reason it is there. The top edge is the
deepest because it is the only band a skyline can be read in; compose backdrops
so their subject sits in the top ~6.6% of the frame, which is what the band
shows at rest across every desktop width.

## Shapes

Square, without exception: `border-radius: 0` on buttons, inputs, selects, the
details toggle, every panel, the hero portrait, and the page sheet itself. The
portrait carried a `1.75rem` radius in an earlier version, on the reasoning that
rounding made it read as a photograph placed on the page rather than a UI
element. It was squared once the sheet gained a backdrop: against a real painted
surface the sheet already reads as paper, so the rounding stopped earning its
exception and simply looked like the one component that had escaped the system.
The portrait still lifts, but on its shadow alone.

The recurring geometry is the **rule**: a 1px line at `var(--line)` for
dividers and field underlines, and at `var(--ink)` for the heavier boundaries
that open a section. Rules do the work that borders and cards do elsewhere.
The one accent geometry is a `2px solid var(--blue)` left border used to mark
a callout.

## Components

### Buttons
- **Shape:** Square (`border-radius: 0`).
- **Primary (hero CTA):** Signal Lapis background, white text, `0 24px` padding,
  `52px` min-height, 650 weight at `0.86rem`, sentence case.
- **Submit:** Deep Navy Ink background, white text, uppercase Label type
  (`0.72rem`, 680, `0.1em` tracking), `16px 24px` padding, `54px` min-height.
  The case change is what separates a form's terminal action from a
  navigational CTA.
- **Hover / Focus:** Colour swap only (lapis → ink). No lift, no scale, no
  shadow. All interactive targets are ≥44px.

### Inputs / Fields
- **Style:** Underline only. Transparent background, no border except
  `border-bottom: 1px solid var(--line)`, `border-radius: 0`, `48px` min-height,
  `0.96rem` text. Textareas are the exception and take a full 1px border with
  `0.9rem` padding and a `150px` min-height.
- **Focus:** Border colour shifts to Signal Lapis and `box-shadow: 0 1px 0` adds
  a second pixel, so the underline thickens without moving the field.
- **Labels:** Uppercase Label type above the field, always visible. No
  placeholder-as-label.

### Navigation
- **Style:** Text links at `0.84rem` / 520 in `--ink`, `44px` min-height, with a
  transparent 1px bottom border that becomes `currentColor` on hover and
  focus-visible. Sticky header on a paper glaze over a bleached slice of the
  Hamburg backdrop, with a `--line` rule beneath it — the grounds on either side
  of that edge are close by design, so the rule draws a boundary that would
  otherwise have to be inferred. Ink type clears 6.0:1 against the darkest
  ground the header can travel over.
- **The mark:** The monogram alone (`logo-mark.svg`), at every width, `52px`
  tall and `91.7px` wide — 1.763:1, so only the height is pinned and the width
  follows the artwork. It is the standard cut: navy letterforms, and an
  ampersand knocked out of a solid Signal Lapis tile in paper. The lapis is the
  same blue the hero's second line is set in, so the mark and the headline
  agree.

  The full lockup is *not* used here, and the reason is arithmetic rather than
  taste. Since the artwork was redrawn stacked, its wordmark runs on two centred
  lines and the monogram is only 53% of the total height. Pinned to this
  header's `52px` the lockup renders `191.7 × 52`, which puts the monogram at
  ~27px, the wordmark's caps at ~6.8px, and shrinks the lapis tile until it
  disappears entirely. That tile is the one piece of colour the mark owns, so a
  size that throws it away is the wrong size.
- **The name is a second cut of the same drawing, not type.** `logo-wordmark.svg`
  carries both lines — `FLORIAN BEERMANN` over `& PARTNERS` — trimmed to its own
  ink, with the second line centred under the first exactly as the artwork draws
  it. Flushing them left was tried and rejected: the two lines are a stacked
  unit, and setting the shorter one against the mark makes it read as a stray
  third element rather than the continuation of the name. The cut carries a
  `-0.295` unit nudge, which is the whole of the correction — line 1 centres on
  `749.985` and line 2 on `750.28`, so the drawing was already centred to within
  a third of a unit and the nudge only puts the two axes exactly on top of each
  other. Type was tried twice and both attempts were wrong for a reason that
  measures: the artwork's wordmark has a width-to-cap-height ratio of `29.9`,
  where Inter at `0.28em` gives `20.2`. That is roughly `0.72em` of tracking
  *and* a lighter weight than Inter carries. No letter-spacing value closes a
  48% gap while the weight is still wrong, so the header uses the drawing. It
  costs one more request; it buys the actual brand. Both images are `alt=""` —
  the brand link's `aria-label` carries the full name, and a screen reader
  should hear it once.
- **The name sits between the mark's two centres, and that half-step is the only
  chosen number in the header.** Both cuts are trimmed to their own ink, so flex
  centres them honestly — but the mark's box is not its letterforms: the lapis
  tile runs the full height while `F`, `B` and `P` occupy only 4.59%–74.97% of
  it, putting their centre at 39.78% rather than 50%. So there are two
  defensible anchors, `(0.5 − 0.3978) × 52px = 5.31px` apart. Aligning to the
  letterforms (`−5.31px`) leaves the tile hanging unbalanced below the name;
  aligning to the box (`0`) is geometrically right but reads a shade low,
  because the mark's weight is in the navy letterforms rather than the flat
  tile, so its optical centre sits above its box centre. `top: −2.66px` is the
  half-step, picked from rendered comparisons — no measurement settles where a
  shape's visual centre is, and pretending otherwise is how the earlier constant
  came to look more derived than it was. It is independent of the name's height,
  because both boxes are centred and only the mark's skew is off; it is tied to
  the mark's `52px`, but the name only ever shows above `760px`, where the mark
  is always `52px`. Recompute it only if that `52px` changes or the artwork is
  redrawn.
- **The name is fluid, sits a step under the drawing's own proportion, and its
  stand-down is not the mark's breakpoint.** At 10.5:1 every pixel of height
  costs ten of width, and brand plus nav needs `837px` before the two touch — a
  fixed height collided everywhere between the stand-down and `~880px`. In the
  lockup the wordmark is `125.89` units to the mark's `194.07`, so beside a
  `52px` mark the artwork asks for `33.73px`. That is what it was, and it read
  heavy: the name came out 92% as tall as the mark's letterforms and stopped
  being the junior element. `clamp(24px, 2.083vw, 30px)` is 88.9% of the
  drawing's proportion — `353px` of width becomes `314px` — and like the `2.34vw`
  before it the rounded-down coefficient reaches its ceiling just above `1440`
  rather than at it (`29.995px` at `1440`). The `24px` floor is a legibility
  limit rather than a fitting one: caps are 35% of the box, so `24px` puts them
  at `8.4px`, which these widely-tracked letterforms still hold. It is
  deliberately *not* scaled down with the ceiling — a proportional floor would be
  `21.4px` and put caps at `7.5px`, which is the thing the floor exists to
  prevent. The cost is that it binds from `1152px` rather than `1026px`, so the
  name is flat at `24px` across a wider band. Measured, the brand and nav touch
  at `690px` with the name at that floor, so the name stands down at `760px` —
  80px above the mark's own breakpoint, buying ~33px of clearance at the last
  width that shows it. Past that the monogram alone reads better than a name too
  faint to finish.
- **Never filter the mark.** The cut carries three inks — navy, lapis, and the
  paper the ampersand is knocked out in — and a filter cannot tell them apart.
  `brightness(0) invert(1)` flattens all three into one flat shape. Recolour in
  the file instead; that is why a separate `-on-ink` cut exists even though this
  header does not use it.
- **The gap between `F` and `B` is spacing, not a redrawn glyph.** The arms were
  interlocked by 9.30 units in the original drawing. The fix moved the `B` right
  by 15.116 units of tracking, leaving the `F` path byte-identical and its arms
  full, for a 5.81-unit gap. Shortening the arms instead would have un-fused a
  deliberate ligature to solve what was a spacing problem. The mark's ratio moved
  from 1.632 to 1.763 with it, so the width hint moved too.
- **Mobile:** Below 680px the mark drops to `38px` and `--header-height` to
  `68px`, in the same media query as the header's own `min-height` — they are one
  measurement, and the slice's clip is taken from the variable. The name is
  already gone by then. There is no `<picture>` swap at any width: two assets,
  each served at every size that shows it.
- **The brand never shrinks, because a logo may be crowded but not deformed.**
  The header is `space-between`, so once its content exceeded its box the flex
  algorithm compressed the brand — and an `img` with `width: auto` compressed
  *below its aspect ratio*. On the Galaxy Fold's 280px outer screen the monogram
  rendered `43.3 × 32` against an artwork ratio of 1.763: a 23% horizontal crush,
  41% once a classic scrollbar took its 10px. `flex-shrink: 0` on `.site-brand`
  is the fix, and it has to sit on the wrapper — the shrinking item is the link,
  so the same rule on the `img` is a no-op. Worth knowing why no check caught
  this: the page never overflowed and nothing collided. The mark deformed
  *inside* a header that still fitted, which is invisible to any test that
  measures overflow or clearance. The ratio is now asserted directly.
- **Below 320px the header eases rather than steps.** The `360px` block's values
  are clamps whose ceilings are the flat values they replaced, so at `320px` each
  is already at its cap and nothing changes at or above an iPhone SE. Below that
  the padding, nav gap, nav size and mark height give ground continuously
  (`28px` is the mark's floor, where the lapis tile still reads as a square). A
  second breakpoint at `~300px` was the alternative and was rejected: this range
  is one continuous squeeze — 280px wanted 13px more than it had — and a
  breakpoint would hand it all back at a single width instead of spreading it.

### Signature Component: The Inverted Method Band
A full-bleed `var(--ink)` section with white type, containing a four-column
signal flow divided by `rgba(255,255,255,0.25)` rules. It is the page's spine:
the one place the paper flips to ink, used to mark the shift from what is sold
to how it is done. Numbers `01–04` are permitted here because the sequence
carries meaning.

### Signature Component: The Hamburg Backdrop
A fixed, viewport-sized layer behind the sheet holding an impressionist painting
of the Binnenalster at golden hour — the Elbphilharmonie's roof waves and the
Rathaus and church towers along the top edge, the Alster fountain and sailboats
on open water below. A painting rather than a photograph is the positioning
choice: paper resting on a painting is a print-and-gallery metaphor, where paper
over a photograph is a content card over a hero image, which is the category
default for a consultancy site.

Served as WebP with `.jpg` companions behind an `@supports (background-image:
image-set(...))` guard: `3456` to 2x displays, `2560` to 1x, and `1280` below
900px. **Every filename carries a content hash**, because files in `public/`
bypass Vite's hashing and the host serves them with `max-age=2592000`. Reusing a
name for changed pixels strands returning visitors on the old image for thirty
days while the `no-cache` HTML around it updates — a swap that looks correct
everywhere except on the machines that have seen the site before. Re-hash on
every re-encode; never edit an asset in place. WebP is both smaller and higher quality than the JPEG here, so there is
no trade to weigh.

**Aspect ratio decides effective resolution, not file width.** At 1.20 the image
is narrower than any desktop viewport, so `cover` fills the *width* and maps the
asset onto the viewport without magnification. An asset whose aspect is wider
than the viewport's gets scaled up instead, and the further the two diverge, the
harder `cover` magnifies.

**Only a top crop moves the skyline into the band.** This is worth stating
plainly because two plausible alternatives do nothing. With `cover` filling the
width, the band always shows a fixed *count of source rows* — `--frame-top ×
(image width ÷ viewport width)`. Cropping the bottom changes the aspect and the
percentages but not that count, so it cannot pull a landmark into view. Cropping
the sides makes each source pixel larger on screen, so the band covers *fewer*
rows and the landmark moves further out. Deepening `--frame-top` works but is
paid for in layout space: reaching the Elbphilharmonie on the uncropped square
would have taken a 250px band on a 900px viewport.

So the square 4096px original was cropped 8% off the top, which moved the
Elbphilharmonie roof from 10% of the image height to 2.4% and put it inside the
band at rest across *every* desktop width, including the ultrawide floor. The cost
is that the church spires now meet the top edge instead of sitting under sky.
That reads as an intentional frame crop rather than damage, and it is the right
trade: the spires are anonymous at a glance, the Elbphilharmonie is the one
building that says Hamburg without a caption. The bottom was then trimmed to a
1.20 aspect, which removes only rows no desktop viewport can display.

The earlier, opposite lesson still stands and is why the crop is *shallow*: a
previous version cropped a 16:9 image to a 2.98:1 skyline strip, leaving 1290px
of source height that `cover` then magnified 1.7×. **A wide crop is expensive
twice over — it throws away pixels, then enlarges the survivors.** A shallow top
crop is safe precisely because it does not touch the width, which is what sets
the scale.

`--backdrop-position` is `center top`, and that is load-bearing rather than
cosmetic. Filling the width makes the image taller than the viewport, so a
centred position would slide the skyline up out of the band — the one thing the
band exists to show. Pinned to the top, the band reaches 6.6–13.2% of the image's
height at rest, against an Elbphilharmonie roof starting at 2.4%, so the landmark
reads at every desktop size while the backdrop is the subject. Collapsed it falls
to 1.1–2.4% — sky and at most the roof's top edge, which is the intended trade:
by then the reader is in the page and the backdrop has become a margin. It is one
variable shared by all three backdrop layers — the backdrop, the matte and the
header's slice — so they cannot drift out of register with one another. They are
literally one CSS rule with three selectors, which is the only reliable way to
keep three copies of the same image in agreement.

Resolution is served by descriptor, not by breakpoint: `image-set()` carries `1x`
and `2x` entries alongside `type()`, so a 1x display fetches 890KB and only a 2x
display pays 1.3MB.

**Size the asset to the widest device that will paint it, then spend what is
left on quality.** Measured at display size rather than 1:1, a 2880px asset at
q88 beat the full 4096px at q80 while being *smaller* — and at the 3456px target
(1728 CSS px at 2x, the widest common retina laptop), 3456@q88 beat 4096@q86 on
both quality and bytes. Pixels beyond what the device can resolve are spent on
resampling that the browser throws away, whereas quantisation damage survives
downscaling. Brushwork is the specific reason: dense impasto texture is destroyed
by coarse quantisation but merely averaged by resampling.

Quality is q88, chosen against a lossless master at the size actually painted.
The RMSE curve flattens after q80 and at 1:1 q80 is already indistinguishable,
but q76 visibly smears the sky's brushwork — and since the backdrop is the site's
entire visual identity, the plateau is the floor here, not the target. **Judge
compression on the pixels that are visible, at the size they are displayed.**

The guard overrides `background-image` on the backdrop layers directly, not the
`--backdrop-image` custom property, and that distinction is load-bearing.
Custom properties accept any token stream at parse time, so an unsupported
`image-set()` parked in one is not caught until use, where it invalidates
`background-image` outright and leaves a flat colour rather than falling back
to the JPEG. Overriding the real property also lets autoprefixer emit the
`-webkit-image-set` variant that pairs with the widened `@supports` test it
generates.

The painting is shown untinted. An earlier version washed the backdrop in a
flat `rgba(0, 42, 86, 0.22)` scrim to seat it in the site's ink and to guarantee
the cream sheet stayed legible against a pale sky. On a golden-hour image that
wash reads as dirt: it cools the gold the picture exists for and greys the one
warm thing on the page. It was removed, and the legibility argument was retested
rather than assumed — across the frame band where sheet meets backdrop, the
brightest 1% of the image sits at 1.87:1 against `--paper`, the median at 2.07:1,
and nothing at all falls within 1.2:1. The edge is never soft. Separation is
carried by tone and texture: flat, matte cream against worked, painterly ground.

Side-strip detail energy is a selection criterion when swapping the backdrop,
not an afterthought. Those strips run the full height of the page directly
alongside the reading column, and a photograph measured roughly 2.2× the painting
here on mean horizontal gradient energy. Softer strips are one of the reasons the
painting is the better ground, independent of the positioning argument.

If a future image ever does need seating, reintroduce a scrim rather than
darkening the asset, and keep it under about `0.15`. But treat the need as
evidence the image is wrong for the slot, not as a routine step.

On a portrait phone `cover` flips to filling the height, leaving the middle ~37%
of the width visible — enough to hold both towers and most of the
Elbphilharmonie without any positional nudge. The 14px band there is too short to
read architecture at any width worth the fold space, so phones get sky and water
in the strips and nothing is asked of the top edge.

### Signature Moment: The Band
The top band is not fixed. It rests at `--frame-top`, opens past that during the
intro, and collapses to `--band-collapsed` over the first `--band-collapse-range`
(240px) of scroll. Three positions, evenly spaced, at 1440px: **288px open, 158px
at rest, 29px collapsed.**

The reasoning is that the band's job changes as the visitor moves. While the
hero is on screen the backdrop is part of the argument — it says where this
practice is. Once they start reading, it is furniture, and the page should have
the space instead. So the mat is top-weighted while the picture is the subject
and nearly closed once the page is.

`--band-collapsed` is deliberately thinner than the side frames rather than equal
to them. Matching `--frame` gives a tidy uniform border, but tidiness is not what
that moment is for: the reader is in the text, and every pixel of backdrop above
them is a pixel the argument does not get. It stays above zero because a band of
`0` lets the sheet run off the top of the window, and the sheet reading as a
discrete object resting on something is the whole conceit. A sliver still says
"object on a backdrop"; nothing at all says "web page".

The even spacing is not a coincidence to preserve casually: `--intro-rise` is
defined as `calc(var(--frame-top) - var(--band-collapsed))`, the exact distance
the band later collapses. Load and scroll are therefore one continuous gesture in
two parts — the band opens past its resting height, settles, then closes as the
page is read — rather than two effects that happen to sit near each other. Express
it as the difference between the two band positions, never as a literal length,
or the two halves drift apart the next time either end moves. On phones all three
values are `14px`, so the rise resolves to `0` and the band never collapses:
there is nothing there to reveal, and the intro degrades to a pure fade.

Under `prefers-reduced-motion` the collapse is switched off and the band parks at
its resting depth. This is not parallax — the band is viewport-fixed frame, not
content sliding past content at a mismatched rate — but a 129px edge sweeping
across the full width of the viewport is a large moving area, and large moving
areas are what vestibular sensitivity reacts to whether or not they are content.
Being driven directly by the visitor's own scroll makes it legible, not exempt.
Parking it
at rest is not a degraded state invented for the query: it is exactly what
browsers without scroll timelines already render, so it is a composition the
design is built around. The anchor rule has to revert with it, or every in-page
link lands 130px off.

It is driven by a **scroll timeline**, not a scroll listener, so there is no JS
on the scroll path and it degrades to a static band where unsupported. `--band`
is registered with `@property` as a `<length>`; an unregistered custom property
would jump between the two values instead of interpolating.

Only the matte and the sticky header follow `--band`. `.site-page` keeps its
margin on the static `--frame-top`, and that separation is load-bearing:
animating a margin would reflow the document on every frame and shift the very
scroll offset driving the animation.

### Signature Moment: The Intro
On the first load of a session the sheet starts `--intro-rise` low and fades up
into place over `--intro-arrive` (850ms) on a decelerating curve. Nothing is
held back first: the page is legible from the opening frame.

An earlier version paused on the bare backdrop for 600ms before the sheet
arrived. It showed the right thing the wrong way — a deliberate pause is
indistinguishable from a slow site, and it charged every visitor 600ms for
information the motion could carry for free. Starting the sheet 72px low reveals
an extra band of backdrop at the top, and the rise uncovers it in the same
gesture that delivers the page. The reveal is now a by-product of arrival rather
than a toll paid before it, and the whole sequence finishes in 850ms against the
old 1.3s.

**The intro's fill mode is load-bearing.** `#root` fills `backwards`, never
`forwards` or `both`. A filled animation whose end state is `transform: none`
does not compute to `none` — it computes to `matrix(1, 0, 0, 1, 0, 0)`, and an
identity matrix is still enough to make the element a containing block for
every `position: fixed` descendant, permanently, long after the animation has
finished. That would re-anchor the header's backdrop slice to the document
instead of the viewport, which shows as a stray band of painting adrift in the
page. Backwards fill costs nothing here, because the end state is the element's
natural state. The header's slice is suppressed for the duration of
`--intro-arrive` for the other half of the same problem: while the sheet is
genuinely mid-transform, the fixed layer really is misparented, and its clip is
measured from a `--band` the header has not reached yet. It crossfades in once
the sheet settles.

That is the reason this is the system's only entrance animation. It carries
information the static page cannot: the sheet's whole conceit is that it is paper
resting on a painting of Hamburg, and that painting is almost entirely hidden
once the sheet lands. The rise is the only moment a visitor sees what the site is
sitting on. Motion here explains the composition; motion anywhere else would only
decorate it.

Three constraints keep it from becoming a tax:

- **It plays once per session.** An inline script in `index.html` sets a
  `sessionStorage` flag and, on any later load, puts `.intro-done` on `<html>`
  before first paint. Reloads and direct hits on the legal URLs skip the intro.
- **It is bypassed entirely under `prefers-reduced-motion`.**
- **It animates `#root`, not `.site-page`.** `#root` survives client-side
  navigation, so moving between routes cannot replay it. This is also why the
  top matte hangs off `body::after`: a transform on an ancestor would make that
  `fixed` layer resolve against the ancestor instead of the viewport.

The travel and duration are tokens on `:root`, so the pacing is a one-line
change. Keep the whole sequence under roughly a second — beyond that a
first-time visitor stops reading it as authored and starts reading it as broken.
The travel is not a free number — it is the frame delta, so changing either
frame variable retunes the intro automatically. Do not replace it with a literal
length; that would break the even spacing between the band's three positions and
let load and scroll drift into two unrelated effects. The backdrop is preloaded at high priority so the
first frame shows the painting rather than the `--backdrop-fallback` flat.

The easing stays on the house curve, `cubic-bezier(0.16, 1, 0.3, 1)`, even
though the travel here is five times anything else in the system. A gentler
curve was measured against it and moved the final 5px only ~100ms sooner, which
is not worth a second easing in the system. A slow settle at the end of a
decelerating move reads as momentum, not lag.

## Do's and Don'ts

### Do:
- **Do** use hairline rules (`1px solid var(--line)`) to divide content.
- **Do** keep every surface square, including the hero portrait.
- **Do** set body prose in Muted Slate (`#52626b`) at 1.6 line-height and cap
  the measure around 580–650px.
- **Do** reserve Signal Lapis for actions, links and the single emphasised
  clause in a headline.
- **Do** keep interactive targets at ≥44px, and text at ≥`0.8125rem`.
- **Do** write in first person singular. This is one person, not a company.
- **Do** resolve widths inside the sheet against `100%`, never `100vw`.

### Don't:
- **Don't** add box-shadows to create separation. Use a rule or vertical space.
- **Don't** give a section its own lighter background to set it apart. The
  sheet is one paper.
- **Don't** introduce a border radius anywhere, including the portrait. The
  system has no rounded corners left to be consistent with.
- **Don't** use pure white as a background.
- **Don't** narrow `--frame` or `--frame-top` to gain column width; they are
  what make the backdrop readable.
- **Don't** reuse a filename in `public/` for changed bytes. Those files are
  served with a thirty-day `max-age` and are not hashed by the build, so the
  name is the only cache key there is. Append a content hash and update the
  references.
- **Don't** reintroduce a `forwards` or `both` fill on `#root`'s intro. It
  leaves an identity transform behind, which makes `#root` the containing block
  for every `position: fixed` descendant — so the header's backdrop slice
  re-anchors to the document and a stray band of painting appears adrift in the
  page, and `translateY(-200%)` would move an element off the top of the *sheet*
  rather than off the viewport. Hide offscreen things with `clip-path`, which no
  ancestor can defeat.
- **Don't** assume a `fixed` layer inside `#root` is safe just because it works
  today. The header's slice only tracks the viewport because nothing in its
  ancestry is transformed, filtered, or given `will-change` or `contain`. Any of
  those, anywhere above it, silently re-parents it. The backdrop and the matte
  hang off `body` for exactly this reason; the header's slice cannot, because it
  has to sit above the sheet's paper.
- **Don't** glaze the header with paper without bleaching the painting under it
  first. That combination has been tried on its own and it reads as dirt, not as
  glass. The filter is not a finish — it is the load-bearing half of the effect.
- **Don't** widen the header slice's clip back to the full viewport. It is fixed
  and full-bleed, so an unclipped filtered copy paints a bleached band straight
  across the backdrop on both sides of the sheet.
- **Don't** drop the header's bottom rule. The glaze and the sheet are close
  grounds on purpose, and without a drawn edge the header has no boundary — text
  scrolling under it simply stops existing.
- **Don't** drive `--band` from anything that reflows the document. It may only
  feed paint and sticky offsets; putting it on the sheet's margin would relayout
  the page on every scroll frame and move the scroll position driving it.
- **Don't** add eyebrow/kicker labels above headings.
- **Don't** add entrance animations, parallax or scroll-triggered reveals. The
  system has exactly three motions: the once-per-session intro, the top band
  collapsing on scroll, and a 180ms transform on the details toggle chevron.
  The first two are the frame behaving, not the content performing. The line
  that admits them and bans the rest: a motion may map continuously to scroll
  position, but nothing may *fire* at a scroll threshold, and nothing that
  scrolls with the page may travel at a rate different from the page. That bans
  parallax and reveal-on-enter while permitting viewport-fixed frame furniture
  to resize. The band qualifies only because it is fixed and never scrolls past
  anything; the moment an effect lives in the content, the rate rule binds it.
  Anything admitted here still owes `prefers-reduced-motion` an off switch.
- **Don't** invent new small font sizes. The set below 1rem still holds 12
  distinct values, none below the `0.8125rem` floor; new work should snap to
  `0.8125` / `0.875` / `0.96` / `1rem` rather than widen it again.
- **Don't** introduce a second blue or a warm accent. The palette is closed.
