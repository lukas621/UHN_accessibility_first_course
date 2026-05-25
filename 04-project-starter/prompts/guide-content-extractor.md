# Guide Content Extractor

Extract a single guide's content from the master SME source document, analyze it, and generate a master storyboard based on the Guide 01 template.

## Purpose

The SME source document is one massive file (~400+ pages) covering all 18 guides. This skill:
1. Extracts the sections belonging to a specific guide
2. Analyzes the content for instructional design opportunities
3. Generates a new master storyboard following the Guide 01 structure

## Input

- **Source document**: `01-source-content/Accessibility First Guide Series 1 to 18 Draft April 2026 March 2026 Feb 2026 (1).docx` (or paste text)
- **Guide number**: Which guide to extract (02-18)
- **Guide 01 master storyboard**: `05-build-output/01-Foundations-of-Disability-Inclusion-and-Accessible-Design/02-production/master-storyboard/MASTER-STORYBOARD-GUIDE-01.md` (as template)

## Output

- Extracted content saved to: `Guide-XX/01-source/extracted-content.md`
- Analysis saved to: `Guide-XX/02-production/master-storyboard/CONTENT-ANALYSIS-GUIDE-XX.md`
- Master storyboard saved to: `Guide-XX/02-production/master-storyboard/MASTER-STORYBOARD-GUIDE-XX.md`

---

## Step 1: Identify Guide Boundaries

Each guide in the source document follows a repeating pattern. Look for these section headers:

```
Guide [N]: [Title]
Purpose of this Guide
How to Use This Guide
Accessibility Decision Path
Primary Focus
Learning Emphasis
Core Objectives
Accessibility in Practice
Key Themes
Guiding Principles
[Content Sections — varies per guide]
Scenarios for Reflection and Practice
Inclusive Practice Tips
Applying Insights
My Action Planning / MAP Activity
References
```

Extract ALL content between the start of the target guide and the start of the next guide.

## Step 2: Content Analysis

Analyze the extracted content and produce a structured analysis:

### 2A: Content Inventory

```markdown
# Content Analysis — Guide XX: [Title]

## Basic Info
- Guide number: XX
- Title: [from source]
- Primary focus: [from source]
- Learning emphasis: [from source]
- Estimated seat time: 15-20 minutes

## Core Objectives (from source)
1. [CLO 1]
2. [CLO 2]
3. [CLO 3]
4. [CLO 4]

## Content Sections Found
| Section | Word Count | Key Topics | Teachable? |
|---|---|---|---|
| [section name] | ~XXX | [topics] | Yes/Reference only |

## Scenarios Found
| # | Title | Context | Decision Point | Risk Level |
|---|---|---|---|---|
| 1 | [title] | [setting] | [what learner must decide] | Low/Medium/High |

## Reflection/Practice Elements
- Tips found: [count]
- MAP prompts found: [count]
- Discussion questions: [count]

## Key Terminology
- [term 1]: [definition]
- [term 2]: [definition]

## Canadian/Ontario/UHN Context
- Legislation referenced: [AODA, OHRC, etc.]
- UHN-specific policies: [list]
- Ontario-specific context: [list]

## Gaps & SME Questions
- [what's missing or unclear]
- [what needs SME verification]
```

### 2B: Instructional Design Opportunities

Identify which interaction types from Guide 01 fit this content:

| Content Pattern | Suggested Interaction | Guide 01 Reference |
|---|---|---|
| Multiple related concepts | Tabbed panels (slide 7) | Models of Disability |
| Framework/model | Click-to-expand quadrant (slide 8) | Accessibility in Practice |
| Sequential process | Step-through stepper (slide 9) | Decision Path |
| Real-world dilemma | Branching scenario (slides 10-12) | 3-choice with debrief |
| Factual recall | Knowledge check MC (slides 13-15) | 2 attempts, feedback |
| List of tips | Card carousel/flip cards (slide 16) | Inclusive Practice Tips |
| Personal application | Reflection text entry (slide 17) | Submit reflection |
| Action commitment | MAP activity (slide 18) | Stop/Start/Continue |
| Audio deep-dive | Podcast player (slide 20) | NotebookLM episode |

