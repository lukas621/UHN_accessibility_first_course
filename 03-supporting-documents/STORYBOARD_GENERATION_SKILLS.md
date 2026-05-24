# Storyboard Generation Skills — UHN Accessibility First Course Series

## Purpose

Define the skills, prompts, and workflows needed to generate production-ready storyboards for all 17 courses in the Accessibility First series. These storyboards will ultimately be exported to PowerPoint and imported into Articulate Storyline 360 for final course build.

---

## Production Chain

```
Source Content (400+ page document)
  ↓
Source Structuring (AI Skill 2 — extract per-guide data)
  ↓
Blueprint Generation (AI Skill 4 + 5 — objectives + architecture)
  ↓
Storyboard Generation (AI Skill 5 — screen-by-screen draft)  ← THIS DOCUMENT
  ↓
Interaction Design (AI Skill 6 — recommend interaction types)
  ↓
Assessment Generation (AI Skill 8 — quiz items per objective)
  ↓
SME Review Package (AI Skill 9 — targeted review questions)
  ↓
Human Review & Editing (ID reviews, edits, approves)
  ↓
PowerPoint Export (1 slide per screen, notes = narration + directions)
  ↓
Storyline 360 Import & Build
```

---

## Skill 1: Course Structure Extraction

### What It Does
Splits the 400+ page source document into 18 individual guide records with structured fields.

### Input
- Full source document text (chunked by guide)

### Output Per Guide
- Guide number and title
- Purpose
- Primary focus
- Learning emphasis
- Core objectives (as written by SME)
- Key themes
- Guiding principles
- Sections with content
- Scenarios
- Reflection questions
- Inclusive practice tips
- Action planning / MAP items
- References
- Indigenous Peoples and Accessibility section (if present)

### Sensitivity Notes
- Preserve original SME language — do not rewrite at this stage
- Flag any content that references specific patients, staff, or locations for de-identification
- Mark Indigenous content sections for cultural safety review

---

## Skill 2: Learning Objective Architecture

### What It Does
Converts SME-written objectives into measurable, Bloom's-aligned course learning objectives (CLOs) and sub-learning outcomes (SLOs).

### Input
- Extracted core objectives from source
- Guide purpose and primary focus

### Output
- 3-5 CLOs per course (measurable verb, condition, criterion)
- 2-3 SLOs per CLO
- Bloom's level for each
- Assessment strategy suggestion per CLO
- Source traceability (which source section each objective derives from)

### Quality Rules
- Every CLO must use a measurable verb (demonstrate, identify, apply, evaluate — not "understand" or "be aware of")
- Every CLO must have at least one assessment item mapped to it
- Objectives must be achievable within the estimated seat time (30-60 min per course)
- Accessibility-specific objectives should reference workplace application, not just knowledge

---

## Skill 3: Storyboard Screen Generation

### What It Does
Generates a screen-by-screen storyboard draft from the blueprint and structured content.

### Target Output Format
Each screen maps to one PowerPoint slide and one Storyline slide.

### Screen Template

| Field | Description | Maps To |
|---|---|---|
| Screen Number | Sequential within course | Slide number |
| Module | Grouping (e.g., "Core Concepts", "Scenario Practice") | Storyline scene |
| Screen Title | Short, learner-facing title | Slide title |
| Screen Purpose | Internal note — what this screen achieves instructionally | Not shown to learner |
| On-Screen Text | What the learner reads | Slide text layer |
| Narration Script | What the learner hears (if VO is used) | Slide notes / audio layer |
| Interaction Type | How the learner engages | Storyline trigger/layer type |
| Visual / Media Direction | What the learner sees | Illustration or media asset reference |
| Assessment / Reflection | Quiz item or reflection prompt on this screen | Storyline quiz slide or text input |
| Performance Support Note | Job aid, checklist, or downloadable linked here | Storyline resource tab or download trigger |
| SME Review Level | low / medium / high / critical | Flags for SME review package |
| Accessibility Note | Screen-specific accessibility consideration | Alt text, tab order, caption notes |
| Status | Draft / Ready for SME / Approved / etc. | Tracking |

