# lacop-site-josefine

Portfolio site for Josefine Gulden (Stuttgart, model). Next.js 16 + React 19
+ TypeScript strict + Tailwind v4 + Framer Motion, shape-compliant with the
LACOP `public_profiles` / `categories` / `media` contract.

Split out of `schodakuch/lacop-site-demos` on 2026-04-20 (Vercel hobby-tier
deploy fan-out fix).

## Local dev

```bash
npm install
npm run dev
```

## Verification before every commit

```bash
npm run build && npx tsc --noEmit
```

Both must pass with zero errors. Then Playwright-audit desktop + mobile on
every route before declaring changes done.

## Tenant data

Single mock tenant in `src/data/mock.ts` (`slug: "josefine-gulden"`). Real
Supabase wiring swaps the resolvers in `src/lib/lacop.ts`; the shell code
doesn't change. On handoff, set `LACOP_USER_SLUG=josefine-gulden` in Vercel
env vars (the default in `lacop.ts` already points at that slug).

## Deploy

One repo = one Vercel project. Domain `josefine-gulden.lacop.site` is
assigned in Vercel Project Settings → Domains. `vercel.json` at repo root
has no `ignoreCommand` (that was monorepo-specific).

See `CLAUDE.md` for the exhaustive house rules.
