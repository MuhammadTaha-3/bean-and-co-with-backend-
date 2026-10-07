"use client";

import { motion } from "motion/react";
import { Clock, Mail, MapPin, Quote, Star } from "lucide-react";
import { reviews } from "@/lib/coffee-data";
import { SectionHeading, easeOut } from "./motion-primitives";

export function Reviews() {
  return (
    <section id="reviews" className="relative overflow-hidden bg-primary py-24 text-primary-foreground lg:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: easeOut }}
            className="eyebrow text-primary-foreground/60"
          >
            Kind words
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, ease: easeOut, delay: 0.08 }}
            className="mt-3 text-4xl leading-[1.05] sm:text-5xl"
          >
            Loved by early risers and late thinkers
          </motion.h2>
        </div>

        <motion.ul
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ show: { transition: { staggerChildren: 0.13 } } }}
          className="mt-14 grid gap-5 md:grid-cols-3"
        >
          {reviews.map((r) => (
            <motion.li
              key={r.name}
              variants={{
                hidden: { opacity: 0, y: 32 },
                show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: easeOut } },
              }}
            >
              <motion.figure
                whileHover={{ y: -8, rotate: -0.6 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
                className="flex h-full flex-col rounded-4xl border border-primary-foreground/12 bg-primary-foreground/8 p-7 backdrop-blur"
              >
                <Quote className="size-7 text-accent" />
                <blockquote className="mt-4 flex-1 text-base leading-relaxed text-primary-foreground/90">
                  {r.quote}
                </blockquote>
                <div className="mt-6 flex items-center gap-1 text-accent">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} className="size-3.5 fill-current" />
                  ))}
                </div>
                <figcaption className="mt-3">
                  <p className="font-display text-lg">{r.name}</p>
                  <p className="text-xs text-primary-foreground/60">{r.role}</p>
                </figcaption>
              </motion.figure>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}

const contactItems = [
  { icon: MapPin, label: "Address", value: "Phase 6, Karachi", href: "https://www.google.com/maps/search/?api=1&query=Phase+6+Karachi" },
  { icon: Clock, label: "Hours", value: "Mon–Sat · 7:00 – 19:00" },
  { icon: Mail, label: "Email", value: "hello@beanandco.pk", href: "mailto:hello@beanandco.pk" },
];

export function Contact() {
  return (
    <section id="contact" className="py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          align="center"
          eyebrow="Visit or write"
          title="Come sit with us"
          copy="Two rooms, one long communal table, and a roaster humming in the back. Walk in any day we're open."
        />
        <motion.ul
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          variants={{ show: { transition: { staggerChildren: 0.12 } } }}
          className="mt-12 grid gap-5 md:grid-cols-3"
        >
          {contactItems.map(({ icon: Icon, label, value, href }) => (
            <motion.li
              key={label}
              variants={{
                hidden: { opacity: 0, y: 24 },
                show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: easeOut } },
              }}
              whileHover={{ y: -6 }}
              className="rounded-4xl border border-border/60 bg-card p-7 text-center shadow-soft transition-shadow hover:shadow-lift"
            >
              <span className="mx-auto grid size-12 place-items-center rounded-full bg-secondary">
                <Icon className="size-5 text-accent" />
              </span>
              <p className="eyebrow mt-4">{label}</p>
              {href ? (
                <a
                  href={href}
                  {...(href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
                  className="mt-1.5 block text-lg text-foreground underline-offset-4 hover:text-accent hover:underline"
                >
                  {value}
                </a>
              ) : (
                <p className="mt-1.5 text-lg text-foreground">{value}</p>
              )}
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
