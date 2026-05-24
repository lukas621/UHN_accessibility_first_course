const PptxGenJS = require('pptxgenjs');
const path = require('path');

const pptx = new PptxGenJS();
pptx.layout = 'LAYOUT_WIDE'; // 13.33 x 7.5

// ── Helpers ──────────────────────────────────────────────────────────────
const W = 13.33, H = 7.5;
const px = (x) => (x / 1920) * W;
const py = (y) => (y / 1080) * H;

const slidesDir = path.resolve(__dirname, 'slides');
const imagesDir = path.resolve(__dirname, 'images');
const bgPath = (n) => path.join(slidesDir, `slide-${String(n).padStart(2,'0')}.png`);
const imgPath = (name) => path.join(imagesDir, name);

// Colors (NO # prefix)
const NAVY    = '192858';
const RED     = 'C4122F';
const LILAC   = 'C9A0DC';
const WHITE   = 'FFFFFF';
const COBALT  = '1B3A6B';
const CHARTR  = '7CB342';
const DKGRAY  = '333333';
const LTGRAY  = '666666';
const GREEN   = '4CAF50';
const PINK    = 'E8D5E8';

function addBg(slide, n) {
  slide.background = { path: bgPath(n) };
}

// Transparent text helper
function txt(slide, text, opts) {
  const defaults = {
    fontFace: 'Arial',
    color: DKGRAY,
    fill: { type:'solid', color:'FFFFFF', alpha:0 },
    border: { type:'none' },
    valign: 'top',
    wrap: true,
    paraSpaceAfter: 0,
    paraSpaceBefore: 0,
  };
  slide.addText(text, { ...defaults, ...opts });
}

// Shape helper (for buttons, cards, dividers)
function rect(slide, opts) {
  slide.addShape(pptx.shapes.RECTANGLE, {
    fill: { type:'solid', color: opts.fill || NAVY, alpha: opts.alpha != null ? opts.alpha : 0 },
    border: opts.border || { type:'none' },
    ...opts,
  });
}

// ════════════════════════════════════════════════════════════════════════
// SLIDE 1 — Title (navy bg)
// ════════════════════════════════════════════════════════════════════════
{
  const slide = pptx.addSlide();
  addBg(slide, 1);

  // "ACCESSIBILITY FIRST SERIES" label
  txt(slide, 'ACCESSIBILITY FIRST SERIES', {
    x: px(60), y: py(130), w: px(600), h: py(30),
    fontSize: 11, bold: true, color: LILAC, charSpacing: 3,
  });

  // "GUIDE 01 OF 18 . FOUNDATIONS"
  txt(slide, 'GUIDE 01 OF 18  \u00B7  FOUNDATIONS', {
    x: px(60), y: py(185), w: px(600), h: py(35),
    fontSize: 13, bold: true, color: LILAC, charSpacing: 3,
  });

  // "ACCESSIBILITY FIRST SERIES . ADVANCING DIGNITY..."
  txt(slide, 'ACCESSIBILITY FIRST SERIES \u00B7\nADVANCING DIGNITY, INCLUSION &\nEQUITABLE CARE', {
    x: px(60), y: py(228), w: px(550), h: py(70),
    fontSize: 10, bold: true, color: LILAC, charSpacing: 2,
  });

  // Main title
  txt(slide, [
    { text: 'Foundations of\nDisability,\nInclusion &\n', options: { color: WHITE, fontSize: 38, bold: true, fontFace: 'Arial Black' }},
    { text: 'Accessible Design', options: { color: LILAC, fontSize: 38, bold: true, fontFace: 'Arial Black' }},
  ], {
    x: px(60), y: py(310), w: px(650), h: py(280),
  });

  // Subtitle paragraph
  txt(slide, 'An introduction to the principles, models, and everyday practices that\nshape accessible care at the University Health Network.', {
    x: px(60), y: py(575), w: px(580), h: py(50),
    fontSize: 11, color: WHITE,
  });

  // Duration
  txt(slide, 'Duration', { x: px(60), y: py(700), w: px(110), h: py(20), fontSize: 9, color: LTGRAY });
  txt(slide, '22\nminutes', { x: px(60), y: py(725), w: px(110), h: py(50), fontSize: 14, bold: true, color: WHITE });

  // Format
  txt(slide, 'Format', { x: px(190), y: py(700), w: px(200), h: py(20), fontSize: 9, color: LTGRAY });
  txt(slide, 'Self-paced \u00B7\nStoryline 360', { x: px(190), y: py(725), w: px(200), h: py(50), fontSize: 14, bold: true, color: WHITE });

  // Audience
  txt(slide, 'Audience', { x: px(420), y: py(700), w: px(150), h: py(20), fontSize: 9, color: LTGRAY });
  txt(slide, 'All UHN\nStaff', { x: px(420), y: py(725), w: px(150), h: py(50), fontSize: 14, bold: true, color: WHITE });

  // Last Updated
  txt(slide, 'Last Updated', { x: px(570), y: py(700), w: px(160), h: py(20), fontSize: 9, color: LTGRAY });
  txt(slide, 'May 2026 \u00B7\nv1.0', { x: px(570), y: py(725), w: px(160), h: py(50), fontSize: 14, bold: true, color: WHITE });

  // Welcome back panel
  txt(slide, 'WELCOME BACK, JORDAN', {
    x: px(755), y: py(670), w: px(400), h: py(25),
    fontSize: 10, bold: true, color: LTGRAY, charSpacing: 2,
  });
  txt(slide, 'Resume where you left off \u00B7 Slide 4', {
    x: px(755), y: py(695), w: px(400), h: py(30),
    fontSize: 13, bold: true, color: NAVY,
  });

  // Continue Module button
  rect(slide, {
    x: px(1140), y: py(670), w: px(200), h: py(70),
    fill: RED, alpha: 80,
  });
  txt(slide, 'Continue\nModule  \u203A', {
    x: px(1140), y: py(678), w: px(200), h: py(60),
    fontSize: 14, bold: true, color: WHITE, align: 'center', valign: 'middle',
  });

  // Hero photo (replaces hatched placeholder)
  slide.addImage({
    path: imgPath('g01-hero-welcome-01.png'),
    x: px(740), y: py(65), w: px(640), h: py(575),
    sizing: { type: 'cover', w: px(640), h: py(575) },
    altText: 'A diverse group of healthcare workers in scrubs walking together toward a modern hospital entrance, including a person using a power wheelchair and a person carrying a white cane.',
  });

  slide.addNotes('Slide 1: Welcome - static cover slide. Storyline: Static layer, no interactions. Auto-advance disabled. Learner clicks "Continue Module" to begin or resume.');
}

// ════════════════════════════════════════════════════════════════════════
// SLIDE 2 — Learning Objectives (white bg)
// ════════════════════════════════════════════════════════════════════════
{
  const slide = pptx.addSlide();
  addBg(slide, 2);

  // Section label
  txt(slide, 'SECTION 01 \u00B7 WHAT YOU WILL LEARN', {
    x: px(60), y: py(80), w: px(500), h: py(25),
    fontSize: 10, bold: true, color: RED, charSpacing: 2,
  });

  // Title
  txt(slide, 'Learning Objectives', {
    x: px(60), y: py(110), w: px(700), h: py(55),
    fontSize: 36, bold: true, color: NAVY, fontFace: 'Arial Black',
  });

  // Subtitle
  txt(slide, 'By the end of this guide, you will be able to describe the foundations of disability and inclusion, and apply\nthem to everyday decisions in clinical, administrative, and operational care.', {
    x: px(60), y: py(180), w: px(900), h: py(45),
    fontSize: 11, color: DKGRAY,
  });

  // Objective cards - row 1
  // Card 01
  rect(slide, { x: px(68), y: py(280), w: px(3), h: py(120), fill: NAVY, alpha: 100 });
  txt(slide, '01', { x: px(85), y: py(295), w: px(80), h: py(70), fontSize: 32, bold: true, color: RED, fontFace: 'Arial Black' });
  txt(slide, 'Define disability through multiple lenses', {
    x: px(175), y: py(295), w: px(460), h: py(30), fontSize: 14, bold: true, color: NAVY,
  });
  txt(slide, 'Distinguish between the medical, social, and human-rights models of\ndisability, and recognize how each shapes care.', {
    x: px(175), y: py(330), w: px(460), h: py(50), fontSize: 10, color: DKGRAY,
  });

  // Card 02
  rect(slide, { x: px(730), y: py(280), w: px(3), h: py(120), fill: NAVY, alpha: 100 });
  txt(slide, '02', { x: px(748), y: py(295), w: px(80), h: py(70), fontSize: 32, bold: true, color: RED, fontFace: 'Arial Black' });
  txt(slide, 'Identify visible and invisible barriers', {
    x: px(840), y: py(295), w: px(500), h: py(30), fontSize: 14, bold: true, color: NAVY,
  });
  txt(slide, 'Recognize the physical, sensory, attitudinal, communication, and\nsystemic barriers a person may encounter at UHN.', {
    x: px(840), y: py(330), w: px(500), h: py(50), fontSize: 10, color: DKGRAY,
  });

  // Card 03
  rect(slide, { x: px(68), y: py(435), w: px(3), h: py(120), fill: RED, alpha: 100 });
  txt(slide, '03', { x: px(85), y: py(450), w: px(80), h: py(70), fontSize: 32, bold: true, color: RED, fontFace: 'Arial Black' });
  txt(slide, 'Apply the Accessibility in Practice model', {
    x: px(175), y: py(450), w: px(460), h: py(30), fontSize: 14, bold: true, color: NAVY,
  });
  txt(slide, 'Use the four areas \u2014 Awareness, Communication, Environment, and\nResponse \u2014 to guide everyday decisions.', {
    x: px(175), y: py(485), w: px(460), h: py(50), fontSize: 10, color: DKGRAY,
  });

  // Card 04
  rect(slide, { x: px(730), y: py(435), w: px(3), h: py(120), fill: NAVY, alpha: 100 });
  txt(slide, '04', { x: px(748), y: py(450), w: px(80), h: py(70), fontSize: 32, bold: true, color: RED, fontFace: 'Arial Black' });
  txt(slide, 'Use the 5-step Decision Path', {
    x: px(840), y: py(450), w: px(500), h: py(30), fontSize: 14, bold: true, color: NAVY,
  });
  txt(slide, 'Pause and assess, listen, apply, adapt, and seek support when an\naccessibility need is identified.', {
    x: px(840), y: py(485), w: px(500), h: py(50), fontSize: 10, color: DKGRAY,
  });

  // Footer
  txt(slide, '\u25A0 GUIDE 01', { x: px(40), y: py(1020), w: px(100), h: py(20), fontSize: 8, bold: true, color: RED });
  txt(slide, 'FOUNDATIONS OF DISABILITY, INCLUSION & ACCESSIBLE DESIGN', {
    x: px(140), y: py(1020), w: px(600), h: py(20), fontSize: 8, color: LTGRAY, charSpacing: 1,
  });
  txt(slide, 'SLIDE\n02 / 14', { x: px(1310), y: py(1010), w: px(100), h: py(35), fontSize: 9, color: NAVY, align: 'center' });

  slide.addNotes('Slide 2: Learning Objectives - static content slide. Storyline: Static layout, no interactions. Four objective cards displayed in 2x2 grid. Auto-advance or Next button.');
}

