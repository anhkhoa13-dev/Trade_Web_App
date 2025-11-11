import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // devIndicators: false
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ui-avatars.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "assets.coingecko.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com", // (for fallback)
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
