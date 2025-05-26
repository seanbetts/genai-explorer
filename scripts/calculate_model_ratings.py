#!/usr/bin/env python3
"""
Calculate comprehensive model ratings combining benchmark performance and pricing affordability.

This script processes model data to create:
1. Benchmark ratings (1-5) across categories using leaderboard-standard methodology
2. Pricing affordability ratings (1-5) using percentile-based approach
3. Combined output CSV with all ratings for each model

Benchmark methodology:
- Deduplicates scores (latest per model-benchmark pair)
- Per-benchmark min-max normalization with half-up rounding
- Averages ratings within categories without re-scaling

Pricing methodology:
- Combines input/output pricing (70%/30% weighting)
- Percentile-based ratings to handle outliers
- Rating 5 = Most affordable, Rating 1 = Most expensive
"""

import json
import csv
import pandas as pd
from collections import defaultdict
from typing import Dict, List, Optional, Tuple
from decimal import Decimal, ROUND_HALF_UP
import sys
import os

# Target model types to include in analysis
TARGET_MODEL_TYPES = [
    "Large Language Model",
    "Large Hybrid Model", 
    "Large Reasoning Model",
    "Large Multimodal Model"
]

def load_data() -> Tuple[Dict, pd.DataFrame, Dict]:
    """Load all required data files."""
    # Load models data
    with open('data/data.json', 'r') as f:
        companies_data = json.load(f)
    
    # Load benchmark scores
    benchmarks_df = pd.read_csv('public/data/benchmarks.csv')
    
    # Load benchmark metadata
    with open('public/data/benchmarks-meta.json', 'r') as f:
        benchmarks_meta = json.load(f)
    
    return companies_data, benchmarks_df, benchmarks_meta

def extract_target_models(companies_data: Dict) -> Dict[str, Dict]:
    """Extract models of target types from companies data."""
    models = {}
    
    for company in companies_data['companies']:
        if 'models' not in company:
            continue
            
        for model in company['models']:
            if model.get('type') in TARGET_MODEL_TYPES:
                specs = model.get('specs', {})
                
                # Extract pricing data if available
                input_price = specs.get('pricingInputPerM')
                output_price = specs.get('pricingOutputPerM')
                
                models[model['id']] = {
                    'id': model['id'],
                    'name': model['name'],
                    'type': model['type'],
                    'company': company['name'],
                    'input_price': float(input_price) if input_price is not None else None,
                    'output_price': float(output_price) if output_price is not None else None,
                }
    
    return models

def create_benchmark_category_mapping(benchmarks_meta: List[Dict]) -> Dict[str, str]:
    """Create mapping from benchmark_id to category."""
    mapping = {}
    
    for benchmark in benchmarks_meta:
        benchmark_id = benchmark['benchmark_id']
        category = benchmark['benchmark_category']
        mapping[benchmark_id] = category
    
    return mapping

def deduplicate_scores(benchmarks_df: pd.DataFrame, models: Dict) -> pd.DataFrame:
    """Keep only the latest score per model-benchmark pair."""
    # Filter for target models only
    target_model_ids = set(models.keys())
    filtered_df = benchmarks_df[benchmarks_df['model_id'].isin(target_model_ids)].copy()
    
    # Convert date column to datetime
    filtered_df['date'] = pd.to_datetime(filtered_df['date'])
    
    # Sort by date and keep last (latest) entry for each model-benchmark pair
    deduplicated = filtered_df.sort_values('date').groupby(['model_id', 'benchmark_id']).tail(1)
    
    return deduplicated

def normalize_and_rate_benchmarks(df: pd.DataFrame) -> pd.DataFrame:
    """Normalize each benchmark to 0-1 scale and convert to 1-5 ratings."""
    df = df.copy()
    df['normalized_score'] = 0.0
    df['rating_1_to_5'] = 0
    
    benchmark_stats = {}
    
    for benchmark_id in df['benchmark_id'].unique():
        benchmark_data = df[df['benchmark_id'] == benchmark_id].copy()
        
        # Convert scores to numeric, skip invalid ones
        valid_scores = []
        valid_indices = []
        
        for idx in benchmark_data.index:
            try:
                score = float(df.loc[idx, 'score'])
                valid_scores.append(score)
                valid_indices.append(idx)
            except (ValueError, TypeError):
                continue
        
        if not valid_scores:
            continue
        
        min_score = min(valid_scores)
        max_score = max(valid_scores)
        
        # Handle degenerate cases
        if len(valid_scores) == 1 or max_score == min_score:
            # Degenerate case: assign neutral rating of 3
            for idx in valid_indices:
                df.loc[idx, 'normalized_score'] = 0.5
                df.loc[idx, 'rating_1_to_5'] = 3
            benchmark_stats[benchmark_id] = {'degenerate': True}
            continue
        
        # Normal case: min-max normalize and convert to ratings
        score_range = max_score - min_score
        
        for i, idx in enumerate(valid_indices):
            score = valid_scores[i]
            
            # Min-max normalization: (score - min) / (max - min)
            normalized = (score - min_score) / score_range
            
            # Convert to 1-5 rating with half-up rounding
            rating_decimal = Decimal(str(1 + 4 * normalized))
            rating = int(rating_decimal.quantize(Decimal('1'), rounding=ROUND_HALF_UP))
            rating = max(1, min(5, rating))  # Ensure bounds
            
            df.loc[idx, 'normalized_score'] = normalized
            df.loc[idx, 'rating_1_to_5'] = rating
        
        benchmark_stats[benchmark_id] = {'degenerate': False}
    
    return df, benchmark_stats

