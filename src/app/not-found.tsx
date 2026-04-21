import Link from "next/link";
import { copy } from "@/data/copy";

export default function NotFound() {
  return (
    <section className="px-5 md:px-8 max-w-[1280px] mx-auto pt-32 md:pt-40 pb-24 md:pb-32">
      <p className="mono text-[0.64rem] uppercase tracking-[0.22em] text-muted">404</p>
      <h1 className="mt-3 text-[clamp(2.2rem,6vw,3.8rem)] tracking-[-0.02em] font-light">
        {copy.notfound.heading}
      </h1>
      <p className="mt-5 text-[1rem] leading-relaxed text-ink-soft">{copy.notfound.body}</p>
      <div className="mt-8">
        <Link href="/" className="text-[0.95rem] font-medium text-ink hover-line hover:text-accent transition-colors">
          ← {copy.notfound.home}
        </Link>
      </div>
    </section>
  );
}
