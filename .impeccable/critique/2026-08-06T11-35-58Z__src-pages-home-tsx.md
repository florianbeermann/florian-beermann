---
target: src/pages/Home.tsx
total_score: 29
max_score: 36
na_heuristics: 10
p0_count: 0
p1_count: 3
timestamp: 2026-08-06T11-35-58Z
slug: src-pages-home-tsx
---
Method: dual-agent (A: assessment-a · B: assessment-b)

# Critique — `src/pages/Home.tsx`

**Surface mode:** Persuade (lead-capture marketing page)

## Design Health Score — 29/36 (81%)

| # | Heuristic | Score | Key issue |
|---|-----------|-------|-----------|
| 1 | Visibility of system status | 3 | `Sending…` state, toasts and `aria-expanded` all present — but the reply-time expectation only appears *after* submit. Validation is native-only. |
| 2 | Match to real world | 4 | Segmentation, coverage, health scoring, QBR/EBR, the tooling list — vocabulary maps exactly onto the buyer's world. |
| 3 | User control & freedom | 3 | Reversible disclosure, optional fields, email alternative. The no-key `mailto` fallback yanks the user out with no in-page confirmation. |
| 4 | Consistency & standards | 2 | Six font-size declarations below the system's own 0.8125rem floor; two undocumented colours; `customer success` lowercase once; mixed heading punctuation; static vs runtime metadata diverge; legal-page eyebrows violate the no-kicker doctrine. |
| 5 | Error prevention | 3 | Required attrs, `type="email"`, honeypot. Nothing sets expectations before commit. |
| 6 | Recognition over recall | 4 | Labels always visible, options enumerated, message placeholder coaches the buyer. |
| 7 | Flexibility & efficiency | 3 | Email-instead-of-form and optional details are real accelerators; nothing more is expected on a Persuade page. |
| 8 | Aesthetic & minimalist | 3 | Broadsheet restraint is exemplary. Debits: non-metrics styled as metrics; justified text at 80–96ch producing visible rivers. |
| 9 | Recover from errors | 4 | The error toast is textbook. Only debit is reliance on a transient toast over persistent inline error. |
| 10 | Help & documentation | n/a | Single-purpose lead-capture; the privacy link covers the sole documentation need. |

H10 marked n/a — applicable maximum renormalised to 9 × 4 = **36**.

## Design Specificity Verdict — Authored for this practice (high specificity)

This is not a template, and three tells prove it. The H1 (`Your customers changed. Your Customer Success motion didn't.`) names an operating failure rather than a benefit. `Companies I have worked in, not a client list…` converts an evidentiary weakness into a credibility signal — no template volunteers that. And the broadsheet system (justified columns, hairline registers, one inverted spine) is an editorial voice, not a SaaS UI kit.

The interchangeable residue is small but badly placed: the Capgemini line, the two slogan-"stats", and the static metadata — which is the *first* string a buyer ever reads.

## Overall Impression

The writing is far better than you think it is. Both assessments independently landed on the same conclusion: the body copy holds first-person singular throughout, keeps en-GB spelling consistent, uses curly apostrophes correctly, and contains **zero** transformation-vendor vocabulary. No "leverage", no "unlock", no "seamless", no "world-class". That restraint is the credibility.

What reads as unprofessional is not the voice — it's **seven specific slips that break it**, and they cluster in the places you weren't looking:

1. `transformation work across complex organisations` (Home.tsx:88) — the single most generic sentence on the page, sitting one section away from copy that brags about *not* selling transformation packages.
2. The proof band dresses two slogans (`Retention & expansion`, `Your team, your tools`) as KPIs in 2.25rem display type. A skeptical reader registers padding exactly where the page is trying hardest to look substantiated.
3. `customer success` lowercase (Home.tsx:103, Spendesk) against Title-Case everywhere else — reads as a copy-paste miss.
4. "practical" appears **4×** (lines 41, 69, 418, plus the meta description). A senior operator wouldn't lean on one safe adjective.
5. The static meta description is vendor-interchangeable and drops your entire differentiator, while the *good* runtime description (Home.tsx:130) only wins after React hydrates.
6. Heading punctuation is inconsistent — two headings take full stops, two equally complete ones don't.
7. `Acme Inc.` as a placeholder is US-flavoured for a DACH-weighted audience.

Fix those seven and the "unprofessional" feeling disappears. None of them require inventing evidence you don't have.

## What's Working

