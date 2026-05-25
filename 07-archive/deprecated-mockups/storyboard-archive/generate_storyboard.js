const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  WidthType, HeadingLevel, AlignmentType, BorderStyle, ImageRun,
  PageBreak, Header, Footer, PageNumber, NumberFormat,
  VerticalAlign, ShadingType, TableLayoutType,
} = require("docx");

// ── Brand constants ──
const NAVY = "192858";
const RED = "C0233B";
const COBALT = "245BAA";
const LILAC = "C48ABD";
const CHARTREUSE = "74AE54";
const WHITE = "FFFFFF";
const BLACK = "000000";
const LIGHT_GREY = "F4F4F4";
const FONT_BODY = "Arial";
const FONT_TITLE = "Arial Black";

// ── Load content ──
const content = JSON.parse(fs.readFileSync("/tmp/storyboard_full_content.json", "utf-8"));
const logoPath = "/Users/yijin/Documents/New Company Claude/UHN Accessibility Course/02-branding-and-style/logos/uhn_logo_2.png";
const logoBuffer = fs.readFileSync(logoPath);

// ── Helpers ──
function textRun(text, opts = {}) {
  return new TextRun({
    text,
    font: opts.font || FONT_BODY,
    size: opts.size || 22, // 11pt
    bold: opts.bold || false,
    italics: opts.italics || false,
    color: opts.color || BLACK,
    break: opts.break,
  });
}

function emptyPara() {
  return new Paragraph({ children: [textRun("")] });
}

function heading(text, level, extraChildren) {
  const isH1 = level === HeadingLevel.HEADING_1;
  const isH2 = level === HeadingLevel.HEADING_2;
  const font = isH1 ? FONT_TITLE : FONT_BODY;
  const size = isH1 ? 32 : isH2 ? 28 : 24; // 16pt, 14pt, 12pt
  const color = (level === HeadingLevel.HEADING_3) ? COBALT : NAVY;
  const children = [textRun(text, { font, size, bold: true, color })];
  if (extraChildren) children.push(...extraChildren);
  return new Paragraph({ heading: level, children, spacing: { before: 240, after: 120 } });
}

function bodyPara(text, opts = {}) {
  // Split text on \n to create multiple runs with line breaks
  const lines = text.split("\n");
  const children = [];
  lines.forEach((line, i) => {
    if (i > 0) children.push(textRun("", { break: 1 }));
    children.push(textRun(line, {
      bold: opts.bold || false,
      italics: opts.italics || false,
      color: opts.color || BLACK,
      size: opts.size || 22,
    }));
  });
  return new Paragraph({
    children,
    spacing: { before: opts.spaceBefore || 80, after: opts.spaceAfter || 80 },
    alignment: opts.alignment,
  });
}

const thinBorder = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const cellBorders = { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder };

function headerCell(text, width, colSpan) {
  const opts = {
    children: [
      new Paragraph({
        children: [textRun(text, { bold: true, color: WHITE, size: 20 })],
        alignment: AlignmentType.LEFT,
      }),
    ],
    shading: { fill: NAVY, type: ShadingType.CLEAR },
    borders: cellBorders,
    verticalAlign: VerticalAlign.CENTER,
    margins: { top: 60, bottom: 60, left: 80, right: 80 },
  };
  if (width) opts.width = { size: width, type: WidthType.PERCENTAGE };
  if (colSpan) opts.columnSpan = colSpan;
  return new TableCell(opts);
}

function bodyCell(text, width, opts2 = {}) {
  // handle multiline cell content
  const lines = (text || "").split("\n");
  const paragraphs = lines.map((line) =>
    new Paragraph({
      children: [textRun(line, {
        size: opts2.size || 20,
        bold: opts2.bold || false,
        color: opts2.color || BLACK,
      })],
      alignment: AlignmentType.LEFT,
    })
  );
  const cellOpts = {
    children: paragraphs,
    borders: cellBorders,
    verticalAlign: VerticalAlign.TOP,
    margins: { top: 60, bottom: 60, left: 80, right: 80 },
  };
  if (width) cellOpts.width = { size: width, type: WidthType.PERCENTAGE };
  if (opts2.shading) cellOpts.shading = { fill: opts2.shading, type: ShadingType.CLEAR };
  if (opts2.colSpan) cellOpts.columnSpan = opts2.colSpan;
  return new TableCell(cellOpts);
}

