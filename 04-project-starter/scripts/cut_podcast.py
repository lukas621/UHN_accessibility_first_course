#!/usr/bin/env python3
"""
Podcast Cutter for UHN Accessibility First Course Series
Cuts segments from a long podcast and joins them into a single ~5 min episode.

Usage:
    python cut_podcast.py                          # Interactive mode — prompts for timestamps
    python cut_podcast.py --segments "2:15-4:30,7:10-9:45,14:00-15:20"   # Direct mode

Requirements:
    ffmpeg must be installed (brew install ffmpeg)
"""

import argparse
import os
import subprocess
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent
PODCAST_DIR = BASE_DIR / "05-build-output" / "01-Foundations-of-Disability-Inclusion-and-Accessible-Design" / "08-notebooklm-podcast"
SOURCE_FILE = PODCAST_DIR / "Five_words_to_restore_patient_dignity.m4a"
OUTPUT_FILE = PODCAST_DIR / "podcast_guide01_5min.mp3"


def check_ffmpeg():
    """Check if ffmpeg is installed."""
    try:
        subprocess.run(["ffmpeg", "-version"], capture_output=True, check=True)
        return True
    except (FileNotFoundError, subprocess.CalledProcessError):
        print("Error: ffmpeg not installed. Run: brew install ffmpeg")
        return False


def parse_timestamp(ts: str) -> float:
    """Convert MM:SS or H:MM:SS to seconds."""
    ts = ts.strip()
    parts = ts.split(":")
    if len(parts) == 2:
        return int(parts[0]) * 60 + float(parts[1])
    elif len(parts) == 3:
        return int(parts[0]) * 3600 + int(parts[1]) * 60 + float(parts[2])
    else:
        raise ValueError(f"Invalid timestamp: {ts}")


def format_time(seconds: float) -> str:
    """Convert seconds to MM:SS."""
    m = int(seconds) // 60
    s = int(seconds) % 60
    return f"{m}:{s:02d}"


def parse_segments(segments_str: str) -> list:
    """Parse 'start-end,start-end' into list of (start_sec, end_sec)."""
    segments = []
    for part in segments_str.split(","):
        part = part.strip()
        if "-" not in part:
            print(f"Skipping invalid segment: {part} (expected 'start-end')")
            continue
        start_str, end_str = part.split("-", 1)
        start = parse_timestamp(start_str)
        end = parse_timestamp(end_str)
        if end <= start:
            print(f"Skipping invalid segment: {part} (end must be after start)")
            continue
        segments.append((start, end))
    return segments


def interactive_mode() -> list:
    """Prompt user for timestamps interactively."""
    print()
    print("=" * 60)
    print("  Podcast Cutter — Guide 01")
    print("=" * 60)
    print()
    print(f"  Source: {SOURCE_FILE.name}")
    print()
    print("  Listen to the podcast and note the timestamps for")
    print("  segments you want to keep. Enter them below.")
    print()
    print("  Format: START-END (e.g., 2:15-4:30)")
    print("  Type 'done' when finished.")
    print()

    segments = []
    i = 1
    while True:
        try:
            entry = input(f"  Segment {i}: ").strip()
        except (EOFError, KeyboardInterrupt):
            print()
            break

        if entry.lower() in ("done", "d", ""):
            if not segments:
                print("  No segments entered. Exiting.")
                sys.exit(0)
            break

        if "-" not in entry:
            print("  Invalid format. Use START-END (e.g., 2:15-4:30)")
            continue

        try:
            start_str, end_str = entry.split("-", 1)
            start = parse_timestamp(start_str)
            end = parse_timestamp(end_str)
            if end <= start:
                print("  End must be after start. Try again.")
                continue
            duration = end - start
            segments.append((start, end))
            print(f"    → {format_time(start)} to {format_time(end)} ({format_time(duration)})")
            i += 1
        except ValueError as e:
            print(f"  Error: {e}. Use MM:SS format.")

    return segments


