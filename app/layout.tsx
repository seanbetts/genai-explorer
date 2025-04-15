import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Generative AI Landscape Explorer",
  description: "Explore the current landscape of generative AI models and companies",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
