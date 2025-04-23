'use client';

import { useState, useEffect, ReactNode } from 'react';

// This component only renders its children on the client, after hydration
// It helps avoid hydration mismatches for code that depends on window/browser APIs
export default function ClientOnly({ children }: { children: ReactNode }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient ? <>{children}</> : null;
}