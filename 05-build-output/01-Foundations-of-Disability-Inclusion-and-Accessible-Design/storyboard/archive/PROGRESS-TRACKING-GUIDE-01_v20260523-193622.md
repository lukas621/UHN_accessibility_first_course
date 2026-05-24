# Progress Tracking — Guide 01: Foundations of Disability, Inclusion, and Accessible Design

**Accessibility First Course Series | University Health Network**

---

## Completion Model

This course uses a **completion-based model** — no scoring, no pass/fail, no leaderboard. The goal is learning and reflection, not performance measurement.

---

## Completion Criteria

A learner receives a **Complete** status in the LMS when ALL of the following are met:

| Requirement | Description | Storyline Variable |
|---|---|---|
| All required screens visited | Learner has viewed every screen in the course at least once | `g01_allScreensVisited` (boolean) |
| Knowledge Check 1 attempted | Learner has submitted answers (no minimum score required) | `g01_kc1_attempted` (boolean) |
| Knowledge Check 2 attempted | Learner has submitted answers (no minimum score required) | `g01_kc2_attempted` (boolean) |
| At least 1 scenario completed | Learner has made a choice in at least one branching scenario | `g01_scenarioCompleted` (boolean) |
| MAP activity completed | Learner has entered text in at least one MAP field (stop/start/continue) | `g01_mapCompleted` (boolean) |

**Note:** Knowledge checks are formative — they provide feedback but do not gate progression. Learners can proceed regardless of answers.

---

## Progress Indicators

### Visual Progress Bar

- Display a progress bar in the Storyline player or as a custom element
- Calculate as: `(screens visited / total required screens) × 100`
- Update after each screen transition

### Module Checkmarks

Show completion status per module in the course menu:

| Module | Screens | Checkmark When |
|---|---|---|
| Module 1: Welcome & Orientation | 1.1–1.3 | All 3 screens visited |
| Module 2: Understanding Disability | 2.1–2.4 | All 4 screens visited + KC1 attempted |
| Module 3: Legislative Foundations | 3.1–3.4 | All 4 screens visited + KC2 attempted |
| Module 4: Intersectionality | 4.1–4.3 | All 3 screens visited |
| Module 5: Proactive Design | 5.1–5.4 | All 4 screens visited + scenario completed |
| Module 6: Shared Responsibility | 6.1–6.6 | All 6 screens visited + MAP completed |

### Completion Screen

When all criteria are met, display:
- "You have completed Guide 01: Foundations of Disability, Inclusion, and Accessible Design"
- Summary of key takeaways (3-4 bullet points)
- Link to download MAP template (if not already downloaded)
- Link to download job aids
- "Next in the series: Guide 02 — Perceptions, Attitudes, and Barriers"
- SCORM completion status sent to LMS

---

## Storyline Implementation

### Variables to Create

```
g01_screen01_visited    (boolean, default false)
g01_screen02_visited    (boolean, default false)
...
g01_screen16_visited    (boolean, default false)
g01_kc1_attempted       (boolean, default false)
g01_kc2_attempted       (boolean, default false)
g01_scenarioCompleted   (boolean, default false)
g01_mapCompleted        (boolean, default false)
g01_allScreensVisited   (boolean, default false)
g01_courseComplete       (boolean, default false)
g01_progressPercent     (number, default 0)
```

### Triggers

1. On each screen timeline start: set `g01_screenXX_visited = true`
2. On KC1 submit: set `g01_kc1_attempted = true`
3. On KC2 submit: set `g01_kc2_attempted = true`
4. On any scenario choice click: set `g01_scenarioCompleted = true`
5. On MAP text entry change: set `g01_mapCompleted = true`
6. On each screen visit: recalculate `g01_progressPercent`
7. When all criteria met: set `g01_courseComplete = true` and send SCORM completion

### SCORM Reporting

- **Completion status:** Complete / Incomplete
- **Success status:** Not tracked (no pass/fail)
- **Score:** Not tracked (no scoring)
- **Suspend data:** Save progress for resume-and-continue

---

## Navigation Rules

| Rule | Setting |
|---|---|
| Linear or free navigation | **Free** — learner can navigate in any order via menu |
| Revisiting screens | Allowed — reset to initial state |
| Seekbar | Enabled on content slides, disabled on quiz slides |
| Menu | Visible at all times with module/lesson structure |
| Next/Previous buttons | Enabled |
| Auto-advance | Disabled — learner controls pace |

---

## Resume and Continue

- Storyline saves suspend data via SCORM
- If learner exits mid-course, they return to last visited screen
- Progress bar and checkmarks persist across sessions
- LMS shows "In Progress" until all completion criteria are met

---

## Series-Level Tracking (Future)

For tracking across all 18 guides:

| Element | Description |
|---|---|
| Series progress | Show completion status for each of the 18 guides on a dashboard |
| Series completion | All 18 guides completed = series certificate |
| Certificate | Auto-generate upon series completion (Storyline or LMS-managed) |
| MAP portfolio | Learners accumulate 18 MAP responses across the series |

**Note:** Series-level tracking is managed at the LMS level, not within individual Storyline courses.

---

*Document version: 1.0 Draft | Created: 2026-05-23 | Instructional Designer: Yijin*
