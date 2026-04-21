"use client";

import Link from "next/link";
import { useProfile } from "@/context/ProfileContext";
import { copy } from "@/data/copy";
import { getSocialLabel, safeUrl } from "@/lib/utils";

export default function Footer() {
  const profile = useProfile();
  const year = new Date().getFullYear();
  const displayName = profile.display_name ?? profile.slug;
  const socials = Object.entries(profile.social_links ?? {}).filter(([, v]) => Boolean(v));

  return (
    <footer className="border-t border-gold-light/40 bg-cream/30 lg:pl-[88px] relative z-10">
      <div className="px-6 lg:px-16 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/50">
            © {year} · {displayName} · {copy.footer.rights}
          </p>
          <span className="text-foreground/20">|</span>
          <Link
            href="/impressum"
            className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/50 hover:text-gold-dark transition-colors"
          >
            {copy.footer.impressum}
          </Link>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-1">
          {socials.map(([platform, url]) => {
            const safe = safeUrl(url);
            if (!safe) return null;
            return (
              <a
                key={platform}
                href={safe}
                target="_blank"
                rel="noopener noreferrer"
                className="font-serif italic text-base text-gold-dark hover:text-gold transition-colors"
              >
                {getSocialLabel(platform)}
              </a>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
