#!/usr/bin/env python3
"""
Image Generation Script for UHN Accessibility First Course Series
Generates images from image briefs using GPT Image 2 (OpenAI API).

Usage:
    python generate_images.py --guide 1                              # Generate all images for Guide 1
    python generate_images.py --guide 1 --image 1                    # Single image only
    python generate_images.py --guide 1 --dry-run                    # Preview prompts without generating
    python generate_images.py --guide 1 --list                       # List all image briefs
    python generate_images.py --guide 1 --format midjourney          # Output Midjourney-formatted prompts
    python generate_images.py --guide 1 --format nanobanana          # Output NanoBanana-formatted prompts

Requirements:
    pip install openai requests python-dotenv Pillow

Environment variables (in .env file):
    OPENAI_API_KEY=your_key_here
"""

import argparse
import base64
import os
import re
import sys
import json
import time
from pathlib import Path

try:
    import requests
except ImportError:
    print("Error: 'requests' package not installed. Run: pip install requests")
    sys.exit(1)

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

BASE_DIR = Path(__file__).resolve().parent.parent.parent
BUILD_OUTPUT = BASE_DIR / "05-build-output"

GUIDE_FOLDERS = {
    1: "01-Foundations-of-Disability-Inclusion-and-Accessible-Design",
    2: "02-Perceptions-Attitudes-and-Barriers",
    3: "03-Vision-Disabilities",
    4: "04-Sensory-Hearing-and-Communication-Disabilities",
    5: "05-Physical-Disabilities-and-Mobility",
    6: "06-Mental-Health-Disabilities",
    7: "07-Intellectual-Developmental-and-Learning-Disabilities",
    8: "08-Non-Visible-Disabilities",
    9: "09-Aging-Disability-and-Intersectionality",
    10: "10-Engaging-with-Confidence-and-Respect",
    11: "11-Service-Animals-Guide-Dogs-and-Non-Service-Animals",
    12: "12-Support-Persons",
    13: "13-Assistive-Devices",
    14: "14-Communication-and-Information-Accessibility",
    15: "15-Neurodiversity-and-Sensory-Regulation",
    16: "16-Trauma-Informed-Accessibility",
    17: "17-Accessibility-in-Crisis-Situations-and-De-escalation",
    18: "18-Indigenous-Peoples-and-Accessibility",
}

# UHN colours for prompt context
UHN_COLOURS = "UHN Navy #192858, Cobalt #245BAA, Teal #00A5A8, Warm white #FAF9F6"

# Disability representation rules appended to every prompt
REPRESENTATION_RULES = """
CRITICAL RULES FOR DISABILITY REPRESENTATION:
- Show people with disabilities as active participants with agency and dignity
- Accurate assistive devices (correct wheelchair types, realistic hearing aids, proper white cane technique)
- Diverse skin tones, ages, genders, body types
- No pity framing, no inspiration porn, no medical-model imagery
- Canadian healthcare setting (not American)
- Do NOT show disability as the sole defining trait
"""


