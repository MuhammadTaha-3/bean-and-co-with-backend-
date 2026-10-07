// Admin session lives in an httpOnly cookie set by the server; these just call the API.
export async function adminLogin(email: string): Promise<string | null> {
  const res = await fetch("/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (res.ok) return null;
  return ((await res.json().catch(() => ({}))) as { error?: string }).error ?? "Login failed";
}
export const adminLogout = () => fetch("/api/admin/logout", { method: "POST" });
export async function hasAdminSession(): Promise<boolean> {
  try {
    const r = await fetch("/api/admin/session", { cache: "no-store" });
    return r.ok && ((await r.json()) as { admin: boolean }).admin;
  } catch {
    return false;
  }
}
