/**
 * Helper function to generate canonical URLs for the application
 * 
 * @param path - The path part of the URL without leading slash
 * @param query - Optional query parameters
 * @returns The full canonical URL
 */
export function getCanonicalUrl(path?: string, query?: Record<string, string>): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://explorer.the-blueprint.ai';
  
  // Start with base URL
  let url = baseUrl;
  
  // Add path if provided (with leading slash)
  if (path) {
    url += path.startsWith('/') ? path : `/${path}`;
  }
  
  // Add query parameters if provided
  if (query && Object.keys(query).length > 0) {
    url += '?';
    url += Object.entries(query)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
  }
  
  return url;
}

/**
 * Helper function to generate metadata with canonical URL
 * For use with Next.js App Router metadata API
 */
export function generateMetadataWithCanonical(
  path?: string, 
  query?: Record<string, string>,
  additionalMetadata: Record<string, any> = {}
) {
  const canonicalUrl = getCanonicalUrl(path, query);
  
  return {
    ...additionalMetadata,
    alternates: {
      canonical: canonicalUrl,
    }
  };
}