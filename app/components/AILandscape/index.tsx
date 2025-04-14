'use client';

import React, { useState } from 'react';
import landscapeData from '@/data/landscape.json';
import { LandscapeData, Company, ExpandedSections } from './types';
import LandscapeView from './LandscapeView';
import CompanyDetail from './CompanyDetail';

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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div
            className="text-2xl font-bold text-gray-800 cursor-pointer"
            onClick={() => {
              setCurrentView('home');
              setSelectedCompany(null);
            }}
          >
            Generative AI Landscape
          </div>
          
          <div>
            {currentView === 'home' && (
              <div className="text-gray-600 text-sm">
                Last updated: {new Date().toLocaleDateString('en-GB', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4">
        {currentView === 'home' && (
          <LandscapeView data={data} onCompanySelect={handleCompanySelect} />
        )}
        
        {currentView === 'company' && selectedCompany && (
          <CompanyDetail 
            company={selectedCompany} 
            expandedSections={expandedSections} 
            onBack={handleBack}
            onToggleSection={toggleSection}
          />
        )}
      </main>

      <footer className="bg-gray-800 text-white mt-12 py-6">
        <div className="container mx-auto px-4">
          <p>© 2025 AI Landscape Explorer</p>
        </div>
      </footer>
    </div>
  );
};

export default AILandscape;