import React, { Suspense } from 'react';
import AIExplorer from '../components';
import type { ExplorerData } from '../components/types';
import explorerData from '../../data/data.json';
import ClientOnly from '../components/utils/ClientOnly';
import type { Metadata } from 'next';
import { generatePageMetadata } from '../lib/metadata';

export const generateMetadata = (): Metadata => {
  return generatePageMetadata(
    '/compare', 
    'AI Model Comparer', 
    'Compare different AI models side-by-side to evaluate features, specifications, and benchmark performance.',
    ['model comparison', 'AI comparison tool', 'compare LLMs', 'frontier models', 'open source models', 'image generation', 'video generation', 'audio generation']
  );
};

export default function ComparePage() {
  // Load static explorer data at build time
  const data = explorerData as ExplorerData;
  
  // Use ClientOnly component to avoid hydration mismatches
  return (
    <main>
      <ClientOnly>
        <Suspense fallback={<div className="animate-pulse text-center py-10">Loading app...</div>}>
          <AIExplorer initialData={data} />
        </Suspense>
      </ClientOnly>
    </main>
  );
}