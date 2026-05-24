#!/usr/bin/env python3
"""Generate all 13 images for Guide 01 using OpenAI GPT Image (DALL-E 3)."""

import os
import sys
import json
import time
import requests
from pathlib import Path

# Load API key
env_path = Path(__file__).resolve().parents[4] / ".env"
api_key = None
with open(env_path) as f:
    for line in f:
        line = line.strip()
        if line.startswith("OPENAI_API_KEY=") and not line.endswith("="):
            api_key = line.split("=", 1)[1]
            break

if not api_key:
    print("ERROR: OPENAI_API_KEY not found in .env")
    sys.exit(1)

OUTPUT_DIR = Path(__file__).resolve().parent / "generated"
OUTPUT_DIR.mkdir(exist_ok=True)

HEADERS = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json",
}

# Style anchors
PHOTO_ANCHOR = "Shot on a Canon EOS R5, 35mm lens, f/2.8. Warm colour grading — slight golden undertone, desaturated shadows, lifted blacks. Modern Canadian healthcare photography. Candid, documentary feel. 16:9 aspect ratio."
INFOGRAPHIC_ANCHOR = "Flat vector infographic style. Colour palette: Navy #192858, Cobalt #245BAA, Lilac #C48ABD, Chartreuse #74AE54, Red #C0233B, White, Light grey #F5F5F5. 2-3px stroke weight, rounded caps. Clean, minimal. No 3D, no gradients, no photorealistic textures. 16:9 aspect ratio."

