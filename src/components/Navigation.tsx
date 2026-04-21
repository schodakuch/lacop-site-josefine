"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useProfile } from "@/context/ProfileContext";
import { copy } from "@/data/copy";

const ROUTES = [
  { href: "/", key: "home", label: copy.nav.home },
  { href: "/portfolio", key: "portfolio", label: copy.nav.portfolio },
  { href: "/about", key: "about", label: copy.nav.about },
  { href: "/contact", key: "contact", label: copy.nav.contact },
] as const;

export default function Navigation() {
  const profile = useProfile();
  const pathname = usePathname();
  const [drawer, setDrawer] = useState(false);

  const displayName = profile.display_name ?? profile.slug;
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  useEffect(() => setDrawer(false), [pathname]);
  useEffect(() => {
    if (!drawer) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawer(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [drawer]);

  return (
    <header
      className="sticky top-0 z-50 bg-background/85 backdrop-blur-md border-b border-rule"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="h-14 md:h-16 px-5 md:px-10 lg:px-16 flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2 min-w-0" aria-label={displayName}>
          <span className="h-2 w-2 rounded-full bg-accent shrink-0" aria-hidden />
          <span className="text-[0.98rem] md:text-[1.04rem] font-medium truncate">
            {displayName}
          </span>
        </Link>

        <nav aria-label="Hauptnavigation" className="hidden md:flex items-center gap-8">
          {ROUTES.map((r) => {
            const active = isActive(r.href);
            return (
              <Link
                key={r.key}
                href={r.href}
                aria-current={active ? "page" : undefined}
                className={`hover-line text-[0.92rem] font-medium transition-colors ${
                  active ? "text-accent" : "text-ink"
                }`}
              >
                {r.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={() => setDrawer((v) => !v)}
          aria-expanded={drawer}
          aria-controls="nav-drawer"
          className="md:hidden mono text-[0.7rem] uppercase tracking-[0.18em] text-ink min-h-11 min-w-11 px-2 flex items-center justify-center -mr-2"
        >
          {drawer ? copy.nav.close : copy.nav.menu}
        </button>
      </div>

      <div
        id="nav-drawer"
        className={`md:hidden transition-[max-height,opacity] duration-300 ${
          drawer
            ? "max-h-[calc(100vh-3.5rem)] opacity-100 border-t border-rule overflow-y-auto bg-mist/50"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <ol className="px-5 py-6 divide-y divide-rule">
          {ROUTES.map((r, i) => {
            const active = isActive(r.href);
            return (
              <li key={r.key}>
                <Link
                  href={r.href}
                  aria-current={active ? "page" : undefined}
                  className={`w-full flex items-baseline gap-5 py-4 min-h-14 text-left ${
                    active ? "text-accent" : "text-ink"
                  }`}
                >
                  <span className="mono text-[0.7rem] tracking-[0.18em] tabular-nums w-8 shrink-0 text-muted">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[1.2rem] font-medium">{r.label}</span>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </header>
  );
}
