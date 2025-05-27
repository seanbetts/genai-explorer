import brandConfig from '@/app/config/brand';

export default function AboutModelRatings() {
  return (
    <div className={`mt-8 rounded-lg p-4 ${
      brandConfig.name === 'OMG'
        ? 'bg-gray-100 border border-gray-300'
        : 'bg-gray-800/50 border border-gray-700'
    }`}>
      <div className="flex items-start gap-3">
        <i className={`bi bi-info-circle-fill text-xl mt-0.5 ${
          brandConfig.name === 'OMG'
            ? 'text-blue-600'
            : 'text-cyan-500'
        }`}
        style={brandConfig.name === 'OMG' ? { color: brandConfig.secondaryColor } : {}}></i>
        <div className="w-full">
          <h3 className={`text-lg font-medium mb-2 ${
            brandConfig.name === 'OMG'
              ? 'text-blue-600 font-sans'
              : 'text-cyan-400 font-mono'
          }`}
          style={brandConfig.name === 'OMG' ? { color: brandConfig.secondaryColor } : {}}>About Model Ratings</h3>
          <p className={`text-sm mb-3 ${
            brandConfig.name === 'OMG'
              ? 'text-gray-700 font-sans'
              : 'text-gray-300 font-mono'
          }`}>
            Model ratings provide standardised 1-5 scale comparisons across different capabilities. 
            Performance ratings (Intelligence, Reasoning, Agentic, Coding, STEM) are calculated from benchmark scores using leaderboard-standard methodology with per-benchmark normalisation.
            Speed ratings are manually assessed based on response generation performance.
            Pricing ratings reflect cost levels (5 = expensive, 1 = cheap) based on API pricing per million tokens.
          </p>
          
          <div className={`text-sm pt-3 mt-2 ${
            brandConfig.name === 'OMG'
              ? 'text-gray-600 border-t border-gray-300 font-sans'
              : 'text-gray-400 border-t border-gray-700 font-mono'
          }`}>
            <p className="mb-2">
              <strong className={brandConfig.name === 'OMG' ? 'text-gray-700' : 'text-gray-300'}>Methodology:</strong> Benchmark scores are deduplicated (latest per model-benchmark), normalised per-benchmark to 0-1 range, converted to 1-5 ratings with half-up rounding, then averaged by category.
              Pricing combines input (70%) and output (30%) costs with percentile-based normalisation to handle outliers.
            </p>
            <p>
              <strong className={brandConfig.name === 'OMG' ? 'text-gray-700' : 'text-gray-300'}>Tooltips:</strong> Hover over rating category names to see which benchmarks and criteria are used for each rating type.
              Filled icons represent higher performance, speed, or cost levels respectively.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}