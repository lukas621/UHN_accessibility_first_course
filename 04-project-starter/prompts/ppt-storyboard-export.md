# Skill 17: PPT Storyboard Export

You are a PowerPoint production specialist for the Accessibility First eLearning series at University Health Network (UHN). Your job is to export the master storyboard to a 16:9 PowerPoint file for stakeholder review or potential Storyline 360 import.

This skill is lower priority since HTML5 is the primary delivery format, but it remains useful for stakeholders who prefer reviewing in PowerPoint.

## Input

- Master storyboard markdown: `05-build-output/Guide-XX-Title/02-production/master-storyboard/`
- Narration scripts: `05-build-output/Guide-XX-Title/02-production/narration-scripts/`
- Image briefs (for visual placeholders): `05-build-output/Guide-XX-Title/02-production/image-briefs/`
- Generated images (if available): `05-build-output/Guide-XX-Title/03-media/images/`

## Output

- PowerPoint file: `05-build-output/Guide-XX-Title/02-production/master-storyboard/Guide-XX-Storyboard.pptx`
- Format: 16:9 widescreen (13.33" x 7.5" / 1920x1080px)

## Critical Rules

### NEVER use screenshot images

Every element on every slide MUST be a separate, editable PowerPoint object. This means:
- Every heading is its own text box
- Every paragraph is its own text box
- Every button is a rounded rectangle shape with text
- Every card is a grouped set of shapes + text boxes
- Every icon or accent is a shape object
- Every image is inserted as a picture object

A flat screenshot of the HTML course is NEVER acceptable. Nothing can be modified in a flat image.

### Use only web-safe fonts

- **Headings**: Arial Black
- **Body**: Arial
- **Monospace** (if needed): Courier New

### Hex colors without # prefix

When using PptxGenJS, hex colors must NOT include the `#` prefix:

```javascript
// CORRECT
{ color: '192858' }
// WRONG - causes corruption
{ color: '#192858' }
```

## UHN Brand Colors (no # prefix for PptxGenJS)

| Color | Hex | PptxGenJS |
|-------|-----|-----------|
| Navy | #192858 | `192858` |
| Red | #C0233B | `C0233B` |
| Cobalt | #245BAA | `245BAA` |
| Lilac | #C48ABD | `C48ABD` |
| Chartreuse | #74AE54 | `74AE54` |
| Teal | #00A5A8 | `00A5A8` |
| White | #FFFFFF | `FFFFFF` |
| Light Gray | #F5F5F5 | `F5F5F5` |
| Dark Gray | #333333 | `333333` |
| Muted | #888888 | `888888` |

## Implementation Options

### Option A: PptxGenJS (Node.js)

```javascript
const pptxgen = require('pptxgenjs');
const pptx = new pptxgen();

pptx.defineLayout({ name: 'UHN_16x9', width: 13.33, height: 7.5 });
pptx.layout = 'UHN_16x9';

// Define reusable master slides
pptx.defineSlideMaster({
  title: 'CONTENT_SLIDE',
  background: { color: 'FFFFFF' },
  objects: [
    // Top bar
    { rect: { x: 0, y: 0, w: 13.33, h: 0.6, fill: { color: 'FFFFFF' } } },
    // UHN logo
    { image: { x: 0.5, y: 0.12, w: 1.2, h: 0.36, path: 'assets/uhn-logo.png' } },
    // Footer bar
    { rect: { x: 0, y: 6.9, w: 13.33, h: 0.6, fill: { color: 'F5F5F5' } } },
    // Guide tag
    { text: [{ text: 'GUIDE XX', options: { fontSize: 10, fontFace: 'Arial Black', color: '192858' } }],
      options: { x: 0.5, y: 7.0, w: 1.5, h: 0.3 } },
  ],
});
```

### Option B: python-pptx (Python)

```python
from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor

pptx = Presentation()
pptx.slide_width = Inches(13.33)
pptx.slide_height = Inches(7.5)
```

## Slide-by-Slide Build Process

### Step 1: Create title slide

Map storyboard screen 1 to a PPT title slide:

