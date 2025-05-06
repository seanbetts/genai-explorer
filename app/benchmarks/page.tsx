import React from 'react';
import ClientOnly from '../components/utils/ClientOnly';
import BenchmarkPageClient from './page-client';

export default function BenchmarksPage() {
  return (
    <ClientOnly>
      <BenchmarkPageClient />
    </ClientOnly>
  );
}