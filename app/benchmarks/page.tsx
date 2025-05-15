import React from 'react';
import ClientOnly from '../components/utils/ClientOnly';
import BenchmarkPageClient from './page-client';
import { generateMetadataWithCanonical } from '../components/utils/canonicalUrl';
import type { Metadata } from 'next';

export const generateMetadata = (): Metadata => {
  return generateMetadataWithCanonical('benchmarks');
};

export default function BenchmarksPage() {
  return (
    <ClientOnly>
      <BenchmarkPageClient />
    </ClientOnly>
  );
}