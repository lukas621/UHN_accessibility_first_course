# UHN Accessibility First — eLearning Course Series

An 18-guide eLearning course on disability inclusion and accessible service for **University Health Network (UHN)** staff. Each guide is a ~15–20 minute self-paced module built as an interactive HTML storyboard (designed for eventual import into Articulate Storyline 360 or standalone SCORM delivery).

## What This Project Is

UHN is Ontario's largest research hospital network. This course trains staff to provide accessible, inclusive service to patients and visitors with disabilities — covering everything from vision and hearing disabilities to trauma-informed care and Indigenous accessibility.

The course is being developed using an **AI-native production pipeline** — content authoring, voiceover generation, image prompting, quiz design, and interactive mockups are all orchestrated with AI tooling (Claude, ElevenLabs TTS, GPT Image, NotebookLM podcasts).

## The 18 Guides

| # | Guide | Status |
|---|-------|--------|
| 00 | Series Overview | Draft |
| 01 | Foundations of Disability Inclusion and Accessible Design | **85%** — SCORM v5 on LMS, VO + quizzes + scenarios working, images pending |
| 02 | Perceptions, Attitudes, and Barriers | Draft |
| 03 | Vision Disabilities | Draft |
| 04 | Sensory, Hearing, and Communication Disabilities | Draft |
| 05 | Physical Disabilities and Mobility | Draft |
| 06 | Mental Health Disabilities | Draft |
| 07 | Intellectual, Developmental, and Learning Disabilities | Draft |
| 08 | Non-Visible Disabilities | Draft |
| 09 | Aging, Disability, and Intersectionality | Draft |
| 10 | Engaging with Confidence and Respect | Draft |
| 11 | Service Animals, Guide Dogs, and Non-Service Animals | Draft |
| 12 | Support Persons | Draft |
| 13 | Assistive Devices | Draft |
| 14 | Communication and Information Accessibility | Draft |
| 15 | Neurodiversity and Sensory Regulation | Draft |
| 16 | Trauma-Informed Accessibility | Draft |
| 17 | Accessibility in Crisis Situations and De-escalation | Draft |
| 18 | Indigenous Peoples and Accessibility | Draft |

Guide 01 is the most complete and serves as the template for all other guides.

## Folder Structure

```
01-source-content/          → Raw source documents (Word drafts from subject matter experts)
02-branding-and-style/      → UHN logos, brand templates, and the canonical mockup HTML
   mockups/                 → Interactive HTML storyboard mockups (the design source of truth)
   mockups/vo/              → Voiceover MP3 files
   logos/                   → UHN brand logos
   uhn-templates/           → Official UHN Word/PPT templates
03-supporting-documents/    → Research, references, supporting materials
04-project-starter/         → Production tooling
   prompts/                 → AI skill prompts (audio production, VO QA, etc.)
   scripts/                 → Build scripts (PPT generation, image generation, cleanup)
   templates/               → Storyboard and document templates
05-build-output/            → Per-guide output folders (this is where finished assets live)
   01-Foundations-.../       → Guide 01's full asset package:
      01-source/                Raw source content for this guide
      02-production/            Production assets:
         master-storyboard/       Master Word storyboard (internal)
         assessment-bank/         Quiz questions and knowledge checks
         scenario-branches/       Branching scenario scripts
         image-briefs/            AI image generation prompts + generated images
         narration-scripts/       VO scripts, per-screen text, captions, transcripts
         podcast/                 NotebookLM podcast episode + transcript
         sme-review/              Subject matter expert review materials
         qa-checklist/            Quality assurance checklists
         references/              APA 7 reference lists
         job-aids/                Downloadable job aids / handouts
      03-media/                 All media assets (vo/, images/, bgm/, podcast/)
      04-course/                SCORM course package:
         current/                 LIVE course files (index.html + JS + CSS + media)
         template/                Clean template for new guides
      05-releases/              Versioned SCORM zips (v3.0, v4.0, v5.0)
06-exports/                 → Exported deliverables
07-archive/                 → Archived old versions and reference samples
```

## How to View the Course

The quickest way to see the course in action:

1. Open `05-build-output/01-Foundations-of-Disability-Inclusion-and-Accessible-Design/storyboard/Guide01_Storyboard_Mockup_v2.html` in any web browser
2. Or open the canonical design file at `02-branding-and-style/mockups/Guide01_Storyboard_Mockup_v2.html`

These are self-contained HTML files with embedded CSS/JS — no server needed. They include:
- Slide-by-slide navigation with progress tracking
- Voiceover audio playback with closed captions
- Interactive knowledge check quizzes (select-then-submit, 2 attempts, feedback overlays)
- Downloadable My Accessibility Plan (MAP)
- Podcast player
- Completion certificate

## Key Design Decisions

