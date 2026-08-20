---
name: Florian Beermann & Partners
description: Customer Success consulting for B2B SaaS companies whose customer base has moved upmarket.
colors:
  paper: "#f3f0e8"
  paper-deep: "#e8e3d7"
  ink: "#202FD6"
  muted: "#565a75"
  line: "rgba(32, 47, 214, 0.26)"
  on-ink: "#ffffff"
  on-ink-muted: "rgba(255, 255, 255, 0.82)"
  inverted-paper: "#202FD6"
  inverted-ink: "#f3f0e8"
  inverted-muted: "rgba(243, 240, 232, 0.84)"
  inverted-line: "rgba(243, 240, 232, 0.32)"
  inverted-on-ink: "#202FD6"
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
    fontFamily: "ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, monospace"
    fontSize: "0.6875rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.16em"
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
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-ink}"
    rounded: "{rounded.none}"
    padding: "0 24px"
    height: "52px"
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
    rounded: "{rounded.none}"
    height: "44px"
---

# Design System: Florian Beermann & Partners

## Overview

**Creative North Star: "Signal on Paper"**

Warm paper and electric blue, alternating edge to edge, set in one ink and
annotated in machine type. The system takes its structure from printed matter —
broadsheets, technical reports, plate captions — and its voltage from a single
saturated blue used at full strength. There is no card, no drop shadow, no
rounded container standing in for hierarchy, and no frame around the page.
Structure is carried entirely by rules, whitespace, type scale and the boundary
between the two grounds.

Two things make it specific rather than generic minimalism:

1. **The blue is a surface, not an accent.** `#202FD6` is the ink the page is
   set in *and* the ground whole sections are printed on. It is never used as a
   highlight, a pill, a badge or a "brand colour" sprinkled onto neutral UI.
   Sections either sit on paper or sit on blue; nothing sits in between.
2. **There are two type registers.** Argument is set in Inter Tight, enormous
   and tight. Machine facts — figure numbers, field labels, section markers,
   the footer — are set in monospace, small and widely tracked. The contrast
   between "written by a person" and "printed by an instrument" is the voice.

The density is deliberately uneven. Display type runs to 7rem with negative
tracking and sub-1 line-height so headlines read as one dense mass, while body
copy holds a generous 1.6 and the page breathes at `clamp(6rem, 10vw, 10rem)`
between sections. That swing is the personality: nothing is evenly grey.

**Anti-references:** SaaS marketing pages with a hero gradient and three
feature cards; consultancy sites that use blue as a tie colour; anything with a
rounded corner, a soft shadow or a colour ramp of five blues.

## Colors

The entire system is two values. Everything else is one of those two at reduced
alpha, or a compositing of the two.

### The pair

| Token | Value | Role |
|---|---|---|
| `--paper` | `#f3f0e8` | Warm, slightly yellowed sheet. Never pure white. |
| `--ink` | `#202FD6` | Deep, slightly violet blue. All type, all rules, all fills. |

`#202FD6` sits at 235°, 74% saturation — a little off the sRGB primary and a
long way off a corporate blue. The primary itself (`#0000ff`) was the first
version of this system and it was too raw: an unmixed channel maximum reads as a
default rather than as a choice, and at full-page scale it fringes. Pulling a
little green in and a little brightness out keeps the voltage and gains an ink.

Do not soften it further. A navy, a slate or a "brand blue" makes the page look
committee-designed and immediately cheapens it. Do not tint it, do not add a
second blue, and do not build a scale from it.

### Derived tokens (on paper)

| Token | Value | Notes |
|---|---|---|
| `--paper-deep` | `#e8e3d7` | Sheet edges and inset grounds only. |
| `--muted` | `#565a75` | Secondary body copy. A desaturated blue-grey, not a neutral grey. |
| `--line` | `rgba(32, 47, 214, 0.26)` | Every hairline rule. |
| `--on-ink` | `#ffffff` | Type on a blue fill (buttons). |
| `--on-ink-muted` | `rgba(255, 255, 255, 0.82)` | Secondary type on a blue fill. |

