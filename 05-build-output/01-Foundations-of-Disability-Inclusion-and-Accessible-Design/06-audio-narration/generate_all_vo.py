import requests
import json
import os
import re
import time

API_KEY = "REDACTED_API_KEY"
VOICE_ID = "FVQMzxJGPUBtfz1Azdoy"
OUTPUT_DIR = os.path.dirname(os.path.abspath(__file__))

# All 22 narration scripts (stage directions removed)
scripts = {
    "1.1": """Welcome to the Accessibility First series. This is Guide 1: Foundations of Disability Inclusion and Accessible Design.

Over the next 15 to 20 minutes, you will build the foundation for everything that follows in this 18-guide series. You will explore what disability means, examine the models that shape how we think about it, and learn a practical framework you can use starting today.

At UHN, accessibility is not a checklist or a compliance exercise. It is a commitment to making sure every person who walks through our doors — as a patient, a visitor, or a colleague — can participate fully and with dignity.

This guide is for everyone at UHN, regardless of your role. Whether you work at the bedside, at the front desk, in a lab, or in an office, accessibility is part of your practice.

Let us get started.""",

    "1.2": """By the end of this guide, you will be able to do four things.

First, you will be able to define disability using the human rights model and explain why this model matters in healthcare.

Second, you will be able to identify common barriers that people with disabilities face when accessing healthcare at UHN.

Third, you will be able to apply the Accessibility Decision Path — a five-step framework — to real workplace situations.

And fourth, you will be able to describe how the four areas of the Accessibility in Practice model connect to your daily work.

These are not abstract concepts. Each objective ties directly to something you will practise in a scenario later in this guide.""",

    "1.3a": """Here is a number worth knowing. According to Statistics Canada, more than 27 percent of Canadians aged 15 and older have at least one disability. In Ontario, that number is even higher.

That means more than one in four people who come to UHN for care may experience barriers related to disability. And many of those disabilities are non-visible — you may not know someone has a disability unless they tell you.

Take a moment with that number. One in four. That is not a small group. That is your patients, your colleagues, and your community.""",

    "1.3b": """Healthcare systems were often designed without disability in mind. Narrow doorways make it impossible for some wheelchair users to enter exam rooms. Small print on intake forms excludes people with low vision. Booking systems that require phone calls shut out people who are Deaf or hard of hearing.

These are not edge cases — they are structural barriers that affect thousands of patients at UHN every year. When these barriers exist, patients avoid or delay the care they need. Not because they do not want help, but because the system was not designed to include them.""",

    "1.3c": """Communication barriers are among the most common — and the most dangerous — in healthcare. When a clinician assumes a patient understands verbal instructions, but the patient has a cognitive or language-related disability, critical information gets lost.

Misdiagnosis can follow. Wrong assumptions about what a person can or cannot understand lead to wrong care decisions. Adapting your communication — using plain language, visual aids, or simply asking how someone prefers to receive information — can change the outcome of a visit entirely.""",

    "1.3d": """When barriers go unaddressed, patients do not just have a bad experience — they stop coming. They delay care, miss follow-ups, or abandon treatment altogether.

These barriers compound for people who face intersecting forms of marginalization. Indigenous peoples in Ontario, for example, navigate not only disability-related barriers but also systemic racism, geographic isolation, and culturally unsafe healthcare environments.

Removing barriers is not just about compliance. It is about making sure no one is excluded from the care they need and deserve.""",

    "1.4": """How we think about disability shapes how we respond to it. So let us look at three models that have influenced healthcare and society.

The first is the medical model. This model treats disability as a problem located in the individual — something to be diagnosed, treated, or cured. For decades, this was the dominant view in healthcare. Under this model, the focus is on fixing the person.

The second is the social model. This model shifts the focus from the person to the environment. It says that people are disabled not by their bodies or minds, but by barriers in society — stairs instead of ramps, information only in print, attitudes that exclude. Under this model, the focus is on fixing the barriers.

The third — and the one that guides this series — is the human rights model. This model builds on the social model but goes further. It says that people with disabilities have the right to full participation in every aspect of life. It is not enough to remove barriers. We must actively ensure inclusion, dignity, and equity.

At UHN, we use the human rights model as our foundation. This means we do not just accommodate — we include.""",

    "1.5": """Now let us look at a framework you will use throughout this entire series. It is called the Accessibility in Practice model, and it has four areas.

The first area is Awareness. This means recognizing barriers and biases — including your own unconscious assumptions about disability. Awareness is the starting point for every accessible interaction.

The second area is Communication. This means adapting how you share and receive information. It could mean offering forms in large print, using plain language, providing a sign language interpreter, or simply asking someone how they prefer to communicate.

The third area is Environment. This means shaping inclusive physical and digital spaces. Think about doorway widths, signage contrast, website navigation, and exam room layouts. The environment either enables or prevents access.

The fourth area is Response. This means acting with dignity and flexibility when someone needs something different. It is about how you react in the moment — with respect, without judgment, and with a willingness to adapt.

These four areas work together. Throughout this series, each guide will explore how awareness, communication, environment, and response apply to a specific disability context.""",

    "1.6": """When you encounter a situation involving accessibility, what do you actually do? That is where the Accessibility Decision Path comes in. This is a five-step framework you can use in any moment.

Step one is Pause. Before you act, take a breath and notice what is happening. Are you making assumptions? Is there a barrier you had not considered?

Step two is Listen. Hear the person in front of you. Ask how they would like to be supported. Do not assume you know what someone needs.

Step three is Apply. Use what you have learned — from this series, from your training, from your experience — to respond appropriately.

Step four is Adapt. If your first approach does not work, adjust. Flexibility is not a sign of failure. It is a sign of competence.

And step five is Seek Support. If you are unsure, ask for help. Contact your manager, reach out to Patient Relations, or consult with accessibility resources at UHN. You do not have to have all the answers.

These five steps — Pause, Listen, Apply, Adapt, Seek Support — will come back in every guide. They are your anchor.""",

    "1.7": """Let us put what you have learned into practice with a scenario.

Mrs. Okafor is a 68-year-old patient who has arrived at the front desk of a UHN clinic. She looks frustrated. She explains that she has been trying to use the new online booking system for three days, but she cannot navigate it. The system meets accessibility standards — it has been tested for screen reader compatibility and colour contrast. But Mrs. Okafor has limited digital literacy. The interface is confusing to her. She has come in person because she could not figure it out on her own.

Now it is your turn. You are the staff member at the front desk. Think about the Accessibility Decision Path — Pause, Listen, Apply, Adapt, Seek Support.

You will see three options on screen. Choose the one that best reflects an accessible, dignity-centred response. After you choose, you will receive feedback explaining the strengths and limitations of each option.

Take your time. There is no penalty for choosing an imperfect answer — this is about learning.""",

    "1.8": """Here is a second scenario.

You notice a patient with low vision squinting at a directional sign in the outpatient clinic. The sign was recently installed and meets Ontario Building Code standards, but the font is small and it is mounted high on the wall. The patient asks you for directions to the lab.

You are a staff member who happens to be walking through this corridor. You notice the patient looking up at the sign.

What do you do? Think about the Decision Path — Pause, Listen, Apply, Adapt, Seek Support.

Choose from the options on screen. Remember, the best response addresses both the immediate need and the systemic barrier.""",

    "1.9": """Here is one more scenario — and this one is about how teams work together.

Your team uses an accessibility checklist when supporting patients. A colleague mentions that a patient who speaks Cantonese and has a cognitive disability seemed confused during intake, even though the checklist was completed. Your colleague says, "We followed the checklist — I am not sure what else we can do."

Think about this carefully. The checklist was completed. The process was followed. But the patient was still confused. What does that tell you?

Now it is your turn. You will see three options on screen. Choose the response that best reflects the Accessibility in Practice model — awareness, communication, environment, and response.

Remember, accessibility is more than a checklist. It requires curiosity, flexibility, and a willingness to look beyond the process.""",

    "1.10": """Time for a quick knowledge check to see how the concepts are landing.

You will see a question on screen with four answer options. Select the best answer. You have two attempts. If your first answer is not correct, you will get a hint and can try again.

This is not a test — it is a chance to reinforce what you have learned about the models of disability and the Accessibility in Practice framework.

Read the question carefully and select your answer when you are ready.""",

    "1.11": """Here is one more knowledge check, this time based on a short scenario.

Read the situation described on screen. Then choose the response that best applies the Accessibility Decision Path. Think about which step of the path is most relevant — Pause, Listen, Apply, Adapt, or Seek Support.

When you are ready, select your answer. Remember, you have two attempts.""",

    "1.12": """Before we wrap up the core content, here are five inclusive practice tips you can start using today. These are small, concrete actions that make a real difference.

Tip number one: Always ask — never assume. If you are not sure how to support someone, ask them directly. A simple question like "How can I best assist you today?" respects their expertise about their own needs.

Tip number two: Make your space scan a habit. Before your next shift, look at your workspace with fresh eyes. Can someone in a wheelchair reach the counter? Is the signage readable from five feet away? Is there a clear path to the door?

Tip number three: Speak to the person, not their companion. When a patient is accompanied by a support person or interpreter, direct your conversation to the patient. Make eye contact with them. They are the expert on their own care.

Tip number four: Offer information in more than one format. If you are handing out a printed form, ask if the person would prefer large print, an electronic version, or verbal instructions.

Tip number five: Report barriers — do not just work around them. If you notice a barrier, flag it for your team lead or facilities. Working around a problem helps one person. Reporting it helps everyone who comes after.

These five tips connect directly to the Accessibility in Practice model — awareness, communication, environment, and response.""",

    "1.13": """Take a moment now to reflect.

Think about a recent interaction at work — with a patient, a colleague, or a visitor. Was there a moment where accessibility could have been handled differently? Not necessarily a failure, but an opportunity.

On screen, you will see a text box where you can write a brief reflection. You might consider questions like: What barriers have I noticed in my workspace that I had not thought about before? When was the last time I asked someone how they preferred to receive information? What is one thing I could change this week?

Your reflection is private. It is not shared with your manager or anyone else. This is for your own learning.

Take as much time as you need. When you are ready, move on to the action planning screen.""",

    "1.14": """Now it is time to create your My Action Plan — your MAP. This is a tool you will use in every guide throughout the series, and it travels with you.

Your MAP has three sections.

Stop: What is one thing you will stop doing? Maybe it is assuming you know what someone needs. Maybe it is walking past a barrier you have noticed but never reported.

Start: What is one thing you will start doing? Maybe it is asking every patient how they prefer to receive information. Maybe it is doing a workspace accessibility scan.

Continue: What is one thing you are already doing well that you want to keep doing? Maybe you already speak directly to patients rather than their companions. Maybe you already use plain language in your communications.

Fill in your MAP on screen. You can also download it as a PDF to keep at your workstation. Your MAP entries are saved to your learner profile and are private.""",

    "1.15": """Let us bring it all together. Here are the key takeaways from Guide 1.

First: Disability is best understood through the human rights model — a framework that centres full participation, dignity, and equity, not diagnosis or deficit.

Second: The Accessibility in Practice model gives you four areas to focus on — awareness, communication, environment, and response. Every guide in this series will build on these four areas.

Third: The Accessibility Decision Path — Pause, Listen, Apply, Adapt, Seek Support — is your go-to framework for any accessibility situation. When in doubt, start with Pause.

Fourth: Accessibility is not a special accommodation. It is a standard of care. It benefits everyone, and it is everyone's responsibility at UHN.

And fifth: Small actions matter. A space scan, a question asked with respect, a form offered in a different format — these are the building blocks of an inclusive healthcare environment.

You have completed Guide 1. Well done. Download the job aids linked on this screen to keep these frameworks at your fingertips.""",

    "1.16": """Before we close this guide, take some time to listen. On this screen, you will find a deep dive conversation — about 18 minutes — exploring accessibility through the eyes of a patient advisor at UHN.

The conversation centres on one question: what does dignity actually feel like when you are a patient navigating a hospital with a disability? The answer, it turns out, has nothing to do with buildings or budgets. It comes down to 30 seconds at the front desk.

Here are some moments to listen for. At the beginning, you will hear why a 50 million dollar diagnostic wing means nothing if the first human interaction fails. Around the nine-minute mark, you will hear about five words from a nurse that changed everything. And near the end, you will hear one sentence that every staff member can use on their next shift.

Captions and a full transcript are available. You can also download the audio if you would like to listen during a commute or a break.

After listening, consider this reflection: think of one patient interaction this week — which moment would have shifted if you had paused to ask, before you acted?""",

    "1.17": """Here is one more practice activity — a decision tree.

A patient is at the intake desk, visibly frustrated while trying to complete the intake form. You do not yet know the cause. It could be vision, language, digital access, cognitive load, or something else entirely. The lobby is busy and three people are waiting behind them.

This is the moment where the Accessibility Decision Path matters most. What is your first move — before assuming anything about the barrier?

You will see three options on screen. One is recommended. Each opens a brief consequence panel showing what happens next — for the patient, for the chart, and for the team. After you see the consequence, the activity loops back to the Decision Path to show which step you were practising.

Choose the option that best reflects "Pause and Assess" — the first step of the path. Take your time.""",

    "1.18": """You have completed Guide 1 — and with it, you have unlocked the rest of the Accessibility First series.

On this screen, you can see the full 18-guide journey mapped across three stages.

Stage 1 is Foundations — that is Guides 1 through 4. You have just completed the first guide. The remaining three Foundation guides cover perceptions and attitudes, vision disabilities, and hearing and communication.

Stage 2 is Understanding Disability Experiences — Guides 5 through 9. These guides explore physical disabilities, mental health, intellectual and developmental disabilities, non-visible disabilities, and aging and intersectionality.

Stage 3 is Applied Practice — Guides 10 through 18. These guides focus on specific skills and specialized contexts, from service animals and assistive devices to trauma-informed care and crisis de-escalation.

Guides unlock by stage. Completing all four Foundation guides opens Stage 2. You are on your way.""",

    "1.19": """Congratulations — you have completed Guide 1: Foundations of Disability Inclusion and Accessible Design.

This guide is the foundation for the entire Accessibility First series. The concepts you explored today — the human rights model, the Accessibility in Practice model, and the Accessibility Decision Path — will appear in every guide that follows.

On this screen, you will find a list of resources that support the content in this guide. These include links to UHN accessibility policies, the Accessibility for Ontarians with Disabilities Act — also known as the AODA — and key research articles. You do not need to review all of these now, but they are here if you want to go deeper on any topic.

If you have questions about accessibility at UHN, reach out to Patient Relations, the IDEAA Office, or your unit's accessibility lead.

On screen, you can see the series progress map. Guide 1 is now complete. Guide 2 — Perceptions, Attitudes, and Barriers — is unlocked and ready whenever you are.

Thank you for investing your time in building a more accessible UHN. Every step you take matters.

See you in Guide 2."""
}

