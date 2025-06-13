import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverComponentsExternalPackages: ['@react-pdf/renderer'],
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
