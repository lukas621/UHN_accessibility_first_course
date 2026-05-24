# QA Checklist -- Guide 01: Foundations of Disability, Inclusion, and Accessible Design

**Course:** UHN Accessibility First Course Series
**Guide:** 01 -- Foundations of Disability, Inclusion, and Accessible Design
**Version:** 1.0
**Date:** 2026-05-23
**QA Reviewer:** [INSERT NAME]
**QA Date:** [INSERT DATE]

---

## Instructions

Complete each item below by marking the checkbox when the criterion is met. Add notes in the "Comments" field for any item that fails or requires follow-up. All Critical and High items must pass before the guide proceeds to pilot.

**Status Key:**
- [x] = Pass
- [ ] = Not yet reviewed / Fail
- N/A = Not applicable to this guide

---

## 1. Accessibility (WCAG 2.1 AA and AODA Compliance)

### 1.1 Text and Visual Content

- [ ] All images have meaningful alt text that conveys the same information as the image (not "image of..." or filename)
- [ ] Decorative images are marked as decorative (empty alt attribute) and do not convey content
- [ ] All charts, graphs, or infographics have text-based equivalents or long descriptions
- [ ] Colour is not used as the only means of conveying information (e.g., "the red items" without another indicator)
- [ ] Text colour contrast meets WCAG 2.1 AA minimum ratio (4.5:1 for normal text, 3:1 for large text)
- [ ] No content relies solely on sensory characteristics (e.g., "click the button on the right" without additional context)

### 1.2 Multimedia

- [ ] All video content has accurate synchronized captions (not auto-generated without review)
- [ ] All audio content has a text transcript available
- [ ] Captions include speaker identification and relevant non-speech audio (e.g., [alarm sounds])
- [ ] Audio descriptions are provided for video content where visual information is not conveyed by the audio track
- [ ] No content auto-plays audio or video without user control

### 1.3 Navigation and Interaction

- [ ] All interactive elements (buttons, links, form fields, drag-and-drop) are operable by keyboard alone
- [ ] Focus order follows a logical reading sequence (left to right, top to bottom in English content)
- [ ] Focus indicators are visible on all interactive elements
- [ ] Skip navigation links are provided where appropriate
- [ ] No keyboard traps exist (user can navigate away from any element using keyboard)
- [ ] Time limits, if any, can be extended or removed by the learner
- [ ] Drag-and-drop interactions have a keyboard-accessible alternative

### 1.4 Document and Content Structure

- [ ] Heading hierarchy is logical and sequential (H1 > H2 > H3; no skipped levels)
- [ ] Lists use proper list markup (not manually formatted with dashes or asterisks in the final build)
- [ ] Data tables have proper header rows/columns and caption/summary
- [ ] Reading order in the built output matches the intended content sequence (verified with screen reader or reading order tool)
- [ ] Language is identified in the document/page metadata (lang="en-CA")

### 1.5 Reading Level

- [ ] Body content is written at or below Grade 10 reading level (Flesch-Kincaid or equivalent)
- [ ] Assessment stems are written at or below Grade 10 reading level
- [ ] Complex or technical terms are defined on first use or in a glossary
- [ ] Sentences average 20 words or fewer; paragraphs are 3-5 sentences maximum

**Accessibility Comments:**

---

## 2. Instructional Design Quality

### 2.1 Learning Objectives and Alignment