- **Two-document system**: A Master Word doc (internal, full detail) generates both the PPT storyboard (for SME review) and the HTML mockup (for design/development)
- **All PPT storyboards are 16:9** for Storyline import compatibility
- **No open-ended questions** — all assessments are selected-response (no reviewer available in self-paced format)
- **Canadian/Ontario/UHN context** throughout — references AODA, Ontario Human Rights Code, UHN policies
- **APA 7 citations** in every guide's reference list
- **Voiceovers** generated via ElevenLabs TTS (Danielle voice, Canadian English)

## The Vision — Where This Is Going

This project started as a single UHN training course, but the bigger idea is to build an **AI-native course authoring platform** that replaces traditional tools like Articulate Storyline entirely.

### The Core Insight

The traditional eLearning pipeline is slow and expensive: SME writes content → instructional designer restructures it → graphic designer makes visuals → developer builds it in Storyline → QA → publish. Each guide takes weeks.

With AI, the entire pipeline can be collapsed: raw SME content goes in, and a structured interactive SCORM course comes out — with voiceover, quizzes, scenarios, illustrations, and a podcast episode. Guide 01 already proves this works end to end.

### Phase 1 — Finish the UHN Course (Now)

Complete 3 guides (Guide 01, 02, 03) to full production quality using the current AI-assisted workflow. This validates the template and proves the pipeline works repeatably. Guide 01 is nearly done — SCORM package, voiceovers, quizzes, scenarios, podcast all working. Each remaining guide follows the same 13-folder asset structure.

**What each guide produces:**
- Interactive HTML5 course (23 slides, ~15-20 min)
- 22 voiceover narrations with closed captions
- Branching scenario interactions with custom illustrations
- Knowledge check quizzes with feedback
- NotebookLM podcast episode
- My Accessibility Plan (MAP) activity
- Completion certificate
- SCORM 1.2 package ready for LMS upload

### Phase 2 — CLI Pipeline (After 3 Guides)

Turn the collection of scripts and prompts into an **orchestrator CLI** that chains them together. One command to go from source document to finished SCORM package:

```
course-factory build --source "Guide 03 Draft.docx" --guide 03
```

This means scripting the steps that are currently manual: content extraction → storyboard structuring → quiz generation → image prompt generation → voiceover generation → SCORM packaging. The individual scripts already exist in `04-project-starter/scripts/` — they just need to be wired together.

### Phase 3 — Service-Ready Workflow

Wrap the CLI in an automation layer (n8n or Make.com) with:
- A **brand kit system** so other organizations (not just UHN) can use their own logos, colors, and templates
- A **client intake form** — upload your source docs, pick your brand, get a course
- Webhook-triggered builds

This is where it stops being "my tool" and starts being "a service I can offer."

### Phase 4 — Web Application

Build a lightweight web app (Next.js + Supabase) with:
- Dashboard to manage multiple courses across multiple clients
- One-click course generation from uploaded content
- Live preview of the interactive HTML5 output
- SME review portal where subject matter experts can leave per-screen comments
- Project management module for tracking multi-course programs

### Phase 5 — Full Course Factory OS (SaaS)

The endgame: a multi-tenant SaaS platform where any organization can:
- Upload messy source content and get a polished interactive course
- Customize with their own branding
- Collaborate with SMEs through a built-in review workflow
- Manage entire course libraries
- Export to any LMS via SCORM

The key differentiator: **no Storyline, no Rise, no expensive authoring tools.** The AI does the instructional design, the HTML5 engine delivers the interactivity, and SCORM handles the LMS integration. The entire $3B+ eLearning authoring market is ripe for this.

### 10 Interaction Templates

The entire course series (and future courses) is built from just 10 reusable interaction types:

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

These 10 templates cover every screen in the 18-guide accessibility series and generalize to any eLearning course.

## SCORM & LMS Deployment

The course is deployed to **UHN MyLearning (SumTotal LMS)** as a SCORM 1.2 package.

**Packaging workflow:**
1. Edit course files in `04-course/current/`
2. Bump manifest version + item/resource identifiers in `imsmanifest.xml`
3. Zip from inside `current/` → output to `05-releases/v{VERSION}.zip`
4. Upload to SumTotal → "Replace the Structure" → "Re-Register"

**Key SCORM features working:**
- Completion status reports to LMS
- Quiz score (0–100%) reports to LMS
- Bookmarking / resume across sessions via `cmi.suspend_data`
- Auto-sync every 30 seconds + save on page close

**SumTotal-specific:** Changing `item` and `resource` identifiers in the manifest is required to trigger the "Manifest Change" dialog. Without this, SumTotal silently replaces content with no learner reset prompt.

## Tech Stack

- HTML/CSS/JS — interactive storyboard mockups
- pptxgenjs — PowerPoint generation from storyboard data
- ElevenLabs — text-to-speech voiceover generation
- NotebookLM — podcast episode generation
- Claude — content authoring, code generation, production orchestration
- GPT Image 2 — illustration generation
- SCORM 1.2 — LMS packaging standard
- SumTotal — LMS (UHN MyLearning)
