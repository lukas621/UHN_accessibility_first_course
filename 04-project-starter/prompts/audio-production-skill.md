# Skill: Audio Production — TTS Generation for Course Narration

## Purpose

Generate voice-over audio files from narration scripts using MiniMax API or ElevenLabs API. Each slide gets a dedicated audio file with a consistent naming convention for direct import into Articulate Storyline 360.

## File Naming Convention

```
voiceover_{{guide_number}}.{{screen_number}}.mp3

Examples:
voiceover_1.1.mp3    ← Guide 01, Screen 1 (Welcome)
voiceover_1.2.mp3    ← Guide 01, Screen 2 (Objectives)
voiceover_1.3.mp3    ← Guide 01, Screen 3 (Why This Matters)
...
voiceover_1.16.mp3   ← Guide 01, Screen 16 (Resources)
voiceover_2.1.mp3    ← Guide 02, Screen 1
```

## Workflow

1. Parse narration markdown file → extract text per screen
2. Clean text (remove beat/pause markers, word count lines, headers)
3. Generate audio per screen via API
4. Save with naming convention
5. Generate matching SRT caption file per screen
6. Generate combined transcript for the full guide

## Output Files Per Guide

```
06-audio-narration/
├── NARRATION-SCRIPTS-GUIDE-XX.md     ← source scripts (already exists)
├── audio/
│   ├── voiceover_X.1.mp3
│   ├── voiceover_X.2.mp3
│   ├── ...
│   └── voiceover_X.16.mp3
├── captions/
│   ├── voiceover_X.1.srt
│   ├── voiceover_X.2.srt
│   ├── ...
│   └── voiceover_X.16.srt
└── transcript/
    └── TRANSCRIPT-GUIDE-XX.txt       ← full plain-text transcript
```

## Voice Selection Guidelines

### MiniMax API
- Voice: Select a warm, professional, Canadian-neutral English voice
- Speed: 1.0x (natural pace, ~150 WPM)
- Pitch: Normal
- Format: MP3, 44.1 kHz

### ElevenLabs API
- Voice: Select from professional narration voices (e.g., "Rachel", "Adam", or clone a custom voice)
- Stability: 0.5 (balanced — natural variation without instability)
- Similarity boost: 0.75 (clear articulation)
- Style: 0.3 (slight warmth without over-acting)
- Model: eleven_multilingual_v2 (handles Canadian English well)
- Format: MP3, 44.1 kHz

## Usage

Run the Python script with:
```bash
python generate_audio.py --guide 1 --provider elevenlabs --voice "Rachel"
```

Or:
```bash
python generate_audio.py --guide 1 --provider minimax --voice "default"
```
