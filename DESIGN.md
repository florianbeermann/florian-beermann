---
name: Florian Beermann & Co.
description: Customer Success consulting for software companies serving different business customers.
colors:
  stock: "#181d26"
  paper: "#f1f2f3"
  paper-deep: "#e5e8eb"
  ink: "#181d26"
  ink-muted: "rgb(24 29 38 / 0.66)"
  line: "rgb(24 29 38 / 0.28)"
  electric: "#0047ff"
  on-dark: "#f1f2f3"
  on-dark-muted: "rgb(241 242 243 / 0.72)"
  line-on-dark: "rgb(241 242 243 / 0.32)"
typography:
  display:
    fontFamily: "Switzer, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(2.8rem, 6.4vw, 6rem)"
    fontWeight: 520
    lineHeight: 1
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Switzer, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(2.8rem, 5vw, 5.4rem)"
    fontWeight: 520
    lineHeight: 1.03
    letterSpacing: "-0.03em"
  mobile-headline:
    fontFamily: "Switzer, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(2.25rem, 10vw, 2.8rem)"
    fontWeight: 520
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Switzer, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(1.8rem, 3vw, 3.1rem)"
    fontWeight: 520
    lineHeight: 1.1
    letterSpacing: "-0.03em"
  body:
    fontFamily: "Switzer, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(1.11rem, 1.36vw, 1.26rem)"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "normal"
  label:
    fontFamily: "Fragment Mono, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.14em"
  wordmark:
    fontFamily: "Lastica, Switzer, Helvetica Neue, Arial, sans-serif"
    fontSize: "1em"
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: "0.02em"
rounded:
  none: "0"
  glass: "4px"
spacing:
  gutter: "clamp(1.5rem, 4vw, 3.5rem)"
  section: "clamp(3.5rem, 7vw, 6rem)"
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
  section:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "{spacing.section} {spacing.gutter}"
  section-voltage:
    backgroundColor: "{colors.electric}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
---

# Design system

## Identity

The existing visual identity is retained: cool paper, slate ink, electric blue,
precise rules and a personal wordmark. The approved signature-blue gradient
intro now leads the site; the mountain footage is retired.
Atmosphere supports the offer. It must not delay or hide useful content.

The site introduces an independent Customer Success consultant. Its central
promise is helping teams adapt to **different business customers**. It is not
exclusively about larger accounts or moving upmarket.

The anvil and Lastica name lockup remain distinctive assets. The full name
must be readable on mobile, not replaced with an unexplained symbol.

## Copy

- First-person singular, British English, specific and understated.
- No acronyms or initialisms in public-facing text. Write full terms or choose
  a natural plain-language alternative. Do not introduce initials in brackets.
- No em dashes. Use commas, full stops, colons or separate sentences.
- Use "Services" consistently for the section at `#engagements`.
- Describe customer problems, responsibilities and tangible deliverables.
- Write for people who already understand Customer Success. Focus on the
  decisions and trade-offs of a changing customer base, not basic workflows.
- Employer logos represent previous employment, not consultancy clients.
- Never invent client results, testimonials, qualifications or work samples.

## Colour

All shared colours come from `src/styles/palettes.css`. Slate is the reading
colour and electric blue marks headings, links, controls and the transition and
closing sections.

Running text on blue uses the full paper colour. Do not fade it until it loses
contrast. On paper, secondary text can use the existing muted ink.

The brand intro uses five equal-width, full-bleed gradient columns derived from
`--p-blue` (`#0047ff`). Default ink is 6% blue with black; ice is 10% blue with
white. Keep the approved electric blue, not the earlier cyan reference.
The section underneath uses ordinary paper, ink and blue styling, with no
mountain image, video or cloud-synchronised foreground.

The independent access page and social-image source restate their colours
because they are outside the application bundle.

## Typography

Switzer carries headings, prose, form labels and human instructions. Fragment
Mono carries navigation, controls, service position indicators and copyright.
Lastica is reserved for the brand name.

Use the shared type tokens in `src/styles/shell.css`. Large headings are capped
at six rem. Mobile headings use the smaller, shared mobile step instead of
taking over an entire screen.

The approved intro wordmark is the deliberate exception to the heading ramp:
`clamp(0.875rem, 4vw, 7rem)`. It reuses `Wordmark.tsx`, `BrandMark.tsx` and the
existing Lastica font, with the shared 0.11em gap, 1.78em mark, 1.02 name leading
and 0.02em tracking. The whole horizontal lockup stays centred and still.

Body copy is left aligned with a comfortable line length. Do not justify short
paragraphs or automatically hyphenate the service and About copy.

## Layout and reading

The homepage retains its original screen-sized sections and mandatory stopping
points. At widths of 901 pixels and above, with motion enabled,
each panel fills at least one viewport. Native
mandatory snapping stops at every panel and each of the three service positions.
Do not replace this with freely scrolling desktop sections or a comparison grid.

