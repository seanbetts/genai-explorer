import type { Metadata } from 'next';

// Base URL for the site
const baseUrl = 'https://explorer.the-blueprint.ai';

/**
 * Creates a canonical URL for a given path
 */
function createCanonicalUrl(path?: string): string {
  if (!path) return baseUrl;
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
}

/**
 * Common metadata generator for all pages
 */
export function generatePageMetadata(
  path?: string,
  title?: string,
  description?: string
): Metadata {
  const canonicalUrl = createCanonicalUrl(path);
  const pageTitle = title ? `${title} | Generative AI Explorer` : 'Generative AI Explorer - Interactive AI Model and Company Comparison';
  const pageDescription = description || 'A comprehensive explorer for generative AI models, companies, benchmarks and capabilities. Compare frontier models, view benchmarks, and explore AI capabilities.';
  
  return {
    title: pageTitle,
    description: pageDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      url: canonicalUrl,
      title: pageTitle,
      description: pageDescription,
    },
    twitter: {
      title: pageTitle,
      description: pageDescription,
    }
  };
}