// ════════════════════════════════════════════════════════════════════════
// SLIDE 3 — Why This Matters (white bg)
// ════════════════════════════════════════════════════════════════════════
{
  const slide = pptx.addSlide();
  addBg(slide, 3);

  txt(slide, 'SECTION 02 \u00B7 HEALTHCARE RELEVANCE', {
    x: px(60), y: py(80), w: px(500), h: py(25),
    fontSize: 10, bold: true, color: RED, charSpacing: 2,
  });

  txt(slide, [
    { text: 'Why this matters in ', options: { color: NAVY, fontSize: 36, bold: true, fontFace: 'Arial Black' }},
    { text: 'healthcare', options: { color: RED, fontSize: 36, bold: true, fontFace: 'Arial Black' }},
  ], {
    x: px(60), y: py(110), w: px(900), h: py(55),
  });

  txt(slide, 'Accessibility is not a separate program. It is the difference between a patient feeling seen and a patient\nleaving without the care they came for.', {
    x: px(60), y: py(178), w: px(900), h: py(45),
    fontSize: 12, color: DKGRAY,
  });

  // 1 in 4 stat box
  rect(slide, { x: px(755), y: py(275), w: px(620), h: py(110), fill: COBALT, alpha: 85 });
  txt(slide, '1 in 4', {
    x: px(770), y: py(285), w: px(170), h: py(80),
    fontSize: 40, bold: true, color: WHITE, fontFace: 'Arial Black',
  });
  txt(slide, [
    { text: 'Canadian adults aged 15+ live with one or more\ndisabilities. ', options: { color: WHITE, fontSize: 10 }},
    { text: 'That is a quarter of the patients,\nfamilies, and colleagues you serve every shift.', options: { color: WHITE, fontSize: 10, bold: true }},
  ], {
    x: px(950), y: py(285), w: px(410), h: py(80),
  });

  // Body paragraphs
  txt(slide, 'Most accessibility decisions at UHN are made not in policy meetings \u2014 they are\nmade at reception desks, in exam rooms, during phone intakes, and in the brief\nseconds before a person speaks.', {
    x: px(755), y: py(400), w: px(620), h: py(70),
    fontSize: 11, color: DKGRAY,
  });

  txt(slide, 'Foundations matter because they make those split-second decisions consistent,\ndignified, and legally sound.', {
    x: px(755), y: py(485), w: px(620), h: py(45),
    fontSize: 11, color: DKGRAY,
  });

  // Key takeaway callout
  rect(slide, { x: px(770), y: py(555), w: px(4), h: py(80), fill: LILAC, alpha: 100 });
  txt(slide, 'KEY TAKEAWAY', {
    x: px(785), y: py(558), w: px(300), h: py(20),
    fontSize: 9, bold: true, color: NAVY, charSpacing: 3,
  });
  txt(slide, 'Every interaction at UHN is an accessibility decision \u2014 whether we name\nit that or not.', {
    x: px(785), y: py(582), w: px(570), h: py(45),
    fontSize: 12, bold: true, color: NAVY,
  });

  // Footer
  txt(slide, '\u25A0 GUIDE 01', { x: px(40), y: py(1020), w: px(100), h: py(20), fontSize: 8, bold: true, color: RED });
  txt(slide, 'FOUNDATIONS OF DISABILITY, INCLUSION & ACCESSIBLE DESIGN', {
    x: px(140), y: py(1020), w: px(600), h: py(20), fontSize: 8, color: LTGRAY, charSpacing: 1,
  });
  txt(slide, 'SLIDE\n03 / 14', { x: px(1310), y: py(1010), w: px(100), h: py(35), fontSize: 9, color: NAVY, align: 'center' });

  // Context photo — barriers in healthcare (replaces hatched placeholder)
  slide.addImage({
    path: imgPath('g01-context-barriers-01.png'),
    x: px(60), y: py(275), w: px(660), h: py(400),
    sizing: { type: 'cover', w: px(660), h: py(400) },
    altText: 'A young woman in a wheelchair reaching toward directional signs in a hospital corridor while a volunteer assists, illustrating common environmental barriers.',
  });

  slide.addNotes('Slide 3: Why This Matters - static content with quote callout. Storyline: Static layout with 1-in-4 stat callout. Key Takeaway quote displayed. No interactions required.');
}

// ════════════════════════════════════════════════════════════════════════
// SLIDE 4 — Beyond Ramps (white bg)
// ════════════════════════════════════════════════════════════════════════
{
  const slide = pptx.addSlide();
  addBg(slide, 4);

  txt(slide, 'SECTION 03 \u00B7 A BIGGER DEFINITION', {
    x: px(60), y: py(80), w: px(500), h: py(25),
    fontSize: 10, bold: true, color: RED, charSpacing: 2,
  });

  txt(slide, [
    { text: 'Accessibility is more than ', options: { color: NAVY, fontSize: 34, bold: true, fontFace: 'Arial Black' }},
    { text: 'ramps and railings', options: { color: RED, fontSize: 34, bold: true, fontFace: 'Arial Black' }},
  ], {
    x: px(60), y: py(105), w: px(1100), h: py(55),
  });

  txt(slide, 'Physical access is the most visible barrier \u2014 but most of what UHN gets wrong every day is invisible until\nwe look for it.', {
    x: px(60), y: py(178), w: px(1000), h: py(45),
    fontSize: 12, color: DKGRAY,
  });

  // CONCEPT box
  rect(slide, { x: px(90), y: py(295), w: px(100), h: py(30), fill: NAVY, alpha: 90 });
  txt(slide, 'CONCEPT', {
    x: px(90), y: py(295), w: px(100), h: py(30),
    fontSize: 9, bold: true, color: WHITE, align: 'center', valign: 'middle', charSpacing: 2,
  });

  txt(slide, 'Accessibility is the removal of any\nbarrier that keeps a person from full,\ndignified participation in care.', {
    x: px(90), y: py(340), w: px(550), h: py(100),
    fontSize: 22, bold: true, color: NAVY, fontFace: 'Arial Black',
  });

  txt(slide, 'Barriers can be physical, but they can also be attitudinal, communication-based,\ntechnological, sensory, or systemic. Every barrier removed widens the door for\nsomeone.', {
    x: px(90), y: py(450), w: px(550), h: py(55),
    fontSize: 10, color: DKGRAY,
  });

  // 4 barrier type boxes
  txt(slide, 'PHYSICAL', { x: px(100), y: py(525), w: px(240), h: py(20), fontSize: 10, bold: true, color: NAVY });
  txt(slide, 'Doors, paths, seating, exam tables, parking.', { x: px(100), y: py(545), w: px(240), h: py(25), fontSize: 9, color: DKGRAY });

  txt(slide, 'COMMUNICATION', { x: px(380), y: py(525), w: px(260), h: py(20), fontSize: 10, bold: true, color: NAVY });
  txt(slide, 'Plain language, signage, formats,\ninterpretation.', { x: px(380), y: py(545), w: px(260), h: py(35), fontSize: 9, color: DKGRAY });

  txt(slide, 'ATTITUDINAL', { x: px(100), y: py(600), w: px(240), h: py(20), fontSize: 10, bold: true, color: NAVY });
  txt(slide, 'Assumptions, tone, body language,\ndeference.', { x: px(100), y: py(620), w: px(240), h: py(35), fontSize: 9, color: DKGRAY });

  txt(slide, 'SYSTEMIC', { x: px(380), y: py(600), w: px(260), h: py(20), fontSize: 10, bold: true, color: NAVY });
  txt(slide, 'Forms, scheduling, intake, signage, policy.', { x: px(380), y: py(620), w: px(260), h: py(25), fontSize: 9, color: DKGRAY });

  // Healthcare example
  txt(slide, 'HEALTHCARE EXAMPLE', {
    x: px(735), y: py(290), w: px(300), h: py(20),
    fontSize: 10, bold: true, color: RED, charSpacing: 2,
  });

  txt(slide, [
    { text: 'A patient is late to an appointment. The barrier isn\u2019t mobility. ', options: { fontSize: 11, color: DKGRAY }},
    { text: 'It is an appointment reminder sent only as an image \u2014 unreadable by the screen reader they rely on.', options: { fontSize: 11, color: RED, bold: true }},
  ], {
    x: px(735), y: py(535), w: px(610), h: py(60),
  });

  txt(slide, 'Fixing the building doesn\u2019t fix the visit. Fixing the message does.', {
    x: px(735), y: py(620), w: px(600), h: py(25),
    fontSize: 10, color: DKGRAY, italic: true,
  });

  // Footer
  txt(slide, '\u25A0 GUIDE 01', { x: px(40), y: py(1020), w: px(100), h: py(20), fontSize: 8, bold: true, color: RED });
  txt(slide, 'FOUNDATIONS OF DISABILITY, INCLUSION & ACCESSIBLE DESIGN', {
    x: px(140), y: py(1020), w: px(600), h: py(20), fontSize: 8, color: LTGRAY, charSpacing: 1,
  });
  txt(slide, 'SLIDE\n04 / 14', { x: px(1310), y: py(1010), w: px(100), h: py(35), fontSize: 9, color: NAVY, align: 'center' });

  // Detail photo — reception/booking scene (replaces hatched placeholder)
  slide.addImage({
    path: imgPath('g01-scenario-booking-01.png'),
    x: px(735), y: py(315), w: px(610), h: py(210),
    sizing: { type: 'cover', w: px(610), h: py(210) },
    altText: 'An older woman at a hospital reception desk speaking with a receptionist about booking difficulties, illustrating communication and systemic barriers.',
  });

  slide.addNotes('Slide 4: Beyond Ramps - click-reveal barrier cards. Storyline: Four barrier-type cards (Physical, Communication, Attitudinal, Systemic) use click-to-reveal layers. Healthcare Example panel on right is static. Learner clicks each barrier type to expand details.');
}

