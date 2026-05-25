# Skill: Audio Production — TTS Generation for Course Narration

## Purpose

Generate voice-over audio files from narration scripts using ElevenLabs API. Each slide gets a dedicated audio file with a consistent naming convention for direct import into Articulate Storyline 360.

## Voice Selection (Confirmed)

- **Voice:** Danielle - Canadian Narrator (ID: `FVQMzxJGPUBtfz1Azdoy`)
- **Model:** `eleven_multilingual_v2`
- **Stability:** 0.5
- **Similarity boost:** 0.75
- **Style:** 0.3
- **Format:** MP3, 44.1 kHz, 128 kbps
- **Method:** Direct REST API call (MCP tool schema doesn't expose text parameter)

## File Naming Convention

```
voiceover_{{guide_number}}.{{screen_number}}.mp3

Examples:
voiceover_1.1.mp3    ← Guide 01, Screen 1 (Welcome)
voiceover_1.2.mp3    ← Guide 01, Screen 2 (Objectives)
voiceover_1.3a.mp3   ← Guide 01, Screen 3A (sub-screen)
voiceover_1.3b.mp3   ← Guide 01, Screen 3B (sub-screen)
...
voiceover_1.19.mp3   ← Guide 01, Screen 19 (Completion)
voiceover_2.1.mp3    ← Guide 02, Screen 1
```

## TTS Text Cleaning (CRITICAL)

The text sent to the TTS engine must be cleaned differently from what displays in closed captions. CC shows the original formatted text. TTS gets cleaned text.

### Rules

| Original text pattern | TTS replacement | Reason |
|---|---|---|
| `—` (em dash, parenthetical: `word — phrase — word`) | `, phrase, ` | Em dashes cause unnatural pauses or mispronunciation |
| `—` (em dash, break: `sentence — continuation`) | `. ` (period + space) | Creates a natural pause instead of weird sound |
| `UHN` | `U.H.N.` | Acronym must be spelled out for clear pronunciation |
| `AODA` | `A.O.D.A.` | Acronym must be spelled out |
| `CLO` | `C.L.O.` | Acronym must be spelled out |
| `(Beat)` / `(Beat — tone description)` | Remove entirely | Stage directions, not spoken text |
| `[WORD COUNT: ...]` | Remove entirely | Metadata, not spoken text |
| `[SCREEN ...]` header | Remove entirely | Section headers, not spoken text |

### Python helper

```python
import re

def clean_for_tts(text):
    """Clean narration text for natural TTS output."""
    # Remove stage directions
    text = re.sub(r'\(Beat[^)]*\)', '', text)
    # Remove metadata lines
    text = re.sub(r'\[WORD COUNT:.*?\]', '', text)
    text = re.sub(r'\[SCREEN.*?\]', '', text)
    # Replace parenthetical em dashes: "word — phrase — word"
    text = re.sub(r'\s—\s([^—]+)\s—\s', r', \1, ', text)
    # Replace remaining em dashes with period for pause
    text = re.sub(r'\s—\s', '. ', text)
    # Spell out acronyms
    text = text.replace('AODA', 'A.O.D.A.')
    text = text.replace('UHN', 'U.H.N.')
    text = text.replace('CLO', 'C.L.O.')
    # Clean up artifacts
    text = text.replace('..', '.')
    text = re.sub(r'  +', ' ', text)
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()
```

## Workflow

1. Parse narration markdown file → extract text per screen
2. **Clean text for TTS** using rules above (keep original for CC)
3. Generate audio per screen via ElevenLabs REST API
4. Save with naming convention to `06-audio-narration/`
5. Copy to mockup `vo/` folder for HTML playback
6. Run VO QA check (see `voiceover-qa-skill.md`)

## Output Locations

```
05-build-output/01-.../06-audio-narration/
├── voiceover_1.1.mp3 through voiceover_1.19.mp3   ← primary storage
├── captions/
│   └── voiceover_1.1.srt through voiceover_1.19.srt
└── transcript/
    └── TRANSCRIPT-GUIDE-XX.txt

02-branding-and-style/mockups/vo/
├── voiceover_1.1.mp3 through voiceover_1.19.mp3   ← for mockup playback
```

## API Call Template

```python
import requests

url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"
headers = {
    "xi-api-key": os.environ['ELEVENLABS_API_KEY'],  # NEVER hardcode
    "Content-Type": "application/json"
}
payload = {
    "text": clean_for_tts(narration_text),
    "model_id": "eleven_multilingual_v2",
    "voice_settings": {
        "stability": 0.5,
        "similarity_boost": 0.75,
        "style": 0.3
    }
}
resp = requests.post(url, headers=headers, json=payload, timeout=120)
```

## Important Notes

- **NEVER hardcode API keys** — always use `os.environ['ELEVENLABS_API_KEY']`
- Add 1-second delay between API calls to avoid rate limiting
- Skip regeneration if file already exists and is > 1KB (unless forced)
- CC display text keeps original formatting (em dashes, proper punctuation)
- Only TTS input text gets cleaned
