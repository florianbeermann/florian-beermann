---
name: Florian Beermann & Partners
description: Customer Success consulting for B2B SaaS companies whose customer base has moved upmarket.
colors:
  palette-ivory: "#f5fbef"
  palette-muted-teal: "#92ad94"
  palette-dusty-olive: "#748b75"
  palette-chocolate-plum: "#503d42"
  palette-yellow-green: "#84c318"
  voltage-origin-blue: "#0000ff"
  paper: "#503d42"
  paper-deep: "#453337"
  ink: "#f5fbef"
  muted: "rgba(245, 251, 239, 0.84)"
  line: "rgba(245, 251, 239, 0.32)"
  on-ink: "#503d42"
  on-ink-muted: "rgba(80, 61, 66, 0.78)"
  voltage: "#0000ff"
  on-voltage: "#f5fbef"
  light-paper: "#f5fbef"
  light-paper-deep: "#e6eee0"
  light-ink: "#503d42"
  light-muted: "#5e735f"
  light-line: "#92ad94"
  light-on-ink: "#f5fbef"
  voltage-paper: "#0000ff"
  voltage-paper-deep: "#0000d6"
  voltage-ink: "#f5fbef"
  voltage-line: "rgba(245, 251, 239, 0.42)"
  destructive: "hsl(0 84% 60%)"
typography:
  display:
    fontFamily: "Outfit Variable, sans-serif"
    fontSize: "clamp(4rem, 6.7vw, 7rem)"
    fontWeight: 520
    lineHeight: 0.91
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Outfit Variable, sans-serif"
    fontSize: "clamp(2.8rem, 5vw, 5.4rem)"
    fontWeight: 520
    lineHeight: 0.95
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Outfit Variable, sans-serif"
    fontSize: "clamp(1.8rem, 3vw, 3.1rem)"
    fontWeight: 520
    lineHeight: 1
    letterSpacing: "-0.03em"
  body:
    fontFamily: "Outfit Variable, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(1.11rem, 1.36vw, 1.26rem)"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  ui:
    fontFamily: "Outfit Variable, sans-serif"
    fontSize: "0.94rem"
    fontWeight: 520
    lineHeight: 1.4
    letterSpacing: "normal"
  ui-small:
    fontFamily: "Outfit Variable, sans-serif"
    fontSize: "0.89rem"
    fontWeight: 400
    lineHeight: 1.5
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
    backgroundColor: "{colors.voltage}"
    textColor: "{colors.on-voltage}"
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

A dark plum stock printed in ivory, with two light bands cut into it and one
band printed in the sRGB primary blue. The system takes its structure from
printed matter —
broadsheets, technical reports, plate captions — and its charge from a single
high-chroma green spent in two places only. There is no card, no drop shadow, no
rounded container standing in for hierarchy, and no frame around the page.
Structure is carried entirely by rules, whitespace, type scale and the boundary
between grounds.

Three things make it specific rather than generic minimalism:

1. **The ground carries the page; the light is the event.** `#503d42` is the
   stock every section is printed on by default. The two sections that go light
   are the evidence and the ask — where the experience comes from, and the
   contact form — so the sheet reads as something switched on rather than as the
   default state.
2. **The voltage is a ground, never a garnish.** `#0000ff` is the only colour in
   the palette with any current, and it is spent on a short enumerated list of
   surfaces. It is never a chip, a tag, a coloured icon or a highlight sprinkled
   onto neutral UI. It is also the only value here that is not drawn from the
   logo palette: a raw channel maximum against a warm plum stock reads as an
   instrument, not as decoration.
3. **There are two type registers.** Argument is set in Outfit — the face the
   wordmark itself is cut from — enormous and tight. Machine facts — figure
   numbers, field labels, section markers, the footer — are set in monospace,
   small and widely tracked. The contrast between "written by a person" and
   "printed by an instrument" is the voice.

The density is deliberately uneven. Display type runs to 7rem with negative
tracking and sub-1 line-height so headlines read as one dense mass, while body
copy holds a generous 1.6 and the page breathes at `clamp(6rem, 10vw, 10rem)`
between sections. That swing is the personality: nothing is evenly grey.

**Anti-references:** SaaS marketing pages with a hero gradient and three
feature cards; developer-tool dark modes, which is where a dark page with one
saturated accent goes if it is left to its own instincts — this is printed
stock, not a terminal, which is why the ground is a warm plum and never a
neutral charcoal; the default-blue corporate site, which is what a raw `#0000ff`
becomes the moment it is used as a tie colour instead of as a full-bleed ground;
anything with a rounded corner, a soft shadow or a five-step tint ramp.

