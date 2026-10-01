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

1. Add the PNG source files under `public/images/version-XX/`.
2. Run `python3 convert_pngs_to_webp.py`.
3. Commit the generated `generated-versions.js` file with the image changes.

The conversion script scans `public/` for PNGs, creates a WebP beside each PNG, moves the original PNG into the matching path under `public_pngs/`, and automatically regenerates `generated-versions.js`. The site does not use PNG fallbacks. Afterward, move `public_pngs/` out of the workspace as your backup.

If the WebP files are already present, regenerate the site data directly with:

```bash
python3 generate_versions.py
```

For local work, keep the folder scanner running in another terminal. It watches `public/`; when you drop in PNG sources it converts them, moves the originals to `public_pngs/`, and regenerates the site data automatically:

```bash
python3 watch_site.py
```

Without the watcher, the manual workflow is:

1. Put source PNGs in `public/images/version-XX/` using the documented names.
2. Run `python3 convert_pngs_to_webp.py`.
3. Upload or push the updated `public/images/` and `generated-versions.js`.

You only need `python3 generate_versions.py` directly when the WebP files already exist and only the folder structure or guide-section metadata changed. It scans the WebP folders and writes the JavaScript manifest; it does not convert or move images. `watch_site.py` is a convenience loop that monitors `public/` and calls the converter and generator for you; it is not a second data format or a second site.

The generator discovers every folder named `version-NN` under `public/images`, so a new version is included without editing JavaScript. This scan happens during the site-generation step and the generated file is what the hosted static site reads. A normal static host cannot inspect its own folders from browser JavaScript, so `generated-versions.js` must be regenerated and pushed whenever image folders change.

### Overview guide sections

The two base overview images remain `overview/render.webp` and `overview/geometry.webp`. Additional direct subfolders inside `overview/` are optional sections:

```text
overview/
  render.webp
  geometry.webp
  light_position-0/
    front-view.webp
  notes-n-1/
    side-view-n.webp
```

Only folders ending in `-0` or `-1` are included. `-0` sections appear above the base guides and `-1` sections appear below them. A folder without either suffix is ignored. Folder and image names are formatted automatically (`light_position` becomes `Light Position`, and `front-view` becomes `Front View`). Put `-n` immediately before the ordering suffix to hide the section title, and include `-n` in an image filename to hide that image's label.

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
