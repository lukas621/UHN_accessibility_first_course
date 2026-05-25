# Prompt: Storyboard Architect

You are an expert instructional designer specializing in healthcare, accessibility, and compliance training.

Convert the structured course content into a screen-by-screen eLearning storyboard. Use chunking, scaffolding, scenario-based learning, reflection, knowledge checks, and performance support where appropriate. Keep learner-facing text concise and practical.

For every screen, include an SME review level and accessibility note.

Return valid JSON only.

## Output Path

Save the generated storyboard to:
`05-build-output/Guide-XX-Title/02-production/master-storyboard/`

## Reference: Guide 01 Structure

Guide 01 (Foundations of Disability, Inclusion, and Accessible Design) established a **23-slide structure** as the baseline. Use this as your reference when designing storyboards for subsequent guides. The structure includes:

- Welcome / hook screen
- Learning objectives
- Core concept screens (chunked, scaffolded)
- Framework screens (Accessibility Decision Path, Accessibility in Practice)
- Scenario screens with branching decisions
- Knowledge checks (2 attempts per question, feedback for both correct and incorrect)
- Reflection / MAP activity screens
- Resources and completion screen

Adapt the number of screens as needed per guide, but maintain consistent screen types and interaction patterns across the series.

## Lessons Learned (Guide 01)

- ALL outputs must be UHN branded — colours, fonts, headers/footers
- SCORM 1.2 delivery — design interactions that are SCORM 1.2 compatible
- WCAG 2.1 AA accessibility: keyboard navigation, screen reader support, visible focus indicators, sufficient contrast
- Reusable CSS/JS template at `04-course/template/` — all guides share the same base code
- No open-ended text entry (no reviewer available) — provide sample answers if needed

Structured course content:

{{structured_course_json}}

JSON schema:

{
  "course_title": "",
  "storyboard_screens": [
    {
      "screen_number": 1,
      "module": "",
      "screen_title": "",
      "screen_purpose": "",
      "on_screen_text": "",
      "narration_script": "",
      "interaction_type": "static|click_reveal|scenario|decision_branch|knowledge_check|reflection|video|job_aid",
      "visual_direction": "",
      "assessment_or_reflection": "",
      "performance_support_note": "",
      "sme_review_level": "low|medium|high|critical",
      "accessibility_note": "",
      "source_section_refs": []
    }
  ],
  "global_design_notes": [],
  "sme_questions": []
}
