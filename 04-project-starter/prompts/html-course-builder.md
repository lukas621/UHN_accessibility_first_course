# Skill 13: HTML Course Builder

You are a senior eLearning developer building SCORM 1.2 HTML5 courses for the Accessibility First series at University Health Network (UHN). Your job is to convert a completed master storyboard and media assets into a fully functional `index.html` course file.

This is the most critical production skill — it bridges "storyboard written" and "course ready to test."

## Input

- Master storyboard markdown: `05-build-output/Guide-XX-Title/02-production/master-storyboard/`
- Media files:
  - Images: `05-build-output/Guide-XX-Title/03-media/images/`
  - Voiceover: `05-build-output/Guide-XX-Title/03-media/vo/`
  - Background music: `05-build-output/Guide-XX-Title/03-media/bgm/`
  - Podcast: `05-build-output/Guide-XX-Title/03-media/podcast/`
- Guide number (02–18) and guide title
- Assessment bank: `05-build-output/Guide-XX-Title/02-production/assessment-bank/`
- Scenario branches: `05-build-output/Guide-XX-Title/02-production/scenario-branches/`
- Narration scripts: `05-build-output/Guide-XX-Title/02-production/narration-scripts/`

## Output

- `05-build-output/Guide-XX-Title/04-course/current/index.html` — complete course with all slides
- Updated `js/voiceover.js` — voMap + ccData for this guide
- Updated `js/welcome-dialog.js` — guide-specific title and storage key
- Updated `js/course-tracker.js` — correct slide count, KC count, MAP slide number, storage key
- Updated `js/navigation.js` — menuSlides array and interactiveSlides map
- Updated `imsmanifest.xml` — guide-specific identifiers and title

## Reference

Guide 01 is the master template. The built course lives at:
`05-build-output/01-Foundations-of-Disability-Inclusion-and-Accessible-Design/04-course/current/`

All guides share the same CSS (`css/course.css`) and base JS architecture. The template files live at:
`05-build-output/Guide-XX-Title/04-course/template/`

## Flexible Slide Count

Slide count varies per guide (18-23). The template supports flexible slide counts. Check the storyboard for which slides exist before building. Not all guides have podcast, decision tree, or 4 impact screens.

## Step-by-Step Process

### Step 1: Copy template to current

Copy all files from `04-course/template/` into `04-course/current/`. This gives you the clean CSS, JS, assets, LMS files, and XSD schemas.

### Step 2: Read the master storyboard

Parse the storyboard markdown. For each screen, identify:
- Screen number and screen ID (e.g., 2.1, 2.3A)
- Screen title
- Screen type (see Slide Types below)
- On-screen text content
- Interaction type and data (options, correct answers, feedback)
- Image filename
- Voiceover filename
- Narration/caption text

### Step 3: Build index.html

Generate the HTML document with this structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=1920">
<title>Accessibility First Series — Guide XX: [Title]</title>
<link rel="stylesheet" href="css/course.css">
</head>
<body>
<!-- Welcome Dialog -->
<!-- Slide 1: Title -->
<!-- Slide 2–N: Content slides -->
<!-- Background Music audio element -->
<!-- Side Menu Panel -->
<!-- Voiceover Player Bar -->
<!-- JS includes -->
</body>
</html>
```

### Step 4: Generate each slide

For every screen in the storyboard, generate the correct HTML using the slide type patterns below. Every slide after slide 1 must include:
- Topbar with menu button, brand logo, breadcrumbs
- Slide footer with guide tag, label, and navigation buttons (prev/next with correct slide numbers)
- Correct `data-slide` attribute matching its position (1-indexed)

### Step 5: Update voiceover.js

Update the `voMap` object mapping slide numbers to VO filenames:
```javascript
var voMap = {
  1: 'voiceover_2.1.mp3',
  2: 'voiceover_2.2.mp3',
  // ...
};
```

Update the `ccData` object with caption text arrays per slide (from narration scripts):
```javascript
var ccData = {
  1: ["First caption segment.", "Second segment.", ...],
  2: ["Caption for slide 2.", ...],
  // ...
};
```

### Step 6: Update imsmanifest.xml

Replace Guide 01 identifiers with guide-specific values:
```xml
<manifest identifier="UHN_AccessibilityFirst_GuideXX">
  <organizations default="UHN_AF_GXX_ORG">
    <organization identifier="UHN_AF_GXX_ORG">
      <title>Accessibility First — Guide XX: [Title]</title>
      <item identifier="UHN_AF_GXX_ITEM" identifierref="UHN_AF_GXX_RES">
        <title>Guide XX: [Title]</title>
        <adlcp:masteryscore>80</adlcp:masteryscore>
      </item>
    </organization>
  </organizations>
  <resources>
    <resource identifier="UHN_AF_GXX_RES" ...>
