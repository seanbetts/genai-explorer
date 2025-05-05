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
  // Add other brand-specific configurations as needed
};

// Brand-specific configurations
export const brandConfigs: Record<string, BrandConfig> = {
  personal: {
    name: 'The Blueprint',
    showFooter: true,
    logoPath: '/images/logo.png',
    headerLinks: [
      { text: 'Subscribe', url: 'https://www.the-blueprint.ai' }
    ],
    primaryColor: '#EA00D9', // fuchsia-500
    secondaryColor: '#0ABDC6', // cyan-400
  },
  
  omg: {
    name: 'OMG',
    showFooter: false, // No footer for employer version
    logoPath: '/images/logo.png', // Will update this once employer logo is available
    headerLinks: [
      { text: 'Company Site', url: 'https://www.omg.com' } // Replace with actual URL
    ],
    primaryColor: '#4F46E5', // indigo-600 (example)
    secondaryColor: '#10B981', // emerald-500 (example)
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
    if (hostname.includes('omg') || hostname.includes('employer')) {
      return 'omg';
    }
  }
  
  // Default fallback
  return 'personal';
};

// Export the current brand configuration
const currentBrand = brandConfigs[getBrandKey()] || brandConfigs.personal;
export default currentBrand;