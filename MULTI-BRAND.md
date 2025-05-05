# Multi-Brand Implementation Guide

This document outlines the approach for maintaining two versions of the Generative AI Explorer:
1. **Personal Version** - The original design for The Blueprint
2. **OMG Version** - The employer-specific version with different styling, header, and no footer

## Branch Strategy

We use a dedicated branch strategy to maintain both versions:

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

All brand-specific customizations are controlled through the brand configuration system:

- `app/config/brand.ts` - Contains settings for both brands
- Environment variable `NEXT_PUBLIC_BRAND` determines which brand configuration to use
- NPM scripts are provided for easier development and building

## Development Workflow

When adding new features or making changes, follow this workflow:

1. **Development**:
   - Work directly on the `dev` branch
   - Develop and test the feature
   - Use brand-agnostic implementation with configuration for brand differences

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

## Running Different Versions Locally

Use the provided npm scripts to test different versions:

```bash
# Run personal version
npm run dev:personal

# Run OMG version
npm run dev:omg
```

## Building Different Versions

```bash
# Build personal version
npm run build:personal

# Build OMG version
npm run build:omg
```

## Deployment Process

### Personal Version Deployment
```bash
# Build the personal version
git checkout main
npm run build:personal

# Deploy to Netlify
npm run deploy
```

### OMG Version Deployment
```bash
# Build the OMG version
git checkout omg
npm run build:omg

# Deploy to GitHub Pages or your preferred hosting
# Example using gh-pages:
npx gh-pages -d out -r git@github.com:omg/genai-explorer.git
```

## Customization Points

The following are the key areas you can customize for different brands:

1. **Brand Configuration**:
   - Brand name
   - Logo path
   - Header links
   - Primary and secondary colors
   - Footer visibility

2. **Theme System**:
   - The theme system automatically uses colors from the brand configuration
   - All components inherit styling from the theme system

3. **Header and Footer**:
   - Header and footer components check the brand configuration to adjust accordingly
   - OMG version has the footer removed completely

## Adding More Brands

To add another brand:

1. Add a new entry to the `brandConfigs` object in `app/config/brand.ts`
2. Create a new branch from `dev` for the new brand
3. Add brand-specific styling and content customizations
4. Create scripts in `package.json` for the new brand

## Common Issues

- **Header/Footer Styling**: If styles aren't applying correctly, check if you're using hard-coded colors instead of the theme system
- **Branch Management**: Always ensure new features are developed on `dev` first, then merged to both brand branches
- **Environment Variables**: Make sure the `NEXT_PUBLIC_BRAND` variable is set correctly when testing different versions