def cut_and_join(source: Path, segments: list, output: Path, fade: float = 0.5):
    """Cut segments from source audio and join them with crossfade."""
    temp_dir = output.parent / "_temp_cuts"
    temp_dir.mkdir(exist_ok=True)

    temp_files = []
    total_duration = 0

    print()
    print("Cutting segments...")

    for i, (start, end) in enumerate(segments):
        duration = end - start
        total_duration += duration
        temp_file = temp_dir / f"seg_{i:02d}.mp3"
        temp_files.append(temp_file)

        cmd = [
            "ffmpeg", "-y",
            "-i", str(source),
            "-ss", str(start),
            "-to", str(end),
            "-af", f"afade=t=in:st=0:d={fade},afade=t=out:st={duration - fade}:d={fade}",
            "-ar", "44100",
            "-ab", "192k",
            str(temp_file),
        ]
        result = subprocess.run(cmd, capture_output=True)
        if result.returncode != 0:
            print(f"  Error cutting segment {i+1}: {result.stderr.decode()[-200:]}")
            continue
        print(f"  ✓ Segment {i+1}: {format_time(start)} → {format_time(end)} ({format_time(duration)})")

    if not temp_files:
        print("No segments cut successfully.")
        return

    # Join segments
    print()
    print("Joining segments...")

    if len(temp_files) == 1:
        # Just copy the single segment
        import shutil
        shutil.copy2(temp_files[0], output)
    else:
        # Create concat file
        concat_file = temp_dir / "concat.txt"
        with open(concat_file, "w") as f:
            for tf in temp_files:
                f.write(f"file '{tf.name}'\n")

        cmd = [
            "ffmpeg", "-y",
            "-f", "concat",
            "-safe", "0",
            "-i", str(concat_file),
            "-ar", "44100",
            "-ab", "192k",
            str(output),
        ]
        result = subprocess.run(cmd, capture_output=True)
        if result.returncode != 0:
            print(f"  Error joining: {result.stderr.decode()[-200:]}")
            return

    # Clean up temp files
    for tf in temp_files:
        tf.unlink()
    if (temp_dir / "concat.txt").exists():
        (temp_dir / "concat.txt").unlink()
    temp_dir.rmdir()

    # Report
    size_mb = output.stat().st_size / 1024 / 1024
    print()
    print("=" * 60)
    print(f"  ✓ Output: {output}")
    print(f"  ✓ Duration: ~{format_time(total_duration)}")
    print(f"  ✓ Size: {size_mb:.1f} MB")
    print(f"  ✓ Segments: {len(segments)}")
    print("=" * 60)


def main():
    parser = argparse.ArgumentParser(description="Cut podcast segments for UHN Accessibility First")
    parser.add_argument("--source", type=str, default=None,
                        help="Source audio file (default: Five_words_to_restore_patient_dignity.m4a)")
    parser.add_argument("--output", type=str, default=None,
                        help="Output file (default: podcast_guide01_5min.mp3)")
    parser.add_argument("--segments", type=str, default=None,
                        help='Segments to keep, e.g., "2:15-4:30,7:10-9:45,14:00-15:20"')
    parser.add_argument("--fade", type=float, default=0.5,
                        help="Fade in/out duration in seconds (default: 0.5)")
    args = parser.parse_args()

    if not check_ffmpeg():
        sys.exit(1)

    source = Path(args.source) if args.source else SOURCE_FILE
    output = Path(args.output) if args.output else OUTPUT_FILE

    if not source.exists():
        print(f"Error: Source file not found: {source}")
        print()
        print("Available files in podcast folder:")
        for f in PODCAST_DIR.glob("*.m4a"):
            print(f"  {f.name}")
        for f in PODCAST_DIR.glob("*.mp3"):
            print(f"  {f.name}")
        sys.exit(1)

    if args.segments:
        segments = parse_segments(args.segments)
    else:
        segments = interactive_mode()

    if not segments:
        print("No valid segments. Exiting.")
        sys.exit(1)

    # Summary before cutting
    total = sum(end - start for start, end in segments)
    print()
    print(f"  Source: {source.name}")
    print(f"  Segments: {len(segments)}")
    print(f"  Total duration: ~{format_time(total)}")
    print(f"  Output: {output.name}")
    print()

    cut_and_join(source, segments, output, fade=args.fade)


if __name__ == "__main__":
    main()
