# Guide 01 Production Workflow — Complete Trace

How one course guide went from a raw Word document to a deployed SCORM course on the LMS in ~14 hours across 2 days, almost entirely AI-assisted.

---

## The Traditional Way (What This Replaces)

In a typical eLearning production workflow, building one 15-minute course module takes **4-8 weeks** with a team of 4-5 people:

```
SME writes content (1-2 weeks)
  → Instructional designer restructures into storyboard (1 week)
    → Graphic designer creates visuals (1 week)
      → Developer builds in Storyline 360 ($1,399/year license) (1-2 weeks)
        → QA review (3-5 days)
          → Revisions loop (1 week)
            → Export SCORM → Upload to LMS
```

**Cost per module:** ~$15,000-$30,000 (staff time + tools)
**Calendar time:** 4-8 weeks
**People involved:** SME, instructional designer, graphic designer, eLearning developer, QA reviewer

---

## The AI Way (What I Did)

**Cost per module:** ~$50 in API calls (ElevenLabs, OpenAI, Claude)
**Calendar time:** ~14 hours across 2 days
**People involved:** 1 (me + Claude AI)

---

## Step-by-Step: What Actually Happened

### Phase 1 — Input (30 min)

**Step 1: Receive SME source document**
- Input: 400-page Word doc from subject matter expert (all 18 guides in one file)
- This is the only human-written input. Everything else is AI-generated or AI-assisted.

**Step 2: Extract Guide 01 content**
- Tool: Claude AI reads the Word doc, extracts Guide 01's sections
- Output: Structured content in markdown — objectives, key themes, scenarios, references
- Time: ~10 minutes

### Phase 2 — Design System (1 hour)