- **The differentiator is written, not claimed.** H1 + intro + `Companies I have worked in, not a client list…` execute the positioning better than most funded startups manage.
- **Form microcopy is best-in-class.** The error toast — `Your message wasn't sent. Your text is still in the form. Try again, or email hello@florianbeermann.com.` — names the problem, protects the input, and offers two recovery paths. Keep it verbatim.
- **Contrast passes everywhere.** Measured: muted-on-paper 5.56, ink-on-paper 9.77, white-on-ink 11.13, CTA white-on-blue 6.32. No failures.
- **Structural hygiene is clean.** Single H1, no heading-level skips, no horizontal overflow at 1440px or 390px, every image has appropriate alt text, all four visible form fields properly labelled.
- **Progressive disclosure on the optional details is textbook** — as a concept. See P2 for why it doesn't render.

## Priority Issues

### P1 — Static metadata is generic vendor copy, and it's the first thing a buyer reads
**What:** `index.html` ships `"Practical Customer Success strategy, playbooks and operations for B2B SaaS teams focused on retention and expansion."` with a bare `og:title` of just `"florian beermann & partners"`. Meanwhile Home.tsx:130 carries a genuinely good line that only applies post-hydration.
**Why it matters:** The Google snippet and the LinkedIn share card are your first impression, and right now they're the weakest, most template-like sentence you own. That string decides the click.
**Fix:** `meta/og/twitter description` → `"I rebuild Customer Success for B2B SaaS companies whose customer base has moved upmarket — coverage, health scoring and playbooks that fit the customers you have now."` · `og:title` → `"Customer Success for a customer base that moved upmarket — florian beermann & partners"` · normalise `og:image:alt` casing (`Strategy` → `strategy`).
**Command:** `/impeccable clarify`

### P1 — The proof band presents slogans as metrics
**What:** Three `<dl>` blocks styled identically. Only `6+ years` is a metric; `Retention & expansion` and `Your team, your tools` are claims wearing KPI clothing (Home.tsx:286–298).
**Why it matters:** The `<dl>` layout makes a visual promise of quantified proof the practice explicitly cannot keep. It isn't dishonest — no fabricated numbers — but it's evasive dressing, and it sits directly beside the most disarming honest line on the page (`not a client list`). The honesty and the padding cancel each other out.
**Fix:** Stop styling non-metrics as metrics. Keep `6+ years — operating Customer Success in B2B SaaS` as the one number, then let two plain sentences carry the rest: `I've owned retention and expansion targets directly, not advised on them from outside.` / `Engagements run on the stack your team already has.`
**Command:** `/impeccable clarify` then `/impeccable layout`

### P1 — Six font-size declarations sit below the design system's own 0.8125rem floor
**What:** Verified in source — `0.7rem` (Home.css:536, **form labels → 11.2px**), `0.72rem` (642, submit button → 11.52px), `0.75rem` (325, method numbers), `0.8rem` (236, 593, 745).
**Why it matters:** DESIGN.md names "The 0.8125rem Floor" as a rule. The worst offender is the **form labels** — the most functional text on the page, at 11.2px, on the conversion surface. Note: an earlier automated count of 163 sub-floor elements was inflated; 133 of them were Impeccable's own injected toolbar. These six are real.
**Fix:** Raise all six to `0.8125rem` minimum. The form labels and submit button should arguably go higher still.
**Command:** `/impeccable typeset`

### P2 — The optional-details panel styling is broken (class mismatch)
**What:** JSX writes `className="optional-details"` (Home.tsx:517) but the CSS targets `.home-optional-details` (Home.css:522, 611, 937). Confirmed by grep.
**Why it matters:** The disclosed panel silently loses its `2px solid var(--blue)` callout border and its 2-column grid. The two selects stack with no gap and no "this is a sub-group" cue — so your best interaction-design idea on the page doesn't visually land. It degrades polish at the conversion point.
**Fix:** Rename the JSX class to `home-optional-details`.
**Command:** `/impeccable polish`

### P2 — Copy hygiene: casing, punctuation, and one over-used adjective
**What:** `customer success` lowercase at Home.tsx:103. Mixed heading terminal punctuation — `Customer signals only matter when they change the work.` and `I have been the person who owns the number.` take full stops; `Three ways I work` and `Where the experience comes from` don't. "practical" ×4. `transformation work across complex organisations` (88).
**Why it matters:** A senior reader registers these as carelessness, which undercuts a page whose entire pitch is rigour. This is the mechanical half of the "unprofessional" feeling.
**Fix:** Capitalise the discipline term consistently. Adopt one rule — declarative full sentences get a period, fragments don't. Vary two of the four "practical"s. Rewrite Capgemini with concrete verbs: `Ran delivery across large enterprise programmes, coordinating multiple stakeholders and dependencies.`
**Command:** `/impeccable clarify`

