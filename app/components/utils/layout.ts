// Layout definitions: containers, tables, icons, buttons

// Cyberpunk card and container styles with neon borders and dark backgrounds
export const containerStyles = {
    // Card variants with neon borders and dark backgrounds
    card: 'bg-gray-800 p-5 rounded-lg shadow-md border border-gray-700 hover:border-fuchsia-500 transition-all duration-200',
    cardHover: 'bg-gray-800 p-5 rounded-lg shadow-md border border-gray-700 hover:border-cyan-400 hover:bg-gray-700 transition-all duration-200',
    cardActive: 'bg-gray-800 p-5 rounded-lg shadow-md border-l-4 border-fuchsia-500 border-t border-r border-b border-gray-700',
    cardAccent: 'bg-gray-800 p-5 rounded-lg shadow-md border border-fuchsia-500 hover:border-fuchsia-400 transition-all duration-200',
    cardOutline: 'bg-gray-800 p-5 rounded-lg border border-gray-700 hover:border-cyan-400 transition-all duration-200',
    cardFlat: 'bg-gray-800 p-5 rounded-lg border border-gray-700',
    
    // Section containers with cyberpunk styling
    section: 'bg-gray-800 rounded-lg px-8 py-7 border border-gray-700',
    sectionDivider: 'border-t border-fuchsia-900 my-10',
    
    // Modern grid layouts with improved spacing
    grid2col: 'grid grid-cols-1 md:grid-cols-2 gap-5',
    grid3col: 'grid grid-cols-1 md:grid-cols-3 gap-5',
    grid4col: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5',
    
    // Responsive grid with auto-fit for dynamic column count
    gridAutoFit: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5',
    gridAutoFitWide: 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5',
    gridAutoFitNarrow: 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4',
    
    // Feature/card layouts with cyberpunk styling to match company cards
    featureGrid: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr mx-auto',
    featureCard: 'flex flex-col rounded-lg border border-gray-600 bg-gray-200 overflow-hidden hover:border-fuchsia-500 hover:bg-gray-100 hover:shadow-[0_0_10px_rgba(234,0,217,0.4)] hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer no-underline w-full h-full relative',
    featureImage: 'relative h-36 bg-gray-800 flex-shrink-0 border-b border-gray-600',
    featureContent: 'p-5 flex-1 flex flex-col overflow-hidden relative pb-16',
    featureTitle: 'text-lg font-semibold mb-3 text-gray-800 font-mono group-hover:text-fuchsia-600',
    featureDescription: 'text-gray-700 text-sm font-mono',
    featureFooter: 'flex items-end justify-end',
    featureLink: 'text-fuchsia-600 hover:text-fuchsia-500 text-sm flex items-center group font-mono',
    
    // Subscription card styles with fixed width so incomplete rows center correctly
    subscriptionGrid: 'flex flex-wrap justify-center gap-6',
    subscriptionCard: 'flex flex-col rounded-lg border border-gray-600 bg-gray-200 overflow-hidden hover:border-fuchsia-500 hover:bg-gray-100 hover:shadow-[0_0_10px_rgba(234,0,217,0.4)] hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer no-underline w-80 relative',
    subscriptionHeader: 'px-5 py-3 bg-[#2d3748] border-b border-gray-600 h-[70px] flex flex-col justify-center', /* Fixed height header for consistency */
    subscriptionContent: 'px-5 pt-5 pb-10 flex-1 flex flex-col overflow-hidden', /* Increased bottom padding further */
    subscriptionTier: 'text-lg font-semibold text-fuchsia-500 font-mono leading-tight',
    subscriptionType: 'px-2 py-0.5 bg-gray-600 rounded text-xs text-cyan-400 font-mono',
    subscriptionPrice: 'text-xl font-bold text-gray-800 font-mono mb-4',
    subscriptionPriceUnit: 'text-xs text-gray-600 font-normal font-mono',
    subscriptionFeatureList: 'space-y-2 text-sm flex-1',
    subscriptionFeatureItem: 'flex items-start',
    subscriptionFeatureCheck: 'text-fuchsia-500 mr-2 flex-shrink-0',
    subscriptionFeatureText: 'text-gray-700 font-mono',
    
    // Explorer view layouts with consistent spacing
    explorerContainer: 'space-y-6',
    // Two-column layout: mobile single column; on md+ first column 5/8 width, second column 3/8 width
    explorerRowTwo: 'grid items-stretch grid-cols-1 md:grid-cols-[5fr_3fr] gap-5',
    explorerRowFour: 'grid items-stretch grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5',
    
    // Category section with cyberpunk styling
    categorySection: 'h-full bg-gray-800 rounded-lg shadow-md p-5 border border-gray-700 transition-all duration-200',
    categoryTitle: 'text-lg font-semibold text-fuchsia-500 flex items-center font-mono',
    categoryTitleInline: 'text-lg font-semibold text-fuchsia-500 pr-4 flex items-center font-mono',
    categorySectionHover: 'hover:border-fuchsia-900',
    categoryIcon: 'mr-2 text-cyan-400 text-lg',
    
    // Company card with refined cyberpunk hover effects
    companyCardContainer: 'flex flex-col items-center h-full min-h-[168px] cursor-pointer p-4 rounded-lg border border-gray-600 bg-gray-200 hover:border-fuchsia-500 hover:bg-gray-100 hover:shadow-[0_0_10px_rgba(234,0,217,0.4)] hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-300',
    companyCardLogoOnly: 'flex items-center justify-center h-full min-h-[168px] cursor-pointer p-4 rounded-lg border border-gray-600 bg-gray-200 hover:border-fuchsia-500 hover:bg-gray-100 hover:shadow-[0_0_10px_rgba(234,0,217,0.4)] hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-300',
    companyCardLogoOnlyMedia: 'flex items-center justify-center h-full cursor-pointer p-4 rounded-lg border border-gray-600 bg-gray-200 hover:border-fuchsia-500 hover:bg-gray-100 hover:shadow-[0_0_10px_rgba(234,0,217,0.4)] hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-300',
    companyLogo: 'relative h-14 w-full flex items-center justify-center mb-3 bg-white rounded-md p-2',
    companyLogoLarge: 'relative h-16 w-full flex items-center justify-center bg-white rounded-md p-2',
    companyLogoImage: 'mx-auto object-contain max-h-12 max-w-full',
    companyModel: 'text-center text-sm font-medium text-gray-800 mb-1 font-mono group-hover:text-fuchsia-600',
    
    // Company grid layouts with improved spacing and specified column counts
    companyGridFull: 'grid items-stretch grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5',
    companyGridHalf: 'grid items-stretch grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5', // Now 4 columns for Open Source Models
    companyGridQuarter: 'grid items-stretch grid-cols-1 sm:grid-cols-2 gap-5', // Matched gap-5 to be consistent with Open Models
    
    // Company detail with cyberpunk styling
    companyDetailHeader: 'flex flex-col md:flex-row items-center p-6 rounded-lg border border-gray-700 bg-gray-800 shadow-md',
    companyLogoContainer: 'relative flex items-center justify-center h-24 w-48 flex-shrink-0 mb-4 md:mb-0 md:mr-8 bg-white rounded-md p-2 hover:border-fuchsia-400 transition-all duration-300 border border-fuchsia-500',
    companyDescriptionContainer: 'flex-1 flex items-center',
    companyDescription: 'text-gray-300 font-mono',
    companyDetailSection: 'mt-6 mb-4 space-y-4',
    
    // App layout with cyberpunk theme styling
    appContainer: 'min-h-screen bg-gray-900',
    header: 'bg-gray-800 shadow-md sticky top-0 z-30 border-b border-gray-700',
    headerContent: 'container mx-auto px-5 py-6 flex items-center justify-between relative h-[90px]', /* Fixed height with padding */
    appTitle: 'text-xl font-semibold cursor-pointer text-fuchsia-500 hover:text-fuchsia-400 transition-colors font-mono',
    mainContent: 'container mx-auto p-5 md:p-6',
    footer: 'bg-gray-800 text-cyan-400 mt-16 py-10 border-t border-fuchsia-900',
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
    legend: 'max-w-3xl mx-auto mt-0 rounded-lg border border-gray-700',
    legendBox: 'flex items-center p-4 rounded-lg',
    legendLabel: 'text-fuchsia-500 text-sm mr-4 font-mono',
    legendItems: 'flex items-center flex-wrap gap-3',
    legendItem: 'flex items-center gap-3 mr-4'
};

