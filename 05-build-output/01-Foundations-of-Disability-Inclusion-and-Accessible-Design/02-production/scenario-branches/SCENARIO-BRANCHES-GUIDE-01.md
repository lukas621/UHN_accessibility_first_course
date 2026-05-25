# Scenario Branches -- Guide 01: Foundations of Disability, Inclusion, and Accessible Design

**Course:** UHN Accessibility First Course Series
**Guide:** 01 -- Foundations of Disability, Inclusion, and Accessible Design
**Version:** 1.0
**Date:** 2026-05-23
**Total Scenarios:** 3

---

## Scenario 1: Policy vs. Practice -- The Online Booking System

### Source Context

A UHN hospital introduces a new online appointment booking system. The platform was certified as WCAG 2.1 AA compliant by the vendor. However, patients with limited digital literacy -- including older adults, people with cognitive disabilities, and newcomers with limited English proficiency -- are unable to complete the booking process independently. The phone booking line has been reduced to limited hours to encourage online adoption.

### Setup Text

> **Read aloud or display to learner:**
>
> Toronto General Hospital has launched "BookMyVisit," a new online appointment booking platform. The vendor's accessibility audit confirmed WCAG 2.1 AA compliance, and the project team celebrated the successful rollout. However, within three weeks, the Patient Relations office receives 14 complaints from patients who cannot complete the booking process. Among them:
>
> - A 78-year-old patient with mild cognitive impairment who finds the multi-step process overwhelming and abandons it after step 3 of 7.
> - A patient with low vision who reports that while the screen reader reads the page, the booking flow is confusing because form labels and error messages are unclear.
> - A newcomer from Eritrea who has limited English and no reliable internet access at home.
>
> The phone booking line, previously available Monday to Friday from 8 a.m. to 6 p.m., has been reduced to 10 a.m. to 2 p.m. to encourage online adoption.
>
> You are the clinic operations lead. The director asks you to recommend a path forward.

### Decision Point

**What do you recommend?**

---

#### Choice A: Expand the phone line hours and add a "request a callback" feature on the website (Best Practice)

**Consequence:** The clinic restores full phone line hours and adds a simple one-click "request a callback" button on the BookMyVisit landing page. Patients who cannot navigate the online system can request a call and have their appointment booked by a staff member. Patient complaints drop by 80% in four weeks. The callback data also reveals patterns in who is struggling with the platform, informing the next round of usability improvements.

**Debrief:** This choice reflects proactive inclusive design thinking. Rather than treating the online system as the single pathway, it creates a parallel channel that preserves patient autonomy and dignity. It also generates data for continuous improvement -- a hallmark of the Decision Path approach. Technical compliance alone does not equal usability; equitable access requires multiple pathways tailored to diverse needs (AODA, O. Reg. 191/11; OHRC, s. 1, 11).

**Connection to Guiding Principles:** Proactive over reactive; shared organizational responsibility; accessibility as a continuum, not a checkbox.

---

#### Choice B: Create a PDF instruction guide with screenshots and distribute it in clinic waiting areas (Acceptable)

**Consequence:** The guide helps some patients, particularly those with mild difficulty navigating the interface. However, it does not assist patients who lack internet access, those with low vision who cannot read the PDF, or those who cannot read English. Patient complaints decrease by 30%, but the Patient Relations office continues to receive calls from the same patient populations. The underlying access gap persists.

**Debrief:** This choice shows good intentions but remains reactive -- it attempts to help patients adapt to the system rather than adapting the system to patients. A printed guide in one language and format does not address the diversity of barriers. This approach addresses a symptom (confusion) rather than the root cause (a single-pathway system that excludes multiple populations).

**Connection to Guiding Principles:** This approach partially addresses communication barriers but does not shift the system toward proactive design. It places the burden of adaptation on the patient rather than the organization.

---

#### Choice C: Inform patients that the system is WCAG-compliant and direct them to the vendor's help desk for technical support (Poor Practice)

**Consequence:** Patients are directed to a vendor help desk with English-only support and long wait times. Complaints escalate. Two patients miss appointments because they could not book online and the phone line was unavailable. One patient files a complaint with the Ontario Human Rights Tribunal, citing discrimination on the basis of disability and age. The clinic's Patient Experience scores decline, and senior leadership requests an urgent review.

**Debrief:** Technical compliance certification does not absolve the organization of its duty to provide equitable access. Under the OHRC, UHN has a duty to accommodate to the point of undue hardship -- redirecting patients to a third-party vendor does not meet this standard. This choice reflects the medical model assumption that the "problem" lies with the patient's inability to use the technology, rather than recognizing that the system design creates the barrier.