## Colors

Five colours in three jobs: a stock, an ink, and a current. Four are taken from
the logo's own palette; the current is not, and that exception is deliberate —
see *The voltage* below. The palette's yellow-green (`#84c318`) held the current
until the blue replaced it and is now unused on the site; it stays recorded here
because it is part of the source palette, not because anything renders it. Everything else is one of those at reduced alpha, or a
compositing of two of them.

The token names describe *roles*, not brightness: `--paper` is whatever the
ground is and `--ink` is whatever is printed on it. On this site the stock is
dark and the ink is light, the way a page printed on charcoal card is. That is
why the flip from a light page to a dark one was a swap of two declaration
blocks and touched no component.

### The pair the page is printed with

| Token | Value | Role |
|---|---|---|
| `--paper` | `#503d42` | Dark warm plum. The stock: every section by default, the header, the backdrop. |
| `--ink` | `#f5fbef` | Ivory. All type, all rules, and the light bands' ground. |

`#503d42` sits at 344° with very little chroma — closer to a printing ink than
to a brand colour, and warm enough that the page never reads as a neutral dark
UI. The pair measures **9.55:1** in both directions, which is what makes the
system reversible at all.

Do not cool the stock toward charcoal and do not introduce a neutral grey
alongside it. The warmth is the difference between printed stock and a dark
theme.

### The voltage

| Token | Value | Role |
|---|---|---|
| `--voltage` | `#0000ff` | The sRGB primary, unmixed. A ground, and only ever a ground. |
| `--on-voltage` | `#f5fbef` | The ivory, sitting on it at 8.15:1. |

It is spent in four places and no more: the statement band (`.site-voltage`),
the portrait plate, the primary call to action, and the ampersand tile in the
wordmark. The selection highlight borrows the same relationship for the length
of a drag. Every one of those is a *ground* with the plum sitting on it at
8.15:1 — none is a tint, an outline, an icon or a highlight, and that is the
distinction the rule below protects.

The blue takes the **ivory**, never the plum: plum on this blue measures
**1.17:1**. The chartreuse this replaced had the opposite polarity — it was a
light and took dark type — so every surface printed on the voltage flipped when
the value changed. The same figure is why the blue may not appear as a small
mark on the page's own stock: 1.17:1 against the plum makes a blue hairline or
icon invisible. It works as a ground, or not at all.

### Derived tokens (on the stock)

| Token | Value | Notes |
|---|---|---|
| `--paper-deep` | `#453337` | Inset grounds only. The stock a step deeper. |
| `--muted` | `rgba(245, 251, 239, 0.84)` | Secondary prose. A tint of the ink, never below `0.84`: it composites to `rgb(219, 220, 211)` and holds **7.34:1**. |
| `--line` | `rgba(245, 251, 239, 0.32)` | Every hairline rule. |
| `--on-ink` | `#503d42` | Type on a filled control, which on this ground is an ivory fill. |
| `--on-ink-muted` | `rgba(80, 61, 66, 0.78)` | Secondary type on that fill. |

### The light bands

`.site-inverted` and `.site-footer` flip the same tokens rather than restyling
anything. Two sections carry it — the proof section and the contact form — plus
the footer:

```
--paper: #f5fbef;         --ink: #503d42;
--paper-deep: #e6eee0;    --muted: #5e735f;
--line: #92ad94;
--on-ink: #f5fbef;        --on-ink-muted: rgba(245, 251, 239, 0.82);
```

Note that `--muted` and `--line` are *not* the dark scope's values re-tinted.
`#748b75`, the palette's dusty olive, measures only **3.50:1** on ivory and
fails the body floor, so the light bands take a darkened cut (`#5e735f`,
**4.87:1**) for prose and the muted teal at full strength (`#92ad94`) for rules.
A hairline of diluted plum composites to a dead warm grey; a rule that stays a
colour is what stops a page built entirely from rules looking like a wireframe.

`.site-voltage` is the same mechanic on the blue, and it is deliberately
not a class any section may reach for:

```
--paper: #0000ff;         --ink: #f5fbef;
--paper-deep: #0000d6;    --muted: #f5fbef;
--line: rgba(245, 251, 239, 0.42);
--on-ink: #0000ff;        --on-ink-muted: rgba(0, 0, 255, 0.78);
```

