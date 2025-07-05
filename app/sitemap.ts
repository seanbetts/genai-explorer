import { MetadataRoute } from 'next'
import currentBrand from './config/brand'

// Import data files with relative paths
import explorerData from '../data/data.json'
import benchmarksData from '../public/data/benchmarks-meta.json'

// For static export
export const dynamic = 'force-static'
export const revalidate = 86400 // Revalidate once per day

export default function sitemap(): MetadataRoute.Sitemap {
  // For OMG version or if SEO disabled, return an empty sitemap
  if (!currentBrand.seo || !currentBrand.seo.enabled || !currentBrand.seo.enableSitemap) {
    return []
  }
  
  const baseUrl = currentBrand.seo.baseUrl || 
                  process.env.NEXT_PUBLIC_BASE_URL || 
                  'https://explorer.the-blueprint.ai'
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
    },
    {
      url: `${baseUrl}/sitemap-html`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.3
    }
  ]
  
  // Company routes
  const companyRoutes = explorerData.companies.map(company => ({
    url: `${baseUrl}/?company=${company.id}`,
    lastModified: new Date(company.lastUpdated) || lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.7
  }))
  
  // Company routes with important tab variations
  const importantTabs = ['frontier-models', 'image-models', 'video-models', 'audio-models']
  const companyTabRoutes = explorerData.companies.flatMap(company => 
    importantTabs.map(tab => ({
      url: `${baseUrl}/?company=${company.id}&tab=${tab}`,
      lastModified: new Date(company.lastUpdated) || lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.6
    }))
  )
  
  // Benchmark routes
  const benchmarkRoutes = benchmarksData.map(benchmark => ({
    url: `${baseUrl}/benchmarks?benchmark=${benchmark.benchmark_id}`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.6
  }))
  
  // Combine all routes
  return [...routes, ...companyRoutes, ...companyTabRoutes, ...benchmarkRoutes]
}