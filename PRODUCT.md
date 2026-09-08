# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary buyer is a mix of roles — VP / Head of Customer Success, founders at
companies without a CS leader yet, and CRO/COO-level owners of retention — at
**B2B SaaS companies across Europe**, with the strongest concentration in the
DACH / German-speaking market. Engagements are open to the whole of Europe.

They arrive at a specific moment: retention or expansion is now a board-level
number, and the way Customer Success currently runs is no longer producing it.
Often the customer base itself has shifted and the existing way of working was
designed for a different kind of customer.

**Audience knowledge:** buyers already understand how Customer Success works.
Write in plain language for experienced people, not as an introduction to
customer management. Show the decisions behind adapting to different customers:
which assumptions still fit, where service and ownership need to differ, and
how to make the transition while protecting existing customer relationships.

The enquiry form qualifies on company size (1–50 through 5,000+ employees) and
incumbent CS tooling (Gainsight, ChurnZero, Salesforce, Vitally, HubSpot,
Planhat, custom/in-house, or none yet), so engagements are not restricted to a
single company stage.

**Resolved (2026-08-06):** the site stays **en-GB, English-only**. Although the
strongest concentration of buyers is DACH, Florian takes engagements from
across Europe, so English is the working language of the practice and the
correct default for the site. Do not introduce German-first or bilingual
variants without an explicit new decision.

## Product Purpose

An independent Customer Success consultancy practice. The site exists to turn a
retention or expansion problem into a first conversation — it is a lead-capture
surface for a one-person (plus network) advisory practice, not a product.

Success is a qualified enquiry from someone who owns the retention number and
recognises their situation in the page.

## Positioning

Florian has **operated** Customer Success himself across the full customer-size
spectrum — from small and mid-sized customers up to DAX40 enterprise accounts —
and has seen how CS works differently in each of those environments.

The differentiated claim: he helps when **Customer Success has to change because
the customer base has changed**. Different business customers may need different
onboarding, account ownership, levels of service and renewal planning.

**Resolved (2026-09-07):** use **different business customers**, not "larger
business customers", throughout public copy and future suggestions. This is not
exclusively about moving upmarket. Changes in customer size, industry, needs or
complexity can all require a different approach.

A consultant who has only worked one segment cannot truthfully make this claim.
This is the practice's core asset and should not be diluted into generic
"Customer Success strategy" language.

## Operating Context

Engagements are advisory and hands-on, delivered into the client's existing
team and existing tooling rather than requiring new software. Work is scoped
around a specific operating problem rather than sold as a transformation
package.

Buyers evaluate through: the website, LinkedIn, direct email, and phone.
First contact is asynchronous and self-served via the enquiry form.

## Capabilities and Constraints

**Three named engagements**, each with published deliverables:

1. **Customer Success strategy**: customer groups, account ownership and levels
   of service; customer health measures; renewal and account growth forecasts;
   a prioritised plan for the next twelve months.
2. **Customer lifecycle processes**: onboarding, customers at risk of leaving,
   quarterly and executive business reviews, and account growth opportunities.
3. **Customer Success team training**: renewal and growth conversations,
   decision-maker workshops, demonstrating customer value, and account planning.
   Do not promise a formal qualification without confirmed assessment details.

**Tooling fluency:** Salesforce, Gainsight, HubSpot, Dynamics, Power BI, Looker,
Tableau, Vitally.

**Specialist network:** real and available — specific independent specialists
Florian has worked with and can bring into an engagement today, for deeper CS
Operations, data, tooling or enablement work. The "& partners" name is backed by
this network; the legal entity is a sole trader.

**Technical constraints:**
- Static React + TypeScript + Vite single-page app, no backend.
- Deployed to Hetzner shared hosting over FTPS from GitHub Actions; `.htaccess`
  provides HTTPS redirect, SPA fallback, caching and security headers.
- Contact form posts to Web3Forms (key injected at build time from a CI secret);
  with no key it falls back to opening a pre-addressed email. There is no
  server-side form handling available.
- German legal pages are mandatory: Imprint per Section 5 DDG and Section 18(2)
  MStV, plus a GDPR privacy policy.

## Brand Commitments

- **Name:** Florian Beermann & Co. — locked up as the anvil with the name in two
  lines beside it, "Florian Beermann" over "& Co.", set in Lastica. The face is
  unicase, so the lockup reads FLORIAN BEERMANN & CO. while the markup carries
  title case; write it in title case everywhere it appears as text, and let the
  drawing do the capitals. The lockup is one component, `src/components/
  Wordmark.tsx`, and every place that shows the name uses it.
- **Legal entity:** Florian Beermann, sole trader, Hegestr. 31, 20249 Hamburg,
  Germany.
- **Contact:** hello@florianbeermann.com · +49 (0)40 89705822 ·
  linkedin.com/in/florian-beermann
- **Voice:** first-person singular, en-GB spelling ("realisation",
  "organisations"), understated and specific. Avoids transformation-consultancy
  vocabulary.
- **No acronyms:** never use acronyms or initialisms in public-facing text.
  Write terms in full or choose a natural plain-language alternative; do not
  introduce shortened forms in parentheses. This applies to headings, body
  copy, navigation, forms, legal explanations, and search and social-sharing
  descriptions.
