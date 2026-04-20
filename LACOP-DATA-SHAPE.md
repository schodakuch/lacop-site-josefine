# LACOP Data Shape — Master Reference für Portfolio-Creators

**Stand:** 2026-04-07
**Quelle:** Live-DB (Supabase), `supabase/schema.sql`, `src/lib/types.ts`, `src/lib/security.ts`, `src/lib/plan-limits.ts`, `src/app/api/*`, `.claude/rules/*`, `programs/lacop-ui/packages/data/src/*`
**Verifiziert gegen:** Live-DB Schema, RLS-Policies, Migrations-Historie, CHECK-Constraints, Storage-Buckets, Functions/Triggers.

Diese Datei ist die **einzige Wahrheit** für Portfolio-Entwickler. Wer Portfolios baut oder migriert, arbeitet ausschließlich gegen diese Shape. Keine Annahmen, keine Halluzinationen.

---

## 0. TL;DR für eilige Creators

- **Lies NUR aus der View `public_profiles`**, nie direkt aus `profiles`. Als `anon` User fehlt dir eh die RLS-Berechtigung für `profiles`.
- **Zwei Tabellen sind als `anon` lesbar:** `categories` (wenn `is_visible=true`) und `media` (wenn `is_visible=true`). Plus die View `public_profiles` (alle Profile, ohne private Felder).
- **Storage-Bucket heißt `media`**, ist public, alle Bilder werden über direkte URLs in `media.url` / `media.thumbnail_url` ausgeliefert.
- **Stats & social_links sind freie JSONB-dicts** — NIE Keys hardcoden. Immer `Object.entries()`.
- **Das neue Feld `profiles.hero_image_url`** (seit 2026-04-07) ist da, nutzen mit Fallback `hero_image_url || media[0]?.url || profile_image_url`.
- **Kategorien und Fotos haben NICHTS außer dem was unten steht** — kein `tags`, kein `description` auf Kategorien, kein `city`, kein `verified`, kein `pronouns`, kein `hero_video_url`, kein `testimonials`. Nicht halluzinieren.

---

## 1. Datenbank-Architektur (1:N-FK-Tree)

```
auth.users (Supabase Auth)
   │
   ▼ FK: ON DELETE CASCADE
public.profiles (PK = auth.users.id)
   │                  ↑
   │                  │ readonly für Portfolios: public_profiles VIEW
   │                  │ (expose sichere Felder, bypasses RLS via security_invoker=false)
   │
   ├─▶ public.categories (FK user_id → profiles.id ON DELETE CASCADE)
   │        │
   │        ▼ FK: ON DELETE SET NULL
   └───▶ public.media (FK user_id + category_id)
```

**Weitere Tabellen (nicht für Portfolios zugänglich):**
- `audit_logs` — admin-only, append-only (Trigger blockiert UPDATE/DELETE)
- `legal_consents` — admin-only, Onboarding Legal-Tracking
- `feedback` — leer, /feedback page submissions
- `support_tickets` — leer, Support-System

Die 7 tabellen sind **alles**. Es gibt KEINE Tabellen für `testimonials`, `press_mentions`, `cv`, `experience`, `bookings`, `newsletter_subscribers`, `analytics`, `site_settings`, `theme_config`, etc. Wer solche Daten im Portfolio braucht, muss sie aktuell im `about`-Freitext oder `custom_links` unterbringen.

---

## 2. `public_profiles` View — der einzige Zugang für Portfolios

**Definition (live DB, 2026-04-07):**

```sql
SELECT
  id,
  slug,
  display_name,
  bio,
  about,
  profile_image_url,
  hero_image_url,    -- seit 2026-04-07
  role,
  social_links,
  stats,
  agencies,
  custom_links,
  website_domain
FROM profiles;
```

**Sicherheits-Eigenschaften:**
- `WITH (security_invoker = false)` — View läuft als `postgres` und umgeht RLS. Das ist beabsichtigt, damit `anon`-Clients (Portfolios) die Daten lesen können.
- `GRANT SELECT ON public_profiles TO anon, authenticated` — nur SELECT, kein INSERT/UPDATE/DELETE.
- **Explizit ausgeschlossen** (bleiben in der privaten `profiles` Tabelle): `contact_email`, `plan`, `suspended`, `stripe_customer_id`, `created_at`, `updated_at`.

