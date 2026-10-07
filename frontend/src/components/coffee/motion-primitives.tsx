"use client";

import { animate, motion, useMotionValue, useReducedMotion, type Variants } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";
import { formatPrice } from "@/lib/coffee-data";

export const easeOut = [0.22, 1, 0.36, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeOut } },
};

export const stagger = (delay = 0.08): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: delay, delayChildren: 0.05 } },
});

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className ?? ""}
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      variants={{
        hidden: { opacity: 0, y: 28 },
        show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: easeOut, delay } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  copy,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  copy?: string;
  align?: "left" | "center";
}) {
  return (
    <Reveal className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-3 text-4xl leading-[1.05] text-foreground sm:text-5xl">{title}</h2>
      {copy && <p className="mt-4 text-base leading-relaxed text-muted-foreground">{copy}</p>}
    </Reveal>
  );
}

/** Price that counts smoothly to its new value (Motion `animate` + motion value). */
export function AnimatedPrice({ value, className }: { value: number; className?: string }) {
  const reduce = useReducedMotion();
  const mv = useMotionValue(value);
  const [text, setText] = useState(formatPrice(value));

  useEffect(() => {
    if (reduce) {
      setText(formatPrice(value));
      return;
    }
    const controls = animate(mv, value, { duration: 0.55, ease: easeOut });
    const off = mv.on("change", (v) => setText(formatPrice(v)));
    return () => {
      controls.stop();
      off();
    };
  }, [value, reduce, mv]);

  return <span className={className}>{text}</span>;
}
