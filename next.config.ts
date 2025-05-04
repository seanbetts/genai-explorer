import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Required for static export with { output: 'export' }
    unoptimized: true,
    // Optimize images to reduce bundle size
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000, // 1 year in seconds
    // Tightened: no external hosts allowed by default; add patterns here as needed
    remotePatterns: [],
  },
  // Optimize for Netlify deployment with static export
  output: 'export', // Changed from 'standalone' to 'export' for static site generation
  poweredByHeader: false,
  reactStrictMode: true,
  // Optimize bundle size
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Reduce the function size for Netlify
  experimental: {
    serverMinification: true,
  },
  // Enable persistent build caching
  distDir: '.next',
  onDemandEntries: {
    // Keep built pages in memory for longer
    maxInactiveAge: 60 * 60 * 1000,
    // Number of pages to keep in memory
    pagesBufferLength: 5,
  },
  // Explicitly enable build cache
  generateBuildId: async () => {
    // Return a consistent build ID to improve caching
    return 'my-build-id'
  },
};

export default nextConfig;
