# Bean & Co — Next.js coffee storefront

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Motion (`motion/react`)

## Run (npm only)

```sh
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

Node 20.9+ required.

## Structure

```
src/
  app/                      App Router (server files: metadata + thin page shells)
    layout.tsx              fonts (next/font), metadata, <Providers>
    page.tsx                /
    products/page.tsx       /products
    products/[id]/page.tsx  /products/:id
    cart/ wishlist/ checkout/ order-confirmation/[id]/
    api/health/route.ts     example Route Handler (GET /api/health)
    not-found.tsx · error.tsx · globals.css
  components/
    Providers.tsx           client providers + navbar/footer/cart drawer
    pages/*View.tsx         the interactive page bodies ("use client")
    coffee/                 storefront components
    ui/                     shadcn/ui
  lib/
    coffee-data.ts          seed catalogue
    store/                  cart + wishlist contexts, repo.ts (data layer)
public/images/              product + hero images
```

## Building the backend

`src/lib/store/repo.ts` is the only place that touches data (currently localStorage,
all functions already `async`). To add a real backend:

1. Create Route Handlers, e.g. `src/app/api/products/route.ts`, `src/app/api/orders/route.ts`.
2. Replace the body of each `repo.ts` function with a `fetch("/api/...")` call — the
   shapes in `src/lib/store/types.ts` already match what an API/DB would return.
3. Move pages that only display data (products, product detail) to Server Components
   that read from the DB directly, keeping `"use client"` for cart/wishlist/checkout.

Cart and wishlist stay client-side (localStorage) — persist them server-side once auth exists.
