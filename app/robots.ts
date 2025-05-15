import { MetadataRoute } from 'next'

// For static export
export const dynamic = 'force-static'
export const revalidate = 86400 // Revalidate once per day

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/_next/'],
    },
    sitemap: process.env.NEXT_PUBLIC_BASE_URL 
      ? `${process.env.NEXT_PUBLIC_BASE_URL}/sitemap.xml`
      : 'https://explorer.the-blueprint.ai/sitemap.xml',
  }
}