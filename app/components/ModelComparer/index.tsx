'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ExplorerData, Model } from '../types';
import { textStyles } from '../utils/theme';
import brandConfig from '../../config/brand';
import ImageModelTable from './ImageModelTable';
import VideoModelTable from './VideoModelTable';
import AudioModelTable from './AudioModelTable';
import FrontierOpenModelTable from './FrontierOpenModelTable';
import { useSearchParams, useRouter } from 'next/navigation';
// Optional: import for debouncing search input (uncomment if you add debounce)
// import { debounce } from 'lodash';

interface ModelComparerProps {
  data: ExplorerData;
  onBack: () => void;
  onTypeSelected?: () => void;
  resetToTypeSelection?: boolean;
}

const ModelComparer: React.FC<ModelComparerProps> = ({ data, onTypeSelected, resetToTypeSelection }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedModels, setSelectedModels] = useState<Model[]>([]);
  const [allModels, setAllModels] = useState<Model[]>([]);
  const [displayLimit, setDisplayLimit] = useState<number>(8); // Number of models to display (2 rows of 4)
  
  // Model type selection state
  const [selectedModelType, setSelectedModelType] = useState<string | null>(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [companyFilter, setCompanyFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  
  // Update URL when selected models change - preserves other URL parameters
  const updateUrlWithSelectedModels = useCallback((models: Model[]) => {
    if (typeof window !== 'undefined') {
      // Create URLSearchParams from current query string to preserve other parameters
      const params = new URLSearchParams(window.location.search);
      
      // Update the models parameter
      if (models.length > 0) {
        params.set('models', models.map(m => m.id).join(','));
      } else {
        params.delete('models');
      }
      
      // Use Next.js router to update URL without full page reload
      router.replace(`${window.location.pathname}?${params.toString()}`, { 
        scroll: false 
      });
    }
  }, [router]);
  
  // Extract and process all models from data (filtered by selected type)
  const allModelsMemo = useMemo(() => {
    // Flatten all models from all companies into a single array
    const modelsArray: Model[] = [];
    try {
      data.companies.forEach(company => {
        if (company.models) {
          company.models.forEach(model => {
            // Filter by selected model type
            if (selectedModelType) {
              if (selectedModelType === 'frontier-open') {
                // Include frontier and open models
                if (model.category !== 'frontier' && model.category !== 'open') {
                  return;
                }
              } else if (selectedModelType === 'image') {
                if (model.category !== 'image') {
                  return;
                }
              } else if (selectedModelType === 'video') {
                if (model.category !== 'video') {
                  return;
                }
              } else if (selectedModelType === 'audio') {
                if (model.category !== 'audio') {
                  return;
                }
              }
            }
            
            // Filter out models without sufficient comparison data
            // Check if model has meaningful capabilities, specs, or other comparison data
            const hasCapabilities = model.capabilities && Object.keys(model.capabilities).length > 0;
            const hasSpecs = model.specs && Object.keys(model.specs).length > 0;
            const hasFeatures = model.features && Object.keys(model.features).length > 0;
            const hasAspectRatios = model.aspectRatios && Object.keys(model.aspectRatios).length > 0;
            const hasSafety = model.safety && Object.keys(model.safety).length > 0;
            const hasDetailedInfo = model.about || model.contextLength;
            
            // Only include models that have meaningful comparison data beyond just basic info
            if (!hasCapabilities && !hasSpecs && !hasFeatures && !hasAspectRatios && !hasSafety && !hasDetailedInfo) {
              return;
            }
            
            // Add company info to the model
            modelsArray.push({
              ...model,
              companyId: company.id,
              companyName: company.name
            } as Model & { companyId: string; companyName: string });
          });
        }
      });
    } catch (error) {
      console.error("Error processing model data:", error);
    }
    
    // Sort models by release date descending (newest first)
    return modelsArray.sort((a, b) => {
      const dateA = a.releaseDate ? new Date(a.releaseDate).getTime() : 0;
      const dateB = b.releaseDate ? new Date(b.releaseDate).getTime() : 0;
      return dateB - dateA; // Descending order (newest first)
    });
  }, [data, selectedModelType]);
  
  // Apply filters function to centralize filtering logic
  const applyFilters = useCallback((
    search: string, 
    company: string, 
    type: string
  ) => {
    try {
      // Start with all models
      let filtered = [...allModelsMemo];
      
      // Apply search term filter
      if (search) {
        filtered = filtered.filter(model => 
          (model.name?.toLowerCase() || "").includes(search) || 
          (model.companyName?.toLowerCase() || "").includes(search)
        );
      }
      
      // Apply company filter
      if (company !== "all") {
        filtered = filtered.filter(model => model.companyId === company);
      }
      
      // Apply type filter
      if (type !== "all") {
        filtered = filtered.filter(model => model.category === type);
      }
      
      // Update the models
      setAllModels(filtered);
    } catch (error) {
      console.error("Error applying filters:", error);
      setAllModels(allModelsMemo);
    }
  }, [allModelsMemo]);
  
  // Set initial models from URL or defaults (runs once on load)
  useEffect(() => {
    // Apply current filters to initialize the filtered model list
    applyFilters(searchTerm, companyFilter, typeFilter);
    
    try {
      // Get model IDs from URL parameter
      const modelParam = searchParams.get('models');
      if (modelParam) {
        const modelIds = modelParam.split(',');
        // Filter models based on IDs from URL
        const models = allModelsMemo.filter(model => modelIds.includes(model.id));
        setSelectedModels(models.slice(0, 4)); // Limit to 4 models
      } else {
        // Default to no models selected
        setSelectedModels([]);
      }
    } catch (error) {
      console.error("Error initializing model selection:", error);
      // Fallback to empty selection if there's an error
      setSelectedModels([]);
    }
  }, [allModelsMemo, searchParams, router, applyFilters, searchTerm, companyFilter, typeFilter]);
  
  // Handle type selection
  const handleTypeSelection = useCallback((typeId: string) => {
    setSelectedModelType(typeId);
    // Clear filters when switching model types
    setSearchTerm('');
    setCompanyFilter('all');
    setTypeFilter('all');
    if (onTypeSelected) {
      onTypeSelected();
    }
  }, [onTypeSelected]);
  
  // Reset to type selection when requested by parent
  useEffect(() => {
    if (resetToTypeSelection) {
      setSelectedModelType(null);
      setSelectedModels([]);
      updateUrlWithSelectedModels([]);
      // Reset filters and pagination when going back
      setSearchTerm('');
      setCompanyFilter('all');
      setTypeFilter('all');
      setDisplayLimit(8);
    }
  }, [resetToTypeSelection, updateUrlWithSelectedModels]);

  
  const renderComparison = () => {
    if (selectedModels.length === 0) {
      return (
        <div className="text-center py-10">
          <p className="text-gray-400">Select models to compare</p>
        </div>
      );
    }
    
    // Create clear all button props to pass to table components
    const clearAllButton = (
      <button 
        onClick={() => {
          setSelectedModels([]);
          updateUrlWithSelectedModels([]);
        }}
        className={brandConfig.name === 'OMG' 
          ? 'group bg-white/80 hover:bg-blue-600/10 text-gray-700 hover:text-blue-600 py-1.5 px-3 rounded-md border border-gray-300 hover:border-blue-600/50 focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all duration-200 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white/80 disabled:hover:text-gray-700 disabled:hover:border-gray-300'
          : 'group bg-gray-800/60 hover:bg-fuchsia-500/20 text-gray-300 hover:text-fuchsia-400 py-1.5 px-3 rounded-md border border-gray-600/50 hover:border-fuchsia-400/50 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/50 transition-all duration-200 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-gray-800/60 disabled:hover:text-gray-300 disabled:hover:border-gray-600/50'}
        aria-label="Clear all selected models"
        disabled={selectedModels.length === 0}
      >
        <div className="flex items-center gap-1.5">
          <i className={`bi bi-trash3 text-xs ${brandConfig.name === 'OMG' ? 'text-blue-600' : 'text-fuchsia-500'} group-hover:scale-110 transition-transform duration-200`}></i>
          <span className="text-xs font-medium">Clear All</span>
          <span className={`text-[10px] ${brandConfig.name === 'OMG' ? 'text-gray-600 group-hover:text-blue-600' : 'text-gray-500 group-hover:text-fuchsia-400'} ml-0.5`}>({selectedModels.length}/4)</span>
        </div>
      </button>
    );
    
    return (
      <div>
        {/* Render appropriate table component based on selected model type */}
        {selectedModelType === 'frontier-open' && (
          <FrontierOpenModelTable 
            selectedModels={selectedModels} 
            onModelRemove={handleModelRemove}
            clearAllButton={clearAllButton}
          />
        )}
        {selectedModelType === 'image' && (
          <ImageModelTable 
            selectedModels={selectedModels} 
            onModelRemove={handleModelRemove}
            clearAllButton={clearAllButton}
          />
        )}
        {selectedModelType === 'video' && (
          <VideoModelTable 
            selectedModels={selectedModels} 
            onModelRemove={handleModelRemove}
            clearAllButton={clearAllButton}
          />
        )}
        {selectedModelType === 'audio' && (
          <AudioModelTable 
            selectedModels={selectedModels} 
            onModelRemove={handleModelRemove}
            clearAllButton={clearAllButton}
          />
        )}
      </div>
    );
  };
  
  const handleModelSelect = (model: Model) => {
    if (selectedModels.length < 4 && !selectedModels.some(m => m.id === model.id)) {
      const newSelectedModels = [...selectedModels, model];
      setSelectedModels(newSelectedModels);
      updateUrlWithSelectedModels(newSelectedModels);
    }
  };
  
  const handleModelRemove = (modelId: string) => {
    const newSelectedModels = selectedModels.filter(model => model.id !== modelId);
    setSelectedModels(newSelectedModels);
    updateUrlWithSelectedModels(newSelectedModels);
  };
  
  // Helper function to count models with comparison data for a given category
  const getModelCountForCategory = (category: string) => {
    let count = 0;
    data.companies.forEach(company => {
      if (company.models) {
        company.models.forEach(model => {
          // Apply category filter
          if (category === 'frontier-open') {
            if (model.category !== 'frontier' && model.category !== 'open') {
              return;
            }
          } else if (model.category !== category) {
            return;
          }
          
          // Apply the same filtering logic as allModelsMemo
          const hasCapabilities = model.capabilities && Object.keys(model.capabilities).length > 0;
          const hasSpecs = model.specs && Object.keys(model.specs).length > 0;
          const hasFeatures = model.features && Object.keys(model.features).length > 0;
          const hasAspectRatios = model.aspectRatios && Object.keys(model.aspectRatios).length > 0;
          const hasSafety = model.safety && Object.keys(model.safety).length > 0;
          const hasDetailedInfo = model.about || model.contextLength;
          
          // Only count models that have meaningful comparison data
          if (hasCapabilities || hasSpecs || hasFeatures || hasAspectRatios || hasSafety || hasDetailedInfo) {
            count++;
          }
        });
      }
    });
    return count;
  };

  // Model type selection interface
  const renderModelTypeSelection = () => {
    const modelTypes = [
      {
        id: 'frontier-open',
        title: 'Frontier & Open Models',
        description: 'Compare text-based language models including frontier and open source options',
        icon: 'bi-chat-square-text',
        count: getModelCountForCategory('frontier-open')
      },
      {
        id: 'image',
        title: 'Image Models',
        description: 'Compare image generating models',
        icon: 'bi-image',
        count: getModelCountForCategory('image')
      },
      {
        id: 'video',
        title: 'Video Models',
        description: 'Compare video generating models',
        icon: 'bi-camera-video',
        count: getModelCountForCategory('video')
      },
      {
        id: 'audio',
        title: 'Audio Models',
        description: 'Compare audio generating models',
        icon: 'bi-music-note-beamed',
        count: getModelCountForCategory('audio')
      }
    ];

    return (
      <div className="w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className={`text-2xl font-semibold ${textStyles.primary} mb-2 flex items-center justify-center gap-3`}>
            <i className={`bi bi-bar-chart-line ${brandConfig.name === 'OMG' ? 'text-blue-600' : 'text-fuchsia-500'}`}></i>
            Model Comparer
          </h1>
          <p className={textStyles.secondary}>
            Choose the type of models you'd like to compare.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {modelTypes.map(type => (
            <button
              key={type.id}
              onClick={() => handleTypeSelection(type.id)}
              className={brandConfig.name === 'OMG' 
                ? 'bg-gradient-to-br from-gray-100 to-gray-200 hover:from-gray-50 hover:to-gray-100 border border-gray-300 hover:border-blue-600 hover:shadow-lg hover:shadow-blue-600/20 rounded-xl p-6 text-center transition-all duration-300 group transform hover:-translate-y-1 cursor-pointer'
                : 'bg-gradient-to-br from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 border border-gray-600 hover:border-fuchsia-500 hover:shadow-lg hover:shadow-fuchsia-500/20 rounded-xl p-6 text-center transition-all duration-300 group transform hover:-translate-y-1 cursor-pointer'}
              disabled={type.count === 0}
            >
              <div className="flex flex-col items-center justify-between h-full space-y-4">
                <div className={brandConfig.name === 'OMG'
                  ? "w-16 h-16 bg-gray-200 group-hover:bg-gray-100 rounded-full flex items-center justify-center transition-all duration-300"
                  : "w-16 h-16 bg-gray-800 group-hover:bg-gray-700 rounded-full flex items-center justify-center transition-all duration-300"}>
                  <i className={`${type.icon} text-3xl ${brandConfig.name === 'OMG' 
                    ? 'text-blue-600 group-hover:text-blue-500'
                    : 'text-fuchsia-500 group-hover:text-cyan-400'} group-hover:scale-110 transition-all duration-300`}></i>
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <h3 className={`text-lg font-semibold ${brandConfig.name === 'OMG' 
                    ? 'text-gray-900 text-center group-hover:text-blue-500'
                    : 'text-white text-center group-hover:text-cyan-400'} transition-colors`}>
                    {type.title}
                  </h3>
                </div>
                <div className="flex justify-center">
                  {type.count === 0 ? (
                    <span className="text-xs bg-gray-600 px-3 py-1 rounded-full text-gray-400">
                      Coming soon
                    </span>
                  ) : (
                    <span className={brandConfig.name === 'OMG'
                      ? 'text-xs bg-blue-600/20 group-hover:bg-blue-500/20 border border-blue-600/30 group-hover:border-blue-500/30 px-3 py-1 rounded-full text-blue-600 group-hover:text-blue-500 transition-all duration-300'
                      : 'text-xs bg-fuchsia-500/20 group-hover:bg-cyan-400/20 border border-fuchsia-500/30 group-hover:border-cyan-400/30 px-3 py-1 rounded-full text-fuchsia-400 group-hover:text-cyan-400 transition-all duration-300'}>
                      {type.count} models
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Show type selection if no type is selected */}
      {!selectedModelType && renderModelTypeSelection()}
      
      {/* Show model selection and comparison if type is selected */}
      {selectedModelType && (
        <>
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className={`text-2xl font-semibold ${textStyles.primary} mb-2 flex items-center justify-center gap-3`}>
              <i className={`bi bi-bar-chart-line ${brandConfig.name === 'OMG' ? 'text-blue-600' : 'text-fuchsia-500'}`}></i>
              Model Comparer
            </h1>
            <p className={textStyles.secondary}>
              Select models to compare their specifications and capabilities (up to 4 models).
            </p>
          </div>
          
      {/* Model Selection */}
      <div className={brandConfig.name === 'OMG' 
        ? "bg-gray-100/50 p-6 rounded-lg border border-gray-300 mb-6"
        : "bg-gray-800/30 p-6 rounded-lg border border-gray-700 mb-6"}>
        
        {/* Search and filter controls */}
        <div className="flex flex-col md:flex-row gap-3 mb-4">
          <div className="flex-1 relative">
            <label htmlFor="model-search" className="sr-only">Search models by name or company</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="bi bi-search text-gray-400" aria-hidden="true"></i>
              </div>
              <input
                id="model-search"
                type="text"
                placeholder="Search models..."
                className={brandConfig.name === 'OMG'
                  ? 'w-full bg-white border border-gray-300 rounded pl-10 pr-10 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600'
                  : 'w-full bg-gray-700 border border-gray-600 rounded pl-10 pr-10 px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-fuchsia-500'}
                value={searchTerm}
                onChange={(e) => {
                  // Simple client-side filtering with basic error handling
                  try {
                    const newSearchTerm = e.target.value.toLowerCase();
                    setSearchTerm(newSearchTerm);
                    applyFilters(newSearchTerm, companyFilter, typeFilter);
                  } catch (error) {
                    console.error("Error filtering models:", error);
                    setAllModels(allModelsMemo);
                  }
                }}
                aria-label="Search models by name or company"
                aria-describedby="search-description"
              />
              {searchTerm && (
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200 transition-colors"
                  onClick={() => {
                    setSearchTerm('');
                    applyFilters('', companyFilter, typeFilter);
                  }}
                  aria-label="Clear search"
                >
                  <i className="bi bi-x-lg text-sm" aria-hidden="true"></i>
                </button>
              )}
            </div>
            <div id="search-description" className="sr-only">
              Enter model name or company to filter the list of available models
            </div>
          </div>
          <div>
            <label htmlFor="company-filter" className="sr-only">Filter models by company</label>
            <select 
              id="company-filter"
              className={brandConfig.name === 'OMG'
                ? 'w-full sm:w-auto bg-white border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600'
                : 'w-full sm:w-auto bg-gray-700 border border-gray-600 rounded px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-fuchsia-500'}
              value={companyFilter}
              onChange={(e) => {
                try {
                  // Filter by company
                  const newCompanyFilter = e.target.value;
                  setCompanyFilter(newCompanyFilter);
                  applyFilters(searchTerm, newCompanyFilter, typeFilter);
                } catch (error) {
                  console.error("Error filtering by company:", error);
                  setAllModels(allModelsMemo);
                }
              }}
              aria-describedby="company-filter-description"
            >
              <option value="all">All Companies</option>
              {Array.from(new Set(allModelsMemo.map(model => model.companyId)))
                .filter(Boolean)
                .map(companyId => {
                  const company = allModelsMemo.find(model => model.companyId === companyId);
                  return (
                    <option key={companyId} value={companyId}>
                      {company?.companyName || "Unknown Company"}
                    </option>
                  );
                })}
            </select>
            <div id="company-filter-description" className="sr-only">
              Select a company to filter the list of available models
            </div>
          </div>
        </div>
        
        {/* Model selection grid with pagination */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mt-6">
          {allModels
            .filter(model => !selectedModels.some(selected => selected.id === model.id))
            .slice(0, displayLimit) // Use state variable for pagination
            .map(model => (
              <div 
                key={model.id}
                onClick={() => handleModelSelect(model)}
                className={brandConfig.name === 'OMG'
                  ? 'bg-gray-50 hover:bg-gray-100 cursor-pointer p-3 rounded-lg border border-gray-300 hover:border-blue-600 transition-all group relative'
                  : 'bg-gray-700 hover:bg-gray-600 cursor-pointer p-3 rounded-lg border border-gray-600 hover:border-fuchsia-500 transition-all group relative'}
                tabIndex={0}
                role="button"
                aria-label={`Add ${model.name} by ${model.companyName} to comparison`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleModelSelect(model);
                  }
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className={`font-medium ${brandConfig.name === 'OMG' ? 'text-blue-500' : 'text-cyan-400'} mb-1 truncate`}>{model.name}</div>
                    <div className={`text-xs ${brandConfig.name === 'OMG' ? 'text-gray-600' : 'text-gray-300'}`}>{model.companyName}</div>
                  </div>
                  <div className="ml-3 flex-shrink-0">
                    <div className={brandConfig.name === 'OMG'
                      ? 'w-8 h-8 bg-gray-300 group-hover:bg-blue-600 rounded-full flex items-center justify-center transition-all duration-200'
                      : 'w-8 h-8 bg-gray-600 group-hover:bg-fuchsia-500 rounded-full flex items-center justify-center transition-all duration-200'}>
                      <i className={`bi bi-plus text-lg ${brandConfig.name === 'OMG' 
                        ? 'text-blue-600 group-hover:text-white'
                        : 'text-fuchsia-500 group-hover:text-white'}`} aria-hidden="true"></i>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
        
        {/* Empty state for no matches */}
        {allModels.length === 0 && (
          <div className="text-center py-10 text-gray-400 bg-gray-800/50 rounded-lg">
            <i className="bi bi-search text-2xl block mb-2" aria-hidden="true"></i>
            No models found matching your filters
            <div className="mt-2">
              <button 
                className={`${brandConfig.name === 'OMG' ? 'text-blue-500' : 'text-cyan-400'} underline cursor-pointer`}
                onClick={() => {
                  // Reset filter states
                  setSearchTerm('');
                  setCompanyFilter('all');
                  setTypeFilter('all');
                  
                  // Reset to all models
                  setAllModels(allModelsMemo);
                }}
                aria-label="Clear all filters"
              >
                Clear all filters
              </button>
            </div>
          </div>
        )}
        
        {/* Pagination buttons */}
        {allModels.length > 8 && (
          <div className="mt-4 text-center">
            {displayLimit < allModels.length ? (
              <button 
                className={brandConfig.name === 'OMG'
                  ? 'bg-gray-100 hover:bg-gray-200 text-blue-500 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer'
                  : 'bg-gray-700 hover:bg-gray-600 text-cyan-400 px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 cursor-pointer'}
                onClick={() => {
                  // Show all remaining models
                  setDisplayLimit(allModels.length);
                }}
                aria-label="Show all remaining models"
              >
                Show all {allModels.length} models
              </button>
            ) : (
              <button 
                className={brandConfig.name === 'OMG'
                  ? 'bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer'
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-400 px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 cursor-pointer'}
                onClick={() => {
                  // Collapse back to 8 models
                  setDisplayLimit(8);
                }}
                aria-label="Show less models"
              >
                <i className="bi bi-chevron-up mr-1"></i>
                Show less
              </button>
            )}
          </div>
        )}
      </div>
      
          {/* Comparison Table - only show when models are selected */}
          {selectedModels.length > 0 && (
            <div className={brandConfig.name === 'OMG' 
              ? "bg-gray-100/50 p-6 rounded-lg border border-gray-300"
              : "bg-gray-800/30 p-6 rounded-lg border border-gray-700"}>
              {renderComparison()}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ModelComparer;