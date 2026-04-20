import type { Metadata } from "next";
import ContactClient from "./ContactClient";
import { getProfile } from "@/lib/lacop";

export const revalidate = 10;

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  const name = profile.display_name ?? profile.slug;
  return {
    title: "Kontakt",
    description: `${name} — Kontakt & Buchung.`,
    alternates: { canonical: "/contact" },
  };
}

export default async function ContactPage() {
  const profile = await getProfile();
  return <ContactClient profile={profile} />;
}
