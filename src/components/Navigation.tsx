"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProfile } from "@/context/ProfileContext";
import { copy } from "@/data/copy";

const navItems = [
  { href: "/", key: "home", label: copy.nav.home, num: "01" },
  { href: "/portfolio", key: "portfolio", label: copy.nav.portfolio, num: "02" },
  { href: "/about", key: "about", label: copy.nav.about, num: "03" },
  { href: "/contact", key: "contact", label: copy.nav.contact, num: "04" },
] as const;

export default function Navigation() {
  const profile = useProfile();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const displayName = profile.display_name ?? profile.slug;
  const [firstName, ...rest] = displayName.split(" ");
  const lastName = rest.join(" ");

  useEffect(() => setMobileOpen(false), [pathname]);

  return (
    <>
      {/* DESKTOP — Vertical Sidebar Spine */}
      <aside
        aria-label="Site brand"
        className="hidden lg:flex fixed left-0 top-0 bottom-0 w-[88px] z-40 border-r border-gold-light/40 bg-background/80 backdrop-blur-sm flex-col items-center justify-between py-8"
      >
        <Link href="/" className="group" aria-label={displayName}>
          <div className="vertical-text font-serif text-xl tracking-[0.2em] text-foreground">
            {firstName.toUpperCase()}
            <span className="text-gold"> · </span>
            {lastName.toUpperCase()}
          </div>
        </Link>

        <div className="flex flex-col items-center gap-6">
          <div className="w-[1px] h-12 bg-gold-light/60" />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold rotate-90 origin-center">
            {firstName[0]}{lastName[0]}
          </span>
          <div className="w-[1px] h-12 bg-gold-light/60" />
        </div>

        <div className="w-[1px] h-6 bg-gold-light/40" aria-hidden />
      </aside>

      {/* DESKTOP — Floating nav top right */}
      <nav aria-label="Hauptnavigation" className="hidden lg:flex fixed top-8 right-10 z-40 items-start gap-8">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(`${item.href}/`));
          return (
            <Link key={item.href} href={item.href} className="group flex flex-col items-end">
              <span className="font-mono text-[10px] tracking-[0.2em] text-gold mb-1">{item.num}</span>
              <span
                className={`font-serif text-base tracking-wide transition-all ${
                  isActive ? "italic text-gold-dark" : "text-foreground/60 group-hover:text-foreground"
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="nav-underline"
                  className="h-[1px] w-full bg-gold mt-1"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* MOBILE — top bar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-gold-light/40">
        <div className="px-6 h-[64px] flex items-center justify-between">
          <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-baseline gap-1" aria-label={displayName}>
            <span className="font-serif text-2xl tracking-wide">{firstName}</span>
            {lastName && (
              <span className="font-serif italic text-xl text-gold">
                {lastName[0].toLowerCase()}.
              </span>
            )}
          </Link>
          <button
            className="relative w-9 h-9 flex items-center justify-center"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? copy.nav.close : copy.nav.menu}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
          >
            <motion.span
              className="absolute w-6 h-[1.5px] bg-foreground"
              animate={mobileOpen ? { rotate: 45, y: 0 } : { rotate: 0, y: -5 }}
              transition={{ duration: 0.3 }}
            />
            <motion.span
              className="absolute w-6 h-[1.5px] bg-foreground"
              animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
            <motion.span
              className="absolute w-6 h-[1.5px] bg-foreground"
              animate={mobileOpen ? { rotate: -45, y: 0 } : { rotate: 0, y: 5 }}
              transition={{ duration: 0.3 }}
            />
          </button>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.nav
              id="mobile-nav"
              aria-label="Hauptnavigation"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden border-t border-gold-light/40 bg-background"
            >
              <div className="px-6 py-10 flex flex-col gap-6">
                {navItems.map((item, i) => {
                  const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(`${item.href}/`));
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className="group flex items-baseline gap-4"
                      >
                        <span className="font-mono text-[10px] text-gold tracking-widest">{item.num}</span>
                        <span
                          className={`font-serif text-4xl tracking-tight ${
                            isActive ? "italic text-gold-dark" : "text-foreground/80"
                          }`}
                        >
                          {item.label}
                        </span>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