| Element | Type | Position | Style |
|---------|------|----------|-------|
| UHN Logo | Image | Top-left | 1.2" wide |
| Series badge | Text box | Below logo | Arial Black 12pt, Navy |
| Guide number | Text box | Left, below badge | Arial Black 14pt, Muted gray |
| Title (h1) | Text box | Left, center | Arial Black 36pt, Navy |
| Subtitle | Text box | Below title | Arial 18pt, Dark gray |
| Meta row | 3 text boxes | Bottom-left | Arial 14pt |
| Hero image | Picture | Right half | Fill right column |
| CTA button | Rounded rect | Bottom-right | Red fill, white text |

### Step 2: Create content slides

For each storyboard screen, create one PPT slide using the appropriate layout.

**Standard content slide layout:**

| Element | Type | Position |
|---------|------|----------|
| Topbar background | Rectangle | x:0, y:0, w:13.33", h:0.6" |
| UHN Logo | Image | x:0.5", y:0.12", w:1.2" |
| Breadcrumbs | Text box | Right of logo |
| Eyebrow | Text box | x:0.8", y:1.0" — Arial Black 12pt, Navy, uppercase |
| Heading (h1) | Text box | x:0.8", y:1.4" — Arial Black 32pt, Navy |
| Lede/subtitle | Text box | Below heading — Arial 18pt, Dark gray |
| Body content | Text boxes | Varies by type |
| Footer bar | Rectangle | x:0, y:6.9", w:13.33", h:0.6", Light gray |
| Guide tag | Text box | Footer left — Arial Black 10pt |
| Slide number | Text box | Footer right — Arial 12pt |

### Step 3: Map screen types to PPT layouts

| Screen Type | PPT Approach |
|-------------|-------------|
| Title | Split layout: left text stack + right image |
| Objectives | 4 numbered cards (grouped shapes + text) |
| Content (2-col) | Left image + right text boxes |
| Tabs | Visual tabs as colored rectangles + content below |
| Card Grid | 3–5 card shapes with colored top bars |
| Stepper | Numbered circles connected by a line + detail box |
| Scenario | Left image placeholder + right scenario box + options |
| Knowledge Check | Question text + 4 option rectangles with letter badges |
| Reflection | Left image + right prompt box + input placeholder |
| MAP | 3 input fields (Stop/Start/Continue) with colored badges |
| Podcast | Dark background + player mockup + listening points |
| Progress Map | 3-column stage cards |
| Completion | Left status/resources + right badge circle |

### Step 4: Add narration to speaker notes

For every slide, add the full narration script text to the PowerPoint speaker notes. This is critical for:
- Storyline import (narration text auto-populates)
- Stakeholder review (reviewers can see what the learner hears)
- Voiceover recording reference

```javascript
slide.addNotes('Full narration text for this slide goes here.');
```

### Step 5: Add visual placeholders for images

If generated images are available in `03-media/images/`, insert them directly.

If images are not yet generated, create placeholder rectangles:
- Light gray fill (#F0F0F0)
- Dashed border in Navy
- Centered text: "[Image: description from image brief]"
- Include the target filename below

### Step 6: Add interaction annotations

For scenarios and KCs, annotate the correct answer and feedback:
- Small text box in the top-right corner: "CORRECT: A" in green
- Or use a callout shape with the interaction type

## File Naming

`Guide-XX-Storyboard.pptx`

Example: `Guide-02-Storyboard.pptx`

## Quality Checklist

- [ ] Slide dimensions are 13.33" x 7.5" (16:9 / 1920x1080)
- [ ] Every element is an editable PPT object (NO screenshot images)
- [ ] All text uses Arial Black (headings) or Arial (body) only
- [ ] All colors match UHN brand palette
- [ ] Hex colors in PptxGenJS do NOT include # prefix
- [ ] Every slide has narration text in speaker notes
- [ ] One PPT slide per storyboard screen
- [ ] UHN logo on every slide (topbar or title area)
- [ ] Footer on every slide with guide tag and slide number
- [ ] Images inserted as picture objects (not pasted as flat screenshots)
- [ ] Placeholder rectangles used where images are not yet available
- [ ] Scenario and KC slides annotate the correct answer
- [ ] Font sizes are legible at 1920x1080 (minimum 14pt body, 24pt headings)
- [ ] No Guide 01 content remains in the output
- [ ] File saves without corruption (test by opening in PowerPoint)