Because every component reads tokens and never literal colours, adding one class
to a section re-prints the whole subtree — headings, body, rules, form fields,
placeholders, the submit button's hover state — with no additional CSS. This is
the single most important mechanic in the system.

**Consequence:** a hardcoded `white` or `rgba(255,255,255,…)` anywhere in a
component is a latent bug, not a shortcut. It will survive the flip and break
it.

### Grain

Grain goes on inked surfaces, which now means the page itself and the blue
band — not the light bands, which are the sheet rather than the ink. On a dark
warm ground it is doing real work beyond texture: that value range is exactly
where 8-bit banding shows, and the noise dithers it away for free.

### Contrast

Ink on stock is **9.55:1**; `--muted` at `0.84` composites to **7.34:1**, and
below about `0.62` it drops under the body-text floor. **0.84 is the minimum
safe alpha; do not lower it,** and do not stack an additional `opacity` on top of
a muted token (this is why form placeholders carry `opacity: 1` and take their
dimming from `--muted` alone).

The blue band carries the ivory at **8.15:1**, so headroom is not what keeps a
form off it — the reason is that it is the loudest surface on the site, and a
form asks the visitor to concentrate rather than to look. `--muted` there
resolves to the ink itself, so secondary text steps down by scale rather than by
tone and the whole band stays at full strength. The form lives on a light band
instead.

### Named Rules

- **One Stock.** There is exactly one plum in the system. A second is a bug.
- **The Voltage Is a Ground.** The blue appears as a full-bleed surface, a
  button fill, the ampersand tile, or the selection highlight. It never appears
  as a chip, a tag, a progress bar, a coloured icon or a hairline. It never sets
  type on the stock — the ivory sits on it, not the other way round.
- **The Loud Surfaces Are Enumerated.** Three: the statement band, the primary
  button, and the ampersand tile. That list is the design, not a default —
  adding a fourth is a decision to make deliberately, because each new one costs
  the others some of their charge.
- **Light Is the Exception.** Two sections and the footer go light. Making a
  third one light spends the mechanic; if a section needs separation, it needs a
  rule or whitespace, not a ground change.
- **No Sixth Colour.** Company logos, illustrations and any imported artwork are
  reduced to stock and ink (see *The Logo Wall*). The only permitted exception is
  a photograph, and there are currently none. `--destructive` is a deliberate
  seventh value held in reserve for error states — an error must not be brand
  coloured — and nothing renders it today.
- **Never Pure White.** `#ffffff` does not appear in this palette at all. The
  light ink is the ivory.
- **The Focus Ring Is `currentColor`.** The blue would be a good ring on a light
  band (8.15:1) and an invisible one on the stock (1.17:1), and an indicator
  whose reliability changes by section is not an indicator. Focus is carried by
  the element's own rule strengthening to `currentColor`, which is scope-adaptive
  and always high contrast.

## Typography

One family, three jobs, plus a machine register.

- **Outfit Variable** — the face the wordmark is cut from, and now the face the
  whole site is set in. Display, headline and title take weight 520 with
  negative tracking from `-0.028em` to `-0.035em` and line-height below 1;
  headlines are meant to read as a solid block, not a sequence of words. Body
  and UI take 400 at 1.6 line-height.
- **System monospace** (`--mono`) — the label register. `0.6875rem`, weight 500,
  `0.16em` tracking, uppercase, via the `.site-label` utility.

Outfit is self-hosted as a licensed, subsetted variable font in `public/fonts/`
(OFL, licence committed) and preloaded. It replaced Inter and Inter Tight, and
it replaced both with one file: 32KB against their 93KB, because a geometric
face already tightens as it grows and the weight axis supplies the rest, so the
display register no longer needs a separate narrower cut. The mono stack is
deliberately *not* a webfont — it costs zero bytes and every face in it shares
the 0.6em advance the halftone screen is metered against.

### Metrics: why every size moved

Outfit is a geometric face and its proportions are not Inter's. Measured at the
same nominal size:

| | Inter / Inter Tight | Outfit | Ratio |
|---|---|---|---|
| x-height | `0.546em` | `0.481em` | 88% |
| cap-height | `0.728em` | `0.701em` | 96% |
| Body line advance | — | — | 91% |

So the same declared size renders visibly smaller in prose and only marginally
smaller in display. The body and UI band was therefore multiplied by **1.09** —
enough to bring the x-height back to ~8.5px at the smallest step, which is the
floor for comfortable reading — while the display steps were left alone, because
a 4% shorter cap at 7rem is imperceptible and scaling them would have cost a
line of wrapping in the hero.

