import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Generative AI Explorer",
  description: "Explore the ecosystem of generative AI models and companies",
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
