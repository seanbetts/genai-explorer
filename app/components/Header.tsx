'use client';

import React from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import brandConfig from '../config/brand';
import { containerStyles } from './utils/layout';
import { textStyles, colors } from './utils/theme';

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
    <header className={`${brandConfig.name === 'OMG' ? 'bg-gray-200' : 'bg-gray-800'} shadow-md sticky top-0 z-30 border-b ${brandConfig.name === 'OMG' ? 'border-gray-300' : 'border-gray-700'}`}>
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
                src="/images/bulb.png" 
                alt="Bulb" 
                width={48}
                height={48}
              />
            </button>
          )}
          
          {/* Back button (visible in company and benchmark views) */}
          {(currentView === 'company' || currentView === 'benchmark') && (
            <button
              type="button"
              onClick={handleBack}
              className={`flex items-center gap-1 transition-colors cursor-pointer ${
                brandConfig.name === 'OMG' 
                  ? `text-[${brandConfig.primaryColor}] hover:text-[${brandConfig.secondaryColor}] focus:ring-2 focus:ring-[${brandConfig.secondaryColor}] focus:ring-offset-0` 
                  : 'text-gray-300 hover:text-teal-400 focus:ring-2 focus:ring-teal-400 focus:ring-offset-0'
              }`}
              aria-label="Go back"
            >
              <i className={`bi bi-chevron-left text-lg ${brandConfig.name === 'OMG' ? `text-[${brandConfig.primaryColor}]` : ''}`}></i>
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
          {currentView === 'home' && (
            <div className={`text-[10px] ${brandConfig.name === 'OMG' ? 'font-sans text-gray-600' : 'font-mono text-gray-400'} mt-2 text-right`}>
              Data last updated: <span style={{ color: brandConfig.name === 'OMG' ? brandConfig.primaryColor : brandConfig.secondaryColor }} className="font-semibold">{
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