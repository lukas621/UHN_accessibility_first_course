# 07 AI Skills and Prompts

This document defines the reusable AI workflows for Course Factory OS. Each skill should have a structured input, structured JSON output, quality rules, and human review requirements.

## Global AI Rules

1. Always produce structured JSON first.
2. Never final-approve clinical, legal, policy, or compliance content.
3. Flag uncertain content for SME review.
4. Preserve the original meaning of source material.
5. Use plain language suitable for workplace learning.
6. Include accessibility notes for learning assets.
7. Align assessments with learning objectives.
8. Avoid inventing facts not supported by source material.

---

## Skill 1: Course Intake Skill

### Purpose

Convert a course request into a lightweight project charter.

### Input

- course request text
- requester notes
- known target audience
- due date
- output format

### Output JSON

```json
{
  "project_title": "",
  "target_audience": "",
  "business_or_learning_need": "",
  "urgency": "low|medium|high|critical",
  "risk_level": "low|medium|high|critical",
  "recommended_id_model": "",
  "recommended_workflow": [],
  "success_criteria": [],
  "sme_roles_needed": [],
  "assumptions": [],
  "open_questions": []
}
```

### Prompt Template

```txt
You are an expert instructional designer. Analyze the course request and create a lightweight course project charter. Healthcare projects may skip formal needs analysis, but still document audience, rationale, risk, success criteria, and SME needs. Do not invent facts. Put unknown items in open_questions.

Course request:
{{course_request}}
```

---

## Skill 2: Source Material Structuring Skill

### Purpose

Extract structured course data from SME/source materials.

### Input

- parsed document text
- optional source page numbers

### Output JSON

```json
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
```

### Prompt Template

```txt
You are structuring a large source document for an eLearning course series. Extract the repeated instructional elements into JSON. Preserve source meaning. Do not rewrite deeply yet. Identify gaps and SME questions. If the document contains multiple guides or courses, split them into separate course records.

Source text:
{{source_text}}
```

---

## Skill 3: ID Model Selector Skill

### Purpose

Recommend an instructional design model and production workflow.

### Output JSON

```json
{
  "recommended_model": "ADDIE|SAM|Agile|Dick and Carey|Hybrid",
  "hybrid_details": "",
  "rationale": [],
  "review_gates": [],
  "risks": [],
  "production_sprint_plan": []
}
```

### Decision Logic

- Large compliance course series: ADDIE + Agile sprints
- Rapid microlearning: SAM
- High-risk clinical content: ADDIE with SME validation gates
- Scenario-heavy behavioural course: Dick and Carey + scenario design
- Conversion project: Agile + template-based production

---

## Skill 4: Learning Objective Architect Skill

### Purpose

Create or refine CLOs and SLOs.

### Output JSON

```json
{
  "course_goal": "",
  "learning_objectives": [
    {
      "id": "CLO1",
      "objective": "",
      "bloom_level": "remember|understand|apply|analyze|evaluate|create",
      "source_basis": "",
      "assessment_strategy": ""
    }
  ],
  "sub_learning_outcomes": [],
  "alignment_notes": [],
  "sme_questions": []
}
```

### Quality Rules

- Use measurable verbs.
- Avoid vague verbs like understand unless context requires it.
- Keep objectives realistic for seat time.
- Link objectives to assessments.

---

## Skill 5: Storyboard Architect Skill

### Purpose

Generate a screen-by-screen storyboard from structured course content.

### Output JSON

```json
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
```

### Prompt Template

```txt
You are an expert healthcare instructional designer. Convert the structured course content into a practical eLearning storyboard. Use chunking, scaffolding, scenarios, reflection, and knowledge checks. Keep text concise and learner-facing. Include accessibility notes and SME review level for every screen.

Course content:
{{structured_course_json}}
```

---

## Skill 6: Interaction Designer Skill

### Purpose

Recommend the best presentation or interaction strategy for each content chunk.

### Strategy Mapping

| Content Type | Suggested Strategy |
|---|---|
| Definition | concise text + example |
| Process | step interaction |
| Decision model | scenario branch or decision tree |
| Policy rule | case comparison |
| Behavioural skill | scenario-based practice |
| Checklist | downloadable job aid |
| Reflection | MAP activity or text reflection |
| Complex explanation | short video or narrated animation |

