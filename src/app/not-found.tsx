import Link from "next/link";
import { copy } from "@/data/copy";

export default function NotFound() {
  return (
    <section className="px-6 lg:px-16 pt-20 lg:pt-32 pb-24 max-w-3xl">
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold mb-4">404</p>
      <h1 className="font-serif text-[clamp(3rem,14vw,9rem)] leading-[0.95] tracking-tight">
        <span className="serif-italic text-gold-dark">{copy.notfound.heading.toLowerCase()}</span>
      </h1>
      <p className="font-serif italic text-xl text-foreground/60 mt-6 max-w-xl">
        {copy.notfound.body}
      </p>
      <div className="mt-10">
        <Link
          href="/"
          className="font-serif italic text-lg text-gold-dark hover:text-gold transition-colors"
        >
          ← {copy.notfound.home}
        </Link>
      </div>
    </section>
  );
}