IMAGES = [
    {
        "filename": "g01-hero-welcome-diverse-staff-01.png",
        "prompt": f"""A wide-angle photograph of the entrance of a modern Canadian hospital. The entrance features automatic glass sliding doors, an accessible ramp with steel handrails, and tactile ground indicators. Five diverse healthcare workers walk toward the entrance in a natural candid composition: a South Asian woman in her mid-30s using a power wheelchair wearing navy scrubs, a Black Canadian man in his late 40s carrying a white cane in a lab coat, a woman in her early 30s wearing a hijab and teal scrubs with a stethoscope, an East Asian young man in his mid-20s with a visible behind-the-ear hearing aid in navy scrubs, and a white woman in her late 50s with grey hair holding a tablet. Spring morning in Toronto, warm golden light, cherry blossoms visible. {PHOTO_ANCHOR} No pity framing. No one looking down at wheelchair user. No American aesthetics.""",
    },
    {
        "filename": "g01-understanding-disability-barriers-01.png",
        "prompt": f"""A medium shot inside a modern Canadian hospital corridor. A young Indigenous woman (Anishinaabe features) in her early 20s navigates the hallway in a manual wheelchair, wearing casual clothes (not a hospital gown). She looks determined, gazing at overhead wayfinding signage with small text and poor contrast. Beside her, a white hospital volunteer in his mid-60s wearing a blue volunteer vest gestures toward a distant reception desk. The corridor shows barriers: a supply cart creating a narrow passage, a sign mounted at standing-eye-level, a hand sanitizer dispenser too high. {PHOTO_ANCHOR} No inspiration porn. She looks determined, not helpless. No exaggerated emotions.""",
    },
    {
        "filename": "g01-infographic-models-of-disability-01.png",
        "prompt": f"""A clean horizontal infographic with three equal panels comparing disability models on white background. LEFT: "Medical Model" on cool grey background, clipboard icon with magnifying glass pointing at a person silhouette, label area "Focus on the individual." CENTRE: "Social Model" on cobalt blue (#245BAA), icons of stairs, narrow doorway, and small-text sign with arrows pointing at barriers, label "Focus on the barriers." RIGHT: "Human Rights Model" on navy (#192858) with gold accent, person surrounded by participation symbols (ballot box, desk, stethoscope, community), label "Focus on full participation." Right panel slightly larger with lilac (#C48ABD) border. {INFOGRAPHIC_ANCHOR} Gender-neutral person icons. No clip art.""",
    },
    {
        "filename": "g01-infographic-decision-path-5step-01.png",
        "prompt": f"""A horizontal five-step pathway infographic on white background. Five rounded rectangle stations connected by a curved dotted line, flowing left to right. Step 1 "Pause": light navy background, white raised hand icon. Step 2 "Listen": cobalt (#245BAA), white ear with sound waves. Step 3 "Apply": lilac (#C48ABD), white puzzle piece clicking into place. Step 4 "Adapt": chartreuse (#74AE54), white arrows forming a flexible loop. Step 5 "Seek Support": red (#C0233B), white two-person icon with speech bubble. Below each step space for a one-line descriptor. Small directional arrows on the path between stations. {INFOGRAPHIC_ANCHOR} Horizontal layout only. Icons simple and recognizable at small size.""",
    },
    {
        "filename": "g01-infographic-practice-model-4quadrant-01.png",
        "prompt": f"""A four-quadrant diagram (2x2 grid) on white background with a centre circle. Centre: navy (#192858) circle with text area for "Accessibility in Practice." Top-left "Awareness": light navy, white eye icon with lightbulb reflection, text area "Recognize barriers and biases." Top-right "Communication": cobalt (#245BAA), white two speech bubbles icon, text area "Adapt how you share information." Bottom-left "Environment": lilac (#C48ABD), white doorway with ramp icon, text area "Shape inclusive spaces." Bottom-right "Response": chartreuse (#74AE54), white hand with checkmark icon, text area "Act with dignity and flexibility." Thin white dividing lines. Perfectly symmetrical. {INFOGRAPHIC_ANCHOR} All quadrants exactly the same size.""",
    },
    {
        "filename": "g01-scenario-hospital-booking-okafor-01.png",
        "prompt": f"""A hospital reception desk scene at a modern Canadian outpatient clinic. A Black Canadian woman in her late 60s (Nigerian heritage, grey-streaked hair) wearing a warm winter coat and scarf stands at the counter, holding a printed appointment letter and gesturing toward a self-service computer kiosk behind her. Reading glasses hang on a chain around her neck. Her expression is frustrated but dignified. A South Asian receptionist in her early 30s with a navy lanyard leans forward, listening with empathy. A sign on the counter reads "Book online." Clean modern clinic interior, warm lighting. {PHOTO_ANCHOR} No patronizing body language. No confused-old-person framing.""",
    },
    {
        "filename": "g01-scenario-clinic-signage-low-vision-01.png",
        "prompt": f"""Inside a modern Canadian hospital at a corridor intersection where three hallways meet. A South Asian woman in her mid-70s with grey hair in a bun holds a handheld magnifying glass up to a directional sign on the wall. She wears a warm cardigan and comfortable shoes. The sign has small black text on white with poor contrast listing department names with arrows. The sign is mounted high. No colour coding or tactile indicators. Floor markings are faded. 2-3 blurred people walk past in the background without noticing. Fluorescent lighting with natural light from a window. {PHOTO_ANCHOR} No one helping her — this is the before-intervention moment. No pity framing.""",
    },
    {
        "filename": "g01-scenario-checklist-team-huddle-01.png",
        "prompt": f"""A small team huddle in a hospital staff room (not an exam room). Three healthcare workers gather around a tablet showing a digital checklist. A white woman in her mid-30s in teal scrubs points at the tablet screen. A Filipino-Canadian man in his early 40s in navy scrubs takes notes on a clipboard. A Black Canadian woman in her late 20s wearing a hijab and lab coat holds the tablet. On the wall behind them a poster reads "Accessibility is Everyone's Responsibility." Coffee mugs visible. Warm, collaborative energy. {PHOTO_ANCHOR} Candid, no one looking at camera. No staged posing.""",
    },
    {
        "filename": "g01-practice-tips-inclusive-moments-01.png",
        "prompt": f"""A split-screen photograph with a thin white vertical divider. LEFT HALF: A nurse — an Indigenous (Metis) woman in her mid-40s in navy scrubs — kneels at eye level beside a white man in his early 30s with cerebral palsy in a power wheelchair. An AAC tablet device is mounted on his wheelchair tray. The nurse makes eye contact with the patient, not the device. Both have warm engaged expressions. Hospital room with natural light. RIGHT HALF: A Caribbean-Canadian man in his mid-50s in a hospital maintenance uniform carefully places a temporary accessible parking sign next to an orange construction zone in a hospital corridor. He handles the sign with care and purpose. {PHOTO_ANCHOR} Nurse at eye level, NOT standing over wheelchair user.""",
    },
    {
        "filename": "g01-reflection-map-planning-01.png",
        "prompt": f"""A quiet contemplative photograph. A Korean-Canadian woman in her late 30s sits at a desk in a hospital staff room during a break. She wears scrubs with a cozy cardigan layered over them. She holds a pen and looks thoughtfully at her laptop screen. A cup of coffee sits beside the laptop. Through a window behind her, the Toronto skyline is partially visible in soft bokeh — the CN Tower recognizable but blurred. A small sticky note on the desk reads "What will I do differently?" Soft warm window light. Shallow depth of field. Shot on Canon EOS R5, 50mm lens, f/1.8. Warm colour grading. Intimate, personal moment. No other people. No clutter.""",
    },
    {
        "filename": "g01-icons-learning-objectives-01.png",
        "prompt": f"""Five flat vector icons in a horizontal row on white background. Each icon sits inside a rounded square tile with cobalt blue (#245BAA) background and white icon. Icon 1: a wall/barrier with a crack opening through it. Icon 2: balanced scales of justice. Icon 3: three interlocking circles (Venn diagram). Icon 4: a shield with a forward arrow. Icon 5: three simplified person silhouettes linked by connector lines. Consistent spacing between tiles. {INFOGRAPHIC_ANCHOR} All icons same size and weight. Simple, scannable at small sizes.""",
    },
    {
        "filename": "g01-summary-key-takeaways-01.png",
        "prompt": f"""Four horizontal summary cards stacked vertically on light grey (#F5F5F5) background. Each card is white with rounded corners and an 8px coloured accent bar on the left side plus a small icon. Card 1: navy accent bar, universal accessibility symbol icon. Card 2: cobalt accent bar, arrows pointing at barriers icon. Card 3: lilac accent bar, five connected dots pathway icon. Card 4: chartreuse accent bar, connected people group icon. Each card has a text label area to the right of the icon. Bottom: small branding area. {INFOGRAPHIC_ANCHOR} Clean, professional summary layout. No busy backgrounds.""",
    },
    {
        "filename": "g01-badge-foundations-completion-01.png",
        "prompt": f"""A professional circular digital achievement badge on white background. Outer ring: navy (#192858), 20px wide. Inner circle: cobalt (#245BAA). Centre icon: a stylized open book combined with a universal accessibility symbol, white. Top: a small gold star at 12 o'clock. A horizontal ribbon banner across the upper third of the inner circle with navy background and text area for "Accessibility First." Below the icon: text area for "Foundations." Around the outer ring: small text area for "Guide 01 of 18." {INFOGRAPHIC_ANCHOR} Professional credential style — like a continuing education badge. NOT gamification or cartoon.""",
    },
]


