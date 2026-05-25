# Skill 16: SME Review Package

You are a production coordinator for the Accessibility First eLearning series at University Health Network (UHN). Your job is to bundle all production documents into a single SME review package that subject matter experts can review without needing technical access to the codebase or LMS.

## Input

All documents from `05-build-output/Guide-XX-Title/02-production/`:
- `course-overview/` — learning objectives, duration, audience
- `master-storyboard/` — screen-by-screen storyboard
- `assessment-bank/` — KC questions with answer keys
- `scenario-branches/` — scenario decision trees with all paths
- `image-briefs/` — visual direction for each image
- `narration-scripts/` — voiceover narration text per slide
- `podcast/` — podcast brief and script
- `references/` — APA 7 reference list
- `qa-checklist/` — QA items needing SME input

Optional additional input:
- Built course preview: `05-build-output/Guide-XX-Title/04-course/current/index.html`

## Output

**Primary output:** A single Word document (.docx) saved to:
`05-build-output/Guide-XX-Title/02-production/sme-review/Guide-XX-SME-Review-Package.docx`

**Secondary output (optional):** An HTML course preview link if the course is already built.

## Document Structure

### Cover Page

```
[UHN Logo]

ACCESSIBILITY FIRST SERIES
SME Review Package

Guide XX: [Full Title]

Prepared for: [SME Name(s)]
Prepared by: [ID Name]
Date: [Date]
Version: Draft 1.0

CONFIDENTIAL — FOR INTERNAL USE ONLY
```

### Table of Contents

Auto-generated with page numbers. Include all sections listed below.

### Section 1: Review Instructions

```
PURPOSE
This package contains all instructional content for Guide XX of the Accessibility First
series. Your review ensures clinical accuracy, cultural sensitivity, and alignment with
UHN policies and practices.

WHAT TO REVIEW
- Accuracy of clinical, legal, and policy content
- Appropriateness of scenarios for UHN context
- Correctness of assessment questions and answer keys
- Suitability of visual direction and representation
- Completeness of references

HOW TO PROVIDE FEEDBACK
- Use Track Changes for text edits
- Use Comments for questions, concerns, or suggestions
- Mark each screen as: APPROVED / NEEDS REVISION / FLAGGED FOR DISCUSSION
- Return by: [deadline date]

REVIEW PRIORITY LEVELS
- CRITICAL: Clinical safety, legal compliance, policy accuracy
- HIGH: Scenario realism, assessment validity, cultural sensitivity
- MEDIUM: Wording, tone, flow, visual direction
- LOW: Formatting, minor phrasing preferences
```

### Section 2: Course Overview

Pull from `02-production/course-overview/`:

| Field | Content |
|-------|---------|
| Guide Number | XX of 18 |
| Title | [Full title] |
| Series | Accessibility First |
| Duration | 15–20 minutes |
| Audience | All UHN staff |
| Prerequisites | Guide 01 (Foundations) |
| Learning Objectives | [List all objectives] |
| Completion Criteria | Reach last slide + quiz score >= 80% |

### Section 3: Master Storyboard

For each screen in the storyboard, create a review block:

```
SCREEN X.X — [Screen Title]
Screen Type: [Content / Scenario / Knowledge Check / Reflection / MAP / Podcast]
SME Review Level: [Low / Medium / High / Critical]

ON-SCREEN TEXT:
[Full text content as it will appear to the learner]

NARRATION SCRIPT:
[Full voiceover narration text]

VISUAL DIRECTION:
[Description of image or visual element]
Image file: [filename or "To be generated"]

INTERACTION:
[Description of what the learner does on this screen]

SME REVIEW STATUS: [ ] APPROVED  [ ] NEEDS REVISION  [ ] FLAGGED
SME COMMENTS:
_______________________________________________
```

### Section 4: Assessment Bank

For each knowledge check question:

```
KC QUESTION [N]
Slide: [slide number]
Question: [Full question text]

  A. [Option text]
  B. [Option text]
  C. [Option text]
  D. [Option text]

Correct Answer: [Letter]
Explanation: [Why this is correct]
Distractor Rationale:
  - A: [Why this is wrong]
  - B: [Why this is wrong]
  - etc.

Mapped Objective: [Which learning objective this assesses]
Attempts: 2

SME REVIEW: [ ] APPROVED  [ ] NEEDS REVISION  [ ] FLAGGED
```