def parse_image_briefs(filepath: Path) -> list[dict]:
    """Parse image briefs markdown into structured entries."""
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Split by ## Image XX sections
    sections = re.split(r'(?=^## Image \d+)', content, flags=re.MULTILINE)

    images = []
    for section in sections:
        if not section.strip() or not section.strip().startswith('## Image'):
            continue

        img = {}

        # Image number
        num_match = re.search(r'## Image (\d+)', section)
        if num_match:
            img['number'] = int(num_match.group(1))

        # Title
        title_match = re.search(r'## Image \d+\s*[—–-]\s*(.+?)(?:\(|$)', section, re.MULTILINE)
        if title_match:
            img['title'] = title_match.group(1).strip()

        # Screen number
        screen_match = re.search(r'\*\*Screen:\*\*\s*(\d+)', section)
        if screen_match:
            img['screen'] = int(screen_match.group(1))

        # Visual description
        desc_match = re.search(r'\*\*Visual Description:\*\*\s*\n(.+?)(?=\n\*\*)', section, re.DOTALL)
        if desc_match:
            img['description'] = desc_match.group(1).strip()

        # Style
        style_match = re.search(r'\*\*Style:\*\*\s*(.+?)$', section, re.MULTILINE)
        if style_match:
            img['style'] = style_match.group(1).strip()

        # Character details
        char_match = re.search(r'\*\*Character Details:\*\*\s*\n(.+?)(?=\n\*\*)', section, re.DOTALL)
        if char_match:
            img['characters'] = char_match.group(1).strip()

        # Alt text
        alt_match = re.search(r'\*\*Alt Text:\*\*\s*"?(.+?)"?\s*$', section, re.MULTILINE)
        if alt_match:
            img['alt_text'] = alt_match.group(1).strip().strip('"')

        # Filename
        fname_match = re.search(r'\*\*Suggested Filename:\*\*\s*`?(.+?)`?\s*$', section, re.MULTILINE)
        if fname_match:
            img['filename'] = fname_match.group(1).strip()

        # Negative prompts
        neg_match = re.search(r'\*\*Negative Prompts?:\*\*\s*(.+?)(?=\n---|\n## |\Z)', section, re.DOTALL)
        if neg_match:
            img['negative'] = neg_match.group(1).strip()

        if img.get('description'):
            images.append(img)

    return images


def build_gpt_prompt(img: dict) -> str:
    """Build a GPT Image 2 prompt from an image brief."""
    parts = []

    parts.append("Create a high-quality image for a healthcare accessibility training course at University Health Network (UHN) in Toronto, Ontario, Canada.")
    parts.append("")
    parts.append(f"Scene: {img.get('description', '')}")

    style = img.get('style', '')
    if 'infographic' in style.lower() or 'flat' in style.lower() or 'vector' in style.lower():
        parts.append("Style: Clean flat vector infographic design. Professional, modern, minimal gradients. No photorealism.")
    else:
        parts.append(f"Style: {style}")

    if img.get('characters'):
        parts.append(f"Characters: {img['characters']}")

    parts.append(f"Colour palette: {UHN_COLOURS}")
    parts.append("Aspect ratio: 16:9 (1920x1080)")
    parts.append("")
    parts.append(REPRESENTATION_RULES.strip())

    if img.get('negative'):
        parts.append(f"\nDO NOT include: {img['negative']}")

    return "\n".join(parts)


def build_midjourney_prompt(img: dict) -> str:
    """Build a Midjourney prompt from an image brief."""
    parts = []

    parts.append(img.get('description', ''))

    style = img.get('style', '')
    if 'infographic' in style.lower() or 'flat' in style.lower():
        parts.append("flat vector illustration style, clean lines, minimal gradients, professional infographic")
    else:
        parts.append("realistic photography, warm natural lighting, authentic healthcare setting, Toronto Canada")

    if img.get('characters'):
        # Simplify character details for Midjourney
        chars = img['characters'].replace('\n', ', ').replace('- ', '')
        parts.append(chars[:200])

    parts.append(f"colour palette: {UHN_COLOURS}")
    parts.append("high quality, professional, 16:9")

    negative = img.get('negative', 'stereotypical disability imagery, pity framing, stock photo feel, AI artifacts')
    prompt = ", ".join(parts) + f" --no {negative[:200]} --ar 16:9 --v 6.1"

    return prompt


def build_nanobanana_prompt(img: dict) -> str:
    """Build a NanoBanana prompt from an image brief."""
    parts = []

    parts.append(img.get('description', ''))
    parts.append("")

    style = img.get('style', '')
    if 'infographic' in style.lower() or 'flat' in style.lower():
        parts.append("Style: flat vector infographic, clean professional design")
    else:
        parts.append(f"Style: {style}")

    if img.get('characters'):
        parts.append(f"Characters:\n{img['characters']}")

    parts.append(f"Brand colours: {UHN_COLOURS}")
    parts.append("16:9, 1920x1080, high quality")
    parts.append("Disability representation: show agency, dignity, participation. Accurate assistive devices.")

    if img.get('negative'):
        parts.append(f"Avoid: {img['negative']}")

    return "\n".join(parts)


