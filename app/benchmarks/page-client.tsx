'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { ExplorerData } from '../components/types';
import explorerData from '@/data/data.json';
import AIExplorer from '../components';

// Dynamically import the BenchmarkExplorerView component
const BenchmarkExplorerView = dynamic(
  () => import('../components/BenchmarkExplorerView'),
  { ssr: false }
);

export default function BenchmarkPageClient() {
  const router = useRouter();
  const data = explorerData as ExplorerData;
  
  return (
    <AIExplorer initialData={data} benchmarkPageContent={
      <Suspense fallback={<div className="animate-pulse text-center py-10">Loading benchmark explorer...</div>}>
        <BenchmarkExplorerView 
          onBenchmarkSelect={(benchmarkId: string) => {
            // Navigate to benchmark detail page
            router.push(`/?benchmark=${benchmarkId}`);
          }} 
        />
      </Suspense>
    } />
  );
}