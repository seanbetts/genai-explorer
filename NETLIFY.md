# Netlify Deployment Notes

## Caching Configuration

This project uses Netlify's build cache to speed up deployments:

- The `node_modules` directory is cached between builds
- The GitHub Actions workflow also caches npm dependencies

Note: Since this project uses Next.js static export (`output: 'export'`), the Next.js build cache is not persistent. However, the node_modules caching still provides significant build speed improvements.

## Build Process

1. The build process is triggered by pushes to the main branch
2. GitHub Actions performs the initial build with caching
3. Netlify deploys the built site with node_modules caching

## Relevant Configuration Files

- `netlify.toml`: Contains Netlify-specific settings and cache configuration
- `.github/workflows/netlify-deploy.yml`: GitHub Actions workflow for automated deployments
- `next.config.ts`: Next.js configuration with static export settings

## Cache Verification

Builds are now properly cached as verified on May 4, 2025. The "No Next.js cache found" message is normal for static export projects and doesn't affect build performance.