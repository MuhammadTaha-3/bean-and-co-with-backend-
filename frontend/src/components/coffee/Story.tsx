"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
const story = "/images/story.jpg";
import { Reveal, SectionHeading, easeOut } from "./motion-primitives";

const stats = [
  { value: "48h", label: "From roast to cup" },
  { value: "12", label: "Single-origin lots" },
  { value: "1978", label: "Roasting since" },
];

export function Story() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : -40, reduce ? 0 : 40]);

  return (
    <section id="story" className="py-24 lg:py-32">
      <div ref={ref} className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <div className="relative overflow-hidden rounded-4xl shadow-lift">
            <motion.img
              src={story}
              alt="Barista pouring latte art in the Bean & Co roastery"
              loading="lazy"
              width={1200}
              height={912}
              style={{ y: imgY }}
              className="aspect-[4/3] w-full scale-110 object-cover will-change-transform"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-espresso/45 to-transparent" />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: easeOut, delay: 0.2 }}
              className="absolute bottom-5 left-5 rounded-2xl bg-card/90 px-5 py-4 backdrop-blur"
            >
              <p className="font-display text-lg">Roasted in-house</p>
              <p className="text-xs text-muted-foreground">Small batches, every Tuesday</p>
            </motion.div>
          </div>
        </Reveal>

        <div>
          <SectionHeading
            eyebrow="Our story"
            title="Four decades of chasing one perfect cup"
            copy="Bean & Co started as a single drum roaster in a back room. We still buy from the same three families, still cup every lot by hand, and still refuse to sell a shot we wouldn't drink ourselves."
          />
          <Reveal delay={0.1}>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Everything is built around slowness: longer fermentation, gentler roast curves,
              milk textured to order. The result is coffee that tastes like a place, not a formula.
            </p>
          </Reveal>

          <motion.dl
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            variants={{ show: { transition: { staggerChildren: 0.12 } } }}
            className="mt-10 grid grid-cols-3 gap-4"
          >
            {stats.map((s) => (
              <motion.div
                key={s.label}
                variants={{
                  hidden: { opacity: 0, y: 22 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
                }}
                className="rounded-3xl border border-border/60 bg-card p-5 shadow-soft"
              >
                <dt className="font-display text-3xl text-accent">{s.value}</dt>
                <dd className="mt-1 text-xs leading-snug text-muted-foreground">{s.label}</dd>
              </motion.div>
            ))}
          </motion.dl>
        </div>
      </div>
    </section>
  );
}
