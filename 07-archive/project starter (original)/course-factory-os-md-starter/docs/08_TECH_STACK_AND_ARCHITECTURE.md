# 08 Tech Stack and Architecture

## Recommended Tech Stack

### Frontend

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Hook Form
- Zod

### Backend

- Next.js route handlers or server actions
- Supabase Postgres
- Supabase Auth
- Supabase Storage
- Prisma or Supabase client

### AI Layer

- Anthropic Claude API or OpenAI API
- AI wrapper in `lib/ai`
- Prompt templates in `prompts/`
- Zod validation for every AI output

### Exports

- docx for Word storyboard export
- exceljs for Excel tracker export
- pptxgenjs for PPT outline export

### Deployment

- Vercel
- Supabase hosted project

## High-Level Architecture

```txt
User Interface
  ↓
Next.js App Router
  ↓
Server Actions / API Routes
  ↓
Domain Services
  ↓
Supabase Database + Storage
  ↓
AI Provider Service
  ↓
Validated Structured JSON
  ↓
UI Rendering + Export Services
```

## Suggested Folder Structure

```txt
app/
  dashboard/
  projects/
  projects/[projectId]/
  projects/[projectId]/guides/[guideId]/
  api/
    ai/
      intake/
      structure-source/
      blueprint/
      storyboard/
      assessment/
      qa/
    exports/
components/
  dashboard/
  projects/
  storyboard/
  qa/
  exports/
lib/
  ai/
    client.ts
    schemas/
    prompts/
  db/
  types/
  utils/
  export/
prompts/
  course-intake.md
  source-structuring.md
  blueprint-generator.md
  storyboard-architect.md
  qa-checker.md
docs/
templates/
```

## AI Service Pattern

Every AI service should follow this pattern:

1. Accept typed input.
2. Build prompt from template.
3. Call AI provider.
4. Parse JSON.
5. Validate with Zod.
6. Store structured output.
7. Return object to UI.

Example service names:

- `generateCourseIntake()`
- `structureSourceMaterial()`
- `generateBlueprint()`
- `generateStoryboard()`
- `generateAssessments()`
- `generateSMEReviewItems()`
- `runAccessibilityQA()`

## AI Cost Control

For large documents:

- chunk source text by guide or section
- summarize chunks first
- store structured summaries
- only send relevant sections for storyboard generation
- avoid repeatedly sending the entire source document

## Security and Privacy

Development rule:

- Use synthetic data first.
- Treat uploaded healthcare/internal training content as sensitive.
- Do not send confidential content to public APIs unless explicitly approved.
- Add a warning in the upload flow.

## MVP Database Tables

Start with these tables:

- workspaces
- projects
- course_series
- course_guides
- source_documents
- source_sections
- course_blueprints
- learning_objectives
- storyboard_screens
- assessment_items
- sme_review_items
- qa_items
- export_packages

Add media_tasks later if needed.