### The inversion scope

`.site-inverted` flips the same six tokens rather than restyling anything:

```
--paper: #202FD6;         --ink: #f3f0e8;
--paper-deep: #1A27B0;    --muted: rgba(243, 240, 232, 0.84);
--line: rgba(243, 240, 232, 0.32);
--on-ink: #202FD6;        --on-ink-muted: rgba(32, 47, 214, 0.78);
```

Because every component reads tokens and never literal colours, adding one class
to a section inverts the whole subtree — headings, body, rules, form fields,
placeholders, the submit button's hover state — with no additional CSS. This is
the single most important mechanic in the system.

**Consequence:** a hardcoded `white` or `rgba(255,255,255,…)` anywhere in a
component is a latent bug, not a shortcut. It will survive inversion and break
it. `.site-footer` shares the inverted declaration for the same reason.

### Contrast

Paper on blue is **7.56:1**. `--muted` at `0.84` alpha composites to
`rgb(209, 209, 229)` = **5.73:1** — comfortably over the floor. Below about
`0.72` it drops under the body-text floor. **0.84 is the minimum safe alpha; do
not lower it,** and do not stack an additional `opacity` on top of a muted token
(this is why form placeholders carry `opacity: 1` and take their dimming from
`--muted` alone). White on the blue holds **8.61:1**.

### Named Rules

- **One Blue.** There is exactly one blue in the system. A second blue is a bug.
- **No Third Colour.** Company logos, illustrations and any imported artwork are
  reduced to the two-value system (see *The Logo Wall*). The only permitted
  exception is a photograph, and there are currently none.
- **Grounds, Not Accents.** Blue appears as a full-bleed surface or as type. It
  never appears as a chip, a tag, a progress bar or a coloured icon.
- **Never Pure White as a Ground.** `#ffffff` exists only as `--on-ink`, i.e.
  type sitting on a blue fill.

## Typography

Two families, three jobs.

- **Inter Tight Variable** — display, headline, title. Weight 520, negative
  tracking from `-0.045em` to `-0.067em`, line-height below 1. Headlines are
  meant to read as a solid block, not a sequence of words.
- **Inter Variable** — body and UI. 400 weight, 1.6 line-height,
  `clamp(1.02rem, 1.25vw, 1.16rem)`.
- **System monospace** (`--mono`) — the label register. `0.6875rem`, weight 500,
  `0.16em` tracking, uppercase, via the `.site-label` utility.

Both Inter cuts are self-hosted, licensed, subsetted variable fonts in
`public/fonts/` and preloaded. The mono stack is deliberately *not* a webfont:
`ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono",
monospace` costs zero bytes on a page already shipping two variable fonts.

### Hierarchy

| Role | Size | Family |
|---|---|---|
| Display (hero) | `clamp(4rem, 6.7vw, 7rem)` | Inter Tight |
| Headline (section) | `clamp(2.8rem, 5vw, 5.4rem)` | Inter Tight |
| Title | `clamp(1.8rem, 3vw, 3.1rem)` | Inter Tight |
| Body | `clamp(1.02rem, 1.25vw, 1.16rem)` | Inter |
| Label | `0.6875rem` uppercase, `0.16em` | Mono |

### The mono register

Monospace is reserved for text a machine would have printed. Currently:

- Plate captions (`FIG. 01`, `FLORIAN BEERMANN`)
- Form field labels
- Definition-list terms (`TARGETS`, `TOOLING`)
- Engagement numbers
- The entire footer

It is never used for a heading, a sentence, or a call to action. The rule is
*category*, not decoration: if a human wrote it as prose, it is Inter.

### Named Rules

- **Headlines Are Blocks.** Sub-1 line-height and negative tracking are not
  optional; they are what stops the display type reading as a slogan.
