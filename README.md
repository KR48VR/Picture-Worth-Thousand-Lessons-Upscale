# Science & Math in Wildlife Photos — Interactive HTML Resource

This is a static website. It does not need a backend, database, or build step.

## Files
- `index.html` — main page
- `styles.css` — visual styling
- `script.js` — interactions, tabs, search, zoom modal
- `data.js` — module data
- `assets/images/` — full poster PNGs and original photos
- `assets/thumbs/` — small gallery thumbnails

## How to host on GitHub Pages
1. Create a new GitHub repository.
2. Upload the full contents of this folder, not just `index.html`.
3. In GitHub: Settings → Pages → Deploy from branch → main → root.
4. Wait for GitHub to give you the Pages URL.

## Notes
The infographic images are static JPEG/WebP assets. The surrounding interface is interactive: gallery, search, guided episode mode, presenter mode, tabs, zoom, downloads, keyboard navigation, teacher prompts, and per-module maths labs.

## Version 2 additions

- Guided field episode: observe → decode → model → transfer.
- Full-screen presenter mode for classroom use.
- Interactive maths labs for each wildlife module.
- Compact Updates tab logging what changed from the original upload.
- Cleaned plate crops for editorial cards, hero imagery, and presenter mode.
- WebP display assets for faster rendering while preserving the original catalogue images for downloads/provenance.
- GitHub Pages polish: favicon, web manifest, social preview image, robots.txt, sitemap.xml, and 404.html.

## Exhibition provenance update

Each module now includes the matching NAPE 2026 Group A catalogue details: photographer, catalogue title, entry serial number, catalogue number, year taken, exhibition print size, sale price/status, category, source PDF, and exhibition venue/date details.

The available Group A shortlist table does not provide shooting locations for these photographs. The site therefore shows “Photo location: Not stated in the available Group A catalogue list” rather than inferring locations from subject matter or titles.

## Analytics

GoatCounter is included with site endpoint `https://kr48vr.goatcounter.com/count` via the standard `gc.zgo.at/count.js` script.

The interface also sends lightweight GoatCounter events when available:

- `module_open`
- `story_start`, `story_step`, `story_exit`
- `presenter_open`, `presenter_close`
- `tab_secondary`, `tab_university`, `tab_engineering`
- `math_lab_change`
- `improvement_log_open`
- `download_original`, `download_explainer`
- `search`, `search_no_results`
- `image_zoom`


This light package compresses poster images as JPEG for easier GitHub browser upload and faster GitHub Pages loading.
