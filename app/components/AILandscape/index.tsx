'use client';

import React, { useState, useEffect, lazy, Suspense } from 'react';
import { LandscapeData, Company } from './types';
import LandscapeView from './LandscapeView';
// Dynamically load CompanyDetail to reduce initial bundle size
const CompanyDetail = lazy(() => import('./CompanyDetail'));
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
  
  // On mount, check URL for deep-link to a company
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const companyId = params.get('company');
    if (companyId) {
      const company = data.companies.find(c => c.id === companyId);
      if (company) {
        setSelectedCompany(company);
        setCurrentView('company');
      }
    }
  }, []);
  
  // Utility to update query params without reload
  const updateQuery = (key: string, value?: string) => {
    const params = new URLSearchParams(window.location.search);
    if (value) params.set(key, value);
    else params.delete(key);
    const query = params.toString();
    const newUrl = query ? `${window.location.pathname}?${query}` : window.location.pathname;
    window.history.pushState({}, '', newUrl);
  };
  
  // Handle company selection and persist in URL
  const handleCompanySelect = (companyId: string): void => {
    const company = data.companies.find(c => c.id === companyId);
    if (company) {
      setSelectedCompany(company);
      setCurrentView('company');
      updateQuery('company', companyId);
    }
  };
  
  // Handle back navigation
  // Handle back navigation and clear URL param
  const handleBack = (): void => {
    if (currentView === 'company') {
      setCurrentView('home');
      setSelectedCompany(null);
      updateQuery('company');
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
          <Suspense fallback={
            <div className="animate-pulse p-6 space-y-6">
              <div className="h-6 bg-gray-700 rounded w-32 mx-auto"></div>
              <div className="h-48 bg-gray-700 rounded"></div>
              <div className="h-48 bg-gray-700 rounded"></div>
            </div>
          }>
            <CompanyDetail
              company={selectedCompany}
              onBack={handleBack}
            />
          </Suspense>
        )}
      </main>

    </div>
  );
};

export default AILandscape;