- **No Bold Body.** Emphasis inside body copy comes from `--ink` versus
  `--muted`, not from weight.
- **Labels Are Mono, Always.** A tracked uppercase label in Inter is the old
  system and should be migrated if found.

## Layout

### Full bleed

There is no frame. `.site-page` runs edge to edge with `margin: 0` and takes the
safe-area insets as *padding*, so the paper still runs under a notch and a home
indicator while the content inside clears them. The sticky header docks at
`top: 0`.

The page used to be a paper sheet inset on all four sides by a blue field, with
a deeper band at the top that collapsed over the first `240px` of scroll. Both
existed to show a painting of Hamburg behind the page. Once the painting became
a flat colour there was nothing behind the sheet left to reveal, so the margin
was spending real estate — and an opening gesture — on a plain fill. `--frame`,
`--frame-top`, `--band`, `--band-collapsed`, `--band-collapse-range`, the
`band-collapse` keyframes and the `@property --band` registration are all gone.

`body::before` remains as a single fixed layer painting `--backdrop` plus the
grain. It is what an elastic overscroll exposes past either end of the document,
and it is why the page never bottoms out on white.

### Inside a section

- Content container: `min(100%, 1240px)`, centred.
- Section rhythm: `clamp(6rem, 10vw, 10rem)`.
- Horizontal gutter: `4vw`, and the hero resolves the same edge with
  `padding-left: max(4vw, calc((100% - 1240px) / 2))` so it aligns with every
  section below it at every width.
- Grid columns are asymmetric by default (`0.8fr 1.2fr`, `1.1fr 0.86fr`). A
  50/50 split is the exception, not the baseline.

### Alternating grounds

Structure at page level is carried by ground changes, not by containers.
Inverted sections (`.home-method`, `#contact`, `.site-footer`) paint blue from
edge to edge; everything between them is paper. The sticky paper header then
reads as a bar floating on blue whenever a blue section is behind it.

Sections are full-bleed, but their *content* still sits in the `1240px`
container, so the type stays aligned across a ground change even though the
colour does not stop.

## Elevation & Depth

There is none. No shadows, no blurs behind panels, no z-translation on hover.
Depth in this system is *ground change* — paper to blue — and nothing else. A
`box-shadow` on a blue surface is doubly wrong: it is off-system, and a dark
halo on a saturated primary reads as printing misregistration.

The single permitted `box-shadow` is functional, not decorative: the
`inset 0 0 0 1000px var(--paper)` used to defeat browser autofill backgrounds,
and the `0 1px 0` that thickens a focused input's underline without moving it.

## Shapes

`border-radius: 0` everywhere. Buttons, fields, panels, the select menu, the
ASCII plate. There is no exception, and no token for one.

## Components

### Buttons
- **Shape:** square.
- **Primary (hero CTA):** `--ink` background, `--on-ink` text, `0 24px`,
  `52px` min-height, 650 weight at `0.86rem`, sentence case.
- **Submit:** `--ink` background, `--on-ink` text, mono Label type, `16px 24px`,
  `54px` min-height. The case change separates a form's terminal action from a
  navigational CTA. Its hover state inverts to `--paper`/`--ink`, which means it
  keeps working inside `.site-inverted` for free.
- **Hover / Focus:** colour swap only. No lift, no scale, no shadow. All
  interactive targets are ≥44px.

### Inputs / Fields
- **Style:** underline only. Transparent background, `border-bottom: 1px solid
  var(--line)`, `48px` min-height. Textareas take a full 1px border,
  `0.9rem` padding, `150px` min-height.
- **Focus:** border colour goes to `--ink` and `box-shadow: 0 1px 0` adds a
  second pixel.
- **Labels:** mono Label type above the field, always visible. No
  placeholder-as-label.
- **Autofill:** neutralised with `box-shadow: inset 0 0 0 1000px var(--paper)`,
  `-webkit-text-fill-color: var(--ink)` and a 100000s background transition.
  The browser paints autofill outside the cascade; this is the only way.

