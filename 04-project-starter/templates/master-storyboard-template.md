# Master Storyboard Template

**Accessibility First Course Series | University Health Network | Toronto, Ontario**

---

# Part 1: Fixed Specifications (DO NOT CHANGE)

These settings are identical across all 18 guides.

## Course Metadata

| Field | Value |
|---|---|
| Series | Accessibility First (18 guides) |
| Organization | University Health Network, Toronto, Ontario |
| Output | HTML5 SCORM 1.2 |
| Canvas | 1920 × 1080 px (16:9) |
| Mastery Score | 80% |
| Target Seat Time | 15–25 minutes |
| Voice | Danielle (Canadian Narrator), ElevenLabs eleven_multilingual_v2 |

## Branding

| Element | Specification |
|---|---|
| Navy | #192858 (primary) |
| Red | #C0233B (accent, CTAs) |
| Cobalt | #245BAA (links, KC) |
| Lilac | #C48ABD (series branding, MAP) |
| Chartreuse | #74AE54 (correct, tips) |
| Navy Deep | #0F1A3D (dark backgrounds) |
| Heading Font | Arial Black |
| Body Font | Arial |
| Logo (dark bg) | assets/uhn-logo.png |
| Logo (light bg) | assets/uhn-logo-dark.png |
| Footer | "Confidential — For Internal Use Only" |

## Learning Objectives Format

Every guide has exactly 4 Course Learning Objectives (CLOs).

- Each CLO starts with a measurable verb (define, identify, apply, demonstrate, explain, describe)
- Each CLO must be assessed by at least one scenario or knowledge check
- Displayed in a 2×2 card grid with navy top border and large number
- CLOs stated on slide 2, reinforced in narration

## Quiz Settings (Knowledge Checks)

| Setting | Value |
|---|---|
| Attempts per question | 2 |
| Attempt 1 wrong | Hint shown, wrong option greyed out, try again |
| Attempt 2 wrong | Lock all options, reveal correct (green), show feedback |
| Correct (any attempt) | Lock immediately, green highlight, show feedback |
| Submit flow | Select option → click "SUBMIT ANSWER" → feedback |
| Button states | Disabled (grey) → Ready (cobalt) → Submitted (navy ✓) |
| Feedback | Show for BOTH correct and incorrect answers |
| Score tracking | window.courseData.quizScore / quizTotal |
| Pass threshold | 80% (e.g., 3/4, 4/5, 2/3) |
| Next button | Locked until answer submitted |

## Scenario Settings (Branching)

| Setting | Value |
|---|---|
| Choices per scenario | 3 (A, B, C) |
| Choice quality | Best response / Acceptable but not best / Poor response |
| Attempts | 2 (same as KC) |
| Submit flow | Select option → click "CONFIRM CHOICE" → feedback overlay |
| Feedback | Debrief shown for chosen option + correct answer if wrong |
| Button states | Same 3-state as KC |
| Next button | Locked until submitted |

## MAP Action Planning

| Setting | Value |
|---|---|
| Fields | 3: STOP (red), START (cobalt), CONTINUE (chartreuse) |
| Input type | contenteditable div with placeholder text |
| Storage | localStorage (guide-specific key) |
| Save | "SAVE MY MAP" button with green flash confirmation |
| Download | Available on completion slide |
| Required for completion | No (optional) |

## Reflection

| Setting | Value |
|---|---|
| Input type | contenteditable div |
| Review | Private — not submitted or reviewed |
| Submit button | "SUBMIT REFLECTION" → green confirmation → advance |
| Next button | Locked until text entered |

## Welcome Dialog

| Setting | Value |
|---|---|
| First visit | Name + role input fields → "BEGIN GUIDE" |
| Returning visit | "Welcome back, [name]" → "RESUME" / "START OVER" |
| Storage | localStorage (guide-specific key) |
| Start over | Clears all progress, reloads page |

## Completion Rules

| Requirement | Required? |
|---|---|
| Reach last slide | Yes |
| Quiz score ≥ 80% | Yes |
| MAP completed | No (optional) |
| All slides visited | No (optional) |

## Navigation

