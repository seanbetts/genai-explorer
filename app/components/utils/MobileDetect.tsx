'use client';

import { useState, useEffect } from 'react';

export function useIsMobile(): boolean {
  // Default to false to avoid flashing mobile notification during SSR
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      // Only check screen width - simpler and more reliable for our use case
      const isMobileSize = window.innerWidth < 1024; // Increased threshold to 1024px
      setIsMobile(isMobileSize);
    };

    // Check on initial render
    checkIfMobile();
    
    // Add window resize listener
    window.addEventListener('resize', checkIfMobile);
    
    // Clean up event listener
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  return isMobile;
}