### Navigation
- Text links at `0.84rem` / 520 in `--ink`, `44px` min-height, transparent 1px
  bottom border that becomes `currentColor` on hover and focus-visible.
- Sticky paper header docked at `top: 0` with a `--line` rule beneath it. It
  reads as a paper bar floating on blue whenever an inverted section is behind
  it.
- **The mark:** the wordmark alone — "FLORIAN BEERMANN & PARTNERS" set as
  letterspaced type. There is no monogram; the previous "FB&P" lockup was
  retired and should not be reintroduced.

### The Logo Wall
Employer marks arrive as a mix of full-colour PNG and SVG. They are rendered as
`mask-image` silhouettes filled with `currentColor`, so five foreign palettes
collapse into the page ink. A mask reads alpha rather than colour, so raster and
vector behave identically. Never render a third-party mark in its own colours on
this site.

## Signature Component: The ASCII Portrait Plate

The hero portrait is not a photograph. It is a committed 140×103 character
rendering of the sitter's head, shoulders and chest
(`src/assets/portrait-ascii.txt`, ~17 KB, replacing 189 KB of responsive
images), generated deterministically by `scripts/generate-portrait-ascii.mjs`
(`npm run portrait`). The source photograph lives at
`scripts/assets/portrait-source.jpg` — a build input, deliberately not in
`public/`.

It sits in an inverted plate that bleeds to the viewport edge, under a hairline
and two mono captions: `FIG. 01` and `FLORIAN BEERMANN`. The plate is the
clearest statement of the whole system — a person rendered by an instrument, in
one ink, on the ground colour.

**It must be paper characters on blue.** The source is a lit sitter against a
dark stage; sweater and backdrop share a luminance, so no tone curve separates
them. With a natural dark-to-dense ramp both become solid ink and the face
becomes a hole. With the inverted ramp the lit sitter occupies the dense end and
everything unlit falls away. The artwork therefore belongs in an inverted scope
and nowhere else.

**Separation is geometric, and it has to be.** The matte is the union of two
feathered ellipses — one over the skull, one much wider and lower over the
shoulders — written in *source-image* coordinates so they stay pinned to the
sitter if the crop is retuned. Tone cannot separate him from the stage, and
neither can focus: the shot is wide open, but at cell resolution the Microsoft
logo and the lit screen edges carry more local detail than his knit does, so a
sharpness matte keeps the stage and drops the body. That was tried; it failed
that way.

**The bust needs two tone curves.** His lit face sits near 0.5 luminance and the
navy sweater near 0.13. One curve across that span has to spend most of its
steps getting from the sweater to the chin, so whichever end is favoured the
other collapses. Head and body are therefore measured separately and blended
across the collar (`ZONES`), with the body held under a ceiling so he still
reads as lit from the front. The detail pass is zone-aware for the same reason:
full unsharp on the face, almost none on the sweater, where amplifying the weave
only amplifies sensor noise.

Three implementation facts are load-bearing:

- **The grid is self-measuring.** `Home.tsx` computes the widest line at module
  scope and passes it as `--ascii-columns`; CSS sizes the type with
  `calc(100cqw / (var(--ascii-columns) * 0.6))`. Never hardcode the column
  count — the generator trims trailing whitespace, so regenerating changes it,
  and `COLS` itself has moved once already (108 → 140) to keep enough cells
  across the face once the crop widened to a bust.
- **`line-height: 1.15` is part of the aspect contract.** The generator computes
  rows from `CHAR_ASPECT = 0.6 / 1.15` (glyph advance ÷ line height). Change one
  and the other must move or the face distorts.
- **The plate is `display: block`, not flex.** As a flex container it stretches
  the `<pre>`; as a flex item the `<pre>` shrinks and never fills the plate.

