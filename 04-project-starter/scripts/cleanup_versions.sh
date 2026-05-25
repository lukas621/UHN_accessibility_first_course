#!/bin/bash
# Cleanup old versioned files — keep only the 5 newest per base name
# Versioned files match pattern: basename_vYYYYMMDD-HHMMSS.ext
#
# Usage:
#   ./cleanup_versions.sh                    # Dry run (show what would be deleted)
#   ./cleanup_versions.sh --delete           # Actually delete old versions
#   ./cleanup_versions.sh --delete --keep 3  # Keep only 3 newest

set -euo pipefail

PROJECT_DIR="${1:-/Users/yijin/Documents/New Company Claude/UHN Accessibility Course}"
DELETE=false
KEEP=5

for arg in "$@"; do
  case "$arg" in
    --delete) DELETE=true ;;
    --keep) shift ;;
    [0-9]*) KEEP="$arg" ;;
  esac
done

# Parse --keep N
while [[ $# -gt 0 ]]; do
  case "$1" in
    --keep) KEEP="$2"; shift 2 ;;
    --delete) DELETE=true; shift ;;
    *) shift ;;
  esac
done

echo "=== Version Cleanup ==="
echo "  Project: $PROJECT_DIR"
echo "  Keep newest: $KEEP per base file"
echo "  Mode: $([ "$DELETE" = true ] && echo 'DELETE' || echo 'DRY RUN')"
echo ""

# Find all versioned files
TOTAL=0
DELETED=0

# Get unique base names (strip _vYYYYMMDD-HHMMSS from filename)
find "$PROJECT_DIR" -type f -name "*_v2026*" | while read -r filepath; do
  echo "$filepath"
done | sed 's/_v[0-9]\{8\}-[0-9]\{6\}\./\./' | sort -u | while read -r base; do
  # Get the extension and base pattern
  ext="${base##*.}"
  name="${base%.*}"

  # Find all versions of this base file, sorted newest first
  pattern="${name}_v*${ext}"
  versions=$(find "$PROJECT_DIR" -type f -path "*$(basename "$name")*_v2026*.$ext" 2>/dev/null | sort -r)

  count=0
  while IFS= read -r ver; do
    [ -z "$ver" ] && continue
    count=$((count + 1))
    if [ $count -gt $KEEP ]; then
      if [ "$DELETE" = true ]; then
        rm "$ver"
        echo "  DELETED: $(basename "$ver")"
      else
        echo "  WOULD DELETE: $(basename "$ver")"
      fi
      DELETED=$((DELETED + 1))
    fi
  done <<< "$versions"
done

echo ""
echo "Done."