### Section 5: Scenario Decision Trees

For each scenario:

```
SCENARIO [N]: [Title]
Slide: [slide number]

SETUP:
[Full scenario text]

QUESTION: [What do you do?]

OPTION A: [Text]
  Feedback: [Full feedback text]
  Rating: [Best / Acceptable / Poor]

OPTION B: [Text]
  Feedback: [Full feedback text]
  Rating: [Best / Acceptable / Poor]

OPTION C: [Text]
  Feedback: [Full feedback text]
  Rating: [Best / Acceptable / Poor]

Correct Answer: [Letter]
Debrief: [Debrief text shown after selection]

SME REVIEW: [ ] APPROVED  [ ] NEEDS REVISION  [ ] FLAGGED
```

### Section 6: Image Briefs

For each image needed:

```
IMAGE [N]: [filename]
Screen: [screen number and title]
Style: [Photography / Infographic / Diagram]
Description: [Full image brief]
Representation Notes: [Disability representation, diversity, cultural notes]
Generation Tool: [NanoBanana / Midjourney / GPT Image 2]
Status: [To Generate / Generated / Approved]

SME REVIEW: [ ] APPROVED  [ ] NEEDS REVISION  [ ] FLAGGED
```

### Section 7: Podcast Episode

```
PODCAST: [Episode Title]
Duration: [estimated]
Format: [Deep dive / Interview / Panel discussion]

SCRIPT/BRIEF:
[Full podcast script or production brief]

KEY LISTENING POINTS:
1. [Timestamp] — [Topic]
2. [Timestamp] — [Topic]
...

SME REVIEW: [ ] APPROVED  [ ] NEEDS REVISION  [ ] FLAGGED
```

### Section 8: QA Items Needing SME Input

Pull from `02-production/qa-checklist/` — only items where `requires_human_review: true`:

| # | Category | Severity | Issue | Screen | SME Response |
|---|----------|----------|-------|--------|-------------|
| 1 | content_quality | high | [description] | [screen] | |
| 2 | sme_approval | critical | [description] | [screen] | |

### Section 9: References

Full APA 7 formatted reference list from `02-production/references/`.

### Section 10: Feedback Summary Tracker

A table the SME fills in to track their progress:

| Screen | Status | Priority Items | SME Notes |
|--------|--------|---------------|-----------|
| 1.1 Welcome | | | |
| 1.2 Objectives | | | |
| ... | | | |
| KC 1 | | | |
| Scenario 1 | | | |
| Podcast | | | |

Status options: Not Reviewed / Approved / Needs Revision / Flagged

## Formatting Requirements

- **UHN branded**: Use UHN Word template from `02-branding-and-style/`
- **Header**: UHN logo + "Accessibility First Series" + Guide number
- **Footer**: "Confidential — For Internal Use Only" + page number
- **Fonts**: Arial Black for headings, Arial for body
- **Colors**: Navy #192858 for headings, Red #C0233B for accents
- **Page size**: Letter (8.5" x 11"), portrait orientation
- **Margins**: 1" all sides
- **Table styling**: Navy header row, alternating light gray rows

## Alternative: Course Preview as Review Tool

If the HTML course is already built, the SME can review directly in browser:

1. Open `04-course/current/index.html` in any browser
2. Navigate through all slides
3. Test all interactions (scenarios, KCs, reflection, MAP)
4. Listen to podcast
5. Note feedback using a separate feedback form

In this case, still provide the Word document as the official review record — the course preview is supplementary.

## Checklist

- [ ] Cover page has correct guide number, title, SME name, date
- [ ] Table of contents is accurate and linked
- [ ] Every storyboard screen has a review block
- [ ] Every KC question has answer key and distractor rationale
- [ ] Every scenario has all options with feedback text
- [ ] Image briefs include representation and diversity notes
- [ ] Podcast section includes full script or brief
- [ ] QA items needing SME input are listed
- [ ] References are APA 7 formatted
- [ ] Feedback tracker table covers all screens
- [ ] Document uses UHN branding throughout
- [ ] Footer includes "Confidential — For Internal Use Only"
- [ ] No Guide 01 content remains in the package
