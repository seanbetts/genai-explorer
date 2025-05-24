// Layout definitions: containers, tables, icons, buttons
import brandConfig from '../../config/brand';

// Card and container styles with brand-specific theming
export const containerStyles = {
    // Card variants with brand-specific styling
    card: brandConfig.name === 'OMG'
        ? 'bg-gray-200 p-5 rounded-lg shadow-md border border-gray-300 transition-all duration-200'
        : 'bg-gray-800 p-5 rounded-lg shadow-md border border-gray-700 transition-all duration-200',
    cardHover: brandConfig.name === 'OMG'
        ? 'bg-gray-200 p-5 rounded-lg shadow-md border border-gray-300 hover:border-blue-400 hover:bg-gray-100 transition-all duration-200'
        : 'bg-gray-800 p-5 rounded-lg shadow-md border border-gray-700 hover:border-cyan-400 hover:bg-gray-700 transition-all duration-200',
    cardActive: brandConfig.name === 'OMG'
        ? 'bg-gray-200 p-5 rounded-lg shadow-md border-l-4 border-blue-500 border-t border-r border-b border-gray-300'
        : 'bg-gray-800 p-5 rounded-lg shadow-md border-l-4 border-fuchsia-500 border-t border-r border-b border-gray-700',
    cardAccent: brandConfig.name === 'OMG'
        ? 'bg-gray-200 p-5 rounded-lg shadow-md border border-blue-500 hover:border-blue-400 transition-all duration-200'
        : 'bg-gray-800 p-5 rounded-lg shadow-md border border-fuchsia-500 hover:border-fuchsia-400 transition-all duration-200',
    cardOutline: brandConfig.name === 'OMG'
        ? 'bg-gray-200 p-5 rounded-lg border border-gray-300 hover:border-blue-400 transition-all duration-200'
        : 'bg-gray-800 p-5 rounded-lg border border-gray-700 hover:border-cyan-400 transition-all duration-200',
    cardFlat: brandConfig.name === 'OMG'
        ? 'bg-gray-200 p-5 rounded-lg border border-gray-300'
        : 'bg-gray-800 p-5 rounded-lg border border-gray-700',
    
    // Section containers with brand-specific styling
    section: brandConfig.name === 'OMG'
        ? 'bg-gray-200 rounded-lg px-8 py-7 border border-gray-300'
        : 'bg-gray-800 rounded-lg px-8 py-7 border border-gray-700',
    sectionDivider: brandConfig.name === 'OMG'
        ? 'border-t border-gray-300 my-10'
        : 'border-t border-fuchsia-900 my-10',
    
    // Modern grid layouts with improved spacing
    grid2col: 'grid grid-cols-1 md:grid-cols-2 gap-5',
    grid3col: 'grid grid-cols-1 md:grid-cols-3 gap-5',
    grid4col: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5',
    
    // Responsive grid with auto-fit for dynamic column count
    gridAutoFit: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5',
    gridAutoFitWide: 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5',
    gridAutoFitNarrow: 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4',
    
    // Feature/card layouts with styling based on brand
    featureGrid: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr mx-auto',
    featureCard: brandConfig.name === 'OMG'
        ? 'flex flex-col rounded-lg border border-gray-300 bg-white overflow-hidden hover:border-blue-400 hover:bg-gray-50 hover:shadow-md hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer no-underline w-full h-full relative'
        : 'flex flex-col rounded-lg border border-gray-600 bg-gray-200 overflow-hidden hover:border-fuchsia-500 hover:bg-gray-100 hover:shadow-[0_0_10px_rgba(234,0,217,0.4)] hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer no-underline w-full h-full relative',
    featureImage: brandConfig.name === 'OMG'
        ? 'relative h-36 bg-gray-100 flex-shrink-0 border-b border-gray-300'
        : 'relative h-36 bg-gray-800 flex-shrink-0 border-b border-gray-600',
    featureContent: brandConfig.name === 'OMG'
        ? 'p-5 flex-1 flex flex-col overflow-hidden relative pb-16 bg-white'
        : 'p-5 flex-1 flex flex-col overflow-hidden relative pb-16',
    featureTitle: brandConfig.name === 'OMG'
        ? 'text-lg font-semibold mb-3 text-gray-800 font-sans group-hover:text-blue-600'
        : 'text-lg font-semibold mb-3 text-gray-800 font-mono group-hover:text-fuchsia-600',
    featureDescription: brandConfig.name === 'OMG'
        ? 'text-gray-700 text-sm font-sans'
        : 'text-gray-700 text-sm font-mono',
    featureFooter: 'flex items-end justify-end',
    featureLink: brandConfig.name === 'OMG'
        ? 'text-blue-600 hover:text-blue-500 text-sm flex items-center group font-sans'
        : 'text-fuchsia-600 hover:text-fuchsia-500 text-sm flex items-center group font-mono',
    
    // Subscription card styles with fixed width so incomplete rows center correctly
    subscriptionGrid: 'flex flex-wrap justify-center gap-6',
    subscriptionCard: brandConfig.name === 'OMG'
        ? 'flex flex-col rounded-lg border border-gray-300 bg-white overflow-hidden hover:border-blue-400 hover:bg-gray-50 hover:shadow-md hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer no-underline w-80 relative'
        : 'flex flex-col rounded-lg border border-gray-600 bg-gray-200 overflow-hidden hover:border-fuchsia-500 hover:bg-gray-100 hover:shadow-[0_0_10px_rgba(234,0,217,0.4)] hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer no-underline w-80 relative',
    subscriptionHeader: brandConfig.name === 'OMG'
        ? 'px-5 py-3 bg-gray-100 border-b border-gray-300 h-[70px] flex flex-col justify-center' /* Fixed height header for consistency */
        : 'px-5 py-3 bg-[#2d3748] border-b border-gray-600 h-[70px] flex flex-col justify-center', /* Fixed height header for consistency */
    subscriptionContent: brandConfig.name === 'OMG'
        ? 'px-5 pt-5 pb-10 flex-1 flex flex-col overflow-hidden bg-white' /* Increased bottom padding further */
        : 'px-5 pt-5 pb-10 flex-1 flex flex-col overflow-hidden', /* Increased bottom padding further */
    subscriptionTier: brandConfig.name === 'OMG'
        ? 'text-lg font-semibold text-blue-600 font-sans leading-tight'
        : 'text-lg font-semibold text-fuchsia-500 font-mono leading-tight',
    subscriptionType: brandConfig.name === 'OMG'
        ? 'px-2 py-0.5 bg-gray-200 rounded text-xs text-blue-600 font-sans'
        : 'px-2 py-0.5 bg-gray-600 rounded text-xs text-cyan-400 font-mono',
    subscriptionPrice: brandConfig.name === 'OMG'
        ? 'text-xl font-bold text-gray-800 font-sans mb-4'
        : 'text-xl font-bold text-gray-800 font-mono mb-4',
    subscriptionPriceUnit: brandConfig.name === 'OMG'
        ? 'text-xs text-gray-600 font-normal font-sans'
        : 'text-xs text-gray-600 font-normal font-mono',
    subscriptionFeatureList: 'space-y-2 text-sm flex-1',
    subscriptionFeatureItem: 'flex items-start',
    subscriptionFeatureCheck: brandConfig.name === 'OMG'
        ? 'text-blue-600 mr-2 flex-shrink-0'
        : 'text-fuchsia-500 mr-2 flex-shrink-0',
    subscriptionFeatureText: brandConfig.name === 'OMG'
        ? 'text-gray-700 font-sans'
        : 'text-gray-700 font-mono',
    
    // Explorer view layouts with consistent spacing
    explorerContainer: 'space-y-6',
    // Two-column layout: mobile single column; on md+ first column 5/8 width, second column 3/8 width
    explorerRowTwo: 'grid items-stretch grid-cols-1 md:grid-cols-[5fr_3fr] gap-5',
    explorerRowFour: 'grid items-stretch grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5',
    
    // Category section with brand-specific styling
    categorySection: brandConfig.name === 'OMG'
        ? 'h-full bg-gray-200 rounded-lg shadow-md p-5 border border-gray-300 transition-all duration-200'
        : 'h-full bg-gray-800 rounded-lg shadow-md p-5 border border-gray-700 transition-all duration-200',
    categoryTitle: brandConfig.name === 'OMG'
        ? `text-lg font-semibold text-[${brandConfig.primaryColor}] flex items-center font-sans`
        : 'text-lg font-semibold text-fuchsia-500 flex items-center font-mono',
    categoryTitleInline: brandConfig.name === 'OMG'
        ? `text-lg font-semibold text-[${brandConfig.primaryColor}] pr-4 flex items-center font-sans`
        : 'text-lg font-semibold text-fuchsia-500 pr-4 flex items-center font-mono',
    categorySectionHover: brandConfig.name === 'OMG'
        ? 'hover:border-blue-500'
        : 'hover:border-fuchsia-900',
    categoryIcon: brandConfig.name === 'OMG'
        ? `mr-2 text-[${brandConfig.primaryColor}] text-lg`
        : 'mr-2 text-cyan-400 text-lg',
    
    // Company card with brand-specific hover effects
    companyCardContainer: brandConfig.name === 'OMG'
        ? 'flex flex-col items-center h-full min-h-[168px] cursor-pointer p-4 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 hover:shadow-md hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-300'
        : 'flex flex-col items-center h-full min-h-[168px] cursor-pointer p-4 rounded-lg border border-gray-600 bg-gray-200 hover:border-fuchsia-500 hover:bg-gray-100 hover:shadow-[0_0_10px_rgba(234,0,217,0.4)] hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-300',
    companyCardLogoOnly: brandConfig.name === 'OMG'
        ? 'flex items-center justify-center h-full min-h-[168px] cursor-pointer p-4 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 hover:shadow-md hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-300'
        : 'flex items-center justify-center h-full min-h-[168px] cursor-pointer p-4 rounded-lg border border-gray-600 bg-gray-200 hover:border-fuchsia-500 hover:bg-gray-100 hover:shadow-[0_0_10px_rgba(234,0,217,0.4)] hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-300',
    companyCardLogoOnlyMedia: brandConfig.name === 'OMG'
        ? 'flex items-center justify-center h-full cursor-pointer p-4 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 hover:shadow-md hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-300'
        : 'flex items-center justify-center h-full cursor-pointer p-4 rounded-lg border border-gray-600 bg-gray-200 hover:border-fuchsia-500 hover:bg-gray-100 hover:shadow-[0_0_10px_rgba(234,0,217,0.4)] hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-300',
    companyLogo: 'relative h-14 w-full flex items-center justify-center mb-3 bg-white rounded-md p-2',
    companyLogoLarge: 'relative h-16 w-full flex items-center justify-center bg-white rounded-md p-2',
    companyLogoImage: 'mx-auto object-contain max-h-12 max-w-full',
    companyModel: brandConfig.name === 'OMG'
        ? 'text-center text-sm font-medium text-gray-800 mb-1 font-mono'
        : 'text-center text-sm font-medium text-gray-800 mb-1 font-mono group-hover:text-fuchsia-600',
    
    // Company grid layouts with improved spacing and specified column counts
    companyGridFull: 'grid items-stretch grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5',
    companyGridHalf: 'grid items-stretch grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5', // Now 4 columns for Open Source Models
    companyGridQuarter: 'grid items-stretch grid-cols-1 sm:grid-cols-2 gap-5', // Matched gap-5 to be consistent with Open Models
    
    // Company detail with brand-specific styling
    companyDetailHeader: brandConfig.name === 'OMG'
        ? 'flex flex-col md:flex-row items-center p-6 rounded-lg border border-gray-300 bg-gray-200 shadow-md'
        : 'flex flex-col md:flex-row items-center p-6 rounded-lg border border-gray-700 bg-gray-800 shadow-md',
    companyLogoContainer: brandConfig.name === 'OMG'
        ? 'relative flex items-center justify-center h-24 w-48 flex-shrink-0 mb-4 md:mb-0 md:mr-8 bg-white rounded-md p-2 hover:border-blue-400 transition-all duration-300 border border-blue-500'
        : 'relative flex items-center justify-center h-24 w-48 flex-shrink-0 mb-4 md:mb-0 md:mr-8 bg-white rounded-md p-2 hover:border-fuchsia-400 transition-all duration-300 border border-fuchsia-500',
    companyDescriptionContainer: 'flex-1 flex items-center',
    companyDescription: brandConfig.name === 'OMG'
        ? 'text-gray-800 font-sans'
        : 'text-gray-300 font-mono',
    companyDetailSection: 'mt-6 mb-4 space-y-4',
    
    // App layout with brand-specific theme styling
    appContainer: brandConfig.name === 'OMG' 
        ? 'min-h-screen bg-white' 
        : 'min-h-screen bg-gray-900',
    header: brandConfig.name === 'OMG' 
        ? 'bg-gray-200 shadow-md sticky top-0 z-30 border-b border-gray-300' 
        : 'bg-gray-800 shadow-md sticky top-0 z-30 border-b border-gray-700',
    headerContent: 'container mx-auto px-5 py-6 flex items-center justify-between relative h-[90px]', /* Fixed height with padding */
    appTitle: 'text-xl font-semibold cursor-pointer text-fuchsia-500 hover:text-fuchsia-400 transition-colors font-mono',
    mainContent: 'container mx-auto p-5 md:p-6',
    footer: 'bg-gray-800 text-cyan-400 py-10 border-t border-fuchsia-900',
    footerContent: 'container mx-auto px-5 font-mono',
    
    // Layout helpers for consistent patterns
    flexCol: 'flex flex-col',
    flexRow: 'flex flex-row',
    flexCenter: 'flex items-center gap-3',
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
    
    // Legend container with cyberpunk styling that matches row labels
    legend: brandConfig.name === 'OMG'
        ? 'max-w-3xl mx-auto mt-0 rounded-lg border border-gray-300'
        : 'max-w-3xl mx-auto mt-0 rounded-lg border border-gray-700',
    legendBox: brandConfig.name === 'OMG'
        ? 'flex items-center p-4 rounded-lg bg-white'
        : 'flex items-center p-4 rounded-lg',
    legendLabel: brandConfig.name === 'OMG'
        ? `text-[${brandConfig.primaryColor}] text-sm mr-4 font-sans`
        : 'text-fuchsia-500 text-sm mr-4 font-mono',
    legendItems: 'flex items-center flex-wrap gap-3',
    legendItem: 'flex items-center gap-3 mr-4'
};

