import React, { Suspense } from 'react';
import AIExplorer from '../components';
import type { ExplorerData } from '../components/types';
import explorerData from '@/data/data.json';

export default function ComparePage() {
  // Load static explorer data at build time
  const data = explorerData as ExplorerData;
  return (
    <main>
      <Suspense fallback={<div className="animate-pulse text-center py-10">Loading app...</div>}>
        <AIExplorer initialData={data} />
      </Suspense>
    </main>
  );
}