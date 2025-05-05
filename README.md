# Generative AI Explorer

[![Netlify Status](https://api.netlify.com/api/v1/badges/5c0fab6b-0507-49e1-9972-8291655e999b/deploy-status)](https://app.netlify.com/sites/genai-explorer/deploys)

An interactive web application that visualizes the current landscape of generative AI companies, models, and capabilities. This explorer helps users understand the rapidly evolving AI ecosystem by providing detailed information about companies, their models, benchmarks, and features.

## Features

- **Comprehensive AI Ecosystem View**: Interactive display of AI companies categorized by their capabilities
- **Detailed Company Profiles**: In-depth information about each company including:
  - Model specifications and capabilities
  - Product offerings
  - Feature highlights
  - Subscription options
- **Rich Media Galleries**:
  - Image model examples with carousel viewer
  - Video model demos
  - Audio model examples with embedded players
- **Multi-category Exploration**: Companies organized by model types:
  - Frontier Models (state-of-the-art capabilities)
  - Open Models (accessible and open-source)
  - Enterprise AI Platforms (business-focused solutions)
  - Image Generation
  - Video Generation
  - Audio Generation
  - Specialized AI Platforms
- **Benchmark Comparisons**: Performance data on industry-standard benchmarks
- **Resource Links**: Access to documentation, model cards, research papers, and more
- **Responsive UI**: Optimized for both desktop and mobile viewing
- **Static Generation**: Pre-rendered pages for fast loading and SEO benefits

## Technology Stack

- **Frontend Framework**: [React](https://reactjs.org/) with [Next.js](https://nextjs.org/) (v14+)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- **Static Site Generation**: Next.js export mode for optimal performance
- **Deployment**: Automated deployment to [Netlify](https://www.netlify.com/) via GitHub Actions
- **Build Optimization**: 
  - GitHub Actions caching for faster builds
  - Netlify build cache configuration
  - Efficient media handling and optimizations
- **Icons**: Bootstrap Icons for UI elements

## Deployment

The project is configured for optimized deployment to Netlify with GitHub Actions:

### GitHub Actions Workflow

The repository includes a `.github/workflows/netlify-deploy.yml` file that:
- Automatically deploys the site when changes are pushed to the main branch
- Implements caching for npm dependencies and Next.js build artifacts
- Considerably reduces build times through efficient caching strategies

### Netlify Configuration

The `netlify.toml` file configures:
- Build command and output directory
- Cache settings for dependencies
- Performance optimizations including compression and caching headers
- The Netlify Next.js plugin for enhanced compatibility

## Project Structure

```
genai-explorer/
├── app/                    # Next.js app directory
│   ├── api/                # API routes
│   ├── components/         # React components
│   │   ├── BenchmarkDetail/
│   │   ├── CompanyDetail/  # Company profile components
│   │   ├── ModelComparer/  # Model comparison components
│   │   ├── shared/         # Reusable components
│   │   └── utils/          # Utility functions
│   └── page.tsx            # Main entry point
├── data/                   # Data sources
│   └── data.json           # Company and model data
├── public/                 # Static assets
│   ├── audio/              # Audio examples
│   ├── data/               # Additional data files
│   ├── images/             # Company logos and media
│   └── videos/             # Video examples
├── .github/workflows/      # GitHub Actions workflows
├── netlify.toml            # Netlify configuration
└── next.config.ts          # Next.js configuration
```

## Getting Started

1. Clone the repository
```bash
git clone https://github.com/seanbetts/genai-explorer.git
cd genai-explorer
```

2. Install dependencies
```bash
npm install
```

3. Run the development server
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application

## Building for Deployment

```bash
npm run build
```

This generates static files in the `out` directory ready for deployment to Netlify or any static hosting service.

## Contributing

Contributions to improve the explorer are welcome. Please feel free to submit a pull request or open an issue to discuss potential enhancements.

## Data

Currently using structured JSON data with company information, model specifications, and benchmark results. In future versions, this could be connected to a real-time API or database for dynamic updates.

## License

[MIT License](LICENSE)