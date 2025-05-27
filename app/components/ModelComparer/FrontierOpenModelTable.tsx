'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Model, Benchmark, BenchmarkScore } from '../types';
import { containerStyles, tableStyles, iconStyles } from '../utils/layout';
import { textStyles } from '../utils/theme';
import brandConfig from '../../config/brand';
import { 
  SharedTable, 
  TableHeader, 
  TableColGroup,
  SectionTitle
} from '../shared/TableComponents';
import { 
  loadBenchmarkMetadata, 
  loadBenchmarkScores, 
  getLatestScoreForModelAndBenchmark,
  calculateGlobalRankings 
} from '../utils/benchmarkUtils';
import { loadModelRatings, getRatingForModel, type ModelRatingsData } from '../utils/modelRatingsLoader';
import AboutBenchmarks from '../shared/AboutBenchmarks';
import AboutModelRatings from '../shared/AboutModelRatings';

interface FrontierOpenModelTableProps {
  selectedModels: Model[];
  onModelRemove: (modelId: string) => void;
  clearAllButton: React.ReactNode;
}

const FrontierOpenModelTable: React.FC<FrontierOpenModelTableProps> = ({ selectedModels, onModelRemove, clearAllButton }) => {
  const [benchmarks, setBenchmarks] = useState<Benchmark[]>([]);
  const [benchmarkScores, setBenchmarkScores] = useState<BenchmarkScore[]>([]);
  const [rankings, setRankings] = useState<Record<string, Record<string, { rank: number; total: number }>>>({});
  const [loading, setLoading] = useState(true);
  const [showStickyHeader, setShowStickyHeader] = useState(false);
  
  // State for model ratings data
  const [modelRatings, setModelRatings] = useState<ModelRatingsData>({});
  const [ratingsLoaded, setRatingsLoaded] = useState(false);
  
  const tableHeaderRef = useRef<HTMLDivElement>(null);
  
  // Load benchmark data and model ratings when component mounts
  useEffect(() => {
    const loadBenchmarkData = async () => {
      try {
        const [benchmarkMeta, scores, rankingsData, ratingsData] = await Promise.all([
          loadBenchmarkMetadata(),
          loadBenchmarkScores(),
          calculateGlobalRankings(),
          loadModelRatings()
        ]);
        setBenchmarks(benchmarkMeta);
        setBenchmarkScores(scores);
        setRankings(rankingsData);
        setModelRatings(ratingsData);
        setRatingsLoaded(true);
      } catch (error) {
        console.error('Error loading benchmark data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadBenchmarkData();
  }, []);

  // Handle scroll to show/hide sticky header
  useEffect(() => {
    const handleScroll = () => {
      if (tableHeaderRef.current) {
        const rect = tableHeaderRef.current.getBoundingClientRect();
        // Site header appears to be around 80-100px tall, so we need to account for that
        // Show sticky header when top of original header moves out of view (behind site header)
        const siteHeaderHeight = 135; // Approximate height of the site header
        const shouldShow = rect.top <= siteHeaderHeight;
        
        setShowStickyHeader(shouldShow);
        
        // Debug logging
        console.log('Scroll detected:', {
          rectTop: rect.top,
          rectBottom: rect.bottom,
          siteHeaderHeight,
          windowScrollY: window.scrollY,
          shouldShow,
          currentState: showStickyHeader
        });
      }
    };

    // Initial check after a short delay to ensure DOM is ready
    const timer = setTimeout(handleScroll, 100);
    
    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  
  // Helper function to check if any model has a specified property
  const hasAnyModelCapability = (key: string): boolean => {
    return selectedModels.some(model => 
      model.capabilities && key in model.capabilities && model.capabilities[key as keyof typeof model.capabilities]
    );
  };

  const hasAnyModelSpec = (key: string): boolean => {
    return selectedModels.some(model => 
      model.specs && key in model.specs && model.specs[key as keyof typeof model.specs] !== undefined
    );
  };

  // Helper to check if any model has a rating from CSV data
  const hasAnyModelRating = (ratingType: string): boolean => {
    if (!ratingsLoaded) return false;
    return selectedModels.some(model => {
      const rating = getRatingForModel(model.id, ratingType, modelRatings);
      return rating !== null;
    });
  };
  
  // Get featured benchmarks and sort by category order
  const featuredBenchmarks = benchmarks
    .filter(b => b.featured_benchmark)
    .sort((a, b) => {
      const categoryOrder = ['General Intelligence', 'reasoning', 'agentic', 'coding', 'STEM'];
      const aIndex = categoryOrder.indexOf(a.benchmark_category);
      const bIndex = categoryOrder.indexOf(b.benchmark_category);
      
      // If both categories are in our order list, use that ordering
      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
      }
      // If only one is in the list, prioritize it
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      // Otherwise sort alphabetically for any unknown categories
      return a.benchmark_category.localeCompare(b.benchmark_category);
    });
  
  // Helper function to get latest score for a model and benchmark with metadata
  const getModelBenchmarkData = (modelId: string, benchmarkId: string): { 
    score: number | null; 
    date: string | null; 
    rank: number | null; 
    source: string | null;
    sourceName: string | null;
    notes: string | null;
  } => {
    const scoreData = getLatestScoreForModelAndBenchmark(benchmarkScores, modelId, benchmarkId);
    const ranking = rankings[benchmarkId]?.[modelId];
    
    return {
      score: scoreData ? scoreData.score : null,
      date: scoreData ? scoreData.date : null,
      rank: ranking ? ranking.rank : null,
      source: scoreData ? (scoreData.source || null) : null,
      sourceName: scoreData ? (scoreData.source_name || null) : null,
      notes: scoreData ? (scoreData.notes || null) : null,
    };
  };

  // Format model items for header
  const headerItems = selectedModels.map(model => ({
    id: model.id,
    name: model.name,
    description: model.companyName,
    onRemove: () => onModelRemove(model.id)
  }));

  // Render the rating indicators (circles, lightning, etc)
  const renderRating = (model: Model, type: string) => {
    let value: number | null = null;
    
    // Get rating value based on type
    if (type === "speed") {
      // Speed still comes from capabilities in data.json
      if (model.capabilities && "speed" in model.capabilities) {
        value = model.capabilities.speed as number;
      }
    } else {
      // All other ratings come from model_ratings.csv
      if (ratingsLoaded) {
        const csvRating = getRatingForModel(model.id, type, modelRatings);
        if (csvRating !== null) {
          // Convert decimal rating (0-5) to integer (0-5) for display
          value = Math.round(csvRating);
        }
      }
    }
    
    // If no rating available, show dash
    if (value === null || value === undefined) {
      return <span className={textStyles.primary}>-</span>;
    }
    
    // Get icons based on the capability type
    let icon = "";
    let filledIcon = "";
    
    switch (type) {
      case "intelligence":
        icon = "bi-circle";
        filledIcon = "bi-circle-fill";
        break;
      case "speed":
        icon = "bi-lightning-charge";
        filledIcon = "bi-lightning-charge-fill";
        break;
      case "reasoning":
        icon = "bi-lightbulb";
        filledIcon = "bi-lightbulb-fill";
        break;
      case "agentic":
        icon = "bi-cpu";
        filledIcon = "bi-cpu-fill";
        break;
      case "coding":
        icon = "bi-terminal";
        filledIcon = "bi-terminal-fill";
        break;
      case "stem":
        icon = "bi-calculator";
        filledIcon = "bi-calculator-fill";
        break;
      case "pricing":
        icon = "bi-currency-dollar";
        filledIcon = "bi-currency-dollar";
        break;
      default:
        icon = "bi-circle";
        filledIcon = "bi-circle-fill";
    }
    
    // Always render the icons, even if value is 0
    return (
      <div className={iconStyles.ratingContainer}>
        {[...Array(5)].map((_, i) => (
          <i 
            key={i} 
            className={`${i < value ? filledIcon : icon} ${iconStyles.iconSpacing}`}
            style={{ color: i < value ? brandConfig.secondaryColor : '#4B5563' }}
          ></i>
        ))}
      </div>
    );
  };

  // Generate capabilities rows
  const renderCapabilitiesRows = () => (
    <>
      {/* Release Date Row */}
      <tr className="cursor-pointer">
        <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
          <div className={containerStyles.flexCenter}>
            <i className={`bi bi-calendar-date ${iconStyles.tableRowIcon}`}></i> <span className={textStyles.primary}>Release Date</span>
          </div>
        </td>
        {selectedModels.map(model => (
          <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
            {model.releaseDate ? (
              new Date(model.releaseDate).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })
            ) : "-"}
          </td>
        ))}
      </tr>

      {/* Type Row */}
      <tr className="cursor-pointer">
        <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
          <div className={containerStyles.flexCenter}>
            <i className={`bi bi-box ${iconStyles.tableRowIcon}`}></i> <span className={textStyles.primary}>Type</span>
          </div>
        </td>
        {selectedModels.map(model => (
          <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
            <span className={`capitalize ${textStyles.primary}`}>{model.type || "-"}</span>
          </td>
        ))}
      </tr>
      
      {/* Reasoning Tokens Row */}
      {hasAnyModelSpec("reasoningTokens") && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-lightbulb ${iconStyles.tableRowIcon}`}></i> <span className={textStyles.primary}>Reasoning Tokens</span>
            </div>
          </td>
          {selectedModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {model.specs?.reasoningTokens !== undefined ? (
                model.specs.reasoningTokens ? 
                  <i className={iconStyles.booleanTrue} title="Yes"></i> : 
                  <i className={iconStyles.booleanFalse} title="No"></i>
              ) : <span className={textStyles.primary}>-</span>}
            </td>
          ))}
        </tr>
      )}
      
      {/* Input Formats Row */}
      {hasAnyModelSpec("inputFormats") && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-arrow-up-right-square-fill ${iconStyles.tableRowIcon}`}></i> <span className={textStyles.primary}>Input Formats</span>
            </div>
          </td>
          {selectedModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              <div className={iconStyles.formatContainer}>
                <i className={`bi bi-file-text-fill ${iconStyles.lg}`} style={{ color: model.specs?.inputFormats?.includes("text") ? brandConfig.secondaryColor : '#4B5563' }} title="Text"></i>
                <i className={`bi bi-mic-fill ${iconStyles.lg}`} style={{ color: model.specs?.inputFormats?.includes("speech") ? brandConfig.secondaryColor : '#4B5563' }} title="Speech"></i>
                <i className={`bi bi-image-fill ${iconStyles.lg}`} style={{ color: model.specs?.inputFormats?.includes("image") ? brandConfig.secondaryColor : '#4B5563' }} title="Image"></i>
                <i className={`bi bi-music-note-beamed ${iconStyles.lg}`} style={{ color: model.specs?.inputFormats?.includes("audio") ? brandConfig.secondaryColor : '#4B5563' }} title="Audio"></i>
                <i className={`bi bi-camera-video-fill ${iconStyles.lg}`} style={{ color: model.specs?.inputFormats?.includes("video") ? brandConfig.secondaryColor : '#4B5563' }} title="Video"></i>
              </div>
            </td>
          ))}
        </tr>
      )}
      
      {/* Output Formats Row */}
      {hasAnyModelSpec("outputFormats") && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-arrow-down-right-square-fill ${iconStyles.tableRowIcon}`}></i> <span className={textStyles.primary}>Output Formats</span>
            </div>
          </td>
          {selectedModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              <div className={iconStyles.formatContainer}>
                <i className={`bi bi-file-text-fill ${iconStyles.lg}`} style={{ color: model.specs?.outputFormats?.includes("text") ? brandConfig.secondaryColor : '#4B5563' }} title="Text"></i>
                <i className={`bi bi-mic-fill ${iconStyles.lg}`} style={{ color: model.specs?.outputFormats?.includes("speech") ? brandConfig.secondaryColor : '#4B5563' }} title="Speech"></i>
                <i className={`bi bi-image-fill ${iconStyles.lg}`} style={{ color: model.specs?.outputFormats?.includes("image") ? brandConfig.secondaryColor : '#4B5563' }} title="Image"></i>
                <i className={`bi bi-music-note-beamed ${iconStyles.lg}`} style={{ color: model.specs?.outputFormats?.includes("audio") ? brandConfig.secondaryColor : '#4B5563' }} title="Audio"></i>
                <i className={`bi bi-camera-video-fill ${iconStyles.lg}`} style={{ color: model.specs?.outputFormats?.includes("video") ? brandConfig.secondaryColor : '#4B5563' }} title="Video"></i>
              </div>
            </td>
          ))}
        </tr>
      )}
    </>
  );

  // Generate context table rows
  const renderContextRows = () => (
    <>
      {/* Max Input Tokens Row */}
      {hasAnyModelSpec("maxInputTokens") && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-sign-turn-right-fill ${iconStyles.tableRowIcon}`}></i> <span className={textStyles.primary}>Max Input</span>
            </div>
          </td>
          {selectedModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {model.specs?.maxInputTokens ? (
                <span className={textStyles.primary}>{model.specs.maxInputTokens.toLocaleString()} tokens</span>
              ) : <span className={textStyles.primary}>-</span>}
            </td>
          ))}
        </tr>
      )}


      {/* Max Output Tokens Row */}
      {hasAnyModelSpec("maxOutputTokens") && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-sign-turn-left-fill ${iconStyles.tableRowIcon} transform rotate-180`}></i> <span className={textStyles.primary}>Max Output</span>
            </div>
          </td>
          {selectedModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {model.specs?.maxOutputTokens ? (
                <span className={textStyles.primary}>{model.specs.maxOutputTokens.toLocaleString()} tokens</span>
              ) : <span className={textStyles.primary}>-</span>}
            </td>
          ))}
        </tr>
      )}

      {/* Knowledge Cutoff Row */}
      <tr className="cursor-pointer">
        <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
          <div className={containerStyles.flexCenter}>
            <i className={`bi bi-calendar-check-fill ${iconStyles.tableRowIcon}`}></i> <span className={textStyles.primary}>Knowledge Cutoff</span>
          </div>
        </td>
        {selectedModels.map(model => (
          <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
            <span className={textStyles.primary}>{model.specs?.knowledgeCutoff || model.trainingCutoff || "-"}</span>
          </td>
        ))}
      </tr>
    </>
  );

  // Generate pricing table rows
  const renderPricingRows = () => (
    <>
      {/* Input Price Row */}
      {hasAnyModelSpec("pricingInputPerM") && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-currency-dollar ${iconStyles.tableRowIcon}`}></i> <span className={textStyles.primary}>Input</span>
            </div>
          </td>
          {selectedModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {model.specs?.pricingInputPerM !== undefined && model.specs?.pricingInputPerM !== null ? (
                <span className={
                  model.category === 'frontier' 
                    ? tableStyles.metric 
                    : `${brandConfig.name === 'OMG' ? 'text-blue-500 font-medium tabular-nums font-sans' : 'text-cyan-400 font-medium tabular-nums font-mono'}`
                }>
                  ${model.specs.pricingInputPerM.toFixed(2)}
                </span>
              ) : <span className={textStyles.primary}>-</span>}
            </td>
          ))}
        </tr>
      )}

      {/* Output Price Row */}
      {hasAnyModelSpec("pricingOutputPerM") && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-cash-stack ${iconStyles.tableRowIcon}`}></i> <span className={textStyles.primary}>Output</span>
            </div>
          </td>
          {selectedModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {model.specs?.pricingOutputPerM !== undefined && model.specs?.pricingOutputPerM !== null ? (
                <span className={
                  model.category === 'frontier' 
                    ? tableStyles.metric 
                    : `${brandConfig.name === 'OMG' ? 'text-blue-500 font-medium tabular-nums font-sans' : 'text-cyan-400 font-medium tabular-nums font-mono'}`
                }>
                  ${model.specs.pricingOutputPerM.toFixed(2)}
                </span>
              ) : <span className={textStyles.primary}>-</span>}
            </td>
          ))}
        </tr>
      )}
    </>
  );

  // Generate featured benchmark rows
  const renderFeaturedBenchmarkRows = () => {
    if (loading || featuredBenchmarks.length === 0) return null;
    
    return (
      <>
        {featuredBenchmarks.map(benchmark => (
          <tr key={benchmark.benchmark_id} className="cursor-pointer">
            <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
              <div className={containerStyles.flexCenter}>
                <i className={`bi bi-award ${iconStyles.tableRowIcon}`}></i> 
                <div className="flex flex-col">
                  <a 
                    href={`/?benchmark=${benchmark.benchmark_id}`}
                    className={`transition-colors ${brandConfig.name === 'OMG' ? 'text-blue-500 hover:text-blue-600 font-sans' : 'text-cyan-400 hover:text-fuchsia-500 font-mono'}`}
                    title={`View all data for ${benchmark.benchmark_name}`}
                  >
                    {benchmark.benchmark_name}
                  </a>
                  <span className="text-xs text-gray-400 capitalize">{benchmark.benchmark_category}</span>
                </div>
              </div>
            </td>
            {selectedModels.map(model => (
              <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
                {(() => {
                  const { score, date, rank, source, sourceName, notes } = getModelBenchmarkData(model.id, benchmark.benchmark_id);
                  
                  if (score === null) {
                    return <span className={textStyles.primary}>-</span>;
                  }
                  
                  // Format score based on benchmark type
                  let formattedScore: string;
                  if (benchmark.benchmark_id === 'chatbot-arena') {
                    // For Chatbot Arena, show as integer with thousands separator
                    formattedScore = Math.round(score).toLocaleString();
                  } else {
                    // For other benchmarks, show one decimal place
                    formattedScore = score.toFixed(1);
                  }
                  
                  // Add ranking badge if in top 5
                  let rankBadge = null;
                  if (rank && rank <= 5) {
                    rankBadge = (
                      <span 
                        className={`ml-1 text-xs font-semibold ${brandConfig.name === 'OMG' ? 'text-blue-600' : 'text-fuchsia-500'}`}
                        style={brandConfig.name === 'OMG' ? { color: brandConfig.primaryColor } : {}}
                      >
                        #{rank}
                      </span>
                    );
                  }

                  // Create tooltip content exactly like in BenchmarksTable
                  const tooltipContent = (() => {
                    let content = '';
                    
                    // Add global ranking info if available
                    if (rank) {
                      const totalModels = rankings[benchmark.benchmark_id] ? Object.keys(rankings[benchmark.benchmark_id]).length : 0;
                      content += `Rank: #${rank} of ${totalModels} models`;
                    }
                    
                    // Add source info
                    if (sourceName) {
                      content += content ? '\n' : '';
                      content += `Source: ${sourceName}`;
                    }
                    
                    // Add notes if available
                    if (notes) {
                      content += content ? '\n' : '';
                      content += `Notes: ${notes}`;
                    }
                    
                    return content;
                  })();
                  
                  return (
                    <div className="flex flex-col items-center">
                      {source ? (
                        <a 
                          href={source} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className={`font-medium transition-colors flex items-center ${brandConfig.name === 'OMG' ? 'font-sans text-blue-500 hover:text-blue-600' : 'font-mono text-cyan-400 hover:text-fuchsia-500'}`}
                          title={tooltipContent}
                        >
                          {formattedScore}{rankBadge}
                        </a>
                      ) : (
                        <div 
                          className={`font-medium flex items-center ${brandConfig.name === 'OMG' ? 'font-sans text-blue-500' : 'font-mono text-cyan-400'}`}
                          title={tooltipContent}
                        >
                          {formattedScore}{rankBadge}
                        </div>
                      )}
                      {date && (
                        <div className="text-xs text-gray-400 font-mono mt-1">
                          {new Date(date).toLocaleDateString('en-GB', {
                            month: 'short',
                            year: 'numeric'
                          })}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </td>
            ))}
          </tr>
        ))}
      </>
    );
  };

  // Generate model ratings rows
  const renderModelRatingsRows = () => (
    <>
      {/* Intelligence Row */}
      {hasAnyModelRating("intelligence") && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`} title="Based on general intelligence benchmarks like MMLU, ARC, HellaSwag, and comprehensive knowledge tasks">
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-circle-fill ${iconStyles.tableRowIcon}`}></i> 
              <span className={textStyles.primary}>Intelligence</span>
            </div>
          </td>
          {selectedModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {renderRating(model, "intelligence")}
            </td>
          ))}
        </tr>
      )}

      {/* Reasoning Row */}
      {hasAnyModelRating("reasoning") && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`} title="Based on logical reasoning and problem-solving benchmarks like GSM8K, MATH, and logical reasoning tasks">
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-lightbulb-fill ${iconStyles.tableRowIcon}`}></i> 
              <span className={textStyles.primary}>Reasoning</span>
            </div>
          </td>
          {selectedModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {renderRating(model, "reasoning")}
            </td>
          ))}
        </tr>
      )}

      {/* Agentic Row */}
      {hasAnyModelRating("agentic") && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`} title="Based on tool use and autonomous task completion benchmarks like ToolBench, WebArena, and agent workflow tasks">
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-cpu-fill ${iconStyles.tableRowIcon}`}></i> 
              <span className={textStyles.primary}>Agentic</span>
            </div>
          </td>
          {selectedModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {renderRating(model, "agentic")}
            </td>
          ))}
        </tr>
      )}

      {/* Coding Row */}
      {hasAnyModelRating("coding") && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`} title="Based on programming and software development benchmarks like HumanEval, MBPP, and CodeContest">
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-terminal-fill ${iconStyles.tableRowIcon}`}></i> 
              <span className={textStyles.primary}>Coding</span>
            </div>
          </td>
          {selectedModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {renderRating(model, "coding")}
            </td>
          ))}
        </tr>
      )}

      {/* STEM Row */}
      {hasAnyModelRating("stem") && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`} title="Based on science, technology, engineering, and mathematics benchmarks like GPQA, MMLU-STEM, and scientific reasoning tasks">
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-calculator-fill ${brandConfig.name === 'OMG' ? '' : iconStyles.tableRowIcon}`} style={brandConfig.name === 'OMG' ? { color: brandConfig.secondaryColor } : {}}></i> 
              <span className={textStyles.primary}>STEM</span>
            </div>
          </td>
          {selectedModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {renderRating(model, "stem")}
            </td>
          ))}
        </tr>
      )}

      {/* Speed Row */}
      {hasAnyModelCapability("speed") && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`} title="Based on response generation speed and tokens per second performance (manually assessed)">
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-lightning-charge-fill ${brandConfig.name === 'OMG' ? '' : iconStyles.tableRowIcon}`} style={brandConfig.name === 'OMG' ? { color: brandConfig.secondaryColor } : {}}></i> 
              <span className={textStyles.primary}>Speed</span>
            </div>
          </td>
          {selectedModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {renderRating(model, "speed")}
            </td>
          ))}
        </tr>
      )}

      {/* Pricing Row */}
      {hasAnyModelRating("pricing") && (
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`} title="Based on API pricing per million tokens (5 = expensive, 1 = cheap). Combines input (70%) and output (30%) pricing">
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-currency-dollar ${brandConfig.name === 'OMG' ? '' : iconStyles.tableRowIcon}`} style={brandConfig.name === 'OMG' ? { color: brandConfig.secondaryColor } : {}}></i> 
              <span className={textStyles.primary}>Pricing</span>
            </div>
          </td>
          {selectedModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {renderRating(model, "pricing")}
            </td>
          ))}
        </tr>
      )}
    </>
  );

  // Generate resources rows
  const renderResourcesRows = () => {
    const hasAnyResource = selectedModels.some(model => 
      model.modelPage || model.releasePost || model.releaseVideo || model.systemCard || model.huggingFace || model.licenceType
    );
    
    if (!hasAnyResource) return null;
    
    return (
      <>
        {/* Release Post */}
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-newspaper ${iconStyles.tableRowIcon}`}></i> 
              <span className={textStyles.primary}>Release Post</span>
            </div>
          </td>
          {selectedModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {model.releasePost ? (
                <a 
                  href={model.releasePost} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1 px-2 py-1 ${brandConfig.name === 'OMG' ? 'bg-gray-200 hover:bg-gray-300 text-blue-600 hover:text-blue-700 rounded border border-gray-300 hover:border-blue-500' : 'bg-gray-700 hover:bg-gray-600 text-cyan-400 hover:text-cyan-300 rounded border border-gray-600 hover:border-cyan-400'} transition-all text-xs`}
                >
                  <i className="bi bi-link-45deg text-xs"></i>
                  Link
                </a>
              ) : (
                <span className={textStyles.primary}>-</span>
              )}
            </td>
          ))}
        </tr>

        {/* Release Video */}
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-play-circle ${iconStyles.tableRowIcon}`}></i> 
              <span className={textStyles.primary}>Release Video</span>
            </div>
          </td>
          {selectedModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {model.releaseVideo ? (
                <a 
                  href={model.releaseVideo} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1 px-2 py-1 ${brandConfig.name === 'OMG' ? 'bg-gray-200 hover:bg-gray-300 text-blue-600 hover:text-blue-700 rounded border border-gray-300 hover:border-blue-500' : 'bg-gray-700 hover:bg-gray-600 text-cyan-400 hover:text-cyan-300 rounded border border-gray-600 hover:border-cyan-400'} transition-all text-xs`}
                >
                  <i className="bi bi-link-45deg text-xs"></i>
                  Link
                </a>
              ) : (
                <span className={textStyles.primary}>-</span>
              )}
            </td>
          ))}
        </tr>

        {/* Model Page */}
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-globe ${iconStyles.tableRowIcon}`}></i> 
              <span className={textStyles.primary}>Model Page</span>
            </div>
          </td>
          {selectedModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {model.modelPage ? (
                <a 
                  href={model.modelPage} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1 px-2 py-1 ${brandConfig.name === 'OMG' ? 'bg-gray-200 hover:bg-gray-300 text-blue-600 hover:text-blue-700 rounded border border-gray-300 hover:border-blue-500' : 'bg-gray-700 hover:bg-gray-600 text-cyan-400 hover:text-cyan-300 rounded border border-gray-600 hover:border-cyan-400'} transition-all text-xs`}
                >
                  <i className="bi bi-link-45deg text-xs"></i>
                  Link
                </a>
              ) : (
                <span className={textStyles.primary}>-</span>
              )}
            </td>
          ))}
        </tr>

        {/* System Card */}
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-file-text ${iconStyles.tableRowIcon}`}></i> 
              <span className={textStyles.primary}>System Card</span>
            </div>
          </td>
          {selectedModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {model.systemCard ? (
                <a 
                  href={model.systemCard} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1 px-2 py-1 ${brandConfig.name === 'OMG' ? 'bg-gray-200 hover:bg-gray-300 text-blue-600 hover:text-blue-700 rounded border border-gray-300 hover:border-blue-500' : 'bg-gray-700 hover:bg-gray-600 text-cyan-400 hover:text-cyan-300 rounded border border-gray-600 hover:border-cyan-400'} transition-all text-xs`}
                >
                  <i className="bi bi-link-45deg text-xs"></i>
                  Link
                </a>
              ) : (
                <span className={textStyles.primary}>-</span>
              )}
            </td>
          ))}
        </tr>

        {/* Licence */}
        <tr className="cursor-pointer">
          <td className={`${tableStyles.cell} ${tableStyles.stickyLabelCell} sticky-label`}>
            <div className={containerStyles.flexCenter}>
              <i className={`bi bi-shield-check ${iconStyles.tableRowIcon}`}></i> 
              <span className={textStyles.primary}>Licence</span>
            </div>
          </td>
          {selectedModels.map(model => (
            <td key={model.id} className={`${tableStyles.cellCenter} transition-colors duration-150`}>
              {model.licenceType ? (
                model.licenceLink ? (
                  <a 
                    href={model.licenceLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1 px-2 py-1 ${brandConfig.name === 'OMG' ? 'bg-gray-200 hover:bg-gray-300 text-blue-600 hover:text-blue-700 rounded border border-gray-300 hover:border-blue-500' : 'bg-gray-700 hover:bg-gray-600 text-cyan-400 hover:text-cyan-300 rounded border border-gray-600 hover:border-cyan-400'} transition-all text-xs`}
                  >
                    <i className="bi bi-link-45deg text-xs"></i>
                    {model.licenceType}
                  </a>
                ) : (
                  <span className={`inline-flex items-center gap-1 px-2 py-1 ${brandConfig.name === 'OMG' ? 'bg-gray-200 text-blue-600 rounded border border-gray-300' : 'bg-gray-700 text-cyan-400 rounded border border-gray-600'} text-xs`}>
                    {model.licenceType}
                  </span>
                )
              ) : (
                <span className={textStyles.primary}>-</span>
              )}
            </td>
          ))}
        </tr>
      </>
    );
  };

  if (selectedModels.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-400">Select models to compare</p>
      </div>
    );
  }

  // Check if we need to show each table section
  const hasContextData = hasAnyModelSpec("maxInputTokens") || hasAnyModelSpec("maxOutputTokens") || hasAnyModelSpec("knowledgeCutoff");
  const hasPricingData = hasAnyModelSpec("pricingInputPerM") || hasAnyModelSpec("pricingOutputPerM");
  
  // Determine if we're showing only frontier models or only open models
  const isAllFrontierModels = selectedModels.every(model => model.category === 'frontier');
  const isAllOpenModels = selectedModels.every(model => model.category === 'open');
  const hasFeaturedBenchmarks = !loading && featuredBenchmarks.length > 0;
  const hasModelRatingsData = ratingsLoaded && (
    hasAnyModelRating("intelligence") || hasAnyModelRating("reasoning") || hasAnyModelRating("agentic") || 
    hasAnyModelRating("coding") || hasAnyModelRating("stem") || hasAnyModelRating("pricing") || hasAnyModelCapability("speed")
  );
  const hasResourceData = selectedModels.some(model => 
    model.modelPage || model.releasePost || model.systemCard || model.huggingFace
  );

  return (
    <div>
      {/* Floating sticky header - appears when original header is out of view */}
      {showStickyHeader && (
        <div className="floating-sticky-header fixed top-32 left-1/2 transform -translate-x-1/2 z-30" style={{ 
          marginTop: '3px',
          width: '1228px',
          borderTopLeftRadius: '0.5rem',
          borderTopRightRadius: '0.5rem',
          borderBottomLeftRadius: '0',
          borderBottomRightRadius: '0',
          overflow: 'hidden',
          backgroundColor: brandConfig.name === 'OMG' ? '#f9fafb' : '#2d3748',
          borderBottom: brandConfig.name === 'OMG' ? `0.5px solid ${brandConfig.primaryColor}` : '0.5px solid #EA00D9'
        }}>
          <table className="table-fixed w-full border-collapse">
            <TableColGroup items={headerItems} />
            <TableHeader items={headerItems} />
          </table>
        </div>
      )}

      {/* Format Icons Legend (centered) */}
      <div className="relative flex justify-center items-center mb-4">
        <div className={`${containerStyles.legend} transform transition-all duration-500`}>
          <div 
            className={`${containerStyles.legendBox} hover:shadow-md transition-all duration-300 ${brandConfig.name === 'OMG' ? 'hover:border-blue-500' : 'hover:border-fuchsia-700'}`}
            style={{ backgroundColor: brandConfig.name === 'OMG' ? 'white' : '#1F2937' }}>
            <div className={containerStyles.legendItems}>
              <div className={containerStyles.legendItem}>
                <i className="bi bi-file-text-fill" style={{ color: brandConfig.name === 'OMG' ? brandConfig.secondaryColor : brandConfig.primaryColor }}></i>
                <span className={`${textStyles.sm} ${textStyles.primary}`}>Text</span>
              </div>
              <div className={containerStyles.legendItem}>
                <i className="bi bi-mic-fill" style={{ color: brandConfig.name === 'OMG' ? brandConfig.secondaryColor : brandConfig.primaryColor }}></i>
                <span className={`${textStyles.sm} ${textStyles.primary}`}>Speech</span>
              </div>
              <div className={containerStyles.legendItem}>
                <i className="bi bi-image-fill" style={{ color: brandConfig.name === 'OMG' ? brandConfig.secondaryColor : brandConfig.primaryColor }}></i>
                <span className={`${textStyles.sm} ${textStyles.primary}`}>Image</span>
              </div>
              <div className={containerStyles.legendItem}>
                <i className="bi bi-music-note-beamed" style={{ color: brandConfig.name === 'OMG' ? brandConfig.secondaryColor : brandConfig.primaryColor }}></i>
                <span className={`${textStyles.sm} ${textStyles.primary}`}>Audio</span>
              </div>
              <div className={containerStyles.legendItem}>
                <i className="bi bi-camera-video-fill" style={{ color: brandConfig.name === 'OMG' ? brandConfig.secondaryColor : brandConfig.primaryColor }}></i>
                <span className={`${textStyles.sm} ${textStyles.primary}`}>Video</span>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute right-0">
          {clearAllButton}
        </div>
      </div>
      
      {/* Basic Information Table */}
      <div ref={tableHeaderRef} className="mb-6">
        <SharedTable>
          <TableColGroup items={headerItems} />
          <TableHeader items={headerItems} />
          <tbody>
            {renderCapabilitiesRows()}
          </tbody>
        </SharedTable>
      </div>
      
      {/* Model Ratings Section */}
      {hasModelRatingsData && (
        <div className="mb-6">
          <SectionTitle>Model Ratings</SectionTitle>
          <SharedTable>
            <TableColGroup items={headerItems} />
            <tbody>
              {renderModelRatingsRows()}
            </tbody>
          </SharedTable>
        </div>
      )}
      
      {/* Context & Limits Section */}
      {hasContextData && (
        <div className="mb-6">
          <SectionTitle>Context & Limits</SectionTitle>
          <SharedTable>
            <TableColGroup items={headerItems} />
            <tbody>
              {renderContextRows()}
            </tbody>
          </SharedTable>
        </div>
      )}
      
      {/* Featured Benchmarks Section */}
      {hasFeaturedBenchmarks && (
        <div className="mb-6">
          <SectionTitle>Featured Benchmarks</SectionTitle>
          <SharedTable>
            <TableColGroup items={headerItems} />
            <tbody>
              {renderFeaturedBenchmarkRows()}
            </tbody>
          </SharedTable>
        </div>
      )}
      
      {/* Pricing Section */}
      {hasPricingData && (
        <div className="mb-6">
          <SectionTitle>
            Pricing
            <span className="text-xs text-gray-400 ml-2 font-normal">
              {isAllFrontierModels ? (
                "(per 1M tokens)"
              ) : isAllOpenModels ? (
                <>(per 1M tokens direct or on <a 
                  href="https://www.together.ai/pricing#inference" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ color: brandConfig.secondaryColor }} className="hover:opacity-80 transition-colors"
                >Together.ai</a>)</>
              ) : (
                <>(per 1M tokens direct or on <a 
                  href="https://www.together.ai/pricing#inference" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ color: brandConfig.secondaryColor }} className="hover:opacity-80 transition-colors"
                >Together.ai</a> for open models)</>
              )}
            </span>
          </SectionTitle>
          <SharedTable>
            <TableColGroup items={headerItems} />
            <tbody>
              {renderPricingRows()}
            </tbody>
          </SharedTable>
        </div>
      )}
      
      {/* Resources Section */}
      {hasResourceData && (
        <div className="mb-6">
          <SectionTitle>Resources</SectionTitle>
          <SharedTable>
            <TableColGroup items={headerItems} />
            <tbody>
              {renderResourcesRows()}
            </tbody>
          </SharedTable>
        </div>
      )}
      
      {/* About sections */}
      {hasModelRatingsData && <AboutModelRatings />}
      {hasFeaturedBenchmarks && <AboutBenchmarks />}
    </div>
  );
};

export default FrontierOpenModelTable;