**Connection to Guiding Principles:** This violates the principle of shared organizational responsibility and demonstrates the gap between compliance and genuine accessibility. It reflects a reactive, complaint-driven approach rather than a proactive, patient-centred one.

---

### SME Review Level

**Critical.** This scenario involves interpretation of AODA compliance, OHRC duty to accommodate, and patient safety implications (missed appointments). Requires review by: legal/policy SME, patient experience lead, and digital accessibility specialist.

### Image Generation Prompt

**For NanoBanana / Midjourney / GPT Image 2:**

> Illustration in a warm, inclusive healthcare style. A hospital lobby with a digital check-in kiosk in the foreground. An older adult patient stands in front of the kiosk looking uncertain, with a gentle expression -- not distressed, but thoughtful. Beside the kiosk, a friendly staff member is approaching with a welcoming gesture. In the background, a sign shows both a phone icon and a computer icon, suggesting multiple booking options. Soft lighting, diverse patients visible in the background, UHN-inspired colour palette (blues, teals, whites). No text on screen. Accessible, modern Canadian hospital interior. Flat illustration style, clean lines, inclusive representation.

---

## Scenario 2: Physical Environment -- The Signage That Meets Standards on Paper

### Source Context

A UHN outpatient clinic installs new wayfinding signage that meets Ontario Building Code dimensional requirements. However, the signs are mounted at standard height (above most sightlines), use a decorative serif font for aesthetics, and lack tactile or high-contrast elements. Patients with low vision, wheelchair users, and people with cognitive disabilities report difficulty navigating the clinic.

### Setup Text

> **Read aloud or display to learner:**
>
> The facilities team at Princess Margaret Cancer Centre has completed a signage upgrade across three floors. The new signs are attractive, use the hospital's updated brand colours, and meet the dimensional requirements specified in the Ontario Building Code. The project came in under budget, and the facilities manager is pleased with the result.
>
> Within two months, the following feedback emerges:
>
> - A patient using a wheelchair reports that ceiling-mounted signs are outside her sightline and she cannot find the chemotherapy suite without asking for directions each visit.
> - A patient with low vision says the sage green text on a white background is nearly invisible to him and the serif font is difficult to decode.
> - A volunteer notes that several patients with cognitive disabilities or high anxiety become disoriented at corridor junctions where signs list eight destinations in small type with no pictograms or colour-coding.
>
> You are the patient experience coordinator. The facilities manager says, "The signs meet code. We cannot redo them -- they were just installed."

### Decision Point

**How do you respond?**

---

#### Choice A: Propose a phased improvement plan that adds tactile elements, pictograms, colour-coded pathways, and lower-mounted supplementary signs at key decision points (Best Practice)

**Consequence:** You present a costed, phased plan to senior leadership. Phase 1 (immediate, low cost) adds colour-coded floor lines and large-print pictogram signs at eye level at the five major decision points. Phase 2 (next fiscal quarter) adds tactile signs with Braille at elevator lobbies and department entrances. Phase 3 (annual capital plan) replaces decorative fonts with a high-contrast sans-serif typeface on all permanent signs. Patient wayfinding complaints drop by 60% after Phase 1 alone. The approach is adopted as a model for other UHN sites.

**Debrief:** This choice demonstrates proactive inclusive design within real-world constraints. It acknowledges that meeting minimum code does not guarantee usability and proposes a practical, phased approach that balances budget realities with patient needs. The use of pictograms and colour-coding reflects universal design principles that benefit all patients -- not just those with identified disabilities. This aligns with CSA B651-23 (Accessible Design for the Built Environment) recommendations that go beyond minimum code (CSA Group, 2023).

**Connection to Guiding Principles:** Proactive design; accessibility as a continuum; evidence-informed improvement through patient feedback; universal design benefits everyone.

---

#### Choice B: Request that volunteers be stationed at key junctions during peak hours to provide wayfinding assistance (Acceptable)

**Consequence:** Volunteers help patients navigate during weekday mornings, and wayfinding complaints decrease during those hours. However, patients arriving during evenings, weekends, or off-peak times continue to struggle. The approach is staff-dependent and not sustainable during volunteer shortages. Patients report appreciating the human help but express frustration at needing to ask for assistance for a basic navigation task.

**Debrief:** Human assistance is a valuable complement to good design but should not be a substitute for it. This approach creates dependency on volunteer availability and does not address the underlying environmental barrier. It also places the burden on the patient to seek help, which can feel stigmatizing -- particularly for patients who visit frequently and value independence. The social model of disability reminds us that the environment, not the individual, should be the focus of change (Oliver, 1990).

**Connection to Guiding Principles:** Reactive accommodation rather than proactive design; does not embed accessibility into the environment itself; creates an unsustainable dependency.

---

#### Choice C: Inform the patients that the signs meet the Ontario Building Code and suggest they arrive early to allow extra time for wayfinding (Poor Practice)

