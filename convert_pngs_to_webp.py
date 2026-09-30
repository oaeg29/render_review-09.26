#!/usr/bin/env python3
"""Create lossless WebP companions for the site's PNG images."""

from __future__ import annotations

import argparse
import shutil
import subprocess
import sys
from pathlib import Path


PROJECT_DIR = Path(__file__).resolve().parent
DEFAULT_IMAGE_DIR = PROJECT_DIR / "public" / "images"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("path", nargs="?", type=Path, default=DEFAULT_IMAGE_DIR)
    parser.add_argument("--dry-run", action="store_true", help="List conversions without writing files")
    parser.add_argument("--skip-existing", action="store_true", help="Leave existing WebP files unchanged")
    return parser.parse_args()


def find_pngs(path: Path) -> list[Path]:
    if path.is_file():
        return [path] if path.suffix.lower() == ".png" else []
    if path.is_dir():
        return sorted(item for item in path.rglob("*.png") if item.is_file())
    raise FileNotFoundError(f"Path does not exist: {path}")


def main() -> int:
    args = parse_args()
    image_path = args.path if args.path.is_absolute() else PROJECT_DIR / args.path
    if shutil.which("cwebp") is None:
        print("Error: cwebp is not installed or is not on PATH.", file=sys.stderr)
        return 1
    try:
        pngs = find_pngs(image_path)
    except FileNotFoundError as error:
        print(f"Error: {error}", file=sys.stderr)
        return 1

    converted = 0
    skipped = 0
    for png in pngs:
        webp = png.with_suffix(".webp")
        if args.skip_existing and webp.exists():
            skipped += 1
            continue
        converted += 1
        if args.dry_run:
            print(f"Would convert: {png} -> {webp}")
            continue
        result = subprocess.run(
            ["cwebp", "-quiet", "-lossless", "-z", "9", "-mt", str(png), "-o", str(webp)],
            check=False,
        )
        if result.returncode != 0:
            print(f"Failed to convert: {png}", file=sys.stderr)
            return result.returncode

    action = "Would convert" if args.dry_run else "Converted"
    print(f"{action} {converted} PNG file(s) to lossless WebP.")
    if skipped:
        print(f"Skipped {skipped} existing WebP file(s).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
