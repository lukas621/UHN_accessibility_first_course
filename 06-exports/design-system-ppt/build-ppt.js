const pptxgen = require('pptxgenjs');
const path = require('path');
const fs = require('fs');

const SLIDES_DIR = path.join(__dirname, 'slides');
const OUT_FILE = path.join(__dirname, 'UHN_Guide01_Mockup.pptx');

const slideNotes = [
  'SLIDE 1 — Title/Welcome. Static slide. "Continue Module" button links to Slide 2.',
  'SLIDE 2 — Learning Objectives. Static. 4 CLOs with color-coded accent lines.',
  'SLIDE 3 — Why This Matters. Static with quote callout.',
  'SLIDE 4 — Beyond Ramps & Railings. Click-reveal: 6 barrier type cards expand on click. Use Storyline layers.',
  'SLIDE 5 — Accessibility in Practice Model. Hotspot interaction: each of the 4 area cards (Awareness, Communication, Environment, Response) expands on click with detailed examples. Use slide layers.',
  'SLIDE 6 — Accessibility Decision Path. Step interaction: 5 steps reveal sequentially. Animate arrow progression between steps. Each step opens a detail layer on click.',
  'SLIDE 7 — Scenario: Dahlia at Reception. Decision branch: 2-3 choices with consequence feedback layers. Track choice with variables. Loop back to Decision Path after feedback.',
  'SLIDE 8 — Knowledge Check. Graded MC quiz slide. Correct answer: B (Social/Environmental model). Show correct/incorrect feedback layers on submit. Seekbar disabled.',
  'SLIDE 9 — Inclusive Practice Tip. Click-reveal: 3 step cards (Ask/Offer/Confirm) flip or expand on click to show deeper examples. Use slide layers per step.',
  'SLIDE 10 — MAP Activity. Text entry slide (ungraded). 3 text input fields (Stop/Start/Continue). Save responses to learner variables. Add download/print trigger.',
  'SLIDE 11 — Key Takeaways. Static summary. Job aid download button triggers lightbox preview + PDF download. Add to Resources tab in player.',
  'SLIDE 12 — Listen & Reflect. Audio embed with player controls + transcript layer. Captions enabled by default. Audio generated via NotebookLM or ElevenLabs/MiniMax TTS.',
  'SLIDE 13 — Branching Scenario. Decision branch: 3 choices (A/B/C). Correct: B. Each opens a consequence panel layer. Use variables to track. Loop back to Decision Path after feedback.',
  'SLIDE 14 — Journey/Closing. Course completion slide. Show 3-stage progression across 18 guides. Trigger certificate if applicable.',
];

async function build() {
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_WIDE'; // 13.33" x 7.5" = 16:9
  pptx.author = 'Course Factory OS';
  pptx.title = 'UHN Accessibility First - Guide 01 - Mockup';
  pptx.subject = 'Foundations of Disability, Inclusion, and Accessible Design';

  const files = fs.readdirSync(SLIDES_DIR)
    .filter(f => f.match(/^slide-\d+\.png$/))
    .sort();

  console.log('Building PPT with ' + files.length + ' slides...');

  for (let i = 0; i < files.length; i++) {
    const slide = pptx.addSlide();
    const imgPath = path.join(SLIDES_DIR, files[i]);
    
    // Full-bleed image covering entire slide
    slide.addImage({
      path: imgPath,
      x: 0, y: 0,
      w: 13.33, h: 7.5,
      sizing: { type: 'cover', w: 13.33, h: 7.5 },
    });

    // Add Storyline build notes
    if (slideNotes[i]) {
      slide.addNotes(slideNotes[i]);
    }

    console.log('  Added slide ' + (i + 1) + ': ' + files[i]);
  }

  await pptx.writeFile({ fileName: OUT_FILE });
  console.log('PPT saved: ' + OUT_FILE);
}

build().catch(err => { console.error(err); process.exit(1); });