### Standard Course Screen Flow

Every course in the series should follow this approximate structure (10-18 screens):

```
Screen 1:  Welcome & Course Purpose (static or light animation)
Screen 2:  Learning Objectives (static)
Screen 3:  Why This Matters in Healthcare (context/stats — static or short video)
Screen 4:  Core Concept 1 (click-reveal or tabs)
Screen 5:  Core Concept 2 (click-reveal, accordion, or hotspot)
Screen 6:  Accessibility Decision Path — Applied (step interaction — reusable template)
Screen 7:  Scenario 1 (decision branch — 2-3 choices with feedback)
Screen 8:  Scenario 2 (decision branch)
Screen 9:  Knowledge Check 1 (MC or MS quiz)
Screen 10: Knowledge Check 2 (scenario-based quiz)
Screen 11: Inclusive Practice Tips (card reveal or carousel)
Screen 12: Reflection Prompt (text input or guided reflection)
Screen 13: MAP Action Planning (interactive template — downloadable)
Screen 14: Key Takeaways (summary screen)
Screen 15: Resources & References (resource list with links)
Screen 16: Course Completion (certificate trigger if applicable)
```

### Interaction Type Mapping for Storyline 360

| Interaction Type | Storyline Implementation | Complexity |
|---|---|---|
| static | Single text + image slide | Low |
| click_reveal | Buttons with slide layers | Low-Medium |
| tabs | Tab interaction (buttons + layers) | Medium |
| accordion | Expanding panels (buttons + layers + motion paths) | Medium |
| hotspot | Hotspot markers on image with layer popups | Medium |
| scenario / decision_branch | Branching with variables, triggers, and feedback layers | High |
| knowledge_check | Graded quiz slide (MC, MS, matching, drag-and-drop) | Medium |
| reflection | Text entry slide (ungraded) | Low |
| video | Video embed with player controls + transcript layer | Medium |
| job_aid | Download trigger + lightbox preview | Low |
| step_interaction | Sequential reveal (numbered steps with triggers) | Medium |
| carousel | Prev/next buttons cycling through content layers | Medium |
| drag_and_drop | Drag items to targets with correct/incorrect states | High |
| matching | Drag-and-drop or dropdown matching | High |

---

## Skill 4: Visual Direction Writing

### What It Does
Generates specific visual/media direction for each storyboard screen, aligned with the illustration style system.

### Output Per Screen
- Primary visual element description (what the learner sees)
- Illustration category reference (character, scenario, framework, icon, infographic)
- Asset file name suggestion (following naming convention)
- Alt text draft
- Background/environment description
- Character description (if applicable): role, approximate age, visible disability/device, action/emotion, setting

### Example

```
Screen 7 — Scenario 1: Reception Desk
Primary visual: A healthcare worker at a hospital reception desk, greeting a patient 
who uses a power wheelchair. The worker is leaning slightly forward, making eye 
contact at the patient's level. Another staff member is visible in the background.
Category: scenario illustration
Suggested file: g05-scenario-reception-wheelchair-01.png
Alt text: "A healthcare worker greets a patient using a power wheelchair at a 
hospital reception desk, maintaining eye contact at the patient's seated level."
Background: Hospital reception area, clean and well-lit, UHN brand colors in 
signage and decor.
Characters: 
  - Healthcare worker: female, mid-30s, scrubs, friendly expression, leaning forward
  - Patient: male, 50s, power wheelchair, engaged expression, arriving at desk
```

---

## Skill 5: Narration Script Writing

### What It Does
Generates professional narration scripts for each screen, suitable for voice-over recording or AI TTS.

