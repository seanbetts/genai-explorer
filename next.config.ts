import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // IMPORTANT: Must use unoptimized: true when output: 'export' is set
    unoptimized: true,
    // These formats only apply when not using unoptimized: true
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
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
  // Basic cache configuration that works with static export
  distDir: '.next',
  // Optimize build with swc
  experimental: {
    // Reduce the function size for Netlify
    serverMinification: true
  },
};

export default nextConfig;