// ════════════════════════════════════════════════════════════════════════
// SLIDE 5 — Practice Model (white bg)
// ════════════════════════════════════════════════════════════════════════
{
  const slide = pptx.addSlide();
  addBg(slide, 5);

  txt(slide, 'SECTION 04 \u00B7 THE FOUR AREAS \u2014 USED ACROSS ALL 18 GUIDES', {
    x: px(60), y: py(80), w: px(800), h: py(25),
    fontSize: 10, bold: true, color: RED, charSpacing: 2,
  });

  txt(slide, 'The Accessibility in Practice Model', {
    x: px(60), y: py(110), w: px(1000), h: py(55),
    fontSize: 36, bold: true, color: NAVY, fontFace: 'Arial Black',
  });

  txt(slide, 'A shared model that lets every team \u2014 clinical, administrative, operational, and leadership \u2014 talk about\naccessibility in the same language.', {
    x: px(60), y: py(178), w: px(1000), h: py(45),
    fontSize: 12, color: DKGRAY,
  });

  // 4 practice model cards
  const cardW = px(330), cardH = py(290), cardY = py(270);
  const cardXs = [px(68), px(408), px(740), px(1072)];
  const cardTitles = ['Awareness', 'Communication', 'Environment', 'Response'];
  const cardNums = ['01', '02', '03', '04'];
  const cardDescs = [
    'Recognize that a person may have\nvisible or invisible accessibility needs \u2014\nwithout making them ask first.',
    'Use plain, respectful language and\nconfirm the person\u2019s preferred way to\nreceive information.',
    'Adapt the space so the person can\nmove, see, hear, and rest without\nunnecessary effort.',
    'Adjust your actions in the moment,\ndocument what worked, and pass the\nlearning forward.',
  ];
  const cardBullets = [
    '\u2013 Scan environments and forms.\n\u2013 Notice assistive devices.\n\u2013 Watch your own assumptions.',
    '\u2013 Ask about preferred format.\n\u2013 Speak to the patient, not the companion.\n\u2013 Slow down when needed.',
    '\u2013 Clear paths and seating.\n\u2013 Lighting and signage.\n\u2013 Quiet space if needed.',
    '\u2013 Offer \u2014 don\u2019t impose \u2014 help.\n\u2013 Confirm what worked.\n\u2013 Update the chart or note.',
  ];

  for (let i = 0; i < 4; i++) {
    // Card header bar
    rect(slide, { x: cardXs[i], y: cardY, w: cardW, h: py(55), fill: NAVY, alpha: 85 });
    txt(slide, cardNums[i], {
      x: cardXs[i] + px(45), y: cardY + py(8), w: px(45), h: py(40),
      fontSize: 14, bold: true, color: WHITE, align: 'center', valign: 'middle',
    });
    txt(slide, cardTitles[i], {
      x: cardXs[i] + px(95), y: cardY + py(8), w: px(220), h: py(40),
      fontSize: 16, bold: true, color: WHITE, fontFace: 'Arial Black',
    });

    // Card body
    txt(slide, cardDescs[i], {
      x: cardXs[i] + px(10), y: cardY + py(75), w: cardW - px(20), h: py(80),
      fontSize: 9, color: DKGRAY,
    });

    txt(slide, cardBullets[i], {
      x: cardXs[i] + px(10), y: cardY + py(170), w: cardW - px(20), h: py(90),
      fontSize: 9, color: DKGRAY,
    });
  }

  // Reflection callout
  rect(slide, { x: px(68), y: py(590), w: px(4), h: py(40), fill: RED, alpha: 100 });
  txt(slide, 'REFLECTION', {
    x: px(85), y: py(593), w: px(130), h: py(20),
    fontSize: 9, bold: true, color: RED, charSpacing: 2,
  });
  txt(slide, 'The four areas are not a checklist. They are four lenses you can move between in any interaction \u2014 sometimes within the same minute.', {
    x: px(215), y: py(593), w: px(1100), h: py(35),
    fontSize: 11, color: NAVY,
  });

  // Footer
  txt(slide, '\u25A0 GUIDE 01', { x: px(40), y: py(1020), w: px(100), h: py(20), fontSize: 8, bold: true, color: RED });
  txt(slide, 'FOUNDATIONS OF DISABILITY, INCLUSION & ACCESSIBLE DESIGN', {
    x: px(140), y: py(1020), w: px(600), h: py(20), fontSize: 8, color: LTGRAY, charSpacing: 1,
  });
  txt(slide, 'SLIDE\n05 / 14', { x: px(1310), y: py(1010), w: px(100), h: py(35), fontSize: 9, color: NAVY, align: 'center' });

  slide.addNotes('Slide 5: Practice Model - hotspot interaction with 4 area layers. Storyline: Four clickable hotspot areas (Awareness, Communication, Environment, Response). Each opens a detail layer with expanded content. Learner must visit all 4 before advancing. Reflection callout is static.');
}

// ════════════════════════════════════════════════════════════════════════
// SLIDE 6 — Decision Path (white bg)
// ════════════════════════════════════════════════════════════════════════
{
  const slide = pptx.addSlide();
  addBg(slide, 6);

  txt(slide, 'SECTION 05 \u00B7 5 STEPS \u00B7 CLICK ANY STEP TO LEARN MORE', {
    x: px(60), y: py(80), w: px(700), h: py(25),
    fontSize: 10, bold: true, color: RED, charSpacing: 2,
  });

  txt(slide, 'The Accessibility Decision Path', {
    x: px(60), y: py(110), w: px(900), h: py(55),
    fontSize: 36, bold: true, color: NAVY, fontFace: 'Arial Black',
  });

  txt(slide, 'A repeatable 5-step path you can use whenever an accessibility need appears \u2014 at intake, in the hallway, on a call, or in an exam room.', {
    x: px(60), y: py(178), w: px(1100), h: py(30),
    fontSize: 12, color: DKGRAY,
  });

  // Step circles
  const stepLabels = ['1', '2', '3', '4', '5'];
  const stepTitles = ['Pause & Assess', 'Listen & Ask', 'Apply', 'Adapt', 'Seek Support'];
  const stepDescs = [
    'Notice the situation before you respond.',
    'Let the person describe what they need.',
    'Use the method that fits \u2014 not the default.',
    'Adjust as you learn what is working.',
    'Call in the right colleague or service.',
  ];
  const stepXs = [px(160), px(410), px(670), px(930), px(1200)];
  const stepY = py(270);
  const circleColors = [NAVY, NAVY, RED, LTGRAY, LTGRAY];

  for (let i = 0; i < 5; i++) {
    // Circle (approximate with a shape)
    slide.addShape(pptx.shapes.OVAL, {
      x: stepXs[i], y: stepY, w: px(90), h: py(80),
      fill: { type:'solid', color: circleColors[i], alpha: i < 3 ? 80 : 30 },
      border: { type:'none' },
    });
    txt(slide, stepLabels[i], {
      x: stepXs[i], y: stepY + py(15), w: px(90), h: py(50),
      fontSize: 28, bold: true, color: WHITE, align: 'center', valign: 'middle', fontFace: 'Arial Black',
    });

    txt(slide, stepTitles[i], {
      x: stepXs[i] - px(30), y: stepY + py(95), w: px(150), h: py(25),
      fontSize: 11, bold: true, color: i === 2 ? RED : NAVY, align: 'center',
    });
    txt(slide, stepDescs[i], {
      x: stepXs[i] - px(50), y: stepY + py(120), w: px(200), h: py(35),
      fontSize: 8, color: DKGRAY, align: 'center',
    });
  }

  // Selected step callout
  rect(slide, { x: px(68), y: py(465), w: px(4), h: py(100), fill: RED, alpha: 100 });
  txt(slide, 'STEP 03 \u00B7 SELECTED', {
    x: px(100), y: py(475), w: px(200), h: py(20),
    fontSize: 9, bold: true, color: RED, charSpacing: 2,
  });
  txt(slide, 'APPLY', {
    x: px(100), y: py(498), w: px(180), h: py(35),
    fontSize: 22, bold: true, color: RED, fontFace: 'Arial Black',
  });

  txt(slide, 'Use the method that fits the person, not the default.', {
    x: px(290), y: py(475), w: px(900), h: py(25),
    fontSize: 14, bold: true, color: NAVY,
  });
  txt(slide, 'If the person prefers written communication, switch to a notepad or the patient portal. If they need extra time, give it \u2014 and\ntell colleagues why the visit is running long. Defaults are convenient for systems, not for people.', {
    x: px(290), y: py(505), w: px(900), h: py(50),
    fontSize: 10, color: DKGRAY,
  });

  // Open step button
  rect(slide, { x: px(1210), y: py(490), w: px(160), h: py(45), fill: NAVY, alpha: 85 });
  txt(slide, 'Open step 3 \u2192', {
    x: px(1210), y: py(490), w: px(160), h: py(45),
    fontSize: 11, bold: true, color: WHITE, align: 'center', valign: 'middle',
  });

  // Footer
  txt(slide, '\u25A0 GUIDE 01', { x: px(40), y: py(1020), w: px(100), h: py(20), fontSize: 8, bold: true, color: RED });
  txt(slide, 'SHARED ACROSS ALL 18 GUIDES \u00B7 DECISION PATH', {
    x: px(140), y: py(1020), w: px(600), h: py(20), fontSize: 8, color: LTGRAY, charSpacing: 1,
  });
  txt(slide, 'SLIDE\n06 / 14', { x: px(1310), y: py(1010), w: px(100), h: py(35), fontSize: 9, color: NAVY, align: 'center' });

  slide.addNotes('Slide 6: Decision Path - step interaction with sequential reveal. Storyline: 5 clickable step circles. Each click reveals a detail panel below with expanded content and "Open step" button. Steps can be explored in any order. Step 3 (Apply) shown as selected state example.');
}

// ════════════════════════════════════════════════════════════════════════
// SLIDE 7 — Scenario (white bg)
// ════════════════════════════════════════════════════════════════════════
{
  const slide = pptx.addSlide();
  addBg(slide, 7);

  txt(slide, 'SECTION 06 \u00B7 MAKE A DECISION \u00B7 3 OPTIONS \u00B7 BRANCHING', {
    x: px(60), y: py(80), w: px(700), h: py(25),
    fontSize: 10, bold: true, color: RED, charSpacing: 2,
  });

  txt(slide, [
    { text: 'Scenario \u00B7 A patient at ', options: { color: NAVY, fontSize: 34, bold: true, fontFace: 'Arial Black' }},
    { text: 'reception', options: { color: RED, fontSize: 34, bold: true, fontFace: 'Arial Black' }},
  ], {
    x: px(60), y: py(107), w: px(1000), h: py(55),
  });

  txt(slide, 'You are the first person a patient meets today. The next 30 seconds will shape the rest of their visit.', {
    x: px(60), y: py(178), w: px(900), h: py(25),
    fontSize: 12, color: DKGRAY,
  });

  // Meet Dahlia card
  rect(slide, { x: px(718), y: py(240), w: px(4), h: py(170), fill: NAVY, alpha: 100 });
  txt(slide, 'SCENARIO \u00B7 FOUNDATIONS 01', {
    x: px(735), y: py(255), w: px(600), h: py(20),
    fontSize: 9, bold: true, color: RED, charSpacing: 2,
  });
  txt(slide, 'Meet Dahlia', {
    x: px(735), y: py(280), w: px(400), h: py(30),
    fontSize: 22, bold: true, color: NAVY, fontFace: 'Arial Black',
  });
  txt(slide, 'Dahlia arrives 10 minutes early for an outpatient appointment. As you ask for her health\ncard, she points to her ear, then to a small ASL card on the counter. The clinic is busy and\nyou\u2019re behind on intake.', {
    x: px(735), y: py(320), w: px(620), h: py(70),
    fontSize: 10, color: DKGRAY,
  });

  // Question
  txt(slide, 'What is the most accessible next step?', {
    x: px(718), y: py(425), w: px(600), h: py(30),
    fontSize: 14, bold: true, color: NAVY,
  });

  // Choice A
  rect(slide, { x: px(718), y: py(460), w: px(650), h: py(40), fill: WHITE, alpha: 5 });
  slide.addShape(pptx.shapes.OVAL, {
    x: px(730), y: py(466), w: px(30), h: py(28),
    fill: { type:'solid', color: LTGRAY, alpha: 50 },
    border: { type:'none' },
  });
  txt(slide, 'A', { x: px(730), y: py(466), w: px(30), h: py(28), fontSize: 10, bold: true, color: WHITE, align: 'center', valign: 'middle' });
  txt(slide, 'Speak louder and slower while continuing the intake script.', {
    x: px(770), y: py(466), w: px(580), h: py(28), fontSize: 10, color: DKGRAY, valign: 'middle',
  });

  // Choice B (highlighted)
  rect(slide, { x: px(718), y: py(510), w: px(650), h: py(55), fill: NAVY, alpha: 80 });
  slide.addShape(pptx.shapes.OVAL, {
    x: px(730), y: py(518), w: px(30), h: py(28),
    fill: { type:'solid', color: COBALT, alpha: 80 },
    border: { type:'none' },
  });
  txt(slide, 'B', { x: px(730), y: py(518), w: px(30), h: py(28), fontSize: 10, bold: true, color: WHITE, align: 'center', valign: 'middle' });
  txt(slide, 'Make eye contact, gesture to the seating area, and request an interpreter using the\nbedside iPad before continuing intake.', {
    x: px(770), y: py(516), w: px(580), h: py(45), fontSize: 10, bold: true, color: WHITE,
  });

  // Choice C
  rect(slide, { x: px(718), y: py(575), w: px(650), h: py(40), fill: WHITE, alpha: 5 });
  slide.addShape(pptx.shapes.OVAL, {
    x: px(730), y: py(581), w: px(30), h: py(28),
    fill: { type:'solid', color: LTGRAY, alpha: 50 },
    border: { type:'none' },
  });
  txt(slide, 'C', { x: px(730), y: py(581), w: px(30), h: py(28), fontSize: 10, bold: true, color: WHITE, align: 'center', valign: 'middle' });
  txt(slide, 'Ask the person standing next to her to help translate while you keep working.', {
    x: px(770), y: py(581), w: px(580), h: py(28), fontSize: 10, color: DKGRAY, valign: 'middle',
  });

  // Feedback note
  rect(slide, { x: px(718), y: py(630), w: px(650), h: py(55), fill: WHITE, alpha: 5 });
  txt(slide, [
    { text: 'Feedback appears here after selection. ', options: { fontSize: 10, bold: true, color: RED }},
    { text: 'Each choice opens a brief realistic outcome \u2014 what Dahlia\nexperiences, what the chart records, and which step of the Decision Path it reinforces.', options: { fontSize: 10, color: DKGRAY }},
  ], {
    x: px(725), y: py(638), w: px(630), h: py(45),
  });

  // Footer
  txt(slide, '\u25A0 GUIDE 01', { x: px(40), y: py(1020), w: px(100), h: py(20), fontSize: 8, bold: true, color: RED });
  txt(slide, 'SCENARIO 1 OF 3 \u00B7 RECEPTION \u00B7 COMMUNICATION ACCESSIBILITY', {
    x: px(140), y: py(1020), w: px(600), h: py(20), fontSize: 8, color: LTGRAY, charSpacing: 1,
  });
  txt(slide, 'SLIDE\n07 / 14', { x: px(1310), y: py(1010), w: px(100), h: py(35), fontSize: 9, color: NAVY, align: 'center' });

  slide.addNotes('Slide 7: Scenario - decision branch with 3 choices and feedback layers. Storyline: Branching scenario with 3 choice buttons (A, B, C). Each choice triggers a unique feedback layer. Choice B is the recommended/correct response. Feedback panel shows realistic outcome, chart impact, and Decision Path step reinforced.');
}

