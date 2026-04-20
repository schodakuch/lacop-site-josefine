import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ProfileProvider } from "@/context/ProfileContext";
import { getCategories, getProfile } from "@/lib/lacop";
import "./globals.css";

const body = Space_Grotesk({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://josefine-gulden.lacop.site";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  const displayName = profile.display_name ?? profile.slug;
  const description = profile.bio ?? `${displayName} — Portfolio.`;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `${displayName} — Portfolio`,
      template: `%s · ${displayName}`,
    },
    description,
    authors: [{ name: displayName }],
    creator: displayName,
    alternates: { canonical: "/" },
    openGraph: {
      type: "profile",
      locale: "de_DE",
      url: SITE_URL,
      siteName: displayName,
      title: `${displayName} — Portfolio`,
      description,
      images: profile.hero_image_url
        ? [{ url: profile.hero_image_url, alt: displayName }]
        : undefined,
    },
    twitter: {
      card: profile.hero_image_url ? "summary_large_image" : "summary",
      title: `${displayName} — Portfolio`,
      description,
      images: profile.hero_image_url ? [profile.hero_image_url] : undefined,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [profile, categories] = await Promise.all([getProfile(), getCategories()]);
  const displayName = profile.display_name ?? profile.slug;

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: displayName,
    jobTitle: profile.role,
    url: SITE_URL,
    image: profile.hero_image_url ?? profile.profile_image_url ?? undefined,
    sameAs: Object.values(profile.social_links),
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: `${displayName} — Portfolio`,
    url: SITE_URL,
    inLanguage: "de-DE",
  };

  return (
    <html lang="de">
      <body
        id="top"
        className={`${body.variable} ${mono.variable} bg-background text-foreground min-h-screen flex flex-col`}
      >
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:bg-foreground focus:text-background focus:px-4 focus:py-2 focus:text-xs focus:uppercase focus:tracking-[0.2em]"
        >
          Zum Inhalt springen
        </a>
        <ProfileProvider profile={profile} categories={categories}>
          <Navigation />
          <main id="main" className="flex-1 relative z-10">
            {children}
          </main>
          <Footer />
        </ProfileProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </body>
    </html>
  );
}
