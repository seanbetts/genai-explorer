import brandConfig from '@/app/config/brand';

export default function AboutBenchmarks() {
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
          style={brandConfig.name === 'OMG' ? { color: brandConfig.secondaryColor } : {}}>About Benchmarks</h3>
          <p className={`text-sm mb-3 ${
            brandConfig.name === 'OMG'
              ? 'text-gray-700 font-sans'
              : 'text-gray-300 font-mono'
          }`}>
            Benchmarks provide standardised tests to compare model capabilities across different dimensions. 
            Scores shown are raw benchmark scores reported by the model providers.
            Only frontier and open models are included in benchmark comparisons.
            Models with the top 5 scores across all models in our database for each benchmark are marked with their rank (#1, #2, #3, etc.).
            Note that rankings are only computed based on models included in our database, not all models that exist.
          </p>
          
          <div className={`text-sm pt-3 mt-2 ${
            brandConfig.name === 'OMG'
              ? 'text-gray-600 border-t border-gray-300 font-sans'
              : 'text-gray-400 border-t border-gray-700 font-mono'
          }`}>
            <p className="mb-2">
              <strong className={brandConfig.name === 'OMG' ? 'text-gray-700' : 'text-gray-300'}>Sources:</strong> Benchmark data is collected from research papers, model provider documentation, and published evaluations.
              Click on a benchmark name to view its paper, or click on a score to see the source of the benchmark result.
            </p>
            <p>
              <strong className={brandConfig.name === 'OMG' ? 'text-gray-700' : 'text-gray-300'}>Tooltips:</strong> Hover over benchmark names to see descriptions of what each benchmark measures.
              Hover over scores to view ranking information, data sources, and any notes about the specific result.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}