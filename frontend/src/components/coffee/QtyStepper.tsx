"use client";

import { AnimatePresence, motion } from "motion/react";
import { Minus, Plus } from "lucide-react";

export function QtyStepper({
  value,
  onInc,
  onDec,
  max = 99,
  min = 0,
  label = "item",
  compact = false,
}: {
  value: number;
  onInc: () => void;
  onDec: () => void;
  max?: number;
  min?: number;
  label?: string;
  compact?: boolean;
}) {
  const btn = compact ? "size-7" : "size-8";
  return (
    <div className="inline-flex items-center gap-0.5 rounded-full border border-border bg-card p-0.5">
      <motion.button
        type="button"
        whileTap={{ scale: 0.82 }}
        onClick={onDec}
        disabled={value <= min}
        aria-label={`Decrease ${label} quantity`}
        className={`grid ${btn} place-items-center rounded-full transition-colors hover:bg-secondary disabled:opacity-35`}
      >
        <Minus className="size-3.5" />
      </motion.button>
      <span className="relative grid h-7 w-7 place-items-center overflow-hidden text-sm font-semibold tabular-nums" aria-live="polite">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={value}
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 32 }}
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </span>
      <motion.button
        type="button"
        whileTap={{ scale: 0.82 }}
        onClick={onInc}
        disabled={value >= max}
        aria-label={`Increase ${label} quantity`}
        className={`grid ${btn} place-items-center rounded-full transition-colors hover:bg-secondary disabled:opacity-35`}
      >
        <Plus className="size-3.5" />
      </motion.button>
    </div>
  );
}