function make2ColTable(data, col1Width, col2Width) {
  col1Width = col1Width || 30;
  col2Width = col2Width || 70;
  const rows = data.map((row, ri) => {
    if (ri === 0 && data.length > 1) {
      // Check if first row looks like a header
      const isHeader = row.every((c) => c.length < 80);
      if (isHeader && data.length > 2) {
        return new TableRow({
          children: [
            headerCell(row[0], col1Width),
            headerCell(row[1], col2Width),
          ],
        });
      }
    }
    const shade = ri % 2 === 0 ? undefined : LIGHT_GREY;
    return new TableRow({
      children: [
        bodyCell(row[0], col1Width, { bold: true, shading: shade }),
        bodyCell(row[1], col2Width, { shading: shade }),
      ],
    });
  });
  return new Table({
    rows,
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.FIXED,
  });
}

function makeGenericTable(data, colCount) {
  const colWidth = Math.floor(100 / colCount);
  const rows = data.map((row, ri) => {
    const isFirst = ri === 0;
    const cells = [];
    for (let ci = 0; ci < colCount; ci++) {
      const val = row[ci] || "";
      if (isFirst) {
        cells.push(headerCell(val, colWidth));
      } else {
        const shade = ri % 2 === 0 ? LIGHT_GREY : undefined;
        cells.push(bodyCell(val, colWidth, { shading: shade }));
      }
    }
    return new TableRow({ children: cells });
  });
  return new Table({
    rows,
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.FIXED,
  });
}

function bannerTable(text) {
  return new Table({
    rows: [
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                children: [textRun(text, { bold: true, color: WHITE, size: 28, font: FONT_TITLE })],
                alignment: AlignmentType.CENTER,
              }),
            ],
            shading: { fill: NAVY, type: ShadingType.CLEAR },
            borders: cellBorders,
            margins: { top: 120, bottom: 120, left: 80, right: 80 },
          }),
        ],
      }),
    ],
    width: { size: 100, type: WidthType.PERCENTAGE },
  });
}

function makeScreenTable(tableData) {
  // Row 0: header row with screen info (3 cells, last 2 merged visually)
  // Row 1: Step | Activities | Design Guide (column headers)
  // Row 2: content row
  const row0 = tableData[0];
  const row1 = tableData[1];
  const row2 = tableData[2];

  const headerRow = new TableRow({
    children: [
      new TableCell({
        children: [new Paragraph({
          children: [textRun(row0[0], { bold: true, color: WHITE, size: 20 })],
        })],
        shading: { fill: NAVY, type: ShadingType.CLEAR },
        borders: cellBorders,
        margins: { top: 60, bottom: 60, left: 80, right: 80 },
        width: { size: 15, type: WidthType.PERCENTAGE },
      }),
      new TableCell({
        children: [new Paragraph({
          children: [textRun(row0[1], { bold: true, color: WHITE, size: 20 })],
        })],
        shading: { fill: COBALT, type: ShadingType.CLEAR },
        borders: cellBorders,
        margins: { top: 60, bottom: 60, left: 80, right: 80 },
        width: { size: 85, type: WidthType.PERCENTAGE },
        columnSpan: 2,
      }),
    ],
  });

  const subHeaderRow = new TableRow({
    children: [
      headerCell(row1[0] || "Step", 15),
      headerCell(row1[1] || "Activities", 50),
      headerCell(row1[2] || "Design Guide", 35),
    ],
  });

  // Content row: split on \n for paragraphs
  function multiLineParagraphs(text, size) {
    const lines = (text || "").split("\n");
    return lines.map((line) =>
      new Paragraph({
        children: [textRun(line, { size: size || 18 })],
        spacing: { before: 20, after: 20 },
      })
    );
  }

  const contentRow = new TableRow({
    children: [
      new TableCell({
        children: [new Paragraph({
          children: [textRun(row2[0] || "", { bold: true, size: 20, color: NAVY })],
        })],
        borders: cellBorders,
        margins: { top: 60, bottom: 60, left: 80, right: 80 },
        width: { size: 15, type: WidthType.PERCENTAGE },
        verticalAlign: VerticalAlign.TOP,
      }),
      new TableCell({
        children: multiLineParagraphs(row2[1], 18),
        borders: cellBorders,
        margins: { top: 60, bottom: 60, left: 80, right: 80 },
        width: { size: 50, type: WidthType.PERCENTAGE },
        verticalAlign: VerticalAlign.TOP,
      }),
      new TableCell({
        children: multiLineParagraphs(row2[2], 18),
        borders: cellBorders,
        margins: { top: 60, bottom: 60, left: 80, right: 80 },
        width: { size: 35, type: WidthType.PERCENTAGE },
        verticalAlign: VerticalAlign.TOP,
      }),
    ],
  });

  return new Table({
    rows: [headerRow, subHeaderRow, contentRow],
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.FIXED,
  });
}