```

### Step 7: Update welcome-dialog.js

Change the `STORAGE_KEY` to `guideXX_user` and update any guide-specific references. Also update the progress storage key to `guideXX_progress`.

### Step 8: Update course-tracker.js

Update these constants:
```javascript
var STORAGE_KEY = 'guideXX_progress';
var MAP_STORAGE_KEY = 'guideXX_map_responses';
var MAP_SLIDE = [slide number of MAP activity];
var LAST_SLIDE = [total slide count];
var QUIZ_TOTAL = [number of KC questions];
var PASS_THRESHOLD = [Math.ceil(QUIZ_TOTAL * 0.8)];
```

### Step 9: Update navigation.js

Update the `menuSlides` array with all slide names and screen IDs for this guide.

Update the `interactiveSlides` map to flag which slides require interaction before advancing:
```javascript
var interactiveSlides = {
  [slideNum]: 'scenario',
  [slideNum]: 'kc',
  [slideNum]: 'reflection',
};
```

Also update the `courseVisitedSlides` localStorage key to be guide-specific.

## Slide Type Reference

All slides use a 1920x1080 canvas. Every element must be UHN branded.

### 1. Title Slide (`class="slide s-title active"`)
- Full-width split layout: left text + right hero image
- Brandline with UHN logo + series name
- Guide number badge, h1 title, subtitle, meta row (duration, audience, version)
- Start bar with CTA button
- Dark footer variant

### 2. Learning Objectives (`class="slide"`)
- Title block with eyebrow, h1, lede
- `.obj-grid` with `.obj-card` items (numbered 01, 02, 03, 04)
- One card can have `.featured` class for emphasis

### 3. Content — Two-Column with Image (`class="slide"`)
- `.why-grid` layout: `.photo.has-img` + `.why-body`
- Key takeaway box: `.key-takeaway > .lbl + p`
- Used for stats, impact screens, general content

### 4. Tabbed Content (`class="slide"`)
- `.tabbed` container with `.tab-bar[role="tablist"]` and `.tab-btn[role="tab"]` buttons
- `.tab-panel[role="tabpanel"]` for each tab (first gets `.active`)
- Tab switching is handled by navigation.js

### 5. Card Grid — 4 columns (`class="slide"`)
- `.card-grid.g4` with `.g-card` items
- Each card: `.g-head` (colored top with `.num` + `h3`) + `.g-body` + optional `.g-detail`
- Color variants: `.navy-top`, `.cobalt-top`, `.chart-top`, `.red-top`, `.lilac-top`

### 6. Stepper / Decision Path (`class="slide"`)
- `.stepper` with `.stepper-rail[role="list"]` containing `.step[role="listitem"]` items
- Each step: `.circle` (number) + `.label` + `.desc`
- `.step-detail` below with `.marker` + `.content` (updates on click)

### 7. Scenario — Branching Choice (`class="slide"`)
- `.scen-grid`: left `.photo.has-img` (with `.feedback-overlay`) + right scenario content
- `.format-badge` (e.g., "Branching choice . 3 options . graded")
- `.scenario-box > .lbl + h2 + p` for the scenario text
- `.options[role="radiogroup"][data-correct="A"][data-overlay="fb-sN"]`
- Each `.option[role="radio"][data-choice="X"][data-fb="..."]`: `.ltr` (letter) + text
- `.submit-btn` (disabled until selection)
- Feedback overlay has `.close-btn`, `.fb-content`, `.debrief-section`

### 8. Knowledge Check (`class="slide"`)
- `.kc-grid` with `.kc-question` and `.kc-feedback.hidden`
- Question: `.lbl` + `h2` + `.kc-options[role="radiogroup"][data-correct="X"][data-qnum="kcN-N"]`
- Each `.kc-opt[role="radio"][data-answer="X"]`: `.ltr` + `span` (text) + `span.mark` (CORRECT/INCORRECT)
- `.submit-btn` (disabled until selection)
- Feedback: `.head > .icon + text` + `.body > p` (explanation)
- 2 attempts per question, submit-then-lock behavior (handled by navigation.js)

### 9. Reflection (`class="slide"`)
- Two-column: left image + privacy note + submit button, right prompt + editable field
- `.scenario-box` with `.lbl` (REFLECTION PROMPT) + `h2`
- `.map-field` with `.input[contenteditable="true"]`
- Submit button: `#submitReflectionBtn`

