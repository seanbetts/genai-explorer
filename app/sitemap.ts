import { MetadataRoute } from 'next'
import explorerData from '@/data/data.json'
import benchmarksData from '@/public/data/benchmarks-meta.json'

// For static export
export const dynamic = 'force-static'
export const revalidate = 86400 // Revalidate once per day

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://explorer.the-blueprint.ai'
  const lastModified = new Date()
  
  // Main routes
  const routes = [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 1
    },
    {
      url: `${baseUrl}/benchmarks`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.9
    },
    {
      url: `${baseUrl}/compare`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.8
    }
  ]
  
  // Company routes
  const companyRoutes = explorerData.companies.map(company => ({
    url: `${baseUrl}/?company=${company.id}`,
    lastModified: new Date(company.lastUpdated) || lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.7
  }))
  
  // Benchmark routes
  const benchmarkRoutes = benchmarksData.map(benchmark => ({
    url: `${baseUrl}/benchmarks?benchmark=${benchmark.benchmark_id}`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.6
  }))
  
  // Combine all routes
  return [...routes, ...companyRoutes, ...benchmarkRoutes]
}