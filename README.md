# Playdate games

The site at **https://playdate.thingelstad.xyz/**: games Jamie Thingelstad is
making for the [Playdate](https://play.date/). The first is Kubb: Throwing
Wood, in development.

Playdate is a trademark of Panic Inc. These games are not made by Panic.

## Run it

Node 24 (`.nvmrc`).

```sh
npm ci
npm run check     # tests, build, site checks
npm run preview   # http://127.0.0.1:4321
```

## Hosting

| Piece       | Where                                                   |
| ----------- | ------------------------------------------------------- |
| Site        | S3 + CloudFront, stack `playdate-xyz-site`, `us-east-1` |
| Deploy role | GitHub OIDC, stack `playdate-xyz-delivery`              |
| DNS         | `thingelstad.xyz` zone, records owned by the site stack |
| AWS account | `<account>`                                             |
| Access logs | CloudWatch `/playdate-xyz/web-access`, 731 days         |
| Deploys     | every push to `main`, from GitHub Actions               |

## Licence

The Londrina Solid font is under the SIL Open Font License
(`public/fonts/OFL-LondrinaSolid.txt`); Inter is in `public/shared/fonts/`
with its own licence.
