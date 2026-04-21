"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { Category, Media } from "@/lib/types";
import { copy } from "@/data/copy";

type Props = {
  categories: Category[];
  media: Media[];
};

export default function PortfolioClient({ media }: Props) {
  const reduced = useReducedMotion();

  return (
    <>
      {/* Header */}
      <section className="px-6 lg:px-16 pt-10 lg:pt-24 pb-10 lg:pb-12">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold mb-4">
          {copy.portfolio.title}
        </p>
        <h1 className="font-serif text-[clamp(3rem,14vw,9rem)] leading-[0.95] tracking-tight">
          {copy.portfolio.the}
          <span className="serif-italic text-gold-dark">{copy.portfolio.title.toLowerCase()}</span>
        </h1>
        <div className="mt-10 border-t border-gold-light/40" />
      </section>

      {/* Gallery */}
      <section className="px-6 lg:px-16 pb-24">
        {media.length === 0 ? (
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/40 py-20 text-center">
            {copy.portfolio.empty}
          </p>
        ) : (
          <motion.div layout className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-5">
            {media.map((item, i) => (
              <motion.figure
                key={item.id}
                layout
                initial={reduced ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: (i % 6) * 0.05 }}
                className="group"
              >
                <div
                  className="relative overflow-hidden bg-cream"
                  style={{ aspectRatio: `${item.width ?? 3} / ${item.height ?? 4}` }}
                >
                  <Image
                    src={item.url}
                    alt={item.title ?? `Josefine Gulden — ${String(i + 1).padStart(2, "0")}`}
                    fill
                    sizes="(max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                </div>
                <figcaption className="mt-3">
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/40">
                    {item.title ?? String(i + 1).padStart(2, "0")}
                  </p>
                </figcaption>
              </motion.figure>
            ))}
          </motion.div>
        )}
      </section>
    </>
  );
}
