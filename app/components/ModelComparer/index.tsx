'use client';

import React, { useState, useEffect } from 'react';
import { ExplorerData, Model } from '../types';
import { containerStyles, tableStyles } from '../utils/layout';
import { SharedTable } from '../shared/TableComponents';
import { useSearchParams } from 'next/navigation';

interface ModelComparerProps {
  data: ExplorerData;
  onBack: () => void;
}

const ModelComparer: React.FC<ModelComparerProps> = ({ data, onBack }) => {
  const searchParams = useSearchParams();
  const [selectedModels, setSelectedModels] = useState<Model[]>([]);
  const [allModels, setAllModels] = useState<Model[]>([]);
  
  // Extract model IDs from URL or use defaults
  useEffect(() => {
    // Flatten all models from all companies into a single array
    const modelsArray: Model[] = [];
    data.companies.forEach(company => {
      if (company.models) {
        company.models.forEach(model => {
          // Add company info to the model
          modelsArray.push({
            ...model,
            companyId: company.id,
            companyName: company.name
          } as Model & { companyId: string; companyName: string });
        });
      }
    });
    
    setAllModels(modelsArray);
    
    // Get model IDs from URL parameter
    const modelParam = searchParams.get('models');
    if (modelParam) {
      const modelIds = modelParam.split(',');
      // Filter models based on IDs from URL
      const models = modelsArray.filter(model => modelIds.includes(model.id));
      setSelectedModels(models.slice(0, 5)); // Limit to 5 models
    } else {
      // If no models specified, select the first 3-5 popular ones as examples
      const topModels = [...modelsArray]
        .sort((a, b) => (b.contextLength || 0) - (a.contextLength || 0))
        .slice(0, 5);
      setSelectedModels(topModels);
    }
  }, [data, searchParams]);
  
  const renderComparison = () => {
    if (selectedModels.length === 0) {
      return (
        <div className="text-center py-10">
          <p className="text-gray-400">Select models to compare</p>
        </div>
      );
    }
    
    return (
      <div className="overflow-x-auto">
        <table className={`${tableStyles.table} w-full`}>
          <thead className={tableStyles.header}>
            <tr>
              <th className={`${tableStyles.headerCell} w-1/5`}>Feature</th>
              {selectedModels.map(model => (
                <th key={model.id} className={tableStyles.headerCell}>
                  {model.name}
                  <div className="text-xs text-gray-400">{model.companyName}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Basic Specs Section */}
            <tr className={tableStyles.rowEven}>
              <td colSpan={selectedModels.length + 1} className={`${tableStyles.cell} text-fuchsia-500 font-semibold`}>
                Basic Specifications
              </td>
            </tr>
            
            {/* Release Date */}
            <tr className={tableStyles.rowOdd}>
              <td className={tableStyles.cell}>Release Date</td>
              {selectedModels.map(model => (
                <td key={model.id} className={tableStyles.cell}>
                  {model.releaseDate 
                    ? new Date(model.releaseDate).toLocaleDateString('en-GB', {
                        month: 'short',
                        year: 'numeric'
                      })
                    : '-'}
                </td>
              ))}
            </tr>
            
            {/* Context Length */}
            <tr className={tableStyles.rowEven}>
              <td className={tableStyles.cell}>Context Length</td>
              {selectedModels.map(model => (
                <td key={model.id} className={tableStyles.cell}>
                  {model.contextLength ? model.contextLength.toLocaleString() + ' tokens' : '-'}
                </td>
              ))}
            </tr>
            
            {/* Parameter Count */}
            <tr className={tableStyles.rowOdd}>
              <td className={tableStyles.cell}>Parameter Count</td>
              {selectedModels.map(model => (
                <td key={model.id} className={tableStyles.cell}>
                  {model.parameterCount 
                    ? (model.parameterCount >= 1 
                      ? model.parameterCount.toLocaleString() + 'B' 
                      : (model.parameterCount * 1000).toLocaleString() + 'M')
                    : '-'}
                </td>
              ))}
            </tr>
            
            {/* Training Data */}
            <tr className={tableStyles.rowEven}>
              <td className={tableStyles.cell}>Training Data Cutoff</td>
              {selectedModels.map(model => (
                <td key={model.id} className={tableStyles.cell}>
                  {model.trainingCutoff || model.specs?.knowledgeCutoff || '-'}
                </td>
              ))}
            </tr>
            
            {/* Access & Licensing Section */}
            <tr className={tableStyles.rowOdd}>
              <td colSpan={selectedModels.length + 1} className={`${tableStyles.cell} text-fuchsia-500 font-semibold`}>
                Access & Licensing
              </td>
            </tr>
            
            {/* License */}
            <tr className={tableStyles.rowEven}>
              <td className={tableStyles.cell}>License</td>
              {selectedModels.map(model => (
                <td key={model.id} className={tableStyles.cell}>
                  {model.license || model.licenceType || '-'}
                </td>
              ))}
            </tr>
            
            {/* Model Access */}
            <tr className={tableStyles.rowOdd}>
              <td className={tableStyles.cell}>Access Methods</td>
              {selectedModels.map(model => (
                <td key={model.id} className={tableStyles.cell}>
                  {model.access 
                    ? model.access.join(', ') 
                    : (model.specs?.integrated?.length ? model.specs.integrated.join(', ') : '-')}
                </td>
              ))}
            </tr>
            
            {/* Open Source */}
            <tr className={tableStyles.rowEven}>
              <td className={tableStyles.cell}>Open Source</td>
              {selectedModels.map(model => (
                <td key={model.id} className={tableStyles.cell}>
                  {model.specs?.openSource === true 
                    ? '✓' 
                    : model.specs?.openSource === false 
                      ? '✗' 
                      : '-'}
                </td>
              ))}
            </tr>
            
            {/* Commercial Use */}
            <tr className={tableStyles.rowOdd}>
              <td className={tableStyles.cell}>Commercial Use</td>
              {selectedModels.map(model => (
                <td key={model.id} className={tableStyles.cell}>
                  {model.specs?.commercialUseAllowed === true 
                    ? '✓' 
                    : model.specs?.commercialUseAllowed === false 
                      ? '✗' 
                      : '-'}
                </td>
              ))}
            </tr>
            
            {/* Capabilities Section */}
            <tr className={tableStyles.rowEven}>
              <td colSpan={selectedModels.length + 1} className={`${tableStyles.cell} text-fuchsia-500 font-semibold`}>
                Capabilities
              </td>
            </tr>
            
            {/* Vision */}
            <tr className={tableStyles.rowOdd}>
              <td className={tableStyles.cell}>Vision</td>
              {selectedModels.map(model => (
                <td key={model.id} className={tableStyles.cell}>
                  {model.specs?.inputFormats?.includes('image') ? '✓' : '-'}
                </td>
              ))}
            </tr>
            
            {/* Languages */}
            <tr className={tableStyles.rowEven}>
              <td className={tableStyles.cell}>Languages</td>
              {selectedModels.map(model => (
                <td key={model.id} className={tableStyles.cell}>
                  {model.specs?.languageSupport?.length 
                    ? (model.specs.languageSupport.length > 3 
                        ? `${model.specs.languageSupport.length} languages` 
                        : model.specs.languageSupport.join(', '))
                    : '-'}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    );
  };
  
  const handleModelSelect = (model: Model) => {
    if (selectedModels.length < 5 && !selectedModels.some(m => m.id === model.id)) {
      setSelectedModels([...selectedModels, model]);
    }
  };
  
  const handleModelRemove = (modelId: string) => {
    setSelectedModels(selectedModels.filter(model => model.id !== modelId));
  };
  
  return (
    <div className="w-full max-w-7xl mx-auto">
      
      {/* Selected Models */}
      <div className="bg-gray-800/30 p-6 rounded-lg border border-gray-700 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Selected Models ({selectedModels.length}/5)</h2>
          <button 
            onClick={() => setSelectedModels([])}
            className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 py-1 px-3 rounded"
          >
            Clear All
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {selectedModels.map(model => (
            <div 
              key={model.id}
              className="bg-gray-700 rounded-lg py-1 px-3 text-sm text-cyan-400 flex items-center"
            >
              {model.name}
              <button 
                onClick={() => handleModelRemove(model.id)}
                className="ml-2 text-gray-400 hover:text-gray-300"
              >
                <i className="bi bi-x"></i>
              </button>
            </div>
          ))}
          {selectedModels.length === 0 && (
            <div className="text-gray-400 text-sm">No models selected</div>
          )}
        </div>
      </div>
      
      {/* Model Selection */}
      <div className="bg-gray-800/30 p-6 rounded-lg border border-gray-700 mb-6">
        <h2 className="text-xl font-semibold text-white mb-4">Available Models</h2>
        <p className="text-gray-300 mb-4">
          Select up to 4 models to compare their specifications and capabilities.
        </p>
        
        {/* Simple model selection grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mt-6">
          {allModels
            .filter(model => !selectedModels.some(selected => selected.id === model.id))
            .slice(0, 12) // Limit to first 12 unselected models for this basic version
            .map(model => (
              <div 
                key={model.id}
                onClick={() => handleModelSelect(model)}
                className="bg-gray-700 hover:bg-gray-600 cursor-pointer p-3 rounded-lg border border-gray-600 hover:border-fuchsia-500 transition-all"
              >
                <div className="font-medium text-cyan-400 mb-1">{model.name}</div>
                <div className="text-xs text-gray-300">{model.companyName}</div>
                <div className="text-xs text-gray-400 mt-2 flex items-center">
                  <i className="bi bi-plus-circle mr-1.5 text-fuchsia-500"></i>
                  Add to comparison
                </div>
              </div>
            ))}
        </div>
        
        <div className="mt-6 mb-2 text-sm text-gray-400 flex items-center">
          <i className="bi bi-info-circle mr-2 text-fuchsia-500"></i>
          <span>Coming soon: Model search, filtering, and more detailed comparisons.</span>
        </div>
      </div>
      
      {/* Comparison Table */}
      <div className="bg-gray-800/30 p-6 rounded-lg border border-gray-700">
        <h2 className="text-xl font-semibold text-white mb-4">Comparison</h2>
        {renderComparison()}
      </div>
    </div>
  );
};

export default ModelComparer;