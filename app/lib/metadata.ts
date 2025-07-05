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
  
  // Parse the path to extract base path and query parameters
  const [basePath, queryString] = path.split('?');
  const cleanBasePath = basePath || '/';
  
  // If no query parameters, return the base path
  if (!queryString) {
    return `${baseUrl}${cleanBasePath.startsWith('/') ? cleanBasePath : `/${cleanBasePath}`}`;
  }
  
  // Parse query parameters and preserve only the important ones for canonical URLs
  const params = new URLSearchParams(queryString);
  const importantParams = new URLSearchParams();
  
  // Preserve specific parameters that define unique content
  const preservedParams = ['company', 'benchmark', 'tab', 'models'];
  
  preservedParams.forEach(param => {
    const value = params.get(param);
    if (value) {
      importantParams.set(param, value);
    }
  });
  
  // Build the canonical URL
  const canonicalPath = cleanBasePath.startsWith('/') ? cleanBasePath : `/${cleanBasePath}`;
  const canonicalQuery = importantParams.toString();
  
  return canonicalQuery 
    ? `${baseUrl}${canonicalPath}?${canonicalQuery}`
    : `${baseUrl}${canonicalPath}`;
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