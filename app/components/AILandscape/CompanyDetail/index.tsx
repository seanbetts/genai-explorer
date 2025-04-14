'use client';

import React from 'react';
import Image from 'next/image';
import { Company, ExpandedSections } from '../types';
import ModelTable from './ModelTable';
import FeatureGrid from './FeatureGrid';
import SubscriptionGrid from './SubscriptionGrid';

interface CompanyDetailProps {
  company: Company;
  expandedSections: ExpandedSections;
  onBack: () => void;
  onToggleSection: (section: keyof ExpandedSections) => void;
}

const CompanyDetail: React.FC<CompanyDetailProps> = ({ 
  company, 
  expandedSections, 
  onBack, 
  onToggleSection 
}) => {
  return (
    <div>
      <button 
        onClick={onBack} 
        className="mb-4 flex items-center text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
      >
        <i className="bi bi-arrow-left mr-1"></i> Back to landscape
      </button>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between mb-8">
          <div className="flex items-center flex-1">
            <a 
              href={company.website} 
              target="_blank" 
              rel="noopener" 
              className="relative block h-20 w-40 hover:opacity-80 transition-opacity mr-6 flex-shrink-0"
              title="Visit website"
            >
              <Image 
                src={company.logo && company.logo.startsWith("/") ? company.logo : "/images/companies/placeholder.png"} 
                alt={`${company.name} logo`}
                fill
                style={{ objectFit: "contain" }}
              />
            </a>
            <div className="flex-1">
              <p className="text-lg">{company.description}</p>
            </div>
          </div>
          <div className="text-gray-600 text-sm ml-4 flex-shrink-0 self-start">
            Last updated: {
              new Date(company.lastUpdated).toLocaleDateString('en-GB', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })
            }
          </div>
        </div>
        
        <div className="mb-8">
          <h2 
            className="text-2xl font-bold mb-4 flex items-center cursor-pointer"
            onClick={() => onToggleSection('models')}
          >
            <i className={`bi ${expandedSections.models ? 'bi-chevron-down' : 'bi-chevron-right'} mr-2 text-blue-600`}></i>
            Models
          </h2>
          
          {company.models && company.models.length > 0 && expandedSections.models && (
            <ModelTable models={company.models} />
          )}
        </div>
        
        {company.features && company.features.length > 0 && (
          <div className="mb-8">
            <h2 
              className="text-2xl font-bold mb-4 flex items-center cursor-pointer"
              onClick={() => onToggleSection('features')}
            >
              <i className={`bi ${expandedSections.features ? 'bi-chevron-down' : 'bi-chevron-right'} mr-2 text-blue-600`}></i>
              Features
            </h2>
            {expandedSections.features && (
              <FeatureGrid features={company.features} />
            )}
          </div>
        )}
        
        {company.subscriptions && company.subscriptions.length > 0 && (
          <div className="mb-8">
            <h2 
              className="text-2xl font-bold mb-4 flex items-center cursor-pointer"
              onClick={() => onToggleSection('subscriptions')}
            >
              <i className={`bi ${expandedSections.subscriptions ? 'bi-chevron-down' : 'bi-chevron-right'} mr-2 text-blue-600`}></i>
              Subscription Plans
            </h2>
            {expandedSections.subscriptions && (
              <SubscriptionGrid subscriptions={company.subscriptions} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyDetail;