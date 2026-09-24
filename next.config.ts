import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel packages Next.js itself. Keep standalone output for the AWS image only.
  output: process.env.VERCEL === "1" ? undefined : "standalone",
  async headers() {
    if (process.env.DMRK_PUBLIC_SITE === "true") return [];
    return [{
      source: "/:path*",
      headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive, nosnippet" }],
    }];
  },
  images: {
    // The client's live site hot-links hero imagery from Unsplash.
    // Kept for the concept build only — flagged for replacement with owned assets.
    dangerouslyAllowLocalIP: process.env.DMRK_PUBLIC_SITE !== "true",
    remotePatterns: [
      ...(process.env.DMRK_PUBLIC_SITE !== "true" ? [{protocol: "http" as const, hostname: "127.0.0.1", port: "8091", pathname: "/storage/**"}] : []),
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "dmrkinsights.com", pathname: "/storage/**" },
    ],
  },
};

export default nextConfig;