// Cyberpunk table styles with dark backgrounds and neon accents
export const tableStyles = {
    // Base table styles - dark background with neon borders
    table: 'w-full bg-gray-900 border border-gray-700 rounded-lg shadow-md overflow-hidden font-mono',
    
    // Header styles with neon pink accent
    header: 'bg-gray-800 border-b border-fuchsia-800 sticky top-0',
    headerCell: 'py-3.5 px-4 text-left font-semibold text-fuchsia-500 tracking-wide text-sm bg-gray-800',
    headerCellCenter: 'py-3.5 px-4 text-center font-semibold text-fuchsia-500 tracking-wide text-sm bg-gray-800',
    headerFixed: 'sticky left-0 bg-gray-800 z-10',
    
    // Cell styles with light text on dark background
    cell: 'py-3.5 px-4 border-b border-gray-800 text-white transition-colors duration-150',
    cellCenter: 'py-3.5 px-4 border-b border-gray-800 text-center text-white transition-colors duration-150',
    cellHighlight: 'bg-fuchsia-900',
    
    // Row interactions with cyberpunk effects
    rowHover: 'hover:bg-gray-700 hover:cursor-pointer transition-all duration-150',
    rowSelected: 'bg-fuchsia-900',
    rowEven: 'bg-gray-800/40', // Subtle striping
    rowOdd: 'bg-gray-900',
    
    // Sticky cells
    stickyCell: 'sticky left-0 bg-gray-900 z-10',
    stickyLabelCell: 'sticky left-0 bg-gray-800 z-10',
    stickyCellHover: 'sticky left-0 bg-gray-800 z-10',
    
    // Content formatting
    content: 'text-white',
    contentSecondary: 'text-gray-300 text-sm',
    
    // Special cell styles
    modelName: 'font-medium text-cyan-400 font-mono text-base',
    metric: 'font-medium text-white tabular-nums font-mono',
    
    // Border utilities
    borderRight: 'border-r border-gray-800',
    borderLeft: 'border-l border-gray-800',
    
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
    
    // Rating icons with neon cyan (same as format icons)
    ratingContainer: 'flex items-center justify-center',
    ratingFilled: 'text-cyan-400', // Changed to cyan to match format icons
    ratingEmpty: 'text-gray-600', // Changed to match inactiveFormat
    iconSpacing: 'mx-0.5',
    
    // Format indicators with neon cyan
    activeFormat: 'text-cyan-400',
    inactiveFormat: 'text-gray-600', // Lighter gray to be more visible
    formatContainer: 'flex gap-4 justify-center',
    formatItem: 'flex items-center mx-2',
    
    // Table row label icons with neon pink
    tableRowIcon: 'text-fuchsia-500',
    
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
    
    // Boolean indicator icons
    booleanTrue: 'text-cyan-400 text-lg bi bi-check-circle-fill',
    booleanFalse: 'text-gray-600 text-lg bi bi-x-circle-fill',
};

