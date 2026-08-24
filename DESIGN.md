---
name: Florian Beermann & Partners
description: Customer Success consulting for B2B SaaS companies whose customer base has moved upmarket.
colors:
  stock: "#181d26"
  paper: "#e8edf5"
  paper-deep: "#d9e1ee"
  ink: "#181d26"
  ink-muted: "rgb(24 29 38 / 0.66)"
  line: "rgb(24 29 38 / 0.28)"
  electric: "#0047ff"
  on-dark: "#e8edf5"
  on-dark-muted: "rgb(232 237 245 / 0.72)"
  line-on-dark: "rgb(232 237 245 / 0.32)"
  field-dark: "#414753"
  field-light: "#a3aab8"
  pigment-dark: "#00227a"
  pigment-light: "#4d8bff"
typography:
  display:
    fontFamily: "Switzer, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(4rem, 6.7vw, 7rem)"
    fontWeight: 520
    lineHeight: 0.91
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Switzer, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(2.8rem, 5vw, 5.4rem)"
    fontWeight: 520
    lineHeight: 0.95
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Switzer, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(1.8rem, 3vw, 3.1rem)"
    fontWeight: 520
    lineHeight: 1
    letterSpacing: "-0.03em"
  body:
    fontFamily: "Switzer, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(1.11rem, 1.36vw, 1.26rem)"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "Fragment Mono, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.14em"
  wordmark:
    fontFamily: "Nippo, Switzer, Georgia, serif"
    fontSize: "1em"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "-0.01em"
rounded:
  none: "0"
  glass: "4px"
spacing:
  gutter: "clamp(1.5rem, 4vw, 3.5rem)"
  panel: "clamp(1.5rem, 5.5vh, 10rem)"
  rail: "2.5rem"
  header: "5.25rem"
components:
  control:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.glass}"
    padding: "0 1.75rem"
    height: "3rem"
  control-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  control-solid:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.glass}"
    padding: "0 1.75rem"
    height: "3rem"
  glass:
    backgroundColor: "rgba(226, 230, 238, 0.1)"
    textColor: "{colors.on-dark}"
    rounded: "{rounded.glass}"
  panel:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "{spacing.panel} {spacing.gutter}"
  panel-inverted:
    backgroundColor: "{colors.stock}"
    textColor: "{colors.on-dark}"
    rounded: "{rounded.none}"
  panel-voltage:
    backgroundColor: "{colors.electric}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
---

# Design System: Florian Beermann & Partners

## Overview

**Creative North Star: "The Weather Station"**

A real place at a real hour, read coolly. The site opens on live footage — mountains under moving cloud — and everything in front of it is instrument: a glass bar, a machine voice in tracked mono, one signal colour spent sparingly. The atmosphere is photographic and the interface is not. Nothing is decorated; things are *measured*.

The register is a consultancy that argues from conditions rather than from claims. That rules out the two obvious houses: the dark statement-panel arrangement the previous site shipped, and the card-grid consultancy page. Instead the page is a sequence of full-height bands, each holding one idea at a size that assumes it will be read rather than skimmed. Where a card grid would offer six things at once, this offers one and moves.

Cool from end to end, with no warm note anywhere. That is a deliberate constraint, not a preference: the portrait is a neutral black-and-white, and beside a warm sheet it reads as tinted. The palette was chosen from five candidates built on the live page, and this is the one the photograph could sit inside without either of them lying.

**Key Characteristics:**
- Two planes, never mixed: footage behind, interface in front
- Two voices: Fragment Mono for anything a machine would print, Switzer for anything a person says
- Electric blue rationed to headings, rules, controls and one band
- Full-height bands, one idea each, paced by scroll snapping
- Flat by default; the only material is glass, and only on the front plane

## Colors

Slate and a cool sheet, with one electric blue held in reserve.

### Primary
- **Electric** (`#0047ff`): The signal. Headings on light bands, the marker register, hairline rules, control fills, the statement band, the mark. Measured at 5.34:1 on the paper — over the floor, but with no headroom, which is exactly why it is rationed.

