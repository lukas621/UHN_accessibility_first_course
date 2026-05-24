#!/usr/bin/env python3
"""
Image Prompt Formatter for UHN Accessibility First Course Series
Reads image briefs markdown and outputs formatted prompts ready to paste
into Midjourney, NanoBanana, or GPT Image 2.

Usage:
    python format_image_prompts.py --guide 1                          # All images for Guide 1
    python format_image_prompts.py --guide 1 --tool midjourney        # Midjourney-formatted
    python format_image_prompts.py --guide 1 --tool gpt               # GPT Image 2 formatted
    python format_image_prompts.py --guide 1 --tool nanobanana        # NanoBanana formatted
    python format_image_prompts.py --guide 1 --screen 7               # Single screen only
    python format_image_prompts.py --guide 1 --output prompts.txt     # Save to file
"""

import argparse
import re
import sys
from pathlib import Path

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

# UHN Brand colours for prompts
UHN_COLOURS = "Navy #192858, Cobalt #245BAA, Teal #00A5A8, Warm white #FAF9F6"


def parse_image_briefs(filepath: Path) -> list[dict]:
    """Parse image briefs markdown into structured image entries."""
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Split by image headers — look for ## Image N or ## Screen N or numbered sections
    # Flexible pattern to handle various formats
    image_sections = re.split(r'(?=^##\s+(?:Image|Screen|Slide)\s+\d+)', content, flags=re.MULTILINE)
    if len(image_sections) <= 1:
        # Try alternative split pattern
        image_sections = re.split(r'(?=^---\s*$)', content, flags=re.MULTILINE)

    images = []
    for section in image_sections:
        if not section.strip():
            continue

        image = {}

        # Extract screen number
        screen_match = re.search(r'(?:Screen|Slide|Image)\s+(\d+)', section, re.IGNORECASE)
        if screen_match:
            image["screen_number"] = int(screen_match.group(1))

        # Extract title
        title_match = re.search(r'##\s+(?:Image|Screen|Slide)\s+\d+[:\s—–-]+(.+?)$', section, re.MULTILINE)
        if title_match:
            image["title"] = title_match.group(1).strip()

        # Extract description — look for various field labels
        for field, patterns in {
            "description": [r'(?:Visual [Dd]escription|Primary [Dd]escription|[Dd]escription)[:\s]*(.+?)(?=\n(?:##|\*\*|Style|Character|Setting|Alt|Filename|Negative)|\Z)',],
            "style": [r'(?:Style|Visual [Ss]tyle)[:\s]*(.+?)$',],
            "characters": [r'(?:Character[s]?|People)[:\s]*(.+?)(?=\n(?:##|\*\*|Setting|Alt|Filename|Negative)|\Z)',],
            "setting": [r'Setting[:\s]*(.+?)$',],
            "alt_text": [r'Alt [Tt]ext[:\s]*(.+?)$',],
            "filename": [r'(?:Filename|File [Nn]ame|Suggested [Ff]ilename)[:\s]*(.+?)$',],
            "negative": [r'(?:Negative [Pp]rompt|Avoid|Do [Nn]ot)[:\s]*(.+?)$',],
        }.items():
            for pattern in patterns:
                match = re.search(pattern, section, re.MULTILINE | re.DOTALL)
                if match:
                    image[field] = match.group(1).strip()
                    break

        # Only add if we got meaningful content
        if image.get("description") or image.get("title"):
            images.append(image)

    return images


def format_for_midjourney(image: dict, guide_num: int) -> str:
    """Format an image brief as a Midjourney prompt."""
    parts = []

    desc = image.get("description", "")
    parts.append(desc)

    # Add style modifiers
    style = image.get("style", "").lower()
    if "infographic" in style or "flat" in style:
        parts.append("flat vector illustration style, clean lines, minimal gradients, professional infographic")
    else:
        parts.append("realistic photography, warm natural lighting, authentic healthcare setting")

    # Add technical specs
    parts.append("16:9 aspect ratio, high quality, professional")

    # Add brand colour hint
    parts.append(f"colour palette: {UHN_COLOURS}")

    # Negative prompt
    negative = image.get("negative", "")
    if negative:
        neg_text = f" --no {negative}"
    else:
        neg_text = " --no stereotypical disability imagery, pity framing, stock photo feel, AI artifacts, extra fingers"

    prompt = ", ".join(parts) + neg_text + " --ar 16:9 --v 6.1"

    return prompt