// Table styles with brand-specific theming
export const tableStyles = {
    // Base table styles - grey for OMG, dark for Blueprint
    table: brandConfig.name === 'OMG'
        ? 'w-full bg-gray-100 border border-gray-300 rounded-lg shadow-md overflow-hidden font-sans'
        : 'w-full bg-gray-900 border border-gray-700 rounded-lg shadow-md overflow-hidden font-mono',
    
    // Header styles with brand-specific accent
    header: brandConfig.name === 'OMG'
        ? 'bg-white border-b border-gray-300 sticky top-0'
        : 'bg-gray-800 border-b border-fuchsia-800 sticky top-0',
    headerCell: brandConfig.name === 'OMG'
        ? `py-3.5 px-4 text-left font-semibold text-[${brandConfig.primaryColor}] tracking-wide text-sm bg-white`
        : 'py-3.5 px-4 text-left font-semibold text-fuchsia-500 tracking-wide text-sm bg-gray-800',
    headerCellCenter: brandConfig.name === 'OMG'
        ? `py-3.5 px-4 text-center font-semibold text-[${brandConfig.primaryColor}] tracking-wide text-sm bg-white`
        : 'py-3.5 px-4 text-center font-semibold text-fuchsia-500 tracking-wide text-sm bg-gray-800',
    headerFixed: brandConfig.name === 'OMG'
        ? 'sticky left-0 bg-white z-10'
        : 'sticky left-0 bg-gray-800 z-10',
    
    // Cell styles with brand-specific theming
    cell: brandConfig.name === 'OMG'
        ? 'py-3.5 px-4 border-b border-gray-200 text-gray-800 transition-colors duration-150 bg-gray-100'
        : 'py-3.5 px-4 border-b border-gray-800 text-white transition-colors duration-150',
    cellCenter: brandConfig.name === 'OMG'
        ? 'py-3.5 px-4 border-b border-gray-200 text-center text-gray-800 transition-colors duration-150 bg-gray-100'
        : 'py-3.5 px-4 border-b border-gray-800 text-center text-white transition-colors duration-150',
    cellHighlight: brandConfig.name === 'OMG'
        ? 'bg-blue-50'
        : 'bg-fuchsia-900',
    
    // Row interactions with brand-specific effects
    rowHover: brandConfig.name === 'OMG'
        ? 'hover:bg-gray-100 hover:cursor-pointer transition-all duration-150'
        : 'hover:bg-gray-700 hover:cursor-pointer transition-all duration-150',
    rowSelected: brandConfig.name === 'OMG'
        ? 'bg-blue-50'
        : 'bg-fuchsia-900',
    rowEven: brandConfig.name === 'OMG'
        ? 'bg-gray-100/60' // Subtle striping
        : 'bg-gray-800/40', 
    rowOdd: brandConfig.name === 'OMG'
        ? 'bg-gray-100'
        : 'bg-gray-900',
    
    // Sticky cells
    stickyCell: brandConfig.name === 'OMG'
        ? 'sticky left-0 bg-gray-100 z-10'
        : 'sticky left-0 bg-gray-900 z-10',
    stickyLabelCell: brandConfig.name === 'OMG'
        ? 'sticky left-0 bg-white z-10'
        : 'sticky left-0 bg-gray-800 z-10',
    stickyCellHover: brandConfig.name === 'OMG'
        ? 'sticky left-0 bg-gray-100 z-10'
        : 'sticky left-0 bg-gray-800 z-10',
    
    // Content formatting
    content: brandConfig.name === 'OMG'
        ? 'text-gray-800'
        : 'text-white',
    contentSecondary: brandConfig.name === 'OMG'
        ? 'text-gray-600 text-sm'
        : 'text-gray-300 text-sm',
    
    // Special cell styles
    modelName: brandConfig.name === 'OMG'
        ? `font-medium text-[${brandConfig.secondaryColor}] font-sans text-base`
        : 'font-medium text-cyan-400 font-mono text-base',
    metric: brandConfig.name === 'OMG'
        ? 'font-medium text-gray-800 tabular-nums font-sans'
        : 'font-medium text-white tabular-nums font-mono',
    
    // Border utilities
    borderRight: brandConfig.name === 'OMG'
        ? 'border-r border-gray-200'
        : 'border-r border-gray-800',
    borderLeft: brandConfig.name === 'OMG'
        ? 'border-l border-gray-200'
        : 'border-l border-gray-800',
    
    // Tables for comparison
    comparison: 'overflow-x-auto border border-gray-700 rounded-lg',
};