### Neutral
- **Slate Ink** (`#181d26`): All running prose, and the ground of every inverted band. 14.38:1 on the paper, with a measured floor of 0.63 before a tint drops under 4.5:1 — the headroom the blue does not have.
- **Paper** (`#e8edf5`): The sheet. Every light band, and the type on every dark one.
- **Paper Deep** (`#d9e1ee`): The second sheet, for a surface that must separate from the first without a rule.
- **Ink Muted** (`rgb(24 29 38 / 0.66)`): Secondary prose. Only ever a tint of the ink, never a separate grey.
- **Line** (`rgb(24 29 38 / 0.28)`): Hairlines and dividers.

### Named Rules

**The One Rule.** Slate is the ink, electric is the signal. Blue never carries running prose. It has no room to fade — a tinted secondary blue collapses under contrast — so it is spent in fewer places rather than made louder.

**The Single Source Rule.** All colour is decided in `src/styles/palettes.css` and nowhere else. Both planes read those tokens, the WebGL field included, so one attribute on `<html>` repaints the entire site. A literal colour anywhere else is a bug: the page previously carried two blues and two whites because nothing forced them through one definition.

## Typography

**Display / Body Font:** Switzer (variable, 100–900)
**Label / Machine Font:** Fragment Mono (single weight, 400)
**Wordmark Font:** Nippo (variable, 200–700) — the lockup only, nowhere else

**Character:** One humanist grotesque doing all the talking, tightened hard at display sizes (−0.03em, 0.91 line-height) so a headline reads as a single object rather than a row of words. Against it, a monospace drawn on Helvetica's metrics carries everything a system would have printed. The contrast is not decorative — it is a claim about who is speaking.

### Hierarchy
- **Display** (520, `clamp(4rem, 6.7vw, 7rem)`, 0.91): The hero statement. Once per page.
- **Headline** (520, `clamp(2.8rem, 5vw, 5.4rem)`, 0.95): Band openers.
- **Title** (520, `clamp(1.8rem, 3vw, 3.1rem)`, 1): Named things inside a band.
- **Body** (400, `clamp(1.11rem, 1.36vw, 1.26rem)`, 1.6): Running prose, held to roughly 46–65ch.
- **Label** (400, `0.8125rem`, `0.14em`, uppercase): Navigation, field names, captions, legal, numbers. Tabular figures on.

### Named Rules

**The Two Voices Rule.** Fragment Mono for anything a machine would have printed — navigation, labels, field names, legal, captions, prices, numbers. Switzer for anything a person says. Nothing is set in both, and there is no third family.

**The One Size Rule.** The machine voice appears at exactly one size and one tracking everywhere on the site. Fragment Mono ships a single weight, which is a feature: there is never a decision to make about it.

## Layout

Full-height bands, one idea each. A band is `100svh` less the masthead, padded on `--panel` (`clamp(1.5rem, 5.5vh, 10rem)`) and inset on `--gutter` (`clamp(1.5rem, 4vw, 3.5rem)`). Content is a column that resolves against a 1240px measure and centres in whatever is left, so the heading, the prose and the rules all land on the same line regardless of what the band itself spans.

The masthead is a fixed 5.25rem rail. Everything inside it — mark, glass pane, action — runs on one 2.5rem line, which is most of why it reads as engineered rather than assembled.

The page is paced by CSS scroll snapping, `mandatory`, with a stop before every panel and three inside the engagements track. This is load-bearing and the markers are not optional: `mandatory` means the scroll can never rest anywhere that is not a snap position, so a panel without one becomes unreachable. It is the only strictness that cannot be overshot, and it is what stops a trackpad flick crossing three sections in one gesture.