Accessibility: the `<pre>` is `aria-hidden`, and the figure carries
`role="img"` with an `aria-label`. A screen reader must never be handed 5,000
punctuation characters.

## Signature Texture: Print Grain

Every blue surface carries a fine two-pass `feTurbulence` grain as a data URI
(`--grain`), applied to `body::before` at `baseFrequency 0.85`, `numOctaves 2`,
with `stitchTiles="stitch"` for seamless repeat.

**Blend modes are a trap on a colour this saturated.** `overlay` and
`soft-light` have 0 and 1 as fixed points, so on a near-channel-max blue they do
almost nothing — on `#0000ff` they did literally nothing. The grain must
composite with normal alpha. Alpha is driven from the noise's own luminance via
`feColorMatrix` with a negative intercept, so quiet areas clamp fully
transparent and only the peaks print.

Few octaves at high frequency reads as grain; many octaves reads as clouds. Two
is correct.

## Signature Moment: Scroll Reveals

Two scroll-scrubbed transitions, both on `animation-timeline: view()` and both
gated behind `@supports (animation-timeline: view())` and
`@media (prefers-reduced-motion: no-preference)`. Neither runs any JavaScript.

**`.site-reveal`** — a block arrives: opacity plus `1.4rem` of upward travel,
over `entry 4% cover 20%`. Used on section headings, engagement cards and the
method and contact blocks.

**`.site-sweep`** — a paragraph *resolves* top-down, two or three lines ahead of
the eye, over `entry 10% cover 52%`. This is one of the two effects the
reference site's scroll is actually built from, and it is worth recording what
it is, because it is easy to misread from a screen recording. Measured frame by
frame, that site's sections do not stack, pin or cover each other: between 2.79s
and 3.07s of the reference capture its hero headline moves −135px and the
incoming section's top edge moves −130px, which is one page scrolling normally.
Its drama comes from text arriving progressively and from a hero that never
stops moving — not from the layout.

The reference splits every paragraph into line elements at runtime and drives
them from a scroll library. A gradient mask gets the same read with no DOM
surgery and no library, and it has the better failure mode: nothing to re-split
on resize, on a font swap, or when a paragraph reflows, because the mask is
geometry over the rendered box rather than a snapshot of where the lines
happened to break.

Two rules for it:

- **`--sweep-band` is a length, not a percentage.** These blocks run from two
  lines to a dozen; a fractional band fades a short paragraph over half a line
  and a long one over eight. At `4.5rem` about two lines are mid-fade whatever
  the block's height.
- **Only put it on copy that starts below the fold.** An element already on
  screen at rest has no scroll behind it to scrub, so it sits permanently
  half-masked. The hero's opening paragraph had to have the class taken back
  off it for exactly this reason.

Because both animations use a `both` fill, the pre-range state is held, so
elements far below the fold correctly render masked or at `opacity: 0` in a
full-page screenshot. That is expected; verify by scrolling, not by
screenshotting the document.

## Signature Motion: The Living Plate

The ASCII portrait is never still. `src/lib/ascii-motion.ts` rewrites the grid
about thirty times a second: a dissolve on arrival, where the plate assembles
out of its own sparsest characters, and then two slow standing waves that walk
cells a step or two along the ramp for as long as the visitor is on the page.

This is the single most important thing about the hero and the easiest to lose.
The reference site's hero is a 3D form under a dither shader, and the giveaway
is that it moves *without any scrolling at all* — across the reference capture
the page has not scrolled between 0.05s and 1.07s and the artwork has still
visibly rotated. A still dithered image reads as a texture. A moving one reads
as something being rendered, live, by an instrument. That difference is the
whole personality of this hero, and a static plate simply does not have it.

There is no 3D form here, only one photograph, so the movement comes from the
rendering rather than the subject. Three things make it cheap:

- **It ships no new artwork.** The committed grid is already a quantised
  luminance map — every glyph *is* its own tone, an index into `RAMP` — so the
  animation reads indices out of the same text the static plate uses, perturbs
  them, and writes glyphs back. Nothing is decoded and nothing is fetched.
