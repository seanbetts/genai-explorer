'use client';

import React from 'react';
import { Model } from '../types';
import { containerStyles, tableStyles, iconStyles } from '../utils/layout';
import { textStyles } from '../utils/theme';
import { 
  SharedTable, 
  TableHeader, 
  TableColGroup,
  SectionTitle,
  Legend
} from '../shared/TableComponents';

interface AudioModelTableProps {
  selectedModels: Model[];
  onModelRemove: (modelId: string) => void;
  clearAllButton: React.ReactNode;
}

const AudioModelTable: React.FC<AudioModelTableProps> = ({ selectedModels, onModelRemove, clearAllButton }) => {
  
  // Helper function to check if any model has a specified property
  const hasAnyModelSpec = (key: string): boolean => {
    return selectedModels.some(model => 
      model.specs && key in model.specs && model.specs[key as keyof typeof model.specs] !== undefined
    );
  };

  const hasAnyModelFeature = (category: string, key: string): boolean => {
    return selectedModels.some(model => 
      model.features && 
      model.features[category as keyof typeof model.features] && 
      key in (model.features[category as keyof typeof model.features] as any)
    );
  };

  const hasAnySafetyFeature = (): boolean => {
    return selectedModels.some(model => model.safety && Object.keys(model.safety).length > 0);
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

      {/* Voice Cloning */}
      {hasAnyModelSpec('voiceCloning') && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-person-voice ${iconStyles.tableRowIcon}`}></i> 
              <span className={textStyles.primary}>Voice Cloning</span>
            </div>
          </td>
          {selectedModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {model.specs?.voiceCloning !== undefined ? (
                model.specs.voiceCloning ? 
                  <i className={iconStyles.booleanTrue} title="Yes"></i> : 
                  <i className={iconStyles.booleanFalse} title="No"></i>
              ) : <span className={textStyles.primary}>-</span>}
            </td>
          ))}
        </tr>
      )}

      {/* Emotion Control */}
      {hasAnyModelSpec('emotionControl') && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-emoji-smile ${iconStyles.tableRowIcon}`}></i> 
              <span className={textStyles.primary}>Emotion Control</span>
            </div>
          </td>
          {selectedModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {model.specs?.emotionControl !== undefined ? (
                model.specs.emotionControl ? 
                  <i className={iconStyles.booleanTrue} title="Yes"></i> : 
                  <i className={iconStyles.booleanFalse} title="No"></i>
              ) : <span className={textStyles.primary}>-</span>}
            </td>
          ))}
        </tr>
      )}
    </>
  );

  // Render generation features
  const renderGenerationRows = () => (
    <>
      {/* Text to Speech */}
      {hasAnyModelFeature('generation', 'textToSpeech') && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-type ${iconStyles.tableRowIcon}`}></i> 
              <span className={textStyles.primary}>Text to Speech</span>
            </div>
          </td>
          {selectedModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {model.features?.generation?.textToSpeech ? 
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
              <span className={textStyles.primary}>Text to Music</span>
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

      {/* Audio to Audio */}
      {hasAnyModelFeature('generation', 'audioToAudio') && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-arrow-repeat ${iconStyles.tableRowIcon}`}></i> 
              <span className={textStyles.primary}>Audio to Audio</span>
            </div>
          </td>
          {selectedModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {model.features?.generation?.audioToAudio ? 
                <i className={iconStyles.booleanTrue} title="Yes"></i> : 
                <i className={iconStyles.booleanFalse} title="No"></i>}
            </td>
          ))}
        </tr>
      )}
    </>
  );

  // Render supported attributes
  const renderAttributeRows = () => (
    <>
      {/* Supported Genres */}
      {hasAnyModelSpec('genres') && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-tags ${iconStyles.tableRowIcon}`}></i> 
              <span className={textStyles.primary}>Genres</span>
            </div>
          </td>
          {selectedModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {model.specs?.genres ? (
                <span className={textStyles.primary}>{model.specs.genres.length} supported</span>
              ) : <span className={textStyles.primary}>-</span>}
            </td>
          ))}
        </tr>
      )}

      {/* Language Support */}
      {hasAnyModelSpec('languageSupport') && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-translate ${iconStyles.tableRowIcon}`}></i> 
              <span className={textStyles.primary}>Languages</span>
            </div>
          </td>
          {selectedModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {model.specs?.languageSupport ? (
                <span className={textStyles.primary}>{model.specs.languageSupport.length} languages</span>
              ) : <span className={textStyles.primary}>-</span>}
            </td>
          ))}
        </tr>
      )}
    </>
  );

  // Render input/output formats
  const renderFormatRows = () => (
    <>
      {/* Input Formats */}
      {hasAnyModelSpec("inputFormats") && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-arrow-up-right-square-fill ${iconStyles.tableRowIcon}`}></i> 
              <span className={textStyles.primary}>Input Formats</span>
            </div>
          </td>
          {selectedModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              <div className={iconStyles.formatContainer}>
                <i className={`bi bi-file-text-fill ${iconStyles.lg} ${model.specs?.inputFormats?.includes("text") ? iconStyles.activeFormat : iconStyles.inactiveFormat}`} title="Text"></i>
                <i className={`bi bi-music-note-beamed ${iconStyles.lg} ${model.specs?.inputFormats?.includes("audio") ? iconStyles.activeFormat : iconStyles.inactiveFormat}`} title="Audio"></i>
              </div>
            </td>
          ))}
        </tr>
      )}

      {/* Output Formats */}
      {hasAnyModelSpec("outputFormats") && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-arrow-down-right-square-fill ${iconStyles.tableRowIcon}`}></i> 
              <span className={textStyles.primary}>Output Formats</span>
            </div>
          </td>
          {selectedModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              <div className={iconStyles.formatContainer}>
                <i className={`bi bi-music-note-beamed ${iconStyles.lg} ${model.specs?.outputFormats?.includes("audio") ? iconStyles.activeFormat : iconStyles.inactiveFormat}`} title="Audio"></i>
              </div>
            </td>
          ))}
        </tr>
      )}
    </>
  );

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
                <span className={textStyles.primary}>{feature.replace(/([A-Z])/g, ' $1').trim()}</span>
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
      {/* Legend with Clear All button */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex-1">
          <Legend
            items={[
              { icon: <i className={`bi bi-file-text-fill ${iconStyles.activeFormat}`}></i>, label: "Text" },
              { icon: <i className={`bi bi-music-note-beamed ${iconStyles.activeFormat}`}></i>, label: "Audio" }
            ]}
          />
        </div>
        <div className="pr-8">
          {clearAllButton}
        </div>
      </div>
      
      {/* Basic Information Table */}
      <div className="mb-6">
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
      
      {/* Supported Attributes Table */}
      <div className="mb-6">
        <SectionTitle>Supported Attributes</SectionTitle>
        <SharedTable>
          <TableColGroup items={headerItems} />
          <tbody>
            {renderAttributeRows()}
          </tbody>
        </SharedTable>
      </div>
      
      {/* Input/Output Formats Table */}
      <div className="mb-6">
        <SectionTitle>Supported Formats</SectionTitle>
        <SharedTable>
          <TableColGroup items={headerItems} />
          <tbody>
            {renderFormatRows()}
          </tbody>
        </SharedTable>
      </div>
      
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
    </div>
  );
};

export default AudioModelTable;