Breakpoints are content-driven rather than device-driven: the significant ones are 769px (the engagements reel becomes a horizontal scrub above it, a stacked list below), 48rem (the masthead's pill collapses into a sheet) and 30rem (the brand drops its name and keeps its mark).

## Elevation & Depth

Flat by default. On the sheet there are no shadows at all — depth is carried by the bands themselves, which are full-height grounds that cover each other as the page scrolls, and by hairline rules at 0.28 ink.

The exception is the front plane, and it exists only over the footage. There, one material: glass.

### Shadow Vocabulary
- **Glass lift** (`box-shadow: 0 4px 35px rgba(0, 0, 0, 0.15)`): The only shadow on the site. It separates a pane from the picture behind it.

### Named Rules

**The No-Border Rule.** Glass panes have no border. A hairline draws the pane's outline, which reads as a *shape*; the shadow instead separates it from what is behind, which reads as a *sheet lying on top*. The blur is 50px, not 20px with more — at that radius everything behind resolves to one flat field, so the pane stops being a window and becomes a material.

## Shapes

Square by default. Bands, rules, inputs and images are all `0` radius; the page is a printed sheet and printed sheets do not have rounded corners.

`4px` exists for exactly one thing: the front plane. Large enough to say a pane is a physical object, small enough that it never reads as a rounded button. It never appears on flat ground.

The one recurring geometry is the hairline: a 1px rule at full ink under a heading, at 0.28 ink between list items. Rules do the work borders and boxes would do elsewhere.

## Components

### Buttons
- **Character:** Drawn, never filled. A 1px rule with the machine voice inside it.
- **Shape:** 4px radius, 3rem minimum height, `0 1.75rem` padding.
- **Default:** Transparent, `1px solid currentColor`, label typography in uppercase.
- **Hover:** The rule fills in — background becomes the ink, text becomes the paper, over 180ms. On a dark ground the fill inverts so it still reads as *filling in* rather than as a different component.
- **Solid:** One per page, reserved for the single action the hero asks for. On a washed photograph a drawn rule is a suggestion and a solid plate is an instruction.

### Cards / Containers
- **Corner Style:** Square. There are no cards in the card sense; there are bands and columns.
- **Background:** The sheet, the deep sheet, the ink or the electric — a band picks one and inverts its whole subtree via `.site-inverted`, so headings, rules and secondary type all follow from one source.
- **Border:** Hairline rules only, never a box.

### Inputs / Fields
- **Style:** No box. A field is a baseline: transparent background, a single rule underneath, label above it in the machine voice.
- **Focus:** The rule takes the electric and thickens.

### Navigation
- **Style:** Label typography, uppercase, tracked. On the home page the links sit in a glass pane; on the legal pages they are plain text on the sheet.
- **The mark adapts to its ground.** The masthead samples what is behind it and transitions the mark's colour between grounds rather than switching it.

### The Reel (signature component)
The engagements section is three cards sharing one grid cell, moved horizontally by a scroll-driven CSS animation on the track's own view timeline. It is pure CSS — the cards, the rail and the numbered readout all run on one clock, and the pacing comes from the browser's snapping. Timing is `linear` deliberately: with snapping, a gesture is a jump of a whole engagement, and an eased curve spends that jump crossing far faster in the middle than at the ends, so the card flicks past instead of travelling.

### The Plate (signature component)
The hero is looping footage with a sampler reading a 32×18 raster of the frame each tick. When cloud fills the frame the type shifts from paper toward electric — `--wow`, 0 to 1 — and the masthead's action follows it. The signal is a 0.5th-percentile floor rather than a mean, because a mean cannot tell "uniformly cloud" from "half cloud, half mountain".

## Do's and Don'ts

### Do:
- **Do** take every colour from `palettes.css`. One attribute on `<html>` has to be able to repaint the site, shader included.
- **Do** set anything a machine would have printed in Fragment Mono, uppercase, at `0.8125rem` / `0.14em`. One size, one weight, everywhere.
- **Do** give a new full-height panel a `.site-stop` marker immediately before it. Under `mandatory` snapping a panel without one cannot be scrolled to.
- **Do** invert a whole band with `.site-inverted` rather than restating colours on its children.
- **Do** keep prose on the slate. It has the contrast headroom for a real muted step; the blue does not.

### Don't:
- **Don't** run body text in electric. It measures 5.34:1 — over the floor with nothing left, so a tinted secondary register is impossible and the band collapses into one flat blue.
- **Don't** put a radius, a blur or a shadow on flat ground. The front plane's material exists only over the footage.
- **Don't** give a glass pane a border. The shadow does the separating; an outline turns a sheet into a shape.
- **Don't** add a warm neutral. The palette is cool end to end because the portrait is neutral black-and-white and would read as tinted beside anything warm.
- **Don't** pace this page from JavaScript. Three attempts — a settle on scroll end, a wheel handler, a nested scroller — were each worse than the browser's own snapping. On a trackpad the wheel does not stop when the hand does.
- **Don't** write a nameless `animation` shorthand. `animation: linear both` means `animation-name: none`, and a minifier is entitled to collapse the whole declaration, taking the fill mode with it — which drops all three reel cards onto each other in production only.
