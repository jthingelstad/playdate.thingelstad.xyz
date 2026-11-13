// The shared type (thingelstad.com/shared/tokens.css and its Inter fonts) is
// vendored into public/shared/, because CI checks out only this repository.
//
//   node tools/shared.mjs sync    copy the sibling's files in
//   node tools/shared.mjs check   fail if the copy has drifted (skips when the
//                                 sibling is not checked out, as on CI)
import fs from "node:fs/promises";
import path from "node:path";

const SOURCE = "../shared";
const FILES = [
  "tokens.css",
  "fonts/OFL-Inter.txt",
  "fonts/OFL-InterTight.txt",
  "fonts/inter-latin-wght-normal.woff2",
  "fonts/inter-latin-ext-wght-normal.woff2",
  "fonts/inter-latin-wght-italic.woff2",
  "fonts/inter-latin-ext-wght-italic.woff2",
  "fonts/inter-tight-latin-wght-normal.woff2",
  "fonts/inter-tight-latin-ext-wght-normal.woff2",
];
const mode = process.argv[2];
try {
  await fs.access(path.join(SOURCE, "tokens.css"));
} catch {
  console.log(`No ${SOURCE}/ beside this checkout; nothing to compare.`);
  process.exit(0);
}
let drift = 0;
for (const file of FILES) {
  const from = path.join(SOURCE, file);
  const to = path.join("public/shared", file);
  const same = await Promise.all([
    fs.readFile(from),
    fs.readFile(to).catch(() => null),
  ]).then(([a, b]) => b !== null && a.equals(b));
  if (same) continue;
  if (mode === "sync") {
    await fs.mkdir(path.dirname(to), { recursive: true });
    await fs.copyFile(from, to);
    console.log(`Copied ${file}`);
  } else {
    console.error(`Drifted: ${file}`);
    drift++;
  }
}
if (drift) process.exit(1);
