'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ExplorerData, Model } from '../types';
import { containerStyles, tableStyles, iconStyles } from '../utils/layout';
import { textStyles } from '../utils/theme';
import { 
  SharedTable, 
  TableHeader, 
  TableColGroup,
  SectionTitle,
  Legend
} from '../shared/TableComponents';
import { useSearchParams, useRouter } from 'next/navigation';
// Optional: import for debouncing search input (uncomment if you add debounce)
// import { debounce } from 'lodash';

interface ModelComparerProps {
  data: ExplorerData;
  onBack: () => void;
}

const ModelComparer: React.FC<ModelComparerProps> = ({ data, onBack }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedModels, setSelectedModels] = useState<Model[]>([]);
  const [allModels, setAllModels] = useState<Model[]>([]);
  const [displayLimit, setDisplayLimit] = useState<number>(20); // Number of models to display
  
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
  
  // Extract and process all models from data (once)
  const allModelsMemo = useMemo(() => {
    // Flatten all models from all companies into a single array
    const modelsArray: Model[] = [];
    try {
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
    } catch (error) {
      console.error("Error processing model data:", error);
    }
    return modelsArray;
  }, [data]);
  
  // Set initial models from URL or defaults (runs once on load)
  useEffect(() => {
    // Initialize all models
    setAllModels(allModelsMemo);
    
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
  }, [allModelsMemo, searchParams, router]);
  
  // Helper function to check if any model has a specified property
  // Memoize the hasAnyModelCapability function for performance
const hasAnyModelCapability = useMemo(() => {
  return (key: string): boolean => {
    return selectedModels.some(model => 
      model.capabilities && key in model.capabilities && model.capabilities[key as keyof typeof model.capabilities]
    );
  };
}, [selectedModels]);

