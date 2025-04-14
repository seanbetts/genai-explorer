// Centralized styles for consistent appearance across components

// Text colors
export const textStyles = {
  primary: 'text-gray-800',   // Main text color
  secondary: 'text-gray-700', // Secondary/supporting text (slightly darker for better readability)
  highlight: 'text-blue-600', // Highlighted/accent text
  muted: 'text-gray-500',     // Less prominent text
  disabled: 'text-gray-300',  // Disabled/inactive text
  small: 'text-sm',           // Small text
};

// Section headings
export const headingStyles = {
  main: `text-2xl font-bold ${textStyles.primary} mb-4`,
  section: `text-xl font-bold ${textStyles.primary} mb-4`,
  subsection: `text-lg font-semibold ${textStyles.primary} mb-2`,
  item: `text-base font-medium ${textStyles.primary}`,
};

// Table styles
export const tableStyles = {
  // Base table styles
  table: 'w-full bg-white border border-gray-200 rounded-lg shadow-sm',
  
  // Header styles
  header: 'bg-gray-50',
  headerCell: 'py-3 px-4 text-left font-semibold text-gray-700 border-b',
  headerCellCenter: 'py-3 px-4 text-center font-semibold text-gray-700 border-b',
  headerFixed: 'sticky left-0 bg-gray-50',
  
  // Cell styles
  cell: `py-3 px-4 border-b ${textStyles.primary}`,
  cellCenter: `py-3 px-4 border-b text-center ${textStyles.primary}`,
  rowHover: 'hover:bg-gray-50',
  stickyCell: 'sticky left-0 bg-white',
  
  // Content inside cells
  content: `${textStyles.primary}`,
  
  // Model name
  modelName: 'font-semibold text-gray-900'
};

// Card and container styles
export const containerStyles = {
  card: 'bg-white p-6 rounded-lg shadow-md',
  section: 'mb-8',
  
  // Regular grid layouts
  grid2col: 'grid grid-cols-1 md:grid-cols-2 gap-6',
  grid3col: 'grid grid-cols-1 md:grid-cols-3 gap-6',
  grid4col: 'grid grid-cols-1 md:grid-cols-4 gap-4',
  
  // Centered grid layouts (items will be centered in the row)
  grid2colCentered: 'grid grid-cols-1 md:grid-cols-2 gap-6 md:place-content-center',
  grid3colCentered: 'grid grid-cols-1 md:grid-cols-3 gap-6 mx-auto md:place-content-center',
  grid4colCentered: 'grid grid-cols-1 md:grid-cols-4 gap-4 mx-auto md:place-content-center',
  
  // Feature/card grids with auto-fit for better centering with fewer items
  featureGrid: 'flex flex-wrap justify-center gap-6', 
  subscriptionGrid: 'flex flex-wrap justify-center gap-4',
  
  // Layout helpers
  flexCol: 'flex flex-col',
  flexRow: 'flex flex-row',
  flexCenter: 'flex items-center',
  flexBetween: 'flex justify-between',
  flexCentered: 'flex items-center justify-center',
  
  // Spacing
  mt4: 'mt-4',
  
  // Legend container
  legend: 'max-w-lg mx-auto mt-4',
  legendBox: 'flex gap-5 items-center justify-center bg-gray-50 p-3 rounded-lg flex-wrap'
};

// Icon styles
export const iconStyles = {
  base: `${textStyles.highlight} mr-2`,
  action: `${textStyles.highlight} hover:text-blue-800 cursor-pointer`,
  
  // Icon sizes
  textLg: 'text-lg',
  
  // Rating icons
  ratingContainer: 'flex items-center justify-center text-blue-600',
  iconSpacing: 'mx-0.5',
  
  // Format icons
  activeFormat: textStyles.highlight,
  inactiveFormat: textStyles.disabled,
  formatContainer: 'flex gap-3 justify-center',
  formatItem: 'flex items-center',
  iconRight: 'mr-1'
};

// Button styles
export const buttonStyles = {
  primary: `bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded`,
  secondary: `bg-gray-200 hover:bg-gray-300 ${textStyles.primary} font-medium py-2 px-4 rounded`,
  link: `${textStyles.highlight} hover:text-blue-800 transition-colors cursor-pointer`,
};

// Category styles
export const categoryStyles = {
  frontier: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    full: 'bg-blue-50 border-blue-200'
  },
  open: { 
    bg: 'bg-green-50',
    border: 'border-green-200',
    full: 'bg-green-50 border-green-200'
  },
  enterprise: { 
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    full: 'bg-purple-50 border-purple-200'
  },
  image: { 
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    full: 'bg-yellow-50 border-yellow-200'
  },
  video: { 
    bg: 'bg-red-50',
    border: 'border-red-200',
    full: 'bg-red-50 border-red-200'
  },
  music: { 
    bg: 'bg-pink-50',
    border: 'border-pink-200',
    full: 'bg-pink-50 border-pink-200'
  },
  other: { 
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    full: 'bg-gray-50 border-gray-200'
  },
};