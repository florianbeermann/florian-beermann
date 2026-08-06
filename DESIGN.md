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
  backdrop-ink: "#928166"
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
  portrait: "1.75rem"
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

The one departure from flat paper is the portrait: a single large soft-cornered
image with the system's only shadow. It is the only human element on the page
and it is allowed to be the only thing that lifts off the surface.

The page itself is a sheet. It sits inset on a backdrop showing an
impressionist painting of Hamburg, the city the practice is run from, which
makes the broadsheet metaphor literal: a printed page laid on a surface rather
than a canvas that happens to be paper-coloured. The sheet keeps square corners
and takes no shadow. Its separation from the backdrop is carried entirely by
the tonal and textural difference between a painted ground and flat paper,
which is the same mechanism the system already uses between sections.

The backdrop is chosen for place, not decoration, and it is the only
representational imagery in the system besides the portrait.

**Key Characteristics:**
- Warm paper ground (`#f3f0e8`), never pure white
- One continuous paper sheet, inset on a painted Hamburg backdrop
- Square corners everywhere except the portrait
- Hairline rules as the primary structural device
- Enormous, tightly tracked display type
- One inverted deep-ink section as the page's spine
- Near-zero motion; the page does not animate to prove it is alive. The one
  exception is the intro, which exists to show the backdrop, not the interface

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
- **Backdrop Ink** (`#928166`): The flat colour behind the sheet, shown before
  the backdrop image loads and anywhere it cannot. Sampled from the painting's
  own mean so the load-in resolves into the image rather than correcting away
  from a colour that was never in it.
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

The sheet is inset from the viewport on all sides by `--frame`, set to
`clamp(14px, 6vw, 104px)` and flattened to a fixed `14px` below 680px so it
never eats reading width on a phone. Everything else in this section describes
layout *inside* the sheet.

The frame is deliberately generous at desktop. The backdrop is a painting, and
the sheet covers its entire centre, so only the outer band is ever seen: a thin
border crops the image to unreadable noise, while a wide one lets the brushwork
and the skyline register. Frame width is therefore a content decision, not a
margin decision, and should not be trimmed for extra column width.

Three consequences worth knowing before changing anything here:

- **The sticky header parks at the frame line** (`top: var(--frame)`), not at
  the viewport top, and it is fully opaque. A translucent header lets the
  backdrop bleed through and muddies it.
- **A fixed matte repaints the top band.** Once the sheet scrolls past the
  viewport top its paper would cover the backdrop's top strip, so a fixed layer
  clipped to `--frame` redraws it. The matte and the backdrop share identical
  fixed geometry so they register exactly.
- **Anchor targets clear the frame as well as the header**, via
  `scroll-margin-top: calc(var(--frame) + var(--header-height) + 12px)`.

The backdrop is a fixed layer rather than a body background. As a scrolling
body background, `cover` resolves against full document height and zooms the
painting to a smear on tall mobile pages.

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

**The Frame Is Content Rule.** `--frame` exists so the backdrop painting is
legible, not to create breathing room. Narrowing it to reclaim column width
crops the image to noise and removes the reason it is there.

## Shapes

Square by default: `border-radius: 0` on buttons, inputs, selects, the details
toggle, every panel, and the page sheet itself. The single exception is the
hero portrait at `1.75rem`, which is what makes it read as a photograph placed
on the page rather than a UI element.

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
A fixed, viewport-sized layer behind the sheet holding an impressionist
painting of the Binnenalster at sunset, served as WebP at
`/hamburg-alster-dusk-1920.webp` with a `1080` variant below 900px, and matching
`.jpg` files as a real fallback behind an `@supports (background-image:
image-set(...))` guard. WebP here is both smaller and higher quality than the
JPEG it replaced, so there is no trade to weigh.

