# UHN Accessibility First — eLearning Course Series

An 18-guide eLearning course on disability inclusion and accessible service for **University Health Network (UHN)** staff. Built with an AI-native production pipeline — no Articulate Storyline needed.

## What This Project Is

UHN is Ontario's largest research hospital network. This course trains all staff to provide accessible, inclusive service to patients and visitors with disabilities — covering vision, hearing, mobility, mental health, neurodiversity, trauma-informed care, Indigenous accessibility, and more.

Every part of production is AI-assisted: content structuring, voiceover generation, quiz design, scenario writing, image prompting, podcast creation, and interactive course building — all orchestrated through Claude Code.

---

## What's Been Done

### Guide 01 — Foundations of Disability Inclusion (85% complete)

A fully interactive HTML5 course, deployed and tested on UHN's LMS (SumTotal):

- **23 interactive slides** with slide-by-slide navigation, side menu, and progress tracking
- **22 voiceover narrations** — generated via ElevenLabs TTS (Danielle, Canadian English) with closed captions synced by word-weighted timing
- **4 branching scenarios** — choose-your-path interactions with feedback overlays (select → submit → lock)
- **3 knowledge checks** — 2-attempt quizzes with scoring, feedback panels, and retry from completion slide
- **Background music** — auto-plays on course start, ducks during voiceover, toggle in control bar
- **Podcast player** — 18-min NotebookLM episode with transcript and listening points
- **My Accessibility Plan (MAP)** — editable action planning activity with branded PDF download
- **Completion certificate** — personalized with learner name, printable
- **SCORM 1.2 package** — deployed to SumTotal MyLearning, all tracking confirmed working (score, completion, bookmark/resume)
- **Welcome dialog** — name + role entry, localStorage resume across sessions
- **WCAG 2.1 AA accessible** — keyboard navigation, ARIA labels, focus management, reduced motion support

### Production Infrastructure

- **7-folder project structure** for organized asset management
- **19 automation scripts** — Word conversion, image generation, audio, PPT, captions, podcast packaging
- **10 AI prompt templates** — storyboard, image briefs, audio, video, QA, scenarios
- **SCORM packaging workflow** — versioned zips with SumTotal-specific manifest handling
- **Version control** — full Git history, automated cleanup of old versions
- **Notion project tracker** — databases for modules, tasks, and assets

### Modules 02–18 Scaffolded

All 17 remaining guides have folder structures created and source content extracted. Ready for production using the same template as Guide 01.

---

## What's Remaining (Short-Term)

### Guide 01 — Final 15%
- [ ] Generate custom illustrations (16 image prompts ready for GPT Image 2 / NanoBanana)
- [ ] Embed images into course HTML and PPT storyboard
- [ ] QA voiceover files — manual review for pronunciation accuracy
- [ ] Final cross-reference check (storyboard ↔ mockup ↔ narration)
- [ ] SME review and sign-off

### Guides 02 & 03 — Next Up
- [ ] Build Guide 02 (Perceptions, Attitudes, and Barriers) using Guide 01 template
- [ ] Build Guide 03 (Vision Disabilities) using Guide 01 template
- [ ] Validate that the pipeline works repeatably across guides

---

## The 18 Guides

| # | Guide | Status |
|---|-------|--------|
| 01 | Foundations of Disability Inclusion and Accessible Design | **85%** — on LMS, images pending |
| 02 | Perceptions, Attitudes, and Barriers | Scaffolded |
| 03 | Vision Disabilities | Scaffolded |
| 04 | Sensory, Hearing, and Communication Disabilities | Scaffolded |
| 05 | Physical Disabilities and Mobility | Scaffolded |
| 06 | Mental Health Disabilities | Scaffolded |
| 07 | Intellectual, Developmental, and Learning Disabilities | Scaffolded |
| 08 | Non-Visible Disabilities | Scaffolded |
| 09 | Aging, Disability, and Intersectionality | Scaffolded |
| 10 | Engaging with Confidence and Respect | Scaffolded |
| 11 | Service Animals, Guide Dogs, and Non-Service Animals | Scaffolded |
| 12 | Support Persons | Scaffolded |
| 13 | Assistive Devices | Scaffolded |
| 14 | Communication and Information Accessibility | Scaffolded |
| 15 | Neurodiversity and Sensory Regulation | Scaffolded |
| 16 | Trauma-Informed Accessibility | Scaffolded |
| 17 | Accessibility in Crisis Situations and De-escalation | Scaffolded |
| 18 | Indigenous Peoples and Accessibility | Scaffolded |

Each guide targets ~15–20 minutes of seat time.