**Consequence:** Patients feel dismissed. One patient writes a detailed complaint to the UHN Patient Ombudsman describing how the signage forces her to depend on strangers for navigation at every visit, undermining her dignity and independence. The complaint is escalated to the VP of Patient Experience. The facilities team is asked to develop a remediation plan under time pressure and higher scrutiny -- a more costly and stressful process than the proactive approach would have been.

**Debrief:** Meeting minimum building code requirements is necessary but not sufficient. The OHRC establishes that organizations must not create barriers that disproportionately affect people with disabilities, even unintentionally (OHRC, s. 11 -- constructive discrimination). Telling patients to compensate for poor design by changing their behaviour places the burden of accessibility on the individual and reflects a medical model mindset. This approach also damages trust between the organization and the patients it serves.

**Connection to Guiding Principles:** Violates proactive design and shared responsibility principles; reflects compliance-as-ceiling rather than compliance-as-floor thinking; medical model framing.

---

### SME Review Level

**High.** This scenario involves interpretation of Ontario Building Code vs. CSA B651-23 standards and patient experience implications. Requires review by: facilities/built environment SME, occupational therapist with accessibility expertise, and patient experience lead.

### Image Generation Prompt

**For NanoBanana / Midjourney / GPT Image 2:**

> Illustration in a warm, inclusive healthcare style. A hospital corridor junction with multiple hallways branching off. In the centre, a patient in a wheelchair is looking up at a ceiling-mounted sign that is too high and has small, low-contrast text. Beside her, a second version of the same junction is shown with improved signage: large pictograms at eye level, colour-coded floor lines, high-contrast sans-serif text, and a tactile map on the wall. Split-screen or before/after composition. Soft, welcoming lighting. Diverse patients in background. UHN-inspired colour palette. Flat illustration style, clean lines, no real text on signs -- use abstract shapes to suggest text.

---

## Scenario 3: Employee Awareness -- The Checklist That Misses the Person

### Source Context

A UHN clinical unit implements an accessibility checklist for staff to follow when admitting patients. The checklist covers physical accommodations (wheelchair access, adjustable bed height, call bell placement) but does not address communication preferences, cultural considerations, cognitive accessibility, or language needs. Staff follow the checklist diligently but gaps persist.

### Setup Text

> **Read aloud or display to learner:**
>
> The inpatient medicine unit at Toronto Western Hospital introduced an "Accessibility Admission Checklist" six months ago. The checklist includes 10 items: wheelchair accessibility of the room, adjustable bed height, call bell within reach, bathroom grab bars, adequate lighting, clear pathway to the door, hearing loop availability, large-print medication labels, allergy band placement, and fall risk signage.
>
> Staff have been following the checklist consistently, and compliance audits show 95% completion rates. However, patient feedback tells a different story:
>
> - A Deaf patient who communicates in American Sign Language (ASL) reports that no one asked about her communication preferences during admission. Staff wrote notes on paper, but she found the handwriting illegible and the medical terminology confusing.
> - An Indigenous patient from a northern Ontario community feels that the admission process did not acknowledge his cultural practices or allow him to have a family member present during clinical discussions, as is important in his tradition.
> - A patient with an acquired brain injury finds the discharge instructions overwhelming. They are provided in a single dense paragraph with medical jargon, and no one checks whether she understands them.
>
> You are the unit educator responsible for updating the checklist and associated training.

### Decision Point

**What changes do you recommend?**

---

#### Choice A: Redesign the checklist to include communication, cultural, cognitive, and language dimensions, and pair it with a brief conversational script that staff use to ask patients about their preferences and needs during admission (Best Practice)

**Consequence:** You work with the Patient Experience team, Indigenous Health services, and Speech-Language Pathology to expand the checklist into an "Inclusive Admission Guide" with four domains: Physical Environment, Communication and Language, Cultural and Spiritual Needs, and Cognitive Accessibility. Each domain includes 2-3 open-ended prompts (e.g., "How would you prefer us to communicate important information to you?"). Staff receive a 30-minute training module on using the guide. Within three months, patient satisfaction scores on the unit improve, and the guide is piloted on two additional units. The ASL-using patient's follow-up visit includes a pre-arranged interpreter.

**Debrief:** This choice reflects an intersectional, proactive approach to inclusive design. It recognizes that accessibility extends beyond the physical environment and that patients' needs are shaped by the intersection of disability, language, culture, cognitive capacity, and other factors. The conversational script moves staff from a task-completion mindset ("check the box") to a relational, person-centred approach. This aligns with the OHRC's emphasis on substantive equality and with UHN's commitment to culturally safe care, including the Truth and Reconciliation Commission's Calls to Action related to Indigenous health (TRC, 2015, Calls 18-24).