function makeSourceDocTable(text) {
  // Single-cell table for the source doc text blocks
  const lines = text.split("\n");
  const paragraphs = lines.map((line) =>
    new Paragraph({
      children: [textRun(line, { size: 20 })],
      spacing: { before: 20, after: 20 },
    })
  );
  return new Table({
    rows: [
      new TableRow({
        children: [
          new TableCell({
            children: paragraphs,
            borders: cellBorders,
            margins: { top: 80, bottom: 80, left: 100, right: 100 },
            shading: { fill: "FAFAFA", type: ShadingType.CLEAR },
          }),
        ],
      }),
    ],
    width: { size: 100, type: WidthType.PERCENTAGE },
  });
}

// ── Lookup tables by index ──
const tables = {};
content.forEach((item) => {
  if (item.type === "table") {
    tables[item.index] = item;
  }
});

// ── Build document sections ──
const children = [];

// ─── COVER PAGE ───
children.push(emptyPara());
children.push(emptyPara());
children.push(new Paragraph({
  children: [
    new ImageRun({
      data: logoBuffer,
      transformation: { width: 200, height: 80 },
      altText: { title: "UHN Logo", description: "University Health Network logo" },
    }),
  ],
  alignment: AlignmentType.CENTER,
}));
children.push(emptyPara());
children.push(emptyPara());
children.push(new Paragraph({
  children: [textRun("Accessibility First eLearning Series", { font: FONT_TITLE, size: 36, color: NAVY, bold: true })],
  alignment: AlignmentType.CENTER,
  spacing: { after: 200 },
}));
children.push(new Paragraph({
  children: [textRun("Course 01 — Introduction to Accessibility and Guiding Principles", { font: FONT_BODY, size: 28, color: NAVY, bold: true })],
  alignment: AlignmentType.CENTER,
  spacing: { after: 120 },
}));
children.push(new Paragraph({
  children: [textRun("Foundations of Disability, Inclusion, and Accessible Design", { font: FONT_BODY, size: 24, color: COBALT })],
  alignment: AlignmentType.CENTER,
  spacing: { after: 200 },
}));
children.push(emptyPara());

// Course info table (Table 0)
children.push(make2ColTable(tables[0].data, 25, 75));
children.push(new Paragraph({ children: [new PageBreak()] }));

// ─── HOW TO READ THIS STORYBOARD ───
children.push(heading("How to Read This Storyboard", HeadingLevel.HEADING_1));
children.push(bodyPara("Part 1 — Storyboard for Review is the section the content owner reviews and signs off. It captures the course framework, learning outcomes, summative assessments, the master screen schedule, and the module overview. Six pages."));
children.push(bodyPara("Part 2 — Designer Toolkit is the working reference for the instructional designer and the eLearning developer. It contains every screen as a 3-column table — Step \u00B7 Activities \u00B7 Design Guide — plus an image-and-infographic prompt library, the NotebookLM podcast workflow, asset naming, and Storyline build settings. The reviewer can stop at the end of Part 1."));
children.push(emptyPara());

