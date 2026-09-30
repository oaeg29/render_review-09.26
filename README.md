# Jewel Version Review

Dependency-free static viewer for reviewing and comparing 3D design versions.

## Image folders

The deployed image folder contains WebP files only:

```text
public/images/version-01/
  cover.webp
  overview/
    render.webp
    geometry.webp
  view-01/
    render.webp
    geometry.webp
    camera-top.webp
    camera-front.webp
    camera-side.webp
```

The original PNG sources are kept separately under `public_pngs/` with the same folder structure. This folder can be excluded from deployment or removed from the upload package.

## Adding a version

1. Add the PNG source files under `public_pngs/version-XX/`.
2. Run `python3 convert_pngs_to_webp.py`.
3. Add the version metadata and views to the `versions` array in `script.js`.

The conversion script moves any PNGs accidentally placed under `public/images` into `public_pngs`, then creates WebP files under `public/images`. The site does not use PNG fallbacks.

Render and geometry files may have different native resolutions, but must share camera, framing, crop, and aspect ratio.

## Lossless image tools

Optimize source PNGs before conversion:

```bash
python3 optimize_pngs.py
```

Create WebP files:

```bash
python3 convert_pngs_to_webp.py
```

Useful options include `--dry-run`, `--backup`, `--level max`, `--zopfli`, and `--skip-existing`.
