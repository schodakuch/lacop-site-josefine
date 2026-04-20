// Portfolio data resolvers — async so swapping the mock for real Supabase
// (@lacop/data) is a one-file change. The active customer is selected by the
// `LACOP_USER_SLUG` env var (per § 11.1 of LACOP-DATA-SHAPE.md); one codebase,
// many customer deployments, only the env var (and Supabase creds) differ.

import type { Category, Media, Profile } from "./types";
import { mockProfiles, mockCategories, mockMedia } from "@/data/mock";

const DEFAULT_SLUG = "template";

function activeSlug(): string {
  return process.env.LACOP_USER_SLUG?.trim() || DEFAULT_SLUG;
}

export async function getProfile(): Promise<Profile> {
  const slug = activeSlug();
  const profile = mockProfiles[slug];
  if (!profile) {
    throw new Error(
      `No mock profile for slug "${slug}". Add it to src/data/mock.ts or set LACOP_USER_SLUG to a known slug.`,
    );
  }
  return profile;
}

export async function getCategories(): Promise<Category[]> {
  const { id } = await getProfile();
  return (mockCategories[id] ?? [])
    .filter((c) => c.is_visible)
    .sort((a, b) => a.sort_order - b.sort_order);
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  return (await getCategories()).find((c) => c.slug === slug) ?? null;
}

export async function getAllMedia(limit?: number): Promise<Media[]> {
  const { id } = await getProfile();
  const all = (mockMedia[id] ?? [])
    .filter((m) => m.is_visible)
    .sort((a, b) => a.sort_order - b.sort_order);
  return typeof limit === "number" ? all.slice(0, limit) : all;
}

export async function getMediaByCategory(categorySlug: string): Promise<Media[]> {
  const cat = await getCategoryBySlug(categorySlug);
  if (!cat) return [];
  return (await getAllMedia()).filter((m) => m.category_id === cat.id);
}
