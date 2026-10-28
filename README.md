# The Forge — MEOWE Portal (guest demo)

*Decentralized content monetization, powered by $MEOWE.*

This is a tour of the MEOWE Portal, nicknamed **the Forge**. It is the app where a person will keep a profile, mint a Space, chat in text channels, and mint items into their own store, paying only in MEOWE. What they make is tokenized content they own. A picture they upload is meant for IPFS. A Solana memo carries the content id.

Ownership is written on Dogecoin as its own P2FK (Pay to Future Key) transaction: a profile, a store mint, a Space, a channel, a give, or a buy. A follow and a message are paid in MEOWE on Solana, then recorded to Dogecoin in a periodic batch, not one Dogecoin transaction per message. A Space uses license `meowe:space`. Each text channel is its own object with license `meowe:space:channel` and `uri` set to the parent Space’s address. A channel counts only when its creator is the Space owner. Messages in a channel are sent to that channel’s address. Giving or selling a Space moves its channels with it. Every object’s address is its first creator address, and every object has its own chat. Private messages will be end-to-end encrypted, following Sup’s PKX and PKY.

**This build is a guest demo.** The cats, Spaces, and messages are samples. The burn counter is an illustration. Picking a picture, sending it, or minting it walks the steps and then stops. The picture stays on your device. Nothing here creates a wallet, asks for a seed phrase, signs a transaction, or talks to Solana, Dogecoin, or IPFS. Minting a Space or a channel in the demo shows a cost of **— MEOWE** and does not mint anything.

How the live portal will keep messages, profiles, and private notes is written in plain language in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md). The Messages screen shows sample direct threads. Nothing there is sent. When private messages are added for real, they will be end-to-end encrypted, the way Sup encrypts to a profile’s public key (PKX and PKY).

