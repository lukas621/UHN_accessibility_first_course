#!/usr/bin/env python3
"""
Caption & Transcript Generator for UHN Accessibility First Course Series
Generates SRT caption files and plain-text transcripts from narration scripts.
Standalone tool — does NOT require API keys.

Usage:
    python generate_captions.py --guide 1                    # Generate SRT + transcript for Guide 1
    python generate_captions.py --guide 1 --format vtt       # WebVTT instead of SRT
    python generate_captions.py --guide 1 --screen 3         # Single screen only
    python generate_captions.py --guide 1 --transcript-only  # Transcript only, no caption files
    python generate_captions.py --all                        # All guides that have narration scripts
"""

import argparse
import os
import re
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent  # UHN Accessibility Course/
BUILD_OUTPUT = BASE_DIR / "05-build-output"

GUIDE_FOLDERS = {
    1: "01-Foundations-of-Disability-Inclusion-and-Accessible-Design",
    2: "02-Perceptions-Attitudes-and-Barriers",
    3: "03-Vision-Disabilities",
    4: "04-Sensory-Hearing-and-Communication-Disabilities",
    5: "05-Physical-Disabilities-and-Mobility",
    6: "06-Mental-Health-Disabilities",
    7: "07-Intellectual-Developmental-and-Learning-Disabilities",
    8: "08-Non-Visible-Disabilities",
    9: "09-Aging-Disability-and-Intersectionality",
    10: "10-Engaging-with-Confidence-and-Respect",
    11: "11-Service-Animals-Guide-Dogs-and-Non-Service-Animals",
    12: "12-Support-Persons",
    13: "13-Assistive-Devices",
    14: "14-Communication-and-Information-Accessibility",
    15: "15-Neurodiversity-and-Sensory-Regulation",
    16: "16-Trauma-Informed-Accessibility",
    17: "17-Accessibility-in-Crisis-Situations-and-De-escalation",
    18: "18-Indigenous-Peoples-and-Accessibility",
}


def parse_narration_file(filepath: Path) -> list[dict]:
    """Parse a narration markdown file into a list of screen scripts."""
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    screen_pattern = r'##\s*\[SCREEN\s+(\d+)\s*[—–-]\s*(.+?)\]'
    splits = re.split(screen_pattern, content)

    screens = []
    i = 1
    while i < len(splits) - 2:
        screen_num = int(splits[i])
        screen_title = splits[i + 1].strip()
        screen_body = splits[i + 2].strip()
        narration = clean_narration(screen_body)
        wc_match = re.search(r'\[WORD COUNT:\s*(\d+)', screen_body)
        word_count = int(wc_match.group(1)) if wc_match else len(narration.split())

        screens.append({
            "screen_number": screen_num,
            "title": screen_title,
            "narration": narration,
            "word_count": word_count,
        })
        i += 3

    return screens


def clean_narration(text: str) -> str:
    """Remove markdown formatting, beat markers, and metadata."""
    text = re.sub(r'\[WORD COUNT:.*?\]', '', text)
    text = re.sub(r'\[AUDIO FILE:.*?\]', '', text)
    text = re.sub(r'\(Beat[^)]*\)', '', text)
    text = re.sub(r'\(Pause[^)]*\)', '', text)
    text = re.sub(r'^---+\s*$', '', text, flags=re.MULTILINE)
    text = re.sub(r'^#+\s+', '', text, flags=re.MULTILINE)
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()


def split_into_caption_segments(text: str, max_chars: int = 80) -> list[str]:
    """Split narration into caption-sized segments (max ~80 chars per line, sentence-aware)."""
    sentences = re.split(r'(?<=[.!?])\s+', text)
    segments = []
    current = ""

    for sentence in sentences:
        sentence = sentence.strip()
        if not sentence:
            continue

        if len(current) + len(sentence) + 1 <= max_chars:
            current = f"{current} {sentence}".strip() if current else sentence
        else:
            if current:
                segments.append(current)
            # If single sentence is longer than max_chars, split at clause boundaries
            if len(sentence) > max_chars:
                clause_parts = re.split(r'(?<=[,;:—–])\s+', sentence)
                sub_current = ""
                for part in clause_parts:
                    if len(sub_current) + len(part) + 1 <= max_chars:
                        sub_current = f"{sub_current} {part}".strip() if sub_current else part
                    else:
                        if sub_current:
                            segments.append(sub_current)
                        sub_current = part
                current = sub_current
            else:
                current = sentence

    if current:
        segments.append(current)

    return segments


def format_srt_time(seconds: float) -> str:
    """Format seconds as SRT timestamp: HH:MM:SS,mmm"""
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    millis = int((seconds % 1) * 1000)
    return f"{hours:02d}:{minutes:02d}:{secs:02d},{millis:03d}"


def format_vtt_time(seconds: float) -> str:
    """Format seconds as WebVTT timestamp: HH:MM:SS.mmm"""
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    millis = int((seconds % 1) * 1000)
    return f"{hours:02d}:{minutes:02d}:{secs:02d}.{millis:03d}"


