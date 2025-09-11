import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbo: false, // disable Turbopack
  },
  webpack: (config) => {
    // Ignore 'canvas' during server-side builds
    config.resolve.fallback = {
      ...config.resolve.fallback,
      canvas: false,
    };
    return config;
  },
};

export default nextConfig;
