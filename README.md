# florianbeermann.com

Beermann & Company's Customer Success consultancy website, built with React,
TypeScript, Vite and Tailwind CSS.

## Local development

1. Copy `.env.example` to `.env.local`.
2. Add a Web3Forms access key to `VITE_WEB3FORMS_KEY` when form delivery is required.
3. Run `npm ci`.
4. Run `npm run dev`.

Without a Web3Forms key the contact form offers "Prepare email draft", followed
by a link to open the draft to `hello@florianbeermann.com`. It explicitly says
that nothing has been sent and the visitor must send the email themselves.

Enquiry drafts and submission state survive internal page navigation in memory.
They are not saved to browser storage. A successful submission clears the draft.

## Structure

| Path | Purpose |
| --- | --- |
| `src/pages/Home.tsx` | The approved boutique homepage: Home, About, Services, Approach, Expertise and Contact |
| `src/hooks/useHomeSections.ts`, `src/pages/home-sections.css` | Navigation-selected screens, internal scrolling, history, focus and mobile menu geometry |
| `src/components/ArtworkGallery.tsx`, `src/lib/artwork-slideshow.ts` | Four-image slideshow, decoding, four-second cadence and motion preferences |
| `src/components/EnquiryForm.tsx` | Web3Forms delivery, explicit email fallback and recoverable submission states |
| `public/boutique/` | Approved photography, responsive lossless images, employer vectors and licensed fonts |
| `src/components/BrandIntro.tsx`, `src/lib/gradient-background.ts`, `gradient-field.ts` | Retained gradient intro, not imported by Home |
| `src/pages/Imprint.tsx`, `src/pages/Privacy.tsx` | English-language legal notice and privacy policy for the German practice |
| `src/pages/NotFound.tsx` | 404 page |
| `src/styles/shell.css` | Shared shell: palette tokens, typography, header, footer |
| `src/pages/Home.css`, `src/pages/artwork-slideshow.css` | Scoped homepage typography, layout and photo shading |
| `src/pages/scroll-panels.css`, `src/hooks/useEngagementReel.ts` | Retained service reel source, not imported by Home |
| `src/components/ui/` | The shadcn/ui primitives actually in use (button, input, label, select, textarea, sonner) |
| `src/lib/metadata.ts` | Shared route metadata for initial page output, search and social sharing |
| `src/components/EnquiryProvider.tsx` | In-memory enquiry draft and submission state |
| `src/components/Wordmark.tsx`, `src/styles/wordmark.css` | Horizontal brand used by legal and recovery pages |

The boutique CSS is scoped to `.boutique-page`; legal and recovery pages retain
their `site-` shell. React owns the DOM structure. The section controller changes
visibility and navigation attributes without moving React children between
parents. Contact contains its footer from the initial render.

The logo and homepage headings use Libre Caslon Display. Prose and navigation
use Libre Caslon Text; utility text uses Switzer. Both reading and utility faces
have real italics. Licences live beside the fonts in `public/fonts/` and
`public/boutique/`. Only Home stacks the anvil over BEERMANN. Its header brand
is horizontal elsewhere; the Contact footer is text-only. Keep the
standalone lockups in `public/login.php` and `scripts/social-card.html` aligned
with the shared CSS, and regenerate `public/social-preview.jpg` after changing
the logo. Company references use "Beermann & Company"; the legal entity and
portrait remain "Florian Beermann". The signature blue is `#305CDE`.

The retired service reel is kept as source, not loaded by the current homepage.
Its desktop snapping is native. Browsers with CSS scroll timelines
animate the service reel entirely in CSS; Safari 18 and other unsupported
browsers seek the same paused keyframes through the Web Animations API.
The fallback does not drive scrolling and is disabled for narrow screens and
reduced motion, where the services remain stacked.

## Boutique homepage

The approved September 2026 design uses navigation-selected fixed screens:
Home (`#top`), About (`#practice`), Services (`#expertise`), Approach (`#approach`),
Expertise (`#florian`) and Contact (`#contact`). Longer screens scroll internally.
The earlier `#intro`, `#engagements`, `#about` and `#transition` addresses remain
usable through aliases. Browser history and legal-page returns restore reading
positions and preserve enquiries. Leaving Home removes its document scroll lock.

The Home logo is centred in the entire viewport, including fullscreen, not
below the header. Navigation is transparent and white. Its hidden header brand
retains its dimensions so navigation never jumps. An expanded mobile menu has a
bounded scrolling area; its measured bottom edge keeps the logo separately
below it. Closing restores full centring. Escape and outside clicks dismiss it.

The slideshow contains marbling, blue sky, the gallery interior and Hamburg at
night, in that order. Transitions start every four seconds including the
1.2-second fade. Images decode before painting and preload one ahead. There
are no controls or hover pausing. Reduced motion, hidden tabs and inactive
Home pause playback. Errors are logged and shown without losing the last good
image. Only marbling and the gallery receive readability shading.

