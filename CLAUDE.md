# Project Rules — LACOP Site (from lacop-site-template)

You are building a premium, production-grade LACOP client portfolio site.
This repo was generated from `schodakuch/lacop-site-template`. Follow these
rules strictly — they carry over from the monorepo `lacop-site-demos` but
are repeated here so this repo is self-contained.

## First thing to do after generation

1. Confirm `package.json` → `name` is `lacop-site-<slug>`, not `lacop-site-template`.
2. Confirm `src/data/mock.ts` has the real client's `slug`, `display_name`,
   `role`, `website_domain` — not `"template"` / `"Template Placeholder"`.
3. Confirm `src/lib/lacop.ts` → `DEFAULT_SLUG = "<slug>"`.
4. Confirm `src/app/layout.tsx`, `robots.ts`, `sitemap.ts` → SITE_URL is the
   real `<slug>.lacop.site` domain.

If any of those still say `template`, the scaffold is incomplete — fix
before writing any new feature code.

## Tech Stack (locked)

- **Next.js 16** (App Router) · **React 19** · **TypeScript** strict
- **Tailwind v4** (custom properties in `src/app/globals.css`)
- **Framer Motion** for animations
- ESM only — never `require()`

## Hard Blocks — NEVER DO

- **NEVER** use `AnimatePresence mode="wait"` — causes white-screen flashes
- **NEVER** use `<img>` for content images — use `next/image` with explicit
  `sizes`, `alt`, `priority` (hero only)
- **NEVER** ignore `prefers-reduced-motion` — every animation checks
  `useReducedMotion()` and provides a static fallback
- **NEVER** claim work is done without the verification steps below
- **NEVER** fabricate bio, stats, clients, dates, measurements, or agency
  info for a real person. Use clearly-labelled "Text folgt" / `null` / `[]`
  placeholders until the user provides real data.
- **NEVER** use Inter or Inter Tight (banned fonts)

## LACOP Data Shape — the contract

The site MUST stay compliant with the shape in `LACOP-DATA-SHAPE.md` at the
repo root. On handoff, the mock (`src/data/mock.ts`) is swapped for a live
Supabase call via `src/lib/lacop.ts`; the shell code above it doesn't change.

- `Profile`, `Category`, `Media` types in `src/lib/types.ts` mirror the
  `public_profiles` / `categories` / `media` DB views. Do not add fields
  that don't exist in the real schema.
- Every component iterates `Object.entries(profile.stats)`,
  `profile.social_links`, `profile.agencies`, `profile.custom_links` — never
  hardcoded keys. Ships empty-state fallbacks for all four.
- `hero_image_url || media[0]?.url || profile_image_url` is the standard
  hero fallback chain. Use it.
- IDs are valid UUID v4 in mocks. Slugs are kebab-case.
- `LACOP_USER_SLUG` env var selects the tenant at runtime; the default in
  `lacop.ts` drives the mock during local dev.

## Required Standards

### Verification (MANDATORY before every commit)

```bash
npm run build && npx tsc --noEmit
```

Both must pass with zero errors. No exceptions.

### Playwright audit (MANDATORY before declaring the site done)

Headless Chromium, desktop 1440×900 + mobile 390×844, every route (`/`,
`/portfolio`, `/about`, `/contact`, `/impressum`). Screenshot above-fold +
full-page for each. Check: no layout shift, no clipped content, no missing
images, tap targets ≥44×44 on mobile (WCAG 2.5.5). Build-green ≠
feature-correct.

### Images

- `next/image` with explicit `sizes`
- `priority` only on the hero
- Meaningful `alt` text
- WebP for real photos, SVG placeholders until real shoots land

### Accessibility

- Semantic HTML (`<main>`, `<nav>`, `<article>`, `<section>`)
- Keyboard-accessible interactives
- WCAG AA contrast (4.5:1 text)
- Skip-to-main link (already wired in `layout.tsx`)
- Visible focus states

### SEO

- `<title>` + `<meta name="description">` per page (driven by
  `generateMetadata` from the profile)
- Open Graph + Twitter Card meta
- Schema.org JSON-LD (Person + WebSite already wired in `layout.tsx`)
- `sitemap.ts` + `robots.ts` + canonical URLs

## Copy

- DE-only per LACOP standard (brief 2026-04-20). `html lang="de"`, OG
  `de_DE`. Copy table at `src/data/copy.ts`. No `LanguageContext`, no `t()`,
  no `{ en: …, de: … }` objects.

## Banned Decorative Tropes

Stop defaulting to these — the user has flagged them as "things you always
do." Each must be earned by a concrete brief-driven reason, not
decoration-by-default.

- Roman numerals anywhere (`MMXXVI`, `Vol. I`, `II/III/IV`)
- `Volume 01` / `Issue 01` / `Ausgabe 01` masthead lines
- `Plates` as photo-count unit (use `photo(s)` or drop the unit)
- Book-metaphor renaming of About/Contact (Colophon, Masthead, Signature,
  Contents) when the site isn't genuinely a booklet
- Mono + uppercase + wide-tracking eyebrow as decorative blanket (one
  functional kicker per page is fine)

Pre-commit grep:
```bash
grep -rnE "Vol(ume|\.) ?0?1|MMX|plate|Plates|Masthead|Colophon" src
```

## Signature Interaction — every site must have one

Every LACOP site must ship at least one **genuinely novel** interaction or
structural choice that isn't in any other LACOP site — variable-font scroll,
cursor-follow preview, hover-peek reactive frame, horizontal scroll, split
viewport, non-linear navigation, WebGL scene, kinetic type axes, etc.

If you can't name the divergent element in one sentence, the concept isn't
finished. The template left you a comment inside `src/app/HomeClient.tsx`
reminding you where to put it.

## Vercel Deploy

One repo = one Vercel project. `vercel.json` at repo root:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "git": { "deploymentEnabled": { "main": true } }
}
```

No `ignoreCommand` (that was for the monorepo; not needed here). Vercel
builds on every push to `main`. Domain `<slug>.lacop.site` is assigned in
Project Settings → Domains.

## Protokoll-Pflicht — CHANGELOG.md

Every commit updates `CHANGELOG.md` at the repo root:

```markdown
## YYYY-MM-DD — Short description
- What was changed and why
```

## Code style

- Functional React components with hooks
- Server components by default; `'use client'` only when genuinely needed
- One component per file
- Tailwind classes co-locate styling
- No comments unless the WHY is non-obvious (hidden constraint, subtle
  invariant, workaround). No WHAT comments — well-named identifiers do
  that. No rot-prone references to callers/tasks/PRs.
