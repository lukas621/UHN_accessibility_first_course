const pptxgen = require('pptxgenjs');
const fs = require('fs');
const sharp = require('sharp');
const path = require('path');

const slides = JSON.parse(fs.readFileSync('/tmp/slides_data.json', 'utf8'));
const OUT = path.join(__dirname);

// UHN Brand Colors (NO # prefix for PptxGenJS)
const C = {
  navy: '192858',
  navyDeep: '0F1A3D',
  red: 'C0233B',
  redBg: 'FDF2F3',
  cobalt: '245BAA',
  cobaltBg: 'EAF1FA',
  lilac: 'C48ABD',
  lilacBg: 'F7EDF5',
  chartreuse: '74AE54',
  chartreuseBg: 'EEF6E7',
  neutral: 'E4E4E4',
  neutral2: 'F4F4F4',
  white: 'FFFFFF',
  black: '111111',
  muted: '5A5A5A',
};

// Rasterize gradient backgrounds
async function createGradientPng(color1, color2, filename) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080">
    <defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#${color1}"/>
      <stop offset="100%" style="stop-color:#${color2}"/>
    </linearGradient></defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
  </svg>`;
  await sharp(Buffer.from(svg)).png().toFile(path.join(OUT, filename));
  return filename;
}

// Create icon PNGs
async function createIconPng(svgContent, color, filename, size = 128) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}">
    <path fill="#${color}" d="${svgContent}"/>
  </svg>`;
  await sharp(Buffer.from(svg)).png().toFile(path.join(OUT, filename));
  return filename;
}

