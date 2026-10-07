// Copies partials/header.html and partials/footer.html into every page, between
// the <!-- site-header --> / <!-- site-footer --> markers, and marks the current
// page in the navigation. Pages without markers are left alone.
// Usage: npm run sync
import { readFile, writeFile, readdir } from "node:fs/promises";
import * as prettier from "prettier";

const dirs = [".", "project"];
const partials = {
  header: await readFile("partials/header.html", "utf8"),
  footer: await readFile("partials/footer.html", "utf8"),
};

const pages = [];
for (const dir of dirs) {
  for (const name of await readdir(dir)) {
    if (name.endsWith(".html"))
      pages.push(dir === "." ? name : `${dir}/${name}`);
  }
}

// Marks links to this page. In the header, project pages also mark Work.
function markCurrent(html, page, partial) {
  const url = page === "index.html" ? "/" : `/${page}`;
  const link = (href) => new RegExp(`href="${href}"(\\s*)>`, "g");
  html = html.replace(link(url), `href="${url}" aria-current="page"$1>`);
  if (partial !== "header") return html;
  if (page.startsWith("project/")) {
    html = html.replace(
      link("/portfolio.html"),
      'href="/portfolio.html" aria-current="true"$1>',
    );
  }
  return html;
}

let changed = 0;
for (const page of pages) {
  const original = await readFile(page, "utf8");
  let html = original;
  for (const [name, content] of Object.entries(partials)) {
    const pattern = new RegExp(
      `<!-- site-${name} -->[\\s\\S]*?<!-- /site-${name} -->`,
    );
    html = html.replace(
      pattern,
      () =>
        `<!-- site-${name} -->\n${markCurrent(content, page, name)}<!-- /site-${name} -->`,
    );
  }
  if (html === original) continue;
  const options = await prettier.resolveConfig(page);
  html = await prettier.format(html, { ...options, filepath: page });
  if (html !== original) {
    await writeFile(page, html);
    changed++;
    console.log(`updated ${page}`);
  }
}
console.log(`${changed} page(s) updated`);
