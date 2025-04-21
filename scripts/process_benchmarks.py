#!/usr/bin/env python3
import os
import pandas as pd
import json

# ─── CONFIG ─────────────────────────────────────────────────────────────────────

# Adjust these if your folder layout differs
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR     = os.path.join(PROJECT_ROOT, 'data')
XLSX_FILE    = os.path.join(DATA_DIR, 'benchmarks.xlsx')

# Output paths
CSV_OUT   = os.path.join(DATA_DIR, 'benchmarks.csv')
JSON_OUT  = os.path.join(DATA_DIR, 'benchmarks-meta.json')

# Sheet names
SHEET_SCORES = 'benchmarks'
SHEET_META   = 'benchmark-meta'

# ─── SCRIPT ─────────────────────────────────────────────────────────────────────

def main():
    # 1) Read the "scores" sheet and dump to CSV
    df_scores = pd.read_excel(XLSX_FILE, sheet_name=SHEET_SCORES)
    df_scores.to_csv(CSV_OUT, index=False)
    print(f'✔ Written {len(df_scores)} rows to {CSV_OUT}')

    # 2) Read the "meta" sheet and replace missing papers with None (null in JSON)
    df_meta = pd.read_excel(XLSX_FILE, sheet_name=SHEET_META)
    # Replace all NaN values with None so JSON shows null
    df_meta = df_meta.where(pd.notnull(df_meta), None)

    # Convert to records and write JSON
    records = df_meta.to_dict(orient='records')
    with open(JSON_OUT, 'w', encoding='utf-8') as f:
        json.dump(records, f, ensure_ascii=False, indent=2)
    print(f'✔ Written {len(records)} meta entries to {JSON_OUT}')

if __name__ == '__main__':
    main()
