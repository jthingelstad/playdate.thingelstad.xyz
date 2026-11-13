// What every page of the site shares. Edit here, never in a page.

export const ORIGIN = "https://playdate.thingelstad.xyz";
export const SITE_NAME = "Playdate games";
export const SITE_TITLE = "Playdate games by Jamie Thingelstad";

// Tinylytics' shared script, keyed by data-site, loaded only by the deploy
// build (PLAYDATE_TINYLYTICS=true) and only on the production host. The id
// below is the embed id of the "Playdate games" site in Tinylytics.
export const TINYLYTICS_SCRIPT = "https://tinylytics.app/js/script.js";
export const TINYLYTICS_SITE = "sSNCG9dpfG5FdtmNDyyE";

// owner in thingelstad.com/shared/sites.json (the h-card every site carries).
export const OWNER = {
  name: "Jamie Thingelstad",
  url: "https://www.thingelstad.com/",
  avatar: "https://avatars.micro.blog/avatars/2025/14/1545.jpg",
  note: "Writer of The Weekly Thing. Explorer of tech, the open web, AI, and a good escape room. Minneapolis is home.",
  relMe: ["https://micro.blog/jthingelstad", "https://github.com/jthingelstad"],
};

// Links to Jamie's other sites carry ?ref=playdate-<placement>, so
// Tinylytics' Sources report on the far side shows where a click came from.
export const ref = (url, placement) =>
  `${url}${url.includes("?") ? "&" : "?"}ref=playdate-${placement}`;
