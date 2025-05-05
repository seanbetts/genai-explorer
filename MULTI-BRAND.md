# Multi-Brand Implementation Plan

This document outlines the approach for maintaining two versions of the Generative AI Explorer:
1. **Personal Version** - The original design for The Blueprint
2. **OMG Version** - The employer-specific version with different styling and structure

## Branch Strategy

We'll use a dedicated branch strategy to maintain both versions:

```
dev (development branch)
│
├── main (personal version branch)
│
└── omg (employer version with specific styling)
```

### Branch Purposes

- **dev**: Development branch where all new features are initially created and tested
- **main**: Production branch for the personal version of the explorer (current design)
- **omg**: Production branch for the OMG version with employer-specific styling, header, and no footer

## Configuration System

### 1. Create Brand Configuration

Create a configuration file to define brand-specific settings:

```typescript
// config/brand.ts
export type BrandConfig = {
  name: string;
  showFooter: boolean;
  logoPath: string;
  headerLinks: Array<{
    text: string;
    url: string;
  }>;
  primaryColor: string;
  secondaryColor: string;
  // Add other brand-specific configurations as needed
};

// Brand-specific configurations
export const brandConfigs = {
  personal: {
    name: 'The Blueprint',
    showFooter: true,
    logoPath: '/images/logo.png',
    headerLinks: [
      { text: 'Subscribe', url: 'https://www.the-blueprint.ai' }
    ],
    primaryColor: '#EA00D9', // fuchsia-500
    secondaryColor: '#0ABDC6', // cyan-400
  },
  
  omg: {
    name: 'OMG',
    showFooter: false, // No footer for employer version
    logoPath: '/images/omg-logo.png', // Employer logo
    headerLinks: [
      { text: 'Company Site', url: 'https://www.omg-employer.com' }
    ],
    primaryColor: '#4F46E5', // Example: indigo-600
    secondaryColor: '#10B981', // Example: emerald-500
  }
};

// Default to personal, override with environment variable
const getBrandKey = (): 'personal' | 'omg' => {
  // When building, use the NEXT_PUBLIC_BRAND env variable
  if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_BRAND) {
    return process.env.NEXT_PUBLIC_BRAND as 'personal' | 'omg';
  }
  
  // When running in browser, determine from hostname (optional)
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname.includes('omg') || hostname.includes('employer')) {
      return 'omg';
    }
  }
  
  // Default fallback
  return 'personal';
};

// Export the current brand configuration
const currentBrand = brandConfigs[getBrandKey()];
export default currentBrand;
```

### 2. Refactor Theme System

Update the theme system to use brand configuration:

```typescript
// utils/theme.ts
import brandConfig from '../config/brand';

// Derive colors from brand config
export const colors = {
  // Neutrals remain the same for both brands
  neutral: {
    // Existing neutral colors...
  },
  
  // Accent colors from brand config
  accent: {
    blue: {
      50: 'bg-opacity-90',    // Background opacity stays same
      100: 'bg-opacity-80',   // Background opacity stays same
      200: 'bg-opacity-70',   // Background opacity stays same
      500: `bg-[${brandConfig.primaryColor}]`,  // Primary brand color
      600: `bg-[${brandConfig.primaryColor}]`,  // Primary brand color
      text: `text-[${brandConfig.primaryColor}]`, // Text color
      border: `border-[${brandConfig.primaryColor}]`, // Border color
    },
    amber: {
      50: 'bg-opacity-90',
      100: 'bg-opacity-80',
      text: `text-[${brandConfig.secondaryColor}]`,
      border: `border-[${brandConfig.secondaryColor}]`,
    },
    // Other accent colors
  },
  
  // Text colors using brand config
  text: {
    primary: 'text-white',           // White text on dark background for both
    secondary: 'text-gray-300',      // Light gray secondary text
    tertiary: 'text-gray-400',       // Medium gray tertiary text
    light: 'text-gray-500',          // Darker gray light text
    inverted: 'text-gray-900',       // Dark text on light backgrounds
    accent: `text-[${brandConfig.primaryColor}]`,  // Primary accent text
    link: `text-[${brandConfig.secondaryColor}] hover:text-opacity-80`, // Secondary color links
  },
  
  // Other theme elements...
};
```

