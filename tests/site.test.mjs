import test from "node:test";
import assert from "node:assert/strict";
import {
  cacheControl,
  prepareObject,
  publicationOrder,
} from "../tools/delivery-plan.mjs";
import { PAGES } from "../src/pages.mjs";
import { games } from "../src/games.mjs";
import { analytics } from "../src/layout.mjs";

test("pages publish after the files they name", () => {
  assert.deepEqual(publicationOrder(["index.html", "style.css", "a/b.png"]), [
    "a/b.png",
    "style.css",
    "index.html",
  ]);
});

test("pages revalidate; fonts keep", () => {
  assert.match(cacheControl("index.html"), /max-age=0/);
  assert.match(cacheControl("style.css"), /max-age=0/);
  assert.match(cacheControl("fonts/LondrinaSolid-Black.woff2"), /2592000/);
});

test("unsafe or untyped keys are refused", () => {
  assert.throws(() => prepareObject("../x.html", Buffer.from("")));
  assert.throws(() => prepareObject("x.exe", Buffer.from("")));
});

test("no analytics until asked for and configured", () => {
  assert.equal(analytics(false), "");
});

// Be honest about the game: nothing promised that is not built or decided.
test("copy promises no release, price, Catalog listing or unbuilt feature", () => {
  const html = PAGES.map((p) => p.render({ tinylytics: false })).join("\n");
  const text = html.replace(/<[^>]+>/g, " ");
  for (const word of [
    /coming soon/i,
    /\bcatalog\b/i,
    /\$\d/,
    /\bprice\b/i,
    /\bbuy\b/i,
    /pre-?order/i,
    /available (now|on)/i,
    /\bdownload (it|now|here)\b/i,
  ])
    assert.doesNotMatch(text, word);
  assert.match(text, /no release date/);
  // A build to try is a test build, never a release (Jamie, 2026-11-14:
  // friends sideload it from files.thingelstad.com).
  assert.match(text, /test build/);
  for (const game of games) assert.notEqual(game.status, "Released");
});

test("a test build links its zipped .pdx on files.thingelstad.com", () => {
  for (const game of games.filter((g) => g.build)) {
    const { url, file, version } = game.build;
    assert.match(url, /^https:\/\/files\.thingelstad\.com\/.+\.pdx\.zip$/);
    assert.ok(url.endsWith(`/${file}`), url);
    assert.ok(file.includes(version), file);
    const page = PAGES.find((p) => p.path === `/${game.slug}/`);
    const html = page.render({ tinylytics: false });
    assert.ok(html.includes(`href="${url}"`), "the page links the build");
  }
});
