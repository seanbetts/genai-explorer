// Theme definitions: colors, typography, and category icon/styles
import brandConfig from '../../config/brand';

// TypeScript interfaces for theme objects
interface ColorTheme {
    neutral: Record<string, string>;
    accent: {
        blue: Record<string, string>;
        amber: Record<string, string>;
        emerald: Record<string, string>;
    };
    text: Record<string, string>;
    border: Record<string, string>;
    bg: Record<string, string>;
    status: Record<string, Record<string, string>>;
}

interface TextTheme {
    // Color variants
    primary: string;
    secondary: string;
    tertiary: string;
    accent: string;
    muted: string;
    disabled: string;

    // Link variants
    link: string;
    linkAccent: string;
    linkSubtle: string;

    // Size variants
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;

    // Weight variants
    light: string;
    normal: string;
    medium: string;
    semibold: string;
    bold: string;

    // Utility styles
    caption: string;
    overline: string;
    label: string;
    helper: string;

    // Body text combinations
    bodySmall: string;
    body: string;
    bodyLarge: string;
}

// Get color classes from brand configuration
const getPrimaryColor = () => {
  if (brandConfig.primaryColor.startsWith('#')) {
    return {
      bg: `bg-[${brandConfig.primaryColor}]`,
      text: `text-[${brandConfig.primaryColor}]`,
      border: `border-[${brandConfig.primaryColor}]`
    };
  }
  return {
    bg: 'bg-fuchsia-500',
    text: 'text-fuchsia-500',
    border: 'border-fuchsia-500'
  };
};

const getSecondaryColor = () => {
  if (brandConfig.secondaryColor.startsWith('#')) {
    return {
      bg: `bg-[${brandConfig.secondaryColor}]`,
      text: `text-[${brandConfig.secondaryColor}]`,
      border: `border-[${brandConfig.secondaryColor}]`
    };
  }
  return {
    bg: 'bg-cyan-400',
    text: 'text-cyan-400',
    border: 'border-cyan-400'
  };
};

const primaryColor = getPrimaryColor();
const secondaryColor = getSecondaryColor();

// Color system with brand-aware accent colors
export const colors: ColorTheme = {
    // Base neutrals for backgrounds and text - dark theme
    neutral: {
        50: 'bg-gray-800',  // Darker background (replaces lightest)
        100: 'bg-gray-700', // Dark background / hover states
        200: 'bg-gray-600', // Dividers, borders
        300: 'bg-gray-500', // Disabled states
        400: 'bg-gray-400', // Secondary icons
        500: 'bg-gray-300', // Secondary text
        600: 'bg-gray-200', // Primary text (lighter)
        700: 'bg-gray-100', // Primary text (standard)
        800: 'bg-white',    // Headings
        900: 'bg-white',    // High contrast text
    },

    // Brand-specific accent colors
    accent: {
        // Primary accent color
        blue: {
        50: `bg-opacity-90`,          // Background opacity
        100: `bg-opacity-80`,         // Background opacity
        200: `bg-opacity-70`,         // Light borders
        500: primaryColor.bg,         // Primary accent background
        600: primaryColor.bg,         // Hover states
        text: primaryColor.text,      // Accent text
        border: primaryColor.border,  // Accent borders
        },
        // Secondary accent color
        amber: {
        50: `bg-opacity-90`,
        100: `bg-opacity-80`,
        text: secondaryColor.text,    // Secondary text
        border: secondaryColor.border,// Secondary borders
        },
        // Additional accent - keeping this the same
        emerald: {
        50: 'bg-purple-900',
        100: 'bg-purple-800',
        text: 'text-purple-500',
        border: 'border-purple-500',
        },
    },

    // Text colors - brand-specific
    text: {
        primary: brandConfig.name === 'OMG' ? 'text-gray-900' : 'text-white',           // Dark text for OMG, white for Blueprint
        secondary: brandConfig.name === 'OMG' ? 'text-gray-700' : 'text-gray-300',      // Medium gray for OMG, light for Blueprint
        tertiary: brandConfig.name === 'OMG' ? 'text-gray-600' : 'text-gray-400',       // Light gray for OMG, medium for Blueprint
        light: brandConfig.name === 'OMG' ? 'text-gray-500' : 'text-gray-500',          // Same gray for both
        inverted: brandConfig.name === 'OMG' ? 'text-white' : 'text-gray-900',          // White for OMG, dark for Blueprint
        accent: primaryColor.text,                                                     // Primary brand accent text
        link: `${secondaryColor.text} hover:text-opacity-80`,                          // Secondary color links
    },

    // Border colors - brand-specific
    border: {
        lightest: brandConfig.name === 'OMG' ? 'border-gray-200' : 'border-gray-700',
        light: brandConfig.name === 'OMG' ? 'border-gray-300' : 'border-gray-600',
        default: brandConfig.name === 'OMG' ? 'border-gray-400' : 'border-gray-500',
        medium: brandConfig.name === 'OMG' ? 'border-gray-500' : 'border-gray-400',
        accent: primaryColor.border,    // Primary brand borders
    },

    // Background colors - brand-specific
    bg: {
        page: brandConfig.name === 'OMG' ? 'bg-white' : 'bg-gray-900',             // White for OMG, dark for Blueprint
        card: brandConfig.name === 'OMG' ? 'bg-gray-50' : 'bg-gray-800',          // Light gray for OMG, dark for Blueprint
        offset: brandConfig.name === 'OMG' ? 'bg-gray-100' : 'bg-gray-800',       // Slightly darker for OMG, dark for Blueprint 
        hover: brandConfig.name === 'OMG' ? 'bg-gray-200' : 'bg-gray-700',        // Hover state
        active: brandConfig.name === 'OMG' ? 'bg-gray-300' : 'bg-gray-600',       // Active state
        accent: 'bg-opacity-90',                                                // Primary accent bg with opacity
        accentHover: 'bg-opacity-80',                                           // Primary accent hover with opacity
    },

    // Status colors - cyberpunk neon variants
    status: {
        success: { text: 'text-green-400', bg: 'bg-green-900', border: 'border-green-500' },
        error: { text: 'text-red-400', bg: 'bg-red-900', border: 'border-red-500' },
        warning: { text: 'text-yellow-300', bg: 'bg-yellow-900', border: 'border-yellow-500' },
        info: { text: secondaryColor.text, bg: 'bg-cyan-900', border: secondaryColor.border },
    },
};