## Persona Red Flags

**Lena, VP of Customer Success, Munich — comparing three consultants on a Tuesday evening.** She skims LinkedIn previews first. Your share card reads `florian beermann & partners` / `Practical Customer Success strategy…` — indistinguishable from the other two tabs open. On-page the H1 and `not a client list` win her over, but at the proof band she thinks *"so the only actual number is 6+ years?"*, and at the form she hesitates: nothing promises he'll actually reply. She bookmarks instead of enquiring. **Failing strings:** the meta description; the KPI-styled slogans; the reassurance-free `Send message`.

**A skeptical CRO who owns retention and is allergic to consultancy fluff.** He's scanning for tells and finds almost none — until `transformation work across complex organisations` (88) and the slogan-metrics, which read as exactly the vendor padding he distrusts. The one lowercase `customer success` (103) confirms his prior that this is a solo operation without an editor. **Failing strings:** 88, 292–297, 103.

**A founder whose SMB base is moving upmarket, no CS leader yet.** The page speaks slightly over her — `DAX40 enterprises`, `QBR and EBR frameworks`, an 8-option tooling select — and nothing says "I also work with companies at your stage." The copy's centre of gravity is enterprise; `None yet` in the tooling list is the only cue she's welcome, and it's buried behind the optional toggle.

## Minor Observations

- **No reassurance at the submit moment.** The two-business-day promise lives only in the post-submit toast — it rewards commitment instead of enabling it. One line above `Send message` would fix it: `I read every enquiry personally and reply within two business days.`
- **`DAX40` should be `DAX 40`** — the index rebranded with a space in 2021. A DACH VP will notice.
- **Justified body copy** (Home.css:363–368) produces visible rivers at the 80–96ch measure. Ragged-right would read more editorial, less Word-document.
- **The five company logos lack `width`/`height` attributes** → measurable CLS risk on slow connections.
- **Hit targets under 44px:** "About" nav link 39px wide, "Imprint" 41px, the email and LinkedIn footer links 24px tall, `.home-privacy-link` 16px tall.
- **Two undocumented colours:** `#0a2248` (Home.css:81) and `#80aaff` (Home.css:324) — neither appears in DESIGN.md's palette.
- **DESIGN.md self-reports "21 distinct values below 1rem."** Actual measured count: 13 in Home.css, 17 across the scanned tree. The doc is stale.
- **Legal-page eyebrows** (`eyebrow="Legal information"`, `eyebrow="Data protection"`) violate DESIGN.md's own "no kicker labels above headings" rule.
- **The portrait backdrop foregrounds a Microsoft logo** — on the one page insisting employers are "not a client list", that's a faint endorsement-implication risk.
- **`Acme Inc.` placeholder** is US-flavoured for a DACH-weighted audience.
- **Chunking:** the tooling select offers 8 options and company size offers 5 — both above the ≤4 guideline, though mitigated by being optional and disclosed.
- **Dismissed as false positives:** a `dark-glow` box-shadow finding and a `layout-transition` on `body` (both from Impeccable's injected live-mode UI); `0.8125rem` and `0.96rem` snap values and the documented mobile `clamp()` overrides (all DESIGN.md-sanctioned); an estimated ~2.48 placeholder contrast ratio that could not be measured directly and remains unconfirmed.

## Questions to Consider

1. If every quantitative claim reduces to "6+ years", why build a metrics band at all? What if the proof section were one honest sentence — *"One operator, six years, every customer size from SMB to DAX 40"* — and the design stopped implying there are KPIs to show?
2. The success toast is the best sentence on the site, and nobody reads it until they've already converted. What would the page feel like if that promise stood *next to* the button instead of being the reward for pressing it?
3. You forbid transformation-vendor vocabulary in the body but ship it in the metadata and the Capgemini line — the two places you weren't looking. Should the voice rules apply *more* strictly to the strings buyers see first?
4. The page is enterprise-weighted, but the practice takes SMB through enterprise. Is the position "I help when the customer base moves upmarket" — or is it "I help at the exact seam where your CS stops fitting", which also welcomes the founder mid-climb?
