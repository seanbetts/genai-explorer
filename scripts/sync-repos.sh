#!/bin/bash

# Repository Sync Script
# Syncs between GitHub (genai-explorer) and BitBucket (genai-explorer-omg) repositories
# Usage: ./sync-repos.sh [to-bitbucket|to-github|--dry-run]

set -e

# Define paths
GITHUB_DIR="/Users/sean/Coding/genai-explorer"
BITBUCKET_DIR="/Users/sean/Coding/genai-explorer-omg"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
  echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
  echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
  echo -e "${RED}[ERROR]${NC} $1"
}

# Function to validate directories
validate_dirs() {
  if [[ ! -d "$GITHUB_DIR" ]]; then
    print_error "GitHub directory not found: $GITHUB_DIR"
    exit 1
  fi
  
  if [[ ! -d "$BITBUCKET_DIR" ]]; then
    print_error "BitBucket directory not found: $BITBUCKET_DIR"
    exit 1
  fi
}

# Function to show sync preview
show_preview() {
  local source=$1
  local dest=$2
  local direction=$3
  local delete_flag=$4
  
  print_status "Preview of changes for: $direction"
  echo "Source: $source"
  echo "Destination: $dest"
  if [[ "$delete_flag" == "--delete" ]]; then
    print_warning "DELETE MODE: Files not in source will be removed from destination"
  else
    print_status "SAFE MODE: No files will be deleted from destination"
  fi
  echo ""
  
  rsync -av $delete_flag --dry-run --itemize-changes \
    --exclude='.git/' \
    --exclude='.gitignore' \
    --exclude='.github/' \
    --exclude='.claude/' \
    --exclude='.DS_Store' \
    --exclude='node_modules/' \
    --exclude='out/' \
    --exclude='.next/' \
    --exclude='bitbucket-pipelines.yml' \
    "$source/" "$dest/" | grep '^[>ch.*]' | head -20 || echo "No files need to be synced - destinations are already up to date!"
  
  echo ""
  read -p "Continue with sync? (y/N): " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_warning "Sync cancelled by user"
    exit 0
  fi
}

# Function to perform sync
sync_repos() {
  local source=$1
  local dest=$2
  local direction=$3
  local delete_flag=$4
  
  print_status "Starting sync: $direction"
  if [[ "$delete_flag" == "--delete" ]]; then
    print_warning "DELETE MODE: Removing files not in source"
  else
    print_status "SAFE MODE: Preserving existing files in destination"
  fi
  
  # Create backup timestamp
  local timestamp=$(date +"%Y%m%d_%H%M%S")
  
  # Perform the sync
  rsync -av $delete_flag \
    --exclude='.git/' \
    --exclude='.gitignore' \
    --exclude='.github/' \
    --exclude='.claude/' \
    --exclude='.DS_Store' \
    --exclude='node_modules/' \
    --exclude='out/' \
    --exclude='.next/' \
    --exclude='bitbucket-pipelines.yml' \
    --backup --backup-dir="$dest.backup.$timestamp" \
    "$source/" "$dest/"
  
  print_status "Sync completed successfully!"
  print_status "Backup created at: $dest.backup.$timestamp"
}

# Function to show help
show_help() {
  echo "Repository Sync Script"
  echo ""
  echo "Usage: $0 [DIRECTION] [OPTIONS]"
  echo ""
  echo "Directions:"
  echo "  to-bitbucket    Sync from GitHub to BitBucket (default)"
  echo "  to-github       Sync from BitBucket to GitHub"
  echo ""
  echo "Options:"
  echo "  --delete        Enable deletion of files not in source (DANGEROUS)"
  echo "  --dry-run       Show what would be synced without making changes"
  echo "  --help          Show this help message"
  echo ""
  echo "Examples:"
  echo "  $0                           # Safe sync GitHub -> BitBucket"
  echo "  $0 to-bitbucket              # Safe sync GitHub -> BitBucket"
  echo "  $0 to-github                 # Safe sync BitBucket -> GitHub"
  echo "  $0 to-bitbucket --delete     # Sync with file deletion enabled"
  echo "  $0 --dry-run                 # Preview safe sync GitHub -> BitBucket"
  echo "  $0 to-github --dry-run       # Preview safe sync BitBucket -> GitHub"
  echo "  $0 --delete --dry-run        # Preview sync with deletion enabled"
  echo ""
  echo "Note: By default, files are only added/updated, never deleted (safe mode)."
  echo "Use --delete flag to remove files from destination that don't exist in source."
}

# Main script logic
main() {
  local direction="to-bitbucket"
  local delete_flag=""
  local dry_run=false
  
  # Parse arguments
  for arg in "$@"; do
    case $arg in
      "to-bitbucket"|"to-github")
        direction="$arg"
        ;;
      "--delete")
        delete_flag="--delete"
        ;;
      "--dry-run")
        dry_run=true
        ;;
      "--help"|"-h")
        show_help
        exit 0
        ;;
      *)
        print_error "Unknown option: $arg"
        echo ""
        show_help
        exit 1
        ;;
    esac
  done
  
  validate_dirs
  
  # Set source and destination based on direction
  if [[ "$direction" == "to-github" ]]; then
    local source="$BITBUCKET_DIR"
    local dest="$GITHUB_DIR"
    local direction_text="BitBucket -> GitHub"
  else
    local source="$GITHUB_DIR"
    local dest="$BITBUCKET_DIR"
    local direction_text="GitHub -> BitBucket"
  fi
  
  # Handle dry run mode
  if [[ "$dry_run" == true ]]; then
    print_status "DRY RUN: $direction_text"
    if [[ "$delete_flag" == "--delete" ]]; then
      print_warning "DELETE MODE: Files not in source will be removed from destination"
    else
      print_status "SAFE MODE: No files will be deleted from destination"
    fi
    echo ""
    
    rsync -av $delete_flag --dry-run --itemize-changes \
      --exclude='.git/' \
      --exclude='.gitignore' \
      --exclude='.github/' \
      --exclude='.claude/' \
      --exclude='.DS_Store' \
      --exclude='node_modules/' \
      --exclude='out/' \
      --exclude='.next/' \
      --exclude='bitbucket-pipelines.yml' \
      "$source/" "$dest/" | grep '^[>ch.*]' || echo "No files need to be synced - destinations are already up to date!"
  else
    show_preview "$source" "$dest" "$direction_text" "$delete_flag"
    sync_repos "$source" "$dest" "$direction_text" "$delete_flag"
  fi
}

# Run the main function with all arguments
main "$@"