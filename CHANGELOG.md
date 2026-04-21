# Changelog

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
