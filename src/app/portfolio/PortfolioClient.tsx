"use client";

import Image from "next/image";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useMemo } from "react";
import { copy } from "@/data/copy";
import type { Category, Media } from "@/lib/types";

type Props = {
  categories: Category[];
  media: Media[];
};

export default function PortfolioClient({ categories, media }: Props) {
  const reduced = useReducedMotion();
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const active = params.get("category") ?? "";

  const setActive = useCallback(
    (slug: string) => {
      const url = slug ? `${pathname}?category=${slug}` : pathname;
      router.replace(url, { scroll: false });
    },
    [pathname, router],
  );

  const visible = useMemo(() => {
    if (!active) return media;
    const cat = categories.find((c) => c.slug === active);
    if (!cat) return media;
    return media.filter((m) => m.category_id === cat.id);
  }, [active, categories, media]);

  return (
    <>
      <section className="px-5 md:px-10 lg:px-16 pt-10 md:pt-16 pb-6 md:pb-10">
        <p className="mono text-[0.72rem] uppercase tracking-[0.22em] text-accent mb-3">
          {copy.portfolio.eyebrow}
        </p>
        <h1 className="font-medium tracking-[-0.02em] text-[clamp(2.2rem,7.5vw,5rem)] leading-[1] text-ink">
          {copy.portfolio.title}
        </h1>

        <div
          role="tablist"
          aria-label={copy.portfolio.title}
          className="mt-10 flex flex-wrap gap-2 sm:gap-3 border-t border-rule pt-5"
        >
          <FilterPill
            active={!active}
            onClick={() => setActive("")}
            label={copy.portfolio.filter_all}
          />
          {categories.map((cat) => (
            <FilterPill
              key={cat.slug}
              active={active === cat.slug}
              onClick={() => setActive(cat.slug)}
              label={cat.name}
            />
          ))}
        </div>
      </section>

      <section className="px-5 md:px-10 lg:px-16 pb-16 md:pb-24 lg:pb-28">
        {visible.length === 0 ? (
          <p className="mono text-[0.78rem] uppercase tracking-[0.22em] text-muted py-20 text-center">
            {copy.portfolio.empty}
          </p>
        ) : (
          <motion.ul layout className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
            {visible.map((item, i) => (
              <motion.li
                key={item.id}
                layout
                initial={reduced ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: (i % 6) * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="group"
              >
                <figure>
                  <div
                    className="relative overflow-hidden bg-mist-strong rounded-lg border border-rule"
                    style={{ aspectRatio: `${item.width ?? 4} / ${item.height ?? 5}` }}
                  >
                    <Image
                      src={item.url}
                      alt={item.title ?? ""}
                      fill
                      sizes="(min-width: 768px) 33vw, 50vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                  </div>
                  {item.photographer_credit && (
                    <figcaption className="mt-2 mono text-[0.62rem] uppercase tracking-[0.2em] text-muted">
                      © {item.photographer_credit}
                    </figcaption>
                  )}
                </figure>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </section>
    </>
  );
}

function FilterPill({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-[0.88rem] font-medium border transition-colors ${
        active
          ? "bg-ink text-background border-ink"
          : "border-rule text-ink-soft hover:border-accent hover:text-accent"
      }`}
    >
      {label}
    </button>
  );
}
