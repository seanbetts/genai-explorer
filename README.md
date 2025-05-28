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
  - Model specifications and capabilities with comprehensive 1-5 scale ratings (with half-step precision) for intelligence, reasoning, agentic capabilities, coding, STEM, speed, and pricing
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
  - Benchmark categorization (General Intelligence, STEM, agentic, coding, reasoning)
  - Featured benchmarks section highlighting the most prominent and popular benchmarks
  - Performance rankings of all models for each benchmark
  - Historical scores with sources and dates
  - Detailed benchmark information with links to research papers
- **Comprehensive Model Rating System**: Industry-standard 1-5 rating system covering both performance and affordability:
  - **Benchmark Performance**: Processes 88+ models across 47 benchmarks using leaderboard methodology
  - **Pricing Affordability**: Percentile-based ratings combining input/output costs (70%/30% weighting)
  - Deduplicates scores keeping only latest per model-benchmark pair
  - Applies per-benchmark min-max normalization with half-up rounding
  - Handles outliers using percentile thresholds for balanced distribution
  - Produces realistic spread across all rating levels (1-5)
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
│   │   │   ├── AboutBenchmarks.tsx     # Reusable benchmark information component
│   │   │   ├── AboutModelRatings.tsx   # Reusable model ratings information component
│   │   │   ├── RatingDisplay.tsx       # Half-step rating display component
│   │   │   └── ...                     # Other shared components
│   │   ├── utils/               # Utility functions
│   │   │   ├── modelRatingsLoader.ts   # Model ratings data loader
│   │   │   └── ...                     # Other utilities
│   │   ├── benchmarkCategoryConfig.ts  # Benchmark category configuration
│   │   └── categoryConfig.ts           # Company category configuration
│   ├── config/             # Brand configuration
│   └── page.tsx            # Main entry point
├── data/                   # Data sources
│   └── data.json           # Company and model data
├── public/                 # Static assets
│   ├── audio/              # Audio examples
│   ├── data/               # Processed data files
│   │   ├── benchmarks.csv        # Benchmark scores
│   │   ├── benchmarks-meta.json  # Benchmark metadata
│   │   └── model_ratings.csv     # Generated model ratings
│   ├── images/             # Company logos and media
│   └── videos/             # Video examples
├── scripts/                # Utility scripts
│   ├── calculate_model_ratings.py  # Model rating calculation script
│   ├── convert-to-webp.js        # Image conversion script
│   └── process_benchmarks.py     # Complete data processing pipeline
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

The application includes a comprehensive Model Comparer feature that allows users to:
- Select up to four models to compare side-by-side
- Compare basic information, specifications, and capabilities
- **Model Ratings Comparison**: Side-by-side comparison of 1-5 scale ratings with half-step precision (1.0, 1.5, 2.0, 2.5, etc.) across all categories (Intelligence, Reasoning, Agentic, Coding, STEM, Speed, Pricing)
- **Benchmark Performance**: Compare featured benchmark scores with rankings and source links
- **Interactive Tooltips**: Hover over rating categories to understand the benchmarks and criteria used
- **Comprehensive Information**: Context limits, pricing with Together.ai references for open models, resources, and licensing details
- **Brand-Consistent Styling**: Consistent icon colors and styling patterns across both OMG and personal brand versions
- **About Sections**: Built-in explanations of model ratings methodology and benchmark information
- Identify the best model for specific use cases with detailed comparative analysis

## Comprehensive Model Rating System

The application includes a comprehensive model rating system that generates standardized 1-5 ratings covering both performance and affordability:

### Benchmark Performance Methodology
- **Deduplication**: Keeps only the latest score per model-benchmark pair (removed 593+ duplicates)
- **Normalization**: Per-benchmark min-max scaling to 0-1 range
- **Rating Conversion**: Half-up rounding to convert to 1-5 ratings with 2 decimal precision
- **Category Aggregation**: Simple average of ratings within each category
- **Missing Data Handling**: Returns 'n/a' for categories without benchmark data