// ─── PART 1 BANNER (Table 1) ───
children.push(bannerTable("PART 1   —   STORYBOARD FOR REVIEW"));
children.push(emptyPara());

// ─── 1.1 Course Information (Table 2) ───
children.push(heading("1.1  Course Information", HeadingLevel.HEADING_2));
children.push(make2ColTable(tables[2].data, 25, 75));
children.push(emptyPara());

// ─── 1.2 Course Development Information (Table 3) ───
children.push(heading("1.2  Course Development Information", HeadingLevel.HEADING_2));
children.push(make2ColTable(tables[3].data, 25, 75));
children.push(emptyPara());

// ─── 1.3 Competencies and Framework Mapping (Table 4) ───
children.push(heading("1.3  Competencies and Framework Mapping", HeadingLevel.HEADING_2));
children.push(make2ColTable(tables[4].data, 50, 50));
children.push(emptyPara());

// ─── 1.4 Course Learning Outcomes (Table 5) ───
children.push(heading("1.4  Course Learning Outcomes", HeadingLevel.HEADING_2));
children.push(bodyPara("By the end of this course, learners will be able to:"));
children.push(makeGenericTable(tables[5].data, 2));
children.push(emptyPara());

// ─── 1.5 Summative Assessments (Table 6) ───
children.push(heading("1.5  Summative Assessments", HeadingLevel.HEADING_2));
children.push(makeGenericTable(tables[6].data, 4));
children.push(emptyPara());

// CLO x Assessment Matrix (Table 7)
children.push(heading("CLO \u00D7 Assessment Mapping", HeadingLevel.HEADING_3));
children.push(makeGenericTable(tables[7].data, 5));
children.push(new Paragraph({ children: [new PageBreak()] }));

// ─── 1.6 Master Screen Schedule (Table 8) ───
children.push(heading("1.6  Master Screen Schedule", HeadingLevel.HEADING_2));
children.push(bodyPara("All 24 screens, organized into 7 scenes that map directly to Articulate Storyline scenes. Module length is intentionally longer than the 6-minute Digitization Guidance default to preserve full content fidelity from Guide 1; text-heavy content uses click-and-review patterns."));
children.push(makeGenericTable(tables[8].data, 5));
children.push(new Paragraph({ children: [new PageBreak()] }));

// ─── 1.7 Module Overview (Table 9) ───
children.push(heading("1.7  Module Overview", HeadingLevel.HEADING_2));
children.push(make2ColTable(tables[9].data, 25, 75));
children.push(emptyPara());

// ─── 1.8 Version Control & Sign-off ───
children.push(heading("1.8  Version Control & Sign-off", HeadingLevel.HEADING_2));
children.push(makeGenericTable(tables[10].data, 4));
children.push(emptyPara());
children.push(heading("Content Owner Sign-off", HeadingLevel.HEADING_3));
children.push(make2ColTable(tables[11].data, 25, 75));
children.push(new Paragraph({ children: [new PageBreak()] }));

// ─── PART 2 BANNER (Table 12) ───
children.push(bannerTable("PART 2   —   DESIGNER TOOLKIT  (for Yi Jin / Developer)"));
children.push(emptyPara());
children.push(bodyPara("Per-screen 3-column tables (Step \u00B7 Activities \u00B7 Design Guide). The Design Guide column captures the interaction format, accessibility specifications, and — for visuals — the image / infographic generation prompt you can paste into Claude Code, Gemini, or Imagen 3. For audio-rich scenarios, the column references the NotebookLM Audio Overview workflow."));
children.push(emptyPara());