// Cyberpunk icon system with neon colors
export const iconStyles = {
    // Color variants
    primary: 'text-fuchsia-500',      // Neon pink primary
    secondary: 'text-cyan-400',       // Neon cyan secondary
    tertiary: 'text-gray-300',        // Light gray tertiary
    
    // Interactive variants
    base: 'text-fuchsia-500 transition-all duration-200', // Default neon pink with transition
    action: 'text-gray-300 hover:text-fuchsia-500 cursor-pointer transition-all duration-200',
    
    // Size variants with meaningful scale progression
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base', // Medium size
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    
    // Rating icons with secondary brand color
    ratingContainer: 'flex items-center justify-center',
    ratingFilled: brandConfig.name === 'OMG' ? `text-[${brandConfig.secondaryColor}]` : 'text-cyan-400', // Secondary brand color
    ratingEmpty: 'text-gray-600', // Lighter gray to be more visible
    iconSpacing: 'mx-0.5',
    
    // Format indicators with secondary brand color
    activeFormat: brandConfig.name === 'OMG' ? `text-[${brandConfig.secondaryColor}]` : 'text-fuchsia-500', // Secondary brand color
    inactiveFormat: 'text-gray-600', // Lighter gray to be more visible
    formatContainer: 'flex gap-4 justify-center',
    formatItem: 'flex items-center mx-2',
    
    // Table row label icons with primary brand color
    tableRowIcon: brandConfig.name === 'OMG' ? `text-[${brandConfig.primaryColor}]` : 'text-fuchsia-500',
    
    // Icon positioning utilities with increased spacing
    iconLeft: 'mr-3',
    iconRight: 'ml-3',
    iconOnly: 'mx-auto',
    
    // Animation effects for interactive feedback
    spin: 'animate-spin',
    pulse: 'animate-pulse',
    bounce: 'animate-bounce',
    
    // Icon with text compositions
    iconWithText: 'inline-flex items-center gap-1.5',
    iconWithTextLarge: 'inline-flex items-center gap-2',
    
    // Status icons with neon colors
    success: 'text-green-400',
    warning: 'text-yellow-300',
    error: 'text-red-400',
    info: 'text-cyan-400',
    
    // Boolean indicator icons - secondary for true, red for false
    booleanTrue: brandConfig.name === 'OMG' 
        ? `text-[${brandConfig.secondaryColor}] text-lg bi bi-check-circle-fill`
        : 'text-cyan-400 text-lg bi bi-check-circle-fill',
    booleanFalse: 'text-fuchsia-500 text-lg bi bi-x-circle-fill',
};

