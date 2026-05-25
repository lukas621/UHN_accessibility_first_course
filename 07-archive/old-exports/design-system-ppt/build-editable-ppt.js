/**
 * Build Editable PowerPoint from HTML slides
 * Uses html2pptx.js to convert each HTML slide into editable PPT objects
 */

const pptxgen = require('pptxgenjs');
const path = require('path');
const fs = require('fs');
const html2pptx = require('/Users/yijin/.agents/skills/powerpoint/scripts/html2pptx.js');

const SLIDES_DIR = path.join(__dirname, 'html-slides');
const OUT_FILE = path.join(__dirname, 'UHN_Guide01_Editable.pptx');

const slideNotes = [
  // Slide 1
  `SLIDE 1 — Title/Welcome
STORYLINE BUILD:
- Static welcome slide with navy background
- "Continue Module" button triggers: Jump to next slide
- Image placeholder: Replace with hero photo (16:9, min 1920x1080)
- Welcome-back card: Use Storyline variable %learnerName% and %lastSlide%
- Button: Add hover state (darker red) and visited state`,

  // Slide 2
  `SLIDE 2 — Learning Objectives
STORYLINE BUILD:
- Static content slide
- 4 objective cards with colored top borders
- No interactions required
- Breadcrumb shows current position
- Slide counter: 02/14`,

  // Slide 3
  `SLIDE 3 — Why This Matters in Healthcare
STORYLINE BUILD:
- Static content with statistics callout
- Image placeholder: Replace with reception-scene photo
- "1 in 4" stat box: Consider entrance animation (fade in)
- Key takeaway callout at bottom with red left border
- Citation: Statistics Canada, 2022 Canadian Survey on Disability`,

  // Slide 4
  `SLIDE 4 — Beyond Ramps & Railings
STORYLINE BUILD:
- Click-reveal interaction: 4 barrier type cards expand on click
- Use Storyline layers for each barrier category detail
- "CONCEPT" badge: Static, always visible
- Healthcare example panel (right): Image placeholder, replace with detail photo
- Red-highlighted text in example: Bold + red color applied via character formatting`,

  // Slide 5
  `SLIDE 5 — Accessibility in Practice Model
STORYLINE BUILD:
- Hotspot interaction: Each of the 4 area cards is clickable
- Each card click opens a slide layer with detailed examples
- Color-coded top borders: Cobalt (Awareness), Chartreuse (Communication), Lilac (Environment), Red (Response)
- Reflection callout at bottom: Static, always visible
- Bullet items inside navy cards use dash style`,

  // Slide 6
  `SLIDE 6 — Accessibility Decision Path
STORYLINE BUILD:
- Step interaction: 5 circular steps with sequential reveal
- Each step clickable → opens detail layer
- Step 3 (Apply) shown as "selected" state (red, larger)
- Steps 4-5 shown as "upcoming" state (grey, smaller)
- Example callout at bottom shows selected step detail
- "Open step 3 →" button: Jump to step detail layer
- Animate: Arrow progression between steps on timeline`,

  // Slide 7
  `SLIDE 7 — Scenario: Dahlia at Reception
STORYLINE BUILD:
- Decision branch activity: 3 choices (A, B, C)
- Correct answer: B (make eye contact, gesture, request interpreter)
- Each choice triggers a consequence feedback layer
- Use variables: %scenarioChoice% to track selection
- Image placeholder: Replace with scenario photo
- "Meet Dahlia" card: Static context, always visible
- After feedback, loop back to Decision Path (slide 6) or advance`,

  // Slide 8
  `SLIDE 8 — Knowledge Check
STORYLINE BUILD:
- Graded multiple choice quiz (weight: 5% toward completion)
- Correct answer: B (Social / Environmental model)
- Show correct feedback (green panel) when B selected
- Show incorrect feedback (red panel) for A, C, D with "Try again" button
- After 2 incorrect attempts, reveal correct answer
- Seekbar: Disabled during quiz
- Track: Results to LMS via SCORM variable`,

  // Slide 9
  `SLIDE 9 — Inclusive Practice Tip
STORYLINE BUILD:
- Click-reveal: 3 action items (Ask/Offer/Confirm) expand on click
- Interactive infographic (right panel): 4 nodes clickable
- Each node reveals a detail popup layer
- Patient advisor quote (navy panel): Static, always visible
- "Compound Effect" center node: Animate pulse on timeline
- Tip is repeated at same position in every guide — use slide master`,

  // Slide 10
  `SLIDE 10 — My Action Planning (MAP)
STORYLINE BUILD:
- Text entry slide (UNGRADED — not tracked for scoring)
- 3 text input fields using Storyline text entry variables:
  - %mapStop% — "One thing I will stop doing"
  - %mapStart% — "One thing I will start doing"
  - %mapContinue% — "One thing I will continue doing"
- "Save my MAP" button: Store variables to LMS suspend data
- "Download as PDF" button: Trigger JavaScript to generate PDF
- Privacy note: Fields are private, not visible to manager
- MAP persists across all 18 guides via shared variables`,

  // Slide 11
  `SLIDE 11 — Key Takeaways
STORYLINE BUILD:
- Static summary slide with 5 takeaway cards + 1 reflection card
- Each card links back to its source slide (use hyperlinks)
- "Download" button: Trigger PDF job aid download
- "Back to MAP" button: Jump to slide 10
- "Complete Module" button: Trigger course completion
  - Set completion variable to true
  - Submit results to LMS
  - Jump to slide 14 (journey map)`,

  // Slide 12
  `SLIDE 12 — Listen & Reflect
STORYLINE BUILD:
- Audio embed: Insert MP3 (2:30 duration)
- Audio source: Patient advisor recording (NotebookLM or ElevenLabs TTS)
- Captions: Enable by default, use SRT/VTT file
- Transcript: Slide layer triggered by "Open transcript" button
- Key listening points (right panel): Timestamp links jump audio position
- Playback controls: CC toggle, speed (1.0x), transcript, download
- Reflection prompt: Static, always visible
- Audio player dark card: Custom skin matching navy theme`,

  // Slide 13
  `SLIDE 13 — Branching Decision Activity
STORYLINE BUILD:
- Decision tree with 3 branches (A, B, C)
- Recommended answer: B (Pause and ask)
- Each choice opens a consequence feedback layer
- Use variables: %decisionChoice% to track selection
- Status badges: "Needs Improvement" (red), "Recommended" (green), "Selected" (blue)
- Feedback panel (bottom-left): Shows consequence of selected choice
- Decision Path loop-back (bottom-right): Visual connection to slide 6
- Step pills at bottom: Highlight which step is being practiced
- Time on task indicator: 3 minutes`,

  // Slide 14
  `SLIDE 14 — Journey Map / Course Closing
STORYLINE BUILD:
- Course completion slide showing 18-guide series map
- 3 stages: Foundations (1-4), Understanding (5-9), Applied Practice (10-18)
- Stage 1: Show actual progress using LMS variables
- Stages 2-3: Locked state with unlock conditions
- Progress bar: Calculate from completion variables across guides
- Stats row: Complete (X/18), In Progress (X), Remaining (X)
- If this is the final slide, trigger:
  - SCORM completion status
  - Certificate generation (if applicable)
  - Redirect to learner dashboard`
];

