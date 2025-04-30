// Theme definitions: colors, typography, and category icon/styles

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

// Cyberpunk-themed color system with neon accents
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

    // Cyberpunk neon accent colors
    accent: {
        // Neon pink (primary accent)
        blue: {
        50: 'bg-fuchsia-900',    // Pink background / hover states
        100: 'bg-fuchsia-800',   // Pink background (stronger)
        200: 'bg-fuchsia-700',   // Light borders
        500: 'bg-fuchsia-600',   // Primary accent
        600: 'bg-fuchsia-500',   // Hover states
        text: 'text-fuchsia-500', // Accent text (#EA00D9 equivalent)
        border: 'border-fuchsia-500', // Neon borders
        },
        // Neon cyan (secondary accent)
        amber: {
        50: 'bg-cyan-900',
        100: 'bg-cyan-800',
        text: 'text-cyan-400',  // #0ABDC6 equivalent
        border: 'border-cyan-400',
        },
        // Additional neon accent
        emerald: {
        50: 'bg-purple-900',
        100: 'bg-purple-800',
        text: 'text-purple-500',
        border: 'border-purple-500',
        },
    },

    // Text colors
    text: {
        primary: 'text-white',           // White text on dark background
        secondary: 'text-gray-300',      // Light gray secondary text
        tertiary: 'text-gray-400',       // Medium gray tertiary text
        light: 'text-gray-500',          // Darker gray light text
        inverted: 'text-gray-900',       // Dark text on light backgrounds
        accent: 'text-fuchsia-500',      // Neon pink accent text (#EA00D9)
        link: 'text-cyan-400 hover:text-cyan-300', // Cyan links (#0ABDC6)
    },

    // Border colors
    border: {
        lightest: 'border-gray-700',
        light: 'border-gray-600',
        default: 'border-gray-500',
        medium: 'border-gray-400',
        accent: 'border-fuchsia-500',   // Neon pink borders
    },

    // Background colors
    bg: {
        page: 'bg-gray-900',            // Dark background (#1c1d1f)
        card: 'bg-gray-800',            // Slightly lighter card background
        offset: 'bg-gray-800',          // Offset background 
        hover: 'bg-gray-700',           // Hover state
        active: 'bg-gray-600',          // Active state
        accent: 'bg-fuchsia-900',       // Pink accent bg
        accentHover: 'bg-fuchsia-800',  // Pink accent hover
    },

    // Status colors - cyberpunk neon variants
    status: {
        success: { text: 'text-green-400', bg: 'bg-green-900', border: 'border-green-500' },
        error: { text: 'text-red-400', bg: 'bg-red-900', border: 'border-red-500' },
        warning: { text: 'text-yellow-300', bg: 'bg-yellow-900', border: 'border-yellow-500' },
        info: { text: 'text-cyan-400', bg: 'bg-cyan-900', border: 'border-cyan-500' },
    },
};

// Typography system with cyberpunk styling
export const textStyles: TextTheme = {
    // Color variants - semantic text styles
    primary: colors.text.primary,
    secondary: colors.text.secondary,
    tertiary: colors.text.tertiary,
    accent: colors.text.accent,
    muted: colors.text.tertiary,
    disabled: colors.text.light,

    // Link variants
    link: colors.text.link,           // Cyan link style with hover state (#0ABDC6)
    linkAccent: 'text-fuchsia-500 hover:text-fuchsia-400 transition-colors duration-150',  // Neon pink links (#EA00D9)
    linkSubtle: 'text-gray-300 hover:text-white transition-colors duration-150',  // Subtle links

    // Size variants with optimized line heights
    xs: 'text-xs leading-5 tracking-wide font-mono',  // Added monospace font
    sm: 'text-sm leading-5 tracking-normal font-mono',
    base: 'text-base leading-6 tracking-normal font-mono',
    lg: 'text-lg leading-7 tracking-tight font-mono',
    xl: 'text-xl leading-7 tracking-tight font-mono',
    '2xl': 'text-2xl leading-8 tracking-tight font-mono',
    '3xl': 'text-3xl leading-9 tracking-tight font-mono',
    '4xl': 'text-4xl leading-10 tracking-tight font-mono',

    // Weight variants
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',

    // Common utility text styles
    caption: 'text-xs leading-5 text-gray-400 font-mono',
    overline: 'text-xs uppercase tracking-wider font-medium text-fuchsia-500 font-mono',  // Neon pink small text
    label: 'text-sm font-medium text-gray-300 font-mono',
    helper: 'text-xs text-gray-400 mt-1 font-mono',

    // Size variant (duplicate removed)
    // xs already defined above

    // Body text convenience combinations
    bodySmall: 'text-sm leading-5 text-gray-300 font-mono',
    body: 'text-base leading-6 text-white font-mono',            // White text
    bodyLarge: 'text-lg leading-7 text-white font-mono',
};

// Cyberpunk heading system with neon accent colors
export const headingStyles = {
    // Main headings with neon pink accent color
    h1: 'text-4xl font-bold text-fuchsia-500 mb-8 tracking-tight font-mono',  // Neon pink headings
    h2: 'text-3xl font-bold text-fuchsia-500 mb-6 tracking-tight font-mono',
    h3: 'text-2xl font-semibold text-fuchsia-500 mb-4 tracking-tight font-mono',
    h4: 'text-xl font-semibold text-fuchsia-500 mb-3 tracking-tight font-mono',
    h5: 'text-lg font-semibold text-fuchsia-500 mb-2 font-mono',
    h6: 'text-base font-semibold text-fuchsia-500 mb-2 font-mono',

    // Semantic heading styles for specific uses
    page: 'text-3xl font-bold text-fuchsia-500 mb-6 tracking-tight font-mono',
    section: 'text-2xl font-semibold text-fuchsia-500 mb-6 mt-2 tracking-tight font-mono',
    subsection: 'text-xl font-semibold text-fuchsia-500 mb-4 mt-1 font-mono',
    card: 'text-lg font-medium text-fuchsia-500 mb-3 font-mono',

    // Variations with accent colors
    accent: 'text-2xl font-semibold text-cyan-400 mb-4 tracking-tight font-mono',  // Cyan accent (#0ABDC6)
    subtle: 'text-xl font-medium text-gray-300 mb-3 font-mono',

    // Heading with icon
    withIcon: 'flex items-center gap-2',
};

// Cyberpunk category styles with dark backgrounds and neon accents
export const categoryStyles = {
    // Common cyberpunk styles for all categories
    common: {
      bg: 'bg-gray-800',
      border: 'border-gray-700',
      full: 'bg-gray-800 border-gray-700',
      title: 'text-fuchsia-500 font-mono',
      shadow: 'shadow-md',
    },
    
    // Category-specific icons with neon style
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