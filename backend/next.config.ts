import type { NextConfig } from "next";

// API-only server (no pages). The storefront proxies /api/* here, so the browser never calls it directly.
const nextConfig: NextConfig = { reactStrictMode: true };

export default nextConfig;
