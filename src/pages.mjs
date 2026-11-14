// Every page of the site, as the path it is served at and its HTML.
import { esc, layout } from "./layout.mjs";
import { featured, games } from "./games.mjs";
import { SITE_TITLE, ref } from "./site.mjs";

const longDate = (iso) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

// A Playdate screen: 400 x 240, shown at its 2x size, pixels kept square.
function screen({ src, alt, caption, kind }) {
  return `<figure class="shot shot--${kind}">
  <div class="shot__screen"><img src="${src}" alt="${esc(alt)}" width="800" height="480" loading="lazy" decoding="async"></div>
  <figcaption><span class="tag${kind === "design" ? " tag--design" : ""}">${kind === "design" ? "Design mock-up" : "Simulator capture"}</span> ${esc(caption)}</figcaption>
</figure>`;
}

const ARROW_DOWN = `<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 2v10M3 8l5 5 5-5" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square"/></svg>`;
const ARROW_RIGHT = `<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M2 8h10M8 3l5 5-5 5" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square"/></svg>`;
const CRANK = `<svg class="plaque__crank" viewBox="0 0 22 22" width="22" height="22" aria-hidden="true"><circle cx="11" cy="11" r="3" fill="currentColor"/><path d="M11 11h8" stroke="currentColor" stroke-width="3"/><rect x="16" y="8" width="5" height="6" fill="currentColor"/></svg>`;

// A 1-bit screen in a black bezel, with a crank on its right.
function device({ src, alt, caption }) {
  return `<figure class="device">
      <div class="device__bezel"><div class="device__screen"><img src="${src}" alt="${esc(alt)}" width="800" height="480"></div></div>
      <svg class="device__crank" width="56" height="120" viewBox="0 0 56 120" aria-hidden="true"><rect x="0" y="44" width="16" height="32" fill="#000"/><g class="device__crank-arm"><rect x="14" y="56" width="34" height="8" fill="#000"/><rect x="40" y="46" width="14" height="28" rx="3" fill="#000"/></g></svg>
      ${caption ? `<figcaption class="label">${esc(caption)}</figcaption>` : ""}
    </figure>`;
}

const SCREENS = [
  {
    file: "title",
    alt: "The title screen: KUBB in cut wood letters, THROWING WOOD, and a menu of PASS + PLAY and PRACTICE.",
    caption:
      "The title. The menu offers what works today: pass and play, and practice.",
  },
  {
    file: "wind-up",
    alt: "Five kubbs on the far baseline, a swing dial at the bottom, and the prompt: crank back past the bottom.",
    caption:
      "Aiming from the baseline, with the five kubbs on the far side and the dial waiting for the crank.",
  },
  {
    file: "flight",
    alt: "A baton in the air over the pitch, with the far baseline and its kubbs behind it.",
    caption:
      "A baton in flight. The camera leaves the thrower and follows it in.",
  },
  {
    file: "hit",
    alt: "A baton striking a kubb, which has started to tip, with its shadow on the ground.",
    caption: "The hit. The game slows down around it so it can be watched.",
  },
  {
    file: "three-kubbs",
    alt: "A low baton into three kubbs standing close together.",
    caption:
      "A low baton into three kubbs standing together. What falls is worked out by the physics.",
  },
  {
    file: "drill",
    alt: "A landing marker out on the pitch, the swing dial with its arm wound back into a band, and the prompt: in the band, flick.",
    caption: "Throwing a kubb back across the pitch at a landing marker.",
  },
  {
    file: "hand-off",
    alt: "A black card: pass the Playdate to Team A, what Team B just took, and what Team A throws next, beside a small map of the pitch.",
    caption: "The card between turns, when the Playdate changes hands.",
  },
  {
    file: "winner",
    alt: "A black card: Team A wins, toppled the king, five turns, baton hit rate, with a burst around a broken king.",
    caption: "The end of a match the game played against itself as a test.",
  },
];

const DESIGNS = [
  {
    file: "aim",
    alt: "Design board: aiming, with a black rail on top, the king on the centerline, the minimap bottom left and the swing gauge bottom right.",
    caption:
      "Aiming: a black rail on top, the minimap and the gauge at the bottom, and nothing in the middle.",
  },
  {
    file: "flight",
    alt: "Design board: a baton in the air, white with two black bands and speed lines behind it.",
    caption:
      "In flight: a white baton with two black bands and three speed lines.",
  },
  {
    file: "hit",
    alt: "Design board: a burst reading TOK! as a baton tips a kubb.",
    caption: "The hit, with a TOK! burst. Bursts are designed, not built yet.",
  },
  {
    file: "king",
    alt: "Design board: a baton gone past the king, and a flag reading KING STANDS.",
    caption:
      "The king: four points on the crown, a black collar, a ring and one diamond.",
  },
  {
    file: "hand-off",
    alt: "Design board: the hand-off card, pass the Playdate to BIRCH, with a map of the pitch.",
    caption:
      "The hand-off card. ASH and BIRCH stand in for team names, which the game cannot take yet.",
  },
  {
    file: "winner",
    alt: "Design board: ASH WINS, with turns, minutes and hit rate, and a broken king in a burst.",
    caption: "The winner card.",
  },
];