def generate_image(prompt, filename):
    """Generate a single image via OpenAI API."""
    print(f"\n{'='*60}")
    print(f"Generating: {filename}")
    print(f"{'='*60}")

    payload = {
        "model": "dall-e-3",
        "prompt": prompt,
        "n": 1,
        "size": "1792x1024",  # Closest to 16:9 available
        "quality": "hd",
        "style": "natural",
    }

    try:
        resp = requests.post(
            "https://api.openai.com/v1/images/generations",
            headers=HEADERS,
            json=payload,
            timeout=120,
        )
        resp.raise_for_status()
        data = resp.json()
        image_url = data["data"][0]["url"]
        revised_prompt = data["data"][0].get("revised_prompt", "")

        # Download image
        img_resp = requests.get(image_url, timeout=60)
        img_resp.raise_for_status()

        output_path = OUTPUT_DIR / filename
        with open(output_path, "wb") as f:
            f.write(img_resp.content)

        print(f"  Saved: {output_path}")
        print(f"  Size: {len(img_resp.content) / 1024:.0f} KB")
        if revised_prompt:
            print(f"  Revised prompt: {revised_prompt[:100]}...")

        return True

    except requests.exceptions.HTTPError as e:
        print(f"  ERROR: {e}")
        try:
            print(f"  Detail: {resp.json()}")
        except Exception:
            pass
        return False
    except Exception as e:
        print(f"  ERROR: {e}")
        return False


if __name__ == "__main__":
    print(f"Output directory: {OUTPUT_DIR}")
    print(f"Images to generate: {len(IMAGES)}")
    print()

    results = {"success": [], "failed": []}

    for i, img in enumerate(IMAGES, 1):
        print(f"\n[{i}/{len(IMAGES)}]", end="")
        ok = generate_image(img["prompt"], img["filename"])
        if ok:
            results["success"].append(img["filename"])
        else:
            results["failed"].append(img["filename"])

        # Rate limit: wait between requests
        if i < len(IMAGES):
            print("  Waiting 15s (rate limit)...")
            time.sleep(15)

    print(f"\n\n{'='*60}")
    print(f"DONE — {len(results['success'])}/{len(IMAGES)} generated")
    print(f"{'='*60}")
    if results["success"]:
        print(f"\nSuccess:")
        for f in results["success"]:
            print(f"  {f}")
    if results["failed"]:
        print(f"\nFailed:")
        for f in results["failed"]:
            print(f"  {f}")