// ════════════════════════════════════════════════════════════════════════
// SLIDE 8 — Knowledge Check (white bg)
// ════════════════════════════════════════════════════════════════════════
{
  const slide = pptx.addSlide();
  addBg(slide, 8);

  txt(slide, 'SECTION 07 \u00B7 CHOOSE THE BEST RESPONSE', {
    x: px(60), y: py(80), w: px(500), h: py(25),
    fontSize: 10, bold: true, color: RED, charSpacing: 2,
  });

  txt(slide, 'Knowledge Check', {
    x: px(60), y: py(110), w: px(600), h: py(55),
    fontSize: 36, bold: true, color: NAVY, fontFace: 'Arial Black',
  });

  txt(slide, 'A short check-in. Choose the response that best reflects the foundations of accessible care at UHN.', {
    x: px(60), y: py(178), w: px(800), h: py(25),
    fontSize: 12, color: DKGRAY,
  });

  // QUESTION label
  txt(slide, 'QUESTION', {
    x: px(60), y: py(235), w: px(120), h: py(20),
    fontSize: 9, bold: true, color: GREEN, charSpacing: 2,
  });

  txt(slide, 'Which model of disability focuses on barriers in the\nenvironment, rather than on individual deficits?', {
    x: px(60), y: py(260), w: px(600), h: py(55),
    fontSize: 16, bold: true, color: NAVY,
  });

  // Options
  const optY = [py(340), py(400), py(465), py(535)];
  const optLabels = ['A', 'B', 'C', 'D'];
  const optTexts = ['The medical model', 'The social / environmental model', 'The charity model', 'The rehabilitation model'];
  const optColors = [LTGRAY, GREEN, RED, LTGRAY];
  const optBgs = [0, 15, 15, 0];

  for (let i = 0; i < 4; i++) {
    rect(slide, { x: px(80), y: optY[i], w: px(690), h: py(50), fill: optColors[i], alpha: optBgs[i] });
    slide.addShape(pptx.shapes.OVAL, {
      x: px(90), y: optY[i] + py(10), w: px(30), h: py(28),
      fill: { type:'solid', color: optColors[i], alpha: 60 },
      border: { type:'none' },
    });
    txt(slide, optLabels[i], {
      x: px(90), y: optY[i] + py(10), w: px(30), h: py(28),
      fontSize: 10, bold: true, color: WHITE, align: 'center', valign: 'middle',
    });
    txt(slide, optTexts[i], {
      x: px(130), y: optY[i] + py(10), w: px(500), h: py(28),
      fontSize: 11, color: DKGRAY, valign: 'middle', bold: i === 1,
    });

    if (i === 1) {
      txt(slide, 'Correct', {
        x: px(670), y: optY[i] + py(12), w: px(80), h: py(24),
        fontSize: 9, bold: true, color: WHITE, align: 'center', valign: 'middle',
      });
      rect(slide, { x: px(670), y: optY[i] + py(12), w: px(80), h: py(24), fill: GREEN, alpha: 80 });
    }
    if (i === 2) {
      txt(slide, 'Incorrect', {
        x: px(660), y: optY[i] + py(12), w: px(90), h: py(24),
        fontSize: 9, bold: true, color: WHITE, align: 'center', valign: 'middle',
      });
      rect(slide, { x: px(660), y: optY[i] + py(12), w: px(90), h: py(24), fill: RED, alpha: 80 });
    }
  }

  // State indicators
  txt(slide, 'State: Correct', { x: px(80), y: py(610), w: px(120), h: py(20), fontSize: 9, bold: true, color: GREEN });
  txt(slide, 'Chartreuse panel \u00B7 advance enabled', { x: px(200), y: py(610), w: px(250), h: py(20), fontSize: 9, color: LTGRAY });
  txt(slide, 'State: Incorrect', { x: px(440), y: py(610), w: px(120), h: py(20), fontSize: 9, bold: true, color: RED });
  txt(slide, 'Red panel \u00B7 "Try again" hint', { x: px(570), y: py(610), w: px(250), h: py(20), fontSize: 9, color: LTGRAY });

  // Correct answer feedback panel
  rect(slide, { x: px(830), y: py(245), w: px(540), h: py(55), fill: GREEN, alpha: 80 });
  txt(slide, '\u2714  That\u2019s right \u2014 well done.', {
    x: px(850), y: py(250), w: px(500), h: py(40),
    fontSize: 14, bold: true, color: WHITE, valign: 'middle',
  });

  txt(slide, [
    { text: 'The ', options: { fontSize: 10, color: DKGRAY }},
    { text: 'social / environmental model', options: { fontSize: 10, color: DKGRAY, bold: true }},
    { text: ' places responsibility on systems, spaces, and\nattitudes \u2014 not on the person.', options: { fontSize: 10, color: DKGRAY }},
  ], {
    x: px(845), y: py(310), w: px(520), h: py(45),
  });

  txt(slide, 'At UHN, this is the model behind the Accessibility in Practice framework: if the\nbuilding, the form, or the staff response is the barrier, those are the things we\nchange first.', {
    x: px(845), y: py(355), w: px(520), h: py(60),
    fontSize: 10, color: DKGRAY,
  });

  txt(slide, [
    { text: 'If incorrect: ', options: { fontSize: 10, color: RED, bold: true }},
    { text: 'the panel turns red with a brief explanation of the chosen model\nand a "Try again" button. After 2 attempts the correct answer is revealed.', options: { fontSize: 10, color: DKGRAY }},
  ], {
    x: px(845), y: py(445), w: px(520), h: py(45),
  });

  // Footer
  txt(slide, '\u25A0 KNOWLEDGE CHECK', { x: px(40), y: py(1020), w: px(150), h: py(20), fontSize: 8, bold: true, color: RED });
  txt(slide, 'Q1 \u00B7 1 OF 1 ATTEMPTS \u00B7 WEIGHT 5% TOWARD COMPLETION', {
    x: px(190), y: py(1020), w: px(600), h: py(20), fontSize: 8, color: LTGRAY, charSpacing: 1,
  });
  txt(slide, 'SLIDE\n08 / 14', { x: px(1310), y: py(1010), w: px(100), h: py(35), fontSize: 9, color: NAVY, align: 'center' });

  slide.addNotes('Slide 8: Knowledge Check - graded multiple choice quiz. Storyline: Graded MC question. Correct answer: B (social/environmental model). Max 2 attempts. Correct state shows green panel with explanation. Incorrect state shows red panel with model-specific feedback and "Try again" button. After 2 failed attempts, correct answer is revealed. Weight: 5% toward completion.');
}

