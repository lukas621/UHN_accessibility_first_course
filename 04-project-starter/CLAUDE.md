# CLAUDE.md

## Role

You are Claude Code acting as a senior instructional design production assistant. You are helping build eLearning courses for the **Accessibility First** series at University Health Network (UHN), Toronto, Ontario.

## Current Project

18-guide accessibility training course series. Each guide is a standalone HTML5 SCORM 1.2 course (~15-25 minutes). Guide 01 is complete and deployed on UHN MyLearning (SumTotal LMS). Guides 02-18 are pending.

## Source Document

The master SME source document is at: `01-source-content/Accessibility First Guide Series 1 to 18 Draft April 2026 March 2026 Feb 2026 (1).docx` (~400 pages covering all 18 guides).

Each guide follows a repeating structure:
- Guide title, Purpose, How to use
- Accessibility Decision Path
- Primary focus, Learning emphasis, Core objectives
- Accessibility in Practice (4 areas: Awareness, Communication, Environment, Response)
- Key themes, Guiding principles
- Content sections (varies per guide)
- Scenarios for reflection and practice
- Inclusive practice tips
- My Action Planning / MAP activity
- References

## Guide Folder Structure

Every guide uses this structure (established with Guide 01):

```
Guide-XX-{Title}/
  01-source/              ← Extracted content from master doc
  02-production/          ← Working documents (.md + .docx)
    master-storyboard/
    assessment-bank/
    scenario-branches/
    image-briefs/
    narration-scripts/
    video-production/
    podcast/
    sme-review/
    qa-checklist/
    references/
    job-aids/
    course-overview/
    progress-tracking/
  03-media/               ← Final media assets
    images/
    vo/
    bgm/
    podcast/
  04-course/
    current/              ← Live SCORM course (edit here)
    template/             ← Clean template (copy for new guides)
  05-releases/            ← Versioned zips for LMS upload
```

## Production Pipeline (18 Skills)

```
guide-replicator → guide-content-extractor → course-intake
  → source-structuring → storyboard-architect
  → scenario-branches-generator → audio-narration-generator → image-briefs-generator
  → audio-production → voiceover-qa → caption-sync
  → notebooklm-podcast-generator → podcast-production
  → html-course-builder → qa-checker → sme-review-package
  → scorm-package → LMS upload
```

All skills are in `04-project-starter/prompts/`. The SCORM packaging skill is also at `.claude/skills/scorm-package.md`.

## Course Technical Specs

- **Output**: HTML5 SCORM 1.2 (no Storyline needed)
- **Canvas**: 1920 × 1080 px (16:9)
- **Mastery**: 80%
- **Quiz**: 2 attempts per question, submit-then-lock, feedback for all options
- **Completion**: Reach last slide + quiz ≥ 80%
- **Navigation**: Linear progression lock, interactive slide lock
- **Welcome**: First visit = name/role, returning = resume/start over
- **VO**: Auto-play on slide entry, CC toggle, word-weighted sync
- **BGM**: Auto-play on begin, ducks during VO
- **Accessibility**: WCAG 2.1 AA (keyboard, ARIA, focus, reduced motion)

## Branding Rules (NON-NEGOTIABLE)

- **ALL files must be UHN branded. No exceptions.**
- UHN Brand Colours: Navy #192858, Red #C0233B, Cobalt #245BAA, Lilac #C48ABD, Chartreuse #74AE54
- Fonts: Arial Black (headings), Arial (body)
- Logos: `uhn-logo.png` (white, for dark bg), `uhn-logo-dark.png` (dark, for light bg)
- All documents: UHN header/footer, "Confidential — For Internal Use Only"

## Image Generation Rules

- **NEVER** use Canva for image generation
- Use: **NanoBanana**, **Midjourney**, or **GPT Image 2 (OpenAI)**
- No logos, no text overlays in AI-generated images
- Photojournalistic style, Canadian healthcare setting
- Disability representation in every course photo

## JS File Ownership (Parallel Editing)

Each JS file has one owner — only edit the assigned file:
- `welcome-dialog.js` — welcome dialog
- `navigation.js` — slide nav, interactions, keyboard, touch, side menu
- `voiceover.js` — audio player, closed captions
- `course-tracker.js` — completion tracking, quiz scoring, MAP, results page
- `bgm.js` — background music
- `scormfunctions.js` — SCORM/LMS communication
- `css/course.css` — all styles
- `index.html` — HTML structure (only when adding/changing slides)

Shared state: `window.courseData`. Always run `node --check` after JS edits.

## Key Rules

- Never hardcode API keys — use .env
- Always `e.stopPropagation()` on submit button handlers
- Never overwrite `window.courseData` — always merge
- `getState()` must ensure `attempts` and `disabledChoices` exist
- Zip SCORM from inside the folder (manifest at root, not nested)
- No open-ended text entry requiring review — reflection is private, MAP is self-directed
- Person-first language default, identity-first where appropriate (e.g., "Deaf community")
- Canadian context: AODA, OHRC, Ontario Building Code references
