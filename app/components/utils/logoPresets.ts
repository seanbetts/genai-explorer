import type { CompanyCategory } from '../types';

export interface LogoSize {
  width: number;
  height: number;
}

// Centralized logo size presets based on layout, column count, and category
export function getLogoSize(
  category: CompanyCategory,
  layout: 'full-width' | 'half-width' | 'quarter-width',
  columns?: number,
  showModelCount?: number
): LogoSize {
  // Media categories use smaller default logos
  const isMedia = ['image', 'video', 'audio', 'other'].includes(category);

  // When showing only logos, bump up size slightly
  if (showModelCount === 0) {
    return isMedia
      ? { width: 100, height: 42 }
      : { width: 132, height: 55 };
  }

  switch (layout) {
    case 'full-width':
      // Frontier has 5 columns, slightly smaller logos
      if (columns === 5) {
        return { width: 100, height: 42 };
      }
      return { width: 110, height: 46 };
    case 'half-width':
      return { width: 100, height: 42 };
    case 'quarter-width':
      return isMedia
        ? { width: 84, height: 36 }
        : { width: 100, height: 42 };
    default:
      return { width: 100, height: 42 };
  }
}