**WICHTIG — Warum `contact_email` nicht drin ist:** Datenschutz. Wer Kontakt-Info braucht, muss `custom_links` oder `social_links` nutzen. Ein Contact-Form im Portfolio sollte POST an einen lacop-internen Relay machen, nicht direkt an die Email.

### 2.1 Feld-Referenz `public_profiles`

| Feld | Typ | Nullable | CHECK Constraint | Zweck |
|---|---|---|---|---|
| `id` | uuid | NO | — | Primary key, = auth.users.id |
| `slug` | text | NO | `length(slug) ≤ 60`, UNIQUE global | URL-Segment für lacop.site Subdomain |
| `display_name` | text | YES | `length ≤ 100` | Anzeigename, z.B. "Felix Berger" |
| `bio` | text | YES | `length ≤ 500` | Kurz-Text für Hero-Section |
| `about` | text | YES | `length ≤ 2000` | Langtext für About-Page |
| `profile_image_url` | text | YES | — | **256×256 Avatar WebP** — ACHTUNG: NICHT für Vollbild-Hero, viel zu klein |
| `hero_image_url` | text | YES | — | Full-Resolution Hero, via Stern-Button in Galerie gesetzt. Nullable — Fallback verwenden. |
| `role` | text | NO | `role IN ('model','fotograf','kreativ','agentur','admin')` | `admin` ist intern, kommt bei Creator-Profilen nicht vor |
| `social_links` | jsonb | YES | — | **Freies Dict**. Default `{}`. Siehe 2.2 |
| `stats` | jsonb | YES | — | **Freies Dict**. Default `{}`. Siehe 2.3 |
| `agencies` | jsonb | YES | — | **Array** von `{ name, city?, url? }`. Default `[]`. Max 10 |
| `custom_links` | jsonb | YES | — | **Array** von `{ label, url }`. Default `[]`. Plan-abhängig limitiert |
| `website_domain` | text | YES | `length ≤ 200` | Subdomain wie `felixberger.lacop.site`. Nur Pro/Premium. Nur Admin setzbar. |

### 2.2 `social_links` — NICHT hardcoden

**Zod-Schema im Backend erlaubt offiziell** (aus `src/lib/security.ts`):
```ts
social_links: z.object({
  instagram: urlField.optional(),
  tiktok: urlField.optional(),
  youtube: urlField.optional(),
  snapchat: z.string().max(200).optional(),
}).optional()
```

**Real-World-Daten in der Live-DB (2026-04-07):**

| User | Keys |
|---|---|
| aria-nakamura | `tiktok`, `instagram` |
| josefine-gulden | `email`, `instagram` (!) |
| chiara-ebner | `instagram` |

Josefines `email` ist ein Schema-Violation (alter Eintrag, bevor der Zod-Check strict war). Heißt: **in der DB kann JEDER String-Key vorkommen.**

**Pattern für Portfolios:**
```tsx
{Object.entries(profile.social_links || {}).map(([platform, url]) => {
  if (!url) return null
  const icon = getSocialIcon(platform) // instagram/tiktok/youtube/snapchat → Icon, sonst generic Link-Icon
  return <a key={platform} href={url} target="_blank" rel="noopener">{icon}</a>
})}
```

**Wichtig:** `url` kann ein kompletter Link sein (`https://instagram.com/foo`) ODER ein Benutzername (`@foo` oder nur `foo`). Der Dashboard-Code speichert z.B. `https://instagram.com/${username}` — aber alte Daten können Rohformate enthalten. Immer `safeUrl()` aus `@lacop/data` nutzen.

### 2.3 `stats` — NICHT hardcoden, sprachabhängig

Es gibt **KEIN festes Schema** für `stats`. Der Key-Name hängt davon ab wer die Daten eingefügt hat — sogar die Sprache ist variabel. Beispiele:

**Englischsprachiges Model (Aria Nakamura):**
```json
{
  "Height": "173 cm / 5'8\"",
  "Bust": "84 cm / 33\"",
  "Waist": "61 cm / 24\"",
  "Hips": "89 cm / 35\"",
  "Dress": "EU 34-36 / US 2-4",
  "Shoes": "EU 39 / US 8",
  "Hair": "Black",
  "Eyes": "Dark Brown"
}
```