// ════════════════════════════════════════════════════════════════════════
// SLIDE 9 — Inclusive Practice Tip (white bg)
// ════════════════════════════════════════════════════════════════════════
{
  const slide = pptx.addSlide();
  addBg(slide, 9);

  txt(slide, 'SECTION 08 \u00B7 POSITIVE GUIDANCE \u2014 DO THIS', {
    x: px(60), y: py(80), w: px(600), h: py(25),
    fontSize: 10, bold: true, color: GREEN, charSpacing: 2,
  });

  txt(slide, 'Inclusive Practice Tip', {
    x: px(60), y: py(110), w: px(700), h: py(55),
    fontSize: 36, bold: true, color: NAVY, fontFace: 'Arial Black',
  });

  txt(slide, 'One small habit that compounds across every shift, every team, and every patient interaction at UHN.', {
    x: px(60), y: py(178), w: px(1000), h: py(25),
    fontSize: 12, color: DKGRAY,
  });

  // Practice tip label
  txt(slide, '\u25CF  PRACTICE TIP \u00B7 01 OF 18', {
    x: px(90), y: py(255), w: px(300), h: py(20),
    fontSize: 9, bold: true, color: GREEN, charSpacing: 2,
  });

  // Main heading
  txt(slide, 'Ask, don\u2019t assume \u2014 and confirm\nwhat works.', {
    x: px(90), y: py(290), w: px(600), h: py(85),
    fontSize: 28, bold: true, color: NAVY, fontFace: 'Arial Black',
  });

  txt(slide, 'Before adjusting anything for a patient, ask them how they would prefer to be\nsupported. Then confirm out loud that what you tried is working.', {
    x: px(90), y: py(380), w: px(600), h: py(45),
    fontSize: 11, color: DKGRAY,
  });

  // 3 action items
  const actionY = [py(440), py(495), py(560)];
  const actionTitles = ['Ask the question first.', 'Offer specific support, not vague help.', 'Confirm what worked.'];
  const actionDescs = [
    '"Is there anything I can do to make this easier for you today?"',
    '"Would you like me to read the form aloud, or\nwould a large-print copy work better?"',
    '"Was that pace okay, or shall I slow down?" Then note it in the\nchart for next time.',
  ];

  for (let i = 0; i < 3; i++) {
    txt(slide, '\u2192', { x: px(100), y: actionY[i] + py(5), w: px(25), h: py(20), fontSize: 12, color: NAVY });
    txt(slide, actionTitles[i], {
      x: px(135), y: actionY[i], w: px(550), h: py(22),
      fontSize: 11, bold: true, color: NAVY,
    });
    txt(slide, actionDescs[i], {
      x: px(135), y: actionY[i] + py(22), w: px(550), h: py(40),
      fontSize: 10, color: DKGRAY, italic: true,
    });
  }

  // Interactive infographic
  txt(slide, 'INTERACTIVE INFOGRAPHIC', {
    x: px(770), y: py(240), w: px(300), h: py(20),
    fontSize: 9, bold: true, color: NAVY, charSpacing: 2,
  });
  txt(slide, 'Click a node \u2192', {
    x: px(1250), y: py(240), w: px(120), h: py(20),
    fontSize: 9, color: LTGRAY,
  });

  // Nodes
  const nodeLabels = [
    { n: '01', t: 'Ask', x: px(785), y: py(280) },
    { n: '02', t: 'Offer', x: px(1250), y: py(280) },
    { n: '03', t: 'Confirm', x: px(785), y: py(420) },
    { n: '04', t: 'Document', x: px(1250), y: py(420) },
  ];
  for (const nd of nodeLabels) {
    rect(slide, { x: nd.x, y: nd.y, w: px(100), h: py(70), fill: WHITE, alpha: 10 });
    txt(slide, nd.n, { x: nd.x + px(5), y: nd.y + py(5), w: px(30), h: py(15), fontSize: 8, color: GREEN });
    txt(slide, nd.t, { x: nd.x + px(5), y: nd.y + py(20), w: px(90), h: py(25), fontSize: 13, bold: true, color: GREEN });
  }

  // Compound effect center
  rect(slide, { x: px(970), y: py(350), w: px(200), h: py(60), fill: GREEN, alpha: 15 });
  txt(slide, 'COMPOUND EFFECT\n1 habit \u00D7 every patient', {
    x: px(970), y: py(355), w: px(200), h: py(50),
    fontSize: 9, bold: true, color: GREEN, align: 'center', charSpacing: 1,
  });

  // Patient advisor quote
  rect(slide, { x: px(765), y: py(525), w: px(610), h: py(130), fill: NAVY, alpha: 85 });
  txt(slide, 'FROM A UHN PATIENT ADVISOR', {
    x: px(785), y: py(540), w: px(400), h: py(20),
    fontSize: 9, bold: true, color: LTGRAY, charSpacing: 2,
  });
  txt(slide, '\u201CThe single best thing a clinician ever did for me was ask, before they did\nanything. It is the smallest thing and it changes everything.\u201D', {
    x: px(785), y: py(565), w: px(570), h: py(55),
    fontSize: 13, bold: true, color: WHITE, italic: true,
  });
  txt(slide, '\u2014 D. K. \u00B7 UHN Patient & Family Advisor', {
    x: px(785), y: py(625), w: px(400), h: py(20),
    fontSize: 9, bold: true, color: LTGRAY, charSpacing: 1,
  });

  // Footer
  txt(slide, '\u25A0 PRACTICE TIP', { x: px(40), y: py(1020), w: px(120), h: py(20), fontSize: 8, bold: true, color: RED });
  txt(slide, 'REPEATED AT THE SAME POINT IN EVERY GUIDE \u00B7 1 TIP PER MODULE', {
    x: px(160), y: py(1020), w: px(600), h: py(20), fontSize: 8, color: LTGRAY, charSpacing: 1,
  });
  txt(slide, 'SLIDE\n09 / 14', { x: px(1310), y: py(1010), w: px(100), h: py(35), fontSize: 9, color: NAVY, align: 'center' });

  slide.addNotes('Slide 9: Inclusive Practice Tip - click-reveal 3 steps. Storyline: Three action items (Ask, Offer, Confirm) with click-to-reveal interaction. Interactive infographic on right with 4 clickable nodes showing compound effect. Patient advisor quote is static. Each guide has 1 practice tip at this position.');
}

// ════════════════════════════════════════════════════════════════════════
// SLIDE 10 — MAP Activity (white bg)
// ════════════════════════════════════════════════════════════════════════
{
  const slide = pptx.addSlide();
  addBg(slide, 10);

  txt(slide, 'SECTION 09 \u00B7 A QUIET MOMENT TO COMMIT \u00B7 3 FIELDS', {
    x: px(60), y: py(80), w: px(700), h: py(25),
    fontSize: 10, bold: true, color: PINK, charSpacing: 2,
  });

  txt(slide, [
    { text: 'My Action Planning ', options: { color: NAVY, fontSize: 36, bold: true, fontFace: 'Arial Black' }},
    { text: '(MAP)', options: { color: LILAC, fontSize: 36, bold: true, fontFace: 'Arial Black' }},
  ], {
    x: px(60), y: py(110), w: px(700), h: py(55),
  });

  txt(slide, 'Before you close this guide, name three small commitments. Your MAP saves to your learner profile and\ntravels with you across the 18 guides.', {
    x: px(60), y: py(178), w: px(900), h: py(45),
    fontSize: 12, color: DKGRAY,
  });

  // Subtitle
  txt(slide, [
    { text: 'Three lines. Five minutes. ', options: { color: NAVY, fontSize: 22, bold: true, fontFace: 'Arial Black' }},
    { text: 'A\ndifferent next shift.', options: { color: LILAC, fontSize: 22, bold: true, fontFace: 'Arial Black' }},
  ], {
    x: px(60), y: py(265), w: px(600), h: py(75),
  });

  txt(slide, 'MAP is intentionally short and private. It is for you \u2014 not for review\nby your manager. The system stores only what you choose to save.', {
    x: px(60), y: py(360), w: px(550), h: py(40),
    fontSize: 10, color: DKGRAY,
  });

  txt(slide, 'You can return to your MAP at any time from the learner dashboard\nand update it after a real patient interaction.', {
    x: px(60), y: py(420), w: px(550), h: py(40),
    fontSize: 10, color: DKGRAY,
  });

  // Metadata
  txt(slide, 'SAVED TO', { x: px(60), y: py(500), w: px(200), h: py(15), fontSize: 8, bold: true, color: PINK, charSpacing: 2 });
  txt(slide, 'My UHN learner profile', { x: px(60), y: py(518), w: px(200), h: py(15), fontSize: 9, color: DKGRAY });

  txt(slide, 'PRIVACY', { x: px(290), y: py(500), w: px(200), h: py(15), fontSize: 8, bold: true, color: PINK, charSpacing: 2 });
  txt(slide, 'Private \u00B7 not visible to manager', { x: px(290), y: py(518), w: px(250), h: py(15), fontSize: 9, color: DKGRAY });

  txt(slide, 'REUSABLE ACROSS', { x: px(60), y: py(570), w: px(200), h: py(15), fontSize: 8, bold: true, color: PINK, charSpacing: 2 });
  txt(slide, 'All 18 guides in the series', { x: px(60), y: py(588), w: px(200), h: py(15), fontSize: 9, color: DKGRAY });

  txt(slide, 'DOWNLOAD', { x: px(290), y: py(570), w: px(200), h: py(15), fontSize: 8, bold: true, color: PINK, charSpacing: 2 });
  txt(slide, 'PDF \u00B7 printable wallet card', { x: px(290), y: py(588), w: px(250), h: py(15), fontSize: 9, color: DKGRAY });

  // STOP field
  rect(slide, { x: px(770), y: py(280), w: px(80), h: py(28), fill: RED, alpha: 80 });
  txt(slide, 'STOP', { x: px(770), y: py(280), w: px(80), h: py(28), fontSize: 9, bold: true, color: WHITE, align: 'center', valign: 'middle' });
  txt(slide, 'One thing I will stop doing', {
    x: px(860), y: py(280), w: px(500), h: py(28), fontSize: 13, bold: true, color: NAVY, valign: 'middle',
  });
  txt(slide, 'Type your response \u00B7 e.g. "I will stop speaking to the companion when the patient is present."', {
    x: px(775), y: py(318), w: px(590), h: py(25), fontSize: 9, color: LTGRAY, italic: true,
  });

  // START field
  rect(slide, { x: px(770), y: py(400), w: px(80), h: py(28), fill: CHARTR, alpha: 80 });
  txt(slide, 'START', { x: px(770), y: py(400), w: px(80), h: py(28), fontSize: 9, bold: true, color: WHITE, align: 'center', valign: 'middle' });
  txt(slide, 'One thing I will start doing', {
    x: px(860), y: py(400), w: px(500), h: py(28), fontSize: 13, bold: true, color: NAVY, valign: 'middle',
  });
  txt(slide, 'I will ask every patient at intake if there is anything I can do to make the visit easier.', {
    x: px(775), y: py(440), w: px(590), h: py(25), fontSize: 9, color: DKGRAY,
  });

  // CONTINUE field
  rect(slide, { x: px(770), y: py(525), w: px(110), h: py(28), fill: LILAC, alpha: 80 });
  txt(slide, 'CONTINUE', { x: px(770), y: py(525), w: px(110), h: py(28), fontSize: 9, bold: true, color: WHITE, align: 'center', valign: 'middle' });
  txt(slide, 'One thing I will continue doing', {
    x: px(890), y: py(525), w: px(500), h: py(28), fontSize: 13, bold: true, color: NAVY, valign: 'middle',
  });
  txt(slide, 'Type your response \u00B7 optional', {
    x: px(775), y: py(565), w: px(590), h: py(25), fontSize: 9, color: LTGRAY, italic: true,
  });

  // Buttons
  rect(slide, { x: px(770), y: py(640), w: px(300), h: py(45), fill: WHITE, alpha: 5 });
  txt(slide, 'Download as PDF', {
    x: px(770), y: py(640), w: px(300), h: py(45),
    fontSize: 11, bold: true, color: NAVY, align: 'center', valign: 'middle',
  });

  rect(slide, { x: px(1090), y: py(640), w: px(290), h: py(45), fill: LILAC, alpha: 70 });
  txt(slide, 'Save my MAP \u2192', {
    x: px(1090), y: py(640), w: px(290), h: py(45),
    fontSize: 11, bold: true, color: WHITE, align: 'center', valign: 'middle',
  });

  // Footer
  txt(slide, '\u25A0 MAP ACTIVITY', { x: px(40), y: py(1020), w: px(120), h: py(20), fontSize: 8, bold: true, color: PINK });
  txt(slide, 'CLOSING REFLECTION \u00B7 SAME STRUCTURE FOR EVERY GUIDE', {
    x: px(170), y: py(1020), w: px(600), h: py(20), fontSize: 8, color: LTGRAY, charSpacing: 1,
  });
  txt(slide, 'SLIDE\n10 / 14', { x: px(1310), y: py(1010), w: px(100), h: py(35), fontSize: 9, color: NAVY, align: 'center' });

  slide.addNotes('Slide 10: MAP Activity - text entry with 3 fields, ungraded. Storyline: Three text-entry fields (Stop, Start, Continue). Ungraded \u2014 private reflection. "Save my MAP" button stores to learner profile via LMS. "Download as PDF" generates printable wallet card. Same structure used in all 18 guides.');
}