// Brand-aware button system with conditional styling
export const buttonStyles = {
    // Primary action buttons with brand colors
    primary: brandConfig.name === 'OMG' 
        ? `bg-[${brandConfig.primaryColor}] hover:bg-[${brandConfig.primaryColor}]/90 active:bg-[${brandConfig.primaryColor}]/80 text-white font-medium py-2 px-4 rounded-md transition-colors duration-150 font-sans cursor-pointer`
        : 'bg-fuchsia-600 hover:bg-fuchsia-500 active:bg-fuchsia-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-150 font-mono cursor-pointer',
    secondary: brandConfig.name === 'OMG'
        ? `bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-900 border border-[${brandConfig.primaryColor}] font-medium py-2 px-4 rounded-md transition-all duration-150 font-sans cursor-pointer`
        : 'bg-gray-800 hover:bg-gray-700 active:bg-gray-600 text-white border border-fuchsia-500 font-medium py-2 px-4 rounded-md transition-all duration-150 font-mono cursor-pointer',
    
    // Additional button variants
    tertiary: 'bg-gray-700 hover:bg-gray-600 active:bg-gray-500 text-white font-medium py-2 px-4 rounded-md transition-colors duration-150 font-mono',
    danger: 'bg-red-900 hover:bg-red-800 active:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-150 font-mono',
    success: 'bg-green-900 hover:bg-green-800 active:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-150 font-mono',
    
    // Text button variants
    text: brandConfig.name === 'OMG'
        ? `text-gray-900 hover:text-[${brandConfig.primaryColor}] hover:bg-gray-100 py-2 px-3 rounded-md transition-all duration-150 font-sans`
        : 'text-white hover:text-fuchsia-500 hover:bg-gray-800 py-2 px-3 rounded-md transition-all duration-150 font-mono',
    textPrimary: brandConfig.name === 'OMG'
        ? `text-[${brandConfig.primaryColor}] hover:text-[${brandConfig.primaryColor}]/80 hover:bg-gray-100 py-2 px-3 rounded-md transition-all duration-150 font-sans`
        : 'text-fuchsia-500 hover:text-fuchsia-400 hover:bg-gray-800 py-2 px-3 rounded-md transition-all duration-150 font-mono',
    
    // Link style buttons with brand colors
    link: brandConfig.name === 'OMG'
        ? `text-[${brandConfig.secondaryColor}] hover:text-[${brandConfig.secondaryColor}]/80 transition-colors duration-150 cursor-pointer font-sans`
        : 'text-cyan-400 hover:text-cyan-300 transition-colors duration-150 cursor-pointer font-mono',
    linkMuted: brandConfig.name === 'OMG'
        ? 'text-gray-600 hover:text-gray-900 transition-colors duration-150 cursor-pointer font-sans'
        : 'text-gray-300 hover:text-white transition-colors duration-150 cursor-pointer font-mono',
    
    // Button sizes with brand-aware styling
    xs: brandConfig.name === 'OMG' ? 'py-1 px-2 text-xs rounded font-sans' : 'py-1 px-2 text-xs rounded font-mono',
    sm: brandConfig.name === 'OMG' ? 'py-1.5 px-3 text-sm font-sans' : 'py-1.5 px-3 text-sm font-mono',
    md: brandConfig.name === 'OMG' ? 'py-2 px-4 text-sm font-sans' : 'py-2 px-4 text-sm font-mono',
    lg: brandConfig.name === 'OMG' ? 'py-2.5 px-5 text-base font-sans' : 'py-2.5 px-5 text-base font-mono',
    xl: brandConfig.name === 'OMG' ? 'py-3 px-6 text-base font-sans' : 'py-3 px-6 text-base font-mono',
    
    // Special button styles
    iconButton: brandConfig.name === 'OMG'
        ? 'p-2 rounded-md hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors duration-150'
        : 'p-2 rounded-md hover:bg-gray-800 text-gray-300 hover:text-white transition-colors duration-150',
    iconButtonPrimary: brandConfig.name === 'OMG'
        ? `p-2 rounded-md hover:bg-gray-100 text-[${brandConfig.primaryColor}] hover:text-[${brandConfig.primaryColor}]/80 transition-colors duration-150`
        : 'p-2 rounded-md hover:bg-gray-800 text-fuchsia-500 hover:text-fuchsia-400 transition-colors duration-150',
    pill: 'rounded-full',
    outline: 'bg-transparent border border-current',
    
    // States
    disabled: 'opacity-50 cursor-not-allowed',
    loading: 'opacity-80 cursor-wait',
    
    // Button with left icon
    withLeftIcon: 'inline-flex items-center',
    withRightIcon: 'inline-flex items-center justify-center',
    
    // Brand-specific subscription button
    subscribe: brandConfig.name === 'OMG'
        ? `bg-[${brandConfig.primaryColor}] text-white font-sans text-sm font-medium py-2 px-4 rounded transition-colors duration-150 hover:bg-[${brandConfig.primaryColor}]/90`
        : 'bg-fuchsia-600 text-white font-sans text-sm font-medium py-2 px-4 rounded transition-colors duration-150 hover:bg-fuchsia-500',
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