// Memoize the hasAnyModelSpec function for performance
const hasAnyModelSpec = useMemo(() => {
  return (key: string): boolean => {
    return selectedModels.some(model => 
      model.specs && key in model.specs && model.specs[key as keyof typeof model.specs] !== undefined
    );
  };
}, [selectedModels]);

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

  // Render the rating indicators (circles, lightning, etc)
  const renderRating = (model: Model, type: string) => {
    // Check if capabilities exist for this model
    if (!model.capabilities || !(type in model.capabilities)) {
      return <span className={textStyles.primary}>-</span>;
    }
    
    const value = model.capabilities[type as keyof typeof model.capabilities] as number;
    
    // Get icons based on the capability type
    let icon = "";
    let filledIcon = "";
    
    switch (type) {
      case "intelligence":
        icon = "bi-circle";
        filledIcon = "bi-circle-fill";
        break;
      case "speed":
        icon = "bi-lightning-charge";
        filledIcon = "bi-lightning-charge-fill";
        break;
      case "reasoning":
        icon = "bi-lightbulb";
        filledIcon = "bi-lightbulb-fill";
        break;
      case "creativity":
        icon = "bi-star";
        filledIcon = "bi-stars";
        break;
      default:
        icon = "bi-circle";
        filledIcon = "bi-circle-fill";
    }
    
    // Always render the icons, even if value is 0
    return (
      <div className={iconStyles.ratingContainer}>
        {[...Array(5)].map((_, i) => (
          <i 
            key={i} 
            className={`${i < value ? filledIcon : icon} ${iconStyles.iconSpacing} ${i < value ? iconStyles.activeFormat : iconStyles.inactiveFormat}`}
          ></i>
        ))}
      </div>
    );
  };

  // Generate capabilities rows
  const renderCapabilitiesRows = () => (
    <>
      {/* Release Date Row */}
      <tr className="cursor-pointer">
        <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
          <div className={containerStyles.flexCenter}>
            <i className={`bi bi-calendar-date ${iconStyles.tableRowIcon}`}></i> <span className={textStyles.primary}>Release Date</span>
          </div>
        </td>
        {selectedModels.map(model => (
          <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
            {model.releaseDate ? (
              new Date(model.releaseDate).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })
            ) : "-"}
          </td>
        ))}
      </tr>

      {/* Type Row */}
      <tr className="cursor-pointer">
        <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
          <div className={containerStyles.flexCenter}>
            <i className={`bi bi-box ${iconStyles.tableRowIcon}`}></i> <span className={textStyles.primary}>Type</span>
          </div>
        </td>
        {selectedModels.map(model => (
          <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
            <span className={`capitalize ${textStyles.primary}`}>{model.type || "-"}</span>
          </td>
        ))}
      </tr>
      
      
      {/* Intelligence Row */}
      {hasAnyModelCapability("intelligence") && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-circle-fill ${iconStyles.tableRowIcon}`}></i> <span className={textStyles.primary}>Intelligence</span>
            </div>
          </td>
          {selectedModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {renderRating(model, "intelligence")}
            </td>
          ))}
        </tr>
      )}
      
      {/* Speed Row */}
      {hasAnyModelCapability("speed") && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-lightning-charge-fill ${iconStyles.tableRowIcon}`}></i> <span className={textStyles.primary}>Speed</span>
            </div>
          </td>
          {selectedModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {renderRating(model, "speed")}
            </td>
          ))}
        </tr>
      )}
      
      {/* Reasoning Row */}
      {hasAnyModelCapability("reasoning") && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-lightbulb-fill ${iconStyles.tableRowIcon}`}></i> <span className={textStyles.primary}>Reasoning</span>
            </div>
          </td>
          {selectedModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {renderRating(model, "reasoning")}
            </td>
          ))}
        </tr>
      )}
      
      {/* Reasoning Tokens Row */}
      {hasAnyModelSpec("reasoningTokens") && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-lightbulb ${iconStyles.tableRowIcon}`}></i> <span className={textStyles.primary}>Reasoning Tokens</span>
            </div>
          </td>
          {selectedModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {model.specs?.reasoningTokens !== undefined ? (
                model.specs.reasoningTokens ? 
                  <i className={iconStyles.booleanTrue} title="Yes"></i> : 
                  <i className={iconStyles.booleanFalse} title="No"></i>
              ) : <span className={textStyles.primary}>-</span>}
            </td>
          ))}
        </tr>
      )}
      
      {/* Input Formats Row */}
      {hasAnyModelSpec("inputFormats") && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-arrow-up-right-square-fill ${iconStyles.tableRowIcon}`}></i> <span className={textStyles.primary}>Input Formats</span>
            </div>
          </td>
          {selectedModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              <div className={iconStyles.formatContainer}>
                <i className={`bi bi-file-text-fill ${iconStyles.lg} ${model.specs?.inputFormats?.includes("text") ? iconStyles.activeFormat : iconStyles.inactiveFormat}`} title="Text"></i>
                <i className={`bi bi-mic-fill ${iconStyles.lg} ${model.specs?.inputFormats?.includes("speech") ? iconStyles.activeFormat : iconStyles.inactiveFormat}`} title="Speech"></i>
                <i className={`bi bi-image-fill ${iconStyles.lg} ${model.specs?.inputFormats?.includes("image") ? iconStyles.activeFormat : iconStyles.inactiveFormat}`} title="Image"></i>
                <i className={`bi bi-music-note-beamed ${iconStyles.lg} ${model.specs?.inputFormats?.includes("audio") ? iconStyles.activeFormat : iconStyles.inactiveFormat}`} title="Audio"></i>
                <i className={`bi bi-camera-video-fill ${iconStyles.lg} ${model.specs?.inputFormats?.includes("video") ? iconStyles.activeFormat : iconStyles.inactiveFormat}`} title="Video"></i>
              </div>
            </td>
          ))}
        </tr>
      )}
      
      {/* Output Formats Row */}
      {hasAnyModelSpec("outputFormats") && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-arrow-down-right-square-fill ${iconStyles.tableRowIcon}`}></i> <span className={textStyles.primary}>Output Formats</span>
            </div>
          </td>
          {selectedModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              <div className={iconStyles.formatContainer}>
                <i className={`bi bi-file-text-fill ${iconStyles.lg} ${model.specs?.outputFormats?.includes("text") ? iconStyles.activeFormat : iconStyles.inactiveFormat}`} title="Text"></i>
                <i className={`bi bi-mic-fill ${iconStyles.lg} ${model.specs?.outputFormats?.includes("speech") ? iconStyles.activeFormat : iconStyles.inactiveFormat}`} title="Speech"></i>
                <i className={`bi bi-image-fill ${iconStyles.lg} ${model.specs?.outputFormats?.includes("image") ? iconStyles.activeFormat : iconStyles.inactiveFormat}`} title="Image"></i>
                <i className={`bi bi-music-note-beamed ${iconStyles.lg} ${model.specs?.outputFormats?.includes("audio") ? iconStyles.activeFormat : iconStyles.inactiveFormat}`} title="Audio"></i>
                <i className={`bi bi-camera-video-fill ${iconStyles.lg} ${model.specs?.outputFormats?.includes("video") ? iconStyles.activeFormat : iconStyles.inactiveFormat}`} title="Video"></i>
              </div>
            </td>
          ))}
        </tr>
      )}
    </>
  );

  // Generate context table rows
  const renderContextRows = () => (
    <>
      {/* Max Input Tokens Row */}
      {hasAnyModelSpec("maxInputTokens") && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-sign-turn-right-fill ${iconStyles.tableRowIcon}`}></i> <span className={textStyles.primary}>Max Input</span>
            </div>
          </td>
          {selectedModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {model.specs?.maxInputTokens ? (
                <span className={textStyles.primary}>{model.specs.maxInputTokens.toLocaleString()} tokens</span>
              ) : <span className={textStyles.primary}>-</span>}
            </td>
          ))}
        </tr>
      )}

      {/* Context Length */}
      <tr className="cursor-pointer">
        <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
          <div className={containerStyles.flexCenter}>
            <i className={`bi bi-text-paragraph ${iconStyles.tableRowIcon}`}></i> <span className={textStyles.primary}>Context Length</span>
          </div>
        </td>
        {selectedModels.map(model => (
          <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
            {model.contextLength ? (
              <span className={textStyles.primary}>{model.contextLength.toLocaleString()} tokens</span>
            ) : <span className={textStyles.primary}>-</span>}
          </td>
        ))}
      </tr>

      {/* Max Output Tokens Row */}
      {hasAnyModelSpec("maxOutputTokens") && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-sign-turn-left-fill ${iconStyles.tableRowIcon} transform rotate-180`}></i> <span className={textStyles.primary}>Max Output</span>
            </div>
          </td>
          {selectedModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {model.specs?.maxOutputTokens ? (
                <span className={textStyles.primary}>{model.specs.maxOutputTokens.toLocaleString()} tokens</span>
              ) : <span className={textStyles.primary}>-</span>}
            </td>
          ))}
        </tr>
      )}

      {/* Knowledge Cutoff Row */}
      <tr className="cursor-pointer">
        <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
          <div className={containerStyles.flexCenter}>
            <i className={`bi bi-calendar-check-fill ${iconStyles.tableRowIcon}`}></i> <span className={textStyles.primary}>Knowledge Cutoff</span>
          </div>
        </td>
        {selectedModels.map(model => (
          <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
            <span className={textStyles.primary}>{model.specs?.knowledgeCutoff || model.trainingCutoff || "-"}</span>
          </td>
        ))}
      </tr>
    </>
  );

  // Generate pricing table rows
  const renderPricingRows = () => (
    <>
      {/* Input Price Row */}
      {hasAnyModelSpec("pricingInputPerM") && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-currency-dollar ${iconStyles.tableRowIcon}`}></i> <span className={textStyles.primary}>Input</span>
            </div>
          </td>
          {selectedModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {model.specs?.pricingInputPerM !== undefined && model.specs?.pricingInputPerM !== null ? (
                <span className={
                  model.category === 'frontier' 
                    ? tableStyles.metric 
                    : 'text-cyan-400 font-medium tabular-nums font-mono'
                }>
                  ${model.specs.pricingInputPerM.toFixed(2)}
                </span>
              ) : <span className={textStyles.primary}>-</span>}
            </td>
          ))}
        </tr>
      )}

      {/* Output Price Row */}
      {hasAnyModelSpec("pricingOutputPerM") && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-cash-stack ${iconStyles.tableRowIcon}`}></i> <span className={textStyles.primary}>Output</span>
            </div>
          </td>
          {selectedModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {model.specs?.pricingOutputPerM !== undefined && model.specs?.pricingOutputPerM !== null ? (
                <span className={
                  model.category === 'frontier' 
                    ? tableStyles.metric 
                    : 'text-cyan-400 font-medium tabular-nums font-mono'
                }>
                  ${model.specs.pricingOutputPerM.toFixed(2)}
                </span>
              ) : <span className={textStyles.primary}>-</span>}
            </td>
          ))}
        </tr>
      )}
    </>
  );
  
  // Function to render resources - not displayed in comparison view per requirements
  const renderResourcesRows = () => {
    return null; // Resources table is hidden
  };
  
  const renderComparison = () => {
    if (selectedModels.length === 0) {
      return (
        <div className="text-center py-10">
          <p className="text-gray-400">Select models to compare</p>
        </div>
      );
    }
    
    // Check if we need to show each table section
    const hasContextData = hasAnyModelSpec("maxInputTokens") || hasAnyModelSpec("maxOutputTokens") || hasAnyModelSpec("knowledgeCutoff") || selectedModels.some(m => m.contextLength);
    const hasPricingData = hasAnyModelSpec("pricingInputPerM") || hasAnyModelSpec("pricingOutputPerM");
    // Resources table is hidden per requirements
    
    // Format model items for header
    const headerItems = selectedModels.map(model => ({
      id: model.id,
      name: model.name,
      description: model.companyName,
      onRemove: () => handleModelRemove(model.id) // Add onRemove handler for each model
    }));
    
    return (
      <div>
        {/* Legend with Clear All button */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex-1">
            <Legend
              items={[
                { icon: <i className={`bi bi-file-text-fill ${iconStyles.activeFormat}`}></i>, label: "Text" },
                { icon: <i className={`bi bi-mic-fill ${iconStyles.activeFormat}`}></i>, label: "Speech" },
                { icon: <i className={`bi bi-image-fill ${iconStyles.activeFormat}`}></i>, label: "Image" },
                { icon: <i className={`bi bi-music-note-beamed ${iconStyles.activeFormat}`}></i>, label: "Audio" },
                { icon: <i className={`bi bi-camera-video-fill ${iconStyles.activeFormat}`}></i>, label: "Video" }
              ]}
            />
          </div>
          <div className="pr-8">
            <button 
              onClick={() => {
                setSelectedModels([]);
                updateUrlWithSelectedModels([]);
              }}
              className="bg-gray-700 hover:bg-gray-600 text-gray-300 py-1.5 px-3 rounded focus:outline-none focus:ring-2 focus:ring-fuchsia-500 border border-gray-600 flex flex-col items-center"
              aria-label="Clear all selected models"
              disabled={selectedModels.length === 0}
            >
              <span className="text-xs">Clear All</span>
              <span className="text-[10px] text-gray-400 mt-0.5">({selectedModels.length}/4)</span>
            </button>
          </div>
        </div>
        
        {/* Main Capabilities and Formats Table */}
        <div className="mb-6">
          <SharedTable>
            <TableColGroup items={headerItems} />
            <TableHeader items={headerItems} />
            <tbody>
              {renderCapabilitiesRows()}
            </tbody>
          </SharedTable>
        </div>
        
        {/* Context Table (Max Input/Output and Knowledge Cutoff) */}
        {hasContextData && (
          <div className="mb-6">
            <SectionTitle>Context & Limits</SectionTitle>
            <SharedTable>
              <TableColGroup items={headerItems} />
              <tbody>
                {renderContextRows()}
              </tbody>
            </SharedTable>
          </div>
        )}
        
        {/* Pricing Table */}
        {hasPricingData && (
          <div className="mb-6">
            <SectionTitle>
              Pricing
              <span className="text-xs text-gray-400 ml-2 font-normal">(per 1M tokens)</span>
            </SectionTitle>
            <SharedTable>
              <TableColGroup items={headerItems} />
              <tbody>
                {renderPricingRows()}
              </tbody>
            </SharedTable>
          </div>
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
  
  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Info message if no models are selected */}
      {selectedModels.length === 0 && (
        <div className="bg-gray-800/30 p-6 rounded-lg border border-gray-700 mb-6 text-center">
          <div className="text-gray-300">
            <i className="bi bi-info-circle mr-2 text-fuchsia-500" aria-hidden="true"></i>
            Please select models from below to start comparing (up to 5 models).
          </div>
        </div>
      )}
      
      {/* Model Selection */}
      <div className="bg-gray-800/30 p-6 rounded-lg border border-gray-700 mb-6">
        <h2 className="text-xl font-semibold text-white mb-4">Available Models</h2>
        <p className="text-gray-300 mb-4">
          Select up to 4 models to compare their specifications and capabilities.
        </p>
        
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
                className="w-full bg-gray-700 border border-gray-600 rounded pl-10 px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
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
            </div>
            <div id="search-description" className="sr-only">
              Enter model name or company to filter the list of available models
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <div>
              <label htmlFor="company-filter" className="sr-only">Filter models by company</label>
              <select 
                id="company-filter"
                className="w-full sm:w-auto bg-gray-700 border border-gray-600 rounded px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
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
            <div>
              <label htmlFor="type-filter" className="sr-only">Filter models by type</label>
              <select 
                id="type-filter"
                className="w-full sm:w-auto bg-gray-700 border border-gray-600 rounded px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                value={typeFilter}
                onChange={(e) => {
                  try {
                    // Filter by model type
                    const newTypeFilter = e.target.value;
                    setTypeFilter(newTypeFilter);
                    applyFilters(searchTerm, companyFilter, newTypeFilter);
                  } catch (error) {
                    console.error("Error filtering by type:", error);
                    setAllModels(allModelsMemo);
                  }
                }}
                aria-describedby="type-filter-description"
              >
                <option value="all">All Types</option>
                <option value="frontier">Frontier</option>
                <option value="open">Open</option>
                <option value="enterprise">Enterprise</option>
                <option value="image">Image</option>
                <option value="video">Video</option>
                <option value="music">Music</option>
                <option value="other">Other</option>
              </select>
              <div id="type-filter-description" className="sr-only">
                Select a model type to filter the list of available models
              </div>
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
                className="bg-gray-700 hover:bg-gray-600 cursor-pointer p-3 rounded-lg border border-gray-600 hover:border-fuchsia-500 transition-all"
                tabIndex={0}
                role="button"
                aria-label={`Add ${model.name} by ${model.companyName} to comparison`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleModelSelect(model);
                  }
                }}
              >
                <div className="font-medium text-cyan-400 mb-1">{model.name}</div>
                <div className="text-xs text-gray-300">{model.companyName}</div>
                <div className="text-xs text-gray-400 mt-2 flex items-center">
                  <i className="bi bi-plus-circle mr-1.5 text-fuchsia-500" aria-hidden="true"></i>
                  Add to comparison
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
                className="text-cyan-400 underline"
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
        
        {/* Pagination - "Show more" button */}
        {allModels.length > displayLimit && (
          <div className="mt-4 text-center">
            <button 
              className="bg-gray-700 hover:bg-gray-600 text-cyan-400 px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
              onClick={() => {
                // Increase the display limit by 20 each time
                setDisplayLimit(prevLimit => prevLimit + 20);
              }}
              aria-label="Load more models"
            >
              Show more models ({allModels.length - displayLimit} remaining)
            </button>
          </div>
        )}
        
        {/* "Show all" button if there's a lot of models */}
        {allModels.length > displayLimit + 40 && (
          <div className="mt-2 text-center">
            <button 
              className="text-cyan-400 text-sm"
              onClick={() => {
                // Show all models
                setDisplayLimit(allModels.length);
              }}
              aria-label="Show all remaining models"
            >
              Show all {allModels.length} models
            </button>
          </div>
        )}
      </div>
      
      {/* Comparison Table - only show when models are selected */}
      {selectedModels.length > 0 && (
        <div className="bg-gray-800/30 p-6 rounded-lg border border-gray-700">
          {renderComparison()}
        </div>
      )}
    </div>
  );
};

export default ModelComparer;