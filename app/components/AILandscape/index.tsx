 'use client';

import React, { lazy, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
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
  const searchParams = useSearchParams();
  const router = useRouter();

  // Derive selected company and view from URL
  const companyId = searchParams.get('company');
  const selectedCompany = companyId
    ? data.companies.find(c => c.id === companyId) || null
    : null;
  const currentView = selectedCompany ? 'company' : 'home';

  // Handlers to update URL using Next.js shallow routing
  const handleCompanySelect = (id: string) => {
    // Navigate to company view
    router.push(`/?company=${id}`);
  };
  const handleBack = () => {
    // Navigate back to home view
    router.push('/');
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
            onClick={handleBack}
            aria-label="Home"
          >
            <img
              src="/images/logo.png"
              alt="Generative AI Explorer"
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