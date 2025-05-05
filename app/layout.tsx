import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Generative AI Explorer",
  description: "Explore the ecosystem of generative AI models and companies",
};

// Import brand config for conditional styling
import brandConfig from './config/brand';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Determine the brand to apply appropriate font family
  const brandName = process.env.NEXT_PUBLIC_BRAND || 'personal';
  const fontClass = brandName === 'omg' ? 'font-sans' : 'font-mono';
  
  return (
    <html lang="en" className="h-full">
      <body className={`antialiased h-full ${fontClass}`}>
        {children}
      </body>
    </html>
  );
}
