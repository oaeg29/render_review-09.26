#!/usr/bin/env python3
"""Generate the browser's version data from the public WebP folder tree."""

from __future__ import annotations

import json
import re
from pathlib import Path


PROJECT_DIR = Path(__file__).resolve().parent
IMAGE_ROOT = PROJECT_DIR / "public" / "images"
OUTPUT_FILE = PROJECT_DIR / "generated-versions.js"

KNOWN_METADATA = {
    "version-01": {
        "description": ".",
        "properties": [
            {"label": "Light position", "value": "Table"},
            {"label": "Faceting Density Layout", "value": "Low density / large faces (pavilion) → medium density / medium faces (girdle) → high density / small faces (crown) → highest density / smallest faces (table)"},
            {"label": "Facets height / projection", "value": "~14cm"},
        ],
    },
    "version-02": {
        "description": ".",
        "properties": [
            {"label": "Light position", "value": "Crown (middle line)"},
            {"label": "Faceting Density Layout", "value": "Low density / large faces (pavilion) → medium density / medium faces (girdle) → high density / small faces (crown) → highest density / smallest faces (table)"},
            {"label": "Facets height / projection", "value": "~14cm"},
        ],
    },
}


def webp_path(path: Path) -> str:
    return path.relative_to(PROJECT_DIR).as_posix()


def format_name(value: str) -> str:
    return re.sub(r"[-_]+", " ", value).strip().title()


def image_label(path: Path) -> str | None:
    stem = path.stem
    if "-n" in stem:
        return None
    return format_name(stem)


def load_existing_metadata() -> dict[str, dict]:
    """Read descriptions/properties from the previous generated manifest.

    The generator rebuilds image paths on every run, but metadata entered in
    the existing manifest must survive that rebuild.
    """
    if not OUTPUT_FILE.exists():
        return {}
    source = OUTPUT_FILE.read_text(encoding="utf-8")
    match = re.search(r"window\.reviewVersions\s*=\s*(\[.*\]);\s*$", source, re.DOTALL)
    if not match:
        return {}
    try:
        previous_versions = json.loads(match.group(1))
    except json.JSONDecodeError:
        return {}
    return {
        version["id"]: {
            "description": version.get("description", ""),
            "properties": version.get("properties", []),
        }
        for version in previous_versions
        if isinstance(version, dict) and version.get("id")
    }


def overview_sections(overview_dir: Path) -> list[dict]:
    sections = []
    for folder in sorted(item for item in overview_dir.iterdir() if item.is_dir()):
        match = re.fullmatch(r"(.+?)(-n)?-([01])", folder.name)
        if not match:
            continue
        base_name, no_title, position = match.groups()
        images = [
            {"src": webp_path(image), "label": image_label(image)}
            for image in sorted(folder.glob("*.webp"))
        ]
        if not images:
            continue
        sections.append({
            "position": int(position),
            "title": None if no_title else format_name(base_name),
            "images": images,
        })
    return sorted(sections, key=lambda section: section["position"])


def build_version(folder: Path, existing_metadata: dict[str, dict]) -> dict:
    version_id = folder.name
    metadata = {
        **KNOWN_METADATA.get(version_id, {}),
        **existing_metadata.get(version_id, {}),
    }
    overview_dir = folder / "overview"
    views = []
    view_dirs = sorted(
        (item for item in folder.iterdir() if item.is_dir() and re.fullmatch(r"view-\d+", item.name)),
        key=lambda item: int(item.name.split("-")[-1]),
    )
    for view_dir in view_dirs:
        def image(name: str) -> str | None:
            file = view_dir / f"{name}.webp"
            return webp_path(file) if file.exists() else None

        views.append({
            "id": view_dir.name,
            "name": format_name(view_dir.name),
            "render": image("render"),
            "geometry": image("geometry"),
            "guides": {
                "top": image("camera-top"),
                "front": image("camera-front"),
                "side": image("camera-side"),
            },
        })

    return {
        "id": version_id,
        "name": format_name(version_id),
        "description": metadata.get("description", ""),
        "properties": metadata.get("properties", []),
        "cover": webp_path(folder / "cover.webp") if (folder / "cover.webp").exists() else None,
        "overview": {
            # `cover.webp` is accepted as a compatibility alias for an
            # overview render, while the documented name remains render.webp.
            "render": webp_path(overview_dir / "render.webp")
            if (overview_dir / "render.webp").exists()
            else (webp_path(overview_dir / "cover.webp") if (overview_dir / "cover.webp").exists() else None),
            "geometry": webp_path(overview_dir / "geometry.webp") if (overview_dir / "geometry.webp").exists() else None,
            "sections": overview_sections(overview_dir),
        },
        "views": views,
    }


def main() -> None:
    version_dirs = sorted(
        (item for item in IMAGE_ROOT.iterdir() if item.is_dir() and re.fullmatch(r"version-\d+", item.name)),
        key=lambda item: int(item.name.split("-")[-1]),
    )
    existing_metadata = load_existing_metadata()
    versions = [build_version(folder, existing_metadata) for folder in version_dirs]
    OUTPUT_FILE.write_text(
        "// Generated by generate_versions.py. Existing descriptions and properties are retained.\n"
        f"window.reviewVersions = {json.dumps(versions, indent=2, ensure_ascii=False)};\n",
        encoding="utf-8",
    )
    print(f"Generated {OUTPUT_FILE.name} for {len(versions)} version(s).")


if __name__ == "__main__":
    main()
