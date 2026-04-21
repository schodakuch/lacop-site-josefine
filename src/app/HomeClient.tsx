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

export default function HomeClient({ profile, media }: Props) {
  const reduced = useReducedMotion();
  const displayName = profile.display_name ?? profile.slug;
  const [firstName, ...rest] = displayName.split(" ");
  const lastName = rest.join(" ");

  const heroSrc = profile.hero_image_url || media[0]?.url || profile.profile_image_url;
  const featured = media.slice(0, 4);
  const hasBio = Boolean(profile.bio);

  return (
    <>
      {/* HERO */}
      <section className="px-6 lg:px-16 pt-10 lg:pt-24 pb-16 lg:pb-24">
        <motion.p
          initial={reduced ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold mb-6"
        >
          {profile.role} — Stuttgart
        </motion.p>

        <motion.h1
          initial={reduced ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-serif text-[clamp(3rem,14vw,9rem)] leading-[0.95] tracking-tight text-foreground"
        >
          {firstName}
          {lastName && (
            <>
              <br />
              <span className="serif-italic text-gold-dark">{lastName}</span>
            </>
          )}
        </motion.h1>

        <motion.div
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3"
        >
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-background bg-foreground px-6 py-3 hover:bg-gold-dark transition-colors"
          >
            {copy.home.view_all}
          </Link>
          <Link
            href="/contact"
            className="font-serif italic text-lg text-gold-dark hover:text-gold transition-colors"
          >
            {copy.home.get_in_touch} →
          </Link>
        </motion.div>

        {heroSrc && (
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="relative aspect-[4/5] sm:aspect-[16/10] lg:aspect-[21/9] mt-12 lg:mt-16 overflow-hidden bg-cream"
          >
            <Image
              src={heroSrc}
              alt={displayName}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </motion.div>
        )}
      </section>

      {/* FEATURED WORK */}
      {featured.length > 0 && (
        <section className="px-6 lg:px-16 py-16 lg:py-24 border-t border-gold-light/40">
          <ScrollReveal>
            <div className="flex items-end justify-between gap-4 mb-10 lg:mb-14">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold mb-2">
                  {copy.home.featured}
                </p>
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl tracking-tight">
                  {copy.home.featured_sub}
                </h2>
              </div>
              <Link
                href="/portfolio"
                className="hidden sm:inline-block font-serif italic text-lg text-gold-dark hover:text-gold transition-colors flex-shrink-0"
              >
                {copy.home.view_all} →
              </Link>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-5">
            {featured.map((item, i) => (
              <ScrollReveal key={item.id} delay={i * 0.08}>
                <Link href="/portfolio" className="group block">
                  <div className="relative aspect-[3/4] overflow-hidden bg-cream">
                    <Image
                      src={item.url}
                      alt={item.title ?? `${displayName} — ${String(i + 1).padStart(2, "0")}`}
                      fill
                      sizes="(max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                  </div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/40 mt-3">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                </Link>
              </ScrollReveal>
            ))}
          </div>

          <Link
            href="/portfolio"
            className="sm:hidden mt-8 inline-block font-serif italic text-lg text-gold-dark"
          >
            {copy.home.view_all} →
          </Link>
        </section>
      )}

      {/* ABOUT TEASER */}
      <section className="px-6 lg:px-16 py-16 lg:py-24 border-t border-gold-light/40 bg-cream/40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 lg:items-center">
          {profile.profile_image_url && (
            <ScrollReveal className="lg:col-span-5">
              <div className="relative aspect-[3/4] overflow-hidden bg-cream max-w-md mx-auto lg:mx-0">
                <Image
                  src={profile.profile_image_url}
                  alt={displayName}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
            </ScrollReveal>
          )}

          <ScrollReveal className="lg:col-span-7" delay={0.15}>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold mb-3">
              {copy.home.about_teaser}
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl tracking-tight mb-6">
              {firstName}{" "}
              {lastName && <span className="serif-italic text-gold-dark">{lastName}</span>}
            </h2>
            <p className={`font-serif italic text-base lg:text-lg mb-8 ${hasBio ? "text-foreground/70" : "text-foreground/40"}`}>
              {profile.bio ?? copy.about.bio_empty}
            </p>
            <Link
              href="/about"
              className="font-serif italic text-lg text-gold-dark hover:text-gold transition-colors"
            >
              {copy.home.read_more} →
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