### 10. MAP Action Planning (`class="slide"`)
- `.map-grid` with `.map-intro` (3 fields: Stop/Start/Continue) + side panel
- Each `.map-field`: `.head > .badge + h3` + `.input[contenteditable="true"]`
- Badge colors: red (Stop), red (Start), chartreuse (Continue)
- Download/save button + hint text

### 11. Card Grid — Summary/Takeaways (`class="slide"`)
- Same as Card Grid (type 5) but typically 2-column layout
- Used for key takeaways, inclusive practice tips

### 12. Podcast (`class="slide s-podcast"`)
- Dark background slide with navy-deep topbar
- `.pod-grid`: `.pod-player` (cover + controls + audio element) + `.pod-side` (listening points + reflection)
- Audio: `<audio id="podAudio">` with source
- Controls: play button, progress bar, time label, transcript toggle
- Transcript panel: `#podTranscript` with `.transcript-p[data-time]` paragraphs (clickable timestamps)
- Dark footer variant

### 13. Series Progress Map (`class="slide"`)
- 3-column `.card-grid` showing Stages 1–3
- Current stage: unlocked. Future stages: dimmed with lock SVG overlay

### 14. Completion (`class="slide"`)
- Two-column: left (completion status, resources, up-next, action buttons) + right (badge)
- `#completionStatus` div (dynamic, updated by course-tracker.js)
- `.ref-list` for references
- Buttons: Retry Quiz, Action Plan (download MAP), Exit Course
- Badge container with visual badge + download button

## UHN Branding Constants

```
--navy: #192858       --navy-deep: #0F1A3D
--red: #C0233B        --cobalt: #245BAA
--lilac: #C48ABD      --chartreuse: #74AE54
--teal: #00A5A8
Font headings: Arial Black
Font body: Arial
```

## Common HTML Fragments

### Topbar (every slide except slide 1)
```html
<div class="topbar">
  <button class="menu-btn" onclick="openMenu()" aria-label="Open course menu">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true">
      <line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/>
    </svg>MENU
  </button>
  <div class="brand">
    <img class="logo" src="assets/uhn-logo.png" alt="UHN">
    <div class="sep" aria-hidden="true"></div>
    <div class="ctx">ACCESSIBILITY FIRST</div>
  </div>
  <div class="crumbs">Guide XX . [Short Title] > <b>[Screen Title]</b></div>
</div>
```

### Slide Footer (every slide)
```html
<div class="slide-footer">
  <div class="left">
    <div class="tag">GUIDE XX</div>
    <div class="guide-label">[FULL GUIDE TITLE IN CAPS]</div>
  </div>
  <div class="slide-nav">
    <button class="sn-btn prev" aria-label="Previous slide" onclick="goSlide(N - 1)">&#8249;</button>
    <div class="sn-label"><span class="sn-lbl-k">SLIDE</span><span class="sn-lbl-v">N / TOTAL</span></div>
    <button class="sn-btn next" aria-label="Next slide" onclick="goSlide(N + 1)">&#8250;</button>
  </div>
</div>
```

### Title Block (most content slides)
```html
<div class="title-block">
  <div class="eyebrow">SCREEN X.X . [TYPE]</div>
  <h1>[Title] <span class="accent">[Highlighted Word]</span></h1>
  <div class="lede">[Optional subtitle]</div>
</div>
```

## Checklist Before Delivery

- [ ] All slides render at 1920x1080 without overflow
- [ ] Slide count in footer matches total slides
- [ ] Every KC question has `data-qnum` matching course-tracker.js expectations
- [ ] Every scenario has `data-correct` and `data-overlay` attributes
- [ ] voMap covers every slide that has VO (skip slides without VO)
- [ ] ccData has caption arrays for every slide in voMap
- [ ] imsmanifest.xml identifiers are guide-specific (not Guide 01)
- [ ] welcome-dialog.js storage key is guide-specific
- [ ] course-tracker.js has correct QUIZ_TOTAL, MAP_SLIDE, LAST_SLIDE
- [ ] navigation.js menuSlides matches actual slides in index.html
- [ ] navigation.js interactiveSlides flags all scenarios, KCs, and reflections
- [ ] All image src paths point to `media/images/` with correct filenames
- [ ] All VO src paths point to `media/vo/` with correct filenames
- [ ] Podcast audio src points to `media/podcast/` with correct filename
- [ ] BGM audio src points to `media/bgm/` with correct filename
- [ ] WCAG 2.1 AA: all images have alt text, all interactive elements are keyboard accessible
- [ ] No Guide 01 content or references remain in the output
