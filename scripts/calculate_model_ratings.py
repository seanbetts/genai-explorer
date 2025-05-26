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
    print("Loading data files...")
    
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
    
    print(f"Found {len(models)} models of target types:")
    for model_type in TARGET_MODEL_TYPES:
        count = sum(1 for m in models.values() if m['type'] == model_type)
        print(f"  {model_type}: {count}")
    
    # Count models with pricing
    models_with_pricing = sum(1 for m in models.values() 
                             if m['input_price'] is not None and m['output_price'] is not None)
    print(f"Models with pricing data: {models_with_pricing}")
    
    return models

def create_benchmark_category_mapping(benchmarks_meta: List[Dict]) -> Dict[str, str]:
    """Create mapping from benchmark_id to category."""
    mapping = {}
    categories = set()
    
    for benchmark in benchmarks_meta:
        benchmark_id = benchmark['benchmark_id']
        category = benchmark['benchmark_category']
        mapping[benchmark_id] = category
        categories.add(category)
    
    print(f"Found {len(mapping)} benchmarks across {len(categories)} categories:")
    for category in sorted(categories):
        count = sum(1 for cat in mapping.values() if cat == category)
        print(f"  {category}: {count} benchmarks")
    
    return mapping

def deduplicate_scores(benchmarks_df: pd.DataFrame, models: Dict) -> pd.DataFrame:
    """Keep only the latest score per model-benchmark pair."""
    print("Deduplicating benchmark scores...")
    
    # Filter for target models only
    target_model_ids = set(models.keys())
    filtered_df = benchmarks_df[benchmarks_df['model_id'].isin(target_model_ids)].copy()
    
    # Convert date column to datetime
    filtered_df['date'] = pd.to_datetime(filtered_df['date'])
    
    # Sort by date and keep last (latest) entry for each model-benchmark pair
    deduplicated = filtered_df.sort_values('date').groupby(['model_id', 'benchmark_id']).tail(1)
    
    original_count = len(filtered_df)
    final_count = len(deduplicated)
    duplicates_removed = original_count - final_count
    
    print(f"Original scores: {original_count}")
    print(f"After deduplication: {final_count}")
    print(f"Duplicate scores removed: {duplicates_removed}")
    
    return deduplicated

def normalize_and_rate_benchmarks(df: pd.DataFrame) -> pd.DataFrame:
    """Normalize each benchmark to 0-1 scale and convert to 1-5 ratings."""
    print("Normalizing benchmark scores and converting to ratings...")
    
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
                print(f"  Warning: Invalid score '{df.loc[idx, 'score']}' in {benchmark_id}, skipping")
        
        if not valid_scores:
            print(f"  Warning: No valid scores for {benchmark_id}, skipping")
            continue
        
        min_score = min(valid_scores)
        max_score = max(valid_scores)
        
        # Handle degenerate cases
        if len(valid_scores) == 1 or max_score == min_score:
            # Degenerate case: assign neutral rating of 3
            print(f"  {benchmark_id}: Degenerate case, assigning rating 3")
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
    print("Calculating benchmark category ratings...")
    
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
    
    # Print summary statistics
    for category in sorted(all_categories):
        ratings = [r[category] for r in model_ratings.values() if r[category] is not None]
        if ratings:
            avg_rating = sum(ratings) / len(ratings)
            print(f"  {category}: {len(ratings)} models, avg = {avg_rating:.2f}")
    
    return model_ratings

