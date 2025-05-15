'use client';

import React, { useEffect, useState } from 'react';
import Head from 'next/head';

interface CanonicalUrlProps {
  path?: string;
  query?: Record<string, string>;
}

/**
 * Component to add canonical URLs to pages
 * - Helps search engines identify the preferred version of a page
 * - Prevents duplicate content issues with different URL parameters
 * - Improves SEO by consolidating link signals
 */
const CanonicalUrl: React.FC<CanonicalUrlProps> = ({ path, query }) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://explorer.the-blueprint.ai';
  const [canonicalUrl, setCanonicalUrl] = useState<string>('');
  
  useEffect(() => {
    let url = baseUrl;
    
    // Add path if provided (without trailing slash)
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
    
    setCanonicalUrl(url);
  }, [baseUrl, path, query]);
  
  if (!canonicalUrl) return null;
  
  return (
    <Head>
      <link rel="canonical" href={canonicalUrl} />
    </Head>
  );
};

export default CanonicalUrl;