**Step 3: Establish UHN branding**
- Input: UHN brand guidelines, logo PNGs, Word/PPT templates
- Tool: Manual — collected from UHN internal resources
- Output: Color palette (Navy #192858, Red #C0233B, Cobalt #245BAA), font rules (Arial Black/Arial), logo placement rules

**Step 4: Build interactive HTML mockup (v1)**
- Input: Extracted content + branding
- Tool: Claude AI generates a single self-contained HTML file
- Output: 23-slide interactive course prototype with UHN branding, navigation, progress bar
- Time: ~20 minutes, then iterated rapidly (20+ versions in 2 hours)

### Phase 3 — Content Production (3 hours)

**Step 5: Write master storyboard**
- Input: Extracted source content
- Tool: Claude AI (storyboard-architect skill)
- Output: `MASTER-STORYBOARD-GUIDE-01.md` — 22 screens, 4 learning objectives, screen-by-screen content with interaction types, on-screen text, voiceover direction, image descriptions
- Time: ~15 minutes

**Step 6: Create assessment bank**
- Input: Storyboard + learning objectives
- Tool: Claude AI (qa-checker skill)
- Output: 3 knowledge check questions (MCQ, 2 attempts each, feedback for every option), mapped to specific learning objectives
- Time: ~10 minutes

**Step 7: Write branching scenarios**
- Input: Storyboard + UHN workplace context
- Tool: Claude AI (scenario-branches-generator skill)
- Output: 4 branching scenarios — each with a healthcare situation, 3 response options, consequence feedback for each choice. Scenarios: booking system accessibility, clinic signage, communication checklist, inclusive practice reflection
- Time: ~15 minutes

**Step 8: Write narration scripts**
- Input: Storyboard (on-screen text + context)
- Tool: Claude AI (audio-narration-generator skill)
- Output: 22 narration scripts (~3,077 words total, ~20 min 31 sec), warm conversational Canadian English tone. Each script covers on-screen content plus connective context — not just reading bullets back
- Time: ~15 minutes

**Step 9: Create image briefs**
- Input: Storyboard image descriptions
- Tool: Claude AI (image-briefs-generator skill)
- Output: 16 detailed image generation prompts for GPT Image 2 / NanoBanana / Midjourney, plus WCAG-compliant alt text manifest. Rules: photojournalistic style, Canadian healthcare setting, disability representation, no logos or text overlays
- Time: ~15 minutes

**Step 10: Write podcast source document**
- Input: Guide 01 content, reframed as a narrative feature article
- Tool: Claude AI (notebooklm-podcast-generator skill)
- Output: `PODCAST-SOURCE-GUIDE-01.md` — optimized for NotebookLM's two-host discussion format
- Time: ~10 minutes

**Step 11: Write references**
- Input: Source document citations
- Tool: Claude AI
- Output: APA 7 formatted reference list with Canadian/Ontario-specific sources (AODA, Ontario Human Rights Code, Statistics Canada)
- Time: ~5 minutes

### Phase 4 — Media Production (2 hours)

**Step 12: Generate voiceovers**
- Input: 22 narration scripts, cleaned for TTS (em dashes → commas, acronyms spelled out: UHN → U.H.N., stage directions removed)
- Tool: ElevenLabs API via Python script — Danielle voice (Canadian Narrator), `eleven_multilingual_v2` model
- Output: 22 MP3 files (`voiceover_1.1.mp3` through `voiceover_1.19.mp3` including 1.3a-d), ~20 MB total
- Time: ~20 minutes (API generation + download)
- Cost: ~$5 in ElevenLabs credits

**Step 13: Generate images**
- Input: 16 image prompt files
- Tool: GPT Image 2 (OpenAI API)
- Output: 10 PNG illustrations — hero image, barrier context, 3 impact scenes, practice tips, reflection, 3 scenario scenes
- Time: ~30 minutes
- Cost: ~$10 in OpenAI credits

**Step 14: Generate podcast**
- Input: Podcast source document uploaded to NotebookLM
- Tool: Google NotebookLM (free)
- Output: 18-minute two-host discussion podcast (`Five_words_to_restore_patient_dignity.m4a`, 34 MB)
- Time: ~5 minutes (NotebookLM generates automatically)

**Step 15: Generate captions**
- Input: Narration scripts + voiceover MP3s
- Tool: Python script (caption-sync) + OpenAI Whisper API (for podcast transcription)
- Output: SRT caption files for each voiceover, podcast transcript with timestamps, CC data array for the course engine
- Time: ~15 minutes

**Step 16: Add background music**
- Input: Royalty-free ambient track
- Tool: Manual selection
- Output: `Path_to_Wellness.mp3` — loops during course, auto-ducks to 5% volume during voiceover

### Phase 5 — Course Build (3 hours)

**Step 17: Build SCORM course from mockup**
- Input: Final mockup (design authority) + all media assets
- Tool: Claude AI (html-course-builder skill)
- Output: Refactored the monolithic HTML mockup into a proper SCORM 1.2 package:
  ```
  04-course/current/
    index.html              ← 23-slide course shell
    imsmanifest.xml         ← SCORM 1.2 manifest
    css/course.css          ← All styles
    js/
      welcome-dialog.js     ← Name/role entry, resume
      navigation.js         ← Slides, menu, keyboard, touch
      voiceover.js          ← Audio player, CC engine
      course-tracker.js     ← Quiz scoring, MAP, certificate
      bgm.js                ← Background music
      scormfunctions.js     ← SCORM API wrapper
    media/                  ← All images, VO, BGM, podcast
    assets/                 ← Logos, MAP template
    lms/goodbye.html        ← Exit page
  ```
- Time: ~2 hours (including iterations and bug fixes)

**Step 18: QA and bug fixes**
- Input: Built course
- Tool: Claude AI + manual browser testing
- Fixes: Submit button state management, KC titles, CC overlay pointer events, MAP save wiring, duplicate resume modal, results page design
- Time: ~1 hour

### Phase 6 — Deploy (30 min)

**Step 19: Package SCORM zip**
- Input: `04-course/current/` folder
- Tool: Bash (zip from inside folder so manifest is at root)
- Output: `05-releases/v5.0.zip` (68 MB) with versioned manifest identifiers for SumTotal LMS compatibility
- Time: ~5 minutes

**Step 20: Upload to LMS**
- Input: v5.0.zip
- Tool: Manual upload to UHN MyLearning (SumTotal LMS)
- Output: Course live and deployed. Confirmed: SCORM 1.2 detected, completion status reporting, quiz score reporting (100%), bookmark/resume working
- Time: ~10 minutes

**Step 21: Verify on LMS**
- Tested in incognito mode to bypass cache
- Confirmed: Total score 100%, Grade 100, Status Completed, Time tracked
- SumTotal "Manifest Change" dialog triggered correctly for learner progress reset

---

## What the Final Product Looks Like (Course Features)

A learner opens the course on MyLearning and gets:

1. **Welcome dialog** — enters name and role (stored for certificate)
2. **23 interactive slides** — linear progression with side menu
3. **Voiceover on every slide** — auto-plays with closed captions, play/pause/volume controls
4. **Background music** — ambient track that ducks during narration
5. **4 branching scenarios** — choose a response, see consequences, get feedback
6. **3 knowledge checks** — 2 attempts per question, immediate feedback, 80% to pass
7. **Podcast player** — 18-min episode on slide 20 with transcript
8. **My Accessibility Plan (MAP)** — editable action plan, saves locally, downloadable as branded PDF
9. **Completion certificate** — personalized with learner name, printable
10. **Resume support** — close and come back, pick up where you left off

---

## What the Product Becomes (Course Factory OS)

The workflow above was done manually with Claude Code assistance. The product vision is to automate every step:

### Current State: AI-Assisted Manual Workflow
```
Human uploads Word doc
  → Human tells Claude what to do at each step
    → Claude generates each asset
      → Human reviews and approves
        → Human packages and uploads to LMS
```

### Phase 1: CLI Pipeline (Next)
```
$ course-factory build --source "Guide03.docx" --guide 03

[1/8] Extracting content from source document...
[2/8] Generating storyboard (22 screens)...
[3/8] Creating assessment bank (3 KCs, 4 scenarios)...
[4/8] Writing narration scripts (22 files)...
[5/8] Generating voiceovers via ElevenLabs...
[6/8] Generating images via GPT Image 2...
[7/8] Building HTML5 SCORM course...
[8/8] Packaging v1.0.zip...

Done. Output: 05-build-output/03-Vision-Disabilities/05-releases/v1.0.zip
```

### Phase 2: Web App
```
Browser dashboard:
  [Upload Source Doc]  →  [Select Brand Kit]  →  [Generate Course]
                                                       ↓
  Live preview ← → SME review portal ← → Edit & regenerate
                                                       ↓
                                              [Download SCORM zip]
```

### Phase 3: Full SaaS (Course Factory OS)
```
Any organization signs up:
  → Uploads their content (Word, PDF, any format)
  → Picks their brand (logo, colors, fonts)
  → AI generates complete interactive course
  → SMEs review and comment per-screen
  → One-click export to any LMS (SCORM 1.2 / 2004 / xAPI)
  → Manage course library, track versions, update content

No Storyline. No Rise. No $1,399/year licenses.
No 4-8 week timelines. No team of 5.

One person. One AI. 14 hours. Production-quality course.
```

---

## Cost Comparison

| | Traditional | AI-Assisted (Now) | Course Factory OS (Future) |
|---|---|---|---|
| **Time per module** | 4-8 weeks | ~14 hours | ~30 minutes |
| **People needed** | 4-5 | 1 | 1 |
| **Cost per module** | $15,000-$30,000 | ~$50 (API costs) | ~$20 (API costs) |
| **Tools cost** | Storyline $1,399/yr + stock $300/yr | Claude $200/mo + APIs | SaaS subscription TBD |
| **Output quality** | High (manual polish) | High (AI + human QA) | High (templated + AI QA) |
| **Scalability** | Linear (more people = more cost) | Better (one person, faster) | Exponential (self-serve) |

---

## The 18 Production Skills

Each skill is a structured AI prompt that takes specific inputs and produces specific outputs:

| # | Skill | Input | Output |
|---|---|---|---|
| 1 | guide-replicator | Guide number + title | Folder structure from template |
| 2 | guide-content-extractor | Master Word doc + guide number | Structured markdown content |
| 3 | course-intake | Extracted content | Course overview, objectives, scope |
| 4 | source-structuring | Raw content | Organized sections with metadata |
| 5 | storyboard-architect | Structured content | 22-screen master storyboard |
| 6 | scenario-branches-generator | Storyboard scenarios | 4 branching interactions with feedback |
| 7 | audio-narration-generator | Storyboard text | 22 narration scripts |
| 8 | image-briefs-generator | Storyboard image notes | 16 image prompts + alt text |
| 9 | audio-production | Narration scripts | 22 MP3 voiceovers (ElevenLabs) |
| 10 | voiceover-qa | MP3 files + scripts | QA report, regeneration list |
| 11 | caption-sync | VO files + scripts | SRT captions, CC data array |
| 12 | notebooklm-podcast-generator | Guide content | Podcast source doc for NotebookLM |
| 13 | podcast-production | NotebookLM audio | Transcript, timestamps, listening points |
| 14 | html-course-builder | Mockup + all media | SCORM 1.2 course package |
| 15 | qa-checker | Built course | QA checklist, WCAG audit |
| 16 | sme-review-package | Course + storyboard | SME review package with comments |
| 17 | ppt-storyboard-export | Storyboard | 16:9 branded PPT for external review |
| 18 | scorm-package | Course folder | Versioned zip for LMS upload |

---

## Timeline

```
Day 1 (May 24, 2026) — 8 hours
  00:00  Project setup, branding, first mockup
  01:00  Mockup iterations (20+ versions)
  02:00  Podcast generation, image fixes
  03:00  Voiceover generation (22 files)
  03:30  Full mockup with all interactive features
  04:00  Security fix (API key rotation)

Day 2 (May 25, 2026) — 6 hours
  08:00  SCORM v3 course build (refactor from monolithic HTML)
  10:00  Bug fixes and QA
  11:00  Folder reorganization, skill codification
  11:30  SCORM packaging (v3 → v4 → v5)
  12:00  LMS upload and deployment verified
  12:30  README, Notion update, GitHub push
```
