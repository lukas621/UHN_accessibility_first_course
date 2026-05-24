#!/usr/bin/env python3
"""
Audio Generation Script for UHN Accessibility First Course Series
Generates voice-over MP3 files from narration scripts using MiniMax or ElevenLabs API.

Usage:
    python generate_audio.py --guide 1 --provider elevenlabs --voice "Rachel"
    python generate_audio.py --guide 1 --provider minimax
    python generate_audio.py --guide 1 --provider elevenlabs --voice "Rachel" --screen 3  # single screen only
    python generate_audio.py --guide 1 --provider elevenlabs --list-voices  # list available voices

Requirements:
    pip install requests python-dotenv

Environment variables (in .env file):
    ELEVENLABS_API_KEY=your_key_here
    MINIMAX_API_KEY=your_key_here
    MINIMAX_GROUP_ID=your_group_id_here
"""

import argparse
import os
import re
import sys
import json
from pathlib import Path

try:
    import requests
except ImportError:
    print("Error: 'requests' package not installed. Run: pip install requests")
    sys.exit(1)

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass  # dotenv is optional — can use env vars directly


# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent.parent
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


# ---------------------------------------------------------------------------
# Parse narration scripts
# ---------------------------------------------------------------------------

def parse_narration_file(filepath: Path) -> list[dict]:
    """Parse a narration markdown file into a list of screen scripts."""
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Split by screen headers: ## [SCREEN X — Title]
    screen_pattern = r'##\s*\[SCREEN\s+(\d+)\s*[—–-]\s*(.+?)\]'
    splits = re.split(screen_pattern, content)

    screens = []
    # splits[0] is the preamble (production info), then groups of 3: number, title, body
    i = 1
    while i < len(splits) - 2:
        screen_num = int(splits[i])
        screen_title = splits[i + 1].strip()
        screen_body = splits[i + 2].strip()

        # Clean the narration text
        narration = clean_narration(screen_body)

        # Extract word count if present
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
    """Remove markdown formatting, beat markers, and metadata from narration text."""
    # Remove word count / timing lines
    text = re.sub(r'\[WORD COUNT:.*?\]', '', text)
    text = re.sub(r'\[AUDIO FILE:.*?\]', '', text)

    # Remove beat/pause markers but keep as natural pauses (replaced with periods)
    text = re.sub(r'\(Beat[^)]*\)', '', text)
    text = re.sub(r'\(Pause[^)]*\)', '', text)

    # Remove markdown horizontal rules
    text = re.sub(r'^---+\s*$', '', text, flags=re.MULTILINE)

    # Remove any remaining markdown headers within the body
    text = re.sub(r'^#+\s+', '', text, flags=re.MULTILINE)

    # Clean up extra whitespace
    text = re.sub(r'\n{3,}', '\n\n', text)
    text = text.strip()

    return text


# ---------------------------------------------------------------------------
# ElevenLabs API
# ---------------------------------------------------------------------------

def elevenlabs_list_voices(api_key: str) -> list[dict]:
    """List available ElevenLabs voices."""
    resp = requests.get(
        "https://api.elevenlabs.io/v1/voices",
        headers={"xi-api-key": api_key},
    )
    resp.raise_for_status()
    voices = resp.json().get("voices", [])
    return [{"name": v["name"], "voice_id": v["voice_id"], "category": v.get("category", "")} for v in voices]


def elevenlabs_get_voice_id(api_key: str, voice_name: str) -> str:
    """Get voice ID by name."""
    voices = elevenlabs_list_voices(api_key)
    for v in voices:
        if v["name"].lower() == voice_name.lower():
            return v["voice_id"]
    available = ", ".join(v["name"] for v in voices[:20])
    raise ValueError(f"Voice '{voice_name}' not found. Available: {available}")


def elevenlabs_generate(api_key: str, voice_id: str, text: str, output_path: Path) -> None:
    """Generate audio using ElevenLabs API."""
    resp = requests.post(
        f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}",
        headers={
            "xi-api-key": api_key,
            "Content-Type": "application/json",
        },
        json={
            "text": text,
            "model_id": "eleven_multilingual_v2",
            "voice_settings": {
                "stability": 0.5,
                "similarity_boost": 0.75,
                "style": 0.3,
                "use_speaker_boost": True,
            },
        },
    )
    resp.raise_for_status()
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "wb") as f:
        f.write(resp.content)


# ---------------------------------------------------------------------------
# MiniMax API
# ---------------------------------------------------------------------------

