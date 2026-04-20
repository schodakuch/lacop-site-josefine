// Mirrors the LACOP public DB shape — see repo-root LACOP-DATA-SHAPE.md.
// Kept as a local copy (Fall B "alt-style" portfolio pattern) so this site
// can migrate to @lacop/data by swapping the resolvers in ./lacop.ts.

export type Role = "model" | "fotograf" | "kreativ" | "agentur";

export interface Agency {
  name: string;
  city?: string;
  url?: string;
}

export interface CustomLink {
  label: string;
  url: string;
}

export interface Profile {
  id: string;
  slug: string;
  display_name: string | null;
  bio: string | null;
  about: string | null;
  profile_image_url: string | null;
  hero_image_url: string | null;
  role: Role;
  social_links: Record<string, string>;
  stats: Record<string, string>;
  agencies: Agency[];
  custom_links: CustomLink[];
  website_domain: string | null;
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  cover_image_url: string | null;
  sort_order: number;
  is_visible: boolean;
  created_at: string;
}

export interface Media {
  id: string;
  user_id: string;
  category_id: string | null;
  type: "photo" | "video";
  storage_path: string;
  url: string;
  thumbnail_url: string | null;
  title: string | null;
  description: string | null;
  photographer_credit: string | null;
  shooting_date: string | null;
  sort_order: number;
  is_visible: boolean;
  width: number | null;
  height: number | null;
  file_size: number | null;
  uploaded_at: string;
  categories?: { name: string; slug: string } | null;
}
