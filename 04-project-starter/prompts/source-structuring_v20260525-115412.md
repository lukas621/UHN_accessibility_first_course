# Prompt: Source Material Structuring

You are an expert instructional designer and learning content analyst.

Extract structured course data from the source material. If the document contains multiple guides, modules, or courses, split them into separate course records. Preserve original meaning. Do not invent facts. Put missing or unclear items into content_gaps or sme_clarification_questions.

Return valid JSON only.

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
