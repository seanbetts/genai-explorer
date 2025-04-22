# Benchmarks Integration Roadmap

This roadmap outlines the step-by-step plan for integrating benchmark data into the GenAI Explorer application, focusing on adding a Benchmarks tab to the CompanyDetail view.

## Phase 1: Data Structure & Processing

### 1.1 Define Type Definitions

- [x] Add Benchmark interface to types.ts:
  ```typescript
  export interface Benchmark {
    benchmark_id: string;
    benchmark_name: string;
    benchmark_category: string;
    benchmark_paper: string | null;
  }
  ```

- [x] Add BenchmarkScore interface to types.ts:
  ```typescript
  export interface BenchmarkScore {
    model_id: string;
    company_id: string;
    benchmark_id: string;
    score: number;
    date: string;
    notes?: string;
    source_name?: string;
    source?: string;
  }
  ```

- [x] Add BenchmarkCategory type to types.ts:
  ```typescript
  export type BenchmarkCategory = 'agentic' | 'coding' | 'conversational' | 'factuality' | 'maths' | 'multimodal' | 'reasoning' | 'research' | 'science';
  ```

- [x] Extend existing types as needed to incorporate benchmarks

### 1.2 Create Benchmark Utilities

- [x] Create a new file `utils/benchmarkUtils.ts` with these functions:
  - [x] `loadBenchmarkMetadata()`: Load benchmark metadata directly from JSON
  - [x] `loadBenchmarkScores()`: Load benchmark scores from CSV using client-side fetch
  - [x] `loadBenchmarkScoresServerSide()`: Server-side function to load benchmark scores
  - [x] `groupBenchmarksByCategory()`: Group benchmarks by their category
  - [x] `getBenchmarkScoresForModel()`: Get all benchmark scores for a specific model
  - [x] `getBenchmarkScoresForCompany()`: Get all benchmark scores for a company's models
  - [x] `calculateModelRanking()`: Calculate how a model ranks compared to others for a benchmark
  - [x] `getLatestScoreForModelAndBenchmark()`: Get the latest score for a specific model and benchmark
  - [x] `getModelsWithBenchmarkScores()`: Get all models that have scores for a specific benchmark
  - [x] `getAverageBenchmarkScores()`: Get the average score for each benchmark
  - [x] `associateBenchmarkScoresWithModels()`: Associate benchmark scores with models

### 1.3 Implement Data Processing

- [x] Create data processing logic:
  - [x] Use direct data import approach (no API routes needed)
  - [x] Implement CSV parsing using PapaParse
  - [x] Create helper functions for benchmark data access
  - [x] Build functions to calculate rankings and averages

## Phase 2: Component Refactoring

### 2.1 Extract Shared Table Components

- [x] Create `components/shared/TableComponents.tsx`:
  - [x] Extract `SharedTable` component from ModelTable:
    - [x] Table layout and structure
    - [x] Scrolling synchronization
    - [x] Table borders and styling
  - [x] Extract `TableHeader` component:
    - [x] Header row rendering
    - [x] Column width calculation
  - [x] Extract `PaginationControls` component:
    - [x] Pagination logic
    - [x] Next/previous buttons
  - [x] Extract table styling and layout utilities

### 2.2 Refactor ModelTable Component

- [x] Update ModelTable.tsx to use shared components:
  - [x] Replace table implementation with SharedTable
  - [x] Use extracted TableHeader component
  - [x] Use extracted PaginationControls
  - [x] Keep model-specific rendering logic separate

### 2.3 Create Shared Visualization Components

- [x] Create score visualization components:
  - [x] `ScoreBar` component to visualize numeric scores
  - [x] `RankIndicator` component to show rankings
  - [x] `ScoreChange` component to show score changes over time

## Phase 3: Benchmarks Table Implementation

### 3.1 Create BenchmarkCategorySection Component

- [ ] Create BenchmarkCategorySection.tsx component:
  - [ ] Implement section header with category name
  - [ ] Create table for benchmarks in a category
  - [ ] Add pagination for many benchmarks
  - [ ] Implement column headers for models

### 3.2 Create BenchmarksTable Component

- [ ] Create main BenchmarksTable.tsx component:
  - [ ] Initialize with models and company ID
  - [ ] Load benchmark data for the company
  - [ ] Group benchmarks by category
  - [ ] Render BenchmarkCategorySection for each category
  - [ ] Implement pagination if needed
  - [ ] Add loading state and error handling

### 3.3 Implement Benchmark Row Rendering