---

## Roadmap

### Short-Term: Finish UHN Course

Complete Guides 01–03 to full production quality. Validate that the template and pipeline are repeatable, then build all remaining 15 guides.

**What each guide produces:**
- Interactive HTML5 course (23 slides, ~15–20 min)
- 22 voiceover narrations with closed captions
- Branching scenario interactions with custom illustrations
- Knowledge check quizzes with feedback
- NotebookLM podcast episode
- My Accessibility Plan (MAP) activity
- Completion certificate
- SCORM 1.2 package for LMS

### Mid-Term: Course Factory CLI

After 3 guides are proven, wire the existing scripts into an **orchestrator CLI**:

```
course-factory build --source "Guide 03 Draft.docx" --guide 03
```

One command: source doc in → structured interactive SCORM course out. The individual scripts already exist — content extraction, storyboard structuring, quiz generation, image prompting, voiceover generation, SCORM packaging.

### Long-Term: Course Factory OS (SaaS Platform)

The bigger vision — an AI-native eLearning authoring platform that replaces Storyline/Rise:

1. **Service layer** — brand kit system, client intake, automated builds (n8n/Make.com)
2. **Web app** — Next.js + Supabase dashboard, one-click generation, live preview, SME review portal
3. **Full SaaS** — multi-tenant platform where any organization uploads content and gets a polished interactive course with their own branding

The key insight: **the entire traditional pipeline (SME → ID → designer → developer → QA) collapses into one AI-assisted flow.** No Storyline license, no Rise subscription, no months of development per course.

### 10 Reusable Interaction Templates

The entire course engine is built from 10 interaction types that generalize to any eLearning course:

1. **Title slide** — guide title, number, branding
2. **Objectives** — learning outcomes list
3. **Text + Image** — content with illustration
4. **Accordion / Tabs** — expandable content sections
5. **Scenario Branch** — choose-your-path with consequences
6. **Multiple Choice Quiz** — knowledge checks with feedback
7. **Click-to-Reveal** — progressive disclosure interactions
8. **Reflection** — guided self-assessment prompts
9. **Process Steps** — sequential procedures
10. **Summary + Badge** — completion, certificate, MAP download

---

## Folder Structure

```
01-source-content/          → Raw source documents (Word drafts from SMEs)
02-branding-and-style/      → UHN logos, brand templates, canonical mockup HTML
03-supporting-documents/    → Research, references, supporting materials
04-project-starter/         → Production tooling (prompts, scripts, templates)
05-build-output/            → Per-guide output folders
   01-Foundations-.../
      01-source/              Raw source content
      02-production/          Storyboard, assessments, scenarios, narration, podcast, refs
      03-media/               All media (vo/, images/, bgm/, podcast/)
      04-course/current/      LIVE SCORM course (index.html + JS + CSS + media)
      05-releases/            Versioned SCORM zips (v3.0 → v5.0)
06-exports/                 → Exported deliverables
07-archive/                 → Old versions and reference samples
```

## How to View the Course

Open any of these in a browser — no server needed:

- `05-build-output/01-.../04-course/current/index.html` — the SCORM course
- `02-branding-and-style/mockups/Guide01_Storyboard_Mockup_v2.html` — the design mockup

## SCORM & LMS Deployment

Deployed to **UHN MyLearning (SumTotal LMS)** as SCORM 1.2.

- Completion status, quiz scores, and bookmarks all report to LMS
- Auto-sync every 30 seconds + save on page close
- To trigger SumTotal's learner reset prompt: bump `item` and `resource` identifiers in the manifest each release

## Key Design Decisions

- **No Storyline** — pure HTML5/CSS/JS with SCORM wrapper replaces Articulate entirely
- **Two-document system** — Master Word doc (internal) generates both PPT storyboard (SME review) and HTML course (production)
- **No open-ended questions** — all assessments are selected-response (self-paced, no reviewer)
- **Canadian/Ontario/UHN context** — AODA, Ontario Human Rights Code, UHN policies
- **APA 7 citations** in every guide
- **AI-generated voiceovers** — ElevenLabs TTS, Danielle voice, Canadian English

## Tech Stack

- **Course engine:** HTML/CSS/JS (vanilla, no frameworks)
- **LMS:** SCORM 1.2 on SumTotal MyLearning
- **Voiceover:** ElevenLabs TTS API
- **Images:** GPT Image 2 / NanoBanana / Midjourney
- **Podcast:** Google NotebookLM
- **PPT generation:** pptxgenjs
- **AI orchestration:** Claude Code
- **Project tracking:** Notion
