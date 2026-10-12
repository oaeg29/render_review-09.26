#!/usr/bin/env python3
"""Generate the browser's version and exterior-floor data from public WebP folders."""

from __future__ import annotations

import json
import re
from pathlib import Path


PROJECT_DIR = Path(__file__).resolve().parent
IMAGE_ROOT = PROJECT_DIR / "public" / "images"
OUTPUT_FILE = PROJECT_DIR / "generated-versions.js"
EXTERIOR_ROOT = IMAGE_ROOT / "exterior-floor"
EXTERIOR_SWATCH_ORDER = ["white", "grey", "dark-grey"]

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
    match = re.search(r"window\.reviewVersions\s*=\s*(\[.*?\]);", source, re.DOTALL)
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
        section = {
            "position": int(position),
            "title": None if no_title else format_name(base_name),
            "images": images,
        }
        if base_name == "crowd":
            section["kind"] = "crowd"
            section["variants"] = {
                "off": [image for image in images if Path(image["src"]).stem.startswith("no-crowd-view-")],
                "on": [image for image in images if Path(image["src"]).stem.startswith("crowd-view-")],
            }
            section["images"] = section["variants"]["off"]
        sections.append(section)
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
            "renderCrowd": image("render-c"),
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


def exterior_view_ids(folder: Path, swatch_dirs: list[Path]) -> list[str]:
    candidates = set()
    geometry_dir = folder / "geometry"
    if geometry_dir.is_dir():
        candidates.update(item.name for item in geometry_dir.iterdir() if item.is_file() and re.fullmatch(r"view-\d+\.webp", item.name))
    for swatch_dir in swatch_dirs:
        candidates.update(
            item.name
            for item in swatch_dir.iterdir()
            if item.is_dir() and re.fullmatch(r"view-\d+", item.name)
        )
    return sorted(
        {candidate.removesuffix(".webp") for candidate in candidates},
        key=lambda value: int(value.split("-")[-1]),
    )


def build_exterior_card(folder: Path) -> dict | None:
    swatches_root = folder / "swatches"
    swatch_dirs = sorted(item for item in swatches_root.iterdir() if item.is_dir()) if swatches_root.is_dir() else []
    preferred_order = {name: index for index, name in enumerate(EXTERIOR_SWATCH_ORDER)}
    swatch_dirs.sort(key=lambda item: (preferred_order.get(item.name, len(preferred_order)), item.name))
    view_ids = exterior_view_ids(folder, swatch_dirs)
    has_render = any((swatch_dir / view_id / "render.webp").exists() for swatch_dir in swatch_dirs for view_id in view_ids)
    has_geometry = any((folder / "geometry" / f"{view_id}.webp").exists() for view_id in view_ids)
    if not view_ids or not swatch_dirs or not has_render or not has_geometry:
        return None
    views = []
    for view_id in view_ids:
        geometry_file = folder / "geometry" / f"{view_id}.webp"
        views.append({
            "id": view_id,
            "name": format_name(view_id),
            "geometry": webp_path(geometry_file) if geometry_file.exists() else None,
        })

    swatches = []
    for swatch_dir in swatch_dirs:
        swatches.append({
            "id": swatch_dir.name,
            "name": format_name(swatch_dir.name),
            "views": [
                {
                    "id": view_id,
                    "render": webp_path(swatch_dir / view_id / "render.webp")
                    if (swatch_dir / view_id / "render.webp").exists() else None,
                }
                for view_id in view_ids
                if (swatch_dir / view_id / "render.webp").is_file()
            ],
        })
    swatches = [swatch for swatch in swatches if swatch["views"]]

    card_name = "White → Grey comparison" if folder.name == "white-grey" else format_name(folder.name)
    cover = None
    if swatches and swatches[0]["views"]:
        cover = swatches[0]["views"][0]["render"]
    return {
        "id": folder.name,
        "name": card_name,
        "description": "Compare exterior floor colours across available views.",
        "cover": cover,
        "views": views,
        "swatches": swatches,
    }


def main() -> None:
    version_dirs = sorted(
        (item for item in IMAGE_ROOT.iterdir() if item.is_dir() and re.fullmatch(r"version-\d+", item.name)),
        key=lambda item: int(item.name.split("-")[-1]),
    )
    existing_metadata = load_existing_metadata()
    versions = [build_version(folder, existing_metadata) for folder in version_dirs]
    exterior_dirs = sorted(
        (item for item in EXTERIOR_ROOT.iterdir() if item.is_dir())
        if EXTERIOR_ROOT.is_dir() else [],
        key=lambda item: item.name,
    )
    exterior_cards = [card for folder in exterior_dirs if (card := build_exterior_card(folder))]
    OUTPUT_FILE.write_text(
        "// Generated by generate_versions.py. Existing descriptions and properties are retained.\n"
        f"window.reviewVersions = {json.dumps(versions, indent=2, ensure_ascii=False)};\n"
        f"window.exteriorFloorCards = {json.dumps(exterior_cards, indent=2, ensure_ascii=False)};\n",
        encoding="utf-8",
    )
    print(f"Generated {OUTPUT_FILE.name} for {len(versions)} version(s) and {len(exterior_cards)} exterior-floor card(s).")


if __name__ == "__main__":
    main()
