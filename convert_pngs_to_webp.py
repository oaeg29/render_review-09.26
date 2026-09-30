#!/usr/bin/env python3
"""Move source PNGs out of the deploy folder and create lossless WebPs."""

from __future__ import annotations

import argparse
import shutil
import subprocess
import sys
from pathlib import Path


PROJECT_DIR = Path(__file__).resolve().parent
DEFAULT_IMAGE_DIR = PROJECT_DIR / "public" / "images"
DEFAULT_PNG_DIR = PROJECT_DIR / "public_pngs"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "path",
        nargs="?",
        type=Path,
        default=DEFAULT_PNG_DIR,
        help="PNG source directory or file (default: public_pngs)",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=DEFAULT_IMAGE_DIR,
        help="WebP output directory (default: public/images)",
    )
    parser.add_argument("--dry-run", action="store_true", help="List conversions without writing files")
    parser.add_argument("--skip-existing", action="store_true", help="Leave existing WebP files unchanged")
    return parser.parse_args()


def find_pngs(path: Path) -> list[Path]:
    if path.is_file():
        return [path] if path.suffix.lower() == ".png" else []
    if path.is_dir():
        return sorted(item for item in path.rglob("*.png") if item.is_file())
    raise FileNotFoundError(f"Path does not exist: {path}")


def move_pngs_from_output(output_dir: Path, source_dir: Path, dry_run: bool) -> int:
    if not output_dir.is_dir() or output_dir.resolve() == source_dir.resolve():
        return 0
    moved = 0
    for png in sorted(output_dir.rglob("*.png")):
        relative_path = png.relative_to(output_dir)
        destination = source_dir / relative_path
        if destination.exists():
            raise FileExistsError(f"Cannot move {png}: destination already exists at {destination}")
        print(f"Would move: {png} -> {destination}" if dry_run else f"Moving: {png} -> {destination}")
        if not dry_run:
            destination.parent.mkdir(parents=True, exist_ok=True)
            shutil.move(str(png), str(destination))
        moved += 1
    return moved


def main() -> int:
    args = parse_args()
    image_path = args.path if args.path.is_absolute() else PROJECT_DIR / args.path
    output_dir = args.output if args.output.is_absolute() else PROJECT_DIR / args.output
    if shutil.which("cwebp") is None:
        print("Error: cwebp is not installed or is not on PATH.", file=sys.stderr)
        return 1
    try:
        moved = move_pngs_from_output(output_dir, image_path, args.dry_run)
        if args.dry_run and moved:
            print(f"Would move {moved} PNG file(s) into the source folder.")
        if not image_path.exists() and not args.dry_run:
            image_path.mkdir(parents=True, exist_ok=True)
        pngs = find_pngs(image_path)
    except FileNotFoundError as error:
        print(f"Error: {error}", file=sys.stderr)
        return 1

    converted = 0
    skipped = 0
    for png in pngs:
        relative_path = png.relative_to(image_path) if image_path.is_dir() else Path(png.name)
        webp = output_dir / relative_path.with_suffix(".webp")
        if args.skip_existing and webp.exists():
            skipped += 1
            continue
        converted += 1
        if args.dry_run:
            print(f"Would convert: {png} -> {webp}")
            continue
        webp.parent.mkdir(parents=True, exist_ok=True)
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
