'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useIsMobile } from './utils/MobileDetect';
import { hasBypassCookie, setBypassCookie } from './utils/cookieHelper';
import brandConfig from '../config/brand';

export default function MobileNotification({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  const [isBypassed, setIsBypassed] = useState(false);
  
  // Check for bypass cookie on mount
  useEffect(() => {
    setIsBypassed(hasBypassCookie());
  }, []);

  // If not mobile or bypass is active, render children
  if (!isMobile || isBypassed) {
    return <>{children}</>;
  }

  // Use the appropriate brand name and colors from the config
  const brandName = brandConfig.name;
  const primaryColor = brandConfig.primaryColor;
  const secondaryColor = brandConfig.secondaryColor;
  const logoPath = brandConfig.logoPath;

  // Use the brand-appropriate background color
  const bgColor = brandConfig.name === 'OMG' ? 'bg-white' : 'bg-gray-800';
  const textColor = brandConfig.name === 'OMG' ? 'text-gray-900' : 'text-white';
  const textColorSecondary = brandConfig.name === 'OMG' ? 'text-gray-600' : 'text-gray-300';
  const cardBgColor = brandConfig.name === 'OMG' ? 'bg-gray-100' : 'bg-gray-700';
  const labelColor = brandConfig.name === 'OMG' ? 'text-gray-500' : 'text-gray-400';

  return (
    <div className={`min-h-screen ${bgColor} ${textColor} flex flex-col items-center justify-center px-4 py-12`}>
      <div className="max-w-md mx-auto text-center">
        <div className="mb-8 opacity-90">
          <Image 
            src={logoPath}
            alt={`${brandName} Logo`} 
            width={360} 
            height={360} 
            className="mx-auto"
          />
        </div>

        <h1 className="text-2xl font-bold mb-6" style={{ color: primaryColor }}>
          Desktop Experience Required
        </h1>
        
        <p className={`mb-6 ${textColorSecondary}`}>
          {brandName}'s Generative AI Explorer is designed to present complex data visualisations 
          and comparisons that require a larger screen.
        </p>
        
        <p className={`mb-8 ${textColorSecondary}`}>
          For the best experience, please visit this site on a desktop or laptop computer 
          with a screen width of at least 1024 pixels.
        </p>
        
        <div className={`w-full max-w-xs mx-auto ${cardBgColor} rounded-lg p-6`}>
          <p className={`text-sm ${labelColor} mb-4`}>
            Want to continue anyway?
          </p>
          <button 
            onClick={() => {
              // Set the bypass cookie
              setBypassCookie(24); // 24 hour expiry
              // Update state to trigger re-render
              setIsBypassed(true);
            }}
            style={{ 
              backgroundColor: primaryColor,
              boxShadow: `0 0 10px rgba(${parseInt(primaryColor.slice(1, 3), 16)}, ${parseInt(primaryColor.slice(3, 5), 16)}, ${parseInt(primaryColor.slice(5, 7), 16)}, 0.4)`
            }}
            className="w-full hover:opacity-90 text-white py-2 px-4 rounded-md transition-all"
          >
            Continue to Site
          </button>
        </div>
      </div>
    </div>
  );
}