| Feature | Behavior |
|---|---|
| Linear progression | Cannot skip ahead; previous slides always accessible |
| Interactive lock | Next button disabled on scenario/KC/reflection slides until interaction complete |
| Side menu | All slides listed; locked slides greyed with lock icon |
| Warning | Center toast: "Please complete the activity on this slide before continuing." |
| Keyboard | Arrow keys for nav, Enter/Space to activate, Escape to close |
| Touch | Swipe left/right, 48px min targets |

## Voiceover & Captions

| Setting | Value |
|---|---|
| Auto-play | On slide entry (after welcome dialog dismissed) |
| CC | On by default, toggle button, word-weighted sync |
| CC bar | pointer-events: none (never blocks buttons) |
| Player | Play/pause, volume, progress bar, time display |
| Narration style | Covers on-screen text + connective context, not just readback |
| Word count target | 100–200 words per slide, ~3,000 total |

## Accessibility (WCAG 2.1 AA)

| Requirement | Implementation |
|---|---|
| Contrast | 4.5:1 for text, 3:1 for UI elements |
| Focus visible | 3px solid cobalt, offset 2px |
| ARIA | Roles on tabs, radiogroups, live regions, stepper |
| Screen reader | Slide change announcements via aria-live |
| Reduced motion | @media (prefers-reduced-motion: reduce) |
| Alt text | Every image has descriptive alt text |
| Keyboard | Full navigation without mouse |

## Image Rules

| Rule | Detail |
|---|---|
| No logos | Never include UHN logo or any text in AI-generated images |
| No text overlays | All text must be native HTML, not baked into images |
| Style | Photojournalistic, warm, natural lighting |
| Representation | Disability representation in every course photo |
| Context | Canadian healthcare setting |
| Tools | NanoBanana, Midjourney, or GPT Image 2 only (never Canva) |

---

# Part 2: Slide Type Menu (SELECT PER GUIDE)

Choose slide types based on the guide's content. No fixed count — use as many as needed. Target 15–30 slides, 15–25 minutes.

## Required Slides (every guide)

### WELCOME
```markdown
## Screen {{NN}}.1 — Welcome and Course Purpose

| Step | Activities | Design Guide |
|---|---|---|
| Welcome / Introduction | • Course title | Hero photo with disability representation |
| Interaction: Click "Begin" | • Series badge: Guide {{NN}} of 18 | |
| Time: ~1 min | • UHN logo + branding | Image: g{{NN}}-hero-welcome-01.png |
| SME: Low | • "Begin" button | |
| | Narration (~140 words): [Introduce guide topic, connect to series] | |
| | Audio: voiceover_{{NN}}.1.mp3 | |
```

### LEARNING OBJECTIVES
```markdown
## Screen {{NN}}.2 — Learning Objectives

| Step | Activities | Design Guide |
|---|---|---|
| Objectives Overview | 4 CLOs in numbered card grid | 2×2 cards, navy top border |
| Interaction: Static + audio | 1. {{CLO_1}} | |
| Time: ~1 min | 2. {{CLO_2}} | |
| SME: Low | 3. {{CLO_3}} | |
| | 4. {{CLO_4}} | |
| | Narration (~120 words): [Restate CLOs conversationally] | |
| | Audio: voiceover_{{NN}}.2.mp3 | |
```

### MAP ACTION PLANNING
```markdown
## Screen {{NN}}.X — MAP Action Planning

| Step | Activities | Design Guide |
|---|---|---|
| Action Planning | STOP / START / CONTINUE fields | Color-coded: red / cobalt / chartreuse |
| Interaction: 3 text fields + save | Guide-specific prompts | Save button + download note |
| Time: ~3 min | | |
| SME: Low | Narration (~100 words): [Introduce MAP for this topic] | |
| | Audio: voiceover_{{NN}}.X.mp3 | |
```

### COMPLETION
```markdown
## Screen {{NN}}.X — Resources & Course Completion

| Step | Activities | Design Guide |
|---|---|---|
| Completion | Completion status (dynamic) | Two-column: left = status + resources, right = badge |
| Interaction: Badge + buttons | Resources: AODA, OHRC, UHN Policy | |
| Time: ~1 min | Up Next: Guide {{NEXT_NN}} | Buttons: Retry, Action Plan, Badge, Exit |
| SME: Low | | Badge: "Accessibility First: {{SHORT_TITLE}}" |
```

---

## Content Slides (use as needed)