def calculate_benchmark_category_ratings(df: pd.DataFrame, models: Dict, 
                                       benchmark_categories: Dict) -> Dict[str, Dict[str, Optional[float]]]:
    """Calculate category ratings by averaging 1-5 ratings within each category."""
    model_ratings = {}
    
    # Get all categories
    all_categories = set(benchmark_categories.values())
    
    for model_id in models.keys():
        model_ratings[model_id] = {}
        
        model_data = df[df['model_id'] == model_id]
        
        for category in all_categories:
            # Get all benchmarks in this category for this model
            category_ratings = []
            for _, row in model_data.iterrows():
                benchmark_id = row['benchmark_id']
                if benchmark_id in benchmark_categories and benchmark_categories[benchmark_id] == category:
                    rating = row['rating_1_to_5']
                    if rating > 0:  # Valid rating
                        category_ratings.append(rating)
            
            if category_ratings:
                # Average the 1-5 ratings (no re-scaling)
                avg_rating = sum(category_ratings) / len(category_ratings)
                model_ratings[model_id][category] = avg_rating
            else:
                # No benchmarks in this category for this model
                model_ratings[model_id][category] = None
    
    return model_ratings

def calculate_pricing_ratings(models: Dict) -> Dict[str, Optional[float]]:
    """Calculate pricing affordability ratings using percentile-based normalization to handle outliers."""
    # Extract models with pricing data
    composite_scores = {}
    
    for model_id, model_data in models.items():
        input_price = model_data['input_price']
        output_price = model_data['output_price']
        
        if input_price is not None and output_price is not None:
            # Weighted composite cost (70% input, 30% output)
            composite_cost = (0.7 * input_price) + (0.3 * output_price)
            composite_scores[model_id] = composite_cost
    
    if not composite_scores:
        return {model_id: None for model_id in models.keys()}
    
    # Sort costs for percentile calculation
    costs = sorted(composite_scores.values())
    
    if len(costs) == 1:
        ratings = {model_id: 3.0 for model_id in composite_scores.keys()}
    else:
        # Use percentile-based normalization to handle outliers
        # Cap extreme outliers at 90th percentile for better distribution
        p10_index = int(len(costs) * 0.10)
        p90_index = int(len(costs) * 0.90)
        
        min_cost = costs[p10_index] if p10_index < len(costs) else costs[0]
        max_cost = costs[p90_index] if p90_index < len(costs) else costs[-1]
        
        # Ensure we have a reasonable range
        if max_cost == min_cost:
            # Fallback to simple min-max if percentile range is too narrow
            min_cost = costs[0]
            max_cost = costs[-1]
        
        ratings = {}
        for model_id, cost in composite_scores.items():
            # Cap outliers to prevent extreme skewing
            capped_cost = max(min_cost, min(cost, max_cost))
            
            # Normalize cost to 0-1 range using capped values
            normalized_cost = (capped_cost - min_cost) / (max_cost - min_cost) if max_cost != min_cost else 0.0
            
            # Invert for affordability (lower cost = higher rating)
            affordability_score = 1.0 - normalized_cost
            
            # Scale to 1-5 range with better distribution
            # Use a curve that gives more granularity in the middle ranges
            rating = 1.0 + (4.0 * affordability_score)
            
            ratings[model_id] = rating
    
    # Extend to all models (None for models without pricing)
    all_ratings = {}
    for model_id in models.keys():
        all_ratings[model_id] = ratings.get(model_id, None)
    
    return all_ratings

def create_distribution_histogram(counts: List[int], total: int, max_height: int = 8) -> List[str]:
    """Create a vertical histogram for rating distribution."""
    if total == 0:
        return ["     " for _ in range(max_height)]
    
    # Calculate heights for each rating (1-5)
    heights = []
    for count in counts:
        if total > 0:
            height = int((count / total) * max_height)
            heights.append(height)
        else:
            heights.append(0)
    
    # Create the histogram lines from top to bottom
    histogram_lines = []
    for level in range(max_height, 0, -1):
        line = ""
        for i, height in enumerate(heights):
            if height >= level:
                line += "█"
            else:
                line += " "
            # Add spacing between columns except for the last one
            if i < len(heights) - 1:
                line += "   "
        histogram_lines.append(line)
    
    return histogram_lines

