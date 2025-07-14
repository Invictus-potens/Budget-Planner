import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removed static export for Railway compatibility
  images: {
    unoptimized: true,
  },
  typescript: {
    // ignoreBuildErrors: true,
  },
};

export default nextConfig;
