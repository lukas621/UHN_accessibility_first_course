# 03 MVP Scope

## MVP Name

Course Factory OS v0.1

## MVP Objective

Build an internal tool that helps one instructional designer manage and accelerate a large multi-course eLearning production project.

The MVP should prove that the workflow can convert a large source document into course blueprints, storyboards, review questions, QA checklists, and exportable production assets.

## Must-Have Features

### 1. Project Dashboard

Show:

- total courses
- courses by status
- courses awaiting SME review
- courses in development
- courses in QA
- overdue items
- recent activity

### 2. Course Series Project

Allow user to create a course series with:

- series name
- description
- target audience
- course owner
- project deadline
- default output type
- default design system

### 3. Course / Guide Records

Each course/guide should have:

- guide number
- title
- status
- target audience
- purpose
- primary focus
- learning emphasis
- core objectives
- key themes
- source sections
- SME review status
- QA status
- export status

### 4. Source Material Upload

Allow upload or paste of:

- Word document
- PDF
- PPT
- plain text
- transcript

For MVP, file upload can be basic. If document parsing is hard, start with paste text.

### 5. Source Material Structuring

AI extracts:

- sections
- purpose
- primary focus
- learning emphasis
- objectives
- key themes
- scenarios
- reflection questions
- tips
- action planning items
- references

### 6. Blueprint Generator

AI generates:

- course goal
- revised learning objectives
- module/lesson structure
- estimated seat time
- assessment strategy
- interaction strategy
- SME questions

### 7. Storyboard Builder

Editable table with columns:

- screen number
- lesson/module
- screen title
- screen purpose
- on-screen text
- narration/script
- interaction type
- visual/media direction
- assessment/reflection
- performance support item
- SME review level
- accessibility note
- status

### 8. SME Review Question Generator

AI generates targeted questions by risk level:

- factual accuracy
- policy accuracy
- terminology
- scenario realism
- clinical risk
- accessibility/cultural safety sensitivity
- approval needs

### 9. Assessment Generator

AI generates:

- formative knowledge checks
- scenario-based questions
- reflection prompts
- end-of-module quiz items
- feedback for each option

### 10. Accessibility + ID QA Checklist

AI checks:

- measurable objectives
- objective-assessment alignment
- content chunking
- reading level
- plain language
- acronym explanation
- alt text need
- caption/transcript need
- keyboard accessibility note
- inclusive language
- SME approval gaps

### 11. Production Status Board

Use statuses:

```txt
Intake
Source Parsed
Analysis Ready
Blueprint Ready
Storyboard Draft
SME Review
Storyboard Approved
Media Production
Course Build
Internal QA
SME Final Review
LMS Testing
Published
Handoff Complete
Maintenance Scheduled
```

### 12. Export

MVP exports:

- Word storyboard
- Excel storyboard tracker
- PPT draft outline
- QA checklist
- SME review package

PPT export can be simple in v0.1.

## Nice-to-Have Later

- public SME review link
- inline comments
- full version diff
- media generation integrations
- SCORM generation
- LMS integration
- real-time collaboration
- role-based permissions
- Stripe billing

## Explicitly Out of Scope for MVP

- replacing Storyline/Rise
- fully automated final course build
- legal/compliance final approval
- publishing directly to LMS
- enterprise-grade security review
- multi-tenant billing system
