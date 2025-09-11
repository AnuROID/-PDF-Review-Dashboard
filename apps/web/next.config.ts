import type { NextConfig } from "next";

interface MyNextConfig extends NextConfig {
  experimental?: NextConfig["experimental"] & { turbo?: boolean };
}

const nextConfig: MyNextConfig = {
  experimental: {
    turbo: false, // now TypeScript is happy
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      canvas: false,
    };
    return config;
  },
};

export default nextConfig;