The guard overrides `background-image` on the backdrop layers directly, not the
`--backdrop-image` custom property, and that distinction is load-bearing.
Custom properties accept any token stream at parse time, so an unsupported
`image-set()` parked in one is not caught until use, where it invalidates
`background-image` outright and leaves a flat colour rather than falling back
to the JPEG. Overriding the real property also lets autoprefixer emit the
`-webkit-image-set` variant that pairs with the widened `@supports` test it
generates.

The painting is shown untinted. An earlier version washed it in a flat
`rgba(0, 42, 86, 0.22)` scrim to seat it in the site's ink and to guarantee the
cream sheet stayed legible against a pale sky. On a sunset image that wash reads
as dirt: it cools the gold the picture exists for and greys the one warm thing
on the page. It was removed, and the legibility argument was retested rather
than assumed — across the frame band where sheet meets backdrop, the brightest
1% of the painting still sits at 1.66:1 against `--paper`, the median at 2.20:1,
and nothing at all falls within 1.2:1. The edge is never soft. Separation is
carried by tone and texture: flat cream against heavy brushwork.

If a future image ever does need seating, reintroduce a scrim rather than
darkening the asset, and keep it under about `0.15`. But treat the need as
evidence the image is wrong for the slot, not as a routine step.

The source is 16:9, which crops hard on a portrait phone: `cover` leaves only
the middle ~26% of the width visible, and centred that clips the spire at 35.8%.
`--backdrop-position` shifts to `46%` below 680px, which holds the spire, the
Rathaus tower and the Elbphilharmonie in frame together. It is a single variable
shared by both backdrop layers, so the matte cannot drift out of register with
the layer beneath it.

### Signature Moment: The Intro
On the first load of a session the backdrop holds alone for `--intro-hold`
(600ms), then the sheet is laid onto it over `--intro-arrive` (700ms), fading up
from a 14px offset on a decelerating curve. Roughly 1.3s end to end.

This is the system's only entrance animation, and it is permitted because it is
the one motion that carries information the static page cannot: the sheet's
whole conceit is that it is paper resting on a painting, and the painting is
almost entirely hidden once the sheet lands. The hold is the only moment a
visitor sees what the site is sitting on. Motion here explains the composition;
motion anywhere else would only decorate it.

Three constraints keep it from becoming a tax:

- **It plays once per session.** An inline script in `index.html` sets a
  `sessionStorage` flag and, on any later load, puts `.intro-done` on `<html>`
  before first paint. Reloads and direct hits on the legal URLs skip the hold.
- **It is bypassed entirely under `prefers-reduced-motion`.**
- **It animates `#root`, not `.site-page`.** `#root` survives client-side
  navigation, so moving between routes cannot replay it. This is also why the
  top matte hangs off `body::after`: a transform on an ancestor would make that
  `fixed` layer resolve against the ancestor instead of the viewport.

The durations are tokens on `:root`, so the pacing is a one-line change. Do not
push the hold past roughly a second — beyond that a first-time visitor stops
reading it as authored and starts reading it as broken, and LCP goes with it.
The backdrop is preloaded at high priority so the hold shows the painting rather
than the `--backdrop-fallback` flat.

## Do's and Don'ts

### Do:
- **Do** use hairline rules (`1px solid var(--line)`) to divide content.
- **Do** keep every surface square except the hero portrait.
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
- **Don't** introduce a border radius on buttons, inputs or panels.
- **Don't** use pure white as a background.
- **Don't** narrow `--frame` to gain column width; it is what makes the
  backdrop readable.
- **Don't** add eyebrow/kicker labels above headings.
- **Don't** add entrance animations, parallax or scroll-triggered reveals. The
  system has exactly two motions: the once-per-session intro that reveals the
  backdrop, and a 180ms transform on the details toggle chevron. Both are
  documented and bounded. A third would make the first two look arbitrary.
- **Don't** invent new small font sizes. The set below 1rem still holds 12
  distinct values, none below the `0.8125rem` floor; new work should snap to
  `0.8125` / `0.875` / `0.96` / `1rem` rather than widen it again.
- **Don't** introduce a third blue or a warm accent. The palette is closed.
