# lacop-site-template

Starting point for a new LACOP client portfolio site. Next.js 16 + React 19 +
TypeScript strict + Tailwind v4 + Framer Motion, shape-compliant with the
`public_profiles` / `categories` / `media` contract.

## Use via GitHub template

On GitHub: **"Use this template" → "Create a new repository"**, name it
`lacop-site-<client-slug>`, owner `schodakuch`, public.

```bash
git clone https://github.com/schodakuch/lacop-site-<client-slug>.git
cd lacop-site-<client-slug>
npm install
npm run dev
```

Or via API from Claude Code:

```bash
curl -X POST \
  -H "Authorization: Bearer $GHP" \
  -H "Accept: application/vnd.github+json" \
  https://api.github.com/repos/schodakuch/lacop-site-template/generate \
  -d '{"owner":"schodakuch","name":"lacop-site-<slug>","private":false}'
```

## Customize per brief

After cloning, work through these files. The exhaustive scaffold rules are in
**`CLAUDE.md`** at the repo root — an AI agent will find it automatically.

1. **`package.json`** → `name` to `lacop-site-<slug>`.
2. **`src/data/mock.ts`** → replace `templateProfile` with the client's
   details (slug, display_name, role, website_domain). Use `null` / empty
   object / empty array for anything the brief doesn't cover — every
   component ships an empty-state rendering.
3. **`src/lib/lacop.ts`** → `DEFAULT_SLUG = "<client-slug>"`.
4. **`src/app/layout.tsx`**, **`robots.ts`**, **`sitemap.ts`** → SITE_URL
   default to the real domain.
5. **`src/app/globals.css`** → define the site's palette (paper/ink/accent
   tokens). Replace Space Grotesk + JetBrains Mono with fonts chosen for the
   brief if appropriate (never Inter or Inter Tight).
6. **Signature interaction** → add the site's unique structural choice inside
   `HomeClient.tsx` where the template comment is. Every LACOP site must
   ship one divergent element.
7. **Real photos** → drop into `public/photos/`, wire into `mock.ts` via
   `hero_image_url` and per-media `url`. Until real photos land, keep the
   SVG placeholders.

## Verification before every commit

```bash
npm run build && npx tsc --noEmit
```

Both must pass with zero errors. Then Playwright-audit desktop + mobile on
every route before declaring the site done — build-green does not mean
feature-correct.

## Deploy (one repo = one Vercel project)

1. Push to `schodakuch/lacop-site-<slug>` on GitHub.
2. Vercel → Add New Project → import the repo → accept defaults (no Root
   Directory override).
3. Add the env var `LACOP_USER_SLUG=<slug>` when the real Supabase wiring
   lands. Until then, the default in `lacop.ts` drives the mock.
4. Assign the domain `<slug>.lacop.site` in Project Settings → Domains.

Each site owns its own repo; do not add new sites to
`schodakuch/lacop-site-demos` — see `CLAUDE.md` for why (Vercel hobby-tier
rate-limit fan-out).
