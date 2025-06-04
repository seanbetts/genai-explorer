import type { Metadata } from 'next';
import brandConfig from '../config/brand';

/**
 * Creates a canonical URL for a given path
 */
function createCanonicalUrl(path?: string): string {
  const baseUrl = brandConfig.seo?.baseUrl || 
                  process.env.NEXT_PUBLIC_BASE_URL || 
                  'https://explorer.the-blueprint.ai';
  
  if (!path) return baseUrl;
  
  // Clean the path - remove query parameters for canonical URLs
  const cleanPath = path.split('?')[0];
  return `${baseUrl}${cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`}`;
}

/**
 * Common metadata generator for all pages
 */
export function generatePageMetadata(
  path?: string,
  title?: string,
  description?: string,
  additionalKeywords?: string[]
): Metadata {
  // Skip generating metadata if SEO is disabled for this brand
  if (!brandConfig.seo?.enabled || !brandConfig.seo?.enableMetaTags) {
    return {
      robots: {
        index: false,
        follow: false,
        googleBot: {
          index: false,
          follow: false,
        },
      },
    };
  }

  const canonicalUrl = createCanonicalUrl(path);
  const pageTitle = title || 'Generative AI Explorer';
  const pageDescription = description || 'A comprehensive explorer for generative AI models, companies, benchmarks and capabilities. Compare frontier models, view benchmarks, and explore AI capabilities.';
  
  // Combine default keywords with additional ones
  const defaultKeywords = ['generative AI', 'AI models', 'LLM', 'benchmarks', 'frontier models', 'AI companies', 'model comparison', 'AI explorer', 'the blueprint'];
  const allKeywords = additionalKeywords ? [...defaultKeywords, ...additionalKeywords] : defaultKeywords;
  
  return {
    title: pageTitle,
    description: pageDescription,
    keywords: allKeywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: 'website',
      url: canonicalUrl,
      title: pageTitle,
      description: pageDescription,
      siteName: 'The Blueprint',
      images: [
        {
          url: `${brandConfig.seo?.baseUrl || 'https://explorer.the-blueprint.ai'}/images/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: pageTitle,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      images: [`${brandConfig.seo?.baseUrl || 'https://explorer.the-blueprint.ai'}/images/og-image.jpg`],
      creator: '@seanbetts',
      site: '@theblueprint_ai',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  };
}