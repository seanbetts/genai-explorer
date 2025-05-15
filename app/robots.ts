import { MetadataRoute } from 'next'
import currentBrand from './config/brand'

// For static export
export const dynamic = 'force-static'
export const revalidate = 86400 // Revalidate once per day

export default function robots(): MetadataRoute.Robots {
  // Default restrictive rules for all bots (OMG version or if SEO disabled)
  if (!currentBrand.seo || !currentBrand.seo.enabled || !currentBrand.seo.enableRobots) {
    return {
      rules: [
        {
          userAgent: '*',
          disallow: '/',
        },
      ],
      // No sitemap for OMG version
    }
  }

  // SEO-enabled version (personal) with crawler-specific rules
  const rules = [
    {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/_next/'],
    }
  ]

  // Only add crawler-specific rules if enabled in brand config
  const { crawlers } = currentBrand.seo

  // OpenAI crawlers
  if (crawlers.openai) {
    rules.push(
      { userAgent: 'GPTBot', allow: '/', disallow: [] },
      { userAgent: 'OAI-SearchBot', allow: '/', disallow: [] },
      { userAgent: 'ChatGPT-User', allow: '/', disallow: [] }
    )
  }

  // Google crawlers
  if (crawlers.google) {
    rules.push(
      { userAgent: 'Googlebot', allow: '/', disallow: [] },
      { userAgent: 'Googlebot-Image', allow: '/', disallow: [] },
      { userAgent: 'Googlebot-Video', allow: '/', disallow: [] },
      { userAgent: 'Googlebot-News', allow: '/', disallow: [] },
      { userAgent: 'Storebot-Google', allow: '/', disallow: [] },
      { userAgent: 'Google-InspectionTool', allow: '/', disallow: [] },
      { userAgent: 'GoogleOther', allow: '/', disallow: [] },
      { userAgent: 'Google-Extended', allow: '/', disallow: [] }
    )
  }

  // Anthropic crawlers
  if (crawlers.anthropic) {
    rules.push(
      { userAgent: 'ClaudeBot', allow: '/', disallow: [] },
      { userAgent: 'Claude-User', allow: '/', disallow: [] },
      { userAgent: 'Claude-SearchBot', allow: '/', disallow: [] }
    )
  }

  // Perplexity crawlers
  if (crawlers.perplexity) {
    rules.push(
      { userAgent: 'PerplexityBot', allow: '/', disallow: [] },
      { userAgent: 'Perplexity-User', allow: '/', disallow: [] }
    )
  }

  // Mistral AI crawlers
  if (crawlers.mistral) {
    rules.push(
      { userAgent: 'MistralAI-User', allow: '/', disallow: [] }
    )
  }

  // Meta crawlers
  if (crawlers.meta) {
    rules.push(
      { userAgent: 'FacebookExternalHit', allow: '/', disallow: [] },
      { userAgent: 'facebookexternalhit', allow: '/', disallow: [] },
      { userAgent: 'facebookcatalog', allow: '/', disallow: [] },
      { userAgent: 'Meta-ExternalAgent', allow: '/', disallow: [] },
      { userAgent: 'meta-externalagent', allow: '/', disallow: [] },
      { userAgent: 'Meta-ExternalFetcher', allow: '/', disallow: [] },
      { userAgent: 'meta-externalfetcher', allow: '/', disallow: [] }
    )
  }

  return {
    rules,
    sitemap: currentBrand.seo.baseUrl 
      ? `${currentBrand.seo.baseUrl}/sitemap.xml`
      : process.env.NEXT_PUBLIC_BASE_URL 
        ? `${process.env.NEXT_PUBLIC_BASE_URL}/sitemap.xml`
        : 'https://explorer.the-blueprint.ai/sitemap.xml',
  }
}