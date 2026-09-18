---
name: Beermann & Company
description: Independent Customer Success advice in an established boutique advisory style.
colors:
  electric: "#305cde"
  paper: "#f7f7f5"
  paper-deep: "#eeeeea"
  ink: "#222b38"
  muted: "#59616a"
  line: "rgb(34 43 56 / 0.23)"
  white: "#ffffff"
  black: "#000000"
typography:
  display:
    fontFamily: "Libre Caslon Display, Georgia, Times New Roman, serif"
    fontSize: "clamp(3.25rem, 5.4vw, 5.3rem)"
    fontWeight: 400
    lineHeight: 1.04
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Libre Caslon Display, Georgia, Times New Roman, serif"
    fontSize: "clamp(2.4rem, 3.45vw, 3.7rem)"
    fontWeight: 400
    lineHeight: 1.08
    letterSpacing: "-0.012em"
  title:
    fontFamily: "Libre Caslon Display, Georgia, Times New Roman, serif"
    fontSize: "clamp(1.65rem, 2.2vw, 2.25rem)"
    fontWeight: 400
    lineHeight: 1.18
    letterSpacing: "-0.008em"
  lead:
    fontFamily: "Libre Caslon Display, Georgia, Times New Roman, serif"
    fontSize: "clamp(1.75rem, 2.2vw, 2.25rem)"
    fontWeight: 400
    lineHeight: 1.3
  body:
    fontFamily: "Libre Caslon Text, Georgia, Times New Roman, serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.7
  navigation:
    fontFamily: "Libre Caslon Text, Georgia, Times New Roman, serif"
    fontSize: "0.9375rem"
    fontWeight: 400
  utility:
    fontFamily: "Switzer, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.6
  fine:
    fontFamily: "Switzer, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
  wordmark:
    fontFamily: "Libre Caslon Display, Georgia, Times New Roman, serif"
    fontSize: "clamp(1.7rem, 6.8vw, 6rem)"
    fontWeight: 400
    lineHeight: 1.08
    letterSpacing: "0.04em"
  header-wordmark:
    fontFamily: "Libre Caslon Display, Georgia, Times New Roman, serif"
    fontSize: "clamp(1.25rem, 2vw, 1.625rem)"
    fontWeight: 400
    lineHeight: 1
  footer-wordmark:
    fontFamily: "Libre Caslon Display, Georgia, Times New Roman, serif"
    fontSize: "clamp(1.5rem, 2.1vw, 2rem)"
    fontWeight: 400
  employers:
    fontFamily: "Libre Caslon Text, Georgia, Times New Roman, serif"
    fontSize: "1.0625rem"
    fontWeight: 400
  email:
    fontFamily: "Libre Caslon Text, Georgia, Times New Roman, serif"
    fontSize: "clamp(1.125rem, 1.6vw, 1.5rem)"
    fontWeight: 400
  mobile-body:
    fontFamily: "Libre Caslon Text, Georgia, Times New Roman, serif"
    fontSize: "1rem"
    fontWeight: 400
  mobile-navigation:
    fontFamily: "Libre Caslon Text, Georgia, Times New Roman, serif"
    fontSize: "1.125rem"
    fontWeight: 400
  mobile-headline:
    fontFamily: "Libre Caslon Display, Georgia, Times New Roman, serif"
    fontSize: "2.5rem"
    fontWeight: 400
  tablet-person-headline:
    fontFamily: "Libre Caslon Display, Georgia, Times New Roman, serif"
    fontSize: "2.45rem"
    fontWeight: 400
  mobile-title:
    fontFamily: "Libre Caslon Display, Georgia, Times New Roman, serif"
    fontSize: "1.8rem"
    fontWeight: 400
  mobile-lead:
    fontFamily: "Libre Caslon Display, Georgia, Times New Roman, serif"
    fontSize: "1.85rem"
    fontWeight: 400
  compact-wordmark:
    fontFamily: "Libre Caslon Display, Georgia, Times New Roman, serif"
    fontSize: "clamp(1.7rem, 10vh, 3rem)"
    fontWeight: 400
rounded:
  none: "0"
spacing:
  gutter: "clamp(24px, 5.4vw, 88px)"
  section: "clamp(32px, 6vh, 76px)"
  header: "128px"
  mobile-header: "108px"
---

# Design system

## Approved direction

The September 2026 boutique advisory design supersedes the gradient intro and
scroll-driven service reel. Hakluyt informs its restraint, not its photographs,
branding or institutional claims. Preserve this approved composition rather
than returning to technical monospace labels, cards or frosted navigation.

The company is **Beermann & Company**. The visible logo is **BEERMANN** in
Libre Caslon Display, with the existing anvil. Florian Beermann remains the
person and sole-trader legal entity.

## Colour and typography

