import type { Metadata } from "next";
import { Suspense } from "react";
import PortfolioClient from "./PortfolioClient";
import { getAllMedia, getCategories, getProfile } from "@/lib/lacop";

export const revalidate = 10;

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  const name = profile.display_name ?? profile.slug;
  return {
    title: "Portfolio",
    description: `${name} — alle Serien.`,
    alternates: { canonical: "/portfolio" },
  };
}

export default async function PortfolioPage() {
  const [categories, media] = await Promise.all([getCategories(), getAllMedia()]);
  return (
    <Suspense fallback={null}>
      <PortfolioClient categories={categories} media={media} />
    </Suspense>
  );
}
