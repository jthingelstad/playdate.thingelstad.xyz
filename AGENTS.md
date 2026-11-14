# AGENTS.md: playdate.thingelstad.xyz

`CLAUDE.md` is a symlink to this file. Domain rules are in
[`../AGENTS.md`](../AGENTS.md); AWS and secret rules one level above that.

Playdate games, Jamie's games for the Playdate. A small static hub: the home
page lists the games (`src/games.mjs`) with one featured, and each game has its
own page. The first is Kubb: Throwing Wood (`/throwing-wood/`), built in its own
private repository; its public record is
https://thingelstad.xyz/things/kubb-throwing-wood/.

## Rules

- **This repository is public.** No email addresses, device serials, home
  directory paths or secrets. Write the AWS account as `<account>` in Markdown.
- **Honest about the games.** Never promise a release date, a price, a Catalog
  listing or a feature that is not built. `tests/site.test.mjs` guards the
  words; keep the "Where it stands" lists true to the game as it is.
- **Screens are real; mock-ups say so.** Files in `public/<game>/screens/` are
  Simulator captures (`make selftest` in a fresh `git worktree` of the game's
  repository, never its main checkout). Design boards live in
  `public/<game>/design/` and carry the "Design mock-up" label, which
  `tools/validate-site.mjs` checks.
- **The look is Woodcut**, from the game's design: black and white, the 50%
  checker as the only grey, hard shadows, `image-rendering: pixelated`. Dark
  mode is the Playdate's Invert. Display type is Londrina Solid Black (OFL),
  unmodified; keep its licence at `public/fonts/OFL-LondrinaSolid.txt`.
- **One colour: Playdate yellow**, `#FFC833` (`--brand-yellow` on play.date,
  with its Display P3 value). Yellow is the shell, never the screen: it frames
  screens and fills the hero band, tags, buttons and key caps, and it stays
  put in Invert. Text on yellow is black; yellow is never text on white.
- Effects move in hard steps (`steps()`, no easing or blur) and stop under
  `prefers-reduced-motion`.
- Shared type comes from `../shared/tokens.css` (`npm run shared:sync`,
  `npm run shared:check`). The site is not in `shared/sites.json` and does not
  carry the sites strip; adding it is Jamie's call.
- Links to the other sites carry `?ref=playdate-<placement>` (`ref()` in
  `src/site.mjs`); identity links stay clean.

## Build and check

`npm ci`, then `npm run check` (tests, build, site checks) and
`npm run format:check`. `npm run preview` serves `dist/` on 127.0.0.1:4321.

## Analytics

Tinylytics, `script.js` form, only in the deploy build
(`PLAYDATE_TINYLYTICS=true`) and only on the production hostname. The site id
is `TINYLYTICS_SITE` in `src/site.mjs`; while it is `null` no script is added.

## Hosting

- `infra/site.json` (stack `playdate-xyz-site`): S3 bucket, CloudFront with
  the shared `edge` web ACL, ACM certificate, and the site's own DNS records
  (A/AAAA aliases and certificate validation) in the `thingelstad.xyz` zone.
  Never edit those records in the console. Access logs go to
  `/playdate-xyz/web-access`, IP-free, kept 731 days.
- `infra/delivery.json` (stack `playdate-xyz-delivery`): the GitHub OIDC role
  `main` deploys with.
- Change infrastructure with `npm run infra:plan` then `npm run infra:apply`
  as the `cloud-engineer` profile; both run through change sets and rewrite
  `infra/deployment.json`.
- Merging to `main` deploys: CI builds with analytics, `tools/deploy.mjs`
  uploads, invalidates and compares the live bytes. Roll back by reverting.
