// Mock backend — stands in for a live Supabase row set until the real wiring
// lands. Matches the LACOP `public_profiles` + `categories` + `media` shape
// (see repo-root LACOP-DATA-SHAPE.md). Keyed by `profile.slug` so the portfolio
// shell can render any customer when `LACOP_USER_SLUG` points at them.

import type { Category, Media, Profile } from "@/lib/types";

const JOSI_ID = "10515f1e-0505-4051-a051-051051051051";

// Real profile data provided by Josi Gulden (Stuttgart-based model). Bio and
// about copy are placeholdered until Josi delivers her own wording — never
// fabricate biographical text for a real person.
const josefineProfile: Profile = {
  id: JOSI_ID,
  slug: "josefine-gulden",
  display_name: "Josefine Gulden",
  bio: null,
  about: null,
  profile_image_url: "/photos/profile.jpg",
  hero_image_url: "/photos/hero.jpg",
  role: "model",
  social_links: {
    instagram: "https://instagram.com/josi.gulden",
  },
  stats: {
    "Größe": "173 cm",
    "Oberweite": "88 cm",
    "Taille": "64 cm",
    "Hüfte": "91 cm",
    "BH": "75 B",
    "Schuhe": "38 EU",
    "Kleidung": "34–36 EU",
  },
  agencies: [],
  custom_links: [],
  website_domain: "josefine-gulden.lacop.site",
};

// Categories intentionally empty — Josi has not classified the work yet.
// Portfolio renders as a single unfiltered grid (LACOP shell handles this).
const josefineCategories: Category[] = [];

// Real photos Josi supplied. Dimensions match the source files; titles and
// photographer credits stay null until Josi fills them in.
const josefineMedia: Media[] = [
  { idx: 1,  w: 2200, h: 3300 },
  { idx: 2,  w: 2200, h: 3300 },
  { idx: 3,  w: 2200, h: 3300 },
  { idx: 4,  w: 2200, h: 3300 },
  { idx: 5,  w: 2200, h: 3300 },
  { idx: 6,  w: 2200, h: 3300 },
  { idx: 7,  w: 2200, h: 2933 },
  { idx: 8,  w: 1600, h: 2400 },
  { idx: 9,  w: 2200, h: 2933 },
  { idx: 10, w: 2200, h: 2933 },
  { idx: 11, w: 2200, h: 3300 },
  { idx: 12, w: 2200, h: 2750 },
].map(({ idx, w, h }, sort) => {
  const n = String(idx).padStart(2, "0");
  return {
    id: `m-josi-${n}`,
    user_id: JOSI_ID,
    category_id: null,
    type: "photo" as const,
    storage_path: `${JOSI_ID}/photos/photo-${n}.jpg`,
    url: `/photos/photo-${n}.jpg`,
    thumbnail_url: `/photos/photo-${n}.jpg`,
    title: null,
    description: null,
    photographer_credit: null,
    shooting_date: null,
    sort_order: sort,
    is_visible: true,
    width: w,
    height: h,
    file_size: null,
    uploaded_at: "2026-04-20T00:00:00Z",
  };
});

export const mockProfiles: Record<string, Profile> = {
  [josefineProfile.slug]: josefineProfile,
};

export const mockCategories: Record<string, Category[]> = {
  [JOSI_ID]: josefineCategories,
};

export const mockMedia: Record<string, Media[]> = {
  [JOSI_ID]: josefineMedia,
};