Original files and full-resolution WebP pixels are preserved.
`public/boutique/IMAGE-LICENSE.txt` records provenance. Italic interactions use a
single readable label with invisible regular/italic width reservations; do not
return to duplicated readable labels.

## Retained gradient source

This implementation is historical and is not mounted by the current homepage.

`gradient-background` is a typed, dependency-free custom element. WebGL
interpolates a small live mesh at full device-pixel resolution, including 4K.
Canvas 2D animates the same field when WebGL is unavailable; static CSS gradients
remain visible while graphics are unavailable or recovering.

Block travel and internal stop/colour morphing are independent and return to
the same state and velocity every 24 seconds. Keep the approved
`morphSpeedMultiplier` at `2`; a positive integer preserves the loop. The
`_draw(travelPhase, morphPhase)`, `_morphTiming` and `_morphStops` methods support
deterministic checks without relying on animation counters.

The element accepts `--gradient-loop`, `--gradient-blue`, `--gradient-ink` and
`--gradient-ice`. Blue defaults to the shared `--p-blue` (`#305cde`); ink and ice
default to 6% blue/black and 10% blue/white mixes. Inline style/class changes
refresh automatically. Call `refresh()` after changes in an external stylesheet.

The visible navigation and text controls were removed from the intro at the
owner's request. Its only affordance is the labelled, keyboard-accessible scroll
cue. The renderer retains its `pause()`/`play()` API, but no playback button is
shown. Reduced motion takes priority over play; hidden tabs and offscreen
sections pause automatically. Context recovery, reconnects and device-pixel-ratio
changes retain the current animation position. Observers, animation frames and
graphics buffers are cleaned up on removal. Renderer hot updates reload the
development page because browsers cannot replace a registered element class.

## Pre-launch gate

The site is not published yet. Apache refuses every request that does not carry
a valid access cookie, and anyone refused lands on `public/login.php` — a
designed page in the site's own type, not the browser's password dialog.

The gate is server-side on purpose. A login screen built into the React app
would protect nothing, because a static site ships its copy, its images and its
whole bundle to anyone who asks; the password would be in the JavaScript.

### The one decision worth knowing

Authorisation is expressed with `Require`, not with a `mod_rewrite` rule:

    SetEnvIf Cookie "(^|;[[:space:]]*)fb_access=TOKEN([[:space:]]*;|$)" FB_ACCESS
    Require env FB_ACCESS

The obvious way to gate on a cookie is to rewrite unauthenticated requests to
the login page. Don't: a rewrite that fails to match lets the request *through*,
so any mistake in the pattern serves the site to everyone. `Require` inverts the
default — access is denied unless something grants it — so the same mistake
locks everyone out instead. A gate is allowed to break. It is not allowed to
break open.

### How it fits together

| Piece | Where |
| --- | --- |
| The gate | The `PRE-LAUNCH GATE` block at the top of `public/.htaccess` |
| The login page | `public/login.php`, self-contained because the app's CSS is behind the gate |
| The password | `SITE_PASSWORD` in Actions secrets |
| The hash and token | `gate-secrets.php`, written by `deploy.yml`, denied over HTTP, never in git |
| The guard rails | `src/test/gate.test.ts`, plus a post-deploy check that signs in for real |

Nothing about the credential is committed. This repository is public, so the
bcrypt hash and the access token are both generated at deploy time. The token is
an HMAC of the password rather than a random value, so it is stable across
deploys — a fresh token every push would sign everyone out — while rotating the
password rotates the token, which signs everyone out exactly when that is the
point.

`login.php` deliberately holds neither the hash nor the token. It is the one
file served to the unauthenticated, so if the host ever stopped executing PHP
its source would be readable; the secrets live in `gate-secrets.php`, which
`.htaccess` denies on its own terms. The deploy fails if either value ever
appears in `login.php`.

`version.json` stays readable so the deploy check and the hourly drift check
keep working without holding the site password.

### Failure modes, and which way they fall

A missing secret, an unsubstituted token, or an `.htaccess` that sets the access
variable without requiring it all stop the deploy before anything is uploaded.

After the upload the workflow exercises the whole login flow against the live
site rather than inspecting it: anonymous requests must be refused and served
the login page, that page must come back executed rather than as PHP source, the
real password must sign in and open the site, a wrong one must not, and
`gate-secrets.php` must be unreachable.

### Going public

Delete the `PRE-LAUNCH GATE` block from `public/.htaccess`. The deploy step
stands down on its own when the token placeholder is gone, and removes
`login.php` from the build. Then delete `public/login.php` and
`src/test/gate.test.ts`, and drop the `SITE_PASSWORD` secret. `SITE_USERNAME`
and `HETZNER_HTPASSWD_PATH` are left over from the Basic Auth gate this replaced
and can go at any time.

Going public is a reviewed change to the file whose job is protection, which is
the asymmetry worth keeping: a broken secret can only cost a deploy, while
opening the site takes an explicit commit.