The service section is a sticky, three-screen track. The three services share a
frame and move horizontally with the original linear timeline and progress
readout. Keep the independent snap markers and explicit animation fill modes.
Browsers without CSS scroll timelines, including Safari 18, seek the same
paused CSS keyframes from a passive scroll listener. This only paints the reel:
it must not intercept wheel or keyboard events or move the page itself.
Short desktop windows use more compact service text and spacing so the full
descriptions stay inside the frame without changing its timing or stopping points.
Expanded content, such as the optional enquiry fields, must remain reachable.
Narrow screens and reduced-motion preferences retain the original stacked fallback.

Main content resolves to a maximum width of 1240 pixels. Intro and navigation
use the front-plane gutter. At narrow widths, layouts stack and keep a minimum
side margin of approximately 1.35 rem.

The page sequence is:

1. The full-viewport animated brand intro at `#intro`, showing only the original
   lockup and a small bottom-centred scroll chevron. No masthead or text buttons
   cover this section. The cue links to `#top`; this is not a timed gate.
2. Unchanged positioning and supporting copy at `#top`, now on a regular paper
   section. Its offer remains the single page-level heading. Navigation and
   contact remain in the header, without duplicate links beneath the copy.
3. Genuine employment evidence.
4. The three services in their original scroll-driven sequence.
5. Three decisions behind a changing customer base: customer fit, service choices
   and the transition. This blue section addresses experienced buyers and is not
   a numbered tutorial.
6. Personal experience, the portrait and the relationship with independent
   specialists in "Responsible for renewals and growth."
7. A concise contact introduction, direct email and the enquiry form.
8. The blue closing section and oversized wordmark.

The service numbers are position indicators, not buttons. All three service
descriptions stay in the document for assistive reading and the stacked fallback.

Legal and missing-page views prioritise reading and recovery. Their headings
and vertical spacing are smaller than the old poster-sized treatment.

## Navigation

The header adapts to the background behind it while retaining the full brand.
Desktop has Services, About and a concise contact action. Mobile uses a compact
disclosure rather than a full-screen modal.

Over paper and blue sections, the fixed header has a solid matching backing.
Body text must not show through the name, and hidden links beneath that backing
must not receive clicks. The masthead is hidden and not keyboard-reachable over
the intro, then returns over the content below.
The home wordmark links to `#intro`; the existing `#top` address is preserved.

The mobile disclosure has a labelled button, an accurate expanded state,
keyboard-reachable links, outside-click dismissal and Escape support. It does
not lock page scrolling or trap focus. Closed links must not be reachable.

Preserve the existing section addresses so old links continue to work.

## Forms and state

Field labels stay visible. Required and optional information is explained before
submission. The software selector supports an unlisted product without implying
it was built in-house.

Enquiry text and submission state are held in the application provider across
internal navigation. No personal draft data is written to browser storage.
Returning from the privacy policy restores the enquiry and its reading position.
An active submission remains locked across that navigation.

Successful delivery clears the draft and leaves a persistent confirmation.
Failure preserves the text and gives a direct email recovery link. Email-app
fallback explicitly says that opening a draft does not send the message.

Inputs and important actions have generous hit areas and visible focus
indicators. Keep native validation and a logical keyboard order.

## Media and motion

The intro is available immediately, with no loading curtain or scroll lock.
Five columns travel vertically while the stops and colours inside their blocks
independently drift, stretch, contract and change. Preserve the final approved
2x internal morph multiplier, independent slow/fast ramps and faster ripples;
do not substitute scrolling static gradients.

The complete composition loops seamlessly every 24 seconds, including its
velocity and tile-boundary colours. Render at native device-pixel resolution:
a small WebGL mesh, then an animated Canvas 2D fallback, then static CSS gradients
when graphics are unavailable. Do not cap resolution below the device's actual
canvas limits or replace the effect with a video.

The owner requested removal of the visible pause/play control on 13 September
2026. The renderer retains its pause/play API; the only intro affordance is the
scroll cue. Reduced motion prevents playback. Hidden tabs and offscreen sections
pause automatically, and graphics recovery, reconnects and full-DPR resizing
must work without leaking observers or animation frames.

Mountain videos, their poster and cloud-colour runtime are not part of the
website. The old media files remain only as retained source assets.

The portrait stays in the responsibility section, beside the copy on desktop
and below it on narrow screens, at its original proportion with meaningful
alternative text.
The social-preview image must use the same approved headline as its source and
sharing metadata.

## Maintenance boundaries

The browser's route metadata and the initial page metadata must agree. Legal
pages describe themselves when shared, not the homepage. Missing-page views
should not be indexed.

Keep the server-side access gate independent of wording. Deployment recognises
its stable `data-site-gate` marker rather than matching a headline.

Actual hosting-log retention, international-transfer safeguards and permission
to publish client evidence must be confirmed by the owner. Do not replace
missing facts with plausible-sounding claims.