**Deutschsprachiges Model (Chiara Ebner, Josefine Gulden):**
```json
{
  "Größe": "175 cm",
  "Oberweite": "85 cm",
  "Taille": "72 cm",
  "Hüfte": "90 cm",
  "Konfektion": "34/36",
  "Schuhe": "39",
  "Haare": "Dunkelbraun",
  "Augen": "Braun"
}
```

**HARD RULE:** Niemals `profile.stats.height` oder `profile.stats["Size"]` schreiben. Immer:
```tsx
{profile.stats && Object.entries(profile.stats).map(([key, value]) => (
  <div key={key}>
    <span>{key}</span>
    <span>{value}</span>
  </div>
))}
```

**ACHTUNG — wichtiger Implementation-Detail:** Das LacopAPP Dashboard hat **derzeit KEINE UI zum Bearbeiten von `stats`**. Das Feld wird auch NICHT im `profileUpdateSchema` validiert. Das heißt:
- Stats kommen in die DB via Seed-Skripten, Admin-SQL oder manuelle Dashboard-Einträge
- Kunden können ihre eigenen Stats aktuell nicht selbst pflegen
- **Wenn ein Portfolio Stats rendern soll, werden sie oft leer sein** — immer Empty-State planen

### 2.4 `agencies` Array

```ts
interface Agency {
  name: string         // Pflicht, max 100 chars
  city?: string        // optional, max 100 chars
  url?: string         // optional, http/https, max 200 chars
}
```

Default: `[]`. Max 10 Agenturen pro User. Zod strippt HTML-Tags aus `name` und `city`. URLs werden automatisch mit `https://` geprefixt wenn kein Protokoll vorhanden. Portfolios sollten `safeUrl()` trotzdem nochmal gegenchecken (defense in depth).

### 2.5 `custom_links` Array

```ts
interface CustomLink {
  label: string       // Pflicht, max 50 chars
  url: string         // Pflicht, http/https, max 200 chars
}
```

Default: `[]`. **Plan-abhängig limitiert:**

| Plan | Max Custom Links |
|---|---|
| free | 0 |
| starter | 5 |
| pro | 15 |
| premium | unlimited |

Der Plan ist aus `public_profiles` **nicht sichtbar** (aus Datenschutz-Gründen). Portfolios sollen die Links einfach rendern — das Limit wird beim Schreiben im LacopAPP erzwungen.

---

## 3. `categories` Tabelle

**Shape (TypeScript):**
```ts
interface Category {
  id: string              // uuid, default gen_random_uuid()
  user_id: string         // FK → profiles.id, ON DELETE CASCADE
  name: string            // Pflicht, max 60 chars
  slug: string            // Pflicht, max 60 chars, UNIQUE per user_id
  cover_image_url: string | null  // Explizit gesetzt via Frame-Button im MediaGrid. Fallback verwenden.
  sort_order: number      // Default 0. Portfolios sortieren ASC.
  is_visible: boolean     // Default true. RLS: als anon nur `is_visible=true` sichtbar
  created_at: string      // timestamptz, default now()
}
```

**Was es NICHT gibt:**
- `description` / `intro`
- `updated_at`
- `year` / `shoot_date`
- `is_featured`
- `location`
- `password` / `protected`
- `media_count` (wird client-seitig aggregiert: `SELECT *, media(count) FROM categories`)

**UNIQUE Constraint:** `(user_id, slug)` ist composite UNIQUE.

**RLS Policy `categories_public_read`:** `is_visible = true OR auth.uid() = user_id` — als anon nur `is_visible=true`.

---

## 4. `media` Tabelle

**Shape (TypeScript):**
```ts
interface Media {
  id: string                        // uuid, default gen_random_uuid()
  user_id: string                   // FK → profiles.id, ON DELETE CASCADE
  category_id: string | null        // FK → categories.id, ON DELETE SET NULL
  type: 'photo' | 'video'           // CHECK constraint, default 'photo'
  storage_path: string              // Pflicht, max 500 chars, z.B. "{user_id}/photos/{uuid}.webp"
  url: string                       // Pflicht, Supabase public URL des Haupt-Bildes
  thumbnail_url: string | null      // 400px WebP Thumbnail URL
  title: string | null              // max 200 chars
  description: string | null        // max 1000 chars
  photographer_credit: string | null // max 200 chars
  shooting_date: string | null      // date (YYYY-MM-DD), NOT timestamp
  sort_order: number                // default 0, Portfolios sortieren ASC
  is_visible: boolean               // default true, RLS gleich wie categories
  width: number | null              // int, von Sharp gesetzt beim Upload
  height: number | null             // int, von Sharp gesetzt beim Upload
  file_size: number | null          // int, Bytes des konvertierten WebP
  uploaded_at: string               // timestamptz, default now()
  categories?: { name: string, slug: string } | null  // Optional beim Query join
}
```

