import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverComponentsExternalPackages: ['@pioneer-platform/default-mongo', 'monk', 'mongodb']
  }
};

export default nextConfig;
