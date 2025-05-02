import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Tightened: no external hosts allowed by default; add patterns here as needed
    remotePatterns: [],
  },
  // Optimize for Netlify deployment
  output: 'standalone', // Produces a minimal serverless bundle
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
};

export default nextConfig;