def generate_with_openai(api_key: str, prompt: str, output_path: Path, size: str = "1792x1024") -> None:
    """Generate an image using OpenAI GPT Image 2 API."""
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": "gpt-image-2",
        "prompt": prompt,
        "n": 1,
        "size": size,
        "quality": "high",
    }

    resp = requests.post(
        "https://api.openai.com/v1/images/generations",
        headers=headers,
        json=payload,
        timeout=120,
    )
    resp.raise_for_status()
    result = resp.json()

    # Handle b64 or URL response
    image_data = result["data"][0]
    output_path.parent.mkdir(parents=True, exist_ok=True)

    if "b64_json" in image_data:
        img_bytes = base64.b64decode(image_data["b64_json"])
        with open(output_path, "wb") as f:
            f.write(img_bytes)
    elif "url" in image_data:
        img_resp = requests.get(image_data["url"], timeout=60)
        img_resp.raise_for_status()
        with open(output_path, "wb") as f:
            f.write(img_resp.content)


def save_prompt_file(images: list[dict], format_name: str, output_path: Path, guide_num: int) -> None:
    """Save formatted prompts to a text file for copy-paste use."""
    formatter = {
        "gpt": build_gpt_prompt,
        "midjourney": build_midjourney_prompt,
        "nanobanana": build_nanobanana_prompt,
    }[format_name]

    lines = []
    lines.append(f"# Image Generation Prompts — Guide {guide_num:02d}")
    lines.append(f"# Format: {format_name.upper()}")
    lines.append(f"# Total images: {len(images)}")
    lines.append(f"# Generated: {time.strftime('%Y-%m-%d %H:%M')}")
    lines.append("")

    for img in images:
        num = img.get('number', '?')
        title = img.get('title', 'Untitled')
        filename = img.get('filename', f'g{guide_num:02d}-image-{num}.png')
        alt_text = img.get('alt_text', '')

        lines.append("=" * 70)
        lines.append(f"IMAGE {num}: {title}")
        lines.append(f"Filename: {filename}")
        if alt_text:
            lines.append(f"Alt text: {alt_text}")
        lines.append("=" * 70)
        lines.append("")
        lines.append(formatter(img))
        lines.append("")
        lines.append("")

    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))


def save_alt_text_manifest(images: list[dict], output_path: Path, guide_num: int) -> None:
    """Save an alt text manifest for all images — used when importing into Storyline."""
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(f"# Alt Text Manifest — Guide {guide_num:02d}\n")
        f.write(f"# Use this when importing images into Storyline 360\n\n")
        for img in images:
            filename = img.get('filename', f'g{guide_num:02d}-image-{img.get("number", "?")}.png')
            alt = img.get('alt_text', 'No alt text provided')
            screen = img.get('screen', '?')
            f.write(f"## Screen {screen} — {img.get('title', 'Untitled')}\n")
            f.write(f"- **File:** `{filename}`\n")
            f.write(f"- **Alt text:** {alt}\n\n")