Tracking moved for the same reason. `-0.067em` was tuned for a tight grotesque;
on Outfit's circular bowls it collides. The display step is now `-0.035em` and
everything below it `-0.03em` to `-0.028em`.

### Hierarchy

| Role | Size | Family |
|---|---|---|
| Display (hero) | `clamp(4rem, 6.7vw, 7rem)` | Outfit 520 |
| Headline (section) | `clamp(2.8rem, 5vw, 5.4rem)` | Outfit 520 |
| Title | `clamp(1.8rem, 3vw, 3.1rem)` | Outfit 520 |
| Body | `clamp(1.11rem, 1.36vw, 1.26rem)` | Outfit 400 |
| UI | `0.94rem` | Outfit 520 |
| UI small | `0.89rem` | Outfit 400 |
| Label | `0.6875rem` uppercase, `0.16em` | Mono |

### The mono register

Monospace is reserved for text a machine would have printed. Currently:

- Plate captions (`FIG. 01`, `FLORIAN BEERMANN`)
- Form field labels
- Definition-list terms (`TARGETS`, `TOOLING`)
- Engagement numbers
- The entire footer

It is never used for a heading, a sentence, or a call to action. The rule is
*category*, not decoration: if a human wrote it as prose, it is Outfit.

### Named Rules

- **Headlines Are Blocks.** Sub-1 line-height and negative tracking are not
  optional; they are what stops the display type reading as a slogan.
- **No Bold Body.** Emphasis inside body copy comes from `--ink` versus
  `--muted`, not from weight.
- **Labels Are Mono, Always.** A tracked uppercase label in Outfit is the old
  system and should be migrated if found.

## Layout

### Full bleed

There is no frame. `.site-page` runs edge to edge with `margin: 0` and takes the
safe-area insets as *padding*, so the paper still runs under a notch and a home
indicator while the content inside clears them. The sticky header docks at
`top: 0`.

The page used to be a paper sheet inset on all four sides by a field of the ink, with
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
The page is the stock, edge to edge. `.home-proof` and `#contact` (plus
`.site-footer`) cut light bands into it and `.home-method` paints the blue;
everything else is the plum. The sticky header is the stock too, so it reads as
an inked bar floating over whichever light band is behind it.

The hero is the exception to the exception: it is the stock, and the portrait
sitting in it has no ground of its own at all — see the plate below.

Sections are full-bleed, but their *content* still sits in the `1240px`
container, so the type stays aligned across a ground change even though the
colour does not stop.

## Elevation & Depth

There is none. No shadows, no blurs behind panels, no z-translation on hover.
Depth in this system is *ground change* — paper to ink — and nothing else. A
`box-shadow` on an inked surface is doubly wrong: it is off-system, and a dark
halo on a flat ground reads as printing misregistration.

The single permitted `box-shadow` is functional, not decorative: the
`inset 0 0 0 1000px var(--paper)` used to defeat browser autofill backgrounds,
and the `0 1px 0` that thickens a focused input's underline without moving it.

## Shapes

`border-radius: 0` everywhere. Buttons, fields, panels, the select menu, the
portrait plate. There is no exception, and no token for one.

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
  reads as an inked bar floating over whichever light band is behind
  it.
- **The mark:** the wordmark alone — "FLORIAN BEERMANN" letterspaced at 0.92em
  above "& PARTNERS", the second line centred on the first line's *ink* rather
  than its advance width, with the ampersand set in a blue square tile of
  1.60 cap heights. Cut from Outfit 200 (OFL) and shipped as outlines, so the
  masthead never waits on a webfont. There is no monogram; the previous "FB&P"
  lockup was retired and should not be reintroduced.

  The tile is the one part of the mark that does not take the wordmark's colour.
  It is always `--voltage` with the ampersand always in the plum on top of it,
  drawn as two paths rather than as a knockout under `fill-rule="evenodd"`. The
  knockout was elegant but ground-dependent: the ampersand showed whatever sat
  behind the mark, so its legibility changed with the section it sat in.
  Painting both values fixes the pair at 8.15:1 everywhere, and the two cuts of
  the file now differ only in the colour of the letters.

  The caps occupy 34.5% of the box against the previous drawing's 28.7%, which
  is why the header sizes it by cap share rather than by height alone.

  It is 11.81:1, wide enough that a phone cannot give it both its width and its
  height: below about 500px the name's caps fall under the nav's own size. That
  is a known, accepted cost of this cut, recorded in `shell.css` beside the rule
  that would otherwise look under-tuned.

