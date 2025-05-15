import type { Metadata } from "next";
import "./globals.css";

// Import brand config for conditional metadata
import brandConfig from './config/brand';
import JsonLd, { generateExplorerJsonLd } from './components/utils/JsonLd';
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
    metadataBase: new URL(baseUrl),
    title: {
      template: '%s | The Blueprint',
      default: 'Generative AI Explorer | The Blueprint',
    },
    description: "Explore the complete landscape of generative AI from The Blueprint. Compare AI models, companies, benchmarks and capabilities all in one place.",
    keywords: ['generative AI', 'AI models', 'LLM', 'benchmarks', 'frontier models', 'AI companies', 'model comparison', 'AI explorer', 'the blueprint'],
    creator: 'Sean Betts',
    publisher: 'The Blueprint',
    
    // Open Graph metadata
    openGraph: {
      type: 'website',
      title: 'Generative AI Explorer | The Blueprint',
      description: 'Explore the complete landscape of generative AI from The Blueprint. Compare AI models, companies, benchmarks and capabilities all in one place.',
      siteName: 'The Blueprint',
      url: baseUrl,
      images: [
        {
          url: `${baseUrl}/images/og-image.jpg`, 
          width: 1200,
          height: 630,
          alt: 'Generative AI Explorer by The Blueprint',
        }
      ],
    },
    
    // Twitter metadata
    twitter: {
      card: 'summary_large_image',
      title: 'Generative AI Explorer | The Blueprint',
      description: 'Explore the complete landscape of generative AI from The Blueprint. Compare AI models, companies, benchmarks and capabilities all in one place.',
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
    
    // Canonical URL
    alternates: {
      canonical: baseUrl,
    },
    
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
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        {shouldIncludeStructuredData && explorerJsonLd && <JsonLd data={explorerJsonLd} />}
      </head>
      <body className={`antialiased h-full ${fontClass}`}>
        <MobileNotification>
          {children}
        </MobileNotification>
      </body>
    </html>
  );
}
