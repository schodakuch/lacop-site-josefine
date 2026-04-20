// Mock backend — stands in for a live Supabase row set until the real wiring
// lands. Matches the LACOP `public_profiles` + `categories` + `media` shape
// (see repo-root LACOP-DATA-SHAPE.md). Keyed by `profile.slug` so the portfolio
// shell can render any customer when `LACOP_USER_SLUG` points at them.
//
// TEMPLATE DEFAULT — fill in real data per the brief before shipping.
// Replace: `slug`, `display_name`, `website_domain`, category names + slugs,
// and swap the placeholder SVG media entries for real WebP uploads.

import type { Category, Media, Profile } from "@/lib/types";

const TEMPLATE_ID = "00000000-0000-4000-a000-000000000001";

const templateProfile: Profile = {
  id: TEMPLATE_ID,
  slug: "template",
  display_name: "Template Placeholder",
  bio: null,
  about: null,
  profile_image_url: null,
  hero_image_url: null,
  role: "model",
  social_links: {},
  stats: {},
  agencies: [],
  custom_links: [],
  website_domain: null,
};

const CAT_EDITORIAL = "00000000-0000-4000-b000-000000000001";
const CAT_PORTRAIT = "00000000-0000-4000-b000-000000000002";
const CAT_LIFESTYLE = "00000000-0000-4000-b000-000000000003";

const templateCategories: Category[] = [
  {
    id: CAT_EDITORIAL,
    user_id: TEMPLATE_ID,
    name: "Editorial",
    slug: "editorial",
    cover_image_url: "/photos/placeholder-editorial.svg",
    sort_order: 0,
    is_visible: true,
    created_at: "2026-04-20T00:00:00Z",
  },
  {
    id: CAT_PORTRAIT,
    user_id: TEMPLATE_ID,
    name: "Portraiture",
    slug: "portraiture",
    cover_image_url: "/photos/placeholder-portraiture.svg",
    sort_order: 1,
    is_visible: true,
    created_at: "2026-04-20T00:00:00Z",
  },
  {
    id: CAT_LIFESTYLE,
    user_id: TEMPLATE_ID,
    name: "Lifestyle",
    slug: "lifestyle",
    cover_image_url: "/photos/placeholder-lifestyle.svg",
    sort_order: 2,
    is_visible: true,
    created_at: "2026-04-20T00:00:00Z",
  },
];

function placeholderMedia(
  userId: string,
  cat: string,
  slugBase: string,
  count: number,
  startSort: number,
): Media[] {
  return Array.from({ length: count }).map((_, i) => ({
    id: `m-${userId.slice(0, 4)}-${slugBase}-${String(i + 1).padStart(2, "0")}`,
    user_id: userId,
    category_id: cat,
    type: "photo" as const,
    storage_path: `${userId}/photos/placeholder-${slugBase}-${i + 1}.webp`,
    url: `/photos/placeholder-${slugBase}.svg`,
    thumbnail_url: `/photos/placeholder-${slugBase}.svg`,
    title: null,
    description: null,
    photographer_credit: null,
    shooting_date: null,
    sort_order: startSort + i,
    is_visible: true,
    width: 800,
    height: 1000,
    file_size: null,
    uploaded_at: "2026-04-20T00:00:00Z",
  }));
}

const templateMedia: Media[] = [
  ...placeholderMedia(TEMPLATE_ID, CAT_EDITORIAL, "editorial", 3, 0),
  ...placeholderMedia(TEMPLATE_ID, CAT_PORTRAIT, "portraiture", 3, 3),
  ...placeholderMedia(TEMPLATE_ID, CAT_LIFESTYLE, "lifestyle", 3, 6),
];

export const mockProfiles: Record<string, Profile> = {
  [templateProfile.slug]: templateProfile,
};

export const mockCategories: Record<string, Category[]> = {
  [TEMPLATE_ID]: templateCategories,
};

export const mockMedia: Record<string, Media[]> = {
  [TEMPLATE_ID]: templateMedia,
};