function home({ tinylytics }) {
  const others = games.filter((game) => game !== featured);
  const inDev = games.filter((game) => game.status === "In development").length;
  const kicker =
    inDev === 1 ? "One game in development" : `${inDev} games in development`;
  const body = `<section class="hero">
  <div class="hero__inner frame">
    <div>
      <p class="label kicker">${kicker}</p>
      <h1 class="display">Playdate<br>games</h1>
      <p class="lede">Games Jamie Thingelstad is making for the Playdate, the small handheld with a black-and-white screen and a crank on its side.</p>
      <p><a class="button button--paper" href="#featured-title">See the game${ARROW_DOWN}</a></p>
    </div>
    ${device({ src: "/throwing-wood/title.png", alt: "The title screen of Kubb: Throwing Wood: KUBB in cut wood letters, its last B knocked over by a baton, above THROWING WOOD.", caption: "The title screen. Hover to invert." })}
  </div>
</section>
<div class="strip" aria-hidden="true"></div>
<section class="frame" aria-labelledby="featured-title">
  <p class="label">Featured</p>
  <article class="feature">
    <a class="feature__art" href="/${featured.slug}/" tabindex="-1" aria-hidden="true"><img src="${featured.card.src}" alt="" width="${featured.card.width * 2}" height="${featured.card.height * 2}"><span class="sticker">${esc(featured.status)}</span></a>
    <div class="feature__text">
      <h2 class="display" id="featured-title"><a href="/${featured.slug}/">${esc(featured.title)}</a></h2>
      <p>${esc(featured.summary)}</p>
      <p class="meta"><span class="dot" aria-hidden="true"></span>Started ${longDate(featured.started)}. Not released, and there is no download yet.</p>
      <p><a class="button" href="/${featured.slug}/">About the game${ARROW_RIGHT}</a></p>
    </div>
  </article>
</section>
<section class="frame facts" aria-label="About the Playdate games">
  <div class="facts__grid">
    <div class="fact"><h3 class="label">The screen</h3><p>400 by 240 pixels, one bit. Everything on it is black or white; grey is a checker.</p></div>
    <div class="fact"><h3 class="label">The crank</h3><p>Throwing Wood uses it as the throwing arm: wind back, then flick.</p></div>
    <div class="fact"><h3 class="label">The build</h3><p>Lua and the Playdate SDK. Jamie plays each build on his own Playdate.</p></div>
  </div>
</section>
${
  others.length
    ? `<section class="frame" aria-labelledby="games-title"><h2 class="display" id="games-title">More games</h2><ul class="games">${others
        .map(
          (game) =>
            `<li><a href="/${game.slug}/">${esc(game.title)}</a> <span class="tag">${esc(game.status)}</span></li>`,
        )
        .join("")}</ul></section>`
    : ""
}`;
  return layout({
    path: "/",
    title: SITE_TITLE,
    description:
      "Games Jamie Thingelstad is making for the Playdate. First up: Kubb: Throwing Wood, a game of Kubb thrown with the crank, in development.",
    body,
    tinylytics,
  });
}

