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
  assert.match(text, /no download/);
  assert.match(text, /no release date/);
  // A computer opponent and sound are named only as not built.
  for (const feature of [/computer opponent/i, /\bsound\b/i])
    for (const line of text.split(/\n/).filter((l) => feature.test(l)))
      assert.match(line, /A computer opponent\.|Sound\./, line.trim());
  for (const game of games) assert.notEqual(game.status, "Released");
});