def print_category_distribution(category_name: str, ratings: List[float], indent: str = "  "):
    """Print detailed distribution for a category with vertical histogram."""
    if not ratings:
        print(f"{indent}{category_name}: No data")
        return
    
    avg_rating = sum(ratings) / len(ratings)
    
    # Calculate distribution
    ranges = {
        "1": sum(1 for r in ratings if 1.0 <= r < 2.0),
        "2": sum(1 for r in ratings if 2.0 <= r < 3.0),
        "3": sum(1 for r in ratings if 3.0 <= r < 4.0),
        "4": sum(1 for r in ratings if 4.0 <= r < 5.0),
        "5": sum(1 for r in ratings if r >= 5.0)
    }
    
    total = len(ratings)
    counts = [ranges["1"], ranges["2"], ranges["3"], ranges["4"], ranges["5"]]
    histogram_lines = create_distribution_histogram(counts, total, max_height=5)
    
    print(f"{indent}{category_name}: {avg_rating:.2f} (n={total})")
    
    # Print the histogram
    for line in histogram_lines:
        print(f"{indent}  {line}")
    
    # Print rating labels and percentages with consistent spacing
    print(f"{indent}  1   2   3   4   5")
    
    percentages = []
    for rating, count in ranges.items():
        pct = (count / total) * 100
        percentages.append(f"{pct:.0f}%")
    
    # Format percentages with matching spacing
    print(f"{indent}  {percentages[0]:<3} {percentages[1]:<3} {percentages[2]:<3} {percentages[3]:<3} {percentages[4]}")

def output_comprehensive_csv(models: Dict, benchmark_ratings: Dict, pricing_ratings: Dict,
                           output_file: str = 'public/data/model_ratings.csv'):
    """Output comprehensive ratings to CSV file."""
    
    # Get all benchmark categories
    all_categories = set()
    for ratings in benchmark_ratings.values():
        all_categories.update(ratings.keys())
    
    categories = sorted(list(all_categories))
    
    print(f"Writing comprehensive results to {output_file}...")
    
    with open(output_file, 'w', newline='') as csvfile:
        fieldnames = (['model_id', 'model_name', 'model_type', 'company'] + 
                     categories + ['pricing_affordability'])
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        
        writer.writeheader()
        
        # Sort models by company, then type, then name
        sorted_models = sorted(models.items(), key=lambda x: (x[1]['company'], x[1]['type'], x[1]['name']))
        
        for model_id, model_info in sorted_models:
            row = {
                'model_id': model_id,
                'model_name': model_info['name'],
                'model_type': model_info['type'],
                'company': model_info['company']
            }
            
            # Add benchmark category ratings (rounded to 2 decimal places)
            for category in categories:
                rating = benchmark_ratings[model_id].get(category)
                if rating is not None:
                    row[category] = round(rating, 2)
                else:
                    row[category] = 'n/a'
            
            # Add pricing affordability rating (2 decimal places)
            pricing_rating = pricing_ratings.get(model_id)
            if pricing_rating is not None:
                row['pricing_affordability'] = round(pricing_rating, 2)
            else:
                row['pricing_affordability'] = 'n/a'
            
            writer.writerow(row)
    
    print(f"Results written to {output_file}")
    
    # Print simplified summary
    print("\n" + "="*50)
    print("MODEL RATINGS SUMMARY")
    print("="*50)
    print(f"Total models processed: {len(models)}")
    
    # Count models with pricing
    models_with_pricing = sum(1 for m in models.values() 
                             if m['input_price'] is not None and m['output_price'] is not None)
    print(f"Models with pricing data: {models_with_pricing}")
    
    # Benchmark category distributions
    print("\nBenchmark Categories:")
    for category in sorted(categories):
        ratings = [r[category] for r in benchmark_ratings.values() if r[category] is not None]
        print_category_distribution(category, ratings)
        print()  # Add spacing between categories
    
    # Pricing affordability distribution
    pricing_ratings_valid = [r for r in pricing_ratings.values() if r is not None]
    if pricing_ratings_valid:
        print("Pricing Affordability:")
        print_category_distribution("Affordability", pricing_ratings_valid)
    
    print("\n" + "="*50)

def main():
    """Main execution function."""
    try:
        # Load data
        companies_data, benchmarks_df, benchmarks_meta = load_data()
        
        # Extract target models
        models = extract_target_models(companies_data)
        
        if not models:
            print("No models found of target types!")
            return
        
        # === BENCHMARK RATINGS ===
        # Create benchmark category mapping
        benchmark_categories = create_benchmark_category_mapping(benchmarks_meta)
        
        # Deduplicate scores
        deduplicated_df = deduplicate_scores(benchmarks_df, models)
        
        # Normalize and convert to ratings
        rated_df, _ = normalize_and_rate_benchmarks(deduplicated_df)
        
        # Calculate benchmark category ratings
        benchmark_ratings = calculate_benchmark_category_ratings(rated_df, models, benchmark_categories)
        
        # === PRICING RATINGS ===
        pricing_ratings = calculate_pricing_ratings(models)
        
        # === OUTPUT COMBINED RESULTS ===
        output_comprehensive_csv(models, benchmark_ratings, pricing_ratings)
        
    except FileNotFoundError as e:
        print(f"Error: Could not find required data file - {e}")
        print("Make sure you're running this script from the project root directory.")
        sys.exit(1)
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()