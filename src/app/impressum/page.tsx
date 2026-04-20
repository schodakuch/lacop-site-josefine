import type { Metadata } from "next";
import { copy } from "@/data/copy";

export const metadata: Metadata = {
  title: "Impressum",
  alternates: { canonical: "/impressum" },
  robots: { index: false, follow: true },
};

export default function ImpressumPage() {
  return (
    <section className="px-5 md:px-10 lg:px-16 pt-10 md:pt-16 pb-24 max-w-3xl">
      <p className="mono text-[0.72rem] uppercase tracking-[0.22em] text-accent mb-3">
        {copy.footer.impressum}
      </p>
      <h1 className="font-medium tracking-[-0.02em] text-[clamp(2.4rem,8vw,5rem)] leading-[0.95] text-ink">
        {copy.impressum.title}
      </h1>
      <p className="italic text-xl md:text-2xl text-muted mt-10">{copy.impressum.placeholder}</p>
    </section>
  );
}
