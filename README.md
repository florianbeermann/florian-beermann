# florianbeermann.com

Customer Success consultancy website built with React, TypeScript, Vite and Tailwind CSS.

## Local development

1. Copy `.env.example` to `.env.local`.
2. Add a Web3Forms access key to `VITE_WEB3FORMS_KEY` when form delivery is required.
3. Run `npm ci`.
4. Run `npm run dev`.

Without a Web3Forms key the contact form does not fail: it opens the visitor's
email client with a pre-addressed, pre-filled message to `hello@florianbeermann.com`.

## Structure

| Path | Purpose |
| --- | --- |
| `src/pages/Home.tsx` | The single-page site: hero, proof, engagements, method, about, contact |
| `src/pages/Imprint.tsx`, `src/pages/Privacy.tsx` | German legal pages, rendered through `LegalPageLayout` |
| `src/pages/NotFound.tsx` | 404 page |
| `src/styles/shell.css` | Shared shell: palette tokens, typography, header, footer |
| `src/pages/Home.css` | Homepage-only styles |
| `src/components/ui/` | The shadcn/ui primitives actually in use (button, input, label, select, textarea, sonner) |
| `src/lib/metadata.ts` | Per-route title, description and canonical tag |

Styling is deliberately split: the design uses hand-written CSS with the
`site-` and `home-` prefixes, while Tailwind is retained only for the
shadcn/ui form primitives.

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

The portrait is `public/portrait.jpg`, a black-and-white master used as it is.

It used to be a duotone plate generated at build time — the photograph printed
in one ink, luminance remapped onto a ramp from the page's plum — with a second
script producing halftone cuts of the same frame. The palette that tint was
mixed for is gone, and a neutral monochrome sits better beside a palette that is
cool from end to end, so the generators, their outputs and the small PNG and
filter libraries they shared have all been removed. The master they read from is
still committed at `scripts/assets/portrait-source.jpg`.

To change the portrait, replace `public/portrait.jpg`. It is displayed at its
own proportion on narrow screens and cropped to the row it shares with the copy
column on wide ones, so a portrait-orientation frame is what it expects.

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

The remaining raster assets (logo, company marks) have no build pipeline — they
are committed at their final size.

## Deployment

Production deployment is handled by the Hetzner workflow in
`.github/workflows/deploy.yml`, which lints, tests, builds and then uploads
`dist/` over FTPS. `public/.htaccess` ships with the build and provides the
HTTPS redirect, SPA fallback, cache policy and security headers.
