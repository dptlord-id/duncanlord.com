# duncanlord.com

Personal site of Duncan Lord, served by GitHub Pages from the `main` branch at
https://www.duncanlord.com. Every page is plain HTML; there is no build step.

## Layout

- `index.html`, `about.html`, `portfolio.html` (Work), `research.html`
  (Research & Teaching), and `project/`: the pages. URLs match the file paths.
- `css/site.css`: the only stylesheet. Colors, type sizes, and spacing are
  custom properties at the top of the file.
- `js/site.js`: the gallery lightbox. Pages still work without it.
- `images/`: WebP images, grouped by page or project.
- `partials/`: the shared header and footer.

## Preview locally

Links are root-relative (`/css/site.css`), so open pages through a local
server instead of double-clicking the files:

```sh
python3 -m http.server 8000
```

Then visit http://localhost:8000.

## Common tasks

Install the tools once with `npm install`.

- Change the menu or footer: edit `partials/header.html` or
  `partials/footer.html`, then run `npm run sync`. The script copies them into
  every page (between the `<!-- site-header -->` and `<!-- site-footer -->`
  markers) and marks the current page in the menu.
- Add an image: `npm run image -- path/to/photo.png projects/my-project/hero 800 1600`
  writes resized WebP files to `images/` and prints an `<img>` tag to paste.
  Fill in its `alt` text.
- Add a project: copy an existing file in `project/` (for example
  `project/kash.html`), keep its structure (At a glance list, The challenge,
  What I made, Outcome, gallery), and replace the content. Add a card for it to
  `portfolio.html` under Professional work or Graduate coursework (and to
  `index.html` if it should be featured), then run `npm run sync`.
- Downloads: the site intentionally hosts no downloadable files. Link to live
  work (a video, a site, a hosted lesson) instead.
- Format files: `npm run format`.