def format_for_gpt_image(image: dict, guide_num: int) -> str:
    """Format an image brief as a GPT Image 2 prompt."""
    parts = []

    parts.append(f"Create a high-quality image for a healthcare accessibility training course at University Health Network (UHN) in Toronto, Canada.")
    parts.append("")

    desc = image.get("description", "")
    parts.append(f"Scene: {desc}")

    style = image.get("style", "").lower()
    if "infographic" in style or "flat" in style:
        parts.append("Style: Clean flat vector infographic, professional, minimal gradients, modern design.")
    else:
        parts.append("Style: Realistic photography with warm natural lighting. Authentic, not staged. Diverse representation.")

    chars = image.get("characters", "")
    if chars:
        parts.append(f"Characters: {chars}")

    setting = image.get("setting", "")
    if setting:
        parts.append(f"Setting: {setting}")

    parts.append(f"Colour palette: {UHN_COLOURS}")
    parts.append("Aspect ratio: 16:9 (1920x1080)")

    parts.append("")
    parts.append("IMPORTANT: Show people with disabilities as active participants with agency and dignity. Accurate assistive devices. No pity framing, no inspiration porn, no stereotypes.")

    negative = image.get("negative", "")
    if negative:
        parts.append(f"DO NOT include: {negative}")

    return "\n".join(parts)


def format_for_nanobanana(image: dict, guide_num: int) -> str:
    """Format an image brief as a NanoBanana prompt."""
    parts = []

    desc = image.get("description", "")
    parts.append(desc)

    style = image.get("style", "").lower()
    if "infographic" in style or "flat" in style:
        parts.append("Style: flat vector infographic, clean professional design, minimal gradients")
    else:
        parts.append("Style: realistic photography, warm lighting, authentic healthcare setting, Toronto Canada")

    chars = image.get("characters", "")
    if chars:
        parts.append(f"Characters: {chars}")

    parts.append(f"Brand colours: {UHN_COLOURS}")
    parts.append("16:9, 1920x1080, high quality")

    # Disability representation rules
    parts.append("Disability representation: show agency, dignity, participation. Accurate assistive devices. No pity framing.")

    negative = image.get("negative", "")
    if negative:
        parts.append(f"Negative: {negative}")

    return "\n".join(parts)


def main():
    parser = argparse.ArgumentParser(description="Format image prompts for Midjourney, GPT Image 2, or NanoBanana")
    parser.add_argument("--guide", type=int, required=True, help="Guide number (1-18)")
    parser.add_argument("--tool", choices=["midjourney", "gpt", "nanobanana"], default="gpt", help="Target tool (default: gpt)")
    parser.add_argument("--screen", type=int, default=None, help="Single screen only")
    parser.add_argument("--output", type=str, default=None, help="Save to file instead of stdout")
    args = parser.parse_args()

    if args.guide not in GUIDE_FOLDERS:
        print(f"Error: Guide {args.guide} not found")
        sys.exit(1)

    guide_folder = BUILD_OUTPUT / GUIDE_FOLDERS[args.guide]
    briefs_file = guide_folder / "05-image-briefs" / f"IMAGE-BRIEFS-GUIDE-{args.guide:02d}.md"

    if not briefs_file.exists():
        print(f"Error: Image briefs not found: {briefs_file}")
        sys.exit(1)

    images = parse_image_briefs(briefs_file)
    print(f"Parsed {len(images)} image briefs from Guide {args.guide:02d}\n")

    if args.screen:
        images = [img for img in images if img.get("screen_number") == args.screen]
        if not images:
            print(f"Error: No image brief found for screen {args.screen}")
            sys.exit(1)

    formatter = {
        "midjourney": format_for_midjourney,
        "gpt": format_for_gpt_image,
        "nanobanana": format_for_nanobanana,
    }[args.tool]

    output_lines = []
    for img in images:
        screen = img.get("screen_number", "?")
        title = img.get("title", "Untitled")
        filename = img.get("filename", f"g{args.guide:02d}-screen-{screen}.png")
        alt_text = img.get("alt_text", "")

        header = f"{'=' * 70}\n"
        header += f"SCREEN {screen}: {title}\n"
        header += f"Filename: {filename}\n"
        if alt_text:
            header += f"Alt text: {alt_text}\n"
        header += f"Tool: {args.tool.upper()}\n"
        header += f"{'=' * 70}\n"

        prompt = formatter(img, args.guide)

        output_lines.append(header + "\n" + prompt + "\n")

    output_text = "\n".join(output_lines)

    if args.output:
        output_path = Path(args.output)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(output_text)
        print(f"Saved {len(images)} prompts to: {output_path}")
    else:
        print(output_text)

    print(f"\n{len(images)} prompts formatted for {args.tool.upper()}")


if __name__ == "__main__":
    main()
