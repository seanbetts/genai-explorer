'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import brandConfig from '../config/brand';
import { containerStyles } from './utils/layout';
import { textStyles, colors } from './utils/theme';
import { useIsMobile } from './utils/MobileDetect';
import { hasBypassCookie } from './utils/cookieHelper';

interface HeaderProps {
  currentView: string;
  goToHome: () => void;
  handleBack: () => void;
  lastUpdated?: string; // Optional date string for data last updated
  isInModelSelection?: boolean; // Track if we're in model selection phase
}

const Header: React.FC<HeaderProps> = ({ 
  currentView, 
  goToHome,
  handleBack,
  lastUpdated,
  isInModelSelection = false
}) => {
  const isMobile = useIsMobile();
  const [isMobileView, setIsMobileView] = useState(false);
  
  // Check if this is a mobile device that has bypassed the warning
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasBypass = hasBypassCookie();
      setIsMobileView(isMobile && hasBypass);
    }
  }, [isMobile]);

  return (
    <header className={`${brandConfig.name === 'OMG' ? 'bg-gray-200' : 'bg-gray-800'} shadow-md sticky top-0 z-30 border-b ${brandConfig.name === 'OMG' ? 'border-gray-300' : 'border-gray-700'}`}>
      {/* Simplified mobile header */}
      {isMobileView ? (
        <div className="flex justify-center items-center py-3">
          {/* Only show back button and centered logo on mobile */}
          {(currentView === 'company' || currentView === 'benchmark' || (currentView === 'compare' && isInModelSelection)) ? (
            <div className="flex items-center justify-between w-full px-4">
              {/* Back button */}
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-1 transition-colors cursor-pointer focus:outline-none"
                style={{
                  color: brandConfig.name === 'OMG' ? brandConfig.primaryColor : '#d1d5db',
                }}
                aria-label="Go back"
              >
                <i className="bi bi-chevron-left text-lg"></i>
                <span className={`${brandConfig.name === 'OMG' ? 'font-sans' : 'font-mono'} text-sm`}>Back</span>
              </button>
              
              {/* Centered logo */}
              <div className="flex-grow flex justify-center">
                <button
                  type="button"
                  className="cursor-pointer p-0 m-0 border-0 bg-transparent hover:opacity-80 transition-opacity"
                  onClick={goToHome}
                  aria-label="Home"
                >
                  <Image
                    src={brandConfig.logoPath}
                    alt={`${brandConfig.name} - Generative AI Explorer`}
                    width={150}
                    height={42}
                    priority
                    className="h-12 w-auto"
                    onError={(e) => {
                      if (brandConfig.logoPath.endsWith('.webp')) {
                        e.currentTarget.src = brandConfig.logoPath.replace('.webp', '.png');
                      }
                    }}
                  />
                </button>
              </div>
              
              {/* Empty div to balance the layout */}
              <div className="w-10"></div>
            </div>
          ) : (
            /* Just the logo for home view */
            <button
              type="button"
              className="cursor-pointer p-0 m-0 border-0 bg-transparent hover:opacity-80 transition-opacity"
              onClick={goToHome}
              aria-label="Home"
            >
              <Image
                src={brandConfig.logoPath}
                alt={`${brandConfig.name} - Generative AI Explorer`}
                width={180}
                height={50}
                priority
                className="h-14 w-auto"
                onError={(e) => {
                  if (brandConfig.logoPath.endsWith('.webp')) {
                    e.currentTarget.src = brandConfig.logoPath.replace('.webp', '.png');
                  }
                }}
              />
            </button>
          )}
        </div>
      ) : (
        /* Regular desktop header */
        <div className={containerStyles.headerContent}>
          {/* Left section with back button and bulb image */}
          <div className="flex items-center">
            {/* Bulb image (only visible for personal version) */}
            {brandConfig.name === 'The Blueprint' && (
              <button
                type="button"
                onClick={goToHome}
                className="p-0 m-0 border-0 bg-transparent cursor-pointer mr-4 hover:opacity-80 transition-opacity"
                aria-label="Home"
              >
                <Image 
                  src="/images/bulb.webp" 
                  alt="Bulb" 
                  width={48}
                  height={48}
                  onError={(e) => {
                    console.error("Error loading bulb image");
                    e.currentTarget.src = "/images/bulb.png";
                  }}
                />
              </button>
            )}
            
            {/* Back button (visible in company, benchmark, and model selection views) */}
            {(currentView === 'company' || currentView === 'benchmark' || (currentView === 'compare' && isInModelSelection)) && (
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-1 transition-colors cursor-pointer focus:outline-none"
                style={{
                  color: brandConfig.name === 'OMG' ? brandConfig.primaryColor : '#d1d5db',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = brandConfig.name === 'OMG' ? brandConfig.secondaryColor : '#0ABDC6';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = brandConfig.name === 'OMG' ? brandConfig.primaryColor : '#d1d5db';
                }}
                aria-label="Go back"
              >
                <i className="bi bi-chevron-left text-lg"></i>
                <span className={`${brandConfig.name === 'OMG' ? 'font-sans' : 'font-mono'} text-sm`}>Back</span>
              </button>
            )}
          </div>
          
          {/* Centered logo (clickable home) */}
          <button
            type="button"
            className="absolute left-1/2 transform -translate-x-1/2 cursor-pointer p-0 m-0 border-0 bg-transparent hover:opacity-80 transition-opacity"
            onClick={goToHome}
            aria-label="Home"
          >
            <Image
              src={brandConfig.logoPath}
              alt={`${brandConfig.name} - Generative AI Explorer`}
              width={200}
              height={56}
              priority
              className="h-14 w-auto"
              onError={(e) => {
                console.error("Error loading brand logo:", brandConfig.logoPath);
                // If webp fails, try to fall back to original png
                if (brandConfig.logoPath.endsWith('.webp')) {
                  e.currentTarget.src = brandConfig.logoPath.replace('.webp', '.png');
                }
              }}
            />
          </button>
          
          {/* Right section with subscribe button and date */}
          <div className="flex flex-col items-end pr-8">
            {/* Brand-specific links */}
            <div className="flex justify-end">
              {brandConfig.headerLinks.map((link, index) => (
                <a 
                  key={index}
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="no-underline"
                >
                  <div className={`flex ${brandConfig.name === 'OMG' ? 'font-sans' : 'font-mono'} text-[1em] font-medium w-[150px] h-[36px] 
                      ${brandConfig.name === 'The Blueprint' && link.text === 'Subscribe' 
                        ? 'bg-[#EA00D9]' 
                        : brandConfig.name === 'OMG' 
                          ? 'bg-[#4F46E5]'
                          : 'bg-fuchsia-500'
                      } p-2 text-white rounded-[5px] justify-center items-center cursor-pointer hover:-translate-y-[2px] hover:scale-105 transition-all duration-200`}>
                    {link.text}
                  </div>
                </a>
              ))}
            </div>
            
            {/* Data last updated text */}
            {currentView === 'home' && lastUpdated && (
              <div className={`text-[10px] ${brandConfig.name === 'OMG' ? 'font-sans text-gray-600' : 'font-mono text-gray-400'} mt-2 text-right`}>
                Data last updated: <span style={{ color: brandConfig.name === 'OMG' ? brandConfig.primaryColor : brandConfig.secondaryColor }} className="font-semibold">{
                  new Date(lastUpdated).toLocaleDateString('en-GB', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })
                }</span>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;