def minimax_generate(api_key: str, group_id: str, text: str, output_path: Path, voice: str = "default") -> None:
    """Generate audio using MiniMax T2A API."""
    resp = requests.post(
        f"https://api.minimax.chat/v1/t2a_v2?GroupId={group_id}",
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        json={
            "model": "speech-01-turbo",
            "text": text,
            "stream": False,
            "voice_setting": {
                "voice_id": voice,
                "speed": 1.0,
                "vol": 1.0,
                "pitch": 0,
            },
            "audio_setting": {
                "sample_rate": 44100,
                "bitrate": 128000,
                "format": "mp3",
            },
        },
    )
    resp.raise_for_status()
    result = resp.json()

    # MiniMax returns audio as base64 or URL depending on version
    if "audio_file" in result.get("data", {}):
        audio_url = result["data"]["audio_file"]
        audio_resp = requests.get(audio_url)
        audio_resp.raise_for_status()
        output_path.parent.mkdir(parents=True, exist_ok=True)
        with open(output_path, "wb") as f:
            f.write(audio_resp.content)
    elif "data" in result and "audio" in result["data"]:
        import base64
        audio_bytes = base64.b64decode(result["data"]["audio"])
        output_path.parent.mkdir(parents=True, exist_ok=True)
        with open(output_path, "wb") as f:
            f.write(audio_bytes)
    else:
        raise ValueError(f"Unexpected MiniMax response format: {json.dumps(result, indent=2)[:500]}")


# ---------------------------------------------------------------------------
# SRT Caption Generation
# ---------------------------------------------------------------------------

def generate_srt(text: str, output_path: Path, words_per_minute: int = 150) -> None:
    """Generate a simple SRT caption file from narration text."""
    sentences = re.split(r'(?<=[.!?])\s+', text)
    srt_entries = []
    current_time = 0.0

    for i, sentence in enumerate(sentences, 1):
        word_count = len(sentence.split())
        duration = (word_count / words_per_minute) * 60  # seconds
        duration = max(duration, 1.5)  # minimum 1.5 seconds per caption

        start = format_srt_time(current_time)
        end = format_srt_time(current_time + duration)

        srt_entries.append(f"{i}\n{start} --> {end}\n{sentence.strip()}\n")
        current_time += duration

    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        f.write("\n".join(srt_entries))


def format_srt_time(seconds: float) -> str:
    """Format seconds as SRT timestamp: HH:MM:SS,mmm"""
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    millis = int((seconds % 1) * 1000)
    return f"{hours:02d}:{minutes:02d}:{secs:02d},{millis:03d}"


# ---------------------------------------------------------------------------
# Transcript Generation
# ---------------------------------------------------------------------------

