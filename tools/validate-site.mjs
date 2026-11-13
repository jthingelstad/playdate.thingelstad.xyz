// Checks the built site (dist/) after npm run build.
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { mime } from "./delivery-plan.mjs";
import { PAGES } from "../src/pages.mjs";
import { ORIGIN, TINYLYTICS_SITE } from "../src/site.mjs";

async function walk(dir) {
  const out = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const name = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(name)));
    else out.push(name);
  }
  return out;
}
const files = await walk("dist");
const keys = new Set(files.map((f) => path.relative("dist", f)));
for (const file of files)
  assert.ok(mime[path.extname(file)], `No MIME type for ${file}`);
const read = (name) => fs.readFile(path.join("dist", name), "utf8");

// Analytics only in the deploy build, and only once a site id is set.
const analytics = process.env.PLAYDATE_TINYLYTICS === "true" && TINYLYTICS_SITE;
for (const page of PAGES) {
  const html = await read(page.file);
  const count = html.split("tinylytics.app").length - 1;
  assert.equal(count, analytics ? 1 : 0, `tinylytics.app in ${page.file}`);

  // Every local file a page names was built.
  for (const [, ref] of html.matchAll(/(?:src|href)="(\/[^"#?]*)"/g)) {
    const key = ref.endsWith("/") ? `${ref.slice(1)}index.html` : ref.slice(1);
    assert.ok(keys.has(key), `${page.file} names ${ref}, which was not built`);
  }
  // Every image has alt text (empty only when it repeats a link's words).
  for (const [tag] of html.matchAll(/<img\b[^>]*>/g))
    assert.match(tag, /\balt="/, `${page.file}: an image without alt`);
  // The h-card every site carries, with its explicit url.
  assert.match(html, /class="h-card"[^>]*>.*class="u-url"/s, "h-card url");

  if (page.noindex) {
    assert.match(html, /name="robots" content="noindex"/);
    continue;
  }
  assert.match(
    html,
    new RegExp(`<link rel="canonical" href="${ORIGIN}${page.path}">`),
    `canonical for ${page.path}`,
  );
  const image = html.match(/property="og:image" content="([^"]+)"/)[1];
  assert.ok(keys.has(new URL(image).pathname.slice(1)), `og:image ${image}`);
}

// Design boards are never passed off as screenshots.
const game = await read("throwing-wood/index.html");
for (const [figure] of game.matchAll(
  /<figure class="shot shot--design">.*?<\/figure>/gs,
))
  assert.match(figure, /Design mock-up/, "a design board without its label");

assert.match(
  await read("robots.txt"),
  new RegExp(`^Sitemap: ${ORIGIN}/sitemap\\.xml$`, "m"),
);
const locs = [
  ...(await read("sitemap.xml")).matchAll(/<loc>([^<]+)<\/loc>/g),
].map((m) => m[1]);
assert.deepEqual(
  locs,
  PAGES.filter((p) => !p.noindex).map((p) => `${ORIGIN}${p.path}`),
);
assert.match(
  await read("llms.txt"),
  /^# .+\n\n> .+/,
  "llms.txt opens with a title and a summary",
);
console.log(`Site checks passed (${files.length} files)`);