**Connection to Guiding Principles:** Proactive inclusive design; intersectionality as a lens for practice; shared responsibility across disciplines; accessibility as multidimensional (not only physical).

---

#### Choice B: Add three new items to the existing checklist -- communication preference, language needs, and cognitive support -- and email the updated version to staff (Acceptable)

**Consequence:** The updated checklist is distributed. Some staff adopt the new items; others skip them because they are unfamiliar with what to do if a patient indicates a need (e.g., "How do I request an ASL interpreter at 2 a.m.?"). Compliance with the new items is inconsistent -- approximately 40% completion after one month. The physical items remain at 95%. The gap between checklist completion and patient experience persists for patients whose needs fall outside the physical domain.

**Debrief:** Adding items to a checklist without training, resources, and workflow redesign is a common approach but often insufficient. Staff need not only awareness of what to ask but also knowledge of how to act on the answers. This approach treats the checklist as the solution rather than as a tool that supports a broader practice change. It is a step in the right direction but remains more reactive than proactive because it does not address the underlying training gap or embed cultural safety and cognitive accessibility into the unit's culture.

**Connection to Guiding Principles:** Incremental improvement without systemic change; checklist as tool vs. checklist as culture; gap between policy and practice.

---

#### Choice C: Keep the current checklist as-is and address communication and cultural needs on a case-by-case basis when patients or families raise concerns (Poor Practice)

**Consequence:** The unit continues to achieve high compliance scores on the physical checklist, which leadership interprets as evidence of strong accessibility performance. However, Patient Relations continues to receive complaints about communication breakdowns, culturally unsafe interactions, and discharge confusion. An Indigenous patient's family files a formal complaint about the lack of cultural consideration during a palliative care admission. The incident is reviewed by UHN's Indigenous Health program, which identifies a systemic gap. The unit is required to undertake a comprehensive review -- a process that is more disruptive and resource-intensive than a proactive redesign would have been.

**Debrief:** This choice reflects a reactive, complaint-driven approach that equates physical accessibility with comprehensive accessibility. It assumes that patients and families will self-advocate for accommodations -- an assumption that places the burden on those who are already navigating a stressful healthcare encounter and who may face additional barriers related to language, power dynamics, or past negative experiences with institutions. The OHRC and the TRC's Calls to Action both emphasize the proactive responsibility of institutions to create inclusive environments without requiring individuals to disclose needs or file complaints.

**Connection to Guiding Principles:** Reactive, complaint-driven model; medical model framing (patient must identify and request what they need); failure of shared organizational responsibility; compliance metrics that mask real-world gaps.

---

### SME Review Level

**Critical.** This scenario involves Indigenous cultural safety and health equity content. Requires review by: Indigenous Health SME or Elder, cultural safety educator, Deaf community advisor or ASL interpreter coordinator, and speech-language pathologist (cognitive-communication expertise).

### Image Generation Prompt

**For NanoBanana / Midjourney / GPT Image 2:**

> Illustration in a warm, inclusive healthcare style. A hospital room admission scene. A healthcare worker sits beside a patient's bed holding a clipboard, but instead of looking at the checklist, they are making eye contact with the patient and having a conversation. The patient, an Indigenous man, has a family member sitting nearby who is included in the discussion. On the bedside table, materials in multiple formats are visible -- a tablet, a printed sheet with pictograms, and a card with a phone number. The mood is warm and respectful, not clinical or rushed. Soft lighting, earth tones mixed with UHN-inspired teals and blues. Flat illustration style, clean lines, inclusive representation. No real text visible on documents -- use abstract shapes to suggest text.

---

## Scenario Design Notes

### Alignment to CLOs

| Scenario | Primary CLO(s) | Secondary CLO(s) |
|----------|----------------|-------------------|
| 1. Policy vs. Practice | CLO 4 (reactive vs. proactive) | CLO 1 (digital, communication barriers), CLO 2 (AODA, OHRC) |
| 2. Physical Environment | CLO 1 (physical, communication barriers), CLO 4 | CLO 2 (code vs. standard), CLO 5 (shared responsibility) |
| 3. Employee Awareness | CLO 3 (intersectionality), CLO 5 (shared responsibility) | CLO 1 (multidimensional barriers), CLO 4 (reactive vs. proactive) |

### Design Principles

- Each scenario is grounded in a realistic UHN/Toronto healthcare context.
- Choices are designed to be plausible -- the "poor" choice is one that real teams might select under time or budget pressure, not an obviously wrong option.
- Debriefs connect to specific guiding principles and legislative/policy frameworks without being preachy.
- Image prompts avoid depicting people with disabilities in a pitying or helpless manner; the focus is on environments and interactions.

---

*End of Scenario Branches -- Guide 01*
