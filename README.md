# UHN Accessibility First Course Series

AI-powered eLearning production system for the Accessibility First training series at University Health Network (UHN), Toronto, Ontario.

## What This Is

An 18-guide accessibility training course series built as HTML5 SCORM 1.2 packages — no Storyline needed. Each guide is a standalone interactive course (~15-25 minutes) with voiceover, closed captions, branching scenarios, knowledge checks, and a podcast episode.

## Status

| Guide | Status |
|---|---|
| Guide 01: Foundations of Disability, Inclusion & Accessible Design | ✅ Complete — deployed on MyLearning |
| Guides 02-18 | Pending |

## Project Structure

```
01-source-content/          ← Master SME document (400+ pages)
02-branding-and-style/      ← UHN logos, Word templates
03-supporting-documents/    ← Style guides, research, cost comparison
04-project-starter/
  ├── docs/                 ← Product specs (Course Factory OS vision)
  ├── prompts/              ← 18 production skills
  ├── templates/            ← Master storyboard template
  └── scripts/              ← Python/JS automation scripts
05-build-output/
  └── 01-Foundations-.../   ← Guide 01 (complete)
        ├── 01-source/
        ├── 02-production/  ← 13 working document folders
        ├── 03-media/       ← images, vo, bgm, podcast
        ├── 04-course/      ← current/ (SCORM) + template/ (reusable)
        └── 05-releases/    ← v5.0.zip (LMS-ready)
07-archive/                 ← Deprecated files, reference samples
```

## Production Pipeline

18 skills automate the workflow from raw SME content to LMS-ready SCORM:

```
guide-replicator → guide-content-extractor → course-intake
  → source-structuring → storyboard-architect
  → scenario-branches → audio-narration → image-briefs
  → audio-production → voiceover-qa → caption-sync
  → podcast → html-course-builder → qa-checker
  → sme-review-package → scorm-package → LMS upload
```

## Course Tech Stack

- **Output**: HTML5 SCORM 1.2
- **Canvas**: 1920 × 1080 (16:9)
- **LMS**: UHN MyLearning (SumTotal)
- **VO**: ElevenLabs (Danielle - Canadian Narrator)
- **Images**: GPT Image 2 / NanoBanana / Midjourney
- **Podcast**: NotebookLM
- **Accessibility**: WCAG 2.1 AA

## Getting Started (New Guide)

1. Run `guide-replicator` skill with guide number and title
2. Run `guide-content-extractor` to parse source doc for that guide
3. Follow the pipeline skill by skill
4. Package with `scorm-package` skill
5. Upload zip to MyLearning

## Future Vision

This production system evolves into **Course Factory OS** — an AI-native course authoring platform that replaces Storyline/Rise 360. See `04-project-starter/docs/` for the full product spec.