def calculate_pricing_ratings(models: Dict) -> Dict[str, Optional[int]]:
    """Calculate pricing affordability ratings using percentile-based approach."""
    print("Calculating pricing affordability ratings...")
    
    # Extract models with pricing data
    models_with_pricing = {}
    composite_scores = {}
    
    for model_id, model_data in models.items():
        input_price = model_data['input_price']
        output_price = model_data['output_price']
        
        if input_price is not None and output_price is not None:
            # Weighted composite cost (70% input, 30% output)
            composite_cost = (0.7 * input_price) + (0.3 * output_price)
            models_with_pricing[model_id] = model_data
            composite_scores[model_id] = composite_cost
    
    print(f"Models with pricing data: {len(models_with_pricing)}")
    
    if not composite_scores:
        print("No models with pricing data found")
        return {model_id: None for model_id in models.keys()}
    
    # Calculate percentile-based ratings
    costs = sorted(composite_scores.values())
    min_cost = min(costs)
    max_cost = max(costs)
    n = len(costs)
    
    print(f"Cost range: ${min_cost:.3f} - ${max_cost:.3f} per million tokens")
    
    if max_cost == min_cost:
        print("All models have the same cost, assigning rating 3")
        ratings = {model_id: 3 for model_id in composite_scores.keys()}
    else:
        # Calculate percentile thresholds
        p20 = costs[int(0.2 * n)] if n > 1 else costs[0]
        p40 = costs[int(0.4 * n)] if n > 1 else costs[0]
        p60 = costs[int(0.6 * n)] if n > 1 else costs[0]
        p80 = costs[int(0.8 * n)] if n > 1 else costs[0]
        
        print(f"Percentile thresholds: ${p20:.3f}, ${p40:.3f}, ${p60:.3f}, ${p80:.3f}")
        
        ratings = {}
        for model_id, cost in composite_scores.items():
            if cost <= p20:
                rating = 5  # Most affordable
            elif cost <= p40:
                rating = 4  # Very affordable
            elif cost <= p60:
                rating = 3  # Moderately priced
            elif cost <= p80:
                rating = 2  # Expensive
            else:
                rating = 1  # Most expensive
            
            ratings[model_id] = rating
    
    # Extend to all models (None for models without pricing)
    all_ratings = {}
    for model_id in models.keys():
        all_ratings[model_id] = ratings.get(model_id, None)
    
    # Print distribution
    rating_counts = {}
    for rating in [1, 2, 3, 4, 5]:
        rating_counts[rating] = sum(1 for r in ratings.values() if r == rating)
    
    total_with_pricing = len(ratings)
    for rating in [1, 2, 3, 4, 5]:
        count = rating_counts[rating]
        percentage = (count / total_with_pricing) * 100 if total_with_pricing > 0 else 0
        print(f"  Rating {rating}: {count} models ({percentage:.1f}%)")
    
    return all_ratings

def output_comprehensive_csv(models: Dict, benchmark_ratings: Dict, pricing_ratings: Dict,
                           output_file: str = 'data/model_ratings.csv'):
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
            
            # Add benchmark category ratings (rounded to nearest whole number)
            for category in categories:
                rating = benchmark_ratings[model_id].get(category)
                if rating is not None:
                    row[category] = round(rating)
                else:
                    row[category] = 'n/a'
            
            # Add pricing affordability rating
            pricing_rating = pricing_ratings.get(model_id)
            row['pricing_affordability'] = pricing_rating if pricing_rating is not None else 'n/a'
            
            writer.writerow(row)
    
    print(f"Results written to {output_file}")
    
    # Print summary statistics
    print("\\nComprehensive Ratings Summary:")
    print(f"Total models: {len(models)}")
    print(f"Benchmark categories: {', '.join(categories)}")
    
    # Benchmark category stats
    for category in categories:
        ratings = [r[category] for r in benchmark_ratings.values() if r[category] is not None]
        if ratings:
            avg_rating = sum(ratings) / len(ratings)
            print(f"  {category}: {len(ratings)} models, avg = {avg_rating:.2f}")
    
    # Pricing stats
    pricing_ratings_valid = [r for r in pricing_ratings.values() if r is not None]
    if pricing_ratings_valid:
        avg_pricing = sum(pricing_ratings_valid) / len(pricing_ratings_valid)
        print(f"  Pricing affordability: {len(pricing_ratings_valid)} models, avg = {avg_pricing:.2f}")

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
        rated_df, benchmark_stats = normalize_and_rate_benchmarks(deduplicated_df)
        
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