- **No em dashes:** never use em dashes in public-facing text or suggested
  copy. Use a full stop, comma, colon or separate sentence instead.
- **Assets:** the mark is an anvil, a single SVG path inlined in the components
  that draw it (`src/components/BrandMark.tsx`, and again in `public/login.php`
  and `scripts/social-card.html`, neither of which can import from the bundle)
  so it takes `currentColor` and recolours with the ground behind it. Its
  bounding box is 1021x524, a shade under 2:1, so anything that reserves space
  for it is sized by height and lets the width follow. There is no wordmark
  file: the name is set as live type in Lastica wherever the lockup appears
  whole. The masthead keeps the name readable, including on mobile and after
  scrolling past the hero.
  `public/favicon.svg` and `favicon.ico` are a crop of that path rather than the
  whole of it: the square holds the horn, the face and the waist, because a 2:1
  drawing centred in a square spends half its height on air and at 16px was a
  sliver. They are stroked in the same blue so the outline survives the size.
  `favicon.png` at 512 keeps the whole anvil at its true weight and is what the
  page's structured data gives as the organisation logo; `apple-touch-icon.png`
  is the whole anvil too, inverted — the pale mark on a signal-blue tile.

  The hero is a cut of the mountain footage (`public/hero-loop.mp4`, with
  `hero-loop-sm.mp4` for narrow screens and `hero-poster.jpg` as its first
  frame), assembled by `scripts/build-hero-loop.mjs`. The crossfade seam is at
  the front of the clip, which is what makes the loop read as continuous.
  Preserve the original video quality and frame rate. Smaller downloads must
  not come at the expense of image detail or smooth motion.
  Content appears immediately over the poster, with no loading curtain. The
  background plays automatically without a visible playback button, and
  reduced-motion and reduced-data preferences keep the opening still. The
  headline and navigation shift towards blue as clouds brighten the visible
  video crop, using the original frame-driven colour effect without tinting
  or darkening the footage. The
  portrait is `public/portrait.jpg`, shown in "Responsible for renewals and
  growth." The original screen-sized desktop sections and mandatory stopping
  points are retained. `public/social-preview.jpg` is the link card.

  Three self-hosted fonts, all in `public/fonts/`: Switzer (variable) for
  everything a person says, Fragment Mono for everything a machine would have
  printed, and Lastica — one static weight, ASCII only — for the wordmark alone.
  Switzer and Fragment Mono carry their licences beside them; Lastica does not
  yet, and needs one added before the site ships.

  Retired and removed: the twelve-point star mark the anvil replaced (drawn
  inline as `CircleMark`, with `logo.svg` as a stray second drawing beside it),
  the plum-world logo artwork (`logo-lockup*`, `logo-mark*`,
  `logo-wordmark*`, `logo.png`), the Inter subsets before it, the Outfit variable
  font the site was set in between the plum world and this one, and the duotone
  portrait plate with the two scripts that generated it and its halftones. The
  black-and-white master stays at `scripts/assets/portrait-source.jpg`.

## Evidence on Hand

**Available and real:**
- Employer logos and one-line context for Microsoft, Capgemini, HubSpot,
  Personio and Spendesk (`public/company-logos/`) — these are places Florian has
  worked, not clients of the consultancy.
- "6+ years in B2B SaaS Customer Success."
- Operator experience spanning SMB/mid-market through DAX40 accounts.
- A real, nameable network of independent specialists.
- Professional portrait.

**Explicitly absent — future work must not fabricate these:**
- No publishable client names, logos or case studies.
- No publishable retention, expansion, NRR or revenue figures.
- No testimonials, quotes or references.
- No pricing.

Every quantitative claim on the site today reduces to "6+ years". Closing this
gap is a known, open product problem — it must be solved with real permissioned
material, never with invented or illustrative numbers.

## Product Principles

1. **The transition is the product.** Lead with the moment Customer Success has
   to change because the business serves different customers, not with generic
   capability or an assumption that the change is always upmarket.
2. **Operator proof over framework proof.** Credibility comes from having owned
   the work across segments, not from the elegance of a model.
3. **It must run without me.** Deliverables live in the client's existing tools
   and team; nothing requires new software or ongoing dependency.
4. **Never manufacture evidence.** Until real permissioned proof exists, claims
   stay qualitative and honest. No illustrative metrics, no placeholder logos.
5. **Specific beats comprehensive.** Three named engagements with real
   deliverables, not a menu of everything.

## Accessibility & Inclusion

No client-mandated standard has been established. The implementation currently
maintains, and future work should preserve: WCAG-passing text contrast, minimum
24px interactive targets, visible focus indicators on every tab stop,
`prefers-reduced-motion` support, and no horizontal overflow from 375px upward.

There is deliberately **no skip link**. It was removed at the owner's request.
The bypass it offered is small — the header is a wordmark and three links, so a
keyboard visitor reaches the first heading in four tabs — but this is a
conscious trade against WCAG 2.4.1 (Level A), not an oversight. If the header
ever grows a real menu, reinstate it.
