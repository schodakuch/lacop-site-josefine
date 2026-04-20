import type { Metadata } from "next";
import AboutClient from "./AboutClient";
import { getProfile } from "@/lib/lacop";

export const revalidate = 10;

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  const name = profile.display_name ?? profile.slug;
  return {
    title: "Über mich",
    description: `${name} — Bio, Maße, Vertretung.`,
    alternates: { canonical: "/about" },
  };
}

export default async function AboutPage() {
  const profile = await getProfile();
  return <AboutClient profile={profile} />;
}