### Writing Rules
- Plain language (Grade 8-10 reading level)
- Second person ("you") or third person for scenarios
- Active voice
- Short sentences (15-20 words max)
- Avoid jargon — define technical terms on first use
- Conversational but professional tone
- Include pronunciation guides for uncommon terms
- Estimated timing: ~150 words per minute for narration
- Each screen's narration should be 30-90 seconds (75-225 words)

### Script Format
```
[SCREEN 4 — Core Concept: Person-First Language]

(Beat)
Language shapes how we see each other.

When we say "a person with a disability" instead of "a disabled person," 
we put the person first — not the condition.

This is called person-first language. It's a small change in words 
that makes a big difference in respect.

(Pause)
But here's the important part: some people prefer identity-first language — 
like "Deaf person" or "autistic person." That's their choice to make, not ours.

The best approach? Ask. And then follow their lead.

[WORD COUNT: 89 | ESTIMATED TIME: 36 seconds]
```

---

## Skill 6: Assessment Item Generation

### What It Does
Generates quiz items, reflection prompts, and evaluation tools aligned to learning objectives.

### Question Types for Storyline 360

| Type | Storyline Slide Type | Use For |
|---|---|---|
| Multiple choice | Graded MC | Factual recall, concept identification |
| Multiple select | Graded MS | Identifying multiple correct approaches |
| Scenario-based MC | Graded MC with scenario stem | Applied decision-making |
| Reflection prompt | Text entry (ungraded) or survey | Self-assessment, action planning |
| Matching | Drag-and-drop matching | Terminology, framework alignment |
| Drag and drop | Freeform drag-and-drop | Categorization, sequencing |
| Hotspot | Freeform hotspot | Identifying elements in a visual |

### Quality Rules
- Every question must link to a specific CLO
- Distractors must be plausible (common misconceptions, not obviously wrong)
- Feedback must explain WHY the answer is correct/incorrect — not just "Correct!" or "Try again"
- Scenario-based questions should reflect realistic healthcare workplace situations
- Avoid "All of the above" and "None of the above"
- Avoid negative stems ("Which is NOT...") unless testing critical safety knowledge
- Include 3-4 options for MC, 4-6 for MS
- Bloom's level should match the CLO it assesses

### Feedback Template
```json
{
  "correct_feedback": "That's right. [Explain why this is the best approach and reinforce the principle.]",
  "incorrect_feedback": "Not quite. [Explain the misconception and redirect to the correct approach. Reference the relevant concept or principle.]",
  "partial_feedback": "You're on the right track. [Acknowledge what's correct, explain what's missing.]"
}
```

---

## Skill 7: SME Review Question Generation

### What It Does
Generates targeted questions for SME reviewers based on content risk level.

### Risk-Level Routing

| Risk Level | Content Type | Reviewer Role |
|---|---|---|
| Critical | Legal/compliance statements, accessibility legislation, AODA interpretation | Legal, Policy, Accessibility Lead |
| High | Clinical safety, IPAC, Indigenous cultural safety, service animal access rules | Clinical Lead, Indigenous Advisor, Policy |
| Medium | Scenarios, practice tips, terminology, assessment items | Subject Matter Expert |
| Low | General wording, UI labels, interaction structure, generic reflections | Course Owner (or skip) |

### Output Per Item
- Screen number reference
- Content excerpt being reviewed
- Specific question for the SME (not generic "Is this correct?")
- Why SME input is needed
- Suggested reviewer role
- Priority level

### Example
```
Screen 11 — Guide 11: Service Animals
Content: "Under the AODA, service animals are permitted in all areas of a 
healthcare facility that are open to the public, including patient care areas 
where infection control permits."
Question: "Is this statement accurate regarding AODA requirements for service 
animals in patient care areas? Are there specific UHN policies that add 
restrictions beyond the AODA baseline (e.g., ICU, OR, isolation rooms)?"
Why: Legal compliance statement — must reflect current legislation and UHN policy.
Reviewer: Legal + IPAC Lead
Priority: Critical
```