### Output JSON

```json
{
  "recommendations": [
    {
      "content_chunk_id": "",
      "recommended_strategy": "",
      "rationale": "",
      "production_effort": "low|medium|high",
      "accessibility_considerations": [],
      "alternative_low_effort_option": ""
    }
  ]
}
```

---

## Skill 7: Scenario-Based Learning Skill

### Purpose

Create realistic scenarios from source content.

### Output JSON

```json
{
  "scenarios": [
    {
      "title": "",
      "setup": "",
      "learner_role": "",
      "decision_point": "",
      "choices": [
        {
          "choice_text": "",
          "is_best_choice": true,
          "feedback": "",
          "consequence": ""
        }
      ],
      "debrief": "",
      "sme_accuracy_questions": [],
      "accessibility_notes": []
    }
  ]
}
```

---

## Skill 8: Assessment and Kirkpatrick Skill

### Purpose

Generate formative/summative assessment and evaluation tools.

### Output JSON

```json
{
  "assessment_items": [
    {
      "type": "multiple_choice|multi_select|scenario|reflection|matching|short_answer",
      "question": "",
      "options": [],
      "correct_answer": "",
      "feedback": "",
      "linked_objective_id": "",
      "bloom_level": "",
      "kirkpatrick_level": 1
    }
  ],
  "evaluation_plan": {
    "level_1_reaction": [],
    "level_2_learning": [],
    "level_3_behavior": [],
    "level_4_results": []
  }
}
```

---

## Skill 9: SME Review Manager Skill

### Purpose

Generate targeted SME review questions and identify high-risk content.

### Output JSON

```json
{
  "review_items": [
    {
      "screen_number": 1,
      "content_area": "",
      "risk_level": "low|medium|high|critical",
      "review_question": "",
      "reason_sme_needed": "",
      "suggested_reviewer_role": "SME|course_owner|legal|policy|accessibility|clinical_lead"
    }
  ],
  "approval_checklist": [],
  "unresolved_risks": []
}
```

---

## Skill 10: Multimedia Producer Skill

### Purpose

Generate production-ready scripts and prompts for multimedia assets.

### Output JSON

```json
{
  "media_tasks": [
    {
      "asset_type": "video|podcast|voiceover|infographic|illustration|scenario_video|html5_interaction|job_aid",
      "title": "",
      "linked_screen_numbers": [],
      "production_tool": "Remotion|NotebookLM|Image Generation|Video Generation|TTS|HTML5",
      "script_or_prompt": "",
      "style_notes": "",
      "accessibility_requirements": [],
      "estimated_effort": "low|medium|high"
    }
  ]
}
```

---

## Skill 11: UI/UX Consistency Skill

### Purpose

Ensure consistent course design across a course series.

### Output JSON

```json
{
  "design_system": {
    "layout_rules": [],
    "typography_rules": [],
    "color_rules": [],
    "interaction_patterns": [],
    "accessibility_rules": [],
    "component_templates": []
  },
  "consistency_issues": [],
  "recommendations": []
}
```

---

## Skill 12: Accessibility QA Skill

### Purpose

Check accessibility, inclusive design, and instructional quality.

### Output JSON

```json
{
  "qa_items": [
    {
      "category": "accessibility|instructional_design|content_quality|assessment_alignment|sme_approval|media|handoff",
      "severity": "low|medium|high|critical",
      "issue": "",
      "recommendation": "",
      "linked_screen_number": null,
      "requires_human_review": true
    }
  ],
  "passed_checks": [],
  "summary": ""
}
```

### QA Checks

- measurable objectives
- objective-assessment alignment
- plain language
- content chunking
- acronym explanation
- alt text needs
- caption/transcript needs
- keyboard accessibility
- colour contrast reminders
- inclusive language
- SME approval for high-risk content
- consistent terminology
- complete handoff materials

---

## Skill 13: Handoff Package Skill

### Purpose

Generate final handoff checklist and package metadata.

### Output JSON

```json
{
  "handoff_checklist": [
    {
      "item": "",
      "required": true,
      "status": "missing|in_progress|complete",
      "notes": ""
    }
  ],
  "file_inventory": [],
  "lms_testing_checklist": [],
  "maintenance_schedule": [],
  "post_project_sme_survey": []
}
```
