# Generative AI Explorer

[![Netlify Status](https://api.netlify.com/api/v1/badges/5c0fab6b-0507-49e1-9972-8291655e999b/deploy-status)](https://app.netlify.com/sites/genai-explorer/deploys)

An interactive web application that visualizes the current landscape of generative AI companies, models, and capabilities. The Generative AI Explorer helps users understand the rapidly evolving AI industry by providing a comprehensive view of leading companies, their models, benchmarks, and features.

## Purpose

The Generative AI Explorer is designed to help everyone get a better understanding of:
- The generative AI industry landscape
- The major companies involved and their offerings
- Leading models and how they compare to each other
- Different types of models and their specialized capabilities
- Model performance across various benchmarks

## Features

- **Comprehensive AI Ecosystem View**: Interactive display of AI companies categorized by their capabilities
- **Detailed Company Profiles**: In-depth information about each company including:
  - Model specifications and capabilities with subjective ratings for intelligence, speed, and reasoning
  - Product offerings with descriptions and links
  - Feature highlights showcasing capabilities and integrations
  - Subscription options with pricing and feature comparisons
- **Rich Media Galleries**:
  - Image model examples with carousel viewer
  - Video model demos
  - Audio model examples with embedded players
- **Multi-category Exploration**: Companies organized by model types:
  - **Frontier Models**: State-of-the-art text-based models at the cutting edge of closed ecosystem capabilities
  - **Open Models**: Leading open-source models and small on-device models
  - **Enterprise AI Platforms**: Non-frontier models used by large enterprises 
  - **Image Generation**: State-of-the-art image generation models with example galleries
  - **Video Generation**: State-of-the-art video generation models with example videos
  - **Audio Generation**: Voice and music generation models with audio samples
  - **Specialized AI Platforms**: Specialized platforms leveraging generative AI for specific tasks
- **Benchmark Explorer**: Performance data on industry-standard benchmarks with:
  - Benchmark categorization (usability, agentic, coding, factuality, maths, multimodal, reasoning, research, science)
  - Featured benchmarks section highlighting the most prominent and popular benchmarks
  - Performance rankings of all models for each benchmark
  - Historical scores with sources and dates
  - Detailed benchmark information with links to research papers
- **Resource Links**: Access to documentation, model cards, research papers, and more
- **Responsive UI**: Optimized for both desktop and mobile viewing
- **Static Generation**: Pre-rendered pages for fast loading and SEO benefits

## Technology Stack

- **Frontend Framework**: [React](https://reactjs.org/) 19 with [Next.js](https://nextjs.org/) 15.3
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- **Static Site Generation**: Next.js export mode for optimal performance
- **Deployment**: Automated deployment to [Netlify](https://www.netlify.com/)
- **Build Optimization**: 
  - Netlify build cache configuration
  - Efficient media handling and optimizations
- **Icons**: Bootstrap Icons for UI elements

## Deployment

The project is configured for optimized deployment to Netlify:

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
│   ├── benchmarks/         # Benchmark explorer pages
│   ├── compare/            # Model comparison pages
│   ├── components/         # React components
│   │   ├── BenchmarkDetail/     # Benchmark detail components
│   │   ├── CompanyDetail/       # Company profile components
│   │   ├── ModelComparer/       # Model comparison components
│   │   ├── shared/              # Reusable components
│   │   ├── utils/               # Utility functions
│   │   ├── benchmarkCategoryConfig.ts  # Benchmark category configuration
│   │   └── categoryConfig.ts           # Company category configuration
│   ├── config/             # Brand configuration
│   └── page.tsx            # Main entry point
├── data/                   # Data sources
│   └── data.json           # Company and model data
├── public/                 # Static assets
│   ├── audio/              # Audio examples
│   ├── data/               # Benchmark data files
│   ├── images/             # Company logos and media
│   └── videos/             # Video examples
├── scripts/                # Utility scripts
│   ├── convert-to-webp.js        # Image conversion script
│   └── process_benchmarks.py     # Benchmark processing script
├── netlify.toml            # Netlify configuration
└── next.config.ts          # Next.js configuration
```

## Multi-Brand Support

This project supports multiple brand configurations, allowing you to deploy different versions of the application with brand-specific styling, components, and features:

- **Personal Version (The Blueprint)**: Dark theme with Blueprint-specific styling
- **OMG Version**: Light theme with OMG-specific styling and customizations

Brand-specific configurations are controlled through environment variables and a centralized configuration system. See [MULTI-BRAND.md](MULTI-BRAND.md) for detailed documentation on the multi-brand implementation.

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

4. Open your browser at [http://localhost:3000](http://localhost:3000)

## Building for Deployment

```bash
npm run build
```

This command generates static files in the `out` directory ready for deployment to Netlify or any static hosting service.

## Brand Configuration

To switch between brand configurations, set the `NEXT_PUBLIC_BRAND` environment variable before building or running:

```bash
# For "omg" branding
NEXT_PUBLIC_BRAND=omg npm run dev

# For default "blueprint" branding 
npm run dev
```

## Model Comparison

The application includes a Model Comparer feature that allows users to:
- Select up to four models to compare side-by-side
- Compare features, capabilities, and benchmark scores
- Identify the best model for specific use cases
- View detailed specifications in a comparative format

## Contributing

Contributions to improve the explorer are welcome. Please feel free to submit a pull request or open an issue to discuss potential enhancements. Suggestions for new categories, companies, models, or benchmarks that would benefit users are particularly appreciated.

## Data

The application uses structured data formats:
- **data.json**: Main data file with comprehensive information on companies, models, features, products, and specifications
- **benchmarks.csv**: CSV format for benchmark scores by model and benchmark
- **benchmarks-meta.json**: Metadata about benchmarks including categories, descriptions, and source information

The data structure is designed to be extensible, allowing new companies, models, and benchmarks to be added easily.

## License

[MIT License](LICENSE)