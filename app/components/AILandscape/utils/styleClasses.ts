// Import the existing Tailwind classes from styles.ts
import { containerStyles, textStyles, tableStyles, iconStyles, categoryStyles } from './styles';

// This file maps our existing styles.ts classes to standardized names
// for easier component access and maintenance

export const styles = {
  // Layout
  container: containerStyles.landscapeContainer,
  
  // Category Sections
  categorySection: containerStyles.categorySection,
  categorySectionBorder: 'bg-gray-50 border-gray-200 border-l-4 border-gray-400',
  categoryTitle: containerStyles.categoryTitle,
  categoryTitleInline: containerStyles.categoryTitleInline,
  categoryIcon: containerStyles.categoryIcon,
  categorySectionHover: containerStyles.categorySectionHover,
  
  // Layouts
  gridLayoutTwo: containerStyles.landscapeRowTwo,
  gridLayoutFour: containerStyles.landscapeRowFour,
  companyGridFull: containerStyles.companyGridFull,
  companyGridHalf: containerStyles.companyGridHalf,
  companyGridQuarter: containerStyles.companyGridQuarter,
  
  // Company Cards
  companyCard: containerStyles.companyCardContainer,
  companyLogo: containerStyles.companyLogo,
  companyLogoImage: containerStyles.companyLogoImage,
  companyModel: containerStyles.companyModel, // Larger, bolder model names
  
  // Detail View
  detailCard: containerStyles.cardHover,
  detailHeader: containerStyles.companyDetailHeader,
  detailSection: containerStyles.section,
  sectionTitle: 'text-xl font-bold text-gray-800 mb-4 flex items-center cursor-pointer',
  backButton: 'mb-4 flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200 cursor-pointer underline-offset-2 hover:underline transform transition-all duration-300 hover:-translate-x-1',
  
  // Feature Grid
  featureGrid: containerStyles.featureGrid,
  featureCard: 'border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col w-full sm:w-96 hover:border-gray-300 hover:scale-105 transform cursor-pointer no-underline',
  featureCardContent: 'p-4 flex-1 flex flex-col overflow-hidden',
  featureTitle: 'text-lg font-semibold mb-2 text-gray-800',
  featureDescription: 'text-gray-600 text-sm',
  featureLink: 'text-gray-600 hover:text-gray-800 transition-colors duration-200 cursor-pointer flex items-center no-underline',
  
  // Subscription Grid
  subscriptionGrid: containerStyles.subscriptionGrid,
  subscriptionCard: 'bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex flex-col w-72 transform hover:scale-105 border border-gray-100 hover:border-gray-300',
  subscriptionCardEnterprise: 'border-2 border-gray-200 hover:border-gray-300',
  subscriptionTitle: 'text-lg font-bold text-gray-800',
  subscriptionTag: 'px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-800',
  subscriptionPrice: 'text-xl font-bold text-gray-800',
  subscriptionBilling: 'text-xs text-gray-500 font-normal',
  
  // Model Table
  modelTable: tableStyles.table,
  tableHeader: tableStyles.header,
  tableHeaderCell: tableStyles.headerCell,
  tableHeaderCellCenter: tableStyles.headerCellCenter,
  tableHeaderFixed: tableStyles.headerFixed,
  tableCell: tableStyles.cell,
  tableCellCenter: tableStyles.cellCenter,
  tableRowHover: tableStyles.rowHover,
  stickyCell: tableStyles.stickyCell,
  modelName: tableStyles.modelName,
  
  // Legend
  legend: containerStyles.legend,
  legendBox: containerStyles.legendBox,
  
  // Icons
  iconBase: iconStyles.primary, // Changed from iconStyles.base due to duplicate property
  activeFormat: iconStyles.activeFormat,
  inactiveFormat: iconStyles.inactiveFormat,
  formatContainer: iconStyles.formatContainer,
  formatItem: iconStyles.formatItem,
  iconRight: iconStyles.iconRight,
  
  // Animation Classes
  fadeIn: 'transition-opacity duration-500',
  slideUp: 'transform transition-all duration-500',
  
  // Layout Utilities
  flexCenter: containerStyles.flexCenter,
  flexBetween: containerStyles.flexBetween,
  flexCol: containerStyles.flexCol,
  
  // Text styles
  textPrimary: textStyles.primary,
  textSecondary: textStyles.secondary,
  textMuted: textStyles.muted,
};

// Define category style helper
export const getCategoryStyle = (category: string): string => {
  return styles.categorySectionBorder;
};

export const getCategoryIcon = (category: string): string => {
  const iconMap: Record<string, string> = {
    frontier: 'bi-stars',
    open: 'bi-unlock',
    enterprise: 'bi-building',
    image: 'bi-image',
    video: 'bi-camera-video',
    music: 'bi-music-note',
    other: 'bi-grid',
  };
  
  return iconMap[category] || 'bi-grid';
};

// Define shadow style helper
export const getShadowStyle = (): string => {
  return 'shadow-md';
};