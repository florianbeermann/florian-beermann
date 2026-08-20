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
Often the customer base itself has shifted (typically upmarket) and the existing
CS motion was designed for a different kind of customer.

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

The differentiated claim: he helps when **a CS system has to change because the
customer base has changed** — for example a company moving upmarket toward
enterprise customers, where the existing motion, coverage model and health
signals no longer fit.

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

1. **Customer Success strategy** — segmentation and coverage model,
   health-score architecture, renewal and expansion forecasting, 12-month
   execution roadmap.
2. **Lifecycle playbooks** — onboarding and time-to-value, risk and save
   motions, QBR/EBR frameworks, expansion qualification.
3. **CSM enablement** — commercial conversation framework, stakeholder mapping
   workshops, value-realisation storytelling, account-plan certification.

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

- **Name:** Florian Beermann & Partners — set as a two-line wordmark, the
  name letterspaced above "&PARTNERS", with the ampersand reversed out of a
  solid tile. Written in title case everywhere it appears as text.
- **Legal entity:** Florian Beermann, sole trader, Hegestr. 31, 20249 Hamburg,
  Germany.
- **Contact:** hello@florianbeermann.com · +49 (0)40 89705822 ·
  linkedin.com/in/florian-beermann
- **Voice:** first-person singular, en-GB spelling ("realisation",
  "organisations"), understated and specific. Avoids transformation-consultancy
  vocabulary.
- **Assets:** portrait rendered as ASCII art (`src/assets/portrait-ascii.txt`,
  generated from `scripts/assets/portrait-source.jpg`), logo
  (`public/logo.png`), self-hosted licensed Inter / Inter Tight variable font
  subsets (`public/fonts/`, licences committed).

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

1. **The transition is the product.** Lead with the moment a CS system has to
   change (segment shift, move upmarket), not with generic CS capability.
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