## Step 3: Generate Master Storyboard

Use the Guide 01 master storyboard as the structural template. The new guide MUST follow the same slide pattern:

### Required Slide Structure (match Guide 01)

```
Slide 1:  Title/Welcome — guide title, hero image, "Begin" button
Slide 2:  Learning Objectives — 4 CLOs in cards
Slide 3:  Why This Matters — key statistic or hook
Slides 4-6: Impact/Context — 3 content slides building the case
Slide 7:  Core Concepts — tabbed or accordion (main framework)
Slide 8:  Model/Framework — interactive diagram
Slide 9:  Decision Path/Process — step-through
Slides 10-12: Scenarios (3) — branching choices with debrief
Slides 13-15: Knowledge Checks (3) — MC with 2 attempts
Slide 16: Inclusive Practice Tips — cards or carousel
Slide 17: Reflection Prompt — text entry + submit
Slide 18: MAP Action Planning — Stop/Start/Continue
Slide 19: Key Takeaways — summary
Slide 20: Podcast — NotebookLM audio + transcript
Slide 21: Additional Activity — scenario or interactive (varies)
Slide 22: Series Progress Map — 18-guide visual
Slide 23: Resources & Completion — badge, references, exit
```

**Total: 23 slides** (can vary slightly — some guides may need 21-25 depending on content depth)

### Storyboard Format

For each slide, produce:

```markdown
## Screen X.Y: [Title]

**Slide type:** [title | objectives | content | tabs | stepper | scenario | kc | reflection | map | podcast | completion]
**Interaction:** [what the learner does]

### On-Screen Text
[The visible text on this slide]

### Narration Script
[What the voiceover says — covers on-screen text + connective context]

### Visual/Media Direction
[Image description, layout notes, which photo to generate]

### Assessment/Interaction Details
[For scenarios: choices A/B/C with feedback for each]
[For KC: question, 4 options, correct answer, feedback]
[For tabs: tab labels and content per tab]

### Accessibility Notes
[Alt text needs, keyboard interaction, screen reader considerations]

### SME Review Flag
[HIGH/MEDIUM/LOW — what needs SME verification]
```

## Step 4: Consistency Check

Before finalizing, verify:

- [ ] All 4 CLOs are addressed by at least one screen
- [ ] Each CLO is assessed by at least one KC or scenario
- [ ] 3 scenarios with realistic UHN/healthcare context
- [ ] 3 knowledge checks covering different objectives
- [ ] Canadian/Ontario legislation referenced where relevant
- [ ] Person-first and identity-first language used correctly per UHN policy
- [ ] Accessibility Decision Path referenced (series-wide framework)
- [ ] "Accessibility in Practice" model referenced (series-wide framework)
- [ ] MAP activity prompts are specific to this guide's topic
- [ ] References are APA 7 format
- [ ] Word count per narration script: aim for 100-200 words per slide
- [ ] Total estimated narration: ~3,000 words (~20 minutes)

## Step 5: Output Files

Save three files:

1. `01-source/extracted-content.md` — raw extracted text from source doc
2. `02-production/master-storyboard/CONTENT-ANALYSIS-GUIDE-XX.md` — the analysis from Step 2
3. `02-production/master-storyboard/MASTER-STORYBOARD-GUIDE-XX.md` — the 23-slide storyboard from Step 3

## Quality Rules

- **UHN branding**: all narration uses "at UHN" / "our patients" / "our colleagues" language
- **No open-ended text entry** that requires review — reflection is private, MAP is self-directed
- **Person-first language default**, with identity-first where appropriate (e.g., "Deaf community")
- **Canadian context**: reference AODA, OHRC, Ontario Building Code, Canadian Human Rights Act where relevant
- **Consistent terminology**: use the same terms established in Guide 01 (e.g., "Accessibility Decision Path", "Accessibility in Practice model")
- **Image briefs**: every slide with a photo needs an image brief (no logos, no text in images)
- **Narration**: conversational but professional, matches Danielle voice style from Guide 01
