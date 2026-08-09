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

## Quality checks

- `npm run lint`
- `npm run test`
- `npm run build`

All three run in CI on every push to `main` before anything is deployed.

## Images

The hero portrait is committed as pre-generated WebP derivatives
(`public/florian-portrait-{440,660,880}.webp`) plus a JPEG fallback. There is no
image pipeline in the build; if the portrait changes, regenerate the
derivatives and commit them.

## Deployment

Production deployment is handled by the Hetzner workflow in
`.github/workflows/deploy.yml`, which lints, tests, builds and then uploads
`dist/` over FTPS. `public/.htaccess` ships with the build and provides the
HTTPS redirect, SPA fallback, cache policy and security headers.
