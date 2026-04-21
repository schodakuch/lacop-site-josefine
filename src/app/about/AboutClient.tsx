"use client";

import Image from "next/image";
import type { Profile } from "@/lib/types";
import { safeUrl } from "@/lib/utils";
import { copy } from "@/data/copy";
import ScrollReveal from "@/components/ScrollReveal";

type Props = { profile: Profile };

export default function AboutClient({ profile }: Props) {
  const displayName = profile.display_name ?? profile.slug;
  const portraitSrc = profile.profile_image_url ?? profile.hero_image_url;
  const stats = profile.stats ?? {};
  const hasStats = Object.keys(stats).length > 0;
  const agencies = profile.agencies ?? [];
  const links = profile.custom_links ?? [];

  return (
    <>
      <section className="px-5 md:px-10 lg:px-16 pt-10 md:pt-16 pb-8 md:pb-12">
        <p className="mono text-[0.72rem] uppercase tracking-[0.22em] text-accent mb-3">
          {copy.about.eyebrow}
        </p>
        <h1 className="font-medium tracking-[-0.02em] text-[clamp(2.2rem,7.5vw,5rem)] leading-[1] text-ink">
          {copy.about.title}
        </h1>
      </section>

      <section className="px-5 md:px-10 lg:px-16 py-10 md:py-16 border-t border-rule">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          <ScrollReveal className="md:col-span-5">
            <div className="relative aspect-[3/4] overflow-hidden bg-mist-strong rounded-sm border border-rule max-w-md mx-auto md:mx-0">
              {portraitSrc ? (
                <Image
                  src={portraitSrc}
                  alt={displayName}
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
              ) : (
                <div className="slot" />
              )}
            </div>
          </ScrollReveal>

          <ScrollReveal className="md:col-span-7" delay={0.15}>
            <p className="mono text-[0.72rem] uppercase tracking-[0.22em] text-accent mb-4">
              {copy.about.bio_heading}
            </p>
            <p
              className={`text-lg md:text-xl leading-relaxed ${
                profile.bio ? "text-ink-soft" : "italic text-muted"
              }`}
            >
              {profile.bio ?? copy.about.bio_empty}
            </p>
            {profile.about && (
              <p className="mt-6 text-base md:text-lg text-ink-soft leading-relaxed whitespace-pre-line">
                {profile.about}
              </p>
            )}
            <p className="mt-6 mono text-[0.7rem] uppercase tracking-[0.22em] text-muted">
              — {copy.about.location}
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="px-5 md:px-10 lg:px-16 py-12 md:py-16 border-t border-rule bg-mist/40">
        <p className="mono text-[0.72rem] uppercase tracking-[0.22em] text-accent mb-6 md:mb-8">
          {copy.about.stats_heading}
        </p>
        {hasStats ? (
          <dl className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-6 gap-y-8">
            {Object.entries(stats).map(([key, value]) => (
              <div key={key} className="border-t border-rule pt-3">
                <dt className="mono text-[0.66rem] uppercase tracking-[0.2em] text-muted mb-2">
                  {key}
                </dt>
                <dd className="text-xl md:text-2xl lg:text-3xl text-ink font-medium">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="italic text-lg text-muted">{copy.about.stats_empty}</p>
        )}
      </section>

      {(agencies.length > 0 || links.length > 0) && (
        <section className="px-5 md:px-10 lg:px-16 py-12 md:py-16 border-t border-rule">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            {agencies.length > 0 && (
              <div className="md:col-span-6">
                <p className="mono text-[0.72rem] uppercase tracking-[0.22em] text-accent mb-4">
                  {copy.about.agencies_heading}
                </p>
                <ul className="space-y-3">
                  {agencies.map((a) => {
                    const url = a.url ? safeUrl(a.url) : null;
                    return (
                      <li key={a.name} className="border-t border-rule pt-3 flex items-baseline gap-3">
                        {url ? (
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover-line text-lg text-ink font-medium"
                          >
                            {a.name}
                          </a>
                        ) : (
                          <span className="text-lg text-ink font-medium">{a.name}</span>
                        )}
                        {a.city && (
                          <span className="mono text-[0.68rem] uppercase tracking-[0.2em] text-muted">
                            {a.city}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {links.length > 0 && (
              <div className="md:col-span-6">
                <p className="mono text-[0.72rem] uppercase tracking-[0.22em] text-accent mb-4">
                  {copy.about.links_heading}
                </p>
                <ul className="space-y-3">
                  {links.map((l) => {
                    const url = safeUrl(l.url);
                    if (!url) return null;
                    return (
                      <li key={l.label} className="border-t border-rule pt-3">
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover-line text-lg text-ink font-medium"
                        >
                          {l.label}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
}
