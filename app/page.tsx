import React, { Suspense } from 'react';
import AILandscape from './components/AILandscape';
import type { LandscapeData } from './components/AILandscape/types';
import landscapeData from '@/data/landscape.json';

export default function Home() {
  // Load static landscape data at build time
  const data = landscapeData as LandscapeData;
  return (
    <main>
      <Suspense fallback={<div className="animate-pulse text-center py-10">Loading app...</div>}>
        <AILandscape initialData={data} />
      </Suspense>
    </main>
  );
}