## Quality checks

- `npm run lint`
- `npm run test`
- `npm run build`

All three run in CI on every push to `main` before anything is deployed.

## Images

The active portrait is `public/boutique/portrait-colour.png`, with 512px and
1023px lossless WebP variants. It keeps its supplied 1023-by-1537 proportions
without colour filters. A definite responsive container width avoids Safari
intrinsic grid-sizing problems. Prominent employer evidence sits below it.
The earlier black-and-white `public/portrait.jpg` remains retained.

It used to be a duotone plate generated at build time — the photograph printed
in one ink, luminance remapped onto a ramp from the page's plum — with a second
script producing halftone cuts of the same frame. The palette that tint was
mixed for is gone, and a neutral monochrome sits better beside a palette that is
cool from end to end, so the generators, their outputs and the small PNG and
filter libraries they shared have all been removed. The master they read from is
still committed at `scripts/assets/portrait-source.jpg`.

To replace the active portrait, update its original and proportional WebP
variants in `public/boutique/`, and keep the intrinsic dimensions in Home aligned.

The retired mountain assets (`public/hero-loop.mp4`, `hero-loop-sm.mp4` and
`hero-poster.jpg`) and their source-generation record,
`scripts/build-hero-loop.mjs`, are retained without modification. The website
does not reference or download them. They are not slideshow fallbacks.

`public/social-preview.jpg` is generated by rendering `scripts/social-card.html`
headless at 1200x630 and saving the result, so the card is set in the site's own
fonts:

    npm run dev
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
      --headless --disable-gpu --hide-scrollbars --virtual-time-budget=6000 \
      --window-size=1200,630 --screenshot=/tmp/card.png \
      http://localhost:5199/scripts/social-card.html
    sips -s format jpeg -s formatOptions 84 /tmp/card.png \
      --out public/social-preview.jpg

The favicons are cut from the same anvil path as the inline mark, but they are
not the whole drawing. The anvil is 1021x524, a shade under 2:1, and a favicon
is a square: framed whole it used 47% of the height, so at 16px it was a 15x7
sliver of thin outline with empty bands above and below, 11% of the box inked.
That reads as a smudge rather than a mark.

So the square cuts into the drawing instead of containing it. `favicon.svg` and
the `favicon.ico` frames hold the horn, the face and the waist — 55% of the
anvil's width — which magnifies the artwork about 1.8x and takes 16px coverage
from 11% to 40%. Two things about that crop are load-bearing. The horn tip is
inside the frame, with a little air before it: the horn is the feature that
says anvil rather than trestle, and a crop that clipped it lost the read
entirely. And crops tighter than about 40% of the width are unusable, because
the frame passes through the horn and leaves a detached fragment in the corner
that looks like a rendering fault.

The outline still needs help at that size, so those two carry a `stroke` in the
mark's own colour, tuned per size because one weight cannot serve 16px and 48px
— 110 path units at 16, 70 at 32, 55 at 48, and 80 in the source SVG.
The crop already does most of the work, which is why these are roughly half the
weights the uncropped version needed.

`favicon.png` at 512 and `apple-touch-icon.png` keep the whole anvil. They are
large enough to carry it, and the 512 is what the page's structured data hands
out as the organisation logo, which should be the mark rather than a detail of
it.

Every icon uses `#305CDE`. When changing only the colour, preserve the existing
transparency masks in the full PNG and every ICO frame. The Apple touch icon
uses the full PNG's mask resized to 180px with Lanczos, with the paper-coloured
anvil on a signature-blue background.

Both `index.html` and `public/login.php` link `favicon-crop.ico` first, then
`favicon-crop.png` at 32x32. The ICO is a byte-for-byte copy of `favicon.ico`;
the PNG is its existing 32px frame, extracted without rescaling. The crop is
therefore baked into the pixels rather than left to the browser's SVG renderer.
The source SVG stays available but is no longer advertised as a tab icon.

The fresh filenames replace the query-only URLs used by the first Safari fix.
Keep `favicon.png` out of `rel="icon"` links: it is still the full-size
organisation logo. When changing the crop, update both generated assets and
their filenames in both page heads, keeping the new names exempt from the
pre-launch gate in `.htaccess`.

They are reproducible: render the relevant SVG with headless Chrome (a
transparent `--default-background-color=00000000`, which is the only faithful
renderer on a stock macOS box — `qlmanage` flattens alpha onto white), then
downsample with Lanczos. Render at 512 and scale down rather than sizing the
window to the target: Chrome clamps windows below roughly 500px and silently
returns a cropped fragment instead of a small render.

The remaining raster assets (company marks) have no build pipeline — they
are committed at their final size.

## Deployment

Production deployment is handled by the Hetzner workflow in
`.github/workflows/deploy.yml`, which lints, tests, builds and then uploads
`dist/` over FTPS. `public/.htaccess` ships with the build and provides the
HTTPS redirect, SPA fallback, cache policy and security headers.
