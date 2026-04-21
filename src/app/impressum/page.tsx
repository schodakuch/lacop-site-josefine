import type { Metadata } from "next";
import { copy } from "@/data/copy";

export const metadata: Metadata = {
  title: "Impressum",
  alternates: { canonical: "/impressum" },
  robots: { index: false, follow: true },
};

export default function ImpressumPage() {
  return (
    <section className="px-6 lg:px-16 pt-10 lg:pt-24 pb-24 max-w-3xl">
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold mb-4">
        {copy.footer.impressum}
      </p>
      <h1 className="font-serif text-[clamp(3rem,14vw,9rem)] leading-[0.95] tracking-tight">
        <span className="serif-italic text-gold-dark">{copy.impressum.title.toLowerCase()}</span>
      </h1>
      <p className="font-serif italic text-xl sm:text-2xl text-foreground/60 mt-10">
        {copy.impressum.placeholder}
      </p>
    </section>
  );
}
