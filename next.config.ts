import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Enable if you need images from DNA Racing API
  images: {
    domains: ['api.dnaracing.run'],
  },
};

export default nextConfig;