// ════════════════════════════════════════════════════════════════════════
// SLIDE 11 — Key Takeaways (white bg)
// ════════════════════════════════════════════════════════════════════════
{
  const slide = pptx.addSlide();
  addBg(slide, 11);

  txt(slide, 'SECTION 10 \u00B7 WHAT TO CARRY INTO TOMORROW\u2019S SHIFT', {
    x: px(60), y: py(80), w: px(700), h: py(25),
    fontSize: 10, bold: true, color: RED, charSpacing: 2,
  });

  txt(slide, [
    { text: 'Key Takeaways from ', options: { color: NAVY, fontSize: 36, bold: true, fontFace: 'Arial Black' }},
    { text: 'Guide 01', options: { color: RED, fontSize: 36, bold: true, fontFace: 'Arial Black' }},
  ], {
    x: px(60), y: py(110), w: px(900), h: py(55),
  });

  txt(slide, 'Four ideas to hold on to \u2014 and one downloadable job aid you can keep at your workstation.', {
    x: px(60), y: py(178), w: px(900), h: py(25),
    fontSize: 12, color: DKGRAY,
  });

  // Takeaway cards - row 1
  const tkCards = [
    { num: '01', title: 'Accessibility is broader than the building.', desc: 'Most barriers at UHN are attitudinal, communication-based, or\nsystemic \u2014 not physical. Treat all four the same way.', link: 'Linked to \u00B7 Slide 04', x: px(60), y: py(240) },
    { num: '02', title: 'Use four areas, every time.', desc: 'Awareness, Communication, Environment, Response \u2014 a shared\nmodel across every guide and every role at UHN.', link: 'Linked to \u00B7 Slide 05', x: px(510), y: py(240) },
    { num: '03', title: 'Pause, listen, apply, adapt, seek support.', desc: 'The 5-step Decision Path makes any accessibility decision\nrepeatable \u2014 from intake to discharge.', link: 'Linked to \u00B7 Slide 06', x: px(960), y: py(240) },
  ];

  for (const tk of tkCards) {
    rect(slide, { x: tk.x, y: tk.y, w: px(420), h: py(150), fill: WHITE, alpha: 5 });
    txt(slide, `TAKEAWAY ${tk.num}`, {
      x: tk.x + px(15), y: tk.y + py(15), w: px(200), h: py(20),
      fontSize: 9, bold: true, color: RED, charSpacing: 2,
    });
    txt(slide, tk.title, {
      x: tk.x + px(15), y: tk.y + py(38), w: px(390), h: py(30),
      fontSize: 14, bold: true, color: NAVY,
    });
    txt(slide, tk.desc, {
      x: tk.x + px(15), y: tk.y + py(72), w: px(390), h: py(40),
      fontSize: 9, color: DKGRAY,
    });
    txt(slide, tk.link, {
      x: tk.x + px(15), y: tk.y + py(120), w: px(200), h: py(15),
      fontSize: 8, color: LTGRAY,
    });
  }

  // Row 2
  const tkCards2 = [
    { num: '04', title: 'Ask before you adjust.', desc: 'The patient is the expert on their own needs. Your job is to make\nspace for them to tell you what works.', link: 'Linked to \u00B7 Slides 07 & 09', x: px(60), y: py(400) },
    { num: '05', title: 'Document what worked.', desc: 'A short note in the chart turns one good interaction into a pattern\nthe next colleague can follow.', link: 'Linked to \u00B7 Practice Tip', x: px(510), y: py(400) },
    { label: 'REFLECTION', title: 'Which takeaway would change one thing\nabout your next shift?', desc: 'Hold this question in mind as you close the guide \u2014 your MAP is\none click away.', link: 'Linked to \u00B7 Slide 10', x: px(960), y: py(400) },
  ];

  for (const tk of tkCards2) {
    rect(slide, { x: tk.x, y: tk.y, w: px(420), h: py(150), fill: WHITE, alpha: 5 });
    if (tk.label === 'REFLECTION') {
      rect(slide, { x: tk.x, y: tk.y, w: px(4), h: py(150), fill: NAVY, alpha: 100 });
    }
    txt(slide, tk.label || `TAKEAWAY ${tk.num}`, {
      x: tk.x + px(15), y: tk.y + py(15), w: px(200), h: py(20),
      fontSize: 9, bold: true, color: tk.label ? NAVY : RED, charSpacing: 2,
    });
    txt(slide, tk.title, {
      x: tk.x + px(15), y: tk.y + py(38), w: px(390), h: py(40),
      fontSize: 14, bold: true, color: NAVY,
    });
    txt(slide, tk.desc, {
      x: tk.x + px(15), y: tk.y + py(82), w: px(390), h: py(40),
      fontSize: 9, color: DKGRAY,
    });
    txt(slide, tk.link, {
      x: tk.x + px(15), y: tk.y + py(125), w: px(200), h: py(15),
      fontSize: 8, color: LTGRAY,
    });
  }

  // Job aid download bar
  rect(slide, { x: px(60), y: py(590), w: px(540), h: py(80), fill: WHITE, alpha: 5 });
  txt(slide, 'PDF', {
    x: px(75), y: py(605), w: px(50), h: py(50),
    fontSize: 18, bold: true, color: COBALT, align: 'center', valign: 'middle',
  });
  txt(slide, 'Foundations Job Aid \u00B7 Pocket Card', {
    x: px(135), y: py(600), w: px(350), h: py(22),
    fontSize: 12, bold: true, color: NAVY,
  });
  txt(slide, 'Decision Path \u00B7 4 Areas \u00B7 Practice Tip \u00B7 1 page \u00B7 8.5\n\u00D7 11', {
    x: px(135), y: py(625), w: px(280), h: py(35),
    fontSize: 9, color: DKGRAY,
  });

  // Download button
  rect(slide, { x: px(440), y: py(610), w: px(130), h: py(40), fill: COBALT, alpha: 80 });
  txt(slide, 'DOWNLOAD \u2193', {
    x: px(440), y: py(610), w: px(130), h: py(40),
    fontSize: 10, bold: true, color: WHITE, align: 'center', valign: 'middle',
  });

  // Back to MAP & Complete Module buttons
  rect(slide, { x: px(615), y: py(590), w: px(380), h: py(80), fill: WHITE, alpha: 5 });
  txt(slide, '\u2190 BACK TO MAP', {
    x: px(615), y: py(590), w: px(380), h: py(80),
    fontSize: 14, bold: true, color: NAVY, align: 'center', valign: 'middle',
  });

  rect(slide, { x: px(1005), y: py(590), w: px(380), h: py(80), fill: RED, alpha: 80 });
  txt(slide, 'COMPLETE MODULE \u203A', {
    x: px(1005), y: py(590), w: px(380), h: py(80),
    fontSize: 14, bold: true, color: WHITE, align: 'center', valign: 'middle',
  });

  // Footer
  txt(slide, '\u25A0 GUIDE 01', { x: px(40), y: py(1020), w: px(100), h: py(20), fontSize: 8, bold: true, color: RED });
  txt(slide, 'ESTIMATED READING: 2 MINUTES \u00B7 JOB AID: 1 PAGE', {
    x: px(140), y: py(1020), w: px(600), h: py(20), fontSize: 8, color: LTGRAY, charSpacing: 1,
  });
  txt(slide, 'SLIDE\n11 / 14', { x: px(1310), y: py(1010), w: px(100), h: py(35), fontSize: 9, color: NAVY, align: 'center' });

  slide.addNotes('Slide 11: Key Takeaways - static content + job aid download trigger. Storyline: Five takeaway cards + one reflection card displayed statically. "Download" button triggers job aid PDF download (Storyline trigger to open URL or download resource). "Back to MAP" returns to slide 10. "Complete Module" advances to next slide.');
}

// ════════════════════════════════════════════════════════════════════════
// SLIDE 12 — Listen & Reflect (navy bg)
// ════════════════════════════════════════════════════════════════════════
{
  const slide = pptx.addSlide();
  addBg(slide, 12);

  txt(slide, 'SECTION 11 \u00B7 AUDIO LEARNING \u00B7 2 MIN 30 SEC', {
    x: px(60), y: py(80), w: px(600), h: py(25),
    fontSize: 10, bold: true, color: RED, charSpacing: 2,
  });

  txt(slide, [
    { text: 'Listen and Reflect: ', options: { color: NAVY, fontSize: 34, bold: true, fontFace: 'Arial Black' }},
    { text: 'Accessibility in Everyday Care', options: { color: RED, fontSize: 34, bold: true, fontFace: 'Arial Black' }},
  ], {
    x: px(60), y: py(108), w: px(1200), h: py(55),
  });

  txt(slide, 'A short patient-advisor reflection on what good accessibility actually feels like at the front desk. Captions\nand a full transcript are always available.', {
    x: px(60), y: py(178), w: px(1000), h: py(45),
    fontSize: 12, color: DKGRAY,
  });

  // Audio player area
  rect(slide, { x: px(68), y: py(250), w: px(665), h: py(400), fill: NAVY, alpha: 85 });
  txt(slide, 'EPISODE 01 OF 18 \u00B7 FOUNDATIONS', {
    x: px(85), y: py(270), w: px(400), h: py(20),
    fontSize: 9, bold: true, color: WHITE, charSpacing: 2,
  });

  txt(slide, 'A patient advisor on dignity at intake', {
    x: px(85), y: py(430), w: px(550), h: py(35),
    fontSize: 18, bold: true, color: WHITE,
  });

  // Play button circle
  slide.addShape(pptx.shapes.OVAL, {
    x: px(95), y: py(495), w: px(55), h: py(50),
    fill: { type:'solid', color: WHITE, alpha: 60 },
    border: { type:'none' },
  });
  txt(slide, '\u25B6', { x: px(95), y: py(495), w: px(55), h: py(50), fontSize: 18, color: NAVY, align: 'center', valign: 'middle' });

  txt(slide, 'Dignity starts before the appointment.', {
    x: px(165), y: py(498), w: px(500), h: py(22),
    fontSize: 14, bold: true, color: WHITE,
  });
  txt(slide, 'D. K. \u00B7 UHN Patient & Family Advisor', {
    x: px(165), y: py(522), w: px(400), h: py(18),
    fontSize: 9, color: LTGRAY,
  });

  txt(slide, '0:53 / 2:30', {
    x: px(570), y: py(500), w: px(140), h: py(25),
    fontSize: 12, bold: true, color: WHITE, align: 'right',
  });

  // Controls
  txt(slide, 'CC Captions on', { x: px(95), y: py(580), w: px(100), h: py(25), fontSize: 8, color: WHITE });
  txt(slide, '1.0\u00D7', { x: px(205), y: py(580), w: px(40), h: py(25), fontSize: 8, color: WHITE });
  txt(slide, 'Open transcript', { x: px(255), y: py(580), w: px(100), h: py(25), fontSize: 8, color: WHITE });
  txt(slide, 'Download \u00B7 MP3', { x: px(580), y: py(580), w: px(120), h: py(25), fontSize: 8, color: WHITE });

  // Key Listening Points
  txt(slide, 'KEY LISTENING POINTS', {
    x: px(770), y: py(278), w: px(300), h: py(20),
    fontSize: 9, bold: true, color: NAVY, charSpacing: 2,
  });
  txt(slide, 'Three moments to listen for', {
    x: px(770), y: py(305), w: px(500), h: py(25),
    fontSize: 14, bold: true, color: NAVY,
  });

  txt(slide, '00:18', { x: px(775), y: py(340), w: px(50), h: py(18), fontSize: 9, bold: true, color: COBALT });
  txt(slide, 'Why a tone of voice at intake matters more than the form.', { x: px(830), y: py(340), w: px(500), h: py(18), fontSize: 10, color: DKGRAY });

  txt(slide, '01:02', { x: px(775), y: py(375), w: px(50), h: py(18), fontSize: 9, bold: true, color: COBALT });
  txt(slide, 'How "ask, then confirm" prevented a wrong assumption.', { x: px(830), y: py(375), w: px(500), h: py(18), fontSize: 10, color: DKGRAY });

  txt(slide, '01:54', { x: px(775), y: py(410), w: px(50), h: py(18), fontSize: 9, bold: true, color: COBALT });
  txt(slide, 'One sentence every staff member can use on a busy shift.', { x: px(830), y: py(410), w: px(500), h: py(18), fontSize: 10, color: DKGRAY });

  // Reflection prompt
  rect(slide, { x: px(755), y: py(475), w: px(610), h: py(110), fill: PINK, alpha: 20 });
  txt(slide, 'REFLECTION PROMPT \u00B7 AFTER LISTENING', {
    x: px(775), y: py(488), w: px(400), h: py(20),
    fontSize: 9, bold: true, color: PINK, charSpacing: 2,
  });
  txt(slide, 'Think of one patient interaction this week. Which moment would have shifted if you\nhad paused to ask, before you acted?', {
    x: px(775), y: py(515), w: px(570), h: py(50),
    fontSize: 12, bold: true, color: NAVY,
  });

  // Footer
  txt(slide, '\u25A0 AUDIO MODULE', { x: px(40), y: py(1020), w: px(130), h: py(20), fontSize: 8, bold: true, color: RED });
  txt(slide, 'TRANSCRIPT & CAPTIONS ALWAYS ON \u00B7 DOWNLOADABLE MP3', {
    x: px(170), y: py(1020), w: px(600), h: py(20), fontSize: 8, color: LTGRAY, charSpacing: 1,
  });
  txt(slide, 'SLIDE\n12 / 14', { x: px(1310), y: py(1010), w: px(100), h: py(35), fontSize: 9, color: NAVY, align: 'center' });

  slide.addNotes('Slide 12: Listen & Reflect - audio embed + transcript layer. Storyline: Embedded audio player (2:30 duration). Auto-captions enabled by default. "Open transcript" button opens a scrollable transcript layer. Play/pause, speed control (1.0x), and download buttons. Reflection prompt appears after audio completes or on manual advance. Key listening points with timestamps are static reference.');
}