// Typography system with brandable styling
export const textStyles: TextTheme = {
    // Color variants - semantic text styles
    primary: colors.text.primary,
    secondary: colors.text.secondary,
    tertiary: colors.text.tertiary,
    accent: colors.text.accent,
    muted: colors.text.tertiary,
    disabled: colors.text.light,

    // Link variants
    link: colors.text.link,           // Brand-based link style with hover state
    linkAccent: `${primaryColor.text} hover:text-opacity-80 transition-colors duration-150`,  // Primary accent links
    linkSubtle: 'text-gray-300 hover:text-white transition-colors duration-150',  // Subtle links

    // Size variants with optimized line heights - brand-specific font family
    xs: brandConfig.name === 'OMG' ? 'text-xs leading-5 tracking-wide font-sans' : 'text-xs leading-5 tracking-wide font-mono',
    sm: brandConfig.name === 'OMG' ? 'text-sm leading-5 tracking-normal font-sans' : 'text-sm leading-5 tracking-normal font-mono',
    base: brandConfig.name === 'OMG' ? 'text-base leading-6 tracking-normal font-sans' : 'text-base leading-6 tracking-normal font-mono',
    lg: brandConfig.name === 'OMG' ? 'text-lg leading-7 tracking-tight font-sans' : 'text-lg leading-7 tracking-tight font-mono',
    xl: brandConfig.name === 'OMG' ? 'text-xl leading-7 tracking-tight font-sans' : 'text-xl leading-7 tracking-tight font-mono',
    '2xl': brandConfig.name === 'OMG' ? 'text-2xl leading-8 tracking-tight font-sans' : 'text-2xl leading-8 tracking-tight font-mono',
    '3xl': brandConfig.name === 'OMG' ? 'text-3xl leading-9 tracking-tight font-sans' : 'text-3xl leading-9 tracking-tight font-mono',
    '4xl': brandConfig.name === 'OMG' ? 'text-4xl leading-10 tracking-tight font-sans' : 'text-4xl leading-10 tracking-tight font-mono',

    // Weight variants
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',

    // Common utility text styles - brand specific font family
    caption: brandConfig.name === 'OMG' ? 'text-xs leading-5 text-gray-400 font-sans' : 'text-xs leading-5 text-gray-400 font-mono',
    overline: brandConfig.name === 'OMG' 
      ? `text-xs uppercase tracking-wider font-medium ${primaryColor.text} font-sans` 
      : `text-xs uppercase tracking-wider font-medium ${primaryColor.text} font-mono`,
    label: brandConfig.name === 'OMG' ? 'text-sm font-medium text-gray-300 font-sans' : 'text-sm font-medium text-gray-300 font-mono',
    helper: brandConfig.name === 'OMG' ? 'text-xs text-gray-400 mt-1 font-sans' : 'text-xs text-gray-400 mt-1 font-mono',

    // Body text convenience combinations - brand specific font family
    bodySmall: brandConfig.name === 'OMG' ? 'text-sm leading-5 text-gray-300 font-sans' : 'text-sm leading-5 text-gray-300 font-mono',
    body: brandConfig.name === 'OMG' ? 'text-base leading-6 text-gray-900 font-sans' : 'text-base leading-6 text-white font-mono',
    bodyLarge: brandConfig.name === 'OMG' ? 'text-lg leading-7 text-gray-900 font-sans' : 'text-lg leading-7 text-white font-mono',
};