function throwingWood({ tinylytics }) {
  const game = games.find((g) => g.slug === "throwing-wood");
  const body = `<article class="game">
<section class="hero hero--game">
  <div class="hero__inner frame">
    ${device({ src: "/throwing-wood/title.png", alt: "The title screen: KUBB in cut wood letters, its last B knocked over by a baton, above THROWING WOOD." })}
    <div class="game__intro">
      <p class="label kicker">${esc(game.status)}</p>
      <h1 class="display">${esc(game.title).replace(": ", ":<br>")}</h1>
      <p class="lede">A game of Kubb for the Playdate. The crank is the throwing arm.</p>
    </div>
  </div>
</section>
<div class="strip" aria-hidden="true"></div>

<section class="frame prose" aria-labelledby="what">
  <h2 class="display" id="what">What it is</h2>
  <p>Kubb is a lawn game played with wooden blocks. Each side throws batons at the other side’s kubbs, the kubbs knocked down are tossed back into play, and the side that clears every kubb and then topples the king wins.</p>
  <p>Throwing Wood plays it on the Playdate’s 400 by 240 pixel black-and-white screen. The pitch is five meters by eight, drawn from behind the thrower. Batons, kubbs and the king are solid bodies in a physics simulation at their real sizes, so what falls is worked out, not chosen: a baton can tumble, skid, glance off a stake or knock one kubb into the next. A baton thrown side-on spins like a helicopter, and it does not count.</p>
  <p>A match is two teams passing one Playdate, played to the U.S. National Kubb Championship rules with a 2-4-6 opening. Each finished match is written as a game file in <a href="${ref("https://thingelstad.xyz/things/planet-kubb-score/", "game")}">Planet Kubb Notation</a>.</p>
</section>

<section class="frame" aria-labelledby="status">
  <div class="plaque">
    <div class="plaque__head"><h2 class="display" id="status">Where it stands</h2>${CRANK}</div>
    <div class="plaque__body">
    <p>Started ${longDate(game.started)} and in development. It is not released, there is no download, and there is no release date.</p>
    <div class="plaque__cols">
      <div>
        <h3 class="label"><span class="swatch swatch--now" aria-hidden="true"></span>Playable now</h3>
        <ul>
          <li>Pass and play: a whole match for two teams on one Playdate.</li>
          <li>Practice: a pitch to throw on, with no match around it.</li>
        </ul>
      </div>
      <div>
        <h3 class="label"><span class="swatch swatch--later" aria-hidden="true"></span>Not built yet</h3>
        <ul>
          <li>A computer opponent.</li>
          <li>Sound.</li>
          <li>A screen for looking back at saved games.</li>
        </ul>
      </div>
    </div>
    </div>
  </div>
</section>

<section class="frame prose" aria-labelledby="crank">
  <h2 class="display" id="crank">Throwing with the crank</h2>
  <p>Turn the crank back past the bottom of its turn to wind up. The longer the backswing, the more power, up to a full-power mark on the dial. Then flick it forward to throw; how hard and how smoothly the crank turns sets the throw. Turned forward slowly, the crank lets the wind-up down without a throw.</p>
  <table class="controls">
    <caption class="label">Before the throw</caption>
    <tbody>
      <tr><th scope="row">D-pad <kbd class="key" aria-label="left">◀</kbd><kbd class="key" aria-label="right">▶</kbd></th><td>Walk along the throwing line</td></tr>
      <tr><th scope="row">Hold <kbd class="key">B</kbd>, turn the crank</th><td>Turn left or right to aim</td></tr>
      <tr><th scope="row">Hold <kbd class="key">A</kbd>, turn the crank</th><td>Set the loft, higher or lower</td></tr>
      <tr><th scope="row">Crank back, then flick</th><td>Wind up and throw</td></tr>
    </tbody>
  </table>
  <p class="meta">The feel of the throw is tuned on a real Playdate as the game is built, so the controls may still change.</p>
</section>

<section class="frame" aria-labelledby="screens">
  <h2 class="display" id="screens">Screens</h2>
  <p class="section-note">Captured from the game in the Playdate Simulator on November 13, 2026, at twice the Playdate’s size.</p>
  <div class="shots">
${SCREENS.map((s) => screen({ ...s, src: `/throwing-wood/screens/${s.file}.png`, kind: "screen" })).join("\n")}
  </div>
</section>

<section class="frame" aria-labelledby="look">
  <h2 class="display" id="look">The look: Woodcut</h2>
  <p class="section-note">A design session on November 13, 2026 settled the look: three tones, hard shadows and a white pitch. White is wood still standing, grey is wood that is down, and black is outline, shadow and anything spent. These are design boards, not screenshots, and parts of them are not in the game yet.</p>
  <div class="shots">
${DESIGNS.map((s) => screen({ ...s, src: `/throwing-wood/design/${s.file}.png`, kind: "design" })).join("\n")}
  </div>
</section>

<section class="frame prose" aria-labelledby="built">
  <h2 class="display" id="built">How it is being built</h2>
  <p>Jamie began it on ${longDate(game.started)}. Claude writes the code, in Lua with the Playdate SDK, and Jamie plays each build on his own Playdate and says what is wrong with it.</p>
  <p>The physics, the rules and the notation are plain Lua with tests that run on a computer. Scripted runs in the Playdate Simulator wind up and throw on their own and save frames along the way; the screens above come from those runs. Every game file the tests produce has to pass the Planet Kubb Notation parser.</p>
  <p>The fuller record, with more screens, the design brief and the first match played on a Playdate, is on <a href="${ref(game.record, "game")}">Things I’ve built</a>.</p>
</section>
</article>`;
  return layout({
    path: "/throwing-wood/",
    title: `${game.title}: a Kubb game for the Playdate`,
    description:
      "A game of Kubb for the Playdate, thrown with the crank, in development. Pass-and-play matches in a physics simulation at real size, saved in Planet Kubb Notation.",
    body,
    tinylytics,
  });
}

function notFound({ tinylytics }) {
  return layout({
    path: "/404.html",
    nav: "",
    title: `Not found: ${SITE_TITLE}`,
    description: "There is no page at this address.",
    noindex: true,
    tinylytics,
    body: `<section class="intro frame">
  <h1 class="display">Missed</h1>
  <p class="lede">There is no page at this address. The baton went wide.</p>
  <p><a class="button" href="/">Back to the games</a></p>
</section>`,
  });
}

// Each page, with the files it is made from (for the sitemap's lastmod).
export const PAGES = [
  {
    path: "/",
    file: "index.html",
    render: home,
    sources: [
      "src/pages.mjs",
      "src/games.mjs",
      "src/layout.mjs",
      "public/style.css",
    ],
  },
  {
    path: "/throwing-wood/",
    file: "throwing-wood/index.html",
    render: throwingWood,
    sources: [
      "src/pages.mjs",
      "src/games.mjs",
      "src/layout.mjs",
      "public/style.css",
      "public/throwing-wood",
    ],
  },
  {
    path: "/404.html",
    file: "404.html",
    render: notFound,
    sources: [],
    noindex: true,
  },
];