// ════════════════════════════════════════════════════════════════════════
// SLIDE 13 — Branching Scenario (white bg)
// ════════════════════════════════════════════════════════════════════════
{
  const slide = pptx.addSlide();
  addBg(slide, 13);

  txt(slide, 'SECTION 12 \u00B7 BRANCHING DECISION ACTIVITY', {
    x: px(60), y: py(80), w: px(600), h: py(25),
    fontSize: 10, bold: true, color: RED, charSpacing: 2,
  });

  txt(slide, [
    { text: 'Choose the ', options: { color: NAVY, fontSize: 34, bold: true, fontFace: 'Arial Black' }},
    { text: 'best accessibility response', options: { color: RED, fontSize: 34, bold: true, fontFace: 'Arial Black' }},
  ], {
    x: px(60), y: py(108), w: px(1100), h: py(55),
  });

  txt(slide, 'Three first-step options. One is recommended. Each opens a different consequence panel \u2014 then loops\nback to the Accessibility Decision Path.', {
    x: px(60), y: py(178), w: px(1000), h: py(45),
    fontSize: 12, color: DKGRAY,
  });

  // Scenario box
  rect(slide, { x: px(68), y: py(260), w: px(4), h: py(70), fill: RED, alpha: 100 });
  txt(slide, 'SCENARIO \u00B7 INTAKE', {
    x: px(85), y: py(268), w: px(200), h: py(20),
    fontSize: 9, bold: true, color: RED, charSpacing: 2,
  });
  txt(slide, 'The patient is frustrated trying to complete the intake form.', {
    x: px(270), y: py(262), w: px(900), h: py(25),
    fontSize: 16, bold: true, color: NAVY,
  });
  txt(slide, 'You don\u2019t yet know whether the barrier is vision, language, digital access, cognitive load, or something else. The lobby is busy and three people are waiting behind them.', {
    x: px(270), y: py(290), w: px(900), h: py(25),
    fontSize: 10, color: DKGRAY,
  });

  // Time on task
  txt(slide, 'Time on task\n3 minutes', {
    x: px(1290), y: py(268), w: px(100), h: py(40),
    fontSize: 9, bold: true, color: RED, align: 'right',
  });

  // Decision panel (dark)
  rect(slide, { x: px(90), y: py(365), w: px(530), h: py(150), fill: NAVY, alpha: 85 });
  txt(slide, 'DECISION \u00B7 FIRST STEP', {
    x: px(110), y: py(378), w: px(300), h: py(18),
    fontSize: 9, bold: true, color: LTGRAY, charSpacing: 2,
  });
  txt(slide, 'What do you do next, before assuming the\ncause?', {
    x: px(110), y: py(400), w: px(490), h: py(50),
    fontSize: 18, bold: true, color: WHITE, fontFace: 'Arial Black',
  });
  txt(slide, 'Pick the option that best reflects "Pause & Assess" \u2014 the first step of the Accessibility Decision\nPath.', {
    x: px(110), y: py(460), w: px(490), h: py(40),
    fontSize: 9, color: LTGRAY,
  });

  // Choice A
  rect(slide, { x: px(635), y: py(370), w: px(740), h: py(45), fill: WHITE, alpha: 5 });
  slide.addShape(pptx.shapes.OVAL, {
    x: px(642), y: py(377), w: px(28), h: py(28),
    fill: { type:'solid', color: LTGRAY, alpha: 50 },
    border: { type:'none' },
  });
  txt(slide, 'A', { x: px(642), y: py(377), w: px(28), h: py(28), fontSize: 10, bold: true, color: WHITE, align: 'center', valign: 'middle' });
  txt(slide, 'Continue with the standard intake process.', { x: px(678), y: py(375), w: px(450), h: py(20), fontSize: 11, bold: true, color: NAVY });
  txt(slide, 'Keep working through the form so the line keeps moving.', { x: px(678), y: py(393), w: px(450), h: py(18), fontSize: 9, color: DKGRAY });

  // NEEDS IMPROVEMENT badge
  rect(slide, { x: px(1210), y: py(377), w: px(150), h: py(22), fill: RED, alpha: 80 });
  txt(slide, 'NEEDS IMPROVEMENT', { x: px(1210), y: py(377), w: px(150), h: py(22), fontSize: 7, bold: true, color: WHITE, align: 'center', valign: 'middle' });

  // Choice B
  rect(slide, { x: px(635), y: py(425), w: px(740), h: py(45), fill: GREEN, alpha: 10 });
  slide.addShape(pptx.shapes.OVAL, {
    x: px(642), y: py(432), w: px(28), h: py(28),
    fill: { type:'solid', color: GREEN, alpha: 60 },
    border: { type:'none' },
  });
  txt(slide, 'B', { x: px(642), y: py(432), w: px(28), h: py(28), fontSize: 10, bold: true, color: WHITE, align: 'center', valign: 'middle' });
  txt(slide, 'Pause and ask how to support the patient.', { x: px(678), y: py(430), w: px(450), h: py(20), fontSize: 11, bold: true, color: NAVY });
  txt(slide, '"Is there anything I can do to make this form easier today?"', { x: px(678), y: py(450), w: px(450), h: py(18), fontSize: 9, color: DKGRAY });

  rect(slide, { x: px(1210), y: py(435), w: px(150), h: py(22), fill: GREEN, alpha: 80 });
  txt(slide, 'RECOMMENDED \u2714', { x: px(1210), y: py(435), w: px(150), h: py(22), fontSize: 7, bold: true, color: WHITE, align: 'center', valign: 'middle' });

  // Choice C
  rect(slide, { x: px(635), y: py(480), w: px(740), h: py(45), fill: WHITE, alpha: 5 });
  slide.addShape(pptx.shapes.OVAL, {
    x: px(642), y: py(487), w: px(28), h: py(28),
    fill: { type:'solid', color: COBALT, alpha: 60 },
    border: { type:'none' },
  });
  txt(slide, 'C', { x: px(642), y: py(487), w: px(28), h: py(28), fontSize: 10, bold: true, color: WHITE, align: 'center', valign: 'middle' });
  txt(slide, 'Ask another staff member to take over.', { x: px(678), y: py(485), w: px(450), h: py(20), fontSize: 11, bold: true, color: NAVY });
  txt(slide, 'Hand off to a colleague while you keep the queue moving.', { x: px(678), y: py(503), w: px(450), h: py(18), fontSize: 9, color: DKGRAY });

  rect(slide, { x: px(1210), y: py(490), w: px(150), h: py(22), fill: COBALT, alpha: 80 });
  txt(slide, 'SELECTED', { x: px(1210), y: py(490), w: px(150), h: py(22), fontSize: 7, bold: true, color: WHITE, align: 'center', valign: 'middle' });

  // Feedback panel
  rect(slide, { x: px(68), y: py(575), w: px(660), h: py(120), fill: WHITE, alpha: 5 });
  rect(slide, { x: px(85), y: py(593), w: px(210), h: py(20), fill: GREEN, alpha: 20 });
  txt(slide, 'FEEDBACK FOR B \u00B7 RECOMMENDED', {
    x: px(88), y: py(593), w: px(210), h: py(20),
    fontSize: 7, bold: true, color: GREEN, charSpacing: 1,
  });
  txt(slide, 'This is the dignified first move.', {
    x: px(85), y: py(618), w: px(600), h: py(22),
    fontSize: 14, bold: true, color: GREEN,
  });
  txt(slide, 'Pausing and asking, before assuming, is the single behaviour that distinguishes accessible care from "trying our best". The patient\nnames the barrier \u2014 vision, language, digital, cognitive, or something else \u2014 and you act on what they actually need.', {
    x: px(85), y: py(642), w: px(630), h: py(45),
    fontSize: 9, color: DKGRAY,
  });

  // Loop back panel
  rect(slide, { x: px(790), y: py(575), w: px(590), h: py(120), fill: WHITE, alpha: 5 });
  txt(slide, 'LOOP BACK TO \u00B7 ACCESSIBILITY DECISION PATH', {
    x: px(805), y: py(588), w: px(400), h: py(20),
    fontSize: 9, bold: true, color: RED, charSpacing: 1,
  });
  txt(slide, 'You are practicing step 01 \u2014 Pause & Assess.', {
    x: px(805), y: py(612), w: px(500), h: py(22),
    fontSize: 12, bold: true, color: NAVY,
  });

  // Decision path steps
  const dpSteps = ['01 PAUSE', '02 LISTEN', '03 APPLY', '04 ADAPT', '05 SUPPORT'];
  const dpColors = [GREEN, LTGRAY, LTGRAY, LTGRAY, LTGRAY];
  let dpX = px(815);
  for (let i = 0; i < 5; i++) {
    rect(slide, { x: dpX, y: py(648), w: px(80), h: py(22), fill: dpColors[i], alpha: i === 0 ? 80 : 20 });
    txt(slide, dpSteps[i], {
      x: dpX, y: py(648), w: px(80), h: py(22),
      fontSize: 7, bold: true, color: i === 0 ? WHITE : DKGRAY, align: 'center', valign: 'middle',
    });
    dpX += px(100);
  }

  // Footer
  txt(slide, '\u25A0 DECISION TREE', { x: px(40), y: py(1020), w: px(130), h: py(20), fontSize: 8, bold: true, color: RED });
  txt(slide, '3 BRANCHES \u00B7 1 RECOMMENDED PATH \u00B7 ALL OPTIONS OPEN FEEDBACK LAYERS', {
    x: px(170), y: py(1020), w: px(700), h: py(20), fontSize: 8, color: LTGRAY, charSpacing: 1,
  });
  txt(slide, 'SLIDE\n13 / 14', { x: px(1310), y: py(1010), w: px(100), h: py(35), fontSize: 9, color: NAVY, align: 'center' });

  slide.addNotes('Slide 13: Branching Scenario - decision tree with 3 branches and feedback layers. Storyline: Decision tree with 3 choice options (A, B, C). All options open unique feedback layers. Choice B is recommended. Feedback panel shows consequence + Decision Path step reinforcement. Loop-back visualization shows the 5-step path with current step highlighted. Time on task: 3 minutes.');
}

