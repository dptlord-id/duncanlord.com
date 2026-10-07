// Converts the original Webflow assets into the renamed, resized images in images/.
// Usage: npm run images  (re-run any time; outputs are overwritten)
import sharp from "sharp";
import { mkdir, copyFile } from "node:fs/promises";
import { dirname } from "node:path";

const CDN = "assets/cdn/62ffb45a4d13cf689714ee6a/";
const PROJ = "assets/cdn/63001c5f2da10f4f29586f6a/";

// [source, output name (no extension), widths]
const photos = [
  [CDN + "6601bcaeefd2d25e1d1ea5f9_0003-5x7.webp", "home/portrait", [480, 960]],
  [
    CDN + "636838a1e17d1b5dba432d33_Self-Photo-Vertical-2.webp",
    "home/about-portrait",
    [474],
  ],
  [
    CDN +
      "64fe62b06abe46916d5b73d2_20230810_DuncanLord_SB_OOL_0003-RESIZED-.webp",
    "about/portrait",
    [800, 1200],
  ],
  [
    CDN + "660606d25e1b01c5af2d6547_UNI-logo.webp",
    "coursework/uni-logo",
    [240],
  ],
  [CDN + "660607786b8a967b0f84d43d_OU-Logo.webp", "coursework/ou-logo", [240]],
];

const projects = {
  "performance-perspectives": [
    "6306be3cc225c7f30dffa338_Facilitator-Guide-Mockup.png",
    "6306c96973a0405311f98ad4_screenshot-1.png",
    "6306c980f1f32b10f7266a25_screenshot-2.png",
    "6306c99cdc776c6e8a885be1_screenshot-3.png",
    "6306c9b4fdf3b47f70076b9a_screenshot-4.png",
  ],
  "ux-atlanta": [
    "630ac7547ce1c25989dcff51_hero-image.png",
    "630ad5087f7cea0e6a9a1b8c_screenshot-1.png",
    "630ad56524bca462fa00252a_screenshot-2.png",
    "630ad72d78b48407df7ad320_screenshot-3.png",
    "630ad747a3e23b9a375b6e8f_screenshot-4.png",
  ],
  "romantic-music-history": [
    "6307b9742de26b179758a77a_hero-image.png",
    "6307c74318bcfd8fb579b6c8_screenshot-1.png",
    "6307c762eae0eb3c826e2efd_screenshot-2.png",
    "6307c7902ff74a9766005efd_screenshot-3.png",
    "6307ca8c47998b83448b7943_screenshot-4-short-compressed.gif",
  ],
  "intonation-video": [
    "6306ea4a65bd551a07e06a53_tuning-video-hero.png",
    "6306ea4d4a00764f1797c01b_screenshot-1.png",
    "6306ea6e92cca53ae3a1ae94_screenshot-2.png",
    "6306ea89fdf3b46db40944d3_screenshot-3.png",
    "6306ea9d39b4fd65d65b2718_screenshot-4.png",
  ],
  "presentation-collaboratory-fellowship-program": [
    "635eeb027b758daa50d6c4f9_Hero-Image.png",
  ],
  kash: [
    "6306cd6492cca55bc89fe252_KASH-Mockup-small.jpg",
    "6306d1c039b4fd355b59a436_screenshot-1.png",
    "6306d1e0bbb316570c27ad7f_screenshot-2.png",
    "6306d21a80c06d2eb73b74b9_screenshot-3.png",
    "6306d22f39b4fda6ad59abb1_screenshot-4.png",
  ],
  "kash-plus": [
    "6306d86cc225c7114b013054_kash+-hero.png",
    "6306d871fdf3b4583008367e_screenshot-1.png",
    "6306d8e9f1f32bf15a271902_screenshot-2.png",
    "6306d900258d354ba8645cee_screenshot-3.png",
    "6306d95539b4fdf9195a20b7_screenshot-4.png",
  ],
};

for (const [slug, files] of Object.entries(projects)) {
  files.forEach((file, i) => {
    photos.push([
      PROJ + file,
      `projects/${slug}/${i === 0 ? "hero" : "screenshot-" + i}`,
      [800, 1600],
    ]);
  });
}

const copies = [
  [
    CDN + "6606057a789f950f3a0b3a12_Indiana_Hoosiers_logo.svg",
    "coursework/indiana-logo.svg",
  ],
  [CDN + "66032b69dc8667cf7239f095_embodied-icon.svg", "research/embodied.svg"],
  [CDN + "66032b69c4c2254e8a07c281_embedded-icon.svg", "research/embedded.svg"],
  [CDN + "66032b69e2b8afd068cc2ba1_enactive-icon.svg", "research/enactive.svg"],
  [CDN + "66032b69dc0b0e4d18cb8cb4_extended-icon.svg", "research/extended.svg"],
  [CDN + "632c90707c9a365c2dab6d40_favicon-1.png", "favicon.png"],
  ["assets/cdn/img/webclip.png", "apple-touch-icon.png"],
];

const out = (name) => `images/${name}`;
const sizes = {};

async function write(pipeline, file) {
  await mkdir(dirname(file), { recursive: true });
  const info = await pipeline.toFile(file);
  sizes[file] = `${info.width}x${info.height}`;
}

for (const [src, name, widths] of photos) {
  const animated = src.endsWith(".gif");
  const meta = await sharp(src).metadata();
  // Never upscale: a size larger than the original is replaced by the original width.
  const targets = [...new Set(widths.map((w) => Math.min(w, meta.width)))];
  for (const w of targets) {
    const img = sharp(src, { animated })
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: animated ? 70 : 80, effort: 6 });
    await write(img, out(`${name}-${w}.webp`));
  }
}

for (const [src, name] of copies) {
  await mkdir(dirname(out(name)), { recursive: true });
  await copyFile(src, out(name));
}

// Signature logo: trim the padding, then make a dark (nav) and light (footer) version.
const logo = sharp(CDN + "6306bb702caa0f0cc68f17e9_dlord-light.png").trim();
const alpha = await logo
  .clone()
  .extractChannel("alpha")
  .raw()
  .toBuffer({ resolveWithObject: true });
for (const [variant, rgb] of [
  ["dark", "#1e212b"],
  ["light", "#f6f6f4"],
]) {
  for (const w of [180, 360]) {
    const img = sharp({
      create: {
        width: alpha.info.width,
        height: alpha.info.height,
        channels: 3,
        background: rgb,
      },
    })
      .joinChannel(alpha.data, {
        raw: {
          width: alpha.info.width,
          height: alpha.info.height,
          channels: 1,
        },
      })
      .png()
      .toBuffer()
      .then((buf) => sharp(buf).resize({ width: w }).webp({ quality: 90 }));
    await write(await img, out(`logo-${variant}-${w}.webp`));
  }
}

console.log(JSON.stringify(sizes, null, 1));