// Cyberpunk button system with neon colors and dark backgrounds
export const buttonStyles = {
    // Primary action buttons with neon pink (#EA00D9)
    primary: 'bg-fuchsia-600 hover:bg-fuchsia-500 active:bg-fuchsia-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-150 font-mono cursor-pointer',
    secondary: 'bg-gray-800 hover:bg-gray-700 active:bg-gray-600 text-white border border-fuchsia-500 font-medium py-2 px-4 rounded-md transition-all duration-150 font-mono cursor-pointer',
    
    // Additional button variants
    tertiary: 'bg-gray-700 hover:bg-gray-600 active:bg-gray-500 text-white font-medium py-2 px-4 rounded-md transition-colors duration-150 font-mono',
    danger: 'bg-red-900 hover:bg-red-800 active:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-150 font-mono',
    success: 'bg-green-900 hover:bg-green-800 active:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-150 font-mono',
    
    // Text button variants
    text: 'text-white hover:text-fuchsia-500 hover:bg-gray-800 py-2 px-3 rounded-md transition-all duration-150 font-mono',
    textPrimary: 'text-fuchsia-500 hover:text-fuchsia-400 hover:bg-gray-800 py-2 px-3 rounded-md transition-all duration-150 font-mono',
    
    // Link style buttons with neon colors
    link: 'text-cyan-400 hover:text-cyan-300 transition-colors duration-150 cursor-pointer font-mono',
    linkMuted: 'text-gray-300 hover:text-white transition-colors duration-150 cursor-pointer font-mono',
    
    // Button sizes with cyberpunk styling
    xs: 'py-1 px-2 text-xs rounded font-mono',
    sm: 'py-1.5 px-3 text-sm font-mono',
    md: 'py-2 px-4 text-sm font-mono',
    lg: 'py-2.5 px-5 text-base font-mono',
    xl: 'py-3 px-6 text-base font-mono',
    
    // Special button styles
    iconButton: 'p-2 rounded-md hover:bg-gray-800 text-gray-300 hover:text-white transition-colors duration-150',
    iconButtonPrimary: 'p-2 rounded-md hover:bg-gray-800 text-fuchsia-500 hover:text-fuchsia-400 transition-colors duration-150',
    pill: 'rounded-full',
    outline: 'bg-transparent border border-current',
    
    // States
    disabled: 'opacity-50 cursor-not-allowed',
    loading: 'opacity-80 cursor-wait',
    
    // Button with left icon
    withLeftIcon: 'inline-flex items-center',
    withRightIcon: 'inline-flex items-center justify-center',
    
    // Cyberpunk-specific button
    subscribe: 'bg-fuchsia-600 text-white font-sans text-sm font-medium py-2 px-4 rounded transition-colors duration-150 hover:bg-fuchsia-500',
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