const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const HTML_PATH = '/Users/yijin/Documents/New Company Claude/UHN Accessibility Course/02-branding-and-style/mockups/UHN Accessibility First - Guide 1 _standalone_.html';
const OUT_DIR = '/Users/yijin/Documents/New Company Claude/UHN Accessibility Course/06-exports/design-system-ppt/slides';

async function capture() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 2400, height: 1400 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  
  await page.goto('file://' + HTML_PATH, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(4000);
  
  const slideCount = await page.evaluate(() => document.querySelectorAll('section').length);
  console.log('Found ' + slideCount + ' slides');
  
  for (let i = 0; i < slideCount; i++) {
    if (i > 0) {
      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(800);
    }
    
    const outFile = path.join(OUT_DIR, 'slide-' + String(i + 1).padStart(2, '0') + '.png');
    
    // Find the active section element
    const bounds = await page.evaluate((idx) => {
      const sections = document.querySelectorAll('section');
      // The deck-stage likely transforms/positions sections
      // Find the one that's currently displayed
      for (const s of sections) {
        const rect = s.getBoundingClientRect();
        if (rect.width >= 1900 && rect.height >= 1000) {
          return { x: Math.round(rect.x), y: Math.round(rect.y), w: Math.round(rect.width), h: Math.round(rect.height) };
        }
      }
      // Check all and find the largest visible one
      let best = null;
      let bestArea = 0;
      for (const s of sections) {
        const rect = s.getBoundingClientRect();
        const area = rect.width * rect.height;
        if (area > bestArea && rect.width > 500) {
          bestArea = area;
          best = { x: Math.round(rect.x), y: Math.round(rect.y), w: Math.round(rect.width), h: Math.round(rect.height) };
        }
      }
      return best;
    }, i);
    
    if (bounds) {
      // Resize screenshot to exactly 1920x1080
      await page.screenshot({ 
        path: outFile, 
        type: 'png',
        clip: { x: bounds.x, y: bounds.y, width: bounds.w, height: bounds.h }
      });
      console.log('Slide ' + (i+1) + ': ' + bounds.w + 'x' + bounds.h);
    } else {
      await page.screenshot({ path: outFile, type: 'png' });
      console.log('Slide ' + (i+1) + ': full viewport (fallback)');
    }
  }
  
  // Resize all captures to exactly 1920x1080
  const sharp = require('sharp');
  const files = fs.readdirSync(OUT_DIR).filter(f => f.endsWith('.png'));
  for (const file of files) {
    const filePath = path.join(OUT_DIR, file);
    const tmpPath = filePath + '.tmp.png';
    await sharp(filePath).resize(1920, 1080, { fit: 'fill' }).toFile(tmpPath);
    fs.renameSync(tmpPath, filePath);
  }
  console.log('All slides resized to 1920x1080');
  
  await browser.close();
  console.log('Done');
}

capture().catch(err => { console.error(err); process.exit(1); });