### CONTENT (Static + VO)
```markdown
| Step | Activities | Design Guide |
|---|---|---|
| [Topic] | • H2: "[Title]" | Two-column. Left: photo. Right: accent bar + text. |
| Interaction: Static + audio | • [2-3 key points] | Accent color: [red/cobalt/navy/lilac] |
| Time: ~45s | Narration (~80 words) | Image: g{{NN}}-[name].png |
| SME: [Low/Medium/High] | Audio: voiceover_{{NN}}.X.mp3 | |
```

### STATISTIC / HOOK
```markdown
| Step | Activities | Design Guide |
|---|---|---|
| Context / Statistics | • Key stat: "[XX%...]" | Large stat prominent. Supporting text. |
| Interaction: Static + audio | • Supporting context | Stat coded as text, not image |
| Time: ~45s | Refs: [APA 7 source] | |
| SME: **High** — verify | Narration (~80 words) | |
```

---

## Interactive Slides (use as needed)

### TABS
```markdown
| Step | Activities | Design Guide |
|---|---|---|
| [Concept comparison] | Tab 1: [Label] — [content] | 2-4 tabbed panels |
| Interaction: Click tabs | Tab 2: [Label] — [content] | Keyboard: arrow keys between tabs |
| Time: ~2 min | Tab 3: [Label] — [content] | ARIA: role="tablist" |
| SME: Medium | Narration (~180 words) | |
```

### ACCORDION
```markdown
| Step | Activities | Design Guide |
|---|---|---|
| [Expandable sections] | Section 1: [Label] — [content] | Click header to expand/collapse |
| Interaction: Click to expand | Section 2: [Label] — [content] | aria-expanded toggle |
| Time: ~2 min | Section 3: [Label] — [content] | |
| SME: Medium | Narration (~150 words) | |
```

### STEPPER / PROCESS
```markdown
| Step | Activities | Design Guide |
|---|---|---|
| [Sequential process] | Step 1: [Title] — [description] | Rail with circles, sequential reveal |
| Interaction: Click through steps | Step 2: [Title] — [description] | Active step highlighted (red) |
| Time: ~2 min | Step 3-5: ... | aria-current="step" |
| SME: Low | Narration (~150 words) | |
```

### CLICK-TO-REVEAL
```markdown
| Step | Activities | Design Guide |
|---|---|---|
| [Framework / Model] | Area 1: [Label] — [detail] | 4-quadrant or grid layout |
| Interaction: Click to expand | Area 2: [Label] — [detail] | Click reveals detail panel |
| Time: ~2 min | Area 3-4: ... | Keyboard accessible |
| SME: Low | Narration (~180 words) | |
```

### FLIP CARDS
```markdown
| Step | Activities | Design Guide |
|---|---|---|
| [Myths / Facts / Tips] | Card 1: Front [question] → Back [answer] | 2×2 or 3×2 grid |
| Interaction: Click to flip | Card 2: Front → Back | Click or Enter to flip |
| Time: ~2 min | Card 3-6: ... | |
| SME: Low | Narration (~120 words) | |
```

### CARD GRID (Expandable)
```markdown
| Step | Activities | Design Guide |
|---|---|---|
| [Categories / Types] | Card 1: [Title] — [summary] → [detail on expand] | 2×2 or 3×2 grid |
| Interaction: Click to expand | Card 2: ... | Navy header, white body |
| Time: ~2 min | Card 3-4: ... | |
| SME: Medium | Narration (~150 words) | |
```

### CAROUSEL
```markdown
| Step | Activities | Design Guide |
|---|---|---|
| [Sequential content] | Slide 1: [content] | Prev/next arrows + dot indicators |
| Interaction: Navigate slides | Slide 2: [content] | |
| Time: ~2 min | Slide 3-4: ... | |
| SME: Low | Narration (~120 words) | |
```

### HUB & SPOKE
```markdown
| Step | Activities | Design Guide |
|---|---|---|
| [Central concept + related items] | Hub: [central concept] | SVG diagram with clickable nodes |
| Interaction: Click nodes to expand | Spoke 1: [related item] | Cards expand on click |
| Time: ~2 min | Spoke 2-5: ... | |
| SME: Medium | Narration (~150 words) | |
```

---

## Assessment Slides (use as needed)

