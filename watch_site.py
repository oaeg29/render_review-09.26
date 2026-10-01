#!/usr/bin/env python3
"""Regenerate generated-versions.js whenever the image folder tree changes."""

from __future__ import annotations

import subprocess
import sys
import time
from pathlib import Path


PROJECT_DIR = Path(__file__).resolve().parent
PUBLIC_ROOT = PROJECT_DIR / "public"
GENERATOR = PROJECT_DIR / "generate_versions.py"
CONVERTER = PROJECT_DIR / "convert_pngs_to_webp.py"


def folder_signature(root: Path) -> tuple[tuple[str, int, int], ...]:
    files = []
    if root.exists():
        for path in root.rglob("*"):
            if path.is_file() and path.name != ".DS_Store":
                stat = path.stat()
                files.append((path.relative_to(root).as_posix(), stat.st_mtime_ns, stat.st_size))
    return tuple(sorted(files))


def regenerate() -> None:
    subprocess.run([sys.executable, str(GENERATOR)], check=True)


def convert_sources() -> None:
    subprocess.run([sys.executable, str(CONVERTER)], check=True)


def main() -> None:
    print("Watching public/. Press Ctrl-C to stop.")
    previous_public = None
    try:
        while True:
            current_public = folder_signature(PUBLIC_ROOT)
            if current_public != previous_public:
                has_pngs = any(path.lower().endswith(".png") for path, _, _ in current_public)
                if has_pngs:
                    convert_sources()
                else:
                    regenerate()
                previous_public = current_public
            if folder_signature(PUBLIC_ROOT) != current_public:
                regenerate()
                previous_public = folder_signature(PUBLIC_ROOT)
            time.sleep(1)
    except KeyboardInterrupt:
        print("Stopped.")


if __name__ == "__main__":
    main()