def generate_srt(text: str, output_path: Path, wpm: int = 150) -> None:
    """Generate SRT caption file."""
    segments = split_into_caption_segments(text)
    entries = []
    current_time = 0.0

    for i, segment in enumerate(segments, 1):
        word_count = len(segment.split())
        duration = (word_count / wpm) * 60
        duration = max(duration, 1.5)

        start = format_srt_time(current_time)
        end = format_srt_time(current_time + duration)
        entries.append(f"{i}\n{start} --> {end}\n{segment}\n")
        current_time += duration

    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        f.write("\n".join(entries))


def generate_vtt(text: str, output_path: Path, wpm: int = 150) -> None:
    """Generate WebVTT caption file."""
    segments = split_into_caption_segments(text)
    entries = ["WEBVTT\n"]
    current_time = 0.0

    for i, segment in enumerate(segments, 1):
        word_count = len(segment.split())
        duration = (word_count / wpm) * 60
        duration = max(duration, 1.5)

        start = format_vtt_time(current_time)
        end = format_vtt_time(current_time + duration)
        entries.append(f"{i}\n{start} --> {end}\n{segment}\n")
        current_time += duration

    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        f.write("\n".join(entries))


def generate_transcript(screens: list[dict], output_path: Path, guide_number: int) -> None:
    """Generate plain-text transcript."""
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(f"TRANSCRIPT — Guide {guide_number:02d}\n")
        f.write("Accessibility First Course Series | University Health Network\n")
        f.write("=" * 60 + "\n\n")

        for screen in screens:
            f.write(f"[Slide {guide_number}.{screen['screen_number']}] {screen['title']}\n")
            f.write("-" * 40 + "\n")
            f.write(screen["narration"] + "\n\n")

        total_words = sum(s["word_count"] for s in screens)
        total_time = total_words / 150
        f.write("=" * 60 + "\n")
        f.write(f"Total words: {total_words}\n")
        f.write(f"Estimated duration: {int(total_time)} min {int((total_time % 1) * 60)} sec\n")


def process_guide(guide_num: int, fmt: str = "srt", screen_filter: int = None,
                  transcript_only: bool = False) -> bool:
    """Process a single guide. Returns True if successful."""
    if guide_num not in GUIDE_FOLDERS:
        print(f"  Skip: Guide {guide_num} not in folder map")
        return False

    guide_folder = BUILD_OUTPUT / GUIDE_FOLDERS[guide_num]
    narration_dir = guide_folder / "06-audio-narration"
    narration_file = narration_dir / f"NARRATION-SCRIPTS-GUIDE-{guide_num:02d}.md"

    if not narration_file.exists():
        print(f"  Skip: No narration file for Guide {guide_num:02d}")
        return False

    screens = parse_narration_file(narration_file)
    print(f"  Guide {guide_num:02d}: {len(screens)} screens parsed")

    if screen_filter:
        screens = [s for s in screens if s["screen_number"] == screen_filter]
        if not screens:
            print(f"  Error: Screen {screen_filter} not found")
            return False

    # Generate transcript
    transcript_path = narration_dir / "transcript" / f"TRANSCRIPT-GUIDE-{guide_num:02d}.txt"
    generate_transcript(screens, transcript_path, guide_num)
    print(f"  Transcript: {transcript_path.name}")

    if transcript_only:
        return True

    # Generate captions per screen
    for screen in screens:
        filename = f"voiceover_{guide_num}.{screen['screen_number']}"
        if fmt == "vtt":
            caption_path = narration_dir / "captions" / f"{filename}.vtt"
            generate_vtt(screen["narration"], caption_path)
        else:
            caption_path = narration_dir / "captions" / f"{filename}.srt"
            generate_srt(screen["narration"], caption_path)
        print(f"  Caption: {caption_path.name}")

    total_words = sum(s["word_count"] for s in screens)
    print(f"  Total: {total_words} words, ~{total_words // 150}m {(total_words % 150) * 60 // 150}s\n")
    return True


def main():
    parser = argparse.ArgumentParser(description="Generate SRT/VTT captions and transcripts from narration scripts")
    parser.add_argument("--guide", type=int, help="Guide number (1-18)")
    parser.add_argument("--all", action="store_true", help="Process all guides that have narration scripts")
    parser.add_argument("--format", choices=["srt", "vtt"], default="srt", help="Caption format (default: srt)")
    parser.add_argument("--screen", type=int, default=None, help="Single screen only")
    parser.add_argument("--transcript-only", action="store_true", help="Generate transcript only")
    args = parser.parse_args()

    if not args.guide and not args.all:
        print("Error: Specify --guide N or --all")
        sys.exit(1)

    if args.all:
        print("Processing all guides...\n")
        processed = 0
        for g in range(1, 19):
            if process_guide(g, args.format, args.screen, args.transcript_only):
                processed += 1
        print(f"Done! Processed {processed} guides.")
    else:
        process_guide(args.guide, args.format, args.screen, args.transcript_only)
        print("Done!")


if __name__ == "__main__":
    main()