Signature blue is **#305CDE**, from `--p-blue` in `src/styles/palettes.css`.
The homepage's warmer paper and ink are scoped to `.boutique-page` in
`src/pages/Home.css`. White navigation belongs over the Home photography;
paper text belongs on blue sections.

Caslon Display carries headings and branding, Caslon Text carries prose and
navigation, and Switzer carries utility text. Real Caslon Text and Switzer italic
faces provide hover/focus emphasis with `font-synthesis: none`. `LinkLabel` has
one readable label and invisible regular/italic size reservations. Do not
restore duplicated readable labels or hover underlines. Keep visible focus
outlines and resting underlines on inline privacy links.

The responsive sizes above are owner-approved exceptions, not drift from the
retired Switzer ramp. Employer names inherit the surrounding
body size, including 1rem on mobile. Contact email adapts from 1 to 1.25rem.
The Apple New York font remains excluded
by its licence. Font licences live beside their self-hosted assets.

## Screens and navigation

Navigation selects six fixed screens. Longer selected screens scroll internally.
Inactive screens are hidden and inert; other routes restore document scrolling.

| Label | Screen |
| --- | --- |
| Home, through the brand | `/` |
| About | `#about` |
| Services | `#services` |
| Approach | `#approach` |
| Expertise | `#expertise` |
| Contact | `#contact` |

URLs must match the visible labels. Unambiguous old addresses such as `#practice`,
`#florian`, `#engagements`, `#intro`, `#top` and `#transition` normalise to their
current destinations through history replacement, preserving query parameters.
Current `#about` and `#expertise` meanings take precedence over historical uses.
Browser history, keyboard focus and reading-position restoration must work.

The anvil above BEERMANN is centred in the **whole Home viewport**, including
fullscreen. Do not subtract the header. The Home header is completely
transparent, with white navigation and no blur. Its invisible brand retains its
dimensions so navigation never moves. Other screens use a paper header with
horizontal anvil + BEERMANN.

Below 801px navigation is a native details menu. Opening it reserves a bounded
scrolling region above the logo; its measured edge positions the logo separately
below. Closing restores full centring. Preserve every link on short screens,
outside-click dismissal, Escape and focus return.

Section headings receive reading focus without a visible box after navigation.
Keep keyboard focus outlines on links, menus, buttons and form fields.

## Photography and evidence

Home contains only the stacked logo over the edge-to-edge slideshow. No intro
copy, gallery frame, controls or scroll arrows. Images use cover cropping, but
original files and full-resolution WebP pixels remain preserved.

Order: marbling, blue sky, gallery interior, then Hamburg at night. Transitions
begin every **four seconds including the 1.2-second crossfade**. Decode before
painting and preload one ahead. Reduced motion, hidden tabs and inactive Home
pause playback; hovering does not. Show and log failures while retaining the
last good image. Clean up timers, observers and stale callbacks on unmount.

Only marbling and the gallery have slide-owned readability shading. The sky and
night have no additional overlay. The light logo's offset shadow supports
readability without changing the source photography.

The colour portrait keeps its 1023-by-1537 proportions and definite responsive
width. The employer list sits **beneath the Expertise text in the same column**,
not in a separate full-width section. It has no divider, heading or visible
caption. Company names use the body font and size, and the blue marks scale
with the text. Keep "Previous employers" only as the list's accessible name.
Capgemini uses the official vector spade. Provenance and licences are recorded
in `public/boutique/`.

## Copy and contact

Use first-person singular, British English and plain full terms. No public
acronyms or em dashes. The offer concerns **different business customers**, not
exclusively larger accounts. Preserve three named services and deliverables.
Never invent clients, prestige, team size, testimonials or results.

Contact provides email, telephone and a native enquiry disclosure. Only name,
work email, company and message are required. Production uses Web3Forms; without
its key the visitor explicitly prepares and opens an email draft. Preparing a
draft is never presented as successful delivery.

Keep enquiry and submission state in memory across legal-page navigation, never
browser storage. Restore the internal reading position on return. Lock fields
during delivery, keep the form open for success, and retain the text with an
email recovery link after failure. The two-business-day reply promise is
existing owner-approved copy.

The Contact footer is paper and text-only, without an anvil or design-study
notice. Removed promotional links and the LinkedIn arrow stay removed.

## Production boundaries

React owns structure. The section controller changes visibility, focus and
navigation attributes but must not move React children between parents.
Homepage styles are scoped; legal and recovery pages retain their established
layouts and horizontal branding. Route metadata must match initial HTML and
must not call the production site a concept.

Keep the server-side password gate unless explicitly instructed to remove it.
Design work must not change secrets or authentication. The existing deployment
workflow checks the live commit and actual gate. Retained gradient, video and
reel files are not active homepage fallbacks.
