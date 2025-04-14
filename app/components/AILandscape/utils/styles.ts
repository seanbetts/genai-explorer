// Centralized styles for an elegant, refined appearance across components
// Modern design system inspired by Stripe/Airbnb aesthetics

// Color system with subtle accent colors and neutral base
export const colors = {
  // Base neutrals for backgrounds and text
  neutral: {
    50: 'bg-gray-50',  // Lightest background
    100: 'bg-gray-100', // Light background / hover states
    200: 'bg-gray-200', // Dividers, borders
    300: 'bg-gray-300', // Disabled states
    400: 'bg-gray-400', // Secondary icons
    500: 'bg-gray-500', // Secondary text
    600: 'bg-gray-600', // Primary text (lighter)
    700: 'bg-gray-700', // Primary text (standard)
    800: 'bg-gray-800', // Headings
    900: 'bg-gray-900', // High contrast text
  },
  
  // Subtle accent colors for visual hierarchy and states
  accent: {
    blue: {
      50: 'bg-blue-50', // Accent background / hover states
      100: 'bg-blue-100', // Accent background (stronger)
      200: 'bg-blue-200', // Light borders
      500: 'bg-blue-500', // Primary accent
      600: 'bg-blue-600', // Hover states
      text: 'text-blue-600', // Accent text
      border: 'border-blue-200', // Subtle borders
    },
    amber: {
      50: 'bg-amber-50',
      100: 'bg-amber-100',
      text: 'text-amber-600',
      border: 'border-amber-200',
    },
    emerald: {
      50: 'bg-emerald-50',
      100: 'bg-emerald-100',
      text: 'text-emerald-600',
      border: 'border-emerald-200',
    },
  },
  
  // Text colors
  text: {
    primary: 'text-gray-800',
    secondary: 'text-gray-600',
    tertiary: 'text-gray-500',
    light: 'text-gray-400',
    inverted: 'text-white',
    accent: 'text-blue-600',
    link: 'text-blue-600 hover:text-blue-700',
  },
  
  // Border colors
  border: {
    lightest: 'border-gray-100',
    light: 'border-gray-200',
    default: 'border-gray-300',
    medium: 'border-gray-400',
    accent: 'border-blue-200',
  },
  
  // Background colors
  bg: {
    page: 'bg-white',
    card: 'bg-white',
    offset: 'bg-gray-50',
    hover: 'bg-gray-50',
    active: 'bg-gray-100',
    accent: 'bg-blue-50',
    accentHover: 'bg-blue-100',
  },
  
  // Status colors
  status: {
    success: { text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    error: { text: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
    warning: { text: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
    info: { text: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
  },
};

// Typography system with improved readability and elegant proportions
export const textStyles = {
  // Semantic text styles mapped to colors.text
  primary: colors.text.primary,
  secondary: colors.text.secondary,
  tertiary: colors.text.tertiary,
  accent: colors.text.accent,
  muted: colors.text.tertiary,
  disabled: colors.text.light,
  link: colors.text.link,
  
  // Font sizes with optimized line heights for better readability
  // Using improved vertical rhythm and letter spacing
  xs: 'text-xs leading-5 tracking-wide',
  sm: 'text-sm leading-5 tracking-normal',
  base: 'text-base leading-6 tracking-normal',
  lg: 'text-lg leading-7 tracking-tight',
  xl: 'text-xl leading-7 tracking-tight',
  '2xl': 'text-2xl leading-8 tracking-tight',
  '3xl': 'text-3xl leading-9 tracking-tight',
  '4xl': 'text-4xl leading-10 tracking-tight',
  
  // Text weight variants using system fonts optimally
  light: 'font-light',
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
  
  // Common text styles for consistent usage patterns
  caption: 'text-xs leading-5 text-gray-500',
  overline: 'text-xs uppercase tracking-wider font-medium text-gray-500',
  label: 'text-sm font-medium text-gray-700',
  helper: 'text-xs text-gray-500 mt-1',
  
  // Body text variants with improved readability
  bodySmall: 'text-sm leading-5 text-gray-700',
  body: 'text-base leading-6 text-gray-800',
  bodyLarge: 'text-lg leading-7 text-gray-800',
  
  // Interactive text elements
  link: 'text-blue-600 hover:text-blue-700 transition-colors duration-150',
  linkSubtle: 'text-gray-600 hover:text-gray-800 transition-colors duration-150',
};

// Refined heading system with elegant typography and proper vertical rhythm
export const headingStyles = {
  // Main headings with refined tracking and improved vertical spacing
  h1: 'text-4xl font-bold text-gray-800 mb-8 tracking-tight',
  h2: 'text-3xl font-bold text-gray-800 mb-6 tracking-tight',
  h3: 'text-2xl font-semibold text-gray-800 mb-4 tracking-tight',
  h4: 'text-xl font-semibold text-gray-800 mb-3 tracking-tight',
  h5: 'text-lg font-semibold text-gray-800 mb-2',
  h6: 'text-base font-semibold text-gray-800 mb-2',
  
  // Semantic heading styles for specific uses
  page: 'text-3xl font-bold text-gray-800 mb-6 tracking-tight',
  section: 'text-2xl font-semibold text-gray-800 mb-4 tracking-tight',
  subsection: 'text-xl font-semibold text-gray-800 mb-3',
  card: 'text-lg font-medium text-gray-800 mb-2',
  
  // Variations with accent colors
  accent: 'text-2xl font-semibold text-blue-600 mb-4 tracking-tight',
  subtle: 'text-xl font-medium text-gray-500 mb-3',
  
  // Heading with icon
  withIcon: 'flex items-center gap-2',
};

// Comprehensive spacing system with improved vertical rhythm
// Based on 4px increments for pixel-perfect alignment
export const spacing = {
  // Basic spacing scale (4px increments)
  0: 'p-0',
  1: 'p-1',   // 4px
  2: 'p-2',   // 8px
  3: 'p-3',   // 12px
  4: 'p-4',   // 16px
  5: 'p-5',   // 20px
  6: 'p-6',   // 24px
  8: 'p-8',   // 32px
  10: 'p-10', // 40px
  12: 'p-12', // 48px
  16: 'p-16', // 64px
  
  // Padding variants for each direction
  py: {
    1: 'py-1',
    2: 'py-2',
    3: 'py-3',
    4: 'py-4',
    5: 'py-5',
    6: 'py-6',
    8: 'py-8',
  },
  
  px: {
    1: 'px-1',
    2: 'px-2',
    3: 'px-3',
    4: 'px-4',
    5: 'px-5',
    6: 'px-6',
    8: 'px-8',
  },
  
  // Margin variants (all sides)
  m: {
    0: 'm-0',
    1: 'm-1',
    2: 'm-2',
    3: 'm-3',
    4: 'm-4',
    5: 'm-5',
    6: 'm-6',
    8: 'm-8',
  },
  
  // Specific margins for vertical rhythm
  mt: {
    0: 'mt-0',
    1: 'mt-1',
    2: 'mt-2',
    3: 'mt-3',
    4: 'mt-4',
    6: 'mt-6',
    8: 'mt-8',
    12: 'mt-12',
  },
  
  mb: {
    0: 'mb-0',
    1: 'mb-1',
    2: 'mb-2',
    3: 'mb-3',
    4: 'mb-4',
    6: 'mb-6',
    8: 'mb-8',
    12: 'mb-12',
  },
  
  // Gap for flexbox and grid layouts
  gap: {
    0: 'gap-0',
    1: 'gap-1',
    2: 'gap-2',
    3: 'gap-3',
    4: 'gap-4',
    5: 'gap-5',
    6: 'gap-6',
    8: 'gap-8',
  },
  
  // Common spacing patterns
  card: 'p-5',
  cardCompact: 'p-4',
  section: 'py-8',
  container: 'px-4 md:px-8',
};

// Refined table styles with subtle borders and improved visual hierarchy
export const tableStyles = {
  // Base table styles - lighter shadow, more elegant borders
  table: 'w-full bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden',
  
  // Header styles with subtle background and improved typography
  header: 'bg-gray-50 border-b border-gray-200',
  headerCell: 'py-3.5 px-4 text-left font-medium text-gray-700 tracking-wide text-sm',
  headerCellCenter: 'py-3.5 px-4 text-center font-medium text-gray-700 tracking-wide text-sm',
  headerFixed: 'sticky left-0 bg-gray-50 z-10',
  
  // Cell styles with better typography and subtle borders
  cell: 'py-3.5 px-4 border-b border-gray-100 text-gray-700',
  cellCenter: 'py-3.5 px-4 border-b border-gray-100 text-center text-gray-700',
  cellHighlight: 'bg-blue-50',
  
  // Row interactions
  rowHover: 'hover:bg-gray-50 transition-colors duration-150',
  rowSelected: 'bg-blue-50',
  rowEven: 'bg-gray-50/40', // Subtle striping
  rowOdd: 'bg-white',
  
  // Sticky cells
  stickyCell: 'sticky left-0 bg-white z-10',
  stickyCellHover: 'sticky left-0 bg-gray-50 z-10',
  
  // Content formatting
  content: 'text-gray-700',
  contentSecondary: 'text-gray-500 text-sm',
  
  // Special cell styles
  modelName: 'font-medium text-gray-900',
  metric: 'font-medium text-gray-900 tabular-nums',
  
  // Border utilities
  borderRight: 'border-r border-gray-100',
  borderLeft: 'border-l border-gray-100',
  
  // Tables for comparison
  comparison: 'overflow-x-auto border border-gray-200 rounded-lg',
};

// Modern card and container styles with flat design principles
export const containerStyles = {
  // Card variants with minimal shadows and refined borders
  card: 'bg-white p-5 rounded-lg shadow-sm border border-gray-200 hover:border-gray-300 transition-all duration-200',
  cardHover: 'bg-white p-5 rounded-lg shadow-sm border border-gray-200 hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-200',
  cardActive: 'bg-white p-5 rounded-lg shadow-sm border-l-4 border-blue-400 border-t border-r border-b border-gray-200',
  cardAccent: 'bg-white p-5 rounded-lg shadow-sm border border-blue-200 hover:border-blue-300 transition-all duration-200',
  cardOutline: 'bg-white p-5 rounded-lg border border-gray-200 hover:border-blue-200 transition-all duration-200',
  cardFlat: 'bg-white p-5 rounded-lg border border-gray-100',
  
  // Section containers
  section: 'mb-10',
  sectionDivider: 'border-t border-gray-100 my-10',
  
  // Modern grid layouts with improved spacing
  grid2col: 'grid grid-cols-1 md:grid-cols-2 gap-5',
  grid3col: 'grid grid-cols-1 md:grid-cols-3 gap-5',
  grid4col: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5',
  
  // Responsive grid with auto-fit for dynamic column count
  gridAutoFit: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5',
  gridAutoFitWide: 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5',
  gridAutoFitNarrow: 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4',
  
  // Feature/card grids with improved spacing
  featureGrid: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5',
  subscriptionGrid: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5',
  
  // Landscape view layouts with consistent spacing
  landscapeContainer: 'space-y-6',
  landscapeRowTwo: 'grid grid-cols-1 md:grid-cols-2 gap-5',
  landscapeRowFour: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5',
  
  // Category section with refined styling and minimal shadows
  categorySection: 'bg-white rounded-lg shadow-sm p-5 border border-gray-200 transition-all duration-200',
  categoryTitle: 'text-lg font-semibold mb-5 text-gray-800 flex items-center',
  categoryTitleInline: 'text-lg font-semibold text-gray-800 pr-4 flex items-center',
  categorySectionHover: 'hover:border-gray-300',
  categoryIcon: 'mr-2 text-gray-600 text-lg',
  
  // Company card with elegant hover state and top-aligned model names
  companyCardContainer: 'flex flex-col items-center h-full cursor-pointer p-4 rounded-lg border border-transparent hover:border-gray-200 hover:bg-gray-50/50 transition-all duration-200',
  companyLogo: 'relative h-14 w-full flex items-center justify-center mb-2',
  companyLogoImage: 'mx-auto object-contain max-h-12',
  companyModel: 'text-center text-xs text-gray-600 line-clamp-1 mb-1',
  
  // Company grid layouts with improved spacing and specified column counts
  companyGridFull: 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5',
  companyGridHalf: 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5', // Now 4 columns for Open Source Models
  companyGridQuarter: 'grid grid-cols-1 sm:grid-cols-2 gap-4', // 2 columns for Enterprise and specialty categories
  
  // Company detail with refined styling
  companyDetailHeader: 'flex justify-between mb-6 p-5 bg-gray-50 rounded-lg border border-gray-200',
  companyLogoContainer: 'relative block h-24 w-48 hover:opacity-90 transition-opacity mr-6 flex-shrink-0 flex items-center justify-center',
  companyDescriptionContainer: 'flex-1',
  companyDetailSection: 'mb-8',
  
  // App layout with subtle shadows and improved spacing
  appContainer: 'min-h-screen bg-gray-50',
  header: 'bg-white shadow-sm sticky top-0 z-30 border-b border-gray-200',
  headerContent: 'container mx-auto px-5 py-4 flex items-center justify-between',
  appTitle: 'text-xl font-semibold cursor-pointer text-gray-800 hover:text-blue-600 transition-colors',
  mainContent: 'container mx-auto p-5 md:p-6',
  footer: 'bg-gray-800 text-white mt-16 py-10',
  footerContent: 'container mx-auto px-5',
  
  // Layout helpers for consistent patterns
  flexCol: 'flex flex-col',
  flexRow: 'flex flex-row',
  flexCenter: 'flex items-center',
  flexBetween: 'flex justify-between items-center',
  flexCentered: 'flex items-center justify-center',
  flexStart: 'flex justify-start items-center',
  flexEnd: 'flex justify-end items-center',
  flexWrap: 'flex flex-wrap',
  flexGrow: 'flex-grow',
  flexShrink: 'flex-shrink-0',
  
  // Spacing shortcuts
  spacerXs: 'h-2',
  spacerSm: 'h-3',
  spacerMd: 'h-5',
  spacerLg: 'h-8',
  
  // Legend container with refined styling
  legend: 'max-w-lg mx-auto mt-8 bg-white rounded-lg border border-gray-200',
  legendBox: 'flex gap-4 items-center justify-center p-4 rounded-lg flex-wrap'
};

// Refined icon system with subtle interactions and improved visual balance
export const iconStyles = {
  // Base icon styles with consistent spacing and transitions
  base: 'text-gray-500 mr-2 transition-all duration-200',
  action: 'text-gray-500 hover:text-blue-500 cursor-pointer transition-all duration-200',
  primary: 'text-blue-500',
  secondary: 'text-gray-400',
  tertiary: 'text-gray-300',
  
  // Icon sizes with meaningful scale progression
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  
  // Rating icons with consistent styling
  ratingContainer: 'flex items-center justify-center text-amber-500',
  ratingFilled: 'text-amber-500',
  ratingEmpty: 'text-gray-300',
  iconSpacing: 'mx-0.5',
  
  // Format indicators with improved contrast
  activeFormat: 'text-blue-600',
  inactiveFormat: 'text-gray-300',
  formatContainer: 'flex gap-3 justify-center',
  formatItem: 'flex items-center',
  
  // Icon positioning utilities
  iconLeft: 'mr-2',
  iconRight: 'ml-2',
  iconOnly: 'mx-auto',
  
  // Animation effects for interactive feedback
  spin: 'animate-spin',
  pulse: 'animate-pulse',
  bounce: 'animate-bounce',
  
  // Icon with text compositions
  iconWithText: 'inline-flex items-center gap-1.5',
  iconWithTextLarge: 'inline-flex items-center gap-2',
  
  // Status icons
  success: 'text-emerald-500',
  warning: 'text-amber-500',
  error: 'text-red-500',
  info: 'text-blue-500',
};

// Modern button system with refined states and minimal shadows
export const buttonStyles = {
  // Primary action buttons with clean states
  primary: 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium py-2 px-4 rounded-md transition-colors duration-150',
  secondary: 'bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-700 border border-gray-300 font-medium py-2 px-4 rounded-md transition-all duration-150',
  
  // Additional button variants
  tertiary: 'bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors duration-150',
  danger: 'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-medium py-2 px-4 rounded-md transition-colors duration-150',
  success: 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-medium py-2 px-4 rounded-md transition-colors duration-150',
  
  // Text button variants
  text: 'text-gray-700 hover:text-gray-900 hover:bg-gray-100 py-2 px-3 rounded-md transition-all duration-150',
  textPrimary: 'text-blue-600 hover:text-blue-700 hover:bg-blue-50 py-2 px-3 rounded-md transition-all duration-150',
  
  // Link style buttons with improved interaction
  link: 'text-blue-600 hover:text-blue-800 transition-colors duration-150 cursor-pointer',
  linkMuted: 'text-gray-600 hover:text-gray-800 transition-colors duration-150 cursor-pointer',
  
  // Button sizes with improved typography
  xs: 'py-1 px-2 text-xs rounded',
  sm: 'py-1.5 px-3 text-sm',
  md: 'py-2 px-4 text-sm',
  lg: 'py-2.5 px-5 text-base',
  xl: 'py-3 px-6 text-base',
  
  // Special button styles
  iconButton: 'p-2 rounded-md hover:bg-gray-100 text-gray-700 hover:text-gray-900 transition-colors duration-150',
  iconButtonPrimary: 'p-2 rounded-md hover:bg-blue-50 text-blue-600 hover:text-blue-700 transition-colors duration-150',
  pill: 'rounded-full',
  outline: 'bg-transparent border border-current',
  
  // States
  disabled: 'opacity-50 cursor-not-allowed',
  loading: 'opacity-80 cursor-wait',
  
  // Button with left icon
  withLeftIcon: 'inline-flex items-center',
  withRightIcon: 'inline-flex items-center justify-center',
};

// Category styles with consistent neutral styling
export const categoryStyles = {
  // Frontier models
  frontier: {
    bg: 'bg-white',
    border: 'border-gray-200',
    full: 'bg-white border-gray-200',
    icon: 'bi-stars',
    title: 'text-gray-800',
    shadow: 'shadow-sm',
  },
  
  // Open source
  open: { 
    bg: 'bg-white',
    border: 'border-gray-200',
    full: 'bg-white border-gray-200',
    icon: 'bi-unlock',
    title: 'text-gray-800',
    shadow: 'shadow-sm',
  },
  
  // Enterprise
  enterprise: { 
    bg: 'bg-white',
    border: 'border-gray-200',
    full: 'bg-white border-gray-200',
    icon: 'bi-building',
    title: 'text-gray-800',
    shadow: 'shadow-sm',
  },
  
  // Image
  image: { 
    bg: 'bg-white',
    border: 'border-gray-200',
    full: 'bg-white border-gray-200',
    icon: 'bi-image',
    title: 'text-gray-800',
    shadow: 'shadow-sm',
  },
  
  // Video
  video: { 
    bg: 'bg-white',
    border: 'border-gray-200',
    full: 'bg-white border-gray-200',
    icon: 'bi-camera-video',
    title: 'text-gray-800',
    shadow: 'shadow-sm',
  },
  
  // Music
  music: { 
    bg: 'bg-white',
    border: 'border-gray-200',
    full: 'bg-white border-gray-200',
    icon: 'bi-music-note',
    title: 'text-gray-800',
    shadow: 'shadow-sm',
  },
  
  // Other
  other: { 
    bg: 'bg-white',
    border: 'border-gray-200',
    full: 'bg-white border-gray-200',
    icon: 'bi-grid',
    title: 'text-gray-800',
    shadow: 'shadow-sm',
  },
};