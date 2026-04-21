"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { Profile } from "@/lib/types";
import { copy } from "@/data/copy";
import { getSocialLabel, safeUrl } from "@/lib/utils";
import ScrollReveal from "@/components/ScrollReveal";

type Props = { profile: Profile };

// Josi-supplied booking email (2026-04-21). Overrides the default
// `hello@<domain>` derivation until the LACOP `public_profiles` shape
// adds a `contact_email` column.
const BOOKING_EMAIL = "Cooperation-Josi.Gulden@outlook.com";

export default function ContactClient({ profile }: Props) {
  const reduced = useReducedMotion();
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
      {/* Header */}
      <section className="px-6 lg:px-16 pt-10 lg:pt-24 pb-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold mb-4">
          {copy.contact.title}
        </p>
        <h1 className="font-serif text-[clamp(3rem,14vw,9rem)] leading-[0.95] tracking-tight">
          {copy.contact.lets_talk_lead}
          <span className="serif-italic text-gold-dark">{copy.contact.lets_talk_tail}</span>
        </h1>
        <p className="font-serif italic text-lg sm:text-xl text-foreground/60 mt-6 max-w-xl">
          {copy.contact.subtitle}
        </p>
      </section>

      <section className="px-6 lg:px-16 py-12 lg:py-20 border-t border-gold-light/40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          {/* INFO */}
          <ScrollReveal className="lg:col-span-5">
            <div className="space-y-8">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/40 mb-2">
                  {copy.contact.form.email}
                </p>
                <a
                  href={`mailto:${email}`}
                  className="font-serif italic text-xl sm:text-2xl text-foreground hover:text-gold-dark transition-colors break-all"
                >
                  {email}
                </a>
              </div>

              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/40 mb-2">
                  {copy.contact.location_heading}
                </p>
                <p className="font-serif text-xl sm:text-2xl text-foreground">
                  {copy.about.location}
                </p>
              </div>

              {socials.length > 0 && (
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/40 mb-3">
                    {copy.contact.follow_heading}
                  </p>
                  <div className="flex flex-wrap gap-x-5 gap-y-2">
                    {socials.map(([platform, url]) => {
                      const safe = safeUrl(url);
                      if (!safe) return null;
                      return (
                        <a
                          key={platform}
                          href={safe}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-serif italic text-lg text-gold-dark hover:text-gold transition-colors"
                        >
                          {getSocialLabel(platform)}
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </ScrollReveal>

          {/* FORM */}
          <ScrollReveal className="lg:col-span-7" delay={0.15}>
            {sent ? (
              <motion.div
                initial={reduced ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <p className="font-serif text-6xl text-gold mb-6">✓</p>
                <p className="font-serif italic text-xl sm:text-2xl text-foreground">{copy.contact.form.sent}</p>
              </motion.div>
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
                  className="inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-background bg-foreground px-6 py-3 hover:bg-gold-dark transition-colors disabled:opacity-60"
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
      <span className="block font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/40 mb-2">
        {label}
      </span>
      {textarea ? (
        <textarea
          name={name}
          required={required}
          rows={5}
          className="w-full bg-transparent border-0 border-b border-foreground/20 focus:border-gold pb-2 outline-none text-foreground font-serif text-lg transition-colors resize-none"
        />
      ) : (
        <input
          name={name}
          type={type}
          required={required}
          className="w-full bg-transparent border-0 border-b border-foreground/20 focus:border-gold pb-2 outline-none text-foreground font-serif text-lg transition-colors"
        />
      )}
    </label>
  );
}
