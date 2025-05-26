#!/usr/bin/env python3
"""
Process benchmarks from Excel file and generate comprehensive model data pipeline.

This script:
1. Reads benchmark data from Excel file and converts to CSV and JSON formats
2. Automatically runs model ratings calculation to generate comprehensive ratings
3. Provides a complete data processing pipeline for the web application
"""
import os
import pandas as pd
import json

# ─── CONFIG ─────────────────────────────────────────────────────────────────────
# Adjust these if your folder layout differs
PROJECT_ROOT      = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR          = os.path.join(PROJECT_ROOT, 'data')
PUBLIC_DATA_DIR   = os.path.join(PROJECT_ROOT, 'public', 'data')
XLSX_FILE         = os.path.join(DATA_DIR, 'benchmarks.xlsx')

# Output paths
CSV_OUT           = os.path.join(PUBLIC_DATA_DIR, 'benchmarks.csv')
JSON_OUT          = os.path.join(PUBLIC_DATA_DIR, 'benchmarks-meta.json')

# Sheet names
SHEET_SCORES      = 'benchmarks'
SHEET_META        = 'benchmark-meta'

# ─── SCRIPT ─────────────────────────────────────────────────────────────────────
def main():
    # Ensure the output directory exists
    os.makedirs(PUBLIC_DATA_DIR, exist_ok=True)

    # 1) Read the "scores" sheet and dump to CSV
    df_scores = pd.read_excel(XLSX_FILE, sheet_name=SHEET_SCORES)
    df_scores.to_csv(CSV_OUT, index=False)
    print(f'✔ Written {len(df_scores)} rows to {CSV_OUT}')

    # 2) Read the "meta" sheet
    df_meta = pd.read_excel(XLSX_FILE, sheet_name=SHEET_META)

    # Handle featured_benchmark as boolean
    if 'featured_benchmark' in df_meta.columns:
        df_meta['featured_benchmark'] = df_meta['featured_benchmark'].fillna(False).astype(bool)

    # Handle blank benchmark_description -> null
    if 'benchmark_description' in df_meta.columns:
        # Replace NaN with empty string, strip whitespace
        df_meta['benchmark_description'] = (
            df_meta['benchmark_description']
            .fillna('')
            .astype(str)
            .apply(lambda x: x.strip())
        )
        # Convert empty strings to None
        df_meta['benchmark_description'] = df_meta['benchmark_description'].replace('', None)

    # Normalize other missing values to None (null in JSON)
    df_meta = df_meta.where(pd.notnull(df_meta), None)

    # Convert to records and write JSON
    records = df_meta.to_dict(orient='records')
    with open(JSON_OUT, 'w', encoding='utf-8') as f:
        json.dump(records, f, ensure_ascii=False, indent=2)
    print(f'✔ Written {len(records)} meta entries to {JSON_OUT}')

def run_model_ratings():
    """Run the model ratings calculation after processing benchmarks."""
    import subprocess
    import sys
    
    print("\n" + "="*60)
    print("Running model ratings calculation...")
    print("="*60)
    
    try:
        # Run the model ratings script
        result = subprocess.run([
            sys.executable, 
            'scripts/calculate_model_ratings.py'
        ], capture_output=True, text=True, check=True)
        
        # Print the output
        print(result.stdout)
        if result.stderr:
            print("Warnings/Errors:")
            print(result.stderr)
            
        print("Model ratings calculation completed successfully!")
        
    except subprocess.CalledProcessError as e:
        print(f"Error running model ratings calculation: {e}")
        print(f"Return code: {e.returncode}")
        if e.stdout:
            print(f"Output: {e.stdout}")
        if e.stderr:
            print(f"Error output: {e.stderr}")
        return False
    except Exception as e:
        print(f"Unexpected error: {e}")
        return False
    
    return True

if __name__ == '__main__':
    # Process benchmarks first
    main()
    
    # Then run model ratings calculation
    print("\n" + "="*60)
    print("Benchmark processing completed. Starting model ratings calculation...")
    success = run_model_ratings()
    
    if success:
        print("\n" + "="*60)
        print("✅ Complete pipeline finished successfully!")
        print("- Benchmarks processed and saved to public/data/")
        print("- Model ratings calculated and saved to data/model_ratings.csv")
        print("="*60)
    else:
        print("\n" + "="*60)
        print("❌ Pipeline completed with errors in model ratings calculation")
        print("- Benchmarks were processed successfully")
        print("- Model ratings calculation failed - check output above")
        print("="*60)
