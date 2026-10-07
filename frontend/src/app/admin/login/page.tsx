"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { adminLogin, hasAdminSession } from "@/lib/admin/auth";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    void hasAdminSession().then((yes) => yes && router.replace("/admin"));
  }, [router]);

  return (
    <div className="grid min-h-screen place-items-center bg-espresso p-4">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const err = await adminLogin(email);
          if (err) setError(err);
          else router.replace("/admin");
        }}
        className="w-full max-w-sm rounded-3xl bg-card p-8 shadow-lift"
      >
        <h1 className="font-display text-3xl">Admin sign in</h1>
        <p className="mt-1 text-sm text-muted-foreground">Enter the authorized admin email.</p>
        <input
          type="email"
          required
          autoFocus
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
          placeholder="you@beanandco.pk"
          className="mt-6 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
        {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
        <button className="btn-ember mt-5 w-full rounded-full px-6 py-3 text-sm font-semibold">
          Continue
        </button>
      </form>
    </div>
  );
}
