'use client';

import React from 'react';
import { Model } from '../types';
import { textStyles } from '../utils/theme';
import { tableStyles, iconStyles, containerStyles } from '../utils/layout';
import { shouldShowTogetherPricing } from '../utils/modelUtils';
import brandConfig from '../../config/brand';
import { 
  SharedTable, 
  TableHeader, 
  TableColGroup,
  PaginationControls, 
  SectionTitle, 
  handleTableScroll,
  tableHoverStyles
} from '../shared/TableComponents';

interface ModelTableProps {
  models: Model[];
}

const ModelTable: React.FC<ModelTableProps> = ({ models }) => {
  // Filter out archived models, then sort by status (primary first, then secondary) and then by release date (newest first)
  const displayModels = [...models]
    .filter(model => model.status !== 'archived') // Filter out archived models
    .sort((a, b) => {
      // First sort by status (primary before secondary)
      const statusA = a.status || 'primary'; // Default to primary if not specified
      const statusB = b.status || 'primary'; // Default to primary if not specified
      
      if (statusA !== statusB) {
        // 'primary' should come before 'secondary'
        return statusA === 'primary' ? -1 : 1;
      }
      
      // Then sort by release date (newest first)
      const dateA = a.releaseDate ? new Date(a.releaseDate).getTime() : 0;
      const dateB = b.releaseDate ? new Date(b.releaseDate).getTime() : 0;
      return dateB - dateA;
    });
    
  // State for the current page of models to display
  const [currentPage, setCurrentPage] = React.useState(0);
  const modelsPerPage = 4;
  
  // Calculate total number of pages
  const totalPages = Math.ceil(displayModels.length / modelsPerPage);
  
  // Get models for the current page
  const currentModels = displayModels.slice(
    currentPage * modelsPerPage, 
    (currentPage + 1) * modelsPerPage
  );
  
  // Helper to check if any model has a specific capability or spec - checking all models, not just current page
  const hasAnyModelCapability = (key: string): boolean => {
    return displayModels.some(model => 
      model.capabilities && key in model.capabilities && model.capabilities[key as keyof typeof model.capabilities]
    );
  };
  
  const hasAnyModelSpec = (key: string): boolean => {
    return displayModels.some(model => 
      model.specs && key in model.specs && model.specs[key as keyof typeof model.specs] !== undefined
    );
  };

  // Helper to check if we're showing enterprise models
  const isEnterpriseModels = displayModels.every(model => model.category === 'enterprise');

  // Function to render enterprise-specific fields
  const renderEnterpriseSpecificFields = () => {
    if (!isEnterpriseModels) return null;

    const hasGroundingSources = hasAnyModelSpec('groundingSources');

    return (
      <>
        {/* Model Version Row */}
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`} style={{ backgroundColor: brandConfig.name === 'OMG' ? 'white' : undefined }}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-tag-fill ${iconStyles.tableRowIcon}`}></i> <span className={textStyles.primary}>Model Version</span>
            </div>
          </td>
          {currentModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              <span className={textStyles.primary}>{model.modelVersion || "-"}</span>
            </td>
          ))}
        </tr>

        {/* Grounding Sources Row */}
        {hasGroundingSources && (
          <tr className="cursor-pointer">
            <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`} style={{ backgroundColor: brandConfig.name === 'OMG' ? 'white' : undefined }}>
              <div className={containerStyles.flexCenter}>
                <i className={`bi bi-database-fill ${iconStyles.tableRowIcon}`}></i> <span className={textStyles.primary}>Grounding Sources</span>
              </div>
            </td>
            {currentModels.map(model => (
              <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
                {model.specs?.groundingSources && model.specs.groundingSources.length > 0 ? (
                  <div className="flex flex-wrap justify-center gap-1">
                    {model.specs.groundingSources.map((source, i) => (
                      <span key={i} className={`px-2 py-1 ${brandConfig.name === 'OMG' ? 'bg-gray-200 text-gray-800' : 'bg-gray-700 text-white'} text-xs ${brandConfig.name === 'OMG' ? 'font-sans' : 'font-mono'} rounded inline-block m-0.5`}>
                        {source}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className={textStyles.tertiary}>-</span>
                )}
              </td>
            ))}
          </tr>
        )}
      </>
    );
  };

  // Function to render privacy and security table
  const renderPrivacyAndSecurityTable = () => {
    if (!isEnterpriseModels) return null;

    const hasIntegrations = hasAnyModelSpec('integrations');
    const hasDataPrivacy = displayModels.some(model => model.specs?.dataPrivacy);
    const hasSecurityFeatures = displayModels.some(model => model.specs?.securityFeatures);
    
    if (!hasIntegrations && !hasDataPrivacy && !hasSecurityFeatures) {
      return null;
    }

    // Get all security feature keys across all models and preserve original order
    const allSecurityFeatures = new Set<string>();
    // First, collect all feature keys to maintain order as they appear in models
    const orderedSecurityKeys: string[] = [];
    displayModels.forEach(model => {
      if (model.specs?.securityFeatures) {
        Object.keys(model.specs.securityFeatures).forEach(key => {
          if (!allSecurityFeatures.has(key)) {
            allSecurityFeatures.add(key);
            orderedSecurityKeys.push(key);
          }
        });
      }
    });
    // Use the orderedSecurityKeys to maintain the original order from the JSON
    const securityFeaturesList = orderedSecurityKeys;

    // Calculate column width for consistency across tables
    const columnWidth = currentModels.length > 0 ? `${100 / currentModels.length}%` : 'auto';

    // Format current models for table header
    const headerItems = currentModels.map(model => ({
      id: model.id,
      name: model.name
    }));

    return (
      <div className="mb-6">
        <SectionTitle>Enterprise Features</SectionTitle>
        <SharedTable>
          <TableColGroup items={headerItems} />
          <tbody>
            {/* Integrations Row */}
            {hasIntegrations && (
              <tr className="cursor-pointer">
                <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`} style={{ backgroundColor: brandConfig.name === 'OMG' ? 'white' : undefined }}>
                  <div className={containerStyles.flexCenter}>
                    <i className={`bi bi-puzzle-fill ${iconStyles.tableRowIcon}`}></i> <span className={textStyles.primary}>Integrations</span>
                  </div>
                </td>
                {currentModels.map(model => (
                  <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
                    {model.specs?.integrations && model.specs.integrations.length > 0 ? (
                      <div className="w-full mx-auto overflow-hidden">
                        <div className="flex flex-wrap justify-center gap-x-1 gap-y-1">
                          {model.specs.integrations.map((integration, i) => (
                            <span 
                              key={i} 
                              className={`px-1.5 py-0.5 ${brandConfig.name === 'OMG' ? 'bg-gray-200 text-gray-800' : 'bg-gray-700 text-white'} text-xs ${brandConfig.name === 'OMG' ? 'font-sans' : 'font-mono'} rounded inline-block whitespace-nowrap overflow-hidden text-ellipsis`} 
                              title={integration}
                              style={{maxWidth: '100%'}}
                            >
                              {integration}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <span className={textStyles.tertiary}>-</span>
                    )}
                  </td>
                ))}
              </tr>
            )}

            {/* Data Privacy Row */}
            {hasDataPrivacy && (
              <tr className="cursor-pointer">
                <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`} style={{ backgroundColor: brandConfig.name === 'OMG' ? 'white' : undefined }}>
                  <div className={containerStyles.flexCenter}>
                    <i className={`bi bi-shield-lock-fill ${iconStyles.tableRowIcon}`}></i> <span className={textStyles.primary}>Data Privacy</span>
                  </div>
                </td>
                {currentModels.map(model => (
                  <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
                    {model.specs?.dataPrivacy ? (
                      <div className="flex flex-col items-center text-left">
                        <div className="mb-1 flex items-center">
                          <span className="text-sm text-white font-mono mr-2">Uses data for training:</span>
                          {model.specs.dataPrivacy.usesCustomerDataForTraining !== undefined ? (
                            model.specs.dataPrivacy.usesCustomerDataForTraining ? 
                              <i className={iconStyles.booleanTrue} title="Yes"></i> : 
                              <i className={iconStyles.booleanFalse} title="No"></i>
                          ) : <span className={textStyles.primary}>-</span>}
                        </div>
                        {model.specs.dataPrivacy.dataRetentionPolicy && model.specs.dataPrivacy.dataRetentionPolicy.length > 0 && (
                          <div className="text-gray-300 text-xs text-center">
                            {model.specs.dataPrivacy.dataRetentionPolicy.map((policy, i) => (
                              <div key={i} className={`mb-1 text-xs ${brandConfig.name === 'OMG' ? 'font-sans text-gray-700' : 'font-mono text-gray-300'}`}>{policy}</div>
                            ))}
                          </div>
                        )}
                        
                        {/* Documentation Link */}
                        {model.specs.dataPrivacy.documentation && (
                          <div className="mb-1 mt-1">
                            <a 
                              href={model.specs.dataPrivacy.documentation} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className={`px-3 py-1 ${brandConfig.name === 'OMG' 
                            ? `bg-gray-200 hover:bg-gray-300 text-[${brandConfig.secondaryColor}] hover:text-[${brandConfig.primaryColor}]` 
                            : 'bg-gray-700 hover:bg-gray-600 text-cyan-400 hover:text-fuchsia-500'
                          } text-xs ${brandConfig.name === 'OMG' ? 'font-sans' : 'font-mono'} rounded transition-colors inline-flex items-center gap-1`}
                              title="View data privacy documentation"
                            >
                              🔗 Documentation
                            </a>
                          </div>
                        )}
                        
                        {/* Terms of Use Link */}
                        {model.specs.dataPrivacy.termsOfUse && (
                          <div className="mb-1 mt-1">
                            <a 
                              href={model.specs.dataPrivacy.termsOfUse} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className={`px-3 py-1 ${brandConfig.name === 'OMG' 
                            ? `bg-gray-200 hover:bg-gray-300 text-[${brandConfig.secondaryColor}] hover:text-[${brandConfig.primaryColor}]` 
                            : 'bg-gray-700 hover:bg-gray-600 text-cyan-400 hover:text-fuchsia-500'
                          } text-xs ${brandConfig.name === 'OMG' ? 'font-sans' : 'font-mono'} rounded transition-colors inline-flex items-center gap-1`}
                              title="View terms of use"
                            >
                              🔗 Terms of Use
                            </a>
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className={textStyles.tertiary}>-</span>
                    )}
                  </td>
                ))}
              </tr>
            )}

            {/* Security Features - One row per feature with consistent double height */}
            {hasSecurityFeatures && securityFeaturesList.map(feature => (
              <tr className="cursor-pointer h-[60px]" key={feature}>
                <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`} style={{ backgroundColor: brandConfig.name === 'OMG' ? 'white' : undefined }}>
                  <div className="flex items-center gap-3 h-full">
                    <i className={`bi bi-shield-check ${iconStyles.tableRowIcon}`}></i> 
                    <span className={textStyles.primary}>{feature}</span>
                  </div>
                </td>
                {currentModels.map(model => (
                  <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
                    <div className="flex items-center justify-center h-full">
                      {model.specs?.securityFeatures && feature in model.specs.securityFeatures ? (
                        model.specs.securityFeatures[feature] ? 
                          <i className={iconStyles.booleanTrue} title="Yes"></i> : 
                          <i className={iconStyles.booleanFalse} title="No"></i>
                      ) : (
                        <span className={textStyles.tertiary}>-</span>
                      )}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </SharedTable>
      </div>
    );
  };

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
  
  // Function to handle navigation
  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  // Check if we need to show navigation controls
  const showNavigation = displayModels.length > modelsPerPage;

  // Generate main table rows - Capabilities and Formats
  const renderCapabilitiesRows = () => (
    <>
      {/* Release Date Row */}
      <tr className="cursor-pointer">
        <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`} style={{ backgroundColor: brandConfig.name === 'OMG' ? 'white' : undefined }}>
          <div className={containerStyles.flexCenter}>
            <i className={`bi bi-calendar-date ${iconStyles.tableRowIcon}`}></i> <span className={textStyles.primary}>Release Date</span>
          </div>
        </td>
        {currentModels.map(model => (
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
        <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`} style={{ backgroundColor: brandConfig.name === 'OMG' ? 'white' : undefined }}>
          <div className={containerStyles.flexCenter}>
            <i className={`bi bi-box ${iconStyles.tableRowIcon}`}></i> <span className={textStyles.primary}>Type</span>
          </div>
        </td>
        {currentModels.map(model => (
          <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
            <span className={`capitalize ${textStyles.primary}`}>{model.type || "-"}</span>
          </td>
        ))}
      </tr>
      
      {/* Enterprise-specific fields */}
      {renderEnterpriseSpecificFields()}
      
      {/* Intelligence Row */}
      {hasAnyModelCapability("intelligence") && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`} style={{ backgroundColor: brandConfig.name === 'OMG' ? 'white' : undefined }}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-circle-fill ${iconStyles.tableRowIcon}`}></i> <span className={textStyles.primary}>Intelligence</span>
            </div>
          </td>
          {currentModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {renderRating(model, "intelligence")}
            </td>
          ))}
        </tr>
      )}
      
      {/* Speed Row */}
      {hasAnyModelCapability("speed") && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`} style={{ backgroundColor: brandConfig.name === 'OMG' ? 'white' : undefined }}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-lightning-charge-fill ${iconStyles.tableRowIcon}`}></i> <span className={textStyles.primary}>Speed</span>
            </div>
          </td>
          {currentModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {renderRating(model, "speed")}
            </td>
          ))}
        </tr>
      )}
      
      {/* Reasoning Row */}
      {hasAnyModelCapability("reasoning") && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`} style={{ backgroundColor: brandConfig.name === 'OMG' ? 'white' : undefined }}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-lightbulb-fill ${iconStyles.tableRowIcon}`}></i> <span className={textStyles.primary}>Reasoning</span>
            </div>
          </td>
          {currentModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {renderRating(model, "reasoning")}
            </td>
          ))}
        </tr>
      )}
      
      {/* Reasoning Tokens Row */}
      {hasAnyModelSpec("reasoningTokens") && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`} style={{ backgroundColor: brandConfig.name === 'OMG' ? 'white' : undefined }}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-lightbulb ${iconStyles.tableRowIcon}`}></i> <span className={textStyles.primary}>Reasoning Tokens</span>
            </div>
          </td>
          {currentModels.map(model => (
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
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`} style={{ backgroundColor: brandConfig.name === 'OMG' ? 'white' : undefined }}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-arrow-up-right-square-fill ${iconStyles.tableRowIcon}`}></i> <span className={textStyles.primary}>Input Formats</span>
            </div>
          </td>
          {currentModels.map(model => (
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
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`} style={{ backgroundColor: brandConfig.name === 'OMG' ? 'white' : undefined }}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-arrow-down-right-square-fill ${iconStyles.tableRowIcon}`}></i> <span className={textStyles.primary}>Output Formats</span>
            </div>
          </td>
          {currentModels.map(model => (
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

  // Generate context table rows - Max Input/Output and Knowledge Cutoff
  const renderContextRows = () => (
    <>
      {/* Max Input Tokens Row */}
      {hasAnyModelSpec("maxInputTokens") && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`} style={{ backgroundColor: brandConfig.name === 'OMG' ? 'white' : undefined }}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-sign-turn-right-fill ${iconStyles.tableRowIcon}`}></i> <span className={textStyles.primary}>Max Input</span>
            </div>
          </td>
          {currentModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {model.specs?.maxInputTokens ? (
                <span className={textStyles.primary}>{model.specs.maxInputTokens.toLocaleString()} tokens</span>
              ) : <span className={textStyles.primary}>-</span>}
            </td>
          ))}
        </tr>
      )}

      {/* Max Output Tokens Row */}
      {hasAnyModelSpec("maxOutputTokens") && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`} style={{ backgroundColor: brandConfig.name === 'OMG' ? 'white' : undefined }}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-sign-turn-left-fill ${iconStyles.tableRowIcon} transform rotate-180`}></i> <span className={textStyles.primary}>Max Output</span>
            </div>
          </td>
          {currentModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {model.specs?.maxOutputTokens ? (
                <span className={textStyles.primary}>{model.specs.maxOutputTokens.toLocaleString()} tokens</span>
              ) : <span className={textStyles.primary}>-</span>}
            </td>
          ))}
        </tr>
      )}

      {/* Knowledge Cutoff Row */}
      {hasAnyModelSpec("knowledgeCutoff") && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`} style={{ backgroundColor: brandConfig.name === 'OMG' ? 'white' : undefined }}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-calendar-check-fill ${iconStyles.tableRowIcon}`}></i> <span className={textStyles.primary}>Knowledge Cutoff</span>
            </div>
          </td>
          {currentModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              <span className={textStyles.primary}>{model.specs?.knowledgeCutoff || "-"}</span>
            </td>
          ))}
        </tr>
      )}
    </>
  );

  // Generate pricing table rows
  const renderPricingRows = () => (
    <>
      {/* Input Price Row */}
      {hasAnyModelSpec("pricingInputPerM") && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`} style={{ backgroundColor: brandConfig.name === 'OMG' ? 'white' : undefined }}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-currency-dollar ${iconStyles.tableRowIcon}`}></i> <span className={textStyles.primary}>Input</span>
            </div>
          </td>
          {currentModels.map(model => (
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

      {/* Cached Input Price Row */}
      {hasAnyModelSpec("pricingCachedInputPerM") && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`} style={{ backgroundColor: brandConfig.name === 'OMG' ? 'white' : undefined }}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-clock-history ${iconStyles.tableRowIcon}`}></i> <span className={textStyles.primary}>Cached Input</span>
            </div>
          </td>
          {currentModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {model.specs?.pricingCachedInputPerM !== undefined && model.specs?.pricingCachedInputPerM !== null ? (
                <span className={
                  model.category === 'frontier' 
                    ? tableStyles.metric 
                    : 'text-cyan-400 font-medium tabular-nums font-mono'
                }>
                  ${model.specs.pricingCachedInputPerM.toFixed(2)}
                </span>
              ) : <span className={textStyles.primary}>-</span>}
            </td>
          ))}
        </tr>
      )}

      {/* Output Price Row */}
      {hasAnyModelSpec("pricingOutputPerM") && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`} style={{ backgroundColor: brandConfig.name === 'OMG' ? 'white' : undefined }}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-cash-stack ${iconStyles.tableRowIcon}`}></i> <span className={textStyles.primary}>Output</span>
            </div>
          </td>
          {currentModels.map(model => (
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

  // Check if we need to show each table section
  const hasContextData = hasAnyModelSpec("maxInputTokens") || hasAnyModelSpec("maxOutputTokens") || hasAnyModelSpec("knowledgeCutoff");
  const hasPricingData = hasAnyModelSpec("pricingInputPerM") || hasAnyModelSpec("pricingCachedInputPerM") || hasAnyModelSpec("pricingOutputPerM");
  
  // Determine if we're showing only frontier models or only open models
  const isAllFrontierModels = displayModels.every(model => model.category === 'frontier');
  const isAllOpenModels = displayModels.every(model => model.category === 'open');
  
  // Format current models for table header
  const headerItems = currentModels.map(model => ({
    id: model.id,
    name: model.name
  }));

  return (
    <div className={`${containerStyles.flexCol} transform transition-all duration-300`}>
      <style>{tableHoverStyles}</style>

      <div className="header-area">
        {/* Format Icons Legend (centered) */}
        <div className={`${containerStyles.legend} transform transition-all duration-500 mb-3`}>
          <div 
            className={`${containerStyles.legendBox} hover:shadow-md transition-all duration-300 ${brandConfig.name === 'OMG' ? 'hover:border-blue-500' : 'hover:border-fuchsia-700'}`}
            style={{ backgroundColor: brandConfig.name === 'OMG' ? 'white' : '#1F2937' }}>
            <div className={containerStyles.legendItems}>
              <div className={containerStyles.legendItem}>
                <i className="bi bi-file-text-fill" style={{ color: brandConfig.primaryColor }}></i>
                <span className={`${textStyles.sm} ${textStyles.primary}`}>Text</span>
              </div>
              <div className={containerStyles.legendItem}>
                <i className="bi bi-mic-fill" style={{ color: brandConfig.primaryColor }}></i>
                <span className={`${textStyles.sm} ${textStyles.primary}`}>Speech</span>
              </div>
              <div className={containerStyles.legendItem}>
                <i className="bi bi-image-fill" style={{ color: brandConfig.primaryColor }}></i>
                <span className={`${textStyles.sm} ${textStyles.primary}`}>Image</span>
              </div>
              <div className={containerStyles.legendItem}>
                <i className="bi bi-music-note-beamed" style={{ color: brandConfig.primaryColor }}></i>
                <span className={`${textStyles.sm} ${textStyles.primary}`}>Audio</span>
              </div>
              <div className={containerStyles.legendItem}>
                <i className="bi bi-camera-video-fill" style={{ color: brandConfig.primaryColor }}></i>
                <span className={`${textStyles.sm} ${textStyles.primary}`}>Video</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Pagination controls (positioned to the right and vertically centered) */}
        {showNavigation && (
          <div className="absolute top-1/2 right-8 -translate-y-1/2">
            <PaginationControls 
              currentPage={currentPage}
              totalPages={totalPages}
              onNextPage={handleNextPage}
              onPrevPage={handlePrevPage}
              showNavigation={showNavigation}
            />
          </div>
        )}
      </div>
      
      {/* Main Capabilities and Formats Table */}
      <div className="mb-6">
        <SharedTable>
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
            <span className="text-xs text-gray-400 ml-2 font-normal">
              {isAllFrontierModels ? (
                "(per 1M tokens)"
              ) : isAllOpenModels ? (
                <>(per 1M tokens direct or on <a 
                  href="https://www.together.ai/pricing#inference" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-cyan-400 hover:text-fuchsia-500 transition-colors"
                >Together.ai</a>)</>
              ) : (
                <>(per 1M tokens direct or on <a 
                  href="https://www.together.ai/pricing#inference" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-cyan-400 hover:text-fuchsia-500 transition-colors"
                >Together.ai</a> for open models)</>
              )}
            </span>
          </SectionTitle>
          <SharedTable>
            <tbody>
              {renderPricingRows()}
            </tbody>
          </SharedTable>
        </div>
      )}
      
      {/* Enterprise-specific section for privacy and security */}
      {renderPrivacyAndSecurityTable()}
      
      {/* Resources Table - New table for external links */}
      {displayModels.some(model => model.modelPage || model.releasePost || model.releaseVideo || model.releaseNotes || model.systemCard || model.licenceType || model.huggingFace) && (
        <div className="mb-6">
          <SectionTitle>Resources</SectionTitle>
          <SharedTable>
            <tbody>
              {/* Release Post Row */}
              {displayModels.some(model => model.releasePost) && (
                <tr className="cursor-pointer">
                  <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`} style={{ backgroundColor: brandConfig.name === 'OMG' ? 'white' : undefined }}>
                    <div className={containerStyles.flexCenter}>
                      <i className={`bi bi-newspaper ${iconStyles.tableRowIcon}`}></i> <span className={textStyles.primary}>Release Post</span>
                    </div>
                  </td>
                  {currentModels.map(model => (
                    <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
                      {model.releasePost ? (
                        <a 
                          href={model.releasePost} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className={`px-3 py-1 ${brandConfig.name === 'OMG' 
                            ? `bg-gray-200 hover:bg-gray-300 text-[${brandConfig.secondaryColor}] hover:text-[${brandConfig.primaryColor}]` 
                            : 'bg-gray-700 hover:bg-gray-600 text-cyan-400 hover:text-fuchsia-500'
                          } text-xs ${brandConfig.name === 'OMG' ? 'font-sans' : 'font-mono'} rounded transition-colors inline-flex items-center gap-1`}
                          title="Read release post"
                        >
                          🔗 Link
                        </a>
                      ) : (
                        <span className={textStyles.tertiary}>-</span>
                      )}
                    </td>
                  ))}
                </tr>
              )}
              
              {/* Release Video Row */}
              {displayModels.some(model => model.releaseVideo) && (
                <tr className="cursor-pointer">
                  <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`} style={{ backgroundColor: brandConfig.name === 'OMG' ? 'white' : undefined }}>
                    <div className={containerStyles.flexCenter}>
                      <i className={`bi bi-play-btn ${iconStyles.tableRowIcon}`}></i> <span className={textStyles.primary}>Release Video</span>
                    </div>
                  </td>
                  {currentModels.map(model => (
                    <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
                      {model.releaseVideo ? (
                        <a 
                          href={model.releaseVideo} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className={`px-3 py-1 ${brandConfig.name === 'OMG' 
                            ? `bg-gray-200 hover:bg-gray-300 text-[${brandConfig.secondaryColor}] hover:text-[${brandConfig.primaryColor}]` 
                            : 'bg-gray-700 hover:bg-gray-600 text-cyan-400 hover:text-fuchsia-500'
                          } text-xs ${brandConfig.name === 'OMG' ? 'font-sans' : 'font-mono'} rounded transition-colors inline-flex items-center gap-1`}
                          title="Watch release video"
                        >
                          🔗 Link
                        </a>
                      ) : (
                        <span className={textStyles.tertiary}>-</span>
                      )}
                    </td>
                  ))}
                </tr>
              )}
              
              {/* Additional resource rows */}
              {/* ...other resource rows remain unchanged... */}
              {/* Release Notes Row */}
              {displayModels.some(model => model.releaseNotes) && (
                <tr className="cursor-pointer">
                  <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`} style={{ backgroundColor: brandConfig.name === 'OMG' ? 'white' : undefined }}>
                    <div className={containerStyles.flexCenter}>
                      <i className={`bi bi-list-check ${iconStyles.tableRowIcon}`}></i> <span className={textStyles.primary}>Release Notes</span>
                    </div>
                  </td>
                  {currentModels.map(model => (
                    <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
                      {model.releaseNotes ? (
                        <a 
                          href={model.releaseNotes} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className={`px-3 py-1 ${brandConfig.name === 'OMG' 
                            ? `bg-gray-200 hover:bg-gray-300 text-[${brandConfig.secondaryColor}] hover:text-[${brandConfig.primaryColor}]` 
                            : 'bg-gray-700 hover:bg-gray-600 text-cyan-400 hover:text-fuchsia-500'
                          } text-xs ${brandConfig.name === 'OMG' ? 'font-sans' : 'font-mono'} rounded transition-colors inline-flex items-center gap-1`}
                          title="View release notes"
                        >
                          🔗 Link
                        </a>
                      ) : (
                        <span className={textStyles.tertiary}>-</span>
                      )}
                    </td>
                  ))}
                </tr>
              )}
              
              {/* Model Page Row */}
              {displayModels.some(model => model.modelPage) && (
                <tr className="cursor-pointer">
                  <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`} style={{ backgroundColor: brandConfig.name === 'OMG' ? 'white' : undefined }}>
                    <div className={containerStyles.flexCenter}>
                      <i className={`bi bi-globe2 ${iconStyles.tableRowIcon}`}></i> <span className={textStyles.primary}>Model Page</span>
                    </div>
                  </td>
                  {currentModels.map(model => (
                    <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
                      {model.modelPage ? (
                        <a 
                          href={model.modelPage} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className={`px-3 py-1 ${brandConfig.name === 'OMG' 
                            ? `bg-gray-200 hover:bg-gray-300 text-[${brandConfig.secondaryColor}] hover:text-[${brandConfig.primaryColor}]` 
                            : 'bg-gray-700 hover:bg-gray-600 text-cyan-400 hover:text-fuchsia-500'
                          } text-xs ${brandConfig.name === 'OMG' ? 'font-sans' : 'font-mono'} rounded transition-colors inline-flex items-center gap-1`}
                          title="Visit model page"
                        >
                          🔗 Link
                        </a>
                      ) : (
                        <span className={textStyles.tertiary}>-</span>
                      )}
                    </td>
                  ))}
                </tr>
              )}
              
              {/* System Card Row */}
              {displayModels.some(model => model.systemCard) && (
                <tr className="cursor-pointer">
                  <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`} style={{ backgroundColor: brandConfig.name === 'OMG' ? 'white' : undefined }}>
                    <div className={containerStyles.flexCenter}>
                      <i className={`bi bi-file-earmark-text ${iconStyles.tableRowIcon}`}></i> <span className={textStyles.primary}>System Card</span>
                    </div>
                  </td>
                  {currentModels.map(model => (
                    <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
                      {model.systemCard ? (
                        <a 
                          href={model.systemCard} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className={`px-3 py-1 ${brandConfig.name === 'OMG' 
                            ? `bg-gray-200 hover:bg-gray-300 text-[${brandConfig.secondaryColor}] hover:text-[${brandConfig.primaryColor}]` 
                            : 'bg-gray-700 hover:bg-gray-600 text-cyan-400 hover:text-fuchsia-500'
                          } text-xs ${brandConfig.name === 'OMG' ? 'font-sans' : 'font-mono'} rounded transition-colors inline-flex items-center gap-1`}
                          title="View system card"
                        >
                          🔗 Link
                        </a>
                      ) : (
                        <span className={textStyles.tertiary}>-</span>
                      )}
                    </td>
                  ))}
                </tr>
              )}
              
              {/* Licence Row */}
              {displayModels.some(model => model.licenceType) && (
                <tr className="cursor-pointer">
                  <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`} style={{ backgroundColor: brandConfig.name === 'OMG' ? 'white' : undefined }}>
                    <div className={containerStyles.flexCenter}>
                      <i className={`bi bi-shield-check ${iconStyles.tableRowIcon}`}></i> <span className={textStyles.primary}>Licence</span>
                    </div>
                  </td>
                  {currentModels.map(model => (
                    <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
                      {model.licenceType ? (
                        <div className="flex items-center justify-center">
                          {model.licenceLink ? (
                            <a 
                              href={model.licenceLink} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className={`px-3 py-1 ${brandConfig.name === 'OMG' 
                            ? `bg-gray-200 hover:bg-gray-300 text-[${brandConfig.secondaryColor}] hover:text-[${brandConfig.primaryColor}]` 
                            : 'bg-gray-700 hover:bg-gray-600 text-cyan-400 hover:text-fuchsia-500'
                          } text-xs ${brandConfig.name === 'OMG' ? 'font-sans' : 'font-mono'} rounded transition-colors inline-flex items-center gap-1`}
                              title={`${model.licenceType} licence details`}
                            >
                              🔗 {model.licenceType}
                            </a>
                          ) : (
                            <span className={`px-3 py-1 ${brandConfig.name === 'OMG' ? 'bg-gray-200 text-gray-800' : 'bg-gray-700 text-cyan-400'} text-xs ${brandConfig.name === 'OMG' ? 'font-sans' : 'font-mono'} rounded inline-block`}>
                              {model.licenceType}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className={textStyles.tertiary}>-</span>
                      )}
                    </td>
                  ))}
                </tr>
              )}
              
              {/* Hugging Face Row */}
              {displayModels.some(model => model.huggingFace) && (
                <tr className="cursor-pointer">
                  <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`} style={{ backgroundColor: brandConfig.name === 'OMG' ? 'white' : undefined }}>
                    <div className={containerStyles.flexCenter}>
                      <span className={iconStyles.tableRowIcon}>🤗</span> <span className={textStyles.primary}>Hugging Face</span>
                    </div>
                  </td>
                  {currentModels.map(model => (
                    <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
                      {model.huggingFace ? (
                        <a 
                          href={model.huggingFace} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className={`px-3 py-1 ${brandConfig.name === 'OMG' 
                            ? `bg-gray-200 hover:bg-gray-300 text-[${brandConfig.secondaryColor}] hover:text-[${brandConfig.primaryColor}]` 
                            : 'bg-gray-700 hover:bg-gray-600 text-cyan-400 hover:text-fuchsia-500'
                          } text-xs ${brandConfig.name === 'OMG' ? 'font-sans' : 'font-mono'} rounded transition-colors inline-flex items-center gap-1`}
                          title="View on Hugging Face"
                        >
                          🔗 Link
                        </a>
                      ) : (
                        <span className={textStyles.tertiary}>-</span>
                      )}
                    </td>
                  ))}
                </tr>
              )}
            </tbody>
          </SharedTable>
        </div>
      )}
    </div>
  );
};

export default ModelTable;