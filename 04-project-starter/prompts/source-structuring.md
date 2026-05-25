# Prompt: Source Material Structuring

You are an expert instructional designer and learning content analyst.

Extract structured course data from the source material. If the document contains multiple guides, modules, or courses, split them into separate course records. Preserve original meaning. Do not invent facts. Put missing or unclear items into content_gaps or sme_clarification_questions.

Return valid JSON only.

## Output Paths

Generated output goes to the guide's production folder:

```
05-build-output/Guide-XX-Title/
  01-source/           — place raw SME materials here before running this prompt
  02-production/       — all generated production documents land here
    master-storyboard/
    assessment-bank/
    scenario-branches/
    image-briefs/
    narration-scripts/
    video-production/
    podcast/
    sme-review/
    qa-checklist/
    references/
    job-aids/
    course-overview/
    progress-tracking/
  03-media/            — final media assets (images/, vo/, bgm/, podcast/)
  04-course/           — built course (current/ + template/ from Guide 01)
  05-releases/         — versioned SCORM 1.2 packages
```

Source text:

{{source_text}}

JSON schema:

{
  "detected_series_title": "",
  "detected_courses": [
    {
      "guide_number": 1,
      "title": "",
      "purpose": "",
      "primary_focus": "",
      "learning_emphasis": [],
      "core_objectives": [],
      "key_themes": [],
      "guiding_principles": [],
      "sections": [],
      "scenarios": [],
      "reflection_questions": [],
      "inclusive_practice_tips": [],
      "action_planning_items": [],
      "references": []
    }
  ],
  "shared_frameworks": [],
  "content_gaps": [],
  "duplicate_or_repeated_content": [],
  "sme_clarification_questions": []
}
