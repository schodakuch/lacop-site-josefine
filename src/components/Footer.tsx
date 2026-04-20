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
    <footer className="border-t border-rule px-5 md:px-10 lg:px-16 mt-auto">
      <div className="py-8 md:py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6 text-[0.88rem] text-muted">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
          <span>© {year} {displayName}</span>
          <span className="hidden md:inline text-rule">·</span>
          <span>{copy.footer.rights}</span>
          <span className="hidden md:inline text-rule">·</span>
          <Link href="/impressum" className="hover-line text-ink-soft">
            {copy.footer.impressum}
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          {socials.map(([platform, url]) => {
            const safe = safeUrl(url);
            if (!safe) return null;
            return (
              <a
                key={platform}
                href={safe}
                target="_blank"
                rel="noopener noreferrer"
                className="hover-line text-ink-soft"
              >
                {getSocialLabel(platform)}
              </a>
            );
          })}
          <a
            href="#top"
            className="hover-line mono text-[0.72rem] uppercase tracking-[0.18em] text-ink-soft"
          >
            {copy.footer.top} ↑
          </a>
          <a
            href="https://lacop.app"
            target="_blank"
            rel="noopener noreferrer"
            className="mono text-[0.68rem] uppercase tracking-[0.16em] text-muted hover:text-ink-soft"
          >
            {copy.footer.made_with} <span className="text-ink-soft">LACOP</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