### The Logo Wall
Employer marks arrive as a mix of full-colour PNG and SVG. They are rendered as
`mask-image` silhouettes filled with `currentColor`, so five foreign palettes
collapse into the page ink. A mask reads alpha rather than colour, so raster and
vector behave identically. Never render a third-party mark in its own colours on
this site.

## Signature Component: The Portrait Plate

The hero portrait is one committed image, `public/portrait-plate.jpg`, produced
by `scripts/generate-portrait-plate.mjs` (`npm run portrait`) from
`scripts/assets/portrait-source.jpg`. The source is a black-and-white master and
a build input, deliberately not in `public/`.

The generator does exactly one thing: it prints the photograph in one ink.
Luminance is remapped onto a ramp from the page's plum to a light tint of the
same hue, so every tone in the picture is some coverage of one on the other. The
frame is untouched — full bleed of the original, background included, nothing
cut out and nothing composited behind him.

**The restraint is the design.** Two earlier plates did more. The first rendered
the sitter as ASCII; the second segmented him off the stage and set him on a
voltage panel. Both were answers to a real question — a photograph in a
system of flat inks and hairlines looks imported — and both answered it by
rebuilding the picture. A rebuilt picture fails in ways a photographer can see
and a matte cannot fix, and the failure lands on the one image that has to carry
a person's credibility. The tint solves the same problem without touching the
frame: the navy sweater and the blue stage light stop being colours the palette
does not own, and the composition stays the one that was shot.

**The light end of the ramp is not `--paper`.** This is the detail that makes it
read as plum rather than as sepia. The ivory is a faintly green off-white (90°),
so a ramp from the plum to it is a split-tone pulling in opposite directions —
shadows warm, highlights cool — and the two cancel into a neutral grey across
the midtones, which is exactly where a face lives. Ending on a light value that
carries the plum's own hue keeps one colour through the whole range. The plate
can afford this because it keeps its own background: a full frame answers to
nothing but itself, where a cutout had to match the ground it sat on.

**A highlight ceiling holds the top of the ramp short of the light end.** Left to
clip, the lit forehead and the crown flatten and the head loses its modelling —
the silhouette survives, the form does not.

**The framing is fixed, not fitted.** The picture is bounded by the column
rather than sized to it: both axes are caps, both dimensions are `auto`, so it
draws at the largest size that fits without ever being cropped, stretched or
enlarged past its own resolution. It is the same picture at every viewport —
same crop, same headroom, same amount of shoulder.

Sizing it to the box instead (`width: 100%; height: 100%` under `object-fit:
cover`) made the framing a function of the window. The hero's picture column is
a fraction of the width but the full hero height, so its shape ran from 0.79 on
a laptop to 0.33 on a portrait tablet, and `cover` answered by discarding
whatever did not fit: 15% of the photograph in the first case, half of it in the
second. No single crop was wrong; they were just all different, so the portrait
was a different portrait depending on the window.

The upper bound is the photograph's own pixels. The master is 723x1086, and
stretching it to fill a 1281px-tall column on a large display is a 1.18x
enlargement before the device pixel ratio doubles it again — soft and
over-zoomed. Past that size the picture stops growing and the slack becomes air
at the bottom left, which are the two edges the mask dissolves anyway. **A
larger master is the only thing that would let it fill a big display sharply.**

**The picture has no frame and no ground.** It is centred on its column — the
same axis as the caption rule beneath it, since that rule is inset by an equal
gutter on both sides — and all four edges are masked away. The result is a
photograph with no boundary at all: at its perimeter it *is* the stock, and the
sitter emerges from the page he is printed on rather than sitting on a mount cut
into it. The picture and its annotation read as one object rather than as two
things that happen to be stacked.

The two masks are intersected rather than expressed as one radial, so the
horizontal and vertical falloffs stay independent and each is tuned for what it
crosses: the sides are symmetric and generous, because they run through open
background where a short fade reads as a vignette; the top is short, because the
head sits close to it and there is no room to spend; the bottom is longer,
because it has to carry the picture down into the caption's gutter. All are
percentages, so every falloff scales with the picture instead of drifting as the
column changes size.

This only works because the plate is tinted rather than left in neutral grey. A
fade needs the photograph's own shadows to already be the page's ink; a neutral
image would grey out into the plum and read as a smudge instead of a dissolve.
A browser without `mask-composite` gets the unmasked picture — a hard edge,
which is what this replaced and no worse than it was.