---

## Skill 8: Accessibility QA for Storyboard

### What It Does
Reviews the storyboard for accessibility issues BEFORE it goes to Storyline build.

### Checks
- [ ] Every screen has alt text direction for visual elements
- [ ] Every video/audio screen has caption/transcript plan
- [ ] Interaction types are keyboard-accessible in Storyline
- [ ] Color is not the sole means of conveying information
- [ ] Reading level is appropriate (Grade 8-10)
- [ ] Acronyms are expanded on first use
- [ ] Scenarios use inclusive, respectful language
- [ ] Decision Path framework is accurately represented
- [ ] Focus/tab order is noted for complex interactions
- [ ] Drag-and-drop interactions have keyboard alternatives
- [ ] Timed interactions have pause/extend options noted
- [ ] Learner can navigate non-linearly (Storyline menu enabled)

---

## Skill 9: Series Consistency Check

### What It Does
Compares storyboards across the 18-course series for consistency.

### Checks
- Same screen flow structure (Welcome → Objectives → Content → Scenario → Assessment → MAP → Completion)
- Same interaction patterns for similar content types
- Same terminology for shared frameworks
- Accessibility Decision Path visual and interaction is identical across courses
- Guiding principles presentation is consistent
- MAP activity template is identical
- Narration tone and style is consistent
- Assessment question format is consistent
- Visual style references are consistent

---

## Storyline 360 Build Specifications

### Player Settings
- Sidebar: enabled (menu + resources)
- Menu: show all slides, allow non-linear navigation
- Resources tab: enabled (for job aids, references)
- Glossary: enabled (shared across series)
- Player colors: UHN brand palette
- Font: UHN brand font (from templates)
- Seekbar: enabled for content slides, disabled for quiz slides
- Submit button: quiz slides only
- Volume: visible
- Closed captions: enabled by default

### Slide Properties
- Advance: by user (no auto-advance)
- Revisit: reset to initial state (content slides), resume saved state (quiz slides)

### Accessibility Settings
- Tab order: set for every slide
- Focus order: set for every interactive element
- Alt text: set for every visual element
- Slide titles: meaningful (match screen titles in storyboard)
- Keyboard navigation: enabled
- Screen reader compatibility: test with JAWS and NVDA

### Publishing
- Output: SCORM 2004 3rd Edition or SCORM 1.2 (confirm with LMS admin)
- LMS: confirm target LMS (Brightspace, Canvas, Moodle, or other)
- Tracking: completion + quiz score
- Passing score: confirm with course owner (typically 80%)

---

## Workflow Summary: Storyboard to Storyline

```
1. Run Course Structure Extraction (Skill 1)
   → 18 structured guide records

2. Run Learning Objective Architecture (Skill 2)
   → CLOs and SLOs per guide

3. Run Storyboard Screen Generation (Skill 3)
   → 10-18 screens per guide (180-324 screens total)

4. Run Visual Direction Writing (Skill 4)
   → Illustration briefs per screen

5. Run Narration Script Writing (Skill 5)
   → VO scripts per screen

6. Run Assessment Item Generation (Skill 6)
   → 5-10 assessment items per guide

7. Run SME Review Question Generation (Skill 7)
   → Targeted review package per guide

8. Run Accessibility QA (Skill 8)
   → QA issues flagged before build

9. Human ID Review & Editing
   → Storyboard approved

10. Run Series Consistency Check (Skill 9)
    → Cross-course issues flagged

11. Export to PowerPoint
    → 1 slide per screen, notes contain narration + directions

12. Import PPT into Storyline 360
    → Build interactions, triggers, quizzes, layers

13. Add illustration assets to Storyline
    → From illustration production pipeline

14. Add narration audio
    → From VO recording or AI TTS

15. Publish SCORM package
    → Test in LMS sandbox

16. Accessibility testing
    → Screen reader, keyboard, WCAG 2.1 AA audit
```