**Was es NICHT gibt:** `tags`, `keywords`, `location_taken`, `gps`, `camera`, `lens`, `exif`, `duration`, `poster_url`, `watermark_url`, `downloads`, `views`, multi-category.

**Video-Handling:** `type='video'` existiert, aber keine video-spezifischen Felder. `<video src={url} poster={thumbnail_url}>` ist das Pattern. Upload-Endpoint verarbeitet aktuell nur Bilder mit Sharp; Videos müssen manuell per SQL eingepflegt werden.

---

## 5. CHECK Constraints (DB-Ebene)

| Tabelle | Feld | Constraint |
|---|---|---|
| profiles | role | `IN ('model', 'fotograf', 'kreativ', 'agentur', 'admin')` |
| profiles | plan | `IN ('free', 'starter', 'pro', 'premium')` |
| profiles | slug | `length ≤ 60` + UNIQUE |
| profiles | display_name | `length ≤ 100` |
| profiles | bio | `length ≤ 500` |
| profiles | about | `length ≤ 2000` |
| profiles | contact_email | `length ≤ 200` |
| profiles | website_domain | `length ≤ 200` |
| categories | name | `length ≤ 60` |
| categories | slug | `length ≤ 60` |
| media | type | `IN ('photo', 'video')` |
| media | title | `length ≤ 200` |
| media | description | `length ≤ 1000` |
| media | photographer_credit | `length ≤ 200` |
| media | storage_path | `length ≤ 500` |

---

## 6. RLS Policies — was Portfolios als `anon` sehen

| Tabelle | SELECT als anon | Kommentar |
|---|---|---|
| `profiles` | **NICHT direkt lesbar** | Nur owner via `auth.uid() = id`. Portfolios müssen `public_profiles` view nutzen. |
| `categories` | Nur `is_visible=true` | `is_visible = true OR auth.uid() = user_id` |
| `media` | Nur `is_visible=true` | gleich wie categories |
| `public_profiles` (view) | Alle Zeilen | security_invoker=false, liefert alle Profiles |
| `audit_logs` | Admin-only | |
| `legal_consents` | Admin-only | |
| `feedback` | Kein SELECT-Policy | Nur Admin über Service-Key |
| `support_tickets` | Nur owner via `user_id` | Anon kann INSERT aber nicht lesen |

**Hard Rule für Portfolio-Code:**
```ts
// FALSCH — RLS wird failen:
supabase.from('profiles').select('*').eq('slug', userSlug)

// RICHTIG:
supabase.from('public_profiles').select('*').eq('slug', userSlug)
```

---

## 7. Storage: Bucket, Pfade, Policies

- **Ein Bucket**: `media`. Public. Keine size/mime Limits auf Bucket-Ebene (im API erzwungen).

| Pfad | Zweck |
|---|---|
| `{user_id}/photos/{uuid}.webp` | Hauptbild (max 2000px, q80) |
| `{user_id}/thumbs/{uuid}.webp` | Thumbnail (400px, q70) |
| `{user_id}/avatar/profile.webp` | Avatar (256×256, q85) |

Beispiel-URL: `https://yjgmribwwzizvllmxbyg.supabase.co/storage/v1/object/public/media/{user_id}/photos/{uuid}.webp`

**Policies:** Public read. Write nur in eigenem User-ID-Ordner.

---

## 8. Image Processing (Sharp)

| Typ | Max Dimension | Format | Qualität | Endpoint |
|---|---|---|---|---|
| Hauptbild | 2000px breit (nur downscale) | WebP | 80 | `/api/media/upload` |
| Thumbnail | 400px breit | WebP | 70 | `/api/media/upload` |
| Avatar | 256×256 cover-crop | WebP | 85 | `/api/profile/avatar` |

**Pre-Checks:** Max 15MB media / 5MB avatar. Max 30000×30000 input. Blockiert `image/svg+xml`, `image/x-icon`. Avatar: JPEG/PNG/WebP.

**Konsequenz:** Du bekommst **immer WebP**. Und `profile_image_url` ist 256px — nicht für Fullscreen-Hero stretchen; dafür ist `hero_image_url` (2000px).

