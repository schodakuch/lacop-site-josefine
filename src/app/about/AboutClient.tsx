"use client";

import Image from "next/image";
import type { Profile } from "@/lib/types";
import { copy } from "@/data/copy";
import ScrollReveal from "@/components/ScrollReveal";

type Props = { profile: Profile };

export default function AboutClient({ profile }: Props) {
  const displayName = profile.display_name ?? profile.slug;
  const [firstName] = displayName.split(" ");
  const portraitSrc = profile.profile_image_url ?? profile.hero_image_url;
  const stats = profile.stats ?? {};
  const hasStats = Object.keys(stats).length > 0;

  return (
    <>
      {/* Header */}
      <section className="px-6 lg:px-16 pt-10 lg:pt-24 pb-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold mb-4">
          {copy.about.title}
        </p>
        <h1 className="font-serif text-[clamp(3rem,14vw,9rem)] leading-[0.95] tracking-tight">
          {copy.about.over}
          <span className="serif-italic text-gold-dark">{firstName.toLowerCase()}</span>
        </h1>
      </section>

      {/* Bio + Image */}
      <section className="px-6 lg:px-16 py-12 lg:py-20 border-t border-gold-light/40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <ScrollReveal className="lg:col-span-5">
            <div className="relative aspect-[3/4] overflow-hidden bg-cream max-w-md mx-auto lg:mx-0">
              {portraitSrc && (
                <Image
                  src={portraitSrc}
                  alt={displayName}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              )}
            </div>
          </ScrollReveal>

          <ScrollReveal className="lg:col-span-7" delay={0.15}>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold mb-4">
              {copy.about.bio_heading}
            </p>
            <p
              className={`font-serif italic text-xl sm:text-2xl lg:text-3xl leading-snug mb-8 ${
                profile.bio ? "text-foreground/80" : "text-foreground/40"
              }`}
            >
              {profile.bio ?? copy.about.bio_empty}
            </p>
            {!profile.bio && (
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/40">
                {copy.about.bio_placeholder_note}
              </p>
            )}
            <p className="font-serif italic text-foreground/60 mt-8">
              — {copy.about.location}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Stats */}
      <section className="px-6 lg:px-16 py-12 lg:py-20 border-t border-gold-light/40 bg-cream/40">
        <ScrollReveal>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold mb-8">
            {copy.about.stats_heading}
          </p>
        </ScrollReveal>
        {hasStats ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-8">
            {Object.entries(stats).map(([key, value], i) => (
              <ScrollReveal key={key} delay={i * 0.05}>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/40 mb-2">
                    {key}
                  </p>
                  <p className="font-serif text-xl sm:text-2xl lg:text-3xl text-foreground border-t border-gold-light pt-3 break-words">
                    {value}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <p className="font-serif italic text-lg text-foreground/40">{copy.about.stats_empty}</p>
        )}
      </section>
    </>
  );
}
