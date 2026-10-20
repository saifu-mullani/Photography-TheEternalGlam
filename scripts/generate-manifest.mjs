// Scans public/images, public/videos, public/thumbnails and writes src/data/media.generated.json
import fs from "node:fs";
import path from "node:path";
import sizeOf from "image-size";

const ROOT = process.cwd();
const PUBLIC = path.join(ROOT, "public");
const OUT = path.join(ROOT, "src/data/media.generated.json");
const IMG = /\.(jpe?g|png|webp|avif)$/i;
const VID = /\.(mp4|webm|mov)$/i;

const natural = (a, b) => a.localeCompare(b, undefined, { numeric: true });
const list = (dir, re) =>
  fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => re.test(f)).sort(natural) : [];
const readJson = (file) => {
  try { return JSON.parse(fs.readFileSync(file, "utf8")); } catch { return {}; }
};

function scanImages(folder) {
  const dir = path.join(PUBLIC, "images", folder);
  const meta = readJson(path.join(dir, "captions.json"));
  return list(dir, IMG).map((file) => {
    let width = 1200, height = 1600;
    try {
      const s = sizeOf(path.join(dir, file));
      width = s.width ?? width; height = s.height ?? height;
    } catch { console.warn(`! Could not read size of ${folder}/${file}`); }
    return {
      src: `images/${folder}/${file}`,
      width, height,
      alt: meta[file]?.alt ?? "",
      caption: meta[file]?.caption ?? "",
    };
  });
}

const imagesRoot = path.join(PUBLIC, "images");
const imageFolders = fs.existsSync(imagesRoot)
  ? fs.readdirSync(imagesRoot, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name)
  : [];
const images = Object.fromEntries(imageFolders.map((f) => [f, scanImages(f)]));

const thumbDirs = ["wedding", "pre-wedding", "post-wedding", "engagement", "other"];
const findThumb = (category, base) => {
  for (const d of [category, "other"]) {
    if (!thumbDirs.includes(d)) continue;
    const hit = list(path.join(PUBLIC, "thumbnails", d), IMG).find(
      (f) => path.parse(f).name === base
    );
    if (hit) return `thumbnails/${d}/${hit}`;
  }
  return "";
};

const videosRoot = path.join(PUBLIC, "videos");
const videos = [];
if (fs.existsSync(videosRoot)) {
  for (const cat of fs.readdirSync(videosRoot, { withFileTypes: true }).filter((d) => d.isDirectory())) {
    const dir = path.join(videosRoot, cat.name);
    const meta = readJson(path.join(dir, "captions.json"));
    for (const file of list(dir, VID)) {
      const base = path.parse(file).name;
      videos.push({
        category: cat.name,
        src: `videos/${cat.name}/${file}`,
        poster: findThumb(cat.name, base),
        title: meta[file]?.title ?? base.replace(/[-_]/g, " "),
        caption: meta[file]?.caption ?? "",
      });
    }
  }
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify({ generatedAt: new Date().toISOString(), images, videos }, null, 2));
const total = Object.values(images).reduce((n, a) => n + a.length, 0);
console.log(`Media manifest: ${total} images, ${videos.length} videos`);
