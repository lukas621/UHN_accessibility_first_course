# Prompt: NotebookLM Podcast Source Generator

You are creating a source document optimized for Google NotebookLM to generate a podcast-style audio overview of a healthcare accessibility training course at University Health Network (UHN) in Toronto, Ontario, Canada.

NotebookLM works best when given a well-structured, conversational document that reads like a feature article or long-form essay. It will turn this into a two-host podcast discussion.

## Context

- Course series: Accessibility First (17 guides)
- Purpose: Supplementary audio content — learners can listen to a podcast-style overview before, during, or after completing the Storyline course
- Audience: UHN employees who may prefer audio learning or want a refresher
- Tone: Engaging, thoughtful, conversational — like a healthcare podcast, not a lecture
- Length target: Document should produce a 10-15 minute podcast

## NotebookLM Optimization Rules

1. **Write as a narrative, not a list** — NotebookLM produces better podcasts from flowing prose than from bullet points
2. **Include stories and examples** — the scenarios from the course should be retold as compelling stories
3. **Include surprising facts or statistics** — these become natural discussion points
4. **Ask questions in the text** — NotebookLM picks these up as discussion prompts
5. **Use conversational language** — write as if explaining to an interested colleague
6. **Include "Did you know..." and "Here's what's interesting..." phrasings** — triggers engaging podcast dialogue
7. **Front-load the hook** — the opening paragraph determines whether the podcast starts strong
8. **Include multiple perspectives** — mention different viewpoints for the hosts to discuss
9. **End with a call to action** — what should the listener do next?

## Input

{{guide_title}}
{{guide_number}}
{{source_content}} — extracted content from the 400-page source document for this guide
{{core_objectives}} — the CLOs for this guide
{{scenarios}} — the scenario content

## Output Structure

Write a single Markdown document with these sections (but written as flowing narrative, not obviously sectioned):

### 1. Opening Hook (1-2 paragraphs)
- Start with a compelling question, statistic, or real-world situation
- Introduce the topic and why it matters in healthcare
- Canadian/Ontario/UHN context

### 2. Core Concepts (3-5 paragraphs)
- Explain the main ideas from this guide in conversational language
- Use analogies and everyday examples
- Include relevant Canadian statistics or legislation (AODA, OHRC)
- Weave in the guiding principles naturally

### 3. Stories and Scenarios (3-4 paragraphs)
- Retell each scenario from the course as a short narrative story
- Give characters names and settings (UHN-specific where possible)
- Build tension — describe the dilemma, then discuss what the better approach would be
- Connect each story back to a guiding principle

### 4. The Framework in Practice (2-3 paragraphs)
- Explain the Accessibility Decision Path as a practical tool
- Walk through a real-world application
- Explain the Accessibility in Practice model (4 quadrants)

### 5. What Surprised Us (1-2 paragraphs)
- Include counterintuitive findings, common misconceptions, or "aha moments"
- These become the most engaging parts of the podcast

### 6. Discussion Questions (as embedded questions in the text)
- 4-6 open-ended questions woven naturally into the narrative
- "What would you do if...?"
- "Have you ever noticed...?"
- "Why do you think...?"

### 7. Closing and Call to Action (1 paragraph)
- Summarize the key takeaway
- Point to the MAP action planning activity
- Encourage the listener to complete the full course

## Quality Rules

1. Canadian English spelling and terminology throughout
2. Reference AODA, OHRC, and Canadian context — not ADA or American references
3. Include at least 2 Canadian/Ontario statistics or data points
4. Use UHN-specific examples where possible (Toronto General, Princess Margaret, etc.)
5. All facts must be accurate and citable — include APA 7 references at the end
6. Do not include sensitive patient information or real case details
7. Maintain respectful, person-centred language throughout
8. For Guide 18 (Indigenous Peoples): approach with particular care, reference Truth and Reconciliation Calls to Action 18-24

## File Output

Save as: `PODCAST-SOURCE-GUIDE-{{guide_number}}.md`
Location: `05-build-output/{{guide_folder}}/08-notebooklm-podcast/`

The document should be 2,000-3,000 words to produce a 10-15 minute NotebookLM podcast.
