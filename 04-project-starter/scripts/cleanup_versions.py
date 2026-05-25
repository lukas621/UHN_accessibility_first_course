#!/usr/bin/env python3
"""
Cleanup old versioned files — keep only the N newest per base name.
Versioned files match: basename_vYYYYMMDD-HHMMSS.ext

Usage:
    python cleanup_versions.py                     # Dry run
    python cleanup_versions.py --delete            # Delete old versions
    python cleanup_versions.py --delete --keep 3   # Keep only 3 newest
"""

import argparse
import os
import re
from collections import defaultdict
from pathlib import Path

VERSION_PATTERN = re.compile(r'^(.+)_v(\d{8}-\d{6})(\..+)$')


def find_versioned_files(root: Path) -> dict:
    """Group versioned files by their base name."""
    groups = defaultdict(list)

    for dirpath, _, filenames in os.walk(root):
        for fname in filenames:
            match = VERSION_PATTERN.match(fname)
            if match:
                base_name = match.group(1)
                timestamp = match.group(2)
                ext = match.group(3)
                key = os.path.join(dirpath, base_name + ext)
                full_path = os.path.join(dirpath, fname)
                groups[key].append((timestamp, full_path))

    # Sort each group by timestamp descending (newest first)
    for key in groups:
        groups[key].sort(key=lambda x: x[0], reverse=True)

    return groups


def cleanup(root: Path, keep: int = 5, delete: bool = False):
    """Remove old versions, keeping only the newest N per base file."""
    groups = find_versioned_files(root)

    total_files = sum(len(v) for v in groups.values())
    to_delete = []

    print(f"{'=' * 60}")
    print(f"  Version Cleanup")
    print(f"  Root: {root}")
    print(f"  Keep newest: {keep} per base file")
    print(f"  Mode: {'DELETE' if delete else 'DRY RUN'}")
    print(f"  Total versioned files: {total_files}")
    print(f"  Unique base files: {len(groups)}")
    print(f"{'=' * 60}")
    print()

    for base, versions in sorted(groups.items()):
        if len(versions) <= keep:
            continue

        old = versions[keep:]
        base_short = os.path.basename(base)
        print(f"  {base_short} — {len(versions)} versions, removing {len(old)}")

        for ts, path in old:
            to_delete.append(path)
            short = os.path.basename(path)
            if delete:
                os.remove(path)
                print(f"    ✗ {short}")
            else:
                print(f"    → would delete: {short}")

    print()
    print(f"{'=' * 60}")
    if delete:
        print(f"  Deleted: {len(to_delete)} files")
    else:
        print(f"  Would delete: {len(to_delete)} files")
        if to_delete:
            print(f"  Run with --delete to remove them")
    print(f"  Kept: {total_files - len(to_delete)} files")
    print(f"{'=' * 60}")


def main():
    parser = argparse.ArgumentParser(description="Cleanup old versioned files")
    parser.add_argument("--root", type=str,
                        default="/Users/yijin/Documents/New Company Claude/UHN Accessibility Course",
                        help="Project root directory")
    parser.add_argument("--keep", type=int, default=5, help="Number of newest versions to keep (default: 5)")
    parser.add_argument("--delete", action="store_true", help="Actually delete (default: dry run)")
    args = parser.parse_args()

    cleanup(Path(args.root), keep=args.keep, delete=args.delete)


if __name__ == "__main__":
    main()
