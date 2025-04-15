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
          <div
            className={`${containerStyles.appTitle} ${textStyles.primary}`}
            onClick={() => {
              setCurrentView('home');
              setSelectedCompany(null);
            }}
          >
            Generative AI Model Explorer
          </div>
          
          <div>
            {currentView === 'home' && (
              <div className="text-xs pr-4 font-mono">
                Data last updated: <span className="text-fuchsia-500 font-semibold">{
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