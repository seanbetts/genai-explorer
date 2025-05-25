import React from 'react';

interface JsonLdProps {
  data: Record<string, any>;
}

// Component to output JSON-LD structured data
const JsonLd = ({ data }: JsonLdProps) => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
};

export default JsonLd;

// Helper function to generate AI Model structured data
export const generateAiModelJsonLd = (model: any, company: any) => {
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": `${model.name} - AI Model Details`,
    "description": model.description || `Technical details and specifications for ${model.name} by ${company.name}`,
    "author": {
      "@type": "Organization",
      "name": company.name,
      "url": company.website
    },
    "datePublished": model.releaseDate || company.lastUpdated,
    "dateModified": company.lastUpdated,
    "about": {
      "@type": "Thing",
      "name": model.name,
      "description": model.description || `${model.name} is a ${model.category} model by ${company.name}`
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://explorer.the-blueprint.ai/?company=${company.id}`
    }
  };
};

// Helper function to generate Benchmark structured data
export const generateBenchmarkJsonLd = (benchmark: any, scores: any[]) => {
  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "name": benchmark.benchmark_name,
    "description": benchmark.benchmark_description || `Performance benchmark for AI models: ${benchmark.benchmark_name}`,
    "url": `https://explorer.the-blueprint.ai/benchmarks?benchmark=${benchmark.benchmark_id}`,
    "keywords": [
      "AI Benchmark", 
      benchmark.benchmark_category, 
      "AI Model Evaluation",
      "Generative AI",
      benchmark.benchmark_name
    ],
    "isAccessibleForFree": true,
    "creator": {
      "@type": "Organization",
      "name": "The Blueprint"
    },
    "distribution": {
      "@type": "DataDownload",
      "encodingFormat": "JSON",
      "contentUrl": benchmark.benchmark_paper || ""
    },
    "temporalCoverage": new Date().getFullYear().toString(),
    "variableMeasured": benchmark.benchmark_name
  };
};

// Helper function to generate Company structured data
export const generateCompanyJsonLd = (company: any) => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": company.name,
    "url": company.website,
    "logo": `https://explorer.the-blueprint.ai${company.logo}`,
    "description": company.description,
    "sameAs": [company.website],
    "potentialAction": {
      "@type": "ViewAction",
      "target": `https://explorer.the-blueprint.ai/?company=${company.id}`
    }
  };
};

// Helper function to generate Explorer structured data
export const generateExplorerJsonLd = () => {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Generative AI Explorer | The Blueprint",
    "applicationCategory": "EducationalApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "An interactive web application that visualizes the current landscape of generative AI companies, models, and capabilities.",
    "author": {
      "@type": "Person",
      "name": "Sean Betts"
    },
    "url": "https://explorer.the-blueprint.ai",
    "dateModified": new Date().toISOString().split('T')[0],
    "featureList": [
      "Model explorer by category",
      "Benchmark comparisons",
      "Rich media galleries",
      "Company profiles",
      "Model comparison tool"
    ]
  };
};