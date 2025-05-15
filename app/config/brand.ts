/**
 * Brand configuration system
 * Handles brand-specific settings and appearance
 */

export type BrandConfig = {
  name: string;
  showFooter: boolean;
  logoPath: string;
  headerLinks: Array<{
    text: string;
    url: string;
  }>;
  primaryColor: string;
  secondaryColor: string;
  // SEO-related configurations
  seo: {
    enabled: boolean;
    baseUrl?: string;
    enableRobots: boolean;
    enableSitemap: boolean;
    enableMetaTags: boolean;
    enableStructuredData: boolean;
    // Add crawler allowances as needed
    crawlers: {
      google: boolean;
      openai: boolean;
      anthropic: boolean;
      perplexity: boolean;
      mistral: boolean;
      meta: boolean;
    };
  };
  // Add other brand-specific configurations as needed
};

// Brand-specific configurations
export const brandConfigs: Record<string, BrandConfig> = {
  personal: {
    name: 'The Blueprint',
    showFooter: true,
    logoPath: '/images/logo.webp',
    headerLinks: [
      { text: 'Subscribe', url: 'https://www.the-blueprint.ai' }
    ],
    primaryColor: '#EA00D9', // fuchsia-500
    secondaryColor: '#0ABDC6', // cyan-400
    seo: {
      enabled: true,
      baseUrl: 'https://explorer.the-blueprint.ai',
      enableRobots: true,
      enableSitemap: true,
      enableMetaTags: true,
      enableStructuredData: true,
      crawlers: {
        google: true,
        openai: true,
        anthropic: true,
        perplexity: true,
        mistral: true,
        meta: true
      }
    }
  },
  
  omg: {
    name: 'OMG',
    showFooter: false, // No footer for employer version
    logoPath: '/images/omg-logo.webp', // Using the OMG-specific logo
    headerLinks: [], // No header links for OMG version
    primaryColor: '#173E80',
    secondaryColor: '#437AF6',
    seo: {
      enabled: false, // Disable all SEO features for OMG version
      enableRobots: false,
      enableSitemap: false,
      enableMetaTags: false,
      enableStructuredData: false,
      crawlers: {
        google: false,
        openai: false,
        anthropic: false,
        perplexity: false,
        mistral: false,
        meta: false
      }
    }
  }
};

// Default to personal, override with environment variable
const getBrandKey = (): string => {
  // When building, use the NEXT_PUBLIC_BRAND env variable
  if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_BRAND) {
    return process.env.NEXT_PUBLIC_BRAND;
  }
  
  // When running in browser, determine from hostname (optional)
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    // Check if hostname contains omg or is the OMG Netlify site
    if (hostname.includes('omg') || hostname.includes('genai-explorer-omg')) {
      return 'omg';
    }
  }
  
  // Default fallback
  return 'personal';
};

// Export the current brand configuration
const currentBrand = brandConfigs[getBrandKey()] || brandConfigs.personal;
export default currentBrand;