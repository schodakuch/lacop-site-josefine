# Changelog

## 2026-04-21 — Restore original cream/gold editorial design

The 2026-04-20 scaffold generated josefine from `lacop-site-template`
(lea-emrich-derived), which replaced the real custom design Josi's
site had in the monorepo. Restored from monorepo commit `5e9af2d`
(last state before the split):

- **Palette**: cream (`#FDFBF4` background, `#F5F0E1` cream,
  `#E8DFC4` cream-dark), gold (`#C9A84C`, `#E8D8A0`, `#8B7230`),
  foreground brown `#2A2418`. No more pale blue.
- **Fonts**: EB Garamond serif, Manrope sans, JetBrains Mono.
- **Navigation**: vertical sidebar "spine" on desktop — 88px wide on
  the left edge with rotated `JOSEFINE · GULDEN` wordmark, JG
  monogram, and a numbered (01/02/03/04) floating route list
  top-right with a springy active underline. Mobile gets a slim top
  bar with a three-line → X animated hamburger and a stacked
  large-serif drawer. No EN/DE toggle (LACOP house rule DE-only).
- **Hero**: huge clamp serif name `clamp(3rem,14vw,9rem)` with
  italic gold-dark last-name accent, role eyebrow
  "model — Stuttgart", dark-foreground CTA + italic secondary link,
  wide hero image (4/5 → 16/10 → 21/9 across breakpoints).
- **About**: "über josefine" lowercase kicker title pattern,
  "Meine Geschichte" section with italic display bio
  ("Text folgt." until Josi delivers), Stuttgart location caption,
  stats in 4-col gold-underlined grid.
- **Contact**: "lass uns *reden*" title pattern, booking email
  hardcoded to `Cooperation-Josi.Gulden@outlook.com`, info + form
  split. Location echoes "Stuttgart, Deutschland".
- **Portfolio**: "das *portfolio*" title pattern, aspect-ratio-
  native image grid, mono index captions.
- **Impressum / 404**: lowercase italic-gold display headings.

LACOP resolver contract (`mock.ts`, `lib/types.ts`, `lib/lacop.ts`)
kept — real data already lives there and flows into the restored
components unchanged. Bilingual `LanguageContext` from the original
monorepo was NOT carried over (LACOP house rule is DE-only).

## 2026-04-20 — Split from lacop-site-demos monorepo

Josefine Gulden portfolio moved into its own repo (matching
lea-emrich / hanna-burgstaller / carina-rebecca after the Vercel hobby-tier
rate-limit fan-out fix from 2026-04-20).

Scaffolded from `schodakuch/lacop-site-template`, then aligned to the
real-data brief Josi had already provided in the old monorepo:

- `src/data/mock.ts` — tenant `slug: "josefine-gulden"`, `display_name:
  "Josefine Gulden"`, `website_domain: "josefine-gulden.lacop.site"`.
  `social_links.instagram = https://instagram.com/josi.gulden`. Stats are
  Josi's real measurements (Größe/Oberweite/Taille/Hüfte/BH/Schuhe/Kleidung)
  in DE labels. `bio` / `about` stay `null` until Josi delivers copy (no
  fabricated wording — house rule). `agencies` + `custom_links` empty.
  `role: "model"`. Media shape migrated from the legacy
  `{id, url, title_en, title_de, category, width, height, featured}` into
  LACOP `{id, user_id, category_id: null, storage_path, url, …}`;
  category_id is null because Josi has not taxonomised her work.
- `src/lib/lacop.ts` → `DEFAULT_SLUG = "josefine-gulden"`.
- `layout.tsx`, `robots.ts`, `sitemap.ts` → `SITE_URL` default is
  `https://josefine-gulden.lacop.site`.
- `package.json` → `name: "lacop-site-josefine"`.
- `public/photos/` — Josi's real photo-01…photo-12, hero.jpg, profile.jpg
  copied from `lacop-site-demos/sites/josefine/public/images/`.

Bilingual EN/DE scaffolding from the legacy site (LanguageContext,
translations object with `{en, de}` keys, `template.tsx` page transition)
is NOT carried over — LACOP house rule is DE-only copy via
`src/data/copy.ts` and single-lang layout (brief 2026-04-20).

Categories array left empty; Portfolio page handles that by rendering a
single unfiltered grid of all media.
