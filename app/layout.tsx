import type { Metadata } from "next";
import "./globals.css";

// Import brand config for conditional metadata
import brandConfig from './config/brand';
import JsonLd, { generateExplorerJsonLd } from './components/utils/JsonLd';
import GoogleAnalytics from './components/utils/GoogleAnalytics';
import MobileNotification from './components/MobileNotification';

// Base metadata function that respects brand settings
function generateMetadata(): Metadata {
  // Define base URL for canonical links and OG images
  const baseUrl = brandConfig.seo?.baseUrl || 
                 process.env.NEXT_PUBLIC_BASE_URL || 
                 'https://explorer.the-blueprint.ai';

  // If SEO is disabled for this brand, return minimal metadata
  if (!brandConfig.seo?.enabled || !brandConfig.seo?.enableMetaTags) {
    return {
      title: {
        template: `%s | ${brandConfig.name}`,
        default: `Generative AI Explorer | ${brandConfig.name}`,
      },
      icons: {
        icon: brandConfig.faviconPath,
        shortcut: brandConfig.faviconPath,
        apple: brandConfig.faviconPath,
      },
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

  // Return full SEO metadata for personal version
  return {
    // Removed metadataBase to avoid conflicts with individual page canonical URLs
    title: {
      template: `%s | ${brandConfig.name}`,
      default: `Generative AI Explorer | ${brandConfig.name}`,
    },
    description: `Explore the complete landscape of generative AI from ${brandConfig.name}. Compare AI models, companies, benchmarks and capabilities all in one place.`,
    keywords: ['generative AI', 'AI models', 'LLM', 'benchmarks', 'frontier models', 'AI companies', 'model comparison', 'AI explorer', brandConfig.name.toLowerCase()],
    creator: 'Sean Betts',
    publisher: brandConfig.name,
    icons: {
      icon: brandConfig.faviconPath,
      shortcut: brandConfig.faviconPath,
      apple: brandConfig.faviconPath,
    },
    
    // Open Graph metadata
    openGraph: {
      type: 'website',
      title: `Generative AI Explorer | ${brandConfig.name}`,
      description: `Explore the complete landscape of generative AI from ${brandConfig.name}. Compare AI models, companies, benchmarks and capabilities all in one place.`,
      siteName: brandConfig.name,
      url: baseUrl,
      images: [
        {
          url: `${baseUrl}/images/og-image.jpg`, 
          width: 1200,
          height: 630,
          alt: `Generative AI Explorer by ${brandConfig.name}`,
        }
      ],
    },
    
    // Twitter metadata
    twitter: {
      card: 'summary_large_image',
      title: `Generative AI Explorer | ${brandConfig.name}`,
      description: `Explore the complete landscape of generative AI from ${brandConfig.name}. Compare AI models, companies, benchmarks and capabilities all in one place.`,
      images: [`${baseUrl}/images/og-image.jpg`],
      creator: '@seanbetts',
      site: '@theblueprint_ai',
    },
    
    // Robots directives
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
    
    // Note: Canonical URLs are set by individual pages to avoid conflicts
    
    // Verification for search consoles
    verification: {
      google: 'google-site-verification=YOUR_VERIFICATION_CODE', // Replace with your verification code
    },
  };
}

// Export the metadata
export const metadata = generateMetadata();

// Brand config already imported above

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Determine the brand to apply appropriate font family
  const brandName = process.env.NEXT_PUBLIC_BRAND || 'personal';
  const fontClass = brandName === 'omg' ? 'font-sans' : 'font-mono';
  
  // Only generate structured data if SEO is enabled for this brand
  const shouldIncludeStructuredData = 
    brandConfig.seo?.enabled && 
    brandConfig.seo?.enableStructuredData;
  
  // Generate structured data for the explorer if needed
  const explorerJsonLd = shouldIncludeStructuredData ? generateExplorerJsonLd() : undefined;
  
  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {shouldIncludeStructuredData && explorerJsonLd && <JsonLd data={explorerJsonLd} />}
        
        {/* Only include Google Analytics if SEO is enabled for this brand */}
        {brandConfig.seo?.enabled && <GoogleAnalytics />}
      </head>
      <body className={`antialiased h-full ${fontClass}`}>
        <MobileNotification>
          {children}
        </MobileNotification>
      </body>
    </html>
  );
}