def main():
    parser = argparse.ArgumentParser(description="Generate images for UHN Accessibility First courses")
    parser.add_argument("--guide", type=int, required=True, help="Guide number (1-18)")
    parser.add_argument("--image", type=int, default=None, help="Generate a single image by number")
    parser.add_argument("--dry-run", action="store_true", help="Preview prompts without generating")
    parser.add_argument("--list", action="store_true", help="List all image briefs")
    parser.add_argument("--format", choices=["gpt", "midjourney", "nanobanana"], default="gpt",
                        help="Prompt format (default: gpt). Use 'gpt' for API generation, others for copy-paste.")
    parser.add_argument("--save-prompts", action="store_true",
                        help="Save formatted prompts to a text file instead of generating images")
    parser.add_argument("--size", default="1792x1024",
                        choices=["1024x1024", "1792x1024", "1024x1792"],
                        help="Image size for OpenAI API (default: 1792x1024 for 16:9-ish)")
    args = parser.parse_args()

    if args.guide not in GUIDE_FOLDERS:
        print(f"Error: Guide {args.guide} not found. Valid: 1-18")
        sys.exit(1)

    guide_folder = BUILD_OUTPUT / GUIDE_FOLDERS[args.guide]
    briefs_file = guide_folder / "05-image-briefs" / f"IMAGE-BRIEFS-GUIDE-{args.guide:02d}.md"

    if not briefs_file.exists():
        print(f"Error: Image briefs not found: {briefs_file}")
        sys.exit(1)

    images = parse_image_briefs(briefs_file)
    print(f"Parsed {len(images)} image briefs from Guide {args.guide:02d}\n")

    if args.image:
        images = [img for img in images if img.get('number') == args.image]
        if not images:
            print(f"Error: Image {args.image} not found")
            sys.exit(1)

    # List mode
    if args.list:
        for img in images:
            num = img.get('number', '?')
            title = img.get('title', 'Untitled')
            filename = img.get('filename', '?')
            style = 'infographic' if 'infographic' in img.get('style', '').lower() else 'photo'
            print(f"  Image {num:2d} | {title[:45]:<45} | {style:<11} | {filename}")
        return

    # Save prompts to file
    if args.save_prompts:
        prompts_dir = guide_folder / "05-image-briefs" / "prompts"
        prompts_file = prompts_dir / f"PROMPTS-{args.format.upper()}-GUIDE-{args.guide:02d}.txt"
        save_prompt_file(images, args.format, prompts_file, args.guide)
        print(f"Saved {len(images)} {args.format.upper()} prompts to: {prompts_file}")

        # Also save alt text manifest
        alt_file = guide_folder / "05-image-briefs" / f"ALT-TEXT-MANIFEST-GUIDE-{args.guide:02d}.md"
        save_alt_text_manifest(images, alt_file, args.guide)
        print(f"Saved alt text manifest to: {alt_file}")
        return

    # Dry run
    if args.dry_run:
        formatter = {"gpt": build_gpt_prompt, "midjourney": build_midjourney_prompt, "nanobanana": build_nanobanana_prompt}[args.format]
        for img in images:
            num = img.get('number', '?')
            title = img.get('title', 'Untitled')
            filename = img.get('filename', f'g{args.guide:02d}-image-{num}.png')
            print(f"{'=' * 60}")
            print(f"IMAGE {num}: {title}")
            print(f"Filename: {filename}")
            print(f"{'=' * 60}")
            print(formatter(img))
            print()
        return

    # Generate with OpenAI API
    if args.format != "gpt":
        print(f"API generation only supports --format gpt. Use --save-prompts for {args.format} prompts.")
        sys.exit(1)

    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        print("Error: OPENAI_API_KEY not set. Add it to .env or export it.")
        print("For Midjourney/NanoBanana prompts, use: --save-prompts --format midjourney")
        sys.exit(1)

    output_dir = guide_folder / "05-image-briefs" / "generated"
    print(f"Generating images to: {output_dir}\n")

    for img in images:
        num = img.get('number', '?')
        title = img.get('title', 'Untitled')
        filename = img.get('filename', f'g{args.guide:02d}-image-{num}.png')
        output_path = output_dir / filename

        prompt = build_gpt_prompt(img)
        print(f"  Generating Image {num}: {title}...")

        try:
            generate_with_openai(api_key, prompt, output_path, size=args.size)
            print(f"  ✓ Saved: {filename}")
        except requests.exceptions.HTTPError as e:
            print(f"  ✗ API error: {e}")
            if hasattr(e, 'response') and e.response:
                print(f"    Response: {e.response.text[:300]}")
        except Exception as e:
            print(f"  ✗ Error: {e}")

        # Rate limiting — OpenAI has limits on image generation
        time.sleep(2)

    # Save alt text manifest
    alt_file = guide_folder / "05-image-briefs" / f"ALT-TEXT-MANIFEST-GUIDE-{args.guide:02d}.md"
    save_alt_text_manifest(images, alt_file, args.guide)
    print(f"\nAlt text manifest saved: {alt_file}")
    print(f"\nDone! Generated {len(images)} images for Guide {args.guide:02d}")
    print(f"Output: {output_dir}")
    print("\nIMPORTANT: Review all generated images for accurate disability representation before use.")


if __name__ == "__main__":
    main()