- **The two waves multiply rather than add**, so their crests coincide only
  occasionally and the surface never falls into an obvious rhythm. One wave
  alone reads as a scanline sweeping a screen.
- **Blank cells stay blank.** Letting the wave push them into visibility would
  grow a halo of stray glyphs around the sitter and undo the matte the generator
  works hard for.

Amplitude is capped at two ramp steps. One is nearly invisible on a ten-level
ramp; past three the face itself starts to come apart. It pauses off-screen
through an `IntersectionObserver`, and under `prefers-reduced-motion: reduce` it
renders the committed text and stops. Every browser API it touches is
feature-detected rather than shimmed, so the fallback that ships is the one the
tests exercise.

## Signature Motion: The Cover-Scroll

Each section is a `.site-panel`: it pins once it has been read and the next
section slides up over it, so the page reads as a stack of plates being dealt
rather than one continuous ribbon.

**This is an addition, not a reproduction.** The reference does not do it — see
the frame measurements above. It is here because the page wanted its scroll to
be a mechanism, and it should be judged on its own merits rather than on
fidelity to anything.

Three things make it work, and all three were found by it going wrong first:

- **The offset is the whole trick.** `top: 0` pins a panel's *top* edge, which is
  right only while the panel fits the window; a taller section would park with
  its overflow stranded below the fold and the visitor could never reach it. A
  negative offset equal to the overflow parks the *bottom* edge at the bottom of
  the window instead, so a tall panel scrolls fully into view and only then
  holds. CSS cannot compute this — percentages in `top` resolve against the
  containing block, and container query units resolve for a container's
  descendants rather than for the container itself — so `--panel-h` is published
  by `lib/panel-scroll.ts` from a `ResizeObserver`, on layout and never on
  scroll. Its fallback is deliberately absurd (`9999px`) so an unmeasured panel
  resolves to a `top` far outside the document and simply never pins.
- **Panels must be opaque and full-bleed.** A transparent panel shows the one
  pinned beneath it. So does a panel narrower than the viewport: `.home-section`
  used to be a 1240px box centred by auto margins, which left a strip down each
  side where the previous panel showed through. It is now full width with the
  same content box reached by padding.
- **Every panel must fill the window, and carry a top edge.** A panel shorter
  than the viewport pins with the *next* panel already occupying the rest of the
  screen, so the visitor never sees one plate at a time — they see two, with the
  upper one frozen, which is indistinguishable from a broken sticky element. At
  1920×1080 four of the six sections were shorter than the window. `min-height:
  100svh` fixes it, and `align-content: center` keeps the content off the top
  edge of the ones that grew. Separately, two of the five transitions are paper
  onto paper: with no rule between them the cover has nothing to show and the
  pinning reads as a stuck page, so every panel after the first takes a
  `--line` top border.
- **Scroll-driven reveals inside a panel must finish during `entry`.** This is
  the subtle one. A pinned panel's contents stop moving relative to the
  scrollport, so a `view()` timeline freezes — and any transition whose range
  extends past the pin is stranded there for good. Measured at 1920×1080, a
  `cover 20%` endpoint left the proof heading permanently at opacity 0.61 and
  its paragraph 21% swept. Both ranges now end inside `entry`, which always
  completes before a panel can pin, whatever the panel's height.

Disabled under `prefers-reduced-motion: reduce` — pinning changes what
scrolling *does*, and a visitor who asked for reduced motion asked for the plain
behaviour.

## Signature Component: The Halftone Plate

The second rendering of the same photograph: a rotated dot screen in the two
inks, generated by `scripts/generate-halftone.mjs` (`npm run halftone`). Where
the hero's ASCII plate renders the sitter as type, this renders him as print.

