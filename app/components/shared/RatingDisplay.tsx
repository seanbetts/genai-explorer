'use client';

import React from 'react';
import brandConfig from '../../config/brand';
import { iconStyles } from '../utils/layout';
import { textStyles } from '../utils/theme';

interface RatingDisplayProps {
  value: number | null;
  type: string;
  maxRating?: number;
}

const RatingDisplay: React.FC<RatingDisplayProps> = ({ 
  value, 
  type, 
  maxRating = 5 
}) => {
  // If no rating available or zero, show n/a
  if (value === null || value === undefined || value === 0) {
    return <span className={textStyles.primary}>n/a</span>;
  }

  // Round to nearest 0.5 for half-step display
  const roundedValue = Math.round(value * 2) / 2;
  
  // Calculate full, half, and empty icons
  const fullIcons = Math.floor(roundedValue);
  const hasHalf = (roundedValue % 1) >= 0.5;
  const emptyIcons = maxRating - Math.ceil(roundedValue);
  
  // Get icons based on the rating type
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
    case "stem":
      icon = "bi-calculator";
      filledIcon = "bi-calculator-fill";
      break;
    case "agentic":
      icon = "bi-cpu";
      filledIcon = "bi-cpu-fill";
      break;
    case "coding":
      icon = "bi-terminal";
      filledIcon = "bi-terminal-fill";
      break;
    case "pricing":
      icon = "bi-currency-dollar";
      filledIcon = "bi-currency-dollar";
      break;
    default:
      icon = "bi-circle";
      filledIcon = "bi-circle-fill";
  }
  
  return (
    <div className={iconStyles.ratingContainer}>
      {/* Full icons */}
      {[...Array(fullIcons)].map((_, i) => (
        <i 
          key={`full-${i}`} 
          className={`${filledIcon} ${iconStyles.iconSpacing}`}
          style={{ color: brandConfig.secondaryColor }}
        />
      ))}
      
      {/* Half icon */}
      {hasHalf && (
        <div key="half" className="relative inline-block">
          <i 
            className={`${icon} ${iconStyles.iconSpacing}`} 
            style={{ color: '#4B5563' }}
          />
          <i 
            className={`${filledIcon} ${iconStyles.iconSpacing} absolute top-0 left-0`} 
            style={{ 
              color: brandConfig.secondaryColor,
              clipPath: 'inset(0 50% 0 0)'
            }}
          />
        </div>
      )}
      
      {/* Empty icons */}
      {[...Array(emptyIcons)].map((_, i) => (
        <i 
          key={`empty-${i}`} 
          className={`${icon} ${iconStyles.iconSpacing}`}
          style={{ color: '#4B5563' }}
        />
      ))}
    </div>
  );
};

export default RatingDisplay;