def generate_transcript(screens: list[dict], output_path: Path, guide_number: int) -> None:
    """Generate a plain-text transcript from all screen narrations."""
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(f"TRANSCRIPT — Guide {guide_number:02d}\n")
        f.write(f"Accessibility First Course Series | University Health Network\n")
        f.write("=" * 60 + "\n\n")

        for screen in screens:
            f.write(f"[Slide {guide_number}.{screen['screen_number']}] {screen['title']}\n")
            f.write("-" * 40 + "\n")
            f.write(screen["narration"] + "\n\n")

        total_words = sum(s["word_count"] for s in screens)
        total_time = total_words / 150
        f.write("=" * 60 + "\n")
        f.write(f"Total words: {total_words}\n")
        f.write(f"Estimated duration: {int(total_time)} minutes {int((total_time % 1) * 60)} seconds\n")


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(description="Generate voice-over audio for UHN Accessibility First courses")
    parser.add_argument("--guide", type=int, required=True, help="Guide number (1-18)")
    parser.add_argument("--provider", choices=["elevenlabs", "minimax"], default="elevenlabs", help="TTS provider")
    parser.add_argument("--voice", type=str, default="Rachel", help="Voice name (ElevenLabs) or voice ID (MiniMax)")
    parser.add_argument("--screen", type=int, default=None, help="Generate audio for a single screen only")
    parser.add_argument("--list-voices", action="store_true", help="List available voices (ElevenLabs only)")
    parser.add_argument("--captions-only", action="store_true", help="Generate SRT captions only, no audio")
    parser.add_argument("--transcript-only", action="store_true", help="Generate transcript only, no audio")
    parser.add_argument("--dry-run", action="store_true", help="Parse and show screens without generating audio")
    args = parser.parse_args()

    # Validate guide number
    if args.guide not in GUIDE_FOLDERS:
        print(f"Error: Guide {args.guide} not found. Valid: 1-18")
        sys.exit(1)

    guide_folder = BUILD_OUTPUT / GUIDE_FOLDERS[args.guide]
    narration_dir = guide_folder / "06-audio-narration"
    narration_file = narration_dir / f"NARRATION-SCRIPTS-GUIDE-{args.guide:02d}.md"

    if not narration_file.exists():
        print(f"Error: Narration file not found: {narration_file}")
        sys.exit(1)

    # Parse narration scripts
    screens = parse_narration_file(narration_file)
    print(f"Parsed {len(screens)} screens from Guide {args.guide:02d}")

    # Filter to single screen if specified
    if args.screen:
        screens = [s for s in screens if s["screen_number"] == args.screen]
        if not screens:
            print(f"Error: Screen {args.screen} not found in narration file")
            sys.exit(1)

    # Dry run — just show what would be generated
    if args.dry_run:
        for s in screens:
            print(f"  Screen {s['screen_number']:2d} | {s['title'][:40]:<40} | {s['word_count']:3d} words | voiceover_{args.guide}.{s['screen_number']}.mp3")
        total = sum(s["word_count"] for s in screens)
        print(f"\n  Total: {total} words, ~{total // 150} min {(total % 150) * 60 // 150} sec")
        return

    # Generate transcript
    if args.transcript_only or not args.captions_only:
        transcript_path = narration_dir / "transcript" / f"TRANSCRIPT-GUIDE-{args.guide:02d}.txt"
        generate_transcript(screens, transcript_path, args.guide)
        print(f"Transcript saved: {transcript_path}")
        if args.transcript_only:
            return

    # List voices (ElevenLabs)
    if args.list_voices:
        if args.provider != "elevenlabs":
            print("--list-voices is only supported for ElevenLabs")
            sys.exit(1)
        api_key = os.environ.get("ELEVENLABS_API_KEY")
        if not api_key:
            print("Error: ELEVENLABS_API_KEY not set")
            sys.exit(1)
        voices = elevenlabs_list_voices(api_key)
        print(f"\nAvailable ElevenLabs voices ({len(voices)}):\n")
        for v in voices:
            print(f"  {v['name']:<30} {v['category']:<15} {v['voice_id']}")
        return

    # Generate audio
    if not args.captions_only:
        if args.provider == "elevenlabs":
            api_key = os.environ.get("ELEVENLABS_API_KEY")
            if not api_key:
                print("Error: ELEVENLABS_API_KEY not set. Add it to .env or export it.")
                sys.exit(1)
            voice_id = elevenlabs_get_voice_id(api_key, args.voice)
            print(f"Using ElevenLabs voice: {args.voice} ({voice_id})")

        elif args.provider == "minimax":
            api_key = os.environ.get("MINIMAX_API_KEY")
            group_id = os.environ.get("MINIMAX_GROUP_ID")
            if not api_key or not group_id:
                print("Error: MINIMAX_API_KEY and MINIMAX_GROUP_ID must be set")
                sys.exit(1)

    for screen in screens:
        audio_filename = f"voiceover_{args.guide}.{screen['screen_number']}.mp3"
        audio_path = narration_dir / "audio" / audio_filename
        srt_filename = f"voiceover_{args.guide}.{screen['screen_number']}.srt"
        srt_path = narration_dir / "captions" / srt_filename

        # Generate SRT caption
        generate_srt(screen["narration"], srt_path)
        print(f"  Caption: {srt_filename}")

        # Generate audio
        if not args.captions_only:
            print(f"  Generating: {audio_filename} ({screen['word_count']} words, ~{screen['word_count'] * 60 // 150}s)...")

            try:
                if args.provider == "elevenlabs":
                    elevenlabs_generate(api_key, voice_id, screen["narration"], audio_path)
                elif args.provider == "minimax":
                    minimax_generate(api_key, group_id, screen["narration"], audio_path, voice=args.voice)
                print(f"  ✓ Saved: {audio_path}")
            except requests.exceptions.HTTPError as e:
                print(f"  ✗ API error on screen {screen['screen_number']}: {e}")
                print(f"    Response: {e.response.text[:300]}")
            except Exception as e:
                print(f"  ✗ Error on screen {screen['screen_number']}: {e}")

    # Summary
    total_words = sum(s["word_count"] for s in screens)
    print(f"\nDone! Generated {len(screens)} audio files for Guide {args.guide:02d}")
    print(f"Total narration: {total_words} words, ~{total_words // 150} min {(total_words % 150) * 60 // 150} sec")
    print(f"\nFiles in: {narration_dir}/audio/")
    print(f"Captions in: {narration_dir}/captions/")


if __name__ == "__main__":
    main()
