# GitHub Actions Workflows

## Netlify Deployment with Cache

This workflow deploys the site to Netlify with caching enabled to speed up build times.

### Required Secrets

For the Netlify deployment to work, you need to set up the following secrets in your GitHub repository:

1. `NETLIFY_AUTH_TOKEN`: Your Netlify personal access token
2. `NETLIFY_SITE_ID`: The API ID of your Netlify site

### How to Set Up Secrets

1. Go to your GitHub repository
2. Click on "Settings" > "Secrets and variables" > "Actions"
3. Click "New repository secret"
4. Add the following secrets:
   - Name: `NETLIFY_AUTH_TOKEN` - Value: (Your Netlify personal access token)
   - Name: `NETLIFY_SITE_ID` - Value: (Your Netlify site API ID)

### How to Get Your Netlify Credentials

1. **Auth Token**: Go to [Netlify User Settings](https://app.netlify.com/user/applications) > Personal access tokens > New access token
2. **Site ID**: Go to your Netlify site settings > Site details > API ID

### Cache Configuration

The workflow caches:
- Node modules
- npm cache
- Next.js build cache
- Build output folder

This significantly reduces build times for subsequent runs.