### SCENARIO (Branching)
```markdown
| Step | Activities | Design Guide |
|---|---|---|
| Branching Scenario | Scenario: [Setting, character, situation] | Two-column. Left: photo. Right: scenario + options. |
| Interaction: 3-choice branch | Question: "What do you do?" | |
| Time: ~2 min | A: [Best response] | Correct: [letter] |
| SME: **High** | B: [Acceptable] | 2 attempts, submit-then-lock |
| | C: [Poor response] | Feedback for ALL options |
| | Feedback A: [why best] | |
| | Feedback B: [why acceptable but not ideal] | |
| | Feedback C: [why poor + what to do instead] | |
| | Narration (~100 words): [Set the scene] | Image: g{{NN}}-scenario-XX.png |
```

### KNOWLEDGE CHECK (MC)
```markdown
| Step | Activities | Design Guide |
|---|---|---|
| Formative Assessment | Question: [question text] | KC grid: left = question, right = feedback |
| Interaction: MC (2 attempts) | A: [option] | Correct: [letter] |
| Time: ~1 min | B: [option] | 2 attempts |
| SME: Medium | C: [option] | Submit-then-lock |
| | D: [option] | |
| | Correct feedback: [explanation] | |
| | Incorrect feedback: [common misconception] | |
```

---

## Media Slides (use as needed)

### PODCAST
```markdown
| Step | Activities | Design Guide |
|---|---|---|
| Podcast | Audio player + transcript toggle | Navy-deep background |
| Interaction: Play, seek, transcript | 5 listening points with timestamps | |
| Time: ~5-10 min (optional) | Source: [NotebookLM doc] | Generated externally |
```

### VIDEO
```markdown
| Step | Activities | Design Guide |
|---|---|---|
| Video | Embedded video player | 16:9, captions required |
| Interaction: Play/pause | Key takeaway box below | |
| Time: ~2-5 min | Source: [video file] | Alt: audio description track |
```

### REFLECTION
```markdown
| Step | Activities | Design Guide |
|---|---|---|
| Reflection | Prompt: "[guide-specific question]" | Two-column. Left: photo. Right: prompt + input. |
| Interaction: Text entry + submit | Private — not reviewed | Submit button locks next until typed |
| Time: ~2 min | Narration (~80 words) | |
```

---

## Other Slides (use as needed)

### SERIES PROGRESS MAP
```markdown
| Step | Activities | Design Guide |
|---|---|---|
| Progress | 18-guide visual grid | Completed guides highlighted |
| Interaction: Visual display | Current guide marked | |
| Time: ~30s | Narration (~60 words): [Preview next guide] | |
```

### KEY TAKEAWAYS / SUMMARY
```markdown
| Step | Activities | Design Guide |
|---|---|---|
| Summary | 4-5 bullet points | Cobalt accent bar |
| Interaction: Static + audio | [Key point 1-5] | |
| Time: ~1 min | Narration (~100 words) | |
```

---

# Part 3: Storyboard Document Format

Fill in for each guide:

```markdown
# Master Storyboard — Guide {{NN}}: {{GUIDE_TITLE}}

**Accessibility First Course Series | University Health Network | Toronto, Ontario**

| Field | Detail |
|---|---|
| Version | 1.0 Draft |
| Date | {{DATE}} |
| Designer | {{DESIGNER}} |
| Seat Time | {{ESTIMATED_TIME}} min |
| Screens | {{TOTAL_SCREENS}} |
| Output | HTML5 SCORM 1.2 |
| SME Status | Pending |

**CLOs:** (1) {{CLO_1}} (2) {{CLO_2}} (3) {{CLO_3}} (4) {{CLO_4}}

*Guiding Principles: People First & Dignity · Independence & Autonomy · Inclusion & Integration · Proactive Barrier Prevention · Equity, Rights & Intersectionality*

---

[Insert selected slides here, numbered sequentially: {{NN}}.1, {{NN}}.2, {{NN}}.3, ...]

---

## References (APA 7)
[List all references]

## Appendix A: Image Brief Summary
| Screen | File Name | Description | Style |
|---|---|---|---|
| ... | ... | ... | Photojournalistic |

## Appendix B: Audio File Manifest
| Screen | File | Words | Duration | CC File |
|---|---|---|---|---|
| ... | ... | ... | ... | ... |

**Total narration:** ~X,XXX words (~XX minutes)
```