// Create step number circle
async function createCirclePng(number, bgColor, textColor, filename, size = 96) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
    <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 2}" fill="#${bgColor}"/>
    <text x="${size/2}" y="${size/2 + 10}" text-anchor="middle" font-family="Arial Black" font-size="${size * 0.4}" fill="#${textColor}">${number}</text>
  </svg>`;
  await sharp(Buffer.from(svg)).png().toFile(path.join(OUT, filename));
  return filename;
}

// Add shared footer chrome to a slide
function addChrome(slide, slideNum) {
  // Bottom bar
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 6.8, w: 13.33, h: 0.7,
    fill: { color: C.navy },
  });
  // Red dot + tag
  slide.addText([
    { text: '●  ', options: { color: C.red, fontSize: 10 } },
    { text: 'ACCESSIBILITY FIRST', options: { color: C.white, fontSize: 9, bold: true, fontFace: 'Arial' } },
  ], { x: 0.5, y: 6.85, w: 3, h: 0.4 });
  // Slide number
  slide.addText(`Guide 01 · Foundations  |  ${slideNum} / 14`, {
    x: 9, y: 6.85, w: 3.8, h: 0.4,
    color: C.muted, fontSize: 9, fontFace: 'Arial', align: 'right',
    color: 'AAAAAA',
  });
  // Progress dots
  for (let i = 0; i < 14; i++) {
    slide.addShape(pptx.shapes.OVAL, {
      x: 5.5 + i * 0.18, y: 7.0, w: 0.1, h: 0.1,
      fill: { color: i < slideNum ? C.red : '444444' },
    });
  }
}

const pptx = new pptxgen();
pptx.layout = 'LAYOUT_WIDE'; // 13.33 x 7.5 = 16:9
pptx.author = 'Course Factory OS';
pptx.title = 'UHN Accessibility First - Guide 1';

async function buildPresentation() {
  // Pre-generate assets
  await createGradientPng(C.navyDeep, C.navy, 'bg-navy.png');
  await createGradientPng(C.cobalt, C.navy, 'bg-cobalt.png');
  await createGradientPng(C.red, C.navyDeep, 'bg-red.png');

  // Step circles for Decision Path
  for (let i = 1; i <= 5; i++) {
    const colors = [C.navy, C.cobalt, C.chartreuse, C.lilac, C.red];
    await createCirclePng(i, colors[i-1], C.white, `step-${i}.png`);
  }

  // Practice model circles
  const areas = ['A', 'C', 'E', 'R'];
  const areaColors = [C.cobalt, C.chartreuse, C.lilac, C.red];
  for (let i = 0; i < 4; i++) {
    await createCirclePng(areas[i], areaColors[i], C.white, `area-${areas[i]}.png`);
  }

  // ===== SLIDE 1: Title =====
  let s = pptx.addSlide();
  s.addImage({ path: path.join(OUT, 'bg-navy.png'), x: 0, y: 0, w: 13.33, h: 7.5 });
  // Red accent line
  s.addShape(pptx.shapes.RECTANGLE, { x: 0.8, y: 1.5, w: 0.06, h: 2.5, fill: { color: C.red } });
  s.addText('Guide 01 of 18', {
    x: 1.1, y: 1.5, w: 5, h: 0.4,
    fontSize: 12, fontFace: 'Arial', color: C.lilac,
    letterSpacing: 3,
  });
  s.addText('Accessibility First Series', {
    x: 1.1, y: 2.0, w: 8, h: 0.8,
    fontSize: 32, fontFace: 'Arial Black', color: C.white, bold: true,
  });
  s.addText('Advancing Dignity, Inclusion & Equitable Care', {
    x: 1.1, y: 2.8, w: 8, h: 0.5,
    fontSize: 18, fontFace: 'Arial Black', color: C.white,
  });
  s.addText('Foundations of Disability, Inclusion, and Accessible Design', {
    x: 1.1, y: 3.5, w: 7, h: 0.5,
    fontSize: 14, fontFace: 'Arial', color: 'AAAAAA',
  });
  s.addText('An introduction to the principles, models, and everyday practices that shape accessible care at the University Health Network.', {
    x: 1.1, y: 4.2, w: 6, h: 0.8,
    fontSize: 13, fontFace: 'Arial', color: '999999', lineSpacingMultiple: 1.4,
  });
  // Start button
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 1.1, y: 5.3, w: 2.5, h: 0.55,
    fill: { color: C.red }, rectRadius: 0.1,
    hyperlink: { slide: 2 },
  });
  s.addText('Begin Guide 01 →', {
    x: 1.1, y: 5.3, w: 2.5, h: 0.55,
    fontSize: 13, fontFace: 'Arial', color: C.white, bold: true, align: 'center', valign: 'middle',
  });
  addChrome(s, 1);

  // ===== SLIDE 2: Learning Objectives =====
  s = pptx.addSlide();
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: C.white } });
  // Header bar
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 13.33, h: 0.9, fill: { color: C.navy } });
  s.addText('Learning Objectives', {
    x: 0.8, y: 0.1, w: 6, h: 0.7,
    fontSize: 22, fontFace: 'Arial Black', color: C.white,
  });
  s.addText('By the end of this guide, you will be able to describe the foundations of disability and inclusion, and apply them to everyday interactions at UHN.', {
    x: 0.8, y: 1.2, w: 10, h: 0.6,
    fontSize: 12, fontFace: 'Arial', color: C.muted, lineSpacingMultiple: 1.3,
  });

  const objectives = [
    { title: 'Define disability through multiple lenses', desc: 'Distinguish between the medical, social, and human-rights models of disability, and recognize how each shapes care.', color: C.cobalt },
    { title: 'Identify visible and invisible barriers', desc: 'Recognize the physical, sensory, attitudinal, communication, and systemic barriers a person may encounter at UHN.', color: C.red },
    { title: 'Apply the Accessibility in Practice model', desc: 'Use the four areas — Awareness, Communication, Environment, and Response — to guide everyday decisions.', color: C.chartreuse },
    { title: 'Use the 5-step Decision Path', desc: 'Pause and assess, listen, apply, adapt, and seek support when an accessibility need is identified.', color: C.lilac },
  ];

  objectives.forEach((obj, i) => {
    const y = 2.1 + i * 1.2;
    // Accent line
    s.addShape(pptx.shapes.RECTANGLE, { x: 0.8, y: y, w: 0.06, h: 0.9, fill: { color: obj.color } });
    s.addText(obj.title, {
      x: 1.1, y: y, w: 10, h: 0.4,
      fontSize: 15, fontFace: 'Arial', color: C.navy, bold: true,
    });
    s.addText(obj.desc, {
      x: 1.1, y: y + 0.4, w: 10, h: 0.45,
      fontSize: 11, fontFace: 'Arial', color: C.muted, lineSpacingMultiple: 1.3,
    });
  });
  addChrome(s, 2);

  // ===== SLIDE 3: Why This Matters =====
  s = pptx.addSlide();
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: C.white } });
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 13.33, h: 0.9, fill: { color: C.navy } });
  s.addText('Why this matters in healthcare', {
    x: 0.8, y: 0.1, w: 8, h: 0.7,
    fontSize: 22, fontFace: 'Arial Black', color: C.white,
  });
  // Quote highlight
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8, y: 1.3, w: 11.5, h: 1.2,
    fill: { color: C.cobaltBg.replace('#','') }, rectRadius: 0.1,
  });
  s.addShape(pptx.shapes.RECTANGLE, { x: 0.8, y: 1.3, w: 0.06, h: 1.2, fill: { color: C.cobalt } });
  s.addText('Accessibility is not a separate program. It is the difference between a patient feeling seen and a patient leaving without the care they came for.', {
    x: 1.1, y: 1.4, w: 10.8, h: 1.0,
    fontSize: 14, fontFace: 'Arial', color: C.navy, italic: true, lineSpacingMultiple: 1.4,
  });
  s.addText('Most accessibility decisions at UHN are made not in policy meetings — they are made at reception desks, in exam rooms, during shift handovers, and in the language we use without thinking.', {
    x: 0.8, y: 2.9, w: 11, h: 0.7,
    fontSize: 12, fontFace: 'Arial', color: C.black, lineSpacingMultiple: 1.4,
  });
  s.addText('Foundations matter because they make those split-second decisions consistent, dignified, and legally sound.', {
    x: 0.8, y: 3.8, w: 11, h: 0.5,
    fontSize: 12, fontFace: 'Arial', color: C.black, lineSpacingMultiple: 1.4,
  });
  // Callout box
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8, y: 4.7, w: 11.5, h: 0.8,
    fill: { color: C.neutral2.replace('#','') }, rectRadius: 0.08,
  });
  s.addText('Every interaction at UHN is an accessibility decision — whether we name it that or not.', {
    x: 1.1, y: 4.8, w: 10.8, h: 0.6,
    fontSize: 13, fontFace: 'Arial', color: C.navy, bold: true, italic: true,
  });
  addChrome(s, 3);

  // ===== SLIDE 4: Beyond Ramps =====
  s = pptx.addSlide();
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: C.white } });
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 13.33, h: 0.9, fill: { color: C.navy } });
  s.addText('Accessibility is more than ramps and railings', {
    x: 0.8, y: 0.1, w: 10, h: 0.7,
    fontSize: 22, fontFace: 'Arial Black', color: C.white,
  });
  s.addText('Accessibility is the removal of any barrier that keeps a person from full, dignified participation in care.', {
    x: 0.8, y: 1.2, w: 11, h: 0.5,
    fontSize: 14, fontFace: 'Arial', color: C.navy, bold: true,
  });
  s.addText('Physical access is the most visible barrier — but most of what UHN gets wrong every day is invisible until we look for it.', {
    x: 0.8, y: 1.9, w: 11, h: 0.5,
    fontSize: 12, fontFace: 'Arial', color: C.black,
  });
  // Barrier types
  const barriers = [
    { name: 'Physical', color: C.cobalt },
    { name: 'Attitudinal', color: C.red },
    { name: 'Communication', color: C.chartreuse },
    { name: 'Technological', color: C.lilac },
    { name: 'Sensory', color: C.navy },
    { name: 'Systemic', color: 'E8234F' },
  ];
  barriers.forEach((b, i) => {
    const x = 0.8 + (i % 3) * 4;
    const y = 2.7 + Math.floor(i / 3) * 0.7;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: x, y: y, w: 3.5, h: 0.5,
      fill: { color: b.color }, rectRadius: 0.08,
    });
    s.addText(b.name, {
      x: x, y: y, w: 3.5, h: 0.5,
      fontSize: 12, fontFace: 'Arial', color: C.white, bold: true, align: 'center', valign: 'middle',
    });
  });
  // Example
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8, y: 4.5, w: 11.5, h: 1.2,
    fill: { color: C.redBg.replace('#','') }, rectRadius: 0.08,
  });
  s.addShape(pptx.shapes.RECTANGLE, { x: 0.8, y: 4.5, w: 0.06, h: 1.2, fill: { color: C.red } });
  s.addText('A patient is late to an appointment. The barrier isn\'t mobility. It is an appointment reminder sent only as an image — unreadable by the patient\'s screen reader.', {
    x: 1.1, y: 4.6, w: 10.8, h: 0.5,
    fontSize: 12, fontFace: 'Arial', color: C.black, lineSpacingMultiple: 1.3,
  });
  s.addText('Fixing the building doesn\'t fix the visit. Fixing the message does.', {
    x: 1.1, y: 5.2, w: 10.8, h: 0.4,
    fontSize: 12, fontFace: 'Arial', color: C.navy, bold: true, italic: true,
  });
  addChrome(s, 4);

  // ===== SLIDE 5: Accessibility in Practice Model =====
  s = pptx.addSlide();
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: C.white } });
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 13.33, h: 0.9, fill: { color: C.navy } });
  s.addText('The Accessibility in Practice Model', {
    x: 0.8, y: 0.1, w: 10, h: 0.7,
    fontSize: 22, fontFace: 'Arial Black', color: C.white,
  });
  s.addText('A shared model that lets every team — clinical, administrative, operational, and leadership — talk about accessibility in the same way.', {
    x: 0.8, y: 1.2, w: 11, h: 0.5,
    fontSize: 12, fontFace: 'Arial', color: C.muted,
  });

  const practiceAreas = [
    { letter: 'A', name: 'Awareness', color: C.cobalt, bg: C.cobaltBg.replace('#',''), items: ['Notice assistive devices.', 'Watch your own assumptions.'] },
    { letter: 'C', name: 'Communication', color: C.chartreuse, bg: C.chartreuseBg.replace('#',''), items: ['Ask about preferred format.', 'Speak to the patient, not the companion.'] },
    { letter: 'E', name: 'Environment', color: C.lilac, bg: C.lilacBg.replace('#',''), items: ['Check physical access.', 'Reduce sensory overload.'] },
    { letter: 'R', name: 'Response', color: C.red, bg: C.redBg.replace('#',''), items: ['Adapt in real time.', 'Document what worked.'] },
  ];

  practiceAreas.forEach((area, i) => {
    const x = 0.8 + i * 3.1;
    // Card background
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: x, y: 2.0, w: 2.8, h: 4.0,
      fill: { color: area.bg }, rectRadius: 0.1,
    });
    // Circle with letter
    s.addImage({ path: path.join(OUT, `area-${area.letter}.png`), x: x + 0.9, y: 2.2, w: 0.8, h: 0.8 });
    // Name
    s.addText(area.name, {
      x: x, y: 3.1, w: 2.8, h: 0.4,
      fontSize: 14, fontFace: 'Arial Black', color: area.color, align: 'center',
    });
    // Items
    area.items.forEach((item, j) => {
      s.addText('• ' + item, {
        x: x + 0.2, y: 3.6 + j * 0.4, w: 2.4, h: 0.35,
        fontSize: 10, fontFace: 'Arial', color: C.black,
      });
    });
    // Hover action note in slide notes
  });

  s.addNotes('STORYLINE: Each quadrant is a clickable hotspot. On click, expand to show full detail with examples. Use slide layers for each area.');
  addChrome(s, 5);

  // ===== SLIDE 6: Decision Path =====
  s = pptx.addSlide();
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: C.white } });
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 13.33, h: 0.9, fill: { color: C.navy } });
  s.addText('The Accessibility Decision Path', {
    x: 0.8, y: 0.1, w: 10, h: 0.7,
    fontSize: 22, fontFace: 'Arial Black', color: C.white,
  });
  s.addText('A repeatable 5-step path you can use whenever an accessibility need appears — at intake, in the hallway, on a call, or in a team meeting.', {
    x: 0.8, y: 1.2, w: 11, h: 0.5,
    fontSize: 12, fontFace: 'Arial', color: C.muted,
  });

  const steps = [
    { num: 1, name: 'Pause & Assess', color: C.navy },
    { num: 2, name: 'Listen & Ask', color: C.cobalt },
    { num: 3, name: 'Apply', color: C.chartreuse },
    { num: 4, name: 'Adapt', color: C.lilac },
    { num: 5, name: 'Seek Support', color: C.red },
  ];

  steps.forEach((step, i) => {
    const x = 0.5 + i * 2.5;
    // Step circle
    s.addImage({ path: path.join(OUT, `step-${step.num}.png`), x: x + 0.6, y: 2.2, w: 0.9, h: 0.9 });
    // Step name
    s.addText(step.name, {
      x: x, y: 3.3, w: 2.2, h: 0.4,
      fontSize: 12, fontFace: 'Arial', color: step.color, bold: true, align: 'center',
    });
    // Arrow between steps
    if (i < 4) {
      s.addText('→', {
        x: x + 2.1, y: 2.4, w: 0.4, h: 0.6,
        fontSize: 20, fontFace: 'Arial', color: C.neutral, align: 'center', valign: 'middle',
      });
    }
  });

  // Example box
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8, y: 4.3, w: 11.5, h: 1.6,
    fill: { color: C.cobaltBg.replace('#','') }, rectRadius: 0.1,
  });
  s.addShape(pptx.shapes.RECTANGLE, { x: 0.8, y: 4.3, w: 0.06, h: 1.6, fill: { color: C.cobalt } });
  s.addText('Use the method that fits the person, not the default.', {
    x: 1.1, y: 4.4, w: 10.8, h: 0.4,
    fontSize: 13, fontFace: 'Arial', color: C.navy, bold: true,
  });
  s.addText('If the person prefers written communication, switch to a notepad or the patient portal. If they need extra time, give it. The Decision Path makes the right call repeatable.', {
    x: 1.1, y: 4.9, w: 10.8, h: 0.8,
    fontSize: 11, fontFace: 'Arial', color: C.black, lineSpacingMultiple: 1.4,
  });

  s.addNotes('STORYLINE: Step interaction — each step reveals detail on click. Use numbered triggers with slide layers. Animate arrow progression.');
  addChrome(s, 6);

  // ===== SLIDE 7: Scenario =====
  s = pptx.addSlide();
  s.addImage({ path: path.join(OUT, 'bg-navy.png'), x: 0, y: 0, w: 13.33, h: 7.5 });
  s.addText('Scenario', {
    x: 0.8, y: 0.3, w: 3, h: 0.4,
    fontSize: 12, fontFace: 'Arial', color: C.lilac, letterSpacing: 3,
  });
  s.addText('A patient at reception', {
    x: 0.8, y: 0.7, w: 10, h: 0.6,
    fontSize: 24, fontFace: 'Arial Black', color: C.white,
  });
  s.addText('You are the first person a patient meets today. The next 30 seconds will shape the rest of their visit.', {
    x: 0.8, y: 1.5, w: 6, h: 0.5,
    fontSize: 12, fontFace: 'Arial', color: 'BBBBBB',
  });
  // Character card
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8, y: 2.3, w: 7, h: 3.5,
    fill: { color: '1E3066' }, rectRadius: 0.12,
  });
  s.addText('Meet Dahlia', {
    x: 1.1, y: 2.5, w: 5, h: 0.4,
    fontSize: 16, fontFace: 'Arial Black', color: C.white,
  });
  s.addText('Dahlia arrives 10 minutes early for an outpatient appointment. As you ask for her health card, she points to her ear, then gestures toward the sign-in screen.', {
    x: 1.1, y: 3.1, w: 6.4, h: 1.0,
    fontSize: 12, fontFace: 'Arial', color: 'CCCCCC', lineSpacingMultiple: 1.5,
  });
  // What do you do? prompt
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 1.1, y: 4.5, w: 6.4, h: 0.5,
    fill: { color: C.cobalt }, rectRadius: 0.08,
  });
  s.addText('What do you do first?', {
    x: 1.1, y: 4.5, w: 6.4, h: 0.5,
    fontSize: 13, fontFace: 'Arial', color: C.white, bold: true, align: 'center', valign: 'middle',
  });

  s.addNotes('STORYLINE: Decision branch interaction. 2-3 choices with feedback layers. Each choice leads to a consequence panel, then loops back to the Decision Path. Use variables to track choices.');
  addChrome(s, 7);

  // ===== SLIDE 8: Knowledge Check =====
  s = pptx.addSlide();
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: C.white } });
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 13.33, h: 0.9, fill: { color: C.cobalt } });
  s.addText('Knowledge Check', {
    x: 0.8, y: 0.1, w: 6, h: 0.7,
    fontSize: 22, fontFace: 'Arial Black', color: C.white,
  });
  s.addText('A short check-in. Choose the response that best reflects the foundations of accessible care at UHN.', {
    x: 0.8, y: 1.2, w: 11, h: 0.5,
    fontSize: 12, fontFace: 'Arial', color: C.muted,
  });
  s.addText('Which model of disability focuses on barriers in the environment, rather than on individual deficits?', {
    x: 0.8, y: 2.0, w: 11, h: 0.6,
    fontSize: 15, fontFace: 'Arial', color: C.navy, bold: true,
  });

  const options = [
    { letter: 'A', text: 'The medical model' },
    { letter: 'B', text: 'The social / environmental model' },
    { letter: 'C', text: 'The charity model' },
    { letter: 'D', text: 'The rehabilitation model' },
  ];

  options.forEach((opt, i) => {
    const y = 3.0 + i * 0.75;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.8, y: y, w: 11.5, h: 0.6,
      fill: { color: C.neutral2.replace('#','') }, rectRadius: 0.08,
      line: { color: C.neutral, width: 1 },
      hyperlink: { slide: 8 }, // self-link for hover effect
    });
    s.addText(`${opt.letter})  ${opt.text}`, {
      x: 1.1, y: y, w: 10.8, h: 0.6,
      fontSize: 13, fontFace: 'Arial', color: C.black, valign: 'middle',
    });
  });

  // Feedback area (hidden in Storyline, shown on selection)
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8, y: 6.0, w: 11.5, h: 0.6,
    fill: { color: C.chartreuseBg.replace('#','') }, rectRadius: 0.08,
  });
  s.addText('✓ The social / environmental model places responsibility on systems, spaces, and attitudes — not on the person.', {
    x: 1.1, y: 6.0, w: 10.8, h: 0.6,
    fontSize: 11, fontFace: 'Arial', color: C.chartreuse, valign: 'middle',
  });

  s.addNotes('STORYLINE: Graded MC quiz slide. Correct answer: B. Show correct/incorrect feedback layers on submit. Seekbar disabled.');
  addChrome(s, 8);

  // ===== SLIDE 9: Inclusive Practice Tip =====
  s = pptx.addSlide();
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: C.white } });
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 13.33, h: 0.9, fill: { color: C.navy } });
  s.addText('Inclusive Practice Tip', {
    x: 0.8, y: 0.1, w: 8, h: 0.7,
    fontSize: 22, fontFace: 'Arial Black', color: C.white,
  });
  s.addText('Ask, don\'t assume — and confirm what works.', {
    x: 0.8, y: 1.2, w: 11, h: 0.5,
    fontSize: 16, fontFace: 'Arial', color: C.navy, bold: true,
  });
  s.addText('Before adjusting anything for a patient, ask them how they would prefer to be supported. Then confirm out loud that what you did actually helped.', {
    x: 0.8, y: 1.9, w: 11, h: 0.6,
    fontSize: 12, fontFace: 'Arial', color: C.black, lineSpacingMultiple: 1.4,
  });

  // 3 step buttons (BIGGER as requested)
  const tipSteps = [
    { num: '01', title: 'Ask', desc: '"How can I make this easier?"', color: C.cobalt },
    { num: '02', title: 'Offer', desc: 'Specific support, not vague help.', color: C.chartreuse },
    { num: '03', title: 'Confirm', desc: '"Did that work for you?"', color: C.lilac },
  ];

  tipSteps.forEach((ts, i) => {
    const x = 0.8 + i * 4;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: x, y: 2.9, w: 3.6, h: 2.8,
      fill: { color: C.neutral2.replace('#','') }, rectRadius: 0.12,
      line: { color: ts.color, width: 2 },
    });
    s.addText(ts.num, {
      x: x, y: 3.1, w: 3.6, h: 0.5,
      fontSize: 28, fontFace: 'Arial Black', color: ts.color, align: 'center',
    });
    s.addText(ts.title, {
      x: x, y: 3.7, w: 3.6, h: 0.5,
      fontSize: 18, fontFace: 'Arial Black', color: C.navy, align: 'center',
    });
    s.addText(ts.desc, {
      x: x + 0.3, y: 4.4, w: 3.0, h: 0.8,
      fontSize: 12, fontFace: 'Arial', color: C.muted, align: 'center', lineSpacingMultiple: 1.3,
    });
  });

  s.addNotes('STORYLINE: Click-reveal interaction. Each step card flips or expands on click to show a deeper example. Use slide layers per step.');
  addChrome(s, 9);

  // ===== SLIDE 10: MAP =====
  s = pptx.addSlide();
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: C.white } });
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 13.33, h: 0.9, fill: { color: C.navy } });
  s.addText('My Action Planning (MAP)', {
    x: 0.8, y: 0.1, w: 10, h: 0.7,
    fontSize: 22, fontFace: 'Arial Black', color: C.white,
  });
  s.addText('Three lines. Five minutes. A different next shift.', {
    x: 0.8, y: 1.2, w: 11, h: 0.4,
    fontSize: 14, fontFace: 'Arial', color: C.navy, bold: true,
  });
  s.addText('Before you close this guide, name three small commitments. Your MAP saves to your learner profile and travels with you across all 18 guides.', {
    x: 0.8, y: 1.7, w: 11, h: 0.5,
    fontSize: 11, fontFace: 'Arial', color: C.muted,
  });

  const mapFields = [
    { label: 'ONE THING I WILL STOP DOING', color: C.red },
    { label: 'ONE THING I WILL START DOING', color: C.chartreuse },
    { label: 'ONE THING I WILL CONTINUE DOING', color: C.lilac },
  ];

  mapFields.forEach((field, i) => {
    const y = 2.6 + i * 1.4;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.8, y: y, w: 11.5, h: 1.2,
      fill: { color: C.white },
      line: { color: C.neutral, width: 1, dashType: 'dash' },
      rectRadius: 0.08,
    });
    s.addText(field.label, {
      x: 1.1, y: y + 0.1, w: 10, h: 0.3,
      fontSize: 9, fontFace: 'Arial', color: field.color, bold: true, letterSpacing: 2,
    });
    s.addText('Type your response...', {
      x: 1.1, y: y + 0.5, w: 10, h: 0.4,
      fontSize: 12, fontFace: 'Arial', color: 'BBBBBB', italic: true,
    });
  });

  s.addNotes('STORYLINE: Text entry slide (ungraded). Three text input fields. Responses saved to learner variables. Add download/print button.');
  addChrome(s, 10);

  // ===== SLIDE 11: Key Takeaways =====
  s = pptx.addSlide();
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: C.white } });
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 13.33, h: 0.9, fill: { color: C.navy } });
  s.addText('Key Takeaways from Guide 01', {
    x: 0.8, y: 0.1, w: 10, h: 0.7,
    fontSize: 22, fontFace: 'Arial Black', color: C.white,
  });
  s.addText('Four ideas to hold on to — and one downloadable job aid you can keep at your workstation.', {
    x: 0.8, y: 1.2, w: 11, h: 0.4,
    fontSize: 12, fontFace: 'Arial', color: C.muted,
  });

  const takeaways = [
    { title: 'Accessibility is broader than the building.', desc: 'Most barriers at UHN are attitudinal, communication-based, or systemic — not physical.', color: C.cobalt },
    { title: 'Use four areas, every time.', desc: 'Awareness, Communication, Environment, Response — a shared model across every guide and every role.', color: C.chartreuse },
    { title: 'Pause, listen, apply, adapt, seek support.', desc: 'The 5-step Decision Path makes any accessibility decision repeatable.', color: C.lilac },
    { title: 'Ask before you adjust.', desc: 'The patient is the expert on their own needs. Your job is to make space for them to tell you what works.', color: C.red },
  ];

  takeaways.forEach((tk, i) => {
    const y = 1.9 + i * 1.15;
    s.addShape(pptx.shapes.RECTANGLE, { x: 0.8, y: y, w: 0.06, h: 0.9, fill: { color: tk.color } });
    s.addText(tk.title, {
      x: 1.1, y: y, w: 11, h: 0.4,
      fontSize: 14, fontFace: 'Arial', color: C.navy, bold: true,
    });
    s.addText(tk.desc, {
      x: 1.1, y: y + 0.4, w: 11, h: 0.4,
      fontSize: 11, fontFace: 'Arial', color: C.muted,
    });
  });

  // Job aid download button
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8, y: 6.0, w: 3, h: 0.5,
    fill: { color: C.navy }, rectRadius: 0.08,
  });
  s.addText('Download Job Aid (PDF)', {
    x: 0.8, y: 6.0, w: 3, h: 0.5,
    fontSize: 11, fontFace: 'Arial', color: C.white, bold: true, align: 'center', valign: 'middle',
  });

  s.addNotes('STORYLINE: Static summary slide. Job aid button triggers lightbox preview + download. Add to Resources tab in player.');
  addChrome(s, 11);

  // ===== SLIDE 12: Listen & Reflect =====
  s = pptx.addSlide();
  s.addImage({ path: path.join(OUT, 'bg-navy.png'), x: 0, y: 0, w: 13.33, h: 7.5 });
  s.addText('Listen and Reflect', {
    x: 0.8, y: 0.3, w: 5, h: 0.4,
    fontSize: 12, fontFace: 'Arial', color: C.lilac, letterSpacing: 3,
  });
  s.addText('Accessibility in Everyday Care', {
    x: 0.8, y: 0.7, w: 10, h: 0.6,
    fontSize: 24, fontFace: 'Arial Black', color: C.white,
  });
  s.addText('A short patient-advisor reflection on what good accessibility actually feels like at the front desk. Captions and a full transcript are available.', {
    x: 0.8, y: 1.5, w: 7, h: 0.6,
    fontSize: 12, fontFace: 'Arial', color: 'AAAAAA', lineSpacingMultiple: 1.3,
  });
  // Audio player placeholder
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8, y: 2.5, w: 7, h: 2.5,
    fill: { color: '1E3066' }, rectRadius: 0.12,
  });
  // Quote
  s.addText('"Dignity starts before the appointment."', {
    x: 1.2, y: 2.8, w: 6, h: 0.5,
    fontSize: 14, fontFace: 'Arial', color: C.white, italic: true,
  });
  s.addText('D. K. · UHN Patient & Family Advisor', {
    x: 1.2, y: 3.3, w: 6, h: 0.3,
    fontSize: 10, fontFace: 'Arial', color: 'AAAAAA',
  });
  // Play button
  s.addShape(pptx.shapes.OVAL, {
    x: 3.5, y: 3.8, w: 0.8, h: 0.8,
    fill: { color: C.red },
  });
  s.addText('▶', {
    x: 3.5, y: 3.8, w: 0.8, h: 0.8,
    fontSize: 20, color: C.white, align: 'center', valign: 'middle',
  });
  // Timestamps
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 8.5, y: 2.5, w: 4, h: 2.5,
    fill: { color: '1E3066' }, rectRadius: 0.12,
  });
  s.addText('Three moments to listen for', {
    x: 8.8, y: 2.7, w: 3.5, h: 0.4,
    fontSize: 13, fontFace: 'Arial Black', color: C.white,
  });
  s.addText('01:02  How "ask, then confirm" prevented a wrong assumption.\n\n01:54  One sentence every staff member can use on a busy shift.', {
    x: 8.8, y: 3.2, w: 3.5, h: 1.5,
    fontSize: 10, fontFace: 'Arial', color: 'CCCCCC', lineSpacingMultiple: 1.4,
  });

  // Captions button
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8, y: 5.3, w: 2, h: 0.45,
    fill: { color: C.cobalt }, rectRadius: 0.06,
  });
  s.addText('CC  Captions on', {
    x: 0.8, y: 5.3, w: 2, h: 0.45,
    fontSize: 10, fontFace: 'Arial', color: C.white, align: 'center', valign: 'middle',
  });

  s.addNotes('STORYLINE: Audio embed with player controls + transcript layer. Captions enabled by default. Generated via NotebookLM or ElevenLabs/MiniMax TTS.');
  addChrome(s, 12);

  // ===== SLIDE 13: Branching Scenario =====
  s = pptx.addSlide();
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: C.white } });
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 13.33, h: 0.9, fill: { color: C.navy } });
  s.addText('Choose the best accessibility response', {
    x: 0.8, y: 0.1, w: 10, h: 0.7,
    fontSize: 22, fontFace: 'Arial Black', color: C.white,
  });
  s.addText('The patient is frustrated trying to complete the intake form.', {
    x: 0.8, y: 1.2, w: 11, h: 0.4,
    fontSize: 14, fontFace: 'Arial', color: C.navy, bold: true,
  });
  s.addText('What do you do next, before assuming the cause?', {
    x: 0.8, y: 1.7, w: 11, h: 0.4,
    fontSize: 13, fontFace: 'Arial', color: C.muted,
  });
  s.addText('You don\'t yet know whether the barrier is vision, language, digital access, cognitive load, or something else.', {
    x: 0.8, y: 2.3, w: 11, h: 0.4,
    fontSize: 11, fontFace: 'Arial', color: C.muted,
  });

  // Choice buttons (BIGGER as requested)
  const choices = [
    { letter: 'A', text: 'Continue with the standard intake process.', color: C.neutral },
    { letter: 'B', text: 'Pause and ask how to support the patient.', color: C.cobalt },
    { letter: 'C', text: 'Ask another staff member to take over.', color: C.neutral },
  ];

  choices.forEach((ch, i) => {
    const y = 3.0 + i * 1.1;
    const isRecommended = ch.letter === 'B';
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.8, y: y, w: 11.5, h: 0.9,
      fill: { color: isRecommended ? C.cobaltBg.replace('#','') : C.neutral2.replace('#','') },
      line: { color: isRecommended ? C.cobalt : C.neutral, width: isRecommended ? 2 : 1 },
      rectRadius: 0.1,
    });
    // Letter badge
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 1.1, y: y + 0.2, w: 0.5, h: 0.5,
      fill: { color: isRecommended ? C.cobalt : C.muted }, rectRadius: 0.08,
    });
    s.addText(ch.letter, {
      x: 1.1, y: y + 0.2, w: 0.5, h: 0.5,
      fontSize: 14, fontFace: 'Arial Black', color: C.white, align: 'center', valign: 'middle',
    });
    s.addText(ch.text, {
      x: 1.9, y: y, w: 10, h: 0.9,
      fontSize: 14, fontFace: 'Arial', color: C.black, valign: 'middle',
    });
  });

  // Feedback
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8, y: 6.1, w: 11.5, h: 0.5,
    fill: { color: C.chartreuseBg.replace('#','') }, rectRadius: 0.06,
  });
  s.addText('Pausing and asking, before assuming, is the single behaviour that distinguishes accessible care from "trying our best".', {
    x: 1.1, y: 6.1, w: 11, h: 0.5,
    fontSize: 10, fontFace: 'Arial', color: C.chartreuse, valign: 'middle',
  });

  s.addNotes('STORYLINE: Decision branch with 3 choices. Each opens a consequence panel layer. Correct: B. Use variables to track. Loop back to Decision Path after feedback.');
  addChrome(s, 13);

  // ===== SLIDE 14: Journey Closing =====
  s = pptx.addSlide();
  s.addImage({ path: path.join(OUT, 'bg-navy.png'), x: 0, y: 0, w: 13.33, h: 7.5 });
  s.addText('Accessibility First', {
    x: 0.8, y: 0.5, w: 10, h: 0.6,
    fontSize: 24, fontFace: 'Arial Black', color: C.white,
  });
  s.addText('A three-stage journey', {
    x: 0.8, y: 1.1, w: 10, h: 0.4,
    fontSize: 14, fontFace: 'Arial', color: 'AAAAAA',
  });
  s.addText('Guides unlock by stage. Foundations open everything else. Complete all nine of the first two stages to unlock applied practice.', {
    x: 0.8, y: 1.6, w: 10, h: 0.5,
    fontSize: 11, fontFace: 'Arial', color: '999999',
  });

  // Three stages
  const stages = [
    { name: 'Foundations', guides: '1-4', color: C.cobalt, status: 'Current' },
    { name: 'Understanding', guides: '5-9', color: C.lilac, status: 'Locked' },
    { name: 'Applied Practice', guides: '10-18', color: C.chartreuse, status: 'Locked' },
  ];

  stages.forEach((stage, i) => {
    const x = 0.8 + i * 4;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: x, y: 2.5, w: 3.6, h: 3.5,
      fill: { color: '1E3066' }, rectRadius: 0.12,
      line: { color: stage.color, width: i === 0 ? 2 : 1 },
    });
    s.addText(stage.name, {
      x: x, y: 2.8, w: 3.6, h: 0.5,
      fontSize: 16, fontFace: 'Arial Black', color: stage.color, align: 'center',
    });
    s.addText(`Guides ${stage.guides}`, {
      x: x, y: 3.3, w: 3.6, h: 0.3,
      fontSize: 11, fontFace: 'Arial', color: 'AAAAAA', align: 'center',
    });
    // Status badge
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: x + 1.1, y: 5.2, w: 1.4, h: 0.35,
      fill: { color: i === 0 ? stage.color : '333333' }, rectRadius: 0.06,
    });
    s.addText(stage.status, {
      x: x + 1.1, y: 5.2, w: 1.4, h: 0.35,
      fontSize: 9, fontFace: 'Arial', color: C.white, bold: true, align: 'center', valign: 'middle',
    });
  });

  s.addNotes('STORYLINE: Course completion slide. Trigger certificate if applicable. Show progress across the 18-guide series.');
  addChrome(s, 14);

  // Save
  const outPath = path.join(OUT, 'UHN_Guide01_Mockup.pptx');
  await pptx.writeFile({ fileName: outPath });
  console.log(`PPT saved: ${outPath}`);
}

buildPresentation().catch(err => { console.error(err); process.exit(1); });
