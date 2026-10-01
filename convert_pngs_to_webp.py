#!/usr/bin/env python3
"""Convert PNGs in public/ to lossless WebPs and move originals to public_pngs/."""

from __future__ import annotations

import argparse
import shutil
import subprocess
import sys
from pathlib import Path


PROJECT_DIR = Path(__file__).resolve().parent
DEFAULT_PUBLIC_DIR = PROJECT_DIR / "public"
DEFAULT_PNG_DIR = PROJECT_DIR / "public_pngs"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "path",
        nargs="?",
        type=Path,
        default=DEFAULT_PUBLIC_DIR,
        help="Public directory containing PNGs (default: public)",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=DEFAULT_PUBLIC_DIR,
        help="WebP output directory (default: public)",
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


def main() -> int:
    args = parse_args()
    image_path = args.path if args.path.is_absolute() else PROJECT_DIR / args.path
    output_dir = args.output if args.output.is_absolute() else PROJECT_DIR / args.output
    if shutil.which("cwebp") is None:
        print("Error: cwebp is not installed or is not on PATH.", file=sys.stderr)
        return 1
    try:
        if not image_path.exists() and not args.dry_run:
            image_path.mkdir(parents=True, exist_ok=True)
        pngs = find_pngs(image_path)
        if not pngs:
            print(f"Warning: no PNG files found under {image_path}.", file=sys.stderr)
    except FileNotFoundError as error:
        print(f"Error: {error}", file=sys.stderr)
        return 1

    converted = 0
    moved = 0
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
        backup = DEFAULT_PNG_DIR / relative_path
        if backup.exists():
            print(f"Backup already exists, leaving PNG in place: {backup}", file=sys.stderr)
            return 1
        print(f"Moving: {png} -> {backup}")
        backup.parent.mkdir(parents=True, exist_ok=True)
        if not args.dry_run:
            shutil.move(str(png), str(backup))
        moved += 1

    action = "Would convert" if args.dry_run else "Converted"
    print(f"{action} {converted} PNG file(s) to lossless WebP.")
    if skipped:
        print(f"Skipped {skipped} existing WebP file(s).")
    if moved:
        print(f"Moved {moved} PNG backup file(s) to {DEFAULT_PNG_DIR}.")
    if not args.dry_run:
        generator = PROJECT_DIR / "generate_versions.py"
        subprocess.run([sys.executable, str(generator)], check=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