// ─── Screen Tables (Tables 13-36) — 24 screens ───
for (let ti = 13; ti <= 36; ti++) {
  const t = tables[ti];
  if (!t) continue;
  children.push(makeScreenTable(t.data));
  children.push(emptyPara());
  // Add page break after every 2 screens for readability
  if ((ti - 13) % 2 === 1) {
    children.push(new Paragraph({ children: [new PageBreak()] }));
  }
}

// ─── Appendix A: Image & Infographic Generation Prompt Library (Table 37) ───
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(heading("Appendix A.  Image & Infographic Generation Prompt Library", HeadingLevel.HEADING_1));
children.push(bodyPara("Reuse these prompts in Claude Code (with Imagen 3), Gemini, or OpenAI DALL-E. All prompts are tuned to the UHN brand: warm-neutral palette, single-weight outline icons, monochrome UHN navy on transparent background for vectors, and dignified photographic compositions with NO disability stereotypes."));
children.push(makeGenericTable(tables[37].data, 3));
children.push(emptyPara());

// ─── Appendix B: NotebookLM Audio Overview Workflow (Table 38) ───
children.push(heading("Appendix B.  NotebookLM Audio Overview Workflow (for Slides 5.1 & 5.2)", HeadingLevel.HEADING_1));
children.push(make2ColTable(tables[38].data, 10, 90));
children.push(emptyPara());

// ─── Appendix C: Asset Naming Convention (Table 39) ───
children.push(heading("Appendix C.  Asset Naming Convention", HeadingLevel.HEADING_1));
children.push(make2ColTable(tables[39].data, 20, 80));
children.push(emptyPara());

// ─── Appendix D: Storyline Theme & Publish Settings (Table 40) ───
children.push(heading("Appendix D.  Storyline Theme & Publish Settings", HeadingLevel.HEADING_1));
children.push(make2ColTable(tables[40].data, 25, 75));
children.push(new Paragraph({ children: [new PageBreak()] }));

// ─── Appendix E: Podcast Source Pack A ───
children.push(heading('Appendix E  —  Podcast Source Pack A:  "We\'ve Never Had a Complaint"', HeadingLevel.HEADING_1));
children.push(bodyPara("This appendix contains five source documents to upload to NotebookLM as a single notebook. NotebookLM will use them to generate the ~6\u20138 minute Audio Overview podcast referenced on Slide 5.1. All documents are designer-authored summaries of underlying material; before final upload, the content owner should verify any quoted policy text and replace TBC links with the authoritative URLs."));
children.push(emptyPara());

// E.1 (Table 41)
children.push(heading("E.1  Source Document — SBAR Scenario A (LOCKED, verbatim from Course 1 source)", HeadingLevel.HEADING_2));
children.push(makeSourceDocTable(tables[41].data[0][0]));
children.push(emptyPara());

// E.2 (Table 42)
children.push(heading("E.2  Source Document — Risk, Governance, and the Duty to Listen", HeadingLevel.HEADING_2));
children.push(makeSourceDocTable(tables[42].data[0][0]));
children.push(emptyPara());

// E.3 (Table 43)
children.push(heading("E.3  Source Document — OHRC Duty to Accommodate (Procedural and Substantive)", HeadingLevel.HEADING_2));
children.push(makeSourceDocTable(tables[43].data[0][0]));
children.push(emptyPara());

// E.4 (Table 44)
children.push(heading("E.4  Source Document — AODA Customer Service & Feedback Process", HeadingLevel.HEADING_2));
children.push(makeSourceDocTable(tables[44].data[0][0]));
children.push(new Paragraph({ children: [new PageBreak()] }));

// E.5 (Table 45)
children.push(heading("E.5  Source Document — A Realistic Vignette: The Quiet Pattern", HeadingLevel.HEADING_2));
children.push(makeSourceDocTable(tables[45].data[0][0]));
children.push(emptyPara());

// E.6 NotebookLM upload instructions (Table 46)
children.push(heading("E.6  NotebookLM Upload Instructions (Scenario A)", HeadingLevel.HEADING_2));
children.push(make2ColTable(tables[46].data, 10, 90));
children.push(emptyPara());

