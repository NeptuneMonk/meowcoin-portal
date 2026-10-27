# The Forge — MEOWE Portal (guest demo)

This is a tour of the MEOWE Portal, nicknamed **the Forge**. It is the app where a person will keep a profile, run a community, chat in text channels, and mint items onto a storefront, paying only in MEOWE. A picture they upload is meant for IPFS. A Solana memo carries the content id. The profile, the community, and the item are written on Dogecoin in the Sup style, called P2FK.

**This build is a guest demo.** The cats, communities, and messages are samples. The burn counter is an illustration. Picking a picture, sending it, or minting it walks the steps and then stops. The picture stays on your device. Nothing here creates a wallet, asks for a seed phrase, signs a transaction, or talks to Solana, Dogecoin, or IPFS.

How the live portal will keep messages, profiles, and private notes is written in plain language in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md). Private messages are not in this demo. When they are added, they will be end-to-end encrypted, the way Sup encrypts to a profile’s public key.

Tagline: **Memes are forever on Doge.**

- Site: [meoweco.in](https://meoweco.in)
- X: [@1742Meowe](https://x.com/1742Meowe)
- Telegram: [t.me/meowecoinOG](https://t.me/meowecoinOG)
- Solana contract: `FiYTnrwt6CPmWQyWY4evBLK5Lu21jJSRHPYtX4Aepump`

A yellow bar on every screen says **DEMO MODE — no real transactions**. The footer says **Not financial advice. DYOR.**

## What you can click

- **Enter the Forge** — the front page, the simulated burn, the 30/60/10 split, then the app.
- **Chats** — conversations you are in. On a phone this is a list. Tap one to open it. On a wide screen the communities sit in a rail, the channels sit beside them, and the chat sits in the middle.
- **Communities** — a few sample rooms, plus **Create community**. A community has text channels. It can link to the owner’s storefront.
- **A chat** — messages from the sample cats. Each one cost about a penny. Tap **Burned 374 MEOWE** to see the content id and the Dogecoin record. Those values are simulated. You can type a message or attach a picture from your device.
- **My store** and **a cat’s storefront** — items that profile minted or holds. A shelf can hold an image, a video, a sound, a PDF, or a small app. Open one. The button says **Trading coming soon**.
- **Mint** — add one file or many, including a folder. Pick the main file. The preview stays on this device. An app with `index.html` can be launched in the demo.
- **Profile** — your picture, your bio, and the communities you own. Choose a profile picture from your device.

There is no global feed. Private messages are not on these screens. They will be end-to-end encrypted. The plan is in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

Deep links use a hash, so they work on GitHub Pages:

- `#/chats`
- `#/communities`
- `#/c/nine-lives/nine-lives-general`
- `#/u/ninelives/store`
- `#/mint`

## Pictures you pick

The profile picture and a picture in a chat use your device’s file picker. Minting an item can take many files: images (including gif, webp, and svg), video, audio, PDF, an app folder, or another file. The preview is local. The demo says **Your files stay on your device in demo mode.** They are not uploaded and they are not stored on a server. Refreshing the page clears what you picked. Sample objects that shipped with the demo are bundled in the page.

## Prices in this demo

There is one illustration rate: **one penny buys 1,246 MEOWE**. Every fee uses that rate, then splits **30% burned / 60% swapped to DOGE (the Dogecoin record) / 10% to community nodes**.

| Action | Price | MEOWE | Burned (30%) |
| --- | --- | --- | --- |
| Chat message | $0.01 | 1,246 | 374 |
| Mint an item | $0.05 | 6,230 | 1,869 |
| Profile picture | $0.15 | 18,690 | 5,607 |
| Create a community | $0.15 | 18,690 | 5,607 |

A profile picture at fifteen cents is 18,690 MEOWE at this rate (the public illustration rounds the same idea to about 19,000). The burn story on the front page is the message: 1,000 messages a day burns about 136.5 million MEOWE a year, about 14% of the 960.7 million still out there. Because the fee is a few pennies, the same cent burns fewer tokens if MEOWE is worth more. The counter is labeled **Illustration · not live**.

## Run it on your computer

You need Node.js 20 or newer. If you do not have it, install the LTS version from [nodejs.org](https://nodejs.org).

1. Open a terminal in this folder.
2. Run `npm install`.
3. Run `npm run dev`.
4. Open the address it prints. It is usually `http://localhost:5173`.

`npm test` checks the penny math and that the demo services do not call the network. `npm run build` makes the site in the `dist` folder.

## Put it on the internet (GitHub Pages)

The site is a static build. GitHub publishes it with the workflow in `.github/workflows/pages.yml`. Asset paths are relative, so the pages still load if this repo is renamed later.

The live site updates only when this is merged into `main`. A pull request does not publish.

You only do this once:

1. Open this repo on GitHub.
2. Click **Settings**.
3. Click **Pages** in the left sidebar.
4. Under **Build and deployment**, set **Source** to **GitHub Actions**.

After that, every merge into the `main` branch builds the site and publishes it. You can also open the **Actions** tab and run **Build and deploy** by hand.

The address to share:

**https://neptunemonk.github.io/meowcoin-portal/**

A community chat looks like `https://neptunemonk.github.io/meowcoin-portal/#/c/nine-lives/nine-lives-general`.

The first publish can take a couple of minutes. If the action fails before the Pages source is set to GitHub Actions, do the Settings step above, then open **Actions** and click **Re-run**.

If the repo is renamed, the address changes with it (`https://neptunemonk.github.io/<new-name>/`). Update the two image addresses in `index.html` (the `og:image` and `twitter:image` lines) so Telegram and X show the right preview picture.

There are no trackers and no analytics.

## Roadmap

These later phases plug in behind the same screens. The buttons and pages stay. The fake services get replaced.

1. **Wallet creation.** A portal-generated Solana wallet. The screen still never shows a secret key. `createWallet()` in `src/services/mockWallet.ts` is the seam.
2. **Relayer.** Takes the MEOWE fee, burns 30%, swaps 60% toward the Dogecoin record, and sends 10% to community nodes. `submit()` in `src/services/mockRelayer.ts` is the seam. It already accepts a message, a profile picture, a community, and a minted item.
3. **IPFS pinning.** Real content ids for pictures people upload. `pin()` in `src/services/mockIpfs.ts` is the seam. The demo keeps the file on the device.
4. **Dogecoin indexer.** Reads Sup-style P2FK records so profiles, items, communities, and messages come from the chain. The read side is `src/services/mockIndexer.ts`, exposed as the indexer, the community service, and the chat service.
5. **Marketplace trading.** A purchase is on that profile’s storefront. There is no separate marketplace yet. The button stays on **Trading coming soon**.
6. **Private messages.** End-to-end encrypted to the recipient profile’s public key (PKX and PKY), following Sup. `encryptFor` and `decrypt` in `src/services/mockEncryption.ts` are the seam. The mock does not encrypt. There is no private-message button in this demo.
7. **Later ideas, not built.** A paid promotion, with 50% of the fee burned (the rest is still to be decided). An optional “carve it on Doge” upgrade that writes one message fully onto Dogecoin.

`src/services/createServices.ts` is the one place that wires those pieces together. Pages never talk to a chain directly. The plain-language plan is [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## For a developer

- React, TypeScript, and Vite. Routing is a hash router (`#/chats`), which is what makes deep links work on GitHub Pages without extra server rules.
- `src/services/pricing.ts` is the price module: cents in, MEOWE out, then the 30/60/10 split in whole tokens.
- Sample communities, channels, messages, and items are `src/services/catalog.ts`. Anything you forge in the demo is kept in memory and disappears on refresh.
- `CommunityService` and `ChatService` are the seams for communities and text chats. A live indexer can replace the mock without redrawing the pages.
- `EncryptionService` is the seam for end-to-end private messages. The mock is `src/services/mockEncryption.ts`.
- A store item follows Sup’s OBJ fields (`urn`, `nme`, `dsc`, `atr`, `cre`, `own`, `roy`, and the rest) plus a `files` list. See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md). `src/services/objects.ts` is the helper.
- The coin picture is the Meowecoin logo from meoweco.in. The cats are original drawings for this demo.

Not financial advice. DYOR.
