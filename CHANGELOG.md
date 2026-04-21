# Changelog

## 2026-04-21 — Home responsive pass + soft-radius refresh

Home was left alone in the previous pass ("Startseite ist ok") but it
still had the old two-step section padding and no svh caps on the hero
image — the portrait could overflow the fold on short mobile viewports
(same bug that hit carina/hanna/lea). Also unified the border-radius
treatment across cards and images: `rounded-sm` (2px) read sharp
against the pale-blue + Space Grotesk softness — bumped images and
category cards to `rounded-lg` (8px), hero portrait to `rounded-xl`
(12px, signature). Pill buttons stay `rounded-full` — that's the
site's voice.

**Home hero:** wrapped in `flex flex-col justify-center
min-h-[calc(100svh-3.5rem)] md:min-h-[calc(100svh-4rem)]`. Portrait
now has `max-h-[38svh] md:max-h-[48svh]` and a responsive max-w
progression `max-w-[220px] sm:max-w-[260px] md:max-w-[300px]`. H1
clamp pulled to `clamp(1.9rem,5.5vw,3.4rem)`. CTA/secondary font-size
bumped to `0.95rem` for consistency with the rest of the site.

**Home sections:** `py-14 md:py-20` → `py-12 md:py-16 lg:py-20`
(adds the tablet step so `py-20` is reserved for desktop).

**About:** portrait `rounded-sm` → `rounded-lg`; section padding
gained tablet step `py-10 md:py-14 lg:py-16` / `py-12 md:py-14
lg:py-16`; stats grid `gap-x-6 md:gap-x-8` so 4-col on tablet has
breathing room.

**Portfolio:** gallery tiles `rounded-sm` → `rounded-lg`; bottom
section padding `pb-20 md:pb-28` → `pb-16 md:pb-24 lg:pb-28`.

**Globals:** `.slot` helper `border-radius: 4px` → `8px` so empty-
state slots match the new `rounded-lg` image treatment.

Space Grotesk + pale-blue + 8px corners reads as "soft editorial"
instead of "techy brutalist" — feels right for a Stuttgart
fashion/lifestyle model preview.

## 2026-04-21 — Josi's real content pass + responsive/typography fixes

Update pass before handing a preview back to Josi.

**Content (data-driven; mock already had real measurements/social — the
changes are in the copy table and the contact email override):**
- `copy.about.bio_heading`: "Kurzbio" → "Meine Geschichte" (Josi's
  preferred wording).
- `copy.about.bio_empty`: "Kurzbio folgt." → "Text folgt." — the
  placeholder shown until Josi delivers her story.
- Added `copy.about.location = "Stuttgart, Deutschland"` and rendered
  it as a small caption under the bio paragraph.
- `ContactClient` now uses a hardcoded `BOOKING_EMAIL =
  "Cooperation-Josi.Gulden@outlook.com"` override — the default
  `hello@<domain>` derivation in `bookingEmailFor` is wrong for Josi,
  who prefers her outlook address. Comment in the file flags this as a
  temporary override until LACOP `public_profiles` adds
  `contact_email`.

**Stats, socials, agencies, client list:** nothing to do —
`src/data/mock.ts` already had the correct real values
(173/88/64/91/75B/38/34–36, no Augen/Haare, only Instagram
`josi.gulden`, empty `agencies`/`custom_links` so the "Karriere-
Highlights" and "Ausgewählte Kunden" sections never render). Any fake
content seen on the live site (Vogue/Mailand/IMG/Elle, Mercedes-
Benz/Samsung/Chopard/…, `booking@josefinegulden.com`, TikTok /
Pinterest links) is stale — this deploy confirms the correct state.

**Responsive / typography (catching up to the template 2026-04-21
rules after the repo was split on 2026-04-20):**
- Page-title H1s (about/contact/portfolio): `clamp(2.8rem,10vw,6.4rem)`
  → `clamp(2.2rem,7.5vw,5rem)` with `leading-[1]` so descenders
  don't clip.
- Nav drawer max-h switched from `100vh` → `100svh` so mobile chrome
  doesn't overlap the bottom of the drawer.
- Mono+uppercase removed from: nav mobile toggle, footer back-to-top,
  404 home link. Body font + mixed case now (eyebrows/stat labels
  keep mono — that's still correct for captions).
- Contact: section padding `py-12 md:py-20` → `py-12 md:py-16
  lg:py-20` (adds tablet step); success mark `text-6xl` →
  `text-5xl sm:text-6xl`.

Home page (`HomeClient.tsx`) deliberately untouched per Josi's ask
("Startseite ist ok wie sie ist").

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