- [ ] Create benchmark row rendering:
  - [ ] Display benchmark name with link to paper
  - [ ] Show scores for each model
  - [ ] Add visual indicators for good/bad scores
  - [ ] Include date of benchmark
  - [ ] Add tooltips with additional info

### 3.4 Add Sorting and Filtering

- [ ] Add sorting functionality:
  - [ ] Sort benchmarks by name
  - [ ] Sort benchmarks by score
  - [ ] Sort benchmarks by date
- [ ] Add filtering functionality:
  - [ ] Filter by benchmark subcategory
  - [ ] Filter by score threshold
  - [ ] Filter by date range

## Phase 4: CompanyDetail Integration

### 4.1 Update Types and State

- [ ] Update TabType in CompanyDetail/index.tsx:
  ```typescript
  type TabType = 'frontier-models' | 'open-models' | 'enterprise-models' | 'image-models' | 'video-models' | 'audio-models' | 'specialised-models' | 'products' | 'features' | 'subscriptions' | 'benchmarks';
  ```

### 4.2 Add Benchmarks Tab Button

- [ ] Add benchmarks tab button to the tabs navigation:
  ```tsx
  <button
    className={`py-3 px-6 font-medium font-mono text-base border-b-2 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
      activeTab === 'benchmarks' 
        ? 'border-cyan-400 text-cyan-400' 
        : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'
    }`}
    onClick={() => {
      // Enable URL updates on user click
      initialRender.current = false;
      setActiveTab('benchmarks');
    }}
  >
    Benchmarks
  </button>
  ```

### 4.3 Add Benchmarks Tab Content

- [ ] Add benchmarks tab content rendering:
  ```tsx
  {/* Benchmarks Tab */}
  {activeTab === 'benchmarks' && (
    <div className="transform transition-opacity duration-300">
      <Suspense fallback={<div className="text-center py-4">Loading benchmarks...</div>}>
        <BenchmarksTable 
          models={company.models}
          companyId={company.id}
        />
      </Suspense>
    </div>
  )}
  ```

### 4.4 Update Tab Selection Logic

- [ ] Update URL handling for benchmarks tab:
  - [ ] Add 'benchmarks' to the valid tab parameters list
  - [ ] Update URL parameter handling
  - [ ] Update fallback selection logic

## Phase 5: Data Visualization Enhancements

### 5.1 Implement Score Visualizations

- [ ] Create visualizations for benchmark scores:
  - [ ] Horizontal bars for score representation
  - [ ] Color coding by performance level
  - [ ] Tooltips with score details and context

### 5.2 Add Industry Ranking Visuals

- [ ] Add visual indicators for industry rankings:
  - [ ] Position indicators (1st, 2nd, 3rd, etc.)
  - [ ] Percentile indicators (top 10%, etc.)
  - [ ] Comparison to industry average

### 5.3 Implement Time-Based Visualizations

- [ ] Add time-based visualization components:
  - [ ] Score history charts
  - [ ] Progress indicators
  - [ ] Version-to-version comparisons

## Phase 6: Performance Optimization

### 6.1 Implement Memoization

- [ ] Add memoization for expensive calculations:
  - [ ] Benchmark data processing
  - [ ] Score aggregation
  - [ ] Ranking calculations

### 6.2 Optimize Data Loading

- [ ] Implement efficient data loading:
  - [ ] Lazy loading for benchmark data
  - [ ] Progressive loading of visualizations
  - [ ] Caching of processed data

### 6.3 Add Table Virtualization

- [ ] Implement table virtualization for large datasets:
  - [ ] Only render visible rows
  - [ ] Dynamically load/unload as user scrolls
  - [ ] Maintain smooth scrolling experience

## Phase 7: User Experience Refinements

### 7.1 Add Benchmark Information

- [ ] Add contextual information about benchmarks:
  - [ ] Tooltips explaining benchmark methodology
  - [ ] Links to benchmark papers
  - [ ] Explanations of scoring systems

### 7.2 Improve Interactive Elements

- [ ] Enhance interactive elements:
  - [ ] Clickable benchmarks for details
  - [ ] Expandable rows for additional information
  - [ ] Toggle for different visualization modes

### 7.3 Add Export and Sharing

- [ ] Add export and sharing functionality:
  - [ ] Export benchmark data as CSV
  - [ ] Generate shareable links to specific views
  - [ ] Create snapshot images of visualizations

## Notes and Technical Considerations

- Maintain consistent styling with the existing ModelTable component
- Ensure responsive design works for all screen sizes
- Optimize for performance with large benchmark datasets
- Consider accessibility for all interactive elements
- Use consistent color coding for benchmark performance
- Include helpful documentation/tooltips for benchmarks