Regenerate with `npm run portrait` whenever the ink moves, and commit the
output. If the photograph is replaced, supply a black-and-white master: this
step is a tint, not a conversion, and regrading a colour original here would put
the photographer's decisions in a build script.

Accessibility: it is a plain `<img>` with an `alt` of the sitter's name, and
intrinsic `width`/`height` so the hero cannot reflow when it decodes. It is the
page's LCP element and is preloaded in `index.html`.

## Signature Texture: Print Grain

Every inked surface carries a fine two-pass `feTurbulence` grain as a data URI
(`--grain`), applied to `body::before` at `baseFrequency 0.85`, `numOctaves 2`,
with `stitchTiles="stitch"` for seamless repeat.

**Blend modes are a trap on a flat ground.** `overlay` and `soft-light` have 0
and 1 as fixed points, so on a channel-extreme colour they do almost nothing —
on the `#0000ff` this system started from they did literally nothing, and on the
sRGB primary they do literally nothing. The grain must composite with normal
alpha.
Alpha is driven from the noise's own luminance via `feColorMatrix` with a
negative intercept, so quiet areas clamp fully transparent and only the peaks
print.

It matters more on the plum than it did on the blue before it: a dark warm brown
held across a whole section sits exactly where 8-bit banding shows, and the noise
dithers it away for free.

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
the hero plate renders the sitter as a duotone photograph, this renders him as
print.

Two cuts are emitted, because a duotone plate only works on the ground it was
screened for — `portrait-halftone.png` is ink on paper, and
`portrait-halftone-inverted.png` is paper on ink for inked surfaces. Dropping the
first onto the ink would print ink dots on ink.

- **The screen is at 45°.** Not decoration. An unrotated screen puts its dots on
  the same axes as the image's own structure and the two interfere into visible
  banding; 45° is maximally out of phase with horizontal and vertical detail,
  which is why every duotone screen in print is set there.
- **Dot coverage is analytic**, not a hard edge — a pixel's ink is how much of
  it the disc covers. That is what keeps a 7px screen from looking jagged
  without any supersampling.
- **It needs a two-zone tone treatment**, for the reason the hero plate needs a
  highlight ceiling. Having more levels available than a ten-step ramp does not help:
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
"fb" monogram, superseded inks, rounded blob shapes and a white
ground — an entire identity the site had already stopped using.

It is heavier than a flat card would be (~230 KB) because a dot screen is
high-frequency detail and JPEG dislikes it. That is accepted: the file is
fetched by crawlers building a preview, never by a visitor loading the page, so
it is not on any critical path.

## Do's and Don'ts

### Do:
- Treat the ink as a ground. Whole sections, edge to edge.
- Add `site-inverted` to flip a section; let the tokens do the work.
- Use `.site-label` for anything a machine would have printed.
- Keep `border-radius: 0` and let rules and whitespace carry structure.
- Set headlines tight enough that they read as a mass.
- Reduce any imported artwork to the two-value system.
- Regenerate the halftone plates with `npm run halftone` and the share card from
  `scripts/social-card.html` whenever the ink, the type or the photograph move.
- Scale a halftone plate in whole ratios only.
- Regenerate the portrait plate with `npm run portrait` whenever the palette,
  the photograph or the framing moves, and commit the output.
- Give every `.site-panel` an opaque, full-bleed background.

### Don't:
- Introduce a second plum, a tint, or a gradient of `#503d42`.
- Spend the voltage anywhere but a ground, a button fill or the selection.
- Put the blue on the plum stock as a mark, a rule or an icon — 1.17:1.
- Hardcode `white` or `rgba(255,255,255,…)` in a component — it breaks
  inversion.
- Drop `--muted` below `0.84` alpha on the plum, or stack `opacity` on top of it.
- Put a form, a placeholder or a field underline on the voltage band.
- Add a shadow, a blur, a lift or a scale to anything.
- Use blend modes to texture the ink; they are near no-ops on a flat ground.
- Use mono for prose, or Outfit for a label.
- Put `.site-sweep` on anything visible above the fold — it will sit permanently
  half-masked.
- End a `view()` range in `cover` on anything inside a `.site-panel`; it freezes
  when the panel pins. Finish inside `entry`.
- Let a panel be shorter than the viewport, or leave one without a top edge.
- Express `--sweep-band` as a percentage; it has to be a length.
- Shim a missing browser API in `panel-scroll.ts` or `section-scroll.ts`. Both
  feature-detect so the shipped fallback is the tested one.
- Reintroduce the "FB&P" monogram.