// E.7 Going Deeper resources (Table 47)
children.push(heading("E.7  Going Deeper Resources (Scenario A) — link from Slide 5.1", HeadingLevel.HEADING_2));
children.push(makeGenericTable(tables[47].data, 3));
children.push(new Paragraph({ children: [new PageBreak()] }));

// ─── Appendix F: Podcast Source Pack B ───
children.push(heading("Appendix F  —  Podcast Source Pack B:  Inaccessible Intake Process", HeadingLevel.HEADING_1));
children.push(bodyPara("Same structure as Appendix E. Five source documents to upload to a single NotebookLM notebook, plus upload instructions and a Going Deeper resources panel that links from Slide 5.2."));
children.push(emptyPara());

// F.1 (Table 48)
children.push(heading("F.1  Source Document — SBAR Scenario B (LOCKED, verbatim from Course 1 source)", HeadingLevel.HEADING_2));
children.push(makeSourceDocTable(tables[48].data[0][0]));
children.push(emptyPara());

// F.2 (Table 49)
children.push(heading("F.2  Source Document — AODA Design of Public Spaces & Procurement Accessibility", HeadingLevel.HEADING_2));
children.push(makeSourceDocTable(tables[49].data[0][0]));
children.push(emptyPara());

// F.3 (Table 50)
children.push(heading("F.3  Source Document — The Accessibility Decision Path applied to Scenario B", HeadingLevel.HEADING_2));
children.push(makeSourceDocTable(tables[50].data[0][0]));
children.push(new Paragraph({ children: [new PageBreak()] }));

// F.4 (Table 51)
children.push(heading("F.4  Source Document — Patient Perspective Vignette", HeadingLevel.HEADING_2));
children.push(makeSourceDocTable(tables[51].data[0][0]));
children.push(emptyPara());

// F.5 (Table 52)
children.push(heading("F.5  Source Document — Universal Design — 7 Principles", HeadingLevel.HEADING_2));
children.push(makeSourceDocTable(tables[52].data[0][0]));
children.push(emptyPara());

// F.6 NotebookLM upload instructions (Table 53)
children.push(heading("F.6  NotebookLM Upload Instructions (Scenario B)", HeadingLevel.HEADING_2));
children.push(make2ColTable(tables[53].data, 10, 90));
children.push(emptyPara());

// F.7 Going Deeper resources (Table 54)
children.push(heading("F.7  Going Deeper Resources (Scenario B) — link from Slide 5.2", HeadingLevel.HEADING_2));
children.push(makeGenericTable(tables[54].data, 3));
children.push(new Paragraph({ children: [new PageBreak()] }));

// ─── Version Control (Table 55) ───
children.push(heading("Version Control — v0.5.1 update", HeadingLevel.HEADING_1));
children.push(makeGenericTable(tables[55].data, 4));

// ── Create Document ──
const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: FONT_BODY, size: 22 },
      },
    },
  },
  sections: [
    {
      properties: {
        page: {
          margin: { top: 1440, bottom: 1440, left: 1200, right: 1200 },
          size: { orientation: "portrait" },
        },
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              children: [
                new ImageRun({
                  data: logoBuffer,
                  transformation: { width: 100, height: 40 },
                  altText: { title: "UHN Logo", description: "University Health Network logo" },
                }),
              ],
              alignment: AlignmentType.LEFT,
            }),
          ],
        }),
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              children: [
                textRun("Confidential — For Internal Use Only    |    Page ", { size: 16, color: "888888" }),
                new TextRun({
                  children: [PageNumber.CURRENT],
                  font: FONT_BODY,
                  size: 16,
                  color: "888888",
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
          ],
        }),
      },
      children,
    },
  ],
});

// ── Write file ──
const outputPath = path.join(__dirname, "Course01_Master_Storyboard_v1.0.docx");
Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(outputPath, buffer);
  console.log(`Document written to ${outputPath}`);
  console.log(`File size: ${(buffer.length / 1024).toFixed(0)} KB`);
}).catch((err) => {
  console.error("Error generating document:", err);
  process.exit(1);
});