- [ ] All 5 CLOs are stated using measurable action verbs (Bloom's taxonomy)
- [ ] Each CLO is assessed by at least one assessment item (verified against Assessment Map Summary)
- [ ] Each assessment item is linked to a specific CLO
- [ ] Bloom's levels are accurately assigned to each assessment item
- [ ] Content coverage aligns with stated CLOs (no content without a CLO; no CLO without content)

### 2.2 Content Chunking and Flow

- [ ] Content is organized into logical sections/chunks of 5-7 minutes of learning time each
- [ ] Each section has a clear purpose statement or advance organizer
- [ ] Transitions between sections are smooth and logical
- [ ] Cognitive load is managed (no section introduces more than 3-4 new concepts)
- [ ] Summary or synthesis activities appear at appropriate intervals

### 2.3 Assessment Design

- [ ] Multiple choice items have exactly 4 options each
- [ ] Multiple choice items have one unambiguously correct answer
- [ ] Multiple select items clearly indicate "select all that apply"
- [ ] All distractors are plausible and represent common misconceptions
- [ ] Feedback is provided for both correct and incorrect responses
- [ ] Feedback explains *why* the answer is correct or incorrect (not just "Correct!" or "Try again")
- [ ] Scenario-based items include clear rubrics with defined performance levels
- [ ] Reflection prompts include facilitator guidance
- [ ] Matching items have clear, unambiguous pairings
- [ ] No assessment item contains unintentional cues to the correct answer (e.g., grammatical consistency, length bias)

### 2.4 Engagement and Interactivity

- [ ] At least one interactive element per major section (scenario, reflection, knowledge check)
- [ ] Scenarios reflect realistic UHN/Toronto healthcare contexts
- [ ] Branching scenarios have clear best/acceptable/poor pathways with distinct consequences
- [ ] Reflection prompts connect to the learner's own role and context (MAP activity)

**Instructional Design Comments:**

---

## 3. Content Quality

### 3.1 Plain Language

- [ ] Content uses active voice predominantly
- [ ] Sentences are direct and concise
- [ ] Instructions use imperative mood ("Select the best answer" not "The learner should select the best answer")
- [ ] Paragraphs begin with the main point
- [ ] No unnecessary nominalizations (e.g., "make a decision" should be "decide")

### 3.2 Acronyms and Terminology

- [ ] All acronyms are spelled out on first use (AODA, OHRC, IASR, WCAG, OHIP, ASL, CLO, MAP, UHN, CRPD)
- [ ] A glossary or reference list is provided for recurring technical terms
- [ ] Medical and legal terminology is explained in plain language when used
- [ ] Terminology is consistent throughout the guide (e.g., do not alternate between "accommodation" and "modification" if the same concept is intended)

### 3.3 Inclusive Language

- [ ] Person-first language is used consistently unless identity-first language is the stated preference of the community (e.g., Deaf community, autistic community)
- [ ] Language choices are explained where conventions may vary (e.g., "Deaf" with capital D)
- [ ] Patient descriptions are respectful and avoid deficit framing or pity narratives
- [ ] Diversity of patient and staff identities is represented across scenarios and examples (age, race, gender, language, disability type)
- [ ] No gendered language is used unnecessarily (e.g., "they" rather than "he or she" for generic references)
- [ ] Indigenous content uses appropriate terminology and has been reviewed by Indigenous Health SME

### 3.4 Accuracy and Currency

- [ ] All APA 7 citations are correctly formatted (author, date, title, source, DOI/URL)
- [ ] All legislative references are current and cite correct sections
- [ ] All URLs in references have been verified as active
- [ ] Statistics and data are from sources published within the last 5 years (or are foundational/seminal works)
- [ ] Content reflects current Ontario/Canadian legislative landscape (post-2025 AODA requirements)

**Content Quality Comments:**

---

## 4. SME Approval

- [ ] SME Review Package (10 questions) has been distributed to identified reviewers
- [ ] All Critical-risk questions (1-3) have received reviewer responses
- [ ] All High-risk questions (4-6) have received reviewer responses
- [ ] Medium and Low-risk questions have been reviewed
- [ ] All conditional approval items have been addressed
- [ ] Reviewer sign-off obtained from at least one reviewer per risk category
- [ ] Indigenous Health SME or Elder has reviewed Scenario 3 (Employee Awareness) and approved the Indigenous patient depiction
- [ ] Legal/Policy SME has confirmed AODA and OHRC interpretations

**SME Approval Comments:**

---

## 5. Media Readiness

### 5.1 Images and Illustrations

- [ ] Image generation prompts have been finalized for all 3 branching scenarios
- [ ] Generated images have been reviewed for inclusive representation (no stereotyping, no pity framing)
- [ ] Images are available in required resolutions for LMS/delivery platform
- [ ] Image file sizes are optimized for web delivery (target: under 500 KB per image)
- [ ] Images do not contain embedded text that would need to be accessible separately

### 5.2 Video and Audio (if applicable)

- [ ] Video scripts have been reviewed and approved
- [ ] Caption files (.srt or .vtt) are prepared for all video content
- [ ] Transcripts are available for all audio content
- [ ] Media player is keyboard-accessible and supports captions

### 5.3 Interactive Elements

- [ ] All branching scenario interactions have been prototyped or wireframed
- [ ] Matching activity (MT-01) has been built and tested in the authoring tool
- [ ] All interactive elements function correctly on desktop and mobile
- [ ] Fallback content is available for any interaction that may not render on all devices

**Media Readiness Comments:**

---

## 6. Series Consistency

### 6.1 Decision Path Framework

- [ ] Guide references the Decision Path framework consistently with the series overview
- [ ] Scenario choices align with the Decision Path quadrant model (best practice / acceptable / poor practice)
- [ ] Debriefs explicitly connect choices to the Decision Path framework
- [ ] Terminology for decision pathways is consistent with other guides in the series

### 6.2 Quadrant Model

- [ ] The quadrant model (if used in this guide) is presented consistently with the series design
- [ ] Axes and labels match the series-wide quadrant model definition
- [ ] Visual representation of the quadrant model is consistent across guides

### 6.3 Guiding Principles

- [ ] All 5 guiding principles referenced in this guide are consistent with the series-wide principle definitions
- [ ] Guiding principles are explicitly connected to scenario debriefs
- [ ] No new or conflicting principles are introduced without series-level approval
- [ ] Principle language matches the series glossary exactly

### 6.4 MAP (My Accessibility Plan) Activity

- [ ] MAP reflection prompts in this guide build logically from the series introduction
- [ ] MAP instructions are consistent with how MAP is described in other guides
- [ ] Facilitator guidance for MAP is provided and consistent with series-wide MAP rubric
- [ ] MAP entries from this guide are designed to be carried forward into subsequent guides

### 6.5 Tone, Voice, and Visual Identity

- [ ] Tone is consistent with the series style guide (professional, approachable, empowering -- not preachy or compliance-driven)
- [ ] Voice is second person ("you") for direct instruction; third person for scenarios
- [ ] Visual identity (colours, fonts, layout) aligns with UHN brand and series design system
- [ ] Header/footer elements match series template

**Series Consistency Comments:**

---

## QA Summary

| Category | Total Items | Pass | Fail | N/A | Notes |
|----------|-------------|------|------|-----|-------|
| 1. Accessibility | 23 | | | | |
| 2. Instructional Design | 18 | | | | |
| 3. Content Quality | 17 | | | | |
| 4. SME Approval | 8 | | | | |
| 5. Media Readiness | 11 | | | | |
| 6. Series Consistency | 14 | | | | |
| **TOTAL** | **91** | | | | |

### Overall QA Status

- [ ] **PASS** -- Guide is ready for pilot/build
- [ ] **CONDITIONAL PASS** -- Guide may proceed with noted items to be addressed before launch
- [ ] **FAIL** -- Guide requires revisions and re-review before proceeding

**QA Reviewer Signature:** ___________________________
**Date:** ___________________________

---

*End of QA Checklist -- Guide 01*