Two cuts are emitted, because a duotone plate only works on the ground it was
screened for — `portrait-halftone.png` is ink on paper, and
`portrait-halftone-inverted.png` is paper on ink for blue surfaces. Dropping the
first onto blue would print blue dots on blue.

- **The screen is at 45°.** Not decoration. An unrotated screen puts its dots on
  the same axes as the image's own structure and the two interfere into visible
  banding; 45° is maximally out of phase with horizontal and vertical detail,
  which is why every duotone screen in print is set there.
- **Dot coverage is analytic**, not a hard edge — a pixel's ink is how much of
  it the disc covers. That is what keeps a 7px screen from looking jagged
  without any supersampling.
- **It needs the same two-zone tone treatment as the ASCII plate**, and for the
  same reason. Having more levels available than a ten-step ramp does not help:
  the problem is that the lit face sits near 0.5 luminance and the navy sweater
  near 0.13, so one curve across both leaves the face flat and the body bare.
  The body additionally needs its own *white* point, because its zone runs from
  the collar down and its top percentiles are lit neck skin rather than knit.
- **Scale it in whole ratios.** A dot screen resampled at an arbitrary ratio
  moirés against the pixel grid, and because the artefact is high-frequency
  noise it roughly doubles the encoded file too. The social card pins its plate
  column to exactly half the plate's width for this reason.

## Signature Component: The Share Card

`public/social-preview.jpg` is generated from `scripts/social-card.html` — a
real page, rendered headless at 1200×630, rather than a drawing. It has to be
set in the site's own faces at the site's own tracking, and re-drawing that in a
generator would drift the moment the type moved.

It is the hero, cropped to a card: paper left with the wordmark and headline,
an inverted halftone plate right. The card it replaced still carried the retired
"fb" monogram, the old navy and lapis inks, rounded blob shapes and a white
ground — an entire identity the site had already stopped using.

It is heavier than a flat card would be (~230 KB) because a dot screen is
high-frequency detail and JPEG dislikes it. That is accepted: the file is
fetched by crawlers building a preview, never by a visitor loading the page, so
it is not on any critical path.

## Do's and Don'ts

### Do:
- Treat blue as a ground. Whole sections, edge to edge.
- Add `site-inverted` to flip a section; let the tokens do the work.
- Use `.site-label` for anything a machine would have printed.
- Keep `border-radius: 0` and let rules and whitespace carry structure.
- Set headlines tight enough that they read as a mass.
- Reduce any imported artwork to the two-value system.
- Regenerate the portrait with `npm run portrait` and commit the text.
- Regenerate the halftone plates with `npm run halftone` and the share card from
  `scripts/social-card.html` whenever the ink, the type or the photograph move.
- Scale a halftone plate in whole ratios only.
- Keep the ASCII plate moving. A still one is a texture; a moving one is an
  instrument, and that difference is the hero.
- Give every `.site-panel` an opaque, full-bleed background.

### Don't:
- Introduce a second blue, a tint, or a gradient of `#202FD6`.
- Hardcode `white` or `rgba(255,255,255,…)` in a component — it breaks
  inversion.
- Drop `--muted` below `0.84` alpha on blue, or stack `opacity` on top of it.
- Add a shadow, a blur, a lift or a scale to anything.
- Use blend modes to texture the blue; they are near no-ops at this saturation.
- Use mono for prose, or Inter for a label.
- Hardcode the ASCII column count.
- Put `.site-sweep` on anything visible above the fold — it will sit permanently
  half-masked.
- End a `view()` range in `cover` on anything inside a `.site-panel`; it freezes
  when the panel pins. Finish inside `entry`.
- Let a panel be shorter than the viewport, or leave one without a top edge.
- Express `--sweep-band` as a percentage; it has to be a length.
- Let the ASCII wave push blank cells into visibility — it haloes the sitter.
- Shim a missing browser API in `ascii-motion.ts` or `panel-scroll.ts`. Both
  feature-detect so the shipped fallback is the tested one.
- Reintroduce the "FB&P" monogram.