### 3. Modularize Header and Footer

Extract header and footer into their own components:

```typescript
// components/Header.tsx
import React from 'react';
import Image from 'next/image';
import brandConfig from '../config/brand';
import { containerStyles } from './utils/layout';

const Header = ({ 
  currentView, 
  goToHome,
  handleBack 
}) => {
  return (
    <header className={containerStyles.header}>
      <div className={containerStyles.headerContent}>
        {/* Left section with back button and logo */}
        <div className="flex items-center">
          {/* Logo image */}
          <button
            type="button"
            onClick={goToHome}
            className="p-0 m-0 border-0 bg-transparent cursor-pointer mr-4 hover:opacity-80 transition-opacity"
            aria-label="Home"
          >
            <Image 
              src="/images/bulb.png" 
              alt="Bulb" 
              width={48}
              height={48}
            />
          </button>
          
          {/* Back button - shown conditionally */}
          {(currentView === 'company' || currentView === 'benchmark') && (
            <button
              type="button"
              onClick={handleBack}
              className={`flex items-center gap-1 text-gray-300 hover:text-[${brandConfig.secondaryColor}] transition-colors cursor-pointer focus:ring-2 focus:ring-[${brandConfig.secondaryColor}] focus:ring-offset-0`}
              aria-label="Go back"
            >
              <i className="bi bi-chevron-left text-lg"></i>
              <span className="font-mono text-sm">Back</span>
            </button>
          )}
        </div>
        
        {/* Centered logo */}
        <button
          type="button"
          className="absolute left-1/2 transform -translate-x-1/2 cursor-pointer p-0 m-0 border-0 bg-transparent hover:opacity-80 transition-opacity"
          onClick={goToHome}
          aria-label="Home"
        >
          <Image
            src={brandConfig.logoPath}
            alt={`${brandConfig.name} - Generative AI Explorer`}
            width={200}
            height={56}
            priority
            className="h-14 w-auto"
          />
        </button>
        
        {/* Right section with brand links */}
        <div className="flex flex-col items-end pr-8">
          {/* Brand-specific links */}
          <div className="flex justify-end">
            {brandConfig.headerLinks.map((link, index) => (
              <a 
                key={index}
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="no-underline"
              >
                <div className={`flex font-mono text-[1em] font-medium w-[150px] h-[36px] bg-[${brandConfig.primaryColor}] p-2 text-white rounded-[5px] justify-center items-center cursor-pointer hover:-translate-y-[2px] hover:scale-105 transition-all duration-200`}>
                  {link.text}
                </div>
              </a>
            ))}
          </div>
          
          {/* Data last updated text */}
          {currentView === 'home' && (
            <div className="text-[10px] font-mono mt-2 text-right">
              Data last updated: <span className={`text-[${brandConfig.secondaryColor}] font-semibold`}>{
                new Date().toLocaleDateString('en-GB', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })
              }</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
```

```typescript
// components/Footer.tsx
import React from 'react';
import Link from 'next/link';
import brandConfig from '../config/brand';
import { containerStyles } from './utils/layout';

const Footer = ({ 
  currentView, 
  searchParams, 
  topCompanies, 
  topBenchmarks, 
  benchmarksLoaded 
}) => {
  // Hide footer for OMG version
  if (!brandConfig.showFooter) {
    return null;
  }
  
  // Original footer for personal version
  return (
    <footer className={containerStyles.footer + " mt-auto"}>
      <div className={containerStyles.footerContent}>
        {/* Footer content (original code) */}
        {/* ... */}
      </div>
    </footer>
  );
};

export default Footer;
```

### 4. Update Main Component

Refactor the main component to use the modular header and footer:

