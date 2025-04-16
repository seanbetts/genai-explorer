'use client';

import React, { useState } from 'react';
import landscapeData from '@/data/landscape.json';
import { LandscapeData, Company, ExpandedSections } from './types';
import LandscapeView from './LandscapeView';
import CompanyDetail from './CompanyDetail';
import { textStyles, containerStyles } from './utils/styles';
import 'bootstrap-icons/font/bootstrap-icons.css';

const AILandscape: React.FC = () => {
  const [data, setData] = useState<LandscapeData>(landscapeData as LandscapeData);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [currentView, setCurrentView] = useState<'home' | 'company'>('home');
  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
    models: true,
    features: true,
    subscriptions: true
  });
  
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
  
  // Toggle section expansion
  const toggleSection = (section: keyof ExpandedSections): void => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  return (
    <div className={containerStyles.appContainer}>
      <header className={containerStyles.header}>
        <div className={containerStyles.headerContent}>
          {/* Left section with back button */}
          <div>
            {currentView === 'company' && (
              <button 
                onClick={handleBack} 
                className="flex items-center gap-1 text-gray-300 hover:text-cyan-400 transition-colors focus:outline-none cursor-pointer"
              >
                <i className="bi bi-chevron-left text-lg"></i> 
                <span className="font-mono text-sm">Back</span>
              </button>
            )}
          </div>
          
          {/* Centered logo */}
          <div
            className="absolute left-1/2 transform -translate-x-1/2 cursor-pointer"
            onClick={() => {
              setCurrentView('home');
              setSelectedCompany(null);
            }}
          >
            <img 
              src="/images/logo.png" 
              alt="Generative AI Model Explorer" 
              className="h-14"
            />
          </div>
          
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
            expandedSections={expandedSections} 
            onBack={handleBack}
            // onToggleSection no longer needed
            // onToggleSection={toggleSection}
          />
        )}
      </main>

    </div>
  );
};

export default AILandscape;