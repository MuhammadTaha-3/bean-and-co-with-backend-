import type { NextConfig } from "next";

// The browser only ever talks to /api on this origin; Next forwards it to the backend server.
// That keeps the admin cookie same-origin (no CORS) and the backend URL private.
const BACKEND_URL = (process.env.BACKEND_URL ?? "http://localhost:4000").replace(/\/$/, "");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${BACKEND_URL}/api/:path*` }];
  },
};

export default nextConfig;
