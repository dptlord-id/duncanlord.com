// Converts an image into resized WebP files and prints an <img> tag to paste.
// Usage: npm run image -- <source file> <output name> [widths...]
// Example: npm run image -- ~/Desktop/hero.png projects/new-project/hero 800 1600
//   writes images/projects/new-project/hero-800.webp and hero-1600.webp
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { dirname } from "node:path";

const [src, name, ...rest] = process.argv.slice(2);
if (!src || !name) {
  console.error(
    "Usage: npm run image -- <source file> <output name> [widths...]",
  );
  process.exit(1);
}

const animated = src.toLowerCase().endsWith(".gif");
const meta = await sharp(src).metadata();
const requested = rest.length ? rest.map(Number) : [800, 1600];
// Never upscale: sizes larger than the original become the original width.
const widths = [...new Set(requested.map((w) => Math.min(w, meta.width)))];

const files = [];
for (const width of widths) {
  const file = `images/${name}-${width}.webp`;
  await mkdir(dirname(file), { recursive: true });
  await sharp(src, { animated })
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: animated ? 70 : 80, effort: 6 })
    .toFile(file);
  files.push({
    file,
    width,
    height: Math.round((meta.pageHeight ?? meta.height) * (width / meta.width)),
  });
}

const first = files[0];
const srcset = files.map((f) => `/${f.file} ${f.width}w`).join(", ");
console.log(`<img
  src="/${first.file}"${files.length > 1 ? `\n  srcset="${srcset}"\n  sizes="100vw"` : ""}
  width="${first.width}"
  height="${first.height}"
  alt=""
  loading="lazy"
/>`);
