# 02 Automated Workflow

## Current Manual Workflow

The normal comprehensive eLearning development workflow includes:

1. Receive course development request.
2. Conduct needs analysis and learner analysis when possible.
3. Select an instructional design model.
4. Meet with SMEs to confirm scope, guidelines, milestones, and requirements.
5. Review SME materials and convert them into a workable storyboard format.
6. Write course learning objectives and sub-learning outcomes.
7. Design first storyboard draft and course structure.
8. Propose presentation and implementation strategies.
9. Design scaffolding tools, scenarios, decision branches, assessments, and performance support tools.
10. Map activities and evaluation methods to Kirkpatrick Levels 1-4.
11. Submit storyboard to SMEs for review.
12. Collaborate with SMEs to finalize storyboard.
13. Develop multimedia assets and course materials.
14. Design consistent UI/UX and branding.
15. Build modules/lessons.
16. Review modules in parallel.
17. Test in LMS or end-user environment.
18. Complete handoff package.

## Proposed Automated Workflow

```txt
Course Request
  ↓
AI Intake + Lightweight Analysis
  ↓
ID Model Recommendation
  ↓
SME Kickoff Pack
  ↓
Source Material Structuring
  ↓
Course / Guide Splitting
  ↓
Learning Objective Architecture
  ↓
Course Blueprint Generation
  ↓
Storyboard Factory
  ↓
Interaction + Assessment + Performance Support Recommendations
  ↓
SME Review Package
  ↓
Revision and Approval Tracking
  ↓
Media Production Planning
  ↓
Course Build Tasks
  ↓
Accessibility + ID QA
  ↓
LMS Testing Checklist
  ↓
Final Handoff Package
  ↓
Maintenance Schedule
```

## Automation Boundaries

### Automate

- project intake draft
- lightweight analysis summary
- source material extraction
- content chunking
- objective drafting
- storyboard drafting
- scenario drafting
- assessment drafting
- SME question drafting
- media task planning
- QA checklist generation
- export package generation
- status tracking

### Keep Human-Controlled

- final clinical accuracy
- legal/compliance interpretation
- policy interpretation
- Indigenous/cultural safety review
- final SME approval
- final UX judgment
- final LMS publish decision

## Healthcare-Specific Workflow Note

In healthcare settings, formal analysis may be skipped because the course request itself is urgent or mandated. The system should still create a lightweight analysis record so the project has documented rationale, audience, risk level, and success criteria.

## Recommended ID Model Logic

| Project Type | Recommended Model |
|---|---|
| Large compliance series | ADDIE + Agile sprint production |
| Rapid microlearning | SAM |
| High-risk clinical training | ADDIE with SME validation gates |
| Scenario-heavy behavioural course | Dick and Carey + scenario-based design |
| Course conversion | Agile + template-based production |

For the first accessibility course series pilot, use **ADDIE + Agile sprint production**.

## Parallel Production Model

For one ID or a small team, the ideal flow is:

| Track | Status |
|---|---|
| Course A | Development |
| Course B | SME Review |
| Course C | LMS Testing |
| Course D | AI Blueprint / Storyboard Draft |

This keeps work moving while avoiding idle time during reviews.
