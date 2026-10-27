# The Forge — MEOWE Portal (guest demo)

This is a tour of the MEOWE Portal, nicknamed **the Forge**. It is the app where a person will mint a profile, post a meme, and mint an item, paying only in MEOWE. The file sits on IPFS. A Solana memo carries the content id (a fingerprint of that file). The profile and the item are written on Dogecoin in the Sup style, called P2FK.

**This build is a guest demo.** The cats, posts, and items are samples. The burn counter is an illustration. Try it walks the steps and then stops. Nothing here creates a wallet, asks for a seed phrase, signs a transaction, or talks to Solana, Dogecoin, or IPFS.

Tagline: **Memes are forever on Doge.**

- Site: [meoweco.in](https://meoweco.in)
- X: [@1742Meowe](https://x.com/1742Meowe)
- Telegram: [t.me/meowecoinOG](https://t.me/meowecoinOG)
- Solana contract: `FiYTnrwt6CPmWQyWY4evBLK5Lu21jJSRHPYtX4Aepump`

A yellow bar on every screen says **DEMO MODE — no real transactions**. The footer says **Not financial advice. DYOR.**

## What you can click

- **Enter the Forge** — the front page, the simulated burn, the 30/60/10 split, and how a post becomes a record.
- **Explore** — sample posts. Each one shows MEOWE burned, an IPFS content id, and a Dogecoin record. Those values are fake, and they are labeled as part of the demo.
- **A cat’s profile** — posts and items for that sample cat. The pictures are drawn cats, not photos of people.
- **Marketplace** — a grid of sample Dogecoin objects. Trading is not on. The button says **Trading coming soon**.
- **Try it** — create a profile, post a meme, or mint an item. You see the price in pennies and in MEOWE, the fee split, a short burn animation, and a simulated “record written to Dogecoin” screen. It ends with **This is a demo — coming soon** and links to the site, X, and Telegram.

Deep links use a hash, so they work on GitHub Pages:

- `#/explore`
- `#/profile/ninelives`
- `#/market`
- `#/market/medallion`
- `#/try/post`

## Prices in this demo

There is one illustration rate: **one penny buys 1,246 MEOWE**. Every fee uses that rate, then splits **30% burned / 60% swapped to DOGE (the Dogecoin record) / 10% to community nodes**.

| Action | Price | MEOWE | Burned (30%) |
| --- | --- | --- | --- |
| Post | $0.01 | 1,246 | 374 |
| Mint an item | $0.05 | 6,230 | 1,869 |
| Profile | $0.15 | 18,690 | 5,607 |

A profile at fifteen cents is 18,690 MEOWE at this rate (the public illustration rounds the same idea to about 19,000). The burn story on the front page is the post: 1,000 posts a day burns about 136.5 million MEOWE a year, about 14% of the 960.7 million still out there. Because the fee is a few pennies, the same cent burns fewer tokens if MEOWE is worth more. The counter is labeled **Illustration · not live**.

## Run it on your computer

You need Node.js 20 or newer. If you do not have it, install the LTS version from [nodejs.org](https://nodejs.org).

1. Open a terminal in this folder.
2. Run `npm install`.
3. Run `npm run dev`.
4. Open the address it prints. It is usually `http://localhost:5173`.

`npm test` checks the penny math and that the demo services do not call the network. `npm run build` makes the site in the `dist` folder.

## Put it on the internet (GitHub Pages)

The site is a static build. GitHub publishes it with the workflow in `.github/workflows/pages.yml`. Asset paths are relative, so the pages still load if this repo is renamed later.

You only do this once:

1. Open this repo on GitHub.
2. Click **Settings**.
3. Click **Pages** in the left sidebar.
4. Under **Build and deployment**, set **Source** to **GitHub Actions**.

After that, every merge into the `main` branch builds the site and publishes it. You can also open the **Actions** tab and run **Build and deploy** by hand.

The address to share:

**https://neptunemonk.github.io/meowcoin-portal/**

A profile link looks like `https://neptunemonk.github.io/meowcoin-portal/#/profile/ninelives`.

The first publish can take a couple of minutes. If the action fails before the Pages source is set to GitHub Actions, do the Settings step above, then open **Actions** and click **Re-run**.

If the repo is renamed, the address changes with it (`https://neptunemonk.github.io/<new-name>/`). Update the two image addresses in `index.html` (the `og:image` and `twitter:image` lines) so Telegram and X show the right preview picture.

There are no trackers and no analytics.

## Roadmap

These later phases plug in behind the same screens. The buttons and pages stay. The fake services get replaced.

1. **Wallet creation.** A portal-generated Solana wallet. The screen still never shows a secret key. `createWallet()` in `src/services/mockWallet.ts` is the seam.
2. **Relayer.** Takes the MEOWE fee, burns 30%, swaps 60% toward the Dogecoin record, and sends 10% to community nodes. `submit()` in `src/services/mockRelayer.ts` is the seam.
3. **IPFS pinning.** Real content ids for memes and files. `pin()` in `src/services/mockIpfs.ts` is the seam.
4. **Dogecoin indexer.** Reads Sup-style P2FK records so profiles, items, and holders come from the chain. The read side is `src/services/mockIndexer.ts`.
5. **Marketplace trading.** The grid is a preview until this phase. Do not enable buying until a real purchase path exists.

`src/services/createServices.ts` is the one place that wires those pieces together. Pages never talk to a chain directly.

## For a developer

- React, TypeScript, and Vite. Routing is a hash router (`#/explore`), which is what makes deep links work on GitHub Pages without extra server rules.
- `src/services/pricing.ts` is the price module: cents in, MEOWE out, then the 30/60/10 split in whole tokens.
- The sample feed is `src/services/catalog.ts`. Forged posts from Try it are added in memory and disappear on refresh.
- The coin picture is the Meowecoin logo from meoweco.in. The feed cats are original drawings for this demo.

Not financial advice. DYOR.
