#!/usr/bin/env python3
"""
Calculate model ratings by benchmark category using simplified leaderboard methodology.

This script implements the core methodology improvements:
1. Deduplicate scores (latest per model-benchmark pair)
2. Normalize each benchmark to 0-1 scale using min-max
3. Convert to 1-5 ratings with half-up rounding
4. Average ratings within categories (no re-scaling)
5. Handle degenerate cases properly
6. Use proper rounding rules
7. Return n/a for missing categories
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
                models[model['id']] = {
                    'id': model['id'],
                    'name': model['name'],
                    'type': model['type'],
                    'company': company['name']
                }
    
    print(f"Found {len(models)} models of target types:")
    for model_type in TARGET_MODEL_TYPES:
        count = sum(1 for m in models.values() if m['type'] == model_type)
        print(f"  {model_type}: {count}")
    
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
    print("Deduplicating scores...")
    
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
            print(f"  {benchmark_id}: Degenerate case (single model or min==max), assigning rating 3")
            for idx in valid_indices:
                df.loc[idx, 'normalized_score'] = 0.5
                df.loc[idx, 'rating_1_to_5'] = 3
            benchmark_stats[benchmark_id] = {
                'min': min_score,
                'max': max_score,
                'range': 0,
                'degenerate': True
            }
            continue
        
        # Normal case: min-max normalize and convert to ratings
        score_range = max_score - min_score
        
        for i, idx in enumerate(valid_indices):
            score = valid_scores[i]
            
            # Min-max normalization: (score - min) / (max - min)
            normalized = (score - min_score) / score_range
            
            # Convert to 1-5 rating with half-up rounding
            # rating = round_half_up(1 + 4 × norm_score)
            rating_decimal = Decimal(str(1 + 4 * normalized))
            rating = int(rating_decimal.quantize(Decimal('1'), rounding=ROUND_HALF_UP))
            rating = max(1, min(5, rating))  # Ensure bounds
            
            df.loc[idx, 'normalized_score'] = normalized
            df.loc[idx, 'rating_1_to_5'] = rating
        
        benchmark_stats[benchmark_id] = {
            'min': min_score,
            'max': max_score,
            'range': score_range,
            'degenerate': False
        }
        
        print(f"  {benchmark_id}: range=[{min_score:.1f}, {max_score:.1f}]")
    
    return df, benchmark_stats

def calculate_category_ratings(df: pd.DataFrame, models: Dict, 
                             benchmark_categories: Dict) -> Dict[str, Dict[str, Optional[float]]]:
    """Calculate category ratings by averaging 1-5 ratings within each category."""
    print("Calculating category ratings...")
    
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
            min_rating = min(ratings)
            max_rating = max(ratings)
            print(f"  {category}: {len(ratings)} models, avg = {avg_rating:.2f}, range = [{min_rating:.1f}, {max_rating:.1f}]")
    
    return model_ratings

def output_csv(models: Dict, model_ratings: Dict, benchmark_stats: Dict, 
               output_file: str = 'data/model_ratings.csv'):
    """Output results to CSV file."""
    
    # Get all categories
    all_categories = set()
    for ratings in model_ratings.values():
        all_categories.update(ratings.keys())
    
    categories = sorted(list(all_categories))
    
    print(f"Writing results to {output_file}...")
    
    with open(output_file, 'w', newline='') as csvfile:
        fieldnames = ['model_id', 'model_name', 'model_type', 'company'] + categories
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
            
            # Add category ratings (rounded to nearest whole number)
            for category in categories:
                rating = model_ratings[model_id].get(category)
                if rating is not None:
                    row[category] = round(rating)
                else:
                    row[category] = 'n/a'
            
            writer.writerow(row)
    
    print(f"Results written to {output_file}")
    
    # Print summary statistics
    print("\\nSummary:")
    print(f"Total models: {len(models)}")
    print(f"Categories: {', '.join(categories)}")
    print(f"Benchmarks processed: {len(benchmark_stats)}")
    print(f"Degenerate benchmarks: {sum(1 for s in benchmark_stats.values() if s.get('degenerate', False))}")
    
    for category in categories:
        ratings = [r[category] for r in model_ratings.values() if r[category] is not None]
        if ratings:
            avg_rating = sum(ratings) / len(ratings)
            min_rating = min(ratings)
            max_rating = max(ratings)
            print(f"  {category}: {len(ratings)} models rated, avg = {avg_rating:.2f}, range = [{min_rating:.1f}, {max_rating:.1f}]")
        else:
            print(f"  {category}: No models rated")

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
        
        # Create benchmark category mapping
        benchmark_categories = create_benchmark_category_mapping(benchmarks_meta)
        
        # Deduplicate scores
        deduplicated_df = deduplicate_scores(benchmarks_df, models)
        
        # Normalize and convert to ratings
        rated_df, benchmark_stats = normalize_and_rate_benchmarks(deduplicated_df)
        
        # Calculate category ratings
        model_ratings = calculate_category_ratings(rated_df, models, benchmark_categories)
        
        # Output results
        output_csv(models, model_ratings, benchmark_stats)
        
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