---

## 9. Plan-Limits

| Resource | free | starter | pro | premium |
|---|---|---|---|---|
| Photos | 30 | ∞ | ∞ | ∞ |
| Galleries | 3 | ∞ | ∞ | ∞ |
| Custom Links | 0 | 5 | 15 | ∞ |
| Password Galleries | ❌ | ❌ | ✅ | ✅ |
| Custom Domain | ❌ | ❌ | ✅ | ✅ |
| Languages | 1 | 2 | 3 | 5 |

Durchsetzung: Photos + Galleries via PostgreSQL `check_and_increment_limit()` mit `pg_advisory_xact_lock` — TOCTOU-sicher.

---

## 10. Was User kann vs. nur Admin

### 10.1 User selbst über Dashboard + API
`display_name`, `bio`, `about`, `contact_email`, `social_links`, `agencies`, `custom_links`, `profile_image_url`, `hero_image_url`, alle `categories.*` außer Admin-Fields, alle `media.*`.

### 10.2 Nur Admin
`role`, `slug`, `website_domain`, `plan`, `suspended`, `email` (auth.users).

### 10.3 Aktuell GAR NICHT setzbar
- **`stats`** — existiert im Schema, aber weder in `profileUpdateSchema` noch `adminPatchUserSchema` validiert. Muss per Seed/Admin-SQL eingetragen werden. **Offener Gap.**
- Existieren gar nicht im Schema: `pronouns`, `is_verified`, `date_of_birth`, `languages_spoken`, `city`, `country`.

---

## 11. Portfolio-Queries via `@lacop/data` Package

In `programs/lacop-ui/packages/data/`:

```ts
export {
  getProfile,         // -> Promise<Profile>
  getCategories,      // -> Promise<Category[]> (nur is_visible=true)
  getCategoryBySlug,  // -> Promise<Category | null>
  getAllMedia,        // -> Promise<Media[]>    (nur is_visible=true)
  getMediaByCategory, // -> Promise<Media[]>
} from './lacop'

export { safeUrl } from './utils'
export type { Profile, Category, Media, Agency, CustomLink } from './types'
```

### 11.1 Setup

```env
NEXT_PUBLIC_SUPABASE_URL=https://yjgmribwwzizvllmxbyg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
LACOP_USER_SLUG=felix-berger
```

`LACOP_USER_SLUG` ist die einzige Konfiguration die zwischen Kunden unterschiedlich ist.

### 11.2 Typische Page-Komposition

```tsx
import { getAllMedia, getProfile, getCategories } from '@lacop/data'

export const revalidate = 10

export default async function Home() {
  const [profile, media, categories] = await Promise.all([
    getProfile(),
    getAllMedia(8),
    getCategories(),
  ])
  return <HomeClient profile={profile} media={media} categories={categories} />
}
```

### 11.3 Alt-Style Portfolios

Manche bestehende Portfolios haben lokale Kopien von `lacop.ts` und `types.ts` in `src/lib/`. Diese müssen bei Schema-Änderungen manuell geupdated werden (siehe § 14).

---

## 12. Fallback-Patterns

### 12.1 Hero-Background
```tsx
const heroSrc =
  profile.hero_image_url ||      // Stern-Button explicit
  media[0]?.url ||                // Erstes Galerie-Bild (sort_order ASC)
  profile.profile_image_url       // Notfall: Avatar (wird gestretcht)
```

### 12.2 Category-Cover
```tsx
const coverSrc =
  category.cover_image_url ||
  media.find((m) => m.category_id === category.id)?.url
```

### 12.3 Bio-Portrait
Avatar (256px) ist akzeptabel für schmale Spalten. Bei größerem Portrait: `media[0]`.

---

## 13. `safeUrl()` — URL-Sanitization

```ts
export function safeUrl(url: string | undefined | null): string | null {
  if (!url) return null
  try {
    const u = new URL(url)
    return ['http:', 'https:'].includes(u.protocol) ? url : null
  } catch {
    return null
  }
}
```

**Immer nutzen für User-Input-URLs** (social_links, custom_links, agencies[].url). Blockt `javascript:`, `data:`, `file:`, etc.

---

## 14. Migration: Alt-Style → `@lacop/data`

### Fall A: Nutzt `@lacop/data` (neues Pattern)