- Site: [meoweco.in](https://meoweco.in)
- X: [@1742Meowe](https://x.com/1742Meowe)
- Telegram: [t.me/meowecoinOG](https://t.me/meowecoinOG)
- Solana contract: `FiYTnrwt6CPmWQyWY4evBLK5Lu21jJSRHPYtX4Aepump`

The Forge page says **DEMO MODE — no real transactions**. The footer says **Not financial advice. DYOR.**

## What you can click

- **Messages** — the bubble on the left rail. On a phone this is a list. Tap one to open it. On a wide screen the conversation sits in the middle and that cat’s profile sits on the right. The threads are samples.
- **Spaces** — round icons under the bubble. A Space has text channels and an on-chain card (owner, minted on Dogecoin via P2FK, transferable). The **+** opens **Mint a Space**. The form asks for an icon, a name, and a description. The cost line says **— MEOWE**.
- **A channel** — messages from the sample cats. Each one costs about a penny and is sent to the channel’s own object address. Open the channel name or the info icon for the object: address, parent Space, license `meowe:space:channel`, creator, minted directly on Dogecoin, transferable. Open **kept on Doge** for the simulated record. The **+** on **Text channels** shows for the Space owner and opens **Mint a channel**. The cost line says **— MEOWE**. The attach **+** in the composer can upload a file, pick an object from your store, or paste any object address. A shared object shows as a card. An unknown address says it is not found in demo data.
- **A profile store** — items that profile minted or holds. You buy from the owner’s own store. There is no shared marketplace yet: the **Marketplace** tab is marked **SOON** and says **Trading coming soon**. A shared marketplace across all stores is planned for later. A shelf can hold an image, a video, a sound, a PDF, or a small app. Open one.
- **Mint an item** — add one file or many, including a folder. Pick the main file. The preview stays on this device. An app with `index.html` can be launched in the demo.
- **Your profile** — the name in the corner. Your picture, your bio, and the Spaces you own. Choose a profile picture from your device. The accent colour is taken from that picture.

There is no global feed. Sample direct messages are on the Messages screen. Real private messages will be end-to-end encrypted, following Sup’s PKX and PKY. The plan is in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

Deep links use a hash, so they work on GitHub Pages:

- `#/chats`
- `#/communities` (Spaces)
- `#/c/nine-lives/nine-lives-general`
- `#/u/ninelives/store`
- `#/mint`

## Pictures you pick

The profile picture and a picture in a chat use your device’s file picker. Minting an item can take many files: images (including gif, webp, and svg), video, audio, PDF, an app folder, or another file. The preview is local. The demo says **Your files stay on your device in demo mode.** They are not uploaded and they are not stored on a server. Refreshing the page clears what you picked. Sample objects that shipped with the demo are bundled in the page.

## Prices

Only two prices are published so far. Everything else shows **—** until it is set.

| Action | Price | MEOWE at the demo rate | Burned (30%) |
| --- | --- | --- | --- |
| Chat message | ~$0.01 | 1,246 | 374 |
| Profile | ~$0.15 | 18,690 | 5,607 |
| Follow, store mint, Space, channel, give, buy | — | — | — |

The demo uses one illustration rate: **one penny buys 1,246 MEOWE**. Every fee is paid in MEOWE and splits **30% burned / 60% swapped to DOGE for the treasury / 10% to community nodes**. A profile at fifteen cents is 18,690 MEOWE at this rate (the public illustration rounds the same idea to about 19,000). The burn story on the front page is the message: 1,000 messages a day burns about 136.5 million MEOWE a year, about 14% of the 960.7 million still out there. Because the fee is a few pennies, the same cent burns fewer tokens if MEOWE is worth more. The counter is labeled **Illustration · not live**.

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

A Space chat looks like `https://neptunemonk.github.io/meowcoin-portal/#/c/nine-lives/nine-lives-general`.

The first publish can take a couple of minutes. If the action fails before the Pages source is set to GitHub Actions, do the Settings step above, then open **Actions** and click **Re-run**.

If the repo is renamed, the address changes with it (`https://neptunemonk.github.io/<new-name>/`). Update the two image addresses in `index.html` (the `og:image` and `twitter:image` lines) so Telegram and X show the right preview picture.

There are no trackers and no analytics.

## Roadmap

These later phases plug in behind the same screens. The buttons and pages stay. The fake services get replaced.

1. **Wallet creation.** A portal-generated Solana wallet. The screen still never shows a secret key. `createWallet()` in `src/services/mockWallet.ts` is the seam.
2. **Relayer.** Takes the MEOWE fee, burns 30%, swaps 60% to DOGE for the treasury, and sends 10% to community nodes. It writes ownership records to Dogecoin one by one, and follows and messages in a periodic batch. `submit()` in `src/services/mockRelayer.ts` is the seam. It already accepts a message, a profile picture, a Space, and a minted item.
3. **IPFS pinning.** Real content ids for pictures people upload. `pin()` in `src/services/mockIpfs.ts` is the seam. The demo keeps the file on the device.
4. **Dogecoin indexer.** Reads Sup-style P2FK records from the first Dogecoin block, on Dogecoin Core 1.14.6, so profiles, items, Spaces, channels, and messages come from the chain. The read side is `src/services/mockIndexer.ts`, exposed as the indexer, the Space service, and the chat service.
5. **Selling from your store.** A purchase happens in the owner’s own store, including selling a Space with its channels. The buttons stay on **Trading coming soon** until this is built.
6. **Private messages.** End-to-end encrypted to the recipient profile’s public key (PKX and PKY), following Sup, and covered by the same periodic batch as other messages. `encryptFor` and `decrypt` in `src/services/mockEncryption.ts` are the seam. The mock does not encrypt. The Messages screen is a sample of that later screen. <!-- [CONFIRM] Private messages are batched like public messages. Owner to confirm. -->
7. **Later, not built.**
   - A shared marketplace that lists items from every store.
   - A paid promotion, with 50% of the fee burned (the rest is still to be decided).
   - An optional, opt-in “Carve it on Doge” extra that writes one message in full onto Dogecoin as its own transaction. It is the one exception to batching. Price: —.

`src/services/createServices.ts` is the one place that wires those pieces together. Pages never talk to a chain directly. The plain-language plan is [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## For a developer

- React, TypeScript, and Vite. Routing is a hash router (`#/chats`), which is what makes deep links work on GitHub Pages without extra server rules.
- `src/services/pricing.ts` is the price module: cents in, MEOWE out, then the 30/60/10 split in whole tokens. It still holds older sample figures for a store mint and a Space (`ACTION_CENTS.mint` and `ACTION_CENTS.community`), and the landing page still shows them. Those are not published prices and are due to be removed.
- Sample Spaces, channels, messages, and items are `src/services/catalog.ts`. Anything you forge in the demo is kept in memory and disappears on refresh.
- `CommunityService` and `ChatService` are the seams for Spaces and text chats. A live indexer can replace the mock without redrawing the pages.
- `EncryptionService` is the seam for end-to-end private messages. The mock is `src/services/mockEncryption.ts`.
- A store item follows Sup’s OBJ fields: `urn`, `img`, `uri`, `nme`, `dsc`, `atr`, `lic`, `cre`, `own`, `roy`, and `max`, plus a demo-only `files` list. An object’s address is `cre[0]`. See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md). `src/services/objects.ts` is the helper.
- The coin picture is the Meowecoin logo from meoweco.in. The cats are original drawings for this demo.

Not financial advice. DYOR.

*Memes are forever on Doge.*
