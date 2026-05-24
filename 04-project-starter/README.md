# Course Factory OS

Course Factory OS is an internal AI-assisted eLearning production system for instructional designers. The first pilot use case is a large accessibility-related course series with 17 course guides. The goal is to convert large SME/source materials into structured, reviewable, build-ready, accessible eLearning products.

## Product Positioning

**Not an AI course generator.**

Course Factory OS is a structured production workflow for instructional design teams. It helps IDs manage intake, source material review, course blueprinting, storyboarding, SME review, multimedia production planning, QA, LMS testing, and final handoff.

## First Internal Use Case

The first real pilot is an accessibility course series with 17 guides. The source material has a repeatable structure: guide purpose, primary focus, learning emphasis, core objectives, key themes, scenarios, reflection questions, inclusive practice tips, action planning, references, and a shared Accessibility Decision Path.

## MVP Goal

Build an internal web app where an ID can:

1. Create a course series project.
2. Upload a large source document.
3. Automatically split it into individual course/guide records.
4. Generate course blueprints.
5. Generate editable storyboards.
6. Generate SME review questions.
7. Generate assessment and activity suggestions.
8. Run instructional design and accessibility QA checks.
9. Track production status across all courses.
10. Export Word, Excel, and PPT-ready outputs.

## Suggested Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase Auth, Database, and Storage
- Vercel deployment
- OpenAI or Claude API for AI workflows
- docx for Word export
- exceljs for Excel export
- pptxgenjs for PPT draft export

## Suggested Project Structure

```txt
course-factory-os/
  app/
  components/
  lib/
  server/
  prompts/
  docs/
  templates/
  supabase/
  CLAUDE.md
  README.md
```

## Start Here in Claude Code

1. Read `CLAUDE.md` first.
2. Read `docs/01_PRODUCT_BRIEF.md`.
3. Read `docs/02_AUTOMATED_WORKFLOW.md`.
4. Implement the MVP in `docs/03_MVP_SCOPE.md`.
5. Use the AI workflow specifications in `docs/07_AI_SKILLS_AND_PROMPTS.md`.

## Non-Negotiable Product Principle

The product must preserve human accountability. AI can draft, structure, flag, recommend, and package. SMEs and IDs must approve accuracy, clinical/policy content, sensitive accessibility/cultural safety content, and final release decisions.
