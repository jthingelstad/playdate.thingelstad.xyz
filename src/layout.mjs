// The page shell every page shares: head, the black rail, the footer.
import {
  ORIGIN,
  OWNER,
  SITE_NAME,
  TINYLYTICS_SCRIPT,
  TINYLYTICS_SITE,
  ref,
} from "./site.mjs";

const ESCAPES = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};
export const esc = (value) =>
  String(value).replace(/[&<>"']/g, (c) => ESCAPES[c]);

// Analytics: only in the deploy build, only on the production host, and only
// once a Tinylytics site id is set in src/site.mjs.
export function analytics(enabled) {
  if (!enabled || !TINYLYTICS_SITE) return "";
  const host = new URL(ORIGIN).hostname;
  return `<script>if (location.hostname === ${JSON.stringify(host)}) { const s = document.createElement("script"); s.defer = true; s.src = ${JSON.stringify(TINYLYTICS_SCRIPT)}; s.dataset.site = ${JSON.stringify(TINYLYTICS_SITE)}; document.body.append(s); }</script>`;
}

export function layout({
  path,
  title,
  description,
  body,
  image = "/share/throwing-wood.png",
  imageAlt = "Kubb: Throwing Wood, the title screen",
  noindex = false,
  tinylytics = false,
  nav = path,
}) {
  const url = `${ORIGIN}${path}`;
  const imageUrl = `${ORIGIN}${image}`;
  const current = (href) => (nav === href ? ' aria-current="page"' : "");
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
${noindex ? '<meta name="robots" content="noindex">\n' : ""}<meta name="color-scheme" content="light dark">
<meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)">
<link rel="icon" type="image/png" href="/favicon.png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="stylesheet" href="/shared/tokens.css">
<link rel="stylesheet" href="/style.css">
<link rel="preload" href="/fonts/LondrinaSolid-Black.woff2" as="font" type="font/woff2" crossorigin>
${noindex ? "" : `<link rel="canonical" href="${url}">\n`}<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(SITE_NAME)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${imageUrl}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(imageAlt)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="${imageUrl}">
${OWNER.relMe.map((href) => `<link rel="me" href="${href}">`).join("\n")}
</head>
<body>
<a class="skip" href="#main">Skip to the page</a>
<header class="rail">
  <div class="frame rail__inner">
    <a class="rail__brand" href="/"${current("/")}><span class="rail__badge"><svg class="rail__flag" viewBox="0 0 10 12" width="10" height="12" aria-hidden="true"><path d="M1 0v12M1 1h8l-3 3 3 3H1" fill="currentColor" stroke="currentColor" stroke-width="2"/></svg></span>${esc(SITE_NAME)}</a>
    <nav class="rail__nav" aria-label="Games"><a href="/throwing-wood/"${current("/throwing-wood/")}>Throwing Wood</a><svg class="rail__crank" viewBox="0 0 22 22" width="22" height="22" aria-hidden="true"><circle cx="11" cy="11" r="3" fill="currentColor"/><path d="M11 11h8" stroke="currentColor" stroke-width="3"/><rect x="16" y="8" width="5" height="6" fill="currentColor"/></svg></nav>
  </div>
</header>
<main id="main">
${body}
</main>
<footer class="foot">
  <div class="frame">
    <p>Made by
      <a class="h-card" href="${OWNER.url}" rel="me author"><img class="u-photo" src="${OWNER.avatar}" alt="" width="28" height="28"><span class="p-name">${esc(OWNER.name)}</span><data class="u-url" value="${OWNER.url}"></data><data class="p-note" value="${esc(OWNER.note)}"></data></a>.
      Jamie’s other projects are on <a href="${ref("https://thingelstad.xyz/", "footer")}">Things I’ve built</a>.
    </p>
    <p class="foot__small">Playdate is a trademark of Panic Inc. These games are not made by Panic. Display type: Londrina Solid, under the <a href="/fonts/OFL-LondrinaSolid.txt">SIL Open Font License</a>.</p>
  </div>
</footer>
${analytics(tinylytics)}
</body>
</html>
`;
}
