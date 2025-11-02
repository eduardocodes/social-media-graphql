import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      '@yaacovcr/transform': './lib/empty-module.js',
    },
  },
  webpack: (config, { isServer }) => {
    // Handle optional dependencies for Apollo Server 5 (fallback for webpack mode)
    config.resolve.fallback = {
      ...config.resolve.fallback,
      '@yaacovcr/transform': false,
    };

    // Ignore optional Apollo Server dependencies
    config.externals = config.externals || [];
    if (isServer) {
      config.externals.push('@yaacovcr/transform');
    }

    return config;
  },
};

export default nextConfig;
