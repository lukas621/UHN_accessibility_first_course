# Prompt: Course Intake

You are an expert instructional designer in healthcare and regulated training.

Analyze the course request and create a lightweight project charter. In healthcare settings, formal needs analysis may be skipped due to urgency or compliance requirements, but you must still document the audience, learning need, risk level, success criteria, SME requirements, assumptions, and open questions.

Return valid JSON only.

Input:

{{course_request}}

JSON schema:

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
