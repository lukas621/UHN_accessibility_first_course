# Skill: Voiceover QA — Listen and Verify Each Slide VO

## Purpose

Systematically QA every generated voiceover file to catch TTS artifacts, mispronunciations, timing issues, and sync problems before final build. Compare audio against narration scripts and CC display text.

## When to Use

- After generating VO audio for any guide
- After regenerating files with cleaned TTS text
- Before marking VO as "complete" in production status
- When user reports "some slides sound weird"

## QA Checklist Per File

For each `voiceover_X.Y.mp3`:

| Check | What to verify |
|---|---|
| **Plays correctly** | File loads, no corruption, no silence |
| **Pronunciation** | Acronyms (U.H.N., A.O.D.A.) spoken clearly, not as words |
| **No TTS artifacts** | No robotic glitches, stutters, repeated words, or cut-off endings |
| **Natural pacing** | Pauses where expected (between paragraphs), no rushed sections |
| **Em dash handling** | No awkward sounds where em dashes were — should sound like natural commas/pauses |
| **Duration reasonable** | Roughly matches estimated time from narration script (±15%) |
| **CC sync** | Caption segments advance in time with spoken words (word-weighted timing) |
| **Tone appropriate** | Matches script direction (warm for welcome, structured for frameworks, quiet for reflection) |

## QA Process

### Step 1: Automated checks

```python
import os
from mutagen.mp3 import MP3  # pip install mutagen

def check_vo_file(filepath, expected_duration_sec):
    """Basic automated QA for a VO file."""
    issues = []
    
    # File exists and has content
    if not os.path.exists(filepath):
        return ["FILE MISSING"]
    size = os.path.getsize(filepath)
    if size < 1000:
        issues.append(f"TOO SMALL ({size} bytes)")
    
    # Duration check
    try:
        audio = MP3(filepath)
        duration = audio.info.length
        if abs(duration - expected_duration_sec) / expected_duration_sec > 0.25:
            issues.append(f"DURATION OFF: {duration:.0f}s (expected ~{expected_duration_sec}s)")
    except:
        issues.append("CANNOT READ MP3 METADATA")
    
    return issues if issues else ["OK"]
```

### Step 2: Manual listening check

Play each file and note issues. Use this template:

```markdown
## VO QA Report — Guide XX

| Screen | File | Duration | Status | Notes |
|--------|------|----------|--------|-------|
| 1.1 | voiceover_1.1.mp3 | 57s | ✅ OK | |
| 1.2 | voiceover_1.2.mp3 | 47s | ⚠️ FIX | "AODA" read as word, not spelled |
| 1.3A | voiceover_1.3a.mp3 | 33s | ✅ OK | |
```

### Step 3: Fix and regenerate

For files with issues:
1. Identify the problematic text pattern
2. Update the `clean_for_tts()` function if it's a new pattern
3. Regenerate only the affected file(s)
4. Re-check after regeneration

## Common TTS Issues and Fixes

| Issue | Symptom | Fix in TTS text |
|---|---|---|
| Acronym read as word | "UHN" sounds like "uhn" | Replace with `U.H.N.` |
| Em dash sounds weird | Robotic pause or garble | Replace `—` with `, ` or `. ` |
| Number formatting | "27" read oddly | Write out: "twenty-seven" (only if needed) |
| Quoted speech | Tone doesn't shift | Add period before quote for pause |
| Run-on sentence | No breath pause | Break into two sentences with period |
| Name mispronounced | "Okafor" sounds wrong | Add phonetic hint: "Oh-kah-for" |
| Colon after label | "Stop: What is..." reads weird | Replace colon with period |
| List items rushed | Tips 1-5 blur together | Add extra period between items for pause |

## Expected Durations (Guide 01)

| Screen | Words | Expected time |
|--------|-------|---------------|
| 1.1 | 142 | ~57s |
| 1.2 | 117 | ~47s |
| 1.3A | 82 | ~33s |
| 1.3B | 78 | ~31s |
| 1.3C | 79 | ~32s |
| 1.3D | 81 | ~32s |
| 1.4 | 195 | ~78s |
| 1.5 | 189 | ~76s |
| 1.6 | 190 | ~76s |
| 1.7 | 168 | ~67s |
| 1.8 | 120 | ~48s |
| 1.9 | 145 | ~58s |
| 1.10 | 85 | ~34s |
| 1.11 | 58 | ~23s |
| 1.12 | 228 | ~91s |
| 1.13 | 140 | ~56s |
| 1.14 | 160 | ~64s |
| 1.15 | 175 | ~70s |
| 1.16 | 180 | ~72s |
| 1.17 | 152 | ~61s |
| 1.18 | 150 | ~60s |
| 1.19 | 178 | ~71s |

## CC Sync Verification

The mockup uses word-count-weighted timing to sync captions. Verify by:

1. Open mockup in browser
2. Enable CC (should be on by default)
3. Navigate to each slide
4. Watch that caption text changes roughly in time with spoken content
5. If a caption segment appears too early/late, the issue is either:
   - Caption segment has too few/many words relative to its spoken duration
   - Audio has an unexpected pause that throws off proportional timing

**Fix:** Rebalance the `ccData` array in the mockup — split long segments or merge short ones.

## Output

After QA is complete, update the guide status memory to reflect:
- VO QA: complete / issues found
- List any files that need regeneration
- Note any new patterns added to `clean_for_tts()`
