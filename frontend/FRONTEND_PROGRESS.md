# Frontend progress

## Migrated to Next.js (App Router)
- TanStack Start / Vite / Lovable tooling removed; `next`, `@tailwindcss/postcss` added.
- File routes → `src/app/**/page.tsx` (with `metadata`), page bodies in `src/components/pages`.
- `next/link`, `next/navigation`, `next/font/google` (Fraunces + DM Sans).
- Images moved to `public/images` and referenced by URL string (backend-friendly).
- localStorage keys renamed to `bc2_*` (old keys held Vite asset URLs).

## Features
- Cart: persistence, per-size lines, stock caps, promo codes (`BEAN10`, `WELCOME15`), free-delivery bar, drawer + `/cart` page.
- `/products`, `/products/[id]`, `/wishlist`, `/checkout`, `/order-confirmation/[id]`, responsive on mobile.
- Landing page and theme unchanged. Login/accounts removed by request; Contact shows address, hours, email only.

## Next
- Backend: Route Handlers under `src/app/api/**` + swap `src/lib/store/repo.ts` to `fetch`.
- `/admin` area, real auth, payments.
