# florianbeermann.com

Customer Success consultancy website built with React, TypeScript, Vite and Tailwind CSS.

## Local development

1. Copy `.env.example` to `.env.local`.
2. Add a Web3Forms access key to `VITE_WEB3FORMS_KEY` when form delivery is required.
3. Run `npm ci`.
4. Run `npm run dev`.

Without a Web3Forms key, the contact form falls back to opening a pre-addressed email.

## Quality checks

- `npm run lint`
- `npm run test`
- `npm run build`

Production deployment is handled by the Hetzner workflow in `.github/workflows/deploy.yml`.
