# 04 Data Model

## Core Entities

### Workspace

Represents an organization or personal workspace.

Fields:

- id
- name
- owner_user_id
- created_at
- updated_at

### Project

Represents a course development request or production initiative.

Fields:

- id
- workspace_id
- name
- description
- requester
- course_owner
- target_audience
- deadline
- output_type
- risk_level
- status
- created_at
- updated_at

### CourseSeries

Represents a multi-course series.

Fields:

- id
- project_id
- title
- description
- total_courses
- shared_framework
- default_template_id
- status

### CourseGuide

Represents one course or guide within a series.

Fields:

- id
- course_series_id
- guide_number
- title
- purpose
- target_audience
- primary_focus
- learning_emphasis
- estimated_seat_time
- status
- sme_review_status
- qa_status
- export_status

### SourceDocument

Represents an uploaded or pasted source file.

Fields:

- id
- project_id
- file_name
- file_type
- storage_url
- parsed_text
- parse_status
- uploaded_by
- created_at

### SourceSection

Represents extracted parts of a source document.

Fields:

- id
- source_document_id
- course_guide_id
- section_type
- title
- content
- source_page
- source_order
- confidence_score

Section types:

- purpose
- primary_focus
- learning_emphasis
- objective
- key_theme
- guiding_principle
- scenario
- reflection_question
- inclusive_practice_tip
- action_planning
- reference
- other

### CourseBlueprint

Represents the instructional architecture of a course.

Fields:

- id
- course_guide_id
- course_goal
- audience_summary
- learning_strategy
- module_structure_json
- assessment_strategy
- interaction_strategy
- seat_time_minutes
- generated_at
- approved_at

### LearningObjective

Fields:

- id
- course_guide_id
- objective_text
- bloom_level
- objective_type
- source_section_id
- assessment_alignment_status
- sort_order

Objective types:

- CLO
- SLO

### StoryboardScreen

Fields:

- id
- course_guide_id
- screen_number
- module_name
- lesson_name
- screen_title
- screen_purpose
- on_screen_text
- narration_script
- interaction_type
- visual_direction
- media_type
- assessment_prompt
- feedback_text
- performance_support_note
- accessibility_note
- sme_review_level
- source_section_ids
- status
- sort_order

SME review levels:

- low
- medium
- high
- critical

Statuses:

- draft
- ready_for_sme
- sme_changes_requested
- approved
- in_development
- built
- qa_ready
- complete

### InteractionRecommendation

Fields:

- id
- storyboard_screen_id
- interaction_type
- rationale
- complexity
- production_effort
- accessibility_risk

### AssessmentItem

Fields:

- id
- course_guide_id
- storyboard_screen_id
- question_type
- question_text
- options_json
- correct_answer
- feedback_correct
- feedback_incorrect
- bloom_level
- kirkpatrick_level
- sme_review_required

### PerformanceSupportItem

Fields:

- id
- course_guide_id
- title
- type
- description
- linked_storyboard_screen_ids
- output_format
- status

Types:

- checklist
- job_aid
- quick_reference
- decision_tree
- infographic
- downloadable_pdf

### SMEReviewItem

Fields:

- id
- course_guide_id
- storyboard_screen_id
- question
- risk_level
- assigned_to
- status
- response
- resolved_at

### QAItem

Fields:

- id
- course_guide_id
- storyboard_screen_id
- category
- issue
- severity
- recommendation
- status

Categories:

- instructional_design
- accessibility
- content_quality
- sme_approval
- assessment_alignment
- media
- handoff

### MediaTask

Fields:

- id
- course_guide_id
- storyboard_screen_id
- media_type
- title
- brief
- production_tool
- script_or_prompt
- status

Media types:

- video
- podcast
- voiceover
- illustration
- infographic
- scenario_video
- animation
- html5_interaction

### ExportPackage

Fields:

- id
- project_id
- course_guide_id
- export_type
- file_url
- generated_at
- generated_by

Export types:

- word_storyboard
- excel_tracker
- ppt_draft
- sme_review_package
- qa_checklist
- handoff_package

## AI Structured Output Requirement

All AI outputs must map to these entities. Avoid storing important product data only as raw text.