// Brand-aware heading system with accent colors
export const headingStyles = {
    // Main headings with primary brand accent color
    h1: brandConfig.name === 'OMG' 
      ? `text-4xl font-bold ${primaryColor.text} mb-8 tracking-tight font-sans` 
      : `text-4xl font-bold ${primaryColor.text} mb-8 tracking-tight font-mono`,
    h2: brandConfig.name === 'OMG' 
      ? `text-3xl font-bold ${primaryColor.text} mb-6 tracking-tight font-sans` 
      : `text-3xl font-bold ${primaryColor.text} mb-6 tracking-tight font-mono`,
    h3: brandConfig.name === 'OMG' 
      ? `text-2xl font-semibold ${primaryColor.text} mb-4 tracking-tight font-sans` 
      : `text-2xl font-semibold ${primaryColor.text} mb-4 tracking-tight font-mono`,
    h4: brandConfig.name === 'OMG' 
      ? `text-xl font-semibold ${primaryColor.text} mb-3 tracking-tight font-sans` 
      : `text-xl font-semibold ${primaryColor.text} mb-3 tracking-tight font-mono`,
    h5: brandConfig.name === 'OMG' 
      ? `text-lg font-semibold ${primaryColor.text} mb-2 font-sans` 
      : `text-lg font-semibold ${primaryColor.text} mb-2 font-mono`,
    h6: brandConfig.name === 'OMG' 
      ? `text-base font-semibold ${primaryColor.text} mb-2 font-sans` 
      : `text-base font-semibold ${primaryColor.text} mb-2 font-mono`,

    // Semantic heading styles for specific uses
    page: brandConfig.name === 'OMG' 
      ? `text-3xl font-bold ${primaryColor.text} mb-6 tracking-tight font-sans` 
      : `text-3xl font-bold ${primaryColor.text} mb-6 tracking-tight font-mono`,
    section: brandConfig.name === 'OMG' 
      ? `text-2xl font-semibold ${primaryColor.text} mb-6 mt-2 tracking-tight font-sans` 
      : `text-2xl font-semibold ${primaryColor.text} mb-6 mt-2 tracking-tight font-mono`,
    subsection: brandConfig.name === 'OMG' 
      ? `text-xl font-semibold ${primaryColor.text} mb-4 mt-1 font-sans` 
      : `text-xl font-semibold ${primaryColor.text} mb-4 mt-1 font-mono`,
    card: brandConfig.name === 'OMG' 
      ? `text-lg font-medium ${primaryColor.text} mb-3 font-sans` 
      : `text-lg font-medium ${primaryColor.text} mb-3 font-mono`,

    // Variations with accent colors
    accent: brandConfig.name === 'OMG' 
      ? `text-2xl font-semibold ${secondaryColor.text} mb-4 tracking-tight font-sans` 
      : `text-2xl font-semibold ${secondaryColor.text} mb-4 tracking-tight font-mono`,
    subtle: brandConfig.name === 'OMG' 
      ? 'text-xl font-medium text-gray-300 mb-3 font-sans' 
      : 'text-xl font-medium text-gray-300 mb-3 font-mono',

    // Heading with icon
    withIcon: 'flex items-center gap-2',
};

// Brand-aware category styles with consistent styling
export const categoryStyles = {
    // Common styles for all categories using brand colors
    common: {
      bg: 'bg-gray-800',
      border: 'border-gray-700',
      full: 'bg-gray-800 border-gray-700',
      title: brandConfig.name === 'OMG' 
        ? `${primaryColor.text} font-sans` 
        : `${primaryColor.text} font-mono`, // Primary brand color for titles with brand-specific font
      shadow: 'shadow-md',
    },
    
    // Category-specific icons (same icons, styled with brand colors)
    icons: {
      frontier: 'bi-stars',
      open: 'bi-unlock',
      enterprise: 'bi-building',
      image: 'bi-image',
      video: 'bi-camera-video',
      audio: 'bi-music-note',
      other: 'bi-grid',
    }
};