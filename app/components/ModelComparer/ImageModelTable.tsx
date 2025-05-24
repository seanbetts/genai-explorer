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

interface ImageModelTableProps {
  selectedModels: Model[];
  onModelRemove: (modelId: string) => void;
  clearAllButton: React.ReactNode;
}

const ImageModelTable: React.FC<ImageModelTableProps> = ({ selectedModels, onModelRemove, clearAllButton }) => {
  

  const hasAnyModelFeature = (category: string, key: string): boolean => {
    return selectedModels.some(model => 
      model.features && 
      model.features[category as keyof typeof model.features] && 
      key in (model.features[category as keyof typeof model.features] as any)
    );
  };

  const hasAnyAspectRatio = (): boolean => {
    return selectedModels.some(model => model.aspectRatios && Object.keys(model.aspectRatios).length > 0);
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
    </>
  );

  // Render generation features
  const renderGenerationRows = () => (
    <>
      {/* Text to Image */}
      {hasAnyModelFeature('generation', 'textToImage') && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-type ${iconStyles.tableRowIcon}`}></i> 
              <span className={textStyles.primary}>Text to Image</span>
            </div>
          </td>
          {selectedModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {model.features?.generation?.textToImage ? 
                <i className={iconStyles.booleanTrue} title="Yes"></i> : 
                <i className={iconStyles.booleanFalse} title="No"></i>}
            </td>
          ))}
        </tr>
      )}

      {/* Image to Image */}
      {hasAnyModelFeature('generation', 'imageToImage') && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-arrow-repeat ${iconStyles.tableRowIcon}`}></i> 
              <span className={textStyles.primary}>Image to Image</span>
            </div>
          </td>
          {selectedModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {model.features?.generation?.imageToImage ? 
                <i className={iconStyles.booleanTrue} title="Yes"></i> : 
                <i className={iconStyles.booleanFalse} title="No"></i>}
            </td>
          ))}
        </tr>
      )}

      {/* Inpainting */}
      {hasAnyModelFeature('generation', 'inpainting') && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-brush ${iconStyles.tableRowIcon}`}></i> 
              <span className={textStyles.primary}>Inpainting</span>
            </div>
          </td>
          {selectedModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {model.features?.generation?.inpainting ? 
                <i className={iconStyles.booleanTrue} title="Yes"></i> : 
                <i className={iconStyles.booleanFalse} title="No"></i>}
            </td>
          ))}
        </tr>
      )}

      {/* Outpainting */}
      {hasAnyModelFeature('generation', 'outpainting') && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-arrows-expand ${iconStyles.tableRowIcon}`}></i> 
              <span className={textStyles.primary}>Outpainting</span>
            </div>
          </td>
          {selectedModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {model.features?.generation?.outpainting ? 
                <i className={iconStyles.booleanTrue} title="Yes"></i> : 
                <i className={iconStyles.booleanFalse} title="No"></i>}
            </td>
          ))}
        </tr>
      )}
    </>
  );

  // Render aspect ratios
  const renderAspectRatioRows = () => {
    if (!hasAnyAspectRatio()) return null;

    const allRatios = Array.from(new Set(
      selectedModels.flatMap(model => 
        model.aspectRatios ? Object.keys(model.aspectRatios) : []
      )
    )).sort();

    return (
      <>
        {allRatios.map(ratio => (
          <tr key={ratio} className="cursor-pointer">
            <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
              <div className={containerStyles.flexCenter}>
                <i className={`bi bi-aspect-ratio ${iconStyles.tableRowIcon}`}></i> 
                <span className={textStyles.primary}>{ratio}</span>
              </div>
            </td>
            {selectedModels.map(model => (
              <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
                {model.aspectRatios?.[ratio] ? 
                  <i className={iconStyles.booleanTrue} title="Supported"></i> : 
                  <i className={iconStyles.booleanFalse} title="Not supported"></i>}
              </td>
            ))}
          </tr>
        ))}
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
        <p className="text-gray-400">Select image models to compare</p>
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
              { icon: <i className={`bi bi-check-circle-fill ${iconStyles.activeFormat}`}></i>, label: "Supported" },
              { icon: <i className={`bi bi-x-circle-fill ${iconStyles.inactiveFormat}`}></i>, label: "Not Supported" }
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
      
      {/* Aspect Ratios Table */}
      {hasAnyAspectRatio() && (
        <div className="mb-6">
          <SectionTitle>Supported Aspect Ratios</SectionTitle>
          <SharedTable>
            <TableColGroup items={headerItems} />
            <tbody>
              {renderAspectRatioRows()}
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
    </div>
  );
};

export default ImageModelTable;