"use client";

import { useState } from "react";
import type { Profile } from "@/lib/types";
import { getSocialLabel, safeUrl } from "@/lib/utils";
import { copy } from "@/data/copy";
import ScrollReveal from "@/components/ScrollReveal";

type Props = { profile: Profile };

// Josi-supplied booking email (2026-04-21). Overrides the default
// `hello@<domain>` derivation until the LACOP `public_profiles` shape
// adds a `contact_email` column; at that point this override goes away
// and the email flows from the profile row like every other field.
const BOOKING_EMAIL = "Cooperation-Josi.Gulden@outlook.com";

export default function ContactClient({ profile }: Props) {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const email = BOOKING_EMAIL;
  const socials = Object.entries(profile.social_links ?? {}).filter(([, v]) => Boolean(v));

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "");
    const from = String(data.get("email") ?? "");
    const subject = String(data.get("subject") ?? "");
    const message = String(data.get("message") ?? "");
    const body = `${message}\n\n—\n${name}${from ? ` <${from}>` : ""}`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setTimeout(() => {
      setSent(true);
      setSubmitting(false);
    }, 300);
  }

  return (
    <>
      <section className="px-5 md:px-10 lg:px-16 pt-10 md:pt-16 pb-8 md:pb-12">
        <p className="mono text-[0.72rem] uppercase tracking-[0.22em] text-accent mb-3">
          {copy.contact.eyebrow}
        </p>
        <h1 className="font-medium tracking-[-0.02em] text-[clamp(2.2rem,7.5vw,5rem)] leading-[1] text-ink">
          {copy.contact.title}
        </h1>
        <p className="text-lg md:text-xl text-ink-soft mt-6 max-w-xl">
          {copy.contact.subtitle}
        </p>
      </section>

      <section className="px-5 md:px-10 lg:px-16 py-12 md:py-16 lg:py-20 border-t border-rule">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
          <ScrollReveal className="md:col-span-5 space-y-10">
            <div>
              <p className="mono text-[0.68rem] uppercase tracking-[0.2em] text-muted mb-2">
                {copy.contact.form.email}
              </p>
              <a
                href={`mailto:${email}`}
                className="hover-line text-xl md:text-2xl text-ink font-medium break-all"
              >
                {email}
              </a>
            </div>

            {socials.length > 0 && (
              <div>
                <p className="mono text-[0.68rem] uppercase tracking-[0.2em] text-muted mb-3">
                  {copy.contact.follow_heading}
                </p>
                <ul className="flex flex-wrap gap-x-5 gap-y-2">
                  {socials.map(([platform, url]) => {
                    const safe = safeUrl(url);
                    if (!safe) return null;
                    return (
                      <li key={platform}>
                        <a
                          href={safe}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover-line text-lg text-accent font-medium"
                        >
                          {getSocialLabel(platform)}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </ScrollReveal>

          <ScrollReveal className="md:col-span-7" delay={0.15}>
            {sent ? (
              <div className="py-12 text-center">
                <p className="text-5xl sm:text-6xl text-accent mb-6">✓</p>
                <p className="text-xl md:text-2xl text-ink">{copy.contact.form.sent}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Field name="name" label={copy.contact.form.name} required />
                  <Field name="email" type="email" label={copy.contact.form.email} required />
                </div>
                <Field name="subject" label={copy.contact.form.subject} required />
                <Field name="message" label={copy.contact.form.message} required textarea />
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 text-[0.92rem] font-medium text-background bg-ink px-6 py-3 hover:bg-accent transition-colors rounded-full disabled:opacity-60"
                >
                  {submitting ? copy.contact.form.sending : copy.contact.form.send}
                </button>
              </form>
            )}
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}

function Field({
  name,
  label,
  type = "text",
  required,
  textarea,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  textarea?: boolean;
}) {
  return (
    <label className="block">
      <span className="block mono text-[0.68rem] uppercase tracking-[0.2em] text-muted mb-2">
        {label}
      </span>
      {textarea ? (
        <textarea
          name={name}
          required={required}
          rows={5}
          className="w-full bg-transparent border-0 border-b border-rule focus:border-accent pb-2 outline-none text-ink text-lg transition-colors resize-none"
        />
      ) : (
        <input
          name={name}
          type={type}
          required={required}
          className="w-full bg-transparent border-0 border-b border-rule focus:border-accent pb-2 outline-none text-ink text-lg transition-colors"
        />
      )}
    </label>
  );
}
