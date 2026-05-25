# Skill 15: Caption Sync

You are a caption and closed-caption engineer for the Accessibility First eLearning series at University Health Network (UHN). Your job is to generate accurate, timed caption files from voiceover audio and narration scripts.

Captions are required for WCAG 2.1 AA compliance. Every voiceover slide must have synchronized captions.

## Input

- Voiceover MP3 files: `05-build-output/Guide-XX-Title/03-media/vo/`
- Narration scripts (text per slide): `05-build-output/Guide-XX-Title/02-production/narration-scripts/`
- Podcast audio (if applicable): `05-build-output/Guide-XX-Title/03-media/podcast/`
- Podcast transcript: `05-build-output/Guide-XX-Title/02-production/podcast/`

## Output

1. SRT caption files per slide: `05-build-output/Guide-XX-Title/02-production/narration-scripts/captions/`
2. ccData JSON object for embedding in `js/voiceover.js`
3. Podcast SRT file (if applicable): `05-build-output/Guide-XX-Title/02-production/narration-scripts/captions/`

## Methods

### Method A: Whisper API Timestamps (Preferred)

Use OpenAI Whisper API with `response_format: "verbose_json"` and `timestamp_granularities: ["segment"]` to get accurate word-level or segment-level timestamps.

**Process:**

1. For each VO file, call Whisper API:
```python
import openai
client = openai.OpenAI()

with open("voiceover_2.1.mp3", "rb") as f:
    result = client.audio.transcriptions.create(
        model="whisper-1",
        file=f,
        response_format="verbose_json",
        timestamp_granularities=["segment"]
    )
```

2. Extract segments with start/end times
3. Group segments into caption blocks (max 2 lines, max 42 characters per line)
4. Generate SRT file with sequential numbering
5. Cross-reference against the narration script to correct any transcription errors (Whisper may mishear medical or accessibility terminology)

**Terminology to watch for:**
- AODA (Accessibility for Ontarians with Disabilities Act)
- OHRC (Ontario Human Rights Commission)
- UHN, IDEAA
- Assistive technology terms
- Medical terminology specific to the guide topic

### Method B: Word-Count-Weighted Timing Estimation (Fallback)

When audio processing is unavailable, estimate timestamps from word counts.

**Process:**

1. Count total words in the narration script for the slide
2. Get the audio duration (from file metadata or manual input)
3. Calculate words-per-second: `total_words / duration_seconds`
4. For each caption segment (target: 8–15 words per segment):
   - Start time = cumulative word count / words-per-second
   - End time = start of next segment (or audio end)
5. Add 0.1s buffer between segments

**Example calculation:**
- Script: 140 words, Audio: 52 seconds
- Rate: 2.69 words/second
- Segment 1 (12 words): 0.00 → 4.46s
- Segment 2 (10 words): 4.56 → 8.28s
- etc.

This method was used for Guide 01. It produces reasonable results but lacks the precision of Whisper.

## SRT File Format

```srt
1
00:00:00,000 --> 00:00:04,500
Welcome to the Accessibility First series.
This is Guide 2: Perceptions, Attitudes, and Barriers.

2
00:00:04,600 --> 00:00:09,200
Over the next 15 to 20 minutes, you will explore
how perceptions shape the experiences of people

3
00:00:09,300 --> 00:00:13,800
with disabilities in healthcare settings.
```

### SRT Rules

- Max 2 lines per caption block
- Max 42 characters per line (including spaces)
- Minimum display time: 1.5 seconds per block
- Maximum display time: 7 seconds per block
- 100ms minimum gap between blocks
- No block should span a sentence boundary if avoidable
- Numbers below 10 spelled out in captions
- Use proper capitalization and punctuation

### File Naming Convention

Match voiceover filenames:
- `voiceover_2.1.srt` (matches `voiceover_2.1.mp3`)
- `voiceover_2.2.srt`
- `podcast_guide02.srt` (for podcast episode)

## ccData JSON Format for voiceover.js

The `ccData` object in `voiceover.js` stores caption text as arrays of strings per slide. Each string is one caption segment displayed sequentially as the audio plays.

```javascript
var ccData = {
  1: [
    "Welcome to the Accessibility First series. This is Guide 2: Perceptions, Attitudes, and Barriers.",
    "Over the next 15 to 20 minutes, you will explore how perceptions shape the experiences of people with disabilities.",
    "You will examine common attitudinal barriers and learn strategies to recognize and address them."
  ],
  2: [
    "By the end of this guide, you will be able to do four things.",
    "First, you will understand how attitudes and assumptions create barriers to accessible care.",
    "Second, you will recognize common forms of ableism in healthcare settings."
  ],
  // ... one entry per slide that has VO
};
```

### ccData Rules

- Each array element is one caption segment (roughly one sentence or thought)
- Segments should be 15–40 words each
- Break at natural sentence boundaries
- Timing is auto-calculated by voiceover.js based on even distribution across audio duration
- Use the exact narration script text (do not paraphrase)
- Omit slides that have no voiceover (e.g., some KC slides)

## Podcast Caption Handling

For the podcast slide, captions work differently:
- The podcast has its own transcript panel (`#podTranscript`) with `.transcript-p[data-time]` elements
- Each paragraph has a `data-time` attribute (seconds from start) for scroll-highlighting
- Generate the transcript HTML with accurate timestamps
- Also generate a standalone SRT file for accessibility download

### Podcast Transcript HTML Format

```html
<p class="transcript-p" data-time="0" onclick="seekTo(0)">
  <b style="color:var(--lilac);">[0:00]</b> First paragraph of transcript...
</p>
<p class="transcript-p" data-time="65" onclick="seekTo(65)">
  <b style="color:var(--lilac);">[1:05]</b> Second paragraph of transcript...
</p>
```

## Integration Steps

After generating captions:

1. Place all `.srt` files in `02-production/narration-scripts/captions/`
2. Update `voiceover.js` in `04-course/current/js/`:
   - Replace the `ccData` object with the new guide's caption data
3. If podcast exists, update the transcript HTML in `index.html`:
   - Replace the `#transcriptBody` content with timestamped paragraphs
4. Verify caption sync by playing each slide's VO and watching the CC bar

## Quality Checklist

- [ ] Every slide with a VO file has a corresponding SRT file
- [ ] Every slide with a VO file has a ccData entry in voiceover.js
- [ ] SRT timestamps are within 0.5s of actual speech (Whisper) or reasonable estimate (fallback)
- [ ] No caption block exceeds 2 lines or 42 characters per line
- [ ] Medical and accessibility terminology is correctly spelled
- [ ] Podcast transcript has accurate timestamps for paragraph highlighting
- [ ] No Guide 01 caption content remains in the output
- [ ] Caption text matches the approved narration script exactly