1. `programs/lacop-ui/packages/data/src/types.ts` erweitern
2. `.../lacop.ts` `.select(...)` anpassen
3. `pnpm build` im Package
4. Im Portfolio `pnpm install --force`
5. Fallback-Pattern nutzen
6. Alle Seiten durchklicken (Home/Portfolio/About/Contact, Mobile)
7. `npm run build && npx tsc --noEmit`
8. CHANGELOG.md + Commit/Push

### Fall B: Lokale `lacop.ts` Kopie

1. Lokal `src/lib/types.ts` und `src/lib/lacop.ts` erweitern
2. Rest wie Fall A

### Fall C: Complete fresh migration

1. `pnpm add @lacop/ui @lacop/data @lacop/i18n`
2. Lokal `src/lib/lacop.ts`, `src/lib/types.ts` löschen
3. Imports umstellen auf `@lacop/data`
4. Test + Commit

---

## 15. Anti-Patterns

### 15.1 Hardcoded Data
```tsx
// FALSCH
const HERO_IMAGE = '/images/felix-hero.jpg'
const CATEGORIES = [{ name: 'Editorial', count: 24 }]

// RICHTIG
const categories = await getCategories()
const media = await getAllMedia()
```

### 15.2 Direkte `profiles` Query
```tsx
// FALSCH — RLS blockt
supabase.from('profiles').select('*').eq('slug', SLUG)

// RICHTIG
supabase.from('public_profiles').select('*').eq('slug', SLUG)
// oder besser: getProfile() aus @lacop/data
```

### 15.3 Hardcoded Stats-Keys
```tsx
// FALSCH
<div>Height: {profile.stats.height}</div>

// RICHTIG
{Object.entries(profile.stats || {}).map(([k, v]) => (
  <div key={k}>{k}: {v}</div>
))}
```

### 15.4 Hardcoded Social Icons
```tsx
// FALSCH
<a href={profile.social_links.instagram}><Instagram /></a>

// RICHTIG
{Object.entries(profile.social_links || {}).map(([p, url]) => {
  if (!url) return null
  return <SocialLink key={p} platform={p} url={url} />
})}
```

### 15.5 `next/image` für Hero mit Avatar-URL
Avatar ist 256×256. Nutze `hero_image_url` (2000px) für Hero. Oder `<img>` statt `next/image` wenn Avatar als Hero gestretcht wird.

### 15.6 Annahme dass Felder existieren
`pronouns`, `category.description`, `media.tags` — existieren nicht im Schema. Nicht halluzinieren.

---

## 16. Checkliste vor Merge

- [ ] Verwendet `public_profiles` view, nicht direkt `profiles`
- [ ] Iteriert über `Object.entries()` für `stats` und `social_links`
- [ ] Hero-Fallback: `hero_image_url || media[0] || profile_image_url`
- [ ] Category-Cover-Fallback: `cover_image_url || media.find(...)`
- [ ] Empty-States für leere Profile (keine Bilder, Stats, Links)
- [ ] `safeUrl()` für alle User-Input URLs
- [ ] Keine hardcoded Daten, alles dynamisch aus DB
- [ ] `revalidate = 10` auf Server-Pages
- [ ] Lokaler `npm run dev` durchgeklickt (alle Seiten, Mobile)
- [ ] `npm run build && npx tsc --noEmit` grün
- [ ] CHANGELOG.md im Portfolio-Repo aktualisiert
- [ ] Gegen **zwei verschiedene Kunden** getestet (EN-Stats + DE-Stats)

---

## 17. Bekannte Inkonsistenzen (2026-04-07)

1. `supabase/schema.sql` hat `hero_image_url` noch nicht (canonical outdated)
2. `public_profiles` view in `schema.sql` ohne `hero_image_url` (Live-DB hat es)
3. `.claude/rules/database.md` behauptet fälschlich "KEIN stats" für public_profiles view
4. `supabase/migrations/` Ordner enthält nur 3 SQL-Files, Live-DB hat 11 applied — 8 wurden direkt via MCP/Dashboard appliziert
5. `profileUpdateSchema` hat kein `stats` — User können aktuell keine Stats selbst pflegen
6. `adminPatchUserSchema` hat auch kein `stats` — Niemand kann Stats aktuell über offizielle API setzen

---

## 18. Versionen

- **2026-04-07** — Initial version nach Deep-Dive gegen Live-DB. Enthält `hero_image_url` neu.
