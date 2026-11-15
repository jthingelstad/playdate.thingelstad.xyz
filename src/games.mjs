// The games. The home page lists every game here; the first with
// `featured: true` gets the big card. A new game is a new entry plus its
// page in src/pages.mjs and its images under public/<slug>/.
//
// Say only what is true of the build today: no release date, price, Catalog
// listing or feature that is not built (tests/honesty.test.mjs holds this).

export const games = [
  {
    slug: "throwing-wood",
    title: "Kubb: Throwing Wood",
    featured: true,
    status: "In development",
    started: "2026-11-13",
    summary:
      "A game of Kubb for the Playdate, thrown with the crank. Batons, kubbs and the king are solid bodies in a physics simulation at real size, so what falls is worked out, not chosen.",
    card: {
      src: "/throwing-wood/card.png",
      width: 350,
      height: 155,
      alt: "KUBB in cut wood letters, the last B knocked over by a baton, above THROWING WOOD.",
    },
    record: "https://thingelstad.xyz/things/kubb-throwing-wood/",
    // A test build for friends to sideload: not a release. Built with
    // `make release` in the game's repository and uploaded to files.thingelstad.com.
    build: {
      version: "0.9.0",
      date: "2026-11-15",
      url: "https://files.thingelstad.com/playdate/throwing-wood/ThrowingWood-0.9.0.pdx.zip",
      file: "ThrowingWood-0.9.0.pdx.zip",
      size: "523 KB",
    },
  },
];

export const featured = games.find((game) => game.featured);
