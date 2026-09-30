#!/usr/bin/env python3
"""Losslessly optimize the site's PNG images in place using oxipng.

This script does not resize images or use visually-lossy options. It preserves
file permissions and timestamps where oxipng supports doing so.
"""

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
    parser.add_argument(
        "path",
        nargs="?",
        type=Path,
        default=DEFAULT_IMAGE_DIR,
        help="Directory or PNG file to optimize (default: public/images)",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Show potential savings without changing files",
    )
    parser.add_argument(
        "--backup",
        action="store_true",
        help="Copy each original to filename.png.bak before replacing it",
    )
    parser.add_argument(
        "--level",
        choices=("0", "1", "2", "3", "4", "5", "6", "max"),
        default="4",
        help="oxipng optimization level (default: 4; max is slower)",
    )
    parser.add_argument(
        "--zopfli",
        action="store_true",
        help="Use the slower, stronger Zopfli compression pass",
    )
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

    if shutil.which("oxipng") is None:
        print("Error: oxipng is not installed or is not on PATH.", file=sys.stderr)
        print("Install oxipng, then run this script again.", file=sys.stderr)
        return 1

    try:
        pngs = find_pngs(image_path)
    except FileNotFoundError as error:
        print(f"Error: {error}", file=sys.stderr)
        return 1

    if not pngs:
        print(f"No PNG files found under {image_path}")
        return 0

    command = ["oxipng", "--opt", args.level, "--preserve"]
    if args.zopfli:
        command.append("--zopfli")
    if args.dry_run:
        command.append("--dry-run")

    if args.backup and not args.dry_run:
        for png in pngs:
            shutil.copy2(png, png.with_name(f"{png.name}.bak"))

    result = subprocess.run([*command, *map(str, pngs)], check=False)
    if result.returncode != 0:
        return result.returncode

    action = "Checked" if args.dry_run else "Optimized"
    print(f"{action} {len(pngs)} PNG file(s) losslessly.")
    if args.backup and not args.dry_run:
        print("Original files were saved beside each PNG with a .png.bak suffix.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
