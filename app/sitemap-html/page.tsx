import React from 'react';
import type { Metadata } from 'next';
import { generatePageMetadata } from '../lib/metadata';
import explorerData from '../../data/data.json';
import benchmarksData from '../../public/data/benchmarks-meta.json';
import brandConfig from '../config/brand';

export const generateMetadata = (): Metadata => {
  return generatePageMetadata(
    'sitemap-html', 
    'Sitemap', 
    'Complete sitemap of all pages, companies, and benchmarks available in the Generative AI Explorer.',
    ['sitemap', 'site navigation', 'page index']
  );
};

export default function HtmlSitemap() {
  // If SEO is disabled, don't show the sitemap
  if (!brandConfig.seo?.enabled) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Sitemap not available</p>
      </div>
    );
  }

  const baseUrl = brandConfig.seo?.baseUrl || 'https://explorer.the-blueprint.ai';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Sitemap</h1>
        
        {/* Main Pages */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Main Pages</h2>
          <ul className="space-y-2">
            <li>
              <a href={baseUrl} className="text-blue-600 hover:text-blue-800 underline">
                Home - Generative AI Explorer
              </a>
            </li>
            <li>
              <a href={`${baseUrl}/benchmarks`} className="text-blue-600 hover:text-blue-800 underline">
                AI Benchmarks
              </a>
            </li>
            <li>
              <a href={`${baseUrl}/compare`} className="text-blue-600 hover:text-blue-800 underline">
                AI Model Comparer
              </a>
            </li>
          </ul>
        </section>

        {/* Companies */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">AI Companies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {explorerData.companies.map(company => (
              <div key={company.id}>
                <a 
                  href={`${baseUrl}/?company=${company.id}`} 
                  className="text-blue-600 hover:text-blue-800 underline block"
                >
                  {company.name}
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Benchmarks */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">AI Benchmarks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {benchmarksData.map(benchmark => (
              <div key={benchmark.benchmark_id}>
                <a 
                  href={`${baseUrl}/benchmarks?benchmark=${benchmark.benchmark_id}`} 
                  className="text-blue-600 hover:text-blue-800 underline block"
                >
                  {benchmark.benchmark_name}
                </a>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}