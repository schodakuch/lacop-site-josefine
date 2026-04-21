"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { Category, Media, Profile } from "@/lib/types";
import { copy } from "@/data/copy";
import ScrollReveal from "@/components/ScrollReveal";

type Props = {
  profile: Profile;
  categories: Category[];
  media: Media[];
};

export default function HomeClient({ profile, categories, media }: Props) {
  const reduced = useReducedMotion();
  const displayName = profile.display_name ?? profile.slug;

  const heroSrc =
    profile.hero_image_url || media[0]?.url || profile.profile_image_url;

  const stats = profile.stats ?? {};
  const hasStats = Object.keys(stats).length > 0;
  const hasBio = Boolean(profile.bio);

  return (
    <>
      {/* HERO — centered vertical stack, sized to fit the fold on every
          screen (svh caps, min-h=viewport-minus-nav, flex-centered). */}
      <section className="relative px-5 md:px-10 lg:px-16 pt-6 md:pt-10 pb-10 md:pb-14 flex flex-col justify-center min-h-[calc(100svh-3.5rem)] md:min-h-[calc(100svh-4rem)]">
        <div className="mx-auto max-w-xl text-center w-full">
          <p className="mono text-[0.68rem] uppercase tracking-[0.22em] text-accent mb-3">
            {profile.role} · {copy.nav.home}
          </p>
          <h1 className="font-medium tracking-[-0.02em] text-[clamp(1.9rem,5.5vw,3.4rem)] leading-[1.05] text-ink">
            {displayName}
          </h1>
          <p
            className={`text-sm md:text-base leading-relaxed mt-3 max-w-md mx-auto ${
              hasBio ? "text-ink-soft" : "italic text-muted"
            }`}
          >
            {profile.bio ?? copy.home.about_empty}
          </p>

          {heroSrc && (
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative mt-5 md:mt-7 mx-auto w-full max-w-[220px] sm:max-w-[260px] md:max-w-[300px]"
            >
              <div className="relative aspect-[4/5] max-h-[38svh] md:max-h-[48svh] overflow-hidden bg-mist-strong rounded-xl border border-rule shadow-[0_16px_40px_-16px_rgba(14,18,32,0.18)]">
                <Image
                  src={heroSrc}
                  alt={displayName}
                  fill
                  priority
                  sizes="(min-width: 768px) 300px, 60vw"
                  className="object-cover"
                />
              </div>
            </motion.div>
          )}

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-3">
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 text-[0.95rem] font-medium text-background bg-ink px-5 py-2.5 hover:bg-accent transition-colors rounded-full"
            >
              {copy.home.categories_cta} →
            </Link>
            <Link href="/contact" className="hover-line text-[0.95rem] font-medium text-accent">
              {copy.nav.contact}
            </Link>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      {categories.length > 0 && (
        <section className="px-5 md:px-10 lg:px-16 py-12 md:py-16 lg:py-20 border-t border-rule">
          <ScrollReveal>
            <div className="flex items-end justify-between gap-6 mb-8 md:mb-12">
              <div>
                <p className="mono text-[0.72rem] uppercase tracking-[0.22em] text-accent mb-3">
                  {copy.home.categories_eyebrow}
                </p>
                <h2 className="font-medium text-[clamp(1.8rem,5vw,3rem)] tracking-[-0.02em] text-ink">
                  {copy.portfolio.title}
                </h2>
              </div>
              <Link href="/portfolio" className="hover-line hidden sm:inline text-[0.95rem] font-medium text-accent">
                {copy.home.categories_cta} →
              </Link>
            </div>
          </ScrollReveal>

          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {categories.map((cat) => {
              const cover =
                cat.cover_image_url ||
                media.find((m) => m.category_id === cat.id)?.url;
              return (
                <li key={cat.id}>
                  <Link href={`/portfolio?category=${cat.slug}`} className="group block">
                    <div className="relative aspect-[4/5] overflow-hidden bg-mist-strong rounded-lg border border-rule">
                      {cover ? (
                        <Image
                          src={cover}
                          alt={cat.name}
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                        />
                      ) : (
                        <div className="slot" />
                      )}
                      <div className="absolute inset-x-0 bottom-0 p-5 md:p-6 bg-gradient-to-t from-ink/70 to-transparent">
                        <div className="flex items-baseline justify-between gap-3">
                          <span className="text-[1.3rem] md:text-[1.5rem] font-medium tracking-[-0.02em] text-background">
                            {cat.name}
                          </span>
                          <span className="mono text-[0.68rem] uppercase tracking-[0.22em] text-background/80">
                            öffnen →
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* STATS + BIO teaser */}
      <section className="px-5 md:px-10 lg:px-16 py-12 md:py-16 lg:py-20 border-t border-rule bg-mist/40">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <ScrollReveal className="md:col-span-5">
            <p className="mono text-[0.72rem] uppercase tracking-[0.22em] text-accent mb-4">
              {copy.home.stats_eyebrow}
            </p>
            {hasStats ? (
              <dl className="grid grid-cols-2 gap-x-6 gap-y-6">
                {Object.entries(stats).map(([key, value]) => (
                  <div key={key} className="border-t border-rule pt-3">
                    <dt className="mono text-[0.66rem] uppercase tracking-[0.2em] text-muted mb-1">
                      {key}
                    </dt>
                    <dd className="text-xl md:text-2xl text-ink font-medium">{value}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="italic text-lg text-muted">{copy.home.stats_empty}</p>
            )}
          </ScrollReveal>

          <ScrollReveal className="md:col-span-6 md:col-start-7" delay={0.15}>
            <p className="mono text-[0.72rem] uppercase tracking-[0.22em] text-accent mb-4">
              {copy.home.about_eyebrow}
            </p>
            <p className={`text-base md:text-lg leading-relaxed ${hasBio ? "text-ink-soft" : "italic text-muted"}`}>
              {profile.bio ?? copy.home.about_empty}
            </p>
            <Link href="/about" className="hover-line inline-block mt-8 text-[0.92rem] font-medium text-accent">
              {copy.home.about_more} →
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
