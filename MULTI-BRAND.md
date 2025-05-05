# Multi-Brand Implementation Guide

This document outlines the approach for maintaining two versions of the Generative AI Explorer:
1. **Personal Version** - The original design for The Blueprint
2. **OMG Version** - The employer-specific version with different styling, header, and no footer

## Single Branch Strategy

We use a single branch approach with environment variable configuration:

```
main (single production branch)
```

All code, including brand-specific configurations, is maintained in one branch. Different versions are built by specifying the brand via environment variables during the build process.

## Configuration System

All brand-specific customizations are controlled through the brand configuration system:

- `app/config/brand.ts` - Contains settings for both brands
- Environment variable `NEXT_PUBLIC_BRAND` determines which brand configuration to use
- NPM scripts are provided for easier development and building

## Development Workflow

When adding new features or making changes, follow this workflow:

1. **Development**:
   - Work directly on the `main` branch or a feature branch
   - Develop and test the feature with both brands
   - Use brand-agnostic implementation with configuration for brand differences
   - Test with both `npm run dev:personal` and `npm run dev:omg`

2. **Deploying Different Versions**:
   - Both versions are deployed from the same branch using different build commands
   - Test thoroughly with both brand configurations before deploying
   - Make sure any new features work correctly across both brands
   ```bash
   # Test both versions locally before deployment
   npm run dev:personal
   npm run dev:omg
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

### Setting Up Netlify for Both Versions

1. **Create two separate sites on Netlify**:
   - One for the personal version (The Blueprint)
   - One for the OMG version

2. **Configure each site**:

   **For The Blueprint site**:
   ```
   Repository: [Your GitHub Repository]
   Branch: main
   Build command: npm run build:personal
   Publish directory: out
   Environment variables:
     - NEXT_PUBLIC_BRAND=personal
   ```

   **For the OMG site**:
   ```
   Repository: [Your GitHub Repository]
   Branch: main
   Build command: npm run build:omg
   Publish directory: out
   Environment variables:
     - NEXT_PUBLIC_BRAND=omg
   ```

3. **Domain configuration**:
   - Set custom domains for each site if needed
   - The code will detect domains containing "omg" as OMG brand automatically

4. **Deploying updates**:
   Simply push to the main branch, and both Netlify sites will rebuild automatically with their respective brand configurations.

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