async function build() {
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9';  // 10" x 5.625" — matches 960px x 540px body
  pptx.author = 'Course Factory OS';
  pptx.title = 'UHN Accessibility First - Guide 01 - Editable';
  pptx.subject = 'Foundations of Disability, Inclusion, and Accessible Design';

  const files = fs.readdirSync(SLIDES_DIR)
    .filter(f => f.match(/^slide-\d+\.html$/))
    .sort();

  console.log(`Building editable PPT with ${files.length} HTML slides...`);

  for (let i = 0; i < files.length; i++) {
    const filePath = path.join(SLIDES_DIR, files[i]);
    console.log(`  Processing ${files[i]}...`);

    try {
      const { slide } = await html2pptx(filePath, pptx);

      // Add Storyline build notes
      if (i < slideNotes.length) {
        slide.addNotes(slideNotes[i]);
      }

      console.log(`  ✓ ${files[i]} added successfully`);
    } catch (error) {
      console.error(`  ✗ ${files[i]} failed: ${error.message}`);
      // Add a blank slide with error note so numbering stays consistent
      const errorSlide = pptx.addSlide();
      errorSlide.addText(`Error processing ${files[i]}: ${error.message}`, {
        x: 0.5, y: 2, w: 9, h: 1.5,
        fontSize: 14,
        color: 'C0233B',
        fontFace: 'Arial'
      });
      if (i < slideNotes.length) {
        errorSlide.addNotes(slideNotes[i]);
      }
    }
  }

  console.log(`\nSaving to ${OUT_FILE}...`);
  await pptx.writeFile({ fileName: OUT_FILE });
  console.log(`Done! ${files.length} slides saved to:\n  ${OUT_FILE}`);
}

build().catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
});
