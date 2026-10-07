"use client";

import type { InputHTMLAttributes, ReactNode } from "react";

export const inputClass =
  "w-full rounded-2xl border border-input bg-card px-4 py-3 text-base text-foreground sm:text-sm outline-none transition-shadow placeholder:text-muted-foreground/70 focus:border-accent focus:ring-4 focus:ring-accent/15 aria-[invalid=true]:border-destructive";

export function Field({
  label,
  error,
  children,
  className = "",
}: {
  label: string;
  error?: string | undefined;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      {children}
      {error && (
        <span role="alert" className="mt-1.5 block text-xs font-medium text-destructive">
          {error}
        </span>
      )}
    </label>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputClass} ${props.className ?? ""}`} />;
}
