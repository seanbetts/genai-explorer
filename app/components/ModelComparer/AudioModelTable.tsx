'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Model } from '../types';
import { containerStyles, tableStyles, iconStyles } from '../utils/layout';
import { textStyles } from '../utils/theme';
import brandConfig from '../../config/brand';
import { 
  SharedTable, 
  TableHeader, 
  TableColGroup,
  SectionTitle
} from '../shared/TableComponents';

interface AudioModelTableProps {
  selectedModels: Model[];
  onModelRemove: (modelId: string) => void;
  clearAllButton: React.ReactNode;
}

const AudioModelTable: React.FC<AudioModelTableProps> = ({ selectedModels, onModelRemove, clearAllButton }) => {
  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const tableHeaderRef = useRef<HTMLDivElement>(null);
  
  // Handle scroll to show/hide sticky header
  useEffect(() => {
    const handleScroll = () => {
      if (tableHeaderRef.current) {
        const rect = tableHeaderRef.current.getBoundingClientRect();
        // Site header appears to be around 80-100px tall, so we need to account for that
        // Show sticky header when top of original header moves out of view (behind site header)
        const siteHeaderHeight = 135; // Approximate height of the site header
        const shouldShow = rect.top <= siteHeaderHeight;
        
        setShowStickyHeader(shouldShow);
      }
    };

    // Initial check after a short delay to ensure DOM is ready
    const timer = setTimeout(handleScroll, 100);
    
    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // Remove showStickyHeader from dependencies to prevent loop

  const hasAnyModelFeature = (category: string, key: string): boolean => {
    return selectedModels.some(model => 
      model.features && 
      model.features[category as keyof typeof model.features] && 
      key in (model.features[category as keyof typeof model.features] as any)
    );
  };

  const hasAnySafetyFeature = (): boolean => {
    return selectedModels.some(model => 
      model.safety && Object.values(model.safety).some(value => value === true)
    );
  };

  const hasAnyEditingFeature = (): boolean => {
    return selectedModels.some(model => model.features?.editing && Object.keys(model.features.editing).length > 0);
  };

  const hasAnyEnhancementFeature = (): boolean => {
    return selectedModels.some(model => model.features?.enhancement && Object.keys(model.features.enhancement).length > 0);
  };

  const hasAnyAdvancedFeature = (): boolean => {
    return selectedModels.some(model => model.features?.advanced && Object.keys(model.features.advanced).length > 0);
  };

  const hasAnyOtherFeature = (): boolean => {
    return selectedModels.some(model => model.features?.other && Object.keys(model.features.other).length > 0);
  };

  const hasAnyResourceData = (): boolean => {
    return selectedModels.some(model => 
      model.modelPage || model.releasePost || model.releaseVideo || model.systemCard || model.huggingFace || model.termsOfService || model.usagePolicy
    );
  };

  // Format model items for header
  const headerItems = selectedModels.map(model => ({
    id: model.id,
    name: model.name,
    description: model.companyName,
    onRemove: () => onModelRemove(model.id)
  }));

  // Render basic model info
  const renderBasicRows = () => (
    <>
      {/* Release Date */}
      <tr className="cursor-pointer">
        <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
          <div className={containerStyles.flexCenter}>
            <i className={`bi bi-calendar-date ${iconStyles.tableRowIcon}`}></i> 
            <span className={textStyles.primary}>Release Date</span>
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

      {/* Commercial Use */}
      <tr className="cursor-pointer">
        <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
          <div className={containerStyles.flexCenter}>
            <i className={`bi bi-briefcase ${iconStyles.tableRowIcon}`}></i> 
            <span className={textStyles.primary}>Commercial Use</span>
          </div>
        </td>
        {selectedModels.map(model => (
          <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
            {model.commerciallySafe !== undefined ? (
              model.commerciallySafe ? 
                <i className={iconStyles.booleanTrue} title="Yes"></i> : 
                <i className={iconStyles.booleanFalse} title="No"></i>
            ) : <span className={textStyles.primary}>-</span>}
          </td>
        ))}
      </tr>

      {/* API Available */}
      <tr className="cursor-pointer">
        <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
          <div className={containerStyles.flexCenter}>
            <i className={`bi bi-cloud ${iconStyles.tableRowIcon}`}></i> 
            <span className={textStyles.primary}>API Available</span>
          </div>
        </td>
        {selectedModels.map(model => (
          <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
            {model.apiEndpoints?.available !== undefined ? (
              model.apiEndpoints.available ? 
                <i className={iconStyles.booleanTrue} title="Yes"></i> : 
                <i className={iconStyles.booleanFalse} title="No"></i>
            ) : <span className={textStyles.primary}>-</span>}
          </td>
        ))}
      </tr>
    </>
  );

  // Render generation features
  const renderGenerationRows = () => (
    <>
      {/* Text to Voice */}
      {hasAnyModelFeature('generation', 'textToVoice') && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-type ${iconStyles.tableRowIcon}`}></i> 
              <span className={textStyles.primary}>Text-to-Voice</span>
            </div>
          </td>
          {selectedModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {model.features?.generation?.textToVoice ? 
                <i className={iconStyles.booleanTrue} title="Yes"></i> : 
                <i className={iconStyles.booleanFalse} title="No"></i>}
            </td>
          ))}
        </tr>
      )}

      {/* Text to Music */}
      {hasAnyModelFeature('generation', 'textToMusic') && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-music-note-beamed ${iconStyles.tableRowIcon}`}></i> 
              <span className={textStyles.primary}>Text-to-Music</span>
            </div>
          </td>
          {selectedModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {model.features?.generation?.textToMusic ? 
                <i className={iconStyles.booleanTrue} title="Yes"></i> : 
                <i className={iconStyles.booleanFalse} title="No"></i>}
            </td>
          ))}
        </tr>
      )}

      {/* Audio to Music */}
      {hasAnyModelFeature('generation', 'audioToMusic') && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-arrow-repeat ${iconStyles.tableRowIcon}`}></i> 
              <span className={textStyles.primary}>Audio-to-Music</span>
            </div>
          </td>
          {selectedModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {model.features?.generation?.audioToMusic ? 
                <i className={iconStyles.booleanTrue} title="Yes"></i> : 
                <i className={iconStyles.booleanFalse} title="No"></i>}
            </td>
          ))}
        </tr>
      )}

      {/* Custom Lyrics */}
      {hasAnyModelFeature('generation', 'customLyrics') && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-chat-quote ${iconStyles.tableRowIcon}`}></i> 
              <span className={textStyles.primary}>Custom Lyrics</span>
            </div>
          </td>
          {selectedModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {model.features?.generation?.customLyrics ? 
                <i className={iconStyles.booleanTrue} title="Yes"></i> : 
                <i className={iconStyles.booleanFalse} title="No"></i>}
            </td>
          ))}
        </tr>
      )}

      {/* Instrumental */}
      {hasAnyModelFeature('generation', 'instrumental') && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-music-note-list ${iconStyles.tableRowIcon}`}></i> 
              <span className={textStyles.primary}>Instrumental</span>
            </div>
          </td>
          {selectedModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {model.features?.generation?.instrumental ? 
                <i className={iconStyles.booleanTrue} title="Yes"></i> : 
                <i className={iconStyles.booleanFalse} title="No"></i>}
            </td>
          ))}
        </tr>
      )}

      {/* Styles */}
      {hasAnyModelFeature('generation', 'styles') && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-palette ${iconStyles.tableRowIcon}`}></i> 
              <span className={textStyles.primary}>Styles</span>
            </div>
          </td>
          {selectedModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {model.features?.generation?.styles ? 
                <i className={iconStyles.booleanTrue} title="Yes"></i> : 
                <i className={iconStyles.booleanFalse} title="No"></i>}
            </td>
          ))}
        </tr>
      )}

      {/* Negative Styles */}
      {hasAnyModelFeature('generation', 'negativeStyles') && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-dash-circle ${iconStyles.tableRowIcon}`}></i> 
              <span className={textStyles.primary}>Negative Styles</span>
            </div>
          </td>
          {selectedModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {model.features?.generation?.negativeStyles ? 
                <i className={iconStyles.booleanTrue} title="Yes"></i> : 
                <i className={iconStyles.booleanFalse} title="No"></i>}
            </td>
          ))}
        </tr>
      )}

      {/* Personas */}
      {hasAnyModelFeature('generation', 'personas') && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-person ${iconStyles.tableRowIcon}`}></i> 
              <span className={textStyles.primary}>Personas</span>
            </div>
          </td>
          {selectedModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {model.features?.generation?.personas ? 
                <i className={iconStyles.booleanTrue} title="Yes"></i> : 
                <i className={iconStyles.booleanFalse} title="No"></i>}
            </td>
          ))}
        </tr>
      )}

      {/* Durations */}
      {selectedModels.some(model => model.features?.generation?.durations && Array.isArray(model.features.generation.durations) && model.features.generation.durations.length > 0) && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-stopwatch ${iconStyles.tableRowIcon}`}></i> 
              <span className={textStyles.primary}>Durations</span>
            </div>
          </td>
          {selectedModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {model.features?.generation?.durations && Array.isArray(model.features.generation.durations) && model.features.generation.durations.length > 0 ? (
                <div className="flex flex-wrap gap-1 justify-center">
                  {(model.features.generation.durations as number[]).map((duration: number) => (
                    <span key={duration} className={`inline-block px-2 py-1 ${brandConfig.name === 'OMG' ? 'bg-gray-200 text-blue-600 rounded border border-gray-300' : 'bg-gray-700 text-cyan-400 rounded border border-gray-600'} text-xs`}>
                      {duration === 9999 ? 'Unlimited' : `${duration}s`}
                    </span>
                  ))}
                </div>
              ) : (
                <span className={textStyles.primary}>-</span>
              )}
            </td>
          ))}
        </tr>
      )}

      {/* Output Formats */}
      {selectedModels.some(model => model.features?.generation?.outputFormats && Array.isArray(model.features.generation.outputFormats) && model.features.generation.outputFormats.length > 0) && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-file-music ${iconStyles.tableRowIcon}`}></i> 
              <span className={textStyles.primary}>Output Formats</span>
            </div>
          </td>
          {selectedModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {model.features?.generation?.outputFormats && Array.isArray(model.features.generation.outputFormats) && model.features.generation.outputFormats.length > 0 ? (
                <div className="flex flex-wrap gap-1 justify-center">
                  {(model.features.generation.outputFormats as string[]).map((format: string) => (
                    <span key={format} className={`inline-block px-2 py-1 ${brandConfig.name === 'OMG' ? 'bg-gray-200 text-blue-600 rounded border border-gray-300' : 'bg-gray-700 text-cyan-400 rounded border border-gray-600'} text-xs uppercase`}>
                      {format}
                    </span>
                  ))}
                </div>
              ) : (
                <span className={textStyles.primary}>-</span>
              )}
            </td>
          ))}
        </tr>
      )}

      {/* Cover Art */}
      {hasAnyModelFeature('generation', 'coverArt') && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-image ${iconStyles.tableRowIcon}`}></i> 
              <span className={textStyles.primary}>Cover Art</span>
            </div>
          </td>
          {selectedModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {model.features?.generation?.coverArt ? 
                <i className={iconStyles.booleanTrue} title="Yes"></i> : 
                <i className={iconStyles.booleanFalse} title="No"></i>}
            </td>
          ))}
        </tr>
      )}

      {/* Cover Video */}
      {hasAnyModelFeature('generation', 'coverVideo') && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-camera-video ${iconStyles.tableRowIcon}`}></i> 
              <span className={textStyles.primary}>Cover Video</span>
            </div>
          </td>
          {selectedModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {model.features?.generation?.coverVideo ? 
                <i className={iconStyles.booleanTrue} title="Yes"></i> : 
                <i className={iconStyles.booleanFalse} title="No"></i>}
            </td>
          ))}
        </tr>
      )}
    </>
  );

  // Render editing features
  const renderEditingRows = () => {
    if (!hasAnyEditingFeature()) return null;

    const allEditingFeatures = Array.from(new Set(
      selectedModels.flatMap(model => 
        model.features?.editing ? Object.keys(model.features.editing) : []
      )
    )).sort();

    return (
      <>
        {allEditingFeatures.map(feature => (
          <tr key={feature} className="cursor-pointer">
            <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
              <div className={containerStyles.flexCenter}>
                <i className={`bi bi-pencil-square ${iconStyles.tableRowIcon}`}></i> 
                <span className={textStyles.primary}>{feature.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/([A-Z])([A-Z][a-z])/g, '$1 $2').replace(/^\w/, c => c.toUpperCase())}</span>
              </div>
            </td>
            {selectedModels.map(model => (
              <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
                {model.features?.editing?.[feature] ? 
                  <i className={iconStyles.booleanTrue} title="Yes"></i> : 
                  <i className={iconStyles.booleanFalse} title="No"></i>}
              </td>
            ))}
          </tr>
        ))}
      </>
    );
  };

  // Render enhancement features
  const renderEnhancementRows = () => {
    if (!hasAnyEnhancementFeature()) return null;

    const allEnhancements = Array.from(new Set(
      selectedModels.flatMap(model => 
        model.features?.enhancement ? Object.keys(model.features.enhancement) : []
      )
    )).sort();

    return (
      <>
        {allEnhancements.map(feature => (
          <tr key={feature} className="cursor-pointer">
            <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
              <div className={containerStyles.flexCenter}>
                <i className={`bi bi-stars ${iconStyles.tableRowIcon}`}></i> 
                <span className={textStyles.primary}>{feature.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/([A-Z])([A-Z][a-z])/g, '$1 $2').replace(/^\w/, c => c.toUpperCase())}</span>
              </div>
            </td>
            {selectedModels.map(model => (
              <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
                {model.features?.enhancement?.[feature] ? 
                  <i className={iconStyles.booleanTrue} title="Yes"></i> : 
                  <i className={iconStyles.booleanFalse} title="No"></i>}
              </td>
            ))}
          </tr>
        ))}
      </>
    );
  };

  // Render advanced features
  const renderAdvancedRows = () => {
    if (!hasAnyAdvancedFeature()) return null;

    const allAdvancedFeatures = Array.from(new Set(
      selectedModels.flatMap(model => 
        model.features?.advanced ? Object.keys(model.features.advanced) : []
      )
    )).sort();

    return (
      <>
        {allAdvancedFeatures.map(feature => (
          <tr key={feature} className="cursor-pointer">
            <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
              <div className={containerStyles.flexCenter}>
                <i className={`bi bi-gear ${iconStyles.tableRowIcon}`}></i> 
                <span className={textStyles.primary}>{feature.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/([A-Z])([A-Z][a-z])/g, '$1 $2').replace(/^\w/, c => c.toUpperCase())}</span>
              </div>
            </td>
            {selectedModels.map(model => (
              <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
                {model.features?.advanced?.[feature] ? 
                  <i className={iconStyles.booleanTrue} title="Yes"></i> : 
                  <i className={iconStyles.booleanFalse} title="No"></i>}
              </td>
            ))}
          </tr>
        ))}
      </>
    );
  };

  // Render voice and language features
  const renderVoiceLanguageRows = () => {
    if (!hasAnyOtherFeature()) return null;

    return (
      <>
        {/* Available Voices */}
        {selectedModels.some(model => model.features?.other?.voices && Array.isArray(model.features.other.voices) && model.features.other.voices.length > 0) && (
          <tr className="cursor-pointer">
            <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
              <div className={containerStyles.flexCenter}>
                <i className={`bi bi-person-voice ${iconStyles.tableRowIcon}`}></i> 
                <span className={textStyles.primary}>Available Voices</span>
              </div>
            </td>
            {selectedModels.map(model => (
              <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
                {model.features?.other?.voices && Array.isArray(model.features.other.voices) && model.features.other.voices.length > 0 ? (
                  <span className={`inline-block px-2 py-1 ${brandConfig.name === 'OMG' ? 'bg-gray-200 text-blue-600 rounded border border-gray-300' : 'bg-gray-700 text-cyan-400 rounded border border-gray-600'} text-xs`}>
                    {model.features.other.voices.length} voices
                  </span>
                ) : (
                  <span className={textStyles.primary}>-</span>
                )}
              </td>
            ))}
          </tr>
        )}

        {/* Voice Features */}
        {selectedModels.some(model => model.features?.other?.voiceFeatures && Array.isArray(model.features.other.voiceFeatures) && model.features.other.voiceFeatures.length > 0) && (
          <tr className="cursor-pointer">
            <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
              <div className={containerStyles.flexCenter}>
                <i className={`bi bi-sliders ${iconStyles.tableRowIcon}`}></i> 
                <span className={textStyles.primary}>Voice Features</span>
              </div>
            </td>
            {selectedModels.map(model => (
              <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
                {model.features?.other?.voiceFeatures && Array.isArray(model.features.other.voiceFeatures) && model.features.other.voiceFeatures.length > 0 ? (
                  <div className="flex flex-wrap gap-1 justify-center">
                    {(model.features.other.voiceFeatures as string[]).slice(0, 3).map((feature: string) => (
                      <span key={feature} className={`inline-block px-2 py-1 ${brandConfig.name === 'OMG' ? 'bg-gray-200 text-blue-600 rounded border border-gray-300' : 'bg-gray-700 text-cyan-400 rounded border border-gray-600'} text-xs capitalize`}>
                        {feature}
                      </span>
                    ))}
                    {model.features.other.voiceFeatures.length > 3 && (
                      <span className="inline-block px-2 py-1 bg-gray-600 text-gray-300 rounded border border-gray-500 text-xs">
                        +{model.features.other.voiceFeatures.length - 3} more
                      </span>
                    )}
                  </div>
                ) : (
                  <span className={textStyles.primary}>-</span>
                )}
              </td>
            ))}
          </tr>
        )}

        {/* Languages */}
        {selectedModels.some(model => model.features?.other?.languages && Array.isArray(model.features.other.languages) && model.features.other.languages.length > 0) && (
          <tr className="cursor-pointer">
            <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
              <div className={containerStyles.flexCenter}>
                <i className={`bi bi-translate ${iconStyles.tableRowIcon}`}></i> 
                <span className={textStyles.primary}>Languages</span>
              </div>
            </td>
            {selectedModels.map(model => (
              <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
                {model.features?.other?.languages && Array.isArray(model.features.other.languages) && model.features.other.languages.length > 0 ? (
                  <span className={`inline-block px-2 py-1 ${brandConfig.name === 'OMG' ? 'bg-gray-200 text-blue-600 rounded border border-gray-300' : 'bg-gray-700 text-cyan-400 rounded border border-gray-600'} text-xs`}>
                    {model.features.other.languages.length} languages
                  </span>
                ) : (
                  <span className={textStyles.primary}>-</span>
                )}
              </td>
            ))}
          </tr>
        )}
      </>
    );
  };

  // Render resources rows
  const renderResourcesRows = () => {
    if (!hasAnyResourceData()) return null;
    
    return (
      <>
        {/* Release Post */}
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-newspaper ${iconStyles.tableRowIcon}`}></i> 
              <span className={textStyles.primary}>Release Post</span>
            </div>
          </td>
          {selectedModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {model.releasePost ? (
                <a href={model.releasePost} target="_blank" rel="noopener noreferrer" 
                   className={`inline-flex items-center gap-1 px-2 py-1 ${brandConfig.name === 'OMG' ? 'bg-gray-200 hover:bg-gray-300 text-blue-600 hover:text-blue-700 rounded border border-gray-300 hover:border-blue-500' : 'bg-gray-700 hover:bg-gray-600 text-cyan-400 hover:text-cyan-300 rounded border border-gray-600 hover:border-cyan-400'} transition-all text-xs`}>
                  <i className="bi bi-link-45deg text-xs"></i>
                  Link
                </a>
              ) : (
                <span className={textStyles.primary}>-</span>
              )}
            </td>
          ))}
        </tr>

        {/* Release Video */}
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-play-circle ${iconStyles.tableRowIcon}`}></i> 
              <span className={textStyles.primary}>Release Video</span>
            </div>
          </td>
          {selectedModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {model.releaseVideo ? (
                <a href={model.releaseVideo} target="_blank" rel="noopener noreferrer" 
                   className={`inline-flex items-center gap-1 px-2 py-1 ${brandConfig.name === 'OMG' ? 'bg-gray-200 hover:bg-gray-300 text-blue-600 hover:text-blue-700 rounded border border-gray-300 hover:border-blue-500' : 'bg-gray-700 hover:bg-gray-600 text-cyan-400 hover:text-cyan-300 rounded border border-gray-600 hover:border-cyan-400'} transition-all text-xs`}>
                  <i className="bi bi-link-45deg text-xs"></i>
                  Link
                </a>
              ) : (
                <span className={textStyles.primary}>-</span>
              )}
            </td>
          ))}
        </tr>

        {/* Model Page */}
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-globe ${iconStyles.tableRowIcon}`}></i> 
              <span className={textStyles.primary}>Model Page</span>
            </div>
          </td>
          {selectedModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {model.modelPage ? (
                <a href={model.modelPage} target="_blank" rel="noopener noreferrer" 
                   className={`inline-flex items-center gap-1 px-2 py-1 ${brandConfig.name === 'OMG' ? 'bg-gray-200 hover:bg-gray-300 text-blue-600 hover:text-blue-700 rounded border border-gray-300 hover:border-blue-500' : 'bg-gray-700 hover:bg-gray-600 text-cyan-400 hover:text-cyan-300 rounded border border-gray-600 hover:border-cyan-400'} transition-all text-xs`}>
                  <i className="bi bi-link-45deg text-xs"></i>
                  Link
                </a>
              ) : (
                <span className={textStyles.primary}>-</span>
              )}
            </td>
          ))}
        </tr>

        {/* System Card */}
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-file-text ${iconStyles.tableRowIcon}`}></i> 
              <span className={textStyles.primary}>System Card</span>
            </div>
          </td>
          {selectedModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {model.systemCard ? (
                <a href={model.systemCard} target="_blank" rel="noopener noreferrer" 
                   className={`inline-flex items-center gap-1 px-2 py-1 ${brandConfig.name === 'OMG' ? 'bg-gray-200 hover:bg-gray-300 text-blue-600 hover:text-blue-700 rounded border border-gray-300 hover:border-blue-500' : 'bg-gray-700 hover:bg-gray-600 text-cyan-400 hover:text-cyan-300 rounded border border-gray-600 hover:border-cyan-400'} transition-all text-xs`}>
                  <i className="bi bi-link-45deg text-xs"></i>
                  Link
                </a>
              ) : (
                <span className={textStyles.primary}>-</span>
              )}
            </td>
          ))}
        </tr>

        {/* Terms of Service */}
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-file-earmark-text ${iconStyles.tableRowIcon}`}></i> 
              <span className={textStyles.primary}>Terms of Service</span>
            </div>
          </td>
          {selectedModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {model.termsOfService ? (
                <a href={model.termsOfService} target="_blank" rel="noopener noreferrer" 
                   className={`inline-flex items-center gap-1 px-2 py-1 ${brandConfig.name === 'OMG' ? 'bg-gray-200 hover:bg-gray-300 text-blue-600 hover:text-blue-700 rounded border border-gray-300 hover:border-blue-500' : 'bg-gray-700 hover:bg-gray-600 text-cyan-400 hover:text-cyan-300 rounded border border-gray-600 hover:border-cyan-400'} transition-all text-xs`}>
                  <i className="bi bi-link-45deg text-xs"></i>
                  Link
                </a>
              ) : (
                <span className={textStyles.primary}>-</span>
              )}
            </td>
          ))}
        </tr>

        {/* Usage Policy */}
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-file-earmark-check ${iconStyles.tableRowIcon}`}></i> 
              <span className={textStyles.primary}>Usage Policy</span>
            </div>
          </td>
          {selectedModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {model.usagePolicy ? (
                <a href={model.usagePolicy} target="_blank" rel="noopener noreferrer" 
                   className={`inline-flex items-center gap-1 px-2 py-1 ${brandConfig.name === 'OMG' ? 'bg-gray-200 hover:bg-gray-300 text-blue-600 hover:text-blue-700 rounded border border-gray-300 hover:border-blue-500' : 'bg-gray-700 hover:bg-gray-600 text-cyan-400 hover:text-cyan-300 rounded border border-gray-600 hover:border-cyan-400'} transition-all text-xs`}>
                  <i className="bi bi-link-45deg text-xs"></i>
                  Link
                </a>
              ) : (
                <span className={textStyles.primary}>-</span>
              )}
            </td>
          ))}
        </tr>
      </>
    );
  };

  // Render safety features
  const renderSafetyRows = () => {
    if (!hasAnySafetyFeature()) return null;

    const allSafetyFeatures = Array.from(new Set(
      selectedModels.flatMap(model => 
        model.safety ? Object.keys(model.safety) : []
      )
    )).sort();

    return (
      <>
        {allSafetyFeatures.map(feature => (
          <tr key={feature} className="cursor-pointer">
            <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
              <div className={containerStyles.flexCenter}>
                <i className={`bi bi-shield-check ${iconStyles.tableRowIcon}`}></i> 
                <span className={textStyles.primary}>{feature.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/([A-Z])([A-Z][a-z])/g, '$1 $2').replace(/^\w/, c => c.toUpperCase())}</span>
              </div>
            </td>
            {selectedModels.map(model => (
              <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
                {model.safety?.[feature] ? 
                  <i className={iconStyles.booleanTrue} title="Yes"></i> : 
                  <i className={iconStyles.booleanFalse} title="No"></i>}
              </td>
            ))}
          </tr>
        ))}
        
        {/* Metadata */}
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-info-circle ${iconStyles.tableRowIcon}`}></i> 
              <span className={textStyles.primary}>Metadata</span>
            </div>
          </td>
          {selectedModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {model.metadata && Object.keys(model.metadata).length > 0 ? (
                <div className="flex flex-wrap gap-1 justify-center">
                  {Object.entries(model.metadata).map(([key, value]) => (
                    <a 
                      key={key}
                      href={value} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1 px-2 py-1 ${brandConfig.name === 'OMG' ? 'bg-gray-200 hover:bg-gray-300 text-blue-600 hover:text-blue-700 rounded border border-gray-300 hover:border-blue-500' : 'bg-gray-700 hover:bg-gray-600 text-cyan-400 hover:text-cyan-300 rounded border border-gray-600 hover:border-cyan-400'} transition-all text-xs`}
                    >
                      <i className="bi bi-link-45deg text-xs"></i>
                      {key}
                    </a>
                  ))}
                </div>
              ) : (
                <span className={textStyles.primary}>-</span>
              )}
            </td>
          ))}
        </tr>
      </>
    );
  };

  if (selectedModels.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-400">Select audio models to compare</p>
      </div>
    );
  }

  return (
    <div>
      {/* Floating sticky header - appears when original header is out of view */}
      {showStickyHeader && (
        <div className="floating-sticky-header fixed top-32 left-1/2 transform -translate-x-1/2 z-30" style={{ 
          marginTop: '3px',
          width: '1228px',
          borderTopLeftRadius: '0.5rem',
          borderTopRightRadius: '0.5rem',
          borderBottomLeftRadius: '0',
          borderBottomRightRadius: '0',
          overflow: 'hidden',
          backgroundColor: '#2d3748',
          borderBottom: '0.5px solid #EA00D9'
        }}>
          <table className="table-fixed w-full border-collapse">
            <TableColGroup items={headerItems} />
            <TableHeader items={headerItems} />
          </table>
        </div>
      )}

      {/* Clear All button */}
      <div className="flex justify-end items-center mb-4">
        {clearAllButton}
      </div>
      
      {/* Basic Information Table */}
      <div ref={tableHeaderRef} className="mb-6">
        <SharedTable>
          <TableColGroup items={headerItems} />
          <TableHeader items={headerItems} />
          <tbody>
            {renderBasicRows()}
          </tbody>
        </SharedTable>
      </div>
      
      {/* Generation Features Table */}
      <div className="mb-6">
        <SectionTitle>Generation Features</SectionTitle>
        <SharedTable>
          <TableColGroup items={headerItems} />
          <tbody>
            {renderGenerationRows()}
          </tbody>
        </SharedTable>
      </div>
      
      {/* Editing Features Table */}
      {hasAnyEditingFeature() && (
        <div className="mb-6">
          <SectionTitle>Editing Features</SectionTitle>
          <SharedTable>
            <TableColGroup items={headerItems} />
            <tbody>
              {renderEditingRows()}
            </tbody>
          </SharedTable>
        </div>
      )}
      
      {/* Enhancement Features Table */}
      {hasAnyEnhancementFeature() && (
        <div className="mb-6">
          <SectionTitle>Enhancement Features</SectionTitle>
          <SharedTable>
            <TableColGroup items={headerItems} />
            <tbody>
              {renderEnhancementRows()}
            </tbody>
          </SharedTable>
        </div>
      )}
      
      {/* Advanced Features Table */}
      {hasAnyAdvancedFeature() && (
        <div className="mb-6">
          <SectionTitle>Advanced Features</SectionTitle>
          <SharedTable>
            <TableColGroup items={headerItems} />
            <tbody>
              {renderAdvancedRows()}
            </tbody>
          </SharedTable>
        </div>
      )}
      
      {/* Voice & Language Features Table */}
      {hasAnyOtherFeature() && (
        <div className="mb-6">
          <SectionTitle>Voice & Language Features</SectionTitle>
          <SharedTable>
            <TableColGroup items={headerItems} />
            <tbody>
              {renderVoiceLanguageRows()}
            </tbody>
          </SharedTable>
        </div>
      )}
      
      {/* Safety Features Table */}
      {hasAnySafetyFeature() && (
        <div className="mb-6">
          <SectionTitle>Safety Features</SectionTitle>
          <SharedTable>
            <TableColGroup items={headerItems} />
            <tbody>
              {renderSafetyRows()}
            </tbody>
          </SharedTable>
        </div>
      )}
      
      {/* Resources Table */}
      {hasAnyResourceData() && (
        <div className="mb-6">
          <SectionTitle>Resources</SectionTitle>
          <SharedTable>
            <TableColGroup items={headerItems} />
            <tbody>
              {renderResourcesRows()}
            </tbody>
          </SharedTable>
        </div>
      )}
    </div>
  );
};

export default AudioModelTable;