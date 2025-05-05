'use client';

import React from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import brandConfig from '../config/brand';
import { containerStyles } from './utils/layout';

interface HeaderProps {
  currentView: string;
  goToHome: () => void;
  handleBack: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  currentView, 
  goToHome,
  handleBack 
}) => {
  return (
    <header className={containerStyles.header}>
      <div className={containerStyles.headerContent}>
        {/* Left section with back button and bulb image */}
        <div className="flex items-center">
          {/* Bulb image (always visible and clickable) */}
          <button
            type="button"
            onClick={goToHome}
            className="p-0 m-0 border-0 bg-transparent cursor-pointer mr-4 hover:opacity-80 transition-opacity"
            aria-label="Home"
          >
            <Image 
              src="/images/bulb.png" 
              alt="Bulb" 
              width={48}
              height={48}
            />
          </button>
          
          {/* Back button (visible in company and benchmark views) */}
          {(currentView === 'company' || currentView === 'benchmark') && (
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-1 text-gray-300 hover:text-cyan-400 transition-colors cursor-pointer focus:ring-2 focus:ring-cyan-400 focus:ring-offset-0"
              aria-label="Go back"
            >
              <i className="bi bi-chevron-left text-lg"></i>
              <span className="font-mono text-sm">Back</span>
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
                <div className="flex font-mono text-[1em] font-medium w-[150px] h-[36px] bg-[#EA00D9] p-2 text-white rounded-[5px] justify-center items-center cursor-pointer hover:-translate-y-[2px] hover:scale-105 transition-all duration-200">
                  {link.text}
                </div>
              </a>
            ))}
          </div>
          
          {/* Data last updated text */}
          {currentView === 'home' && (
            <div className="text-[10px] font-mono mt-2 text-right">
              Data last updated: <span className="text-cyan-400 font-semibold">{
                new Date().toLocaleDateString('en-GB', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })
              }</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;