// ════════════════════════════════════════════════════════════════════════
// SLIDE 14 — Journey Closing (white bg with progress)
// ════════════════════════════════════════════════════════════════════════
{
  const slide = pptx.addSlide();
  addBg(slide, 14);

  txt(slide, 'SERIES PROGRESS \u00B7 STAGES UNLOCK AS YOU COMPLETE', {
    x: px(60), y: py(80), w: px(700), h: py(25),
    fontSize: 10, bold: true, color: RED, charSpacing: 2,
  });

  txt(slide, [
    { text: 'Accessibility First \u00B7 ', options: { color: NAVY, fontSize: 34, bold: true, fontFace: 'Arial Black' }},
    { text: 'A three-stage journey', options: { color: RED, fontSize: 34, bold: true, fontFace: 'Arial Black' }},
  ], {
    x: px(60), y: py(108), w: px(1100), h: py(55),
  });

  txt(slide, 'Guides unlock by stage. Foundations open everything else. Complete all nine of the first two stages to\nunlock applied practice.', {
    x: px(60), y: py(178), w: px(900), h: py(45),
    fontSize: 12, color: DKGRAY,
  });

  // YOUR PATH label
  txt(slide, 'YOUR PATH', {
    x: px(60), y: py(248), w: px(100), h: py(18),
    fontSize: 8, bold: true, color: NAVY, charSpacing: 2,
  });
  txt(slide, 'STAGE 1 OF 3', {
    x: px(1310), y: py(248), w: px(100), h: py(18),
    fontSize: 8, bold: true, color: RED, align: 'right',
  });

  // Stage 1: Foundations
  rect(slide, { x: px(60), y: py(280), w: px(430), h: py(490), fill: WHITE, alpha: 5 });

  // Stage header
  txt(slide, '1', {
    x: px(75), y: py(290), w: px(40), h: py(40),
    fontSize: 20, bold: true, color: NAVY, fontFace: 'Arial Black', valign: 'middle',
  });
  txt(slide, 'FOUNDATIONS', {
    x: px(120), y: py(290), w: px(200), h: py(22),
    fontSize: 11, bold: true, color: NAVY, charSpacing: 1,
  });
  txt(slide, 'Guides 01\u201304 \u00B7 Required first', {
    x: px(120), y: py(312), w: px(200), h: py(18),
    fontSize: 8, color: LTGRAY,
  });

  rect(slide, { x: px(370), y: py(295), w: px(100), h: py(24), fill: GREEN, alpha: 80 });
  txt(slide, 'IN PROGRESS', { x: px(370), y: py(295), w: px(100), h: py(24), fontSize: 7, bold: true, color: WHITE, align: 'center', valign: 'middle' });

  // Guide items in Stage 1
  const s1Guides = [
    { num: '01', title: 'Foundations of Disability, Inclusion & Accessible Design', status: 'COMPLETE', color: GREEN },
    { num: '02', title: 'Perceptions, Attitudes, and Barriers', status: 'IN PROGRESS', color: GREEN },
    { num: '03', title: 'Vision Disabilities', status: 'NOT STARTED', color: LTGRAY },
    { num: '04', title: 'Sensory, Hearing & Communication', status: 'NOT STARTED', color: LTGRAY },
  ];

  let gy = py(350);
  for (const g of s1Guides) {
    txt(slide, g.num, { x: px(80), y: gy, w: px(30), h: py(25), fontSize: 10, bold: true, color: NAVY });
    txt(slide, g.title, { x: px(115), y: gy, w: px(250), h: py(25), fontSize: 9, color: DKGRAY });
    rect(slide, { x: px(380), y: gy + py(2), w: px(90), h: py(20), fill: g.color, alpha: g.status === 'NOT STARTED' ? 30 : 70 });
    txt(slide, g.status, { x: px(380), y: gy + py(2), w: px(90), h: py(20), fontSize: 6, bold: true, color: WHITE, align: 'center', valign: 'middle' });
    gy += py(45);
  }

  txt(slide, 'Unlocks Stage 2 \u2192 Finish all four Foundations guides to open Understanding.', {
    x: px(75), y: py(740), w: px(400), h: py(18),
    fontSize: 8, color: CHARTR,
  });

  // Stage 2: Understanding
  rect(slide, { x: px(510), y: py(280), w: px(440), h: py(490), fill: LTGRAY, alpha: 8 });
  txt(slide, '2', { x: px(530), y: py(290), w: px(35), h: py(40), fontSize: 20, bold: true, color: LTGRAY, fontFace: 'Arial Black', valign: 'middle' });
  txt(slide, 'UNDERSTANDING DISABILITY\nEXPERIENCES', {
    x: px(575), y: py(290), w: px(260), h: py(35),
    fontSize: 10, bold: true, color: LTGRAY, charSpacing: 1,
  });
  txt(slide, 'Guides 05\u201309 \u00B7 Builds on Foundations', { x: px(575), y: py(325), w: px(250), h: py(18), fontSize: 8, color: LTGRAY });

  rect(slide, { x: px(840), y: py(295), w: px(80), h: py(24), fill: LTGRAY, alpha: 40 });
  txt(slide, 'LOCKED', { x: px(840), y: py(295), w: px(80), h: py(24), fontSize: 7, bold: true, color: WHITE, align: 'center', valign: 'middle' });

  const s2Guides = ['Physical Disabilities & Mobility', 'Mental Health Disabilities', 'Intellectual, Developmental & Learning', 'Non-Visible Disabilities', 'Aging, Disability & Intersectionality'];
  gy = py(365);
  for (let i = 0; i < s2Guides.length; i++) {
    txt(slide, String(i + 5).padStart(2, '0'), { x: px(530), y: gy, w: px(30), h: py(22), fontSize: 9, bold: true, color: LTGRAY });
    txt(slide, s2Guides[i], { x: px(565), y: gy, w: px(260), h: py(22), fontSize: 8, color: LTGRAY });
    rect(slide, { x: px(850), y: gy + py(2), w: px(70), h: py(18), fill: LTGRAY, alpha: 25 });
    txt(slide, 'LOCKED', { x: px(850), y: gy + py(2), w: px(70), h: py(18), fontSize: 6, bold: true, color: LTGRAY, align: 'center', valign: 'middle' });
    gy += py(38);
  }

  txt(slide, 'LOCKED \u00B7 COMPLETE STAGE 1 TO UNLOCK', {
    x: px(560), y: py(555), w: px(340), h: py(20),
    fontSize: 7, bold: true, color: NAVY, align: 'center', charSpacing: 1,
  });

  // Stage 3: Applied Practice
  rect(slide, { x: px(970), y: py(280), w: px(430), h: py(490), fill: LTGRAY, alpha: 8 });
  txt(slide, '3', { x: px(988), y: py(290), w: px(35), h: py(40), fontSize: 20, bold: true, color: LTGRAY, fontFace: 'Arial Black', valign: 'middle' });
  txt(slide, 'APPLIED PRACTICE', {
    x: px(1030), y: py(290), w: px(200), h: py(22),
    fontSize: 10, bold: true, color: LTGRAY, charSpacing: 1,
  });
  txt(slide, 'Guides 10\u201318 \u00B7 Capstone modules', { x: px(1030), y: py(312), w: px(200), h: py(18), fontSize: 8, color: LTGRAY });

  rect(slide, { x: px(1300), y: py(295), w: px(80), h: py(24), fill: LTGRAY, alpha: 40 });
  txt(slide, 'LOCKED', { x: px(1300), y: py(295), w: px(80), h: py(24), fontSize: 7, bold: true, color: WHITE, align: 'center', valign: 'middle' });

  const s3Guides = [
    'Engaging with Confidence & Respect', 'Service Animals & Guide Dogs', 'Support Persons',
    'Assistive Devices', 'Communication & Information Access', 'Neurodiversity & Sensory Regulation',
    'Trauma-Informed Accessibility', 'Crisis Situations & De-escalation', 'Indigenous Peoples & Accessibility',
  ];
  gy = py(350);
  for (let i = 0; i < s3Guides.length; i++) {
    txt(slide, String(i + 10), { x: px(990), y: gy, w: px(30), h: py(20), fontSize: 9, bold: true, color: LTGRAY });
    txt(slide, s3Guides[i], { x: px(1020), y: gy, w: px(260), h: py(20), fontSize: 8, color: LTGRAY });
    rect(slide, { x: px(1310), y: gy + py(1), w: px(70), h: py(17), fill: LTGRAY, alpha: 25 });
    txt(slide, 'LOCKED', { x: px(1310), y: gy + py(1), w: px(70), h: py(17), fontSize: 6, bold: true, color: LTGRAY, align: 'center', valign: 'middle' });
    gy += py(35);
  }

  txt(slide, 'LOCKED \u00B7 COMPLETE STAGES 1 & 2 TO UNLOCK', {
    x: px(1010), y: py(555), w: px(370), h: py(20),
    fontSize: 7, bold: true, color: NAVY, align: 'center', charSpacing: 1,
  });

  // Bottom stats
  txt(slide, 'COMPLETE', { x: px(340), y: py(795), w: px(120), h: py(15), fontSize: 8, bold: true, color: DKGRAY, charSpacing: 2 });
  txt(slide, '1 / 18', { x: px(340), y: py(812), w: px(120), h: py(25), fontSize: 16, bold: true, color: GREEN });

  txt(slide, 'IN PROGRESS', { x: px(560), y: py(795), w: px(120), h: py(15), fontSize: 8, bold: true, color: DKGRAY, charSpacing: 2 });
  txt(slide, '1', { x: px(560), y: py(812), w: px(120), h: py(25), fontSize: 16, bold: true, color: NAVY });

  txt(slide, 'REMAINING', { x: px(780), y: py(795), w: px(120), h: py(15), fontSize: 8, bold: true, color: DKGRAY, charSpacing: 2 });
  txt(slide, '16', { x: px(780), y: py(812), w: px(120), h: py(25), fontSize: 16, bold: true, color: DKGRAY });

  // Footer
  txt(slide, 'SLIDE\n14 / 14', { x: px(1310), y: py(1010), w: px(100), h: py(35), fontSize: 9, color: NAVY, align: 'center' });

  slide.addNotes('Slide 14: Journey Closing - completion slide showing series progress. Storyline: Series map showing all 18 guides across 3 stages (Foundations, Understanding, Applied Practice). Stage 1 is active with guide 01 marked Complete. Stages 2 and 3 are locked. Progress bar and stats shown at bottom. This is the final slide \u2014 triggers LMS completion when learner arrives here.');
}

// ── Write file ──────────────────────────────────────────────────────────
const outPath = path.resolve(__dirname, 'UHN_Guide01_Editable.pptx');
pptx.writeFile({ fileName: outPath })
  .then(() => console.log('SUCCESS: ' + outPath))
  .catch(err => { console.error('FAILED:', err); process.exit(1); });
