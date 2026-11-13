// Build dist/: the pages from src/, the files in public/, and the files
// written from them (sitemap.xml, llms.txt, revision.json).
//
//   node tools/build.mjs                         local, preview and CI checks
//   PLAYDATE_TINYLYTICS=true node tools/build.mjs   the deploy build
//
// Sitemap lastmod is the last commit that touched a page's sources, never the
// build time (search-consoles rule, 2026-10-28). CI checks out full history.
import { execFileSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { PAGES } from "../src/pages.mjs";
import { games } from "../src/games.mjs";
import { ORIGIN, SITE_TITLE } from "../src/site.mjs";

const tinylytics = process.env.PLAYDATE_TINYLYTICS === "true";
const git = (...args) => {
  try {
    return execFileSync("git", args, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return "";
  }
};
const lastCommit = (paths) =>
  (paths.length && git("log", "-1", "--format=%cI", "--", ...paths)) ||
  git("log", "-1", "--format=%cI") ||
  new Date().toISOString();

await fs.rm("dist", { recursive: true, force: true });
await fs.cp("public", "dist", { recursive: true });
for (const page of PAGES) {
  const file = path.join("dist", page.file);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, page.render({ tinylytics }));
}

const indexed = PAGES.filter((page) => !page.noindex);
await fs.writeFile(
  "dist/sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${indexed
    .map(
      (page) =>
        `  <url>\n    <loc>${ORIGIN}${page.path}</loc>\n    <lastmod>${lastCommit(page.sources)}</lastmod>\n  </url>`,
    )
    .join("\n")}\n</urlset>\n`,
);
await fs.writeFile(
  "dist/robots.txt",
  `User-agent: *\nAllow: /\n\nSitemap: ${ORIGIN}/sitemap.xml\n`,
);
await fs.writeFile(
  "dist/llms.txt",
  `# ${SITE_TITLE}

> Games Jamie Thingelstad is making for the Playdate, the handheld with a crank. None is released yet.

## Games

${games
  .map(
    (game) =>
      `- [${game.title}](${ORIGIN}/${game.slug}/): ${game.status.toLowerCase()} since ${game.started}, not released and no download. ${game.summary} The record of how it is being built: ${game.record}`,
  )
  .join("\n")}
`,
);
await fs.writeFile(
  "dist/revision.json",
  JSON.stringify({
    commit: process.env.GITHUB_SHA || git("rev-parse", "HEAD") || null,
    builtAt: new Date().toISOString(),
  }) + "\n",
);
console.log(
  `Built ${PAGES.length} pages${tinylytics ? " with analytics" : ""}`,
);
