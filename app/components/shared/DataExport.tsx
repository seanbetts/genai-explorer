'use client';

import React, { useEffect, useRef, useState } from 'react';
import brandConfig from '../../config/brand';

interface DataExportProps {
  data: any[];
  filename: string;
  className?: string;
  buttonText?: string;
  processData?: (data: any[]) => any[];
}

export default function DataExport({ 
  data, 
  filename, 
  className = '',
  buttonText = 'Export Data',
  processData
}: DataExportProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const downloadJSON = () => {
    const processedData = processData ? processData(data) : data;
    const jsonData = JSON.stringify(processedData, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setIsOpen(false);
  };

  const downloadCSV = () => {
    if (!data || data.length === 0) return;

    const processedData = processData ? processData(data) : data;

    // Get all unique keys from all objects to handle varying structures
    const allKeys = new Set<string>();
    processedData.forEach(item => {
      Object.keys(item).forEach(key => allKeys.add(key));
    });
    
    const headers = Array.from(allKeys);
    
    // Convert data to CSV format
    const csvContent = [
      // Header row
      headers.map(header => `"${header}"`).join(','),
      // Data rows
      ...processedData.map(item => 
        headers.map(header => {
          const value = item[header];
          if (value === null || value === undefined) return '""';
          if (typeof value === 'object') return `"${JSON.stringify(value)}"`;
          return `"${String(value).replace(/"/g, '""')}"`;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setIsOpen(false);
  };

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      <div className="flex items-center space-x-2">
        <div className="relative group">
          <button
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
              brandConfig.name === 'OMG' 
                ? 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:ring-blue-500' 
                : 'text-gray-300 bg-gray-800 border border-gray-600 hover:bg-gray-700 focus:ring-fuchsia-500'
            }`}
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: brandConfig.primaryColor }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {buttonText}
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {isOpen && (
            <div className={`absolute left-0 mt-2 w-48 rounded-md shadow-lg ring-1 ring-opacity-5 z-50 ${
              brandConfig.name === 'OMG' 
                ? 'bg-white ring-black' 
                : 'bg-gray-800 ring-gray-600'
            }`}>
              <div className="py-1">
                <button
                  onClick={downloadJSON}
                  className={`flex items-center w-full px-4 py-2 text-sm transition-colors ${
                    brandConfig.name === 'OMG' 
                      ? 'text-gray-700 hover:bg-gray-100' 
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: brandConfig.primaryColor }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download as JSON
                </button>
                <button
                  onClick={downloadCSV}
                  className={`flex items-center w-full px-4 py-2 text-sm transition-colors ${
                    brandConfig.name === 'OMG' 
                      ? 'text-gray-700 hover:bg-gray-100' 
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: brandConfig.primaryColor }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download as CSV
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}