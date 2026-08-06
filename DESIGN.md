---
name: florian beermann & partners
description: Customer Success consulting for B2B SaaS companies whose customer base has moved upmarket.
colors:
  paper: "#f3f0e8"
  paper-deep: "#e8e3d7"
  ink: "#003b76"
  blue: "#1655d8"
  muted: "#52626b"
  line: "rgba(0, 59, 118, 0.22)"
  on-ink: "#ffffff"
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

A three-tone editorial palette: warm paper, deep navy ink, and one saturated
blue reserved for action and emphasis.

### Primary
- **Deep Navy Ink** (`#003b76`): All headings, body emphasis, the inverted
  method section's background, and the submit button. This is the voice of the
  page; it does the work that black would do in print, but warmer and more
  specific.

### Secondary
- **Signal Blue** (`#1655d8`): The action colour. Used on the hero CTA, the
  second half of the H1, links, and focus states. Its job is to mark the two
  or three places on a page where the visitor can act or where the argument
  turns.

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

### Named Rules
**The Two Blues Rule.** The navy is structure; the bright blue is action. They
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

The frame is deliberately generous at desktop. The sheet covers the backdrop's
entire centre, so only the outer band is ever seen: a thin border crops the
image to unreadable noise, while a wide one lets the skyline register. Frame width is therefore a content decision, not a
margin decision, and should not be trimmed for extra column width.

The top edge is deeper than the other three, which is the mat convention of
weighting one edge, put to work. The top band is the only place a skyline can be
read — the side strips are too narrow and the bottom is below the fold — and at
`6vw` it held a sliver too thin to carry a building. At `11vw` it holds
6.6–13.2% of the image's height across desktop sizes, the low end on ultrawide
monitors where the same 190px covers proportionally less — and the band then
collapses to `--frame` on scroll, reaching 3.6% at that same ultrawide floor.
**That collapsed floor, not the resting average, is the composition brief for
any future backdrop: anything that must be seen belongs in the top ~3.5% of the
image.** A backdrop that satisfies only the resting band loses its subject the
moment the visitor scrolls.

The alternative was cropping the image to force its skyline upward, and it
was tried and reverted. Deepening the frame costs vertical space in the hero;
cropping costs resolution everywhere, permanently. Space is the cheaper currency.

Three consequences worth knowing before changing anything here:

- **The sticky header parks at the frame line** (`top: var(--band)`), not at
  the viewport top, and it is fully opaque. A translucent header lets the
  backdrop bleed through and muddies it.
- **A fixed matte repaints the top band.** Once the sheet scrolls past the
  viewport top its paper would cover the backdrop's top strip, so a fixed layer
  clipped to `--band` redraws it. The matte and the backdrop share identical
  fixed geometry so they register exactly.
- **The matte and the header must read the same variable.** Both define the
  same edge — the matte paints down to it, the header parks on it. Split them
  across two values and any drift shows as a strip of paper above the header or
  a backdrop band that outruns it.
- **Anchor targets clear the frame as well as the header**, via
  `scroll-margin-top: calc(var(--frame) + var(--header-height) + 12px)`, using
  the collapsed band because anchors are always landed on well past the collapse
  range.

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
so their subject sits in the top ~3.5% of the frame, which is what the band
still shows once it has collapsed.

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
- **Primary (hero CTA):** Signal Blue background, white text, `0 24px` padding,
  `52px` min-height, 650 weight at `0.86rem`, sentence case.
- **Submit:** Deep Navy Ink background, white text, uppercase Label type
  (`0.72rem`, 680, `0.1em` tracking), `16px 24px` padding, `54px` min-height.
  The case change is what separates a form's terminal action from a
  navigational CTA.
- **Hover / Focus:** Colour swap only (blue → ink). No lift, no scale, no
  shadow. All interactive targets are ≥44px.

### Inputs / Fields
- **Style:** Underline only. Transparent background, no border except
  `border-bottom: 1px solid var(--line)`, `border-radius: 0`, `48px` min-height,
  `0.96rem` text. Textareas are the exception and take a full 1px border with
  `0.9rem` padding and a `150px` min-height.
- **Focus:** Border colour shifts to Signal Blue and `box-shadow: 0 1px 0` adds
  a second pixel, so the underline thickens without moving the field.
- **Labels:** Uppercase Label type above the field, always visible. No
  placeholder-as-label.

### Navigation
- **Style:** Text links at `0.84rem` / 520, in Deep Navy Ink, `44px` min-height,
  with a transparent 1px bottom border that becomes `currentColor` on hover and
  focus-visible. Sticky header on a 96%-opaque paper background with a bottom
  rule.
- **Mobile:** Below 680px the wordmark text hides and only the logo mark plus
  condensed nav remain.

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
band in *every* state — resting, collapsed, and at the ultrawide floor. The cost
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
height at rest and 3.6–7.2% collapsed, against an Elbphilharmonie roof starting
at 2.4%, so the landmark reads at every desktop size and in both band states. It
is one variable shared by both backdrop layers, so the matte cannot drift out of
register with the layer beneath it.

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
intro, and collapses to `--frame` over the first `--band-collapse-range` (240px)
of scroll. Three positions, evenly spaced, at 1440px: **230px open, 158px at
rest, 86px collapsed.**

The reasoning is that the band's job changes as the visitor moves. While the
hero is on screen the backdrop is part of the argument — it says where this
practice is. Once they start reading, it is furniture, and the page should have
the space instead. So the mat is top-weighted while the picture is the subject
and uniform on all four edges once the page is.

The even spacing is not a coincidence to preserve casually: `--intro-rise` is
defined as `calc(var(--frame-top) - var(--frame))`, the exact distance the band
later collapses. Load and scroll are therefore one continuous gesture in two
parts — the band opens past its resting height, settles, then closes as the page
is read — rather than two effects that happen to sit near each other. On phones
the two frames are equal, so the rise resolves to `0` and the band never
collapses: there is nothing there to reveal, and the intro correctly degrades to
a pure fade.

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
- **Do** reserve Signal Blue for actions, links and the single emphasised
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
- **Don't** hide anything with `transform` if it lives inside `#root`. The
  intro leaves a transform there, which makes `#root` the containing block for
  every `position: fixed` descendant, so `translateY(-200%)` moves an element
  off the top of the *sheet* rather than off the viewport. This is what left the
  skip link parked visibly over the backdrop band. Hide with `clip-path`, which
  no ancestor can defeat, and keep fixed layers that must track the viewport —
  the backdrop and its matte — hanging off `body`, outside the `#root` subtree.
- **Don't** drive `--band` from anything that reflows the document. It may only
  feed paint and sticky offsets; putting it on the sheet's margin would relayout
  the page on every scroll frame and move the scroll position driving it.
- **Don't** add eyebrow/kicker labels above headings.
- **Don't** add entrance animations, parallax or scroll-triggered reveals. The
  system has exactly three motions: the once-per-session intro, the top band
  collapsing on scroll, and a 180ms transform on the details toggle chevron.
  The first two are the frame behaving, not the content performing. The line
  that admits them and bans the rest: a motion may map continuously to scroll
  position, but nothing may *fire* at a scroll threshold, and no element may
  travel at a different rate from the page it sits on. That bans parallax and
  reveal-on-enter while permitting a frame that responds.
- **Don't** invent new small font sizes. The set below 1rem still holds 12
  distinct values, none below the `0.8125rem` floor; new work should snap to
  `0.8125` / `0.875` / `0.96` / `1rem` rather than widen it again.
- **Don't** introduce a third blue or a warm accent. The palette is closed.
