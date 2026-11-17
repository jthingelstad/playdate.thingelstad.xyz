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

// The gameplay reel: 800 x 480 H.264 with no sound, its first frame as the
// poster, and a 400 x 240 two-colour GIF for browsers without video.
const REEL = "/throwing-wood/reel/throwing-wood-0.9.5";

const SCREENS = [
  {
    file: "title",
    alt: "The title screen: KUBB in cut wood letters, THROWING WOOD, and a menu of PASS + PLAY and PRACTICE.",
    caption:
      "The title on November 13, when the menu offered pass and play, and practice.",
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
    caption: "The hit, with a TOK! burst.",
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
    caption: "The hand-off card. ASH and BIRCH stand in for team names.",
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
      <p class="meta"><span class="dot" aria-hidden="true"></span>Started ${longDate(featured.started)}. Not released; a test build is on its page for friends to try.</p>
      <p><a class="button" href="/${featured.slug}/">About the game${ARROW_RIGHT}</a></p>
    </div>
  </article>
</section>
<section class="frame facts" aria-label="About the Playdate games">
  <div class="facts__grid">
    <div class="fact"><h3 class="label">The screen</h3><p>400 by 240 pixels, one bit. Everything on it is black or white; grey is a checker.</p></div>
    <div class="fact"><h3 class="label">The crank</h3><p>Throwing Wood uses it as the throwing arm: pull back for power, and where you stop sets the arc.</p></div>
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

<section class="frame reel" aria-labelledby="play">
  <h2 class="display" id="play">See it play</h2>
  <figure class="shot shot--screen">
    <div class="shot__screen"><video src="${REEL}.mp4" poster="${REEL}-poster.png" width="800" height="480" autoplay muted loop playsinline controls preload="metadata" aria-label="Kubb: Throwing Wood in play, 26 seconds with no sound.">
      <img src="${REEL}.gif" alt="Kubb: Throwing Wood in play, a 26-second reel." width="800" height="480">
    </video></div>
    <figcaption><span class="tag">Simulator capture</span> Test build ${esc(game.build.version)} in the Playdate Simulator: the title, the first HOW TO PLAY card, the hand-off to the next team, a first baton, two field kubbs down with one baton, a kubb thrown in with a little spin, a shot at the king and the winner card. 26 seconds, no sound.</figcaption>
  </figure>
  <p><a class="button" href="#try">Try the test build${ARROW_DOWN}</a></p>
</section>
<script>if (matchMedia("(prefers-reduced-motion: reduce)").matches) for (const v of document.querySelectorAll(".reel video")) { v.removeAttribute("autoplay"); v.pause(); }</script>

<section class="frame prose" aria-labelledby="what">
  <h2 class="display" id="what">What it is</h2>
  <p>Kubb is a lawn game played with wooden blocks. Each side throws batons at the other side’s kubbs, the kubbs knocked down are tossed back into play, and the side that clears every kubb and then topples the king wins.</p>
  <p>Throwing Wood plays it on the Playdate’s 400 by 240 pixel black-and-white screen. The pitch is five meters by eight, drawn from behind the thrower. Batons, kubbs and the king are solid bodies in a physics simulation at their real sizes, so what falls is worked out, not chosen: a baton can tumble, skid, glance off a stake or knock one kubb into the next. A baton thrown side-on spins like a helicopter, and it does not count.</p>
  <p>A match is two teams passing one Playdate, played to the U.S. National Kubb Championship rules with a 2-4-6 opening. Each finished match is written as a game file in <a href="${ref("https://thingelstad.xyz/things/planet-kubb-score/", "game")}">Planet Kubb Notation</a>.</p>
  <p>No Playdate? The same game plays in a browser at <a href="${ref("https://throwingwood.com/", "game")}">throwingwood.com</a>. It runs this game’s own rules and physics, in color, with a dial you drag in place of the crank, and friends can join one pitch from their own browsers by opening a link.</p>
</section>

<section class="frame" aria-labelledby="status">
  <div class="plaque">
    <div class="plaque__head"><h2 class="display" id="status">Where it stands</h2>${CRANK}</div>
    <div class="plaque__body">
    <p>Started ${longDate(game.started)} and in development. It is not released and there is no release date. A test build, ${esc(game.build.version)} of ${longDate(game.build.date)}, is <a href="#try">here to try</a>. It is the release candidate for 1.0.0, so what players say about it now shapes the release. It may still change, and it may break.</p>
    <div class="plaque__cols">
      <div>
        <h3 class="label"><span class="swatch swatch--now" aria-hidden="true"></span>Playable now</h3>
        <ul>
          <li>Against the Playdate: a whole match against the computer, which throws the way you do. You see its swing on the clock.</li>
          <li>Pass and play: a whole match for two teams of one to six, passing one Playdate.</li>
          <li>Saved players, each with their own Throw level (Beginner, Club or Pro) and history.</li>
          <li>HOW TO PLAY and HOW TO THROW: the rules of Kubb on six short cards, then the throw walked through on the practice pitch.</li>
          <li>Practice: seven drills, among them DOUBLES and THE WALL, and an open pitch to throw on.</li>
          <li>Grass, sand or snow, wind if you want it, and five kubb sets.</li>
          <li>The knock of wood on wood, recorded from a real set.</li>
          <li>A match left part way carries on later; finished games can be read back as score sheets.</li>
        </ul>
      </div>
      <div>
        <h3 class="label"><span class="swatch swatch--later" aria-hidden="true"></span>Not built yet</h3>
        <ul>
          <li>Sharing a finished game’s score sheet.</li>
          <li>An ice pitch.</li>
        </ul>
      </div>
    </div>
    </div>
  </div>
</section>

<section class="frame prose" aria-labelledby="crank">
  <h2 class="display" id="crank">Throwing with the crank</h2>
  <p>The crank is the throwing arm. Read it as a clock: hanging straight down is 6. Pull it back up the left side for power: 9 o’clock throws about 4 meters, 10 o’clock about 8. Then swing it forward up the right side and stop it: where it stops sets the arc. Stop at 3 for a base kubb, 4 for a field kubb, half past 3 for the king, and half past 1 to drill a kubb. The dial marks how far back to pull and where to stop, and after each throw the game says in a word how the power, the release and the steadiness went. Stop before 6 and the wind-up is let down without a throw.</p>
  <p>You can just point and throw: the target circle starts on a kubb, you stand behind it, the arc is chosen for you, and you only crank. The view is first person; while <kbd class="key">B</kbd> is held it swings out over your shoulder. A drilled kubb can be given spin, which rolls it sideways once it lands.</p>
  <p>The game teaches it too. In PRACTICE, HOW TO PLAY covers the rules of Kubb on six short cards, and HOW TO THROW walks through the throw on the practice pitch with the real crank and dial.</p>
  <table class="controls">
    <caption class="label">Before the throw</caption>
    <tbody>
      <tr><th scope="row">D-pad</th><td>Move the target circle. It does not lock onto a kubb, so you can aim off one for the wind.</td></tr>
      <tr><th scope="row">Hold <kbd class="key">A</kbd>, d-pad</th><td>Walk along the throwing line, step back, or come forward to the advantage line</td></tr>
      <tr><th scope="row">Hold <kbd class="key">B</kbd>, d-pad <kbd class="key" aria-label="up">▲</kbd><kbd class="key" aria-label="down">▼</kbd></th><td>Plan the arc</td></tr>
      <tr><th scope="row">Hold <kbd class="key">B</kbd>, d-pad <kbd class="key" aria-label="left">◀</kbd><kbd class="key" aria-label="right">▶</kbd></th><td>Tilt the baton, or spin a drilled kubb</td></tr>
      <tr><th scope="row">Crank back, forward, stop</th><td>Power, throw, and the arc</td></tr>
    </tbody>
  </table>
  <p class="meta">The feel of the throw is tuned on a real Playdate as the game is built, so the controls may still change.</p>
</section>

<section class="frame prose" aria-labelledby="try">
  <h2 class="display" id="try">Try the test build</h2>
  <p>Version ${esc(game.build.version)}, built ${longDate(game.build.date)}, for friends to try. It is the release candidate for 1.0.0, so feedback on it now shapes the release. It is still a test build: things may change, and some may break.</p>
  <p>New since 0.9.5, mostly the physics, checked against real Kubb on video and a reference physics engine:</p>
  <ul>
    <li>A clean baton aimed at a kubb goes through it at half its height, instead of landing short and hopping over it.</li>
    <li>Throws come down where they are aimed, through air that slows them.</li>
    <li>Nerves: even a clean swing can drift a little left or right, more on a long throw. The verdicts after a throw now say PULLED LEFT, STRAIGHT or PULLED RIGHT.</li>
    <li>Drilled kubbs turn in the air and run on from where they land, as real ones do, and the target circle allows for it.</li>
    <li>VS PLAYDATE drills tighter groups, running later kubbs into the ones already down, and throws down the line of a group.</li>
    <li>A row of touching kubbs can fall as a row from one baton, and pieces come to rest instead of twitching.</li>
    <li>The game files note where each kubb stood on the pitch, in the new optional positions of Planet Kubb Notation.</li>
    <li>The version is shown small on the title screen.</li>
  </ul>
  <p>New in 0.9.5, for anyone coming from 0.9.0:</p>
  <ul>
    <li>HOW TO PLAY: the rules of Kubb on six short cards, for anyone who has never played, leading into HOW TO THROW.</li>
    <li>HOW TO THROW is back, rewritten for the clock throw: a walkthrough on the practice pitch with the real crank and dial. PRACTICE starts on it until you have seen it.</li>
    <li>Batons hit more like wood: one no longer slips over the top of a kubb, bounces less off it, and keeps its spin on the ground.</li>
    <li>Plainer words on screen, result flags that say what happened (KING TOO EARLY: GAME OVER, OUT: THROW AGAIN), and menus and cards that fit long names.</li>
  </ul>
  <p>New in 0.9.0, for anyone coming from 0.2.0:</p>
  <ul>
    <li>A new throw: the crank read as a clock. Pull back for power; where you stop sets the arc. The d-pad moves a target circle, <kbd class="key">A</kbd> with the d-pad walks, and <kbd class="key">B</kbd> plans the arc and the tilt or spin. A first-person view swings out over the shoulder while <kbd class="key">B</kbd> is held, and drilled kubbs take spin.</li>
    <li>VS PLAYDATE throws the same way, and you see its swing on the clock.</li>
    <li>Saved players, each with their own Throw level (Beginner, Club, Pro) and history, and teams of one to six that pass one Playdate.</li>
    <li>Two new drills, DOUBLES and THE WALL.</li>
    <li>Fixes from the first play test: drilled kubbs settle instead of rolling on, and the target circle no longer locks onto kubbs, so you can aim off one for the wind.</li>
  </ul>
  <p>A match saved by 0.2.0 will not resume in this build.</p>
  <p><a class="button" href="${game.build.url}" download>${esc(game.build.file)} (${esc(game.build.size)})${ARROW_DOWN}</a></p>
  <ol>
    <li>Download the file above and keep it zipped.</li>
    <li>Sign in at <a href="https://play.date/account/sideload/">play.date</a>, open your account’s Sideload page and upload it. Your Playdate must be registered to your account.</li>
    <li>On the Playdate, open the Game Library (Settings, then Games, on older system versions), refresh the list if it has not, and download Kubb: Throwing Wood.</li>
  </ol>
  <p class="meta">A newer build goes the same way and replaces this one.</p>
</section>

<section class="frame" aria-labelledby="screens">
  <h2 class="display" id="screens">Screens</h2>
  <p class="section-note">Captured from the game in the Playdate Simulator on November 13, 2026, at twice the Playdate’s size, before the throw became the clock: the dial and the aim look different in this build.</p>
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
