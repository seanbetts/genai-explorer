import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export', // Use static export for Netlify
  trailingSlash: true, // Better for static hosting
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // For static export, images must be unoptimized
    unoptimized: true,
    // Tightened: no external hosts allowed by default
    remotePatterns: [],
  },
  // Optimize build
  poweredByHeader: false,
  reactStrictMode: true,
  // Optimize bundle size
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Define dynamic routes that should be pre-rendered
  // This is important for Netlify static deployment
  exportPathMap: async () => {
    return {
      '/': { page: '/' },
      '/compare': { page: '/compare' },
      '/_not-found': { page: '/_not-found' },
    };
  },
};

export default nextConfig;