```typescript
// components/index.tsx
import React from 'react';
import Header from './Header';
import Footer from './Footer';
// Other imports...

const AIExplorer = ({ initialData }) => {
  // Existing state and functions...
  
  return (
    <div className={containerStyles.appContainer + " flex flex-col min-h-screen"}>
      <Header 
        currentView={currentView}
        goToHome={goToHome}
        handleBack={handleBack}
      />

      {/* Features Navigation - visible on all views - sticky */}
      {/* ... existing code ... */}

      <main className={containerStyles.mainContent + " flex-grow mb-32"}>
        {/* ... existing code ... */}
      </main>

      <Footer 
        currentView={currentView}
        searchParams={searchParams}
        topCompanies={topCompanies}
        topBenchmarks={topBenchmarks}
        benchmarksLoaded={benchmarksLoaded}
      />
    </div>
  );
};

export default AIExplorer;
```

## Implementation Steps

1. **Initial Setup**: Create the branch structure and foundation
   - Create the `dev` branch from `main` if it doesn't exist
   - Create the `omg` branch from `dev`
   - Set up the brand configuration system on the `dev` branch
   - Test building both versions locally

2. **Refactoring**: Update components to respect brand configuration
   - On the `dev` branch, implement theme adjustments
   - Extract header and footer into separate components
   - Test visual differences in both versions locally
   - Merge changes to `main` branch once the personal version is stable

3. **Customize OMG Branch**: Apply employer-specific changes
   - Merge `dev` into `omg` branch
   - Apply OMG-specific styling and header changes
   - Remove footer component for the OMG version
   - Commit OMG-specific changes to the `omg` branch only

4. **Data Strategy**: Ensure data synchronization
   - Create the data sync script on `dev` branch
   - Set up any brand-specific data overrides for `omg` branch
   - Verify benchmarks function in both versions

5. **Deployment Setup**: Configure GitHub for dual deployment
   - Set up GitHub Pages for the `omg` branch
   - Configure build scripts for both versions
   - Add GitHub Actions workflows if needed

## Feature Transfer Process

When adding new features, follow this workflow:

1. **Development**:
   - Work directly on the `dev` branch or create feature branches from `dev`
   - Develop and test the feature
   - Ensure brand-agnostic implementation with configuration for brand differences

2. **Merging to Personal Version**:
   - Ensure all changes are committed to `dev`
   - Test thoroughly
   - Merge `dev` to `main` branch when ready to deploy the personal version
   ```bash
   git checkout main
   git merge dev
   ```

3. **Transferring to OMG Version**:
   - Merge from `dev` to `omg`
   - Apply any OMG-specific adjustments needed
   - Test in the OMG brand context
   - Commit OMG-specific tweaks to the `omg` branch only
   ```bash
   git checkout omg
   git merge dev
   # Make OMG-specific adjustments
   git commit -m "Apply OMG-specific styling and configuration"
   ```

4. **Documentation**:
   - Document any brand-specific configurations in comments
   - Update this document if the process changes

## Deployment Process

### Personal Version Deployment
```bash
# Build the personal version
git checkout main
npm run build  # NEXT_PUBLIC_BRAND=personal is the default

# Deploy to Netlify
npm run deploy:personal
```

### OMG Version Deployment
```bash
# Build the OMG version
git checkout omg
NEXT_PUBLIC_BRAND=omg npm run build

# Deploy to GitHub Pages
npm run deploy:omg
```

## Local Development

Add these scripts to package.json:

```json
"scripts": {
  "dev:personal": "next dev",
  "dev:omg": "NEXT_PUBLIC_BRAND=omg next dev",
  "build:personal": "next build",
  "build:omg": "NEXT_PUBLIC_BRAND=omg next build",
  "deploy:personal": "netlify deploy --prod",
  "deploy:omg": "gh-pages -d out -b gh-pages"
}
```

## Additional Considerations

1. **Assets Management**:
   - Create an `assets-omg` folder for OMG-specific images and resources
   - Use conditional imports based on brand config

2. **Environment Variables**:
   - Use `.env.personal` and `.env.omg` for environment-specific settings
   - Load the appropriate file based on the NEXT_PUBLIC_BRAND variable

3. **Testing**:
   - Create brand-specific visual regression tests
   - Test both versions before deployment

4. **Documentation**:
   - Maintain clear documentation about brand differences
   - Update this guide as the strategy evolves