url_base = "https://api.elevenlabs.io/v1/text-to-speech/"
headers = {
    "xi-api-key": API_KEY,
    "Content-Type": "application/json"
}

for screen_id, text in scripts.items():
    filename = f"voiceover_{screen_id}.mp3"
    filepath = os.path.join(OUTPUT_DIR, filename)
    
    # Skip if already exists (except the test file)
    if os.path.exists(filepath) and os.path.getsize(filepath) > 1000:
        print(f"SKIP {filename} (already exists)")
        continue
    
    print(f"Generating {filename}...", flush=True)
    
    payload = {
        "text": text,
        "model_id": "eleven_multilingual_v2",
        "voice_settings": {
            "stability": 0.5,
            "similarity_boost": 0.75,
            "style": 0.3
        }
    }
    
    resp = requests.post(
        url_base + VOICE_ID,
        headers=headers,
        json=payload,
        timeout=120
    )
    
    if resp.status_code == 200:
        with open(filepath, "wb") as f:
            f.write(resp.content)
        size_kb = len(resp.content) / 1024
        print(f"  OK — {size_kb:.0f} KB")
    else:
        print(f"  ERROR {resp.status_code}: {resp.text[:200]}")
    
    # Small delay to avoid rate limiting
    time.sleep(1)

print("\nDone! All voiceovers generated.")
