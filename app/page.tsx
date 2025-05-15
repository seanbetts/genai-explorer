import React, { Suspense } from 'react';
import AIExplorer from './components';
import type { ExplorerData } from './components/types';
import explorerData from '../data/data.json';
import ClientOnly from './components/utils/ClientOnly';
import type { Metadata } from 'next';
import { generatePageMetadata } from './lib/metadata';

export const generateMetadata = (): Metadata => {
  return generatePageMetadata();
};

export default function Home() {
  // Load static explorer data at build time
  const data = explorerData as ExplorerData;
  
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