'use client';

import React, { useState } from 'react';
import { LandscapeData, Company } from './types';
import LandscapeView from './LandscapeView';
import CompanyDetail from './CompanyDetail';
import { textStyles } from './utils/theme';
import { containerStyles } from './utils/layout';
import 'bootstrap-icons/font/bootstrap-icons.css';

interface AILandscapeProps {
  initialData: LandscapeData;
}
const AILandscape: React.FC<AILandscapeProps> = ({ initialData }) => {
  const data: LandscapeData = initialData;
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [currentView, setCurrentView] = useState<'home' | 'company'>('home');
  
  // Handle company selection
  const handleCompanySelect = (companyId: string): void => {
    const company = data.companies.find(c => c.id === companyId);
    if (company) {
      setSelectedCompany(company);
      setCurrentView('company');
    }
  };
  
  // Handle back navigation
  const handleBack = (): void => {
    if (currentView === 'company') {
      setCurrentView('home');
      setSelectedCompany(null);
    }
  };
  
  
  return (
    <div className={containerStyles.appContainer}>
      <header className={containerStyles.header}>
        <div className={containerStyles.headerContent}>
          {/* Left section with back button */}
          <div>
          {currentView === 'company' && (
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
            className="absolute left-1/2 transform -translate-x-1/2 cursor-pointer p-0 m-0 border-0 bg-transparent"
            onClick={() => {
              setCurrentView('home');
              setSelectedCompany(null);
            }}
            aria-label="Home"
          >
            <img
              src="/images/logo.png"
              alt="Generative AI Model Explorer"
              className="h-14"
            />
          </button>
          
          {/* Right section with date (empty on company view) */}
          <div>
            {currentView === 'home' && (
              <div className="text-xs pr-4 font-mono">
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

      <main className={containerStyles.mainContent}>
        {currentView === 'home' && (
          <LandscapeView data={data} onCompanySelect={handleCompanySelect} />
        )}
        
        {currentView === 'company' && selectedCompany && (
          <CompanyDetail
            company={selectedCompany}
            onBack={handleBack}
          />
        )}
      </main>

    </div>
  );
};

export default AILandscape;