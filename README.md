# Photography Studio Website

Vite + React + TypeScript single-page site with folder-based galleries.

## Setup
```
npm install
npm run dev        # regenerates the media manifest, then starts Vite
npm run build      # regenerates the manifest, type-checks, builds to /dist
npm run preview    # preview the production build
```

## How media discovery works
`scripts/generate-manifest.mjs` scans `public/images`, `public/videos` and `public/thumbnails`,
reads each image's real width/height, and writes `src/data/media.generated.json`.
It runs automatically before `dev` and `build`. A static site cannot list folders at runtime,
so this build step is what makes new files appear.

## Adding or replacing photos
1. Drop files into the matching folder, e.g. `public/images/wedding/wedding-014.jpg`
   (JPG, JPEG, PNG, WebP, AVIF).
2. Restart `npm run dev` or run `npm run build`.
3. Deploy `/dist`. No component edits needed.

Files sort in natural order (wedding-2 before wedding-10). Removing a file removes it on the next build.

## Hero and About
- Hero: first image in `public/images/hero/` (or set `heroImageOverride` in `src/config/siteConfig.ts`).
- About: first image in `public/images/about/`.

## Captions and alt text (optional)
Add `captions.json` to any image or video folder:
```
{ "wedding-001.jpg": { "alt": "Bride laughing in golden light", "caption": "Udaipur, 2025" } }
```
For videos: `{ "film-01.mp4": { "title": "Aisha & Dev", "caption": "Highlight film" } }`

## Video thumbnails
Give the thumbnail the same base name as the video:
`public/videos/wedding/aisha-dev.mp4` -> `public/thumbnails/wedding/aisha-dev.jpg`
(Categories without their own thumbnail folder use `public/thumbnails/other/`.)

## Social links and contact
Edit `src/config/siteConfig.ts`. Empty social links are hidden.
Set `enquiryEndpoint` (e.g. a Formspree URL) for the form; if empty, it opens the visitor's email app.

## Changing text, services, packages
Edit files in `src/data/`. Category list and folder mapping: `src/data/categories.ts`.

## Performance tips
Export web-sized images (about 2000px on the long edge, under 500 KB) before adding them.
The site serves the originals you provide and does not resize them.

## Deploying under a sub-path (e.g. GitHub Pages)
Change `base` in `vite.config.ts` to `"/repo-name/"`.