### Pricing Cost Methodology
- **Composite Scoring**: Combines input (70%) and output (30%) pricing per million tokens
- **Percentile-Based Normalization**: Uses 10th-90th percentile range to handle extreme outliers
- **Outlier Management**: Caps extreme costs to prevent skewing (e.g., GPT-4.5 at $97.50 vs median $0.30)
- **Cost Scale**: Rating 5.00 = Most expensive, Rating 1.00 = Least expensive
- **Balanced Distribution**: Creates realistic spread across all rating tiers (1-5) instead of clustering

### User Interface Integration
- **Dedicated Sections**: Model ratings appear in dedicated "Model Ratings" sections across:
  - Company detail pages for comprehensive model overviews
  - Model comparer for side-by-side rating comparisons
  - Individual benchmark detail pages for context
- **Interactive Tooltips**: Hover over rating category names to see detailed explanations of benchmarks and criteria used
- **Intuitive Icons**: Each rating type has a specific icon (circle for Intelligence, lightbulb for Reasoning, CPU for Agentic, terminal for Coding, calculator for STEM, lightning for Speed, dollar for Pricing)
- **Visual Rating Display**: 1-5 scale with half-step precision shown as filled/half-filled/unfilled icons for immediate visual comparison and enhanced differentiation
- **Reusable About Sections**: 
  - **About Model Ratings**: Explains rating methodology, benchmark sources, and calculation process
  - **About Benchmarks**: Describes benchmark types, data sources, and ranking systems
  - Consistent information across all pages with automatic brand-aware styling

### Half-Step Rating System
The application features an enhanced rating display system that provides better visual differentiation:
- **Precision**: Ratings are automatically rounded to the nearest 0.5 (e.g., 3.44 → 3.5, 3.67 → 3.5)
- **Visual Clarity**: Half-filled icons using CSS clip-path technique for precise visual representation
- **Enhanced Differentiation**: 10 distinct visual levels (1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0) instead of 5
- **Consistent Implementation**: Same half-rating system across model comparer and company detail pages
- **Reusable Component**: `RatingDisplay` component ensures consistent behavior and styling

### Enhanced Console Output
The rating calculation script provides comprehensive visual feedback including:
- **Histogram Visualization**: Vertical bar charts showing rating distribution for each category
- **Distribution Analysis**: Percentage breakdown across all rating tiers (1-5)
- **Performance Insights**: Easy identification of category strengths and weaknesses
- **Pricing Analysis**: Clear view of model cost patterns

Example output format:
```
General Intelligence: 3.30 (n=63)
            █   █   █    
1   2   3   4   5
5%  22% 40% 32% 2%
```

### Usage
To regenerate comprehensive model ratings:
```bash
python scripts/calculate_model_ratings.py
```

To run the complete data processing pipeline (recommended for data updates):
```bash
python scripts/process_benchmarks.py
```
This processes benchmark data from Excel, converts to CSV/JSON formats, then automatically calculates comprehensive model ratings.

The output includes `public/data/model_ratings.csv` with ratings for:

**Performance Categories:**
- **General Intelligence**: Knowledge and reasoning benchmarks
- **STEM**: Science, technology, engineering, and mathematics
- **agentic**: Tool use and autonomous task completion
- **coding**: Programming and software development
- **reasoning**: Logic, problem-solving, and analytical thinking

**Pricing:**
- **pricing_cost**: Cost rating based on API pricing (5 = expensive, 1 = cheap)

## Contributing

Contributions to improve the explorer are welcome. Please feel free to submit a pull request or open an issue to discuss potential enhancements. Suggestions for new categories, companies, models, or benchmarks that would benefit users are particularly appreciated.

## Data

The application uses structured data formats:
- **data.json**: Main data file with comprehensive information on companies, models, features, products, and specifications
- **benchmarks.csv**: CSV format for benchmark scores by model and benchmark
- **benchmarks-meta.json**: Metadata about benchmarks including categories, descriptions, and source information
- **model_ratings.csv**: Generated 1-5 ratings for models covering both benchmark performance and pricing cost

The data structure is designed to be extensible, allowing new companies, models, and benchmarks to be added easily.

## License

[MIT License](LICENSE)