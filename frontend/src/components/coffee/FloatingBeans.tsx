"use client";

import { motion, useReducedMotion } from "motion/react";

const beans = [
  { top: "12%", left: "6%", size: 26, delay: 0, dur: 9, rot: -18 },
  { top: "28%", left: "44%", size: 16, delay: 1.2, dur: 11, rot: 24 },
  { top: "68%", left: "12%", size: 20, delay: 0.6, dur: 10, rot: 8 },
  { top: "80%", left: "52%", size: 14, delay: 2, dur: 12, rot: -30 },
  { top: "48%", left: "88%", size: 22, delay: 1.6, dur: 10.5, rot: 16 },
  { top: "8%", left: "72%", size: 15, delay: 0.9, dur: 13, rot: -10 },
];

function Bean({ size }: { size: number }) {
  return (
    <svg width={size} height={size * 1.35} viewBox="0 0 24 32" aria-hidden="true">
      <ellipse cx="12" cy="16" rx="11" ry="15.5" fill="oklch(0.36 0.07 45)" />
      <path
        d="M12 2c-4 6-4 22 0 28M12 2c4 6 4 22 0 28"
        stroke="oklch(0.24 0.05 42)"
        strokeWidth="1.6"
        fill="none"
      />
      <ellipse cx="8" cy="9" rx="3" ry="4.5" fill="oklch(0.46 0.08 50 / 0.5)" />
    </svg>
  );
}

export function FloatingBeans() {
  const reduce = useReducedMotion();
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {beans.map((b, i) => (
        <motion.div
          key={i}
          className="absolute opacity-25 will-change-transform"
          style={{ top: b.top, left: b.left }}
          animate={
            reduce
              ? { y: 0, rotate: b.rot, opacity: 0.22 }
              : { y: [0, -26, 0], rotate: [b.rot, b.rot + 22, b.rot], opacity: [0.18, 0.32, 0.18] }
          }
          transition={{ duration: b.dur, delay: b.delay, repeat: Infinity, ease: "easeInOut" }}
        >
          <Bean size={b.size} />
        </motion.div>
      ))}
    </div>
  );
}

export function Steam({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();
  return (
    <div aria-hidden="true" className={`pointer-events-none flex gap-3 ${className}`}>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="block h-24 w-[6px] rounded-full bg-gradient-to-t from-transparent via-foreground/15 to-transparent blur-[2px]"
          animate={
            reduce ? { opacity: 0 } : { y: [10, -34], opacity: [0, 0.85, 0], scaleX: [0.7, 1.5, 0.7] }
          }
          transition={{ duration: 4.2, delay: i * 0.7, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}
