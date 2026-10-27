# How the Forge keeps things

This note is the plan for the live portal. The website you can click today is still a guest demo: nothing is written to a chain, and nothing is uploaded. The pictures you pick stay on your device.

A longer version of the same idea, with the Sup files named, is at the bottom. You do not need that section to follow the plan.

## 1. Where data lives

There are two kinds of things.

**Open community chat.** A message in a public channel costs about one penny, paid in MEOWE. The fee splits the same way as the rest of the portal: 30% is burned, 60% is swapped to DOGE to pay for the Dogecoin record, and 10% goes to community nodes. The words and any picture are the content. That content is pinned on IPFS, which gives it a content id (a CID). A short note on Solana, called a memo, is a small piece of JSON. Its job is to point at that content id. The memo is not the whole message.

One message on its own is not also copied onto Dogecoin. Once a day, the portal writes **one** Dogecoin record for that day. Inside it is a Merkle root: a short fingerprint of every open message from that day. Anyone who still has a message can check it against that fingerprint and show that the message existed that day and was not changed later. The exact hash used to build the fingerprint is still to be confirmed.

**Things a profile owns.** A profile and a storefront item are Dogecoin objects in the Sup style, called P2FK (pay to a future key). The files themselves sit on IPFS. The Dogecoin record is what says who owns the object. We pin every file on our own IPFS node (Kubo), and we also use public pinning services so a file is not kept in only one place. We run our own Dogecoin indexer, which is the reader that turns those records back into profiles, items, communities, and messages.

## 2. Private messages

Private messages are not in the demo, and there is no button for them yet. When they are built, they will be end-to-end encrypted, following Sup.

End-to-end means the portal encrypts the message for the recipient before it is uploaded. The servers, the IPFS pin, and the Solana memo do not get a readable copy. Only the recipient’s key can decrypt the stored message.

Each profile that wants private messages publishes two numbers, **PKX** and **PKY**. Together they are the public half of a secp256k1 key. The private half stays with the profile. Sup already stores those two numbers on a profile for this purpose.

The Forge plan for a private message:

1. Read PKX and PKY from the recipient’s profile.
2. Encrypt the message to that public key, using the same idea as Sup (see the source notes below).
3. Upload only the ciphertext to IPFS.
4. Put a Solana memo on chain that carries the content id, not the readable text.
5. The recipient decrypts with their own private key.

Who sent it, who received it, and when, may still be visible on chain. Sup does not hide that. Whether the Forge will hide it is still to be confirmed.

This is not built. `src/services/mockEncryption.ts` is a labeled stand-in. It does not encrypt, and it does not keep the text.

### What Sup actually does

This is taken from the Sup source. Where the Forge plan above differs, that is called out. Nothing here is guessed past the files.

Sup’s private-message public key is the profile fields `pkx` and `pky`.

- The sample profile says those fields are “public keys of signature address for private message delivery”: [P2FK/samples/Create Profile.json](https://github.com/embiimob/Sup/blob/master/P2FK/samples/Create%20Profile.json).
- Turning on secure messaging copies `txtPKX` and `txtPKY` onto the profile JSON. If the boxes are empty, `Root.GetPublicKeysByAddress` fills them. That function takes the address’s private key and multiplies the secp256k1 generator point, then stores the point’s X and Y as hex: [ProfileMint.cs](https://github.com/embiimob/Sup/blob/master/ProfileMint.cs) and `GetPublicKeysByAddress` in [Root.cs](https://github.com/embiimob/Sup/blob/master/P2FK/contracts/Root.cs).
- [SupSpace `index.html`](https://github.com/embiimob/SupSpace/blob/master/index.html) also writes `pkx` and `pky` from `priv2pt` when secure mode is on, and reads `PublicKeyX` / `PublicKeyY` or `pkx` / `pky` when it loads a profile. That file does **not** contain the message encryption. The encryption is in the original Sup app. SupSpace’s `encryptPriv` / `decryptPriv` only lock the wallet on the device with a password (PBKDF2 and AES-GCM). That is not the private-message cipher.

Sending a private message is the path in [DiscoBall.cs](https://github.com/embiimob/Sup/blob/master/DiscoBall.cs) when the button says `PRIVATE 🤐`.

- The text, plus any attachment tags, is passed to `Root.EncryptRootBytes` with the recipient profile’s `PKX` and `PKY`.
- `EncryptRootBytes` builds a point from those two hex numbers and calls `ECEncryption.Encrypt` ([Root.cs](https://github.com/embiimob/Sup/blob/master/P2FK/contracts/Root.cs), [ECEncryption.cs](https://github.com/embiimob/Sup/blob/master/P2FK/classes/ECEncryption.cs)).
- The key agreement is in `ECElGamal.GenerateKey` ([ECElGamal.cs](https://github.com/embiimob/Sup/blob/master/P2FK/classes/ECElGamal.cs)). It picks a random number `k`. It publishes `k` times the generator point (an ephemeral public point). It multiplies the recipient’s public point by `k`. That shared point is the elliptic-curve Diffie–Hellman secret. The AES key is `SHA256.DoubleHash` of the uncompressed shared point, which is SHA-256 run twice ([SHA256.cs](https://github.com/embiimob/Sup/blob/master/P2FK/classes/SHA256.cs)).
- The cipher is AES: a 256-bit key, a 128-bit block, CBC mode, PKCS7 padding, and a random 16-byte IV (`RijndaelManaged` in `ECEncryption`).
- The bytes are the 65-byte uncompressed ephemeral point, then the 16-byte IV, then the AES ciphertext.
- For the message text, `EncryptRootBytes` (the form that does not “return file”) puts the ASCII name `SEC`, a separator, the length, and another separator in front of those bytes. DiscoBall then splits that blob into 20-byte chunks, turns each chunk into a base58 address, and puts those addresses in the P2FK transaction. So the encrypted **text** rides on the chain. It is not uploaded to IPFS as the message body.
- The recipient address and the sender’s signature address are added to that same transaction in the clear. The time comes from the block. So who messaged whom, and when, is visible. No code we read hides that.
- A private **attachment** is different. DiscoBall calls `EncryptRootBytes` with “return file” set, which returns only the cipher bytes, writes them to a file named `SEC`, and runs `ipfs add`. The message then carries a tag like `IPFS:<hash>\SEC`. Sup’s readme says attachments are encrypted with the recipient’s public keys before they are uploaded to IPFS.
- Reading a private message uses `Root.DecryptRootBytes`. `OBJ.GetPrivateMessagesByAddress` and `SupMain.DisplaySecAttachmentAsync` both call it. Decrypt loads the recipient address’s private key and calls `ECEncryption.Decrypt`, which multiplies the ephemeral point by that private key, double-hashes it, and decrypts the AES payload. If that fails, the message is shown as `<UNABLE TO DECRYPT>`.

Sup does this on its Bitcoin-style P2FK chain. It does not use a Solana memo. The Forge plan in the section above keeps Sup’s PKX/PKY encryption, and changes the delivery: ciphertext on IPFS, and a Solana memo that carries only the content id. That delivery difference is the Forge plan. It is not how Sup stores the message text today.

## 3. Buying from a store

For now, a purchase happens on that profile’s own storefront. There is no separate marketplace. The item screen says **Trading coming soon** until a real purchase path exists.

## 4. Ideas that are not built

These are later ideas. They are not in the demo, and they have no button.

- **Paid promotion.** A creator can pay a fee to advertise to everyone. Half of that fee, 50%, is burned. The rest of the details are still to be decided, including the price.
- **Carve it on Doge.** An optional upgrade on a single message that writes that one message out in full on Dogecoin, instead of leaving it under the daily fingerprint only. The price and the exact record shape are still to be confirmed.

## Where the code will plug in

Screens never talk to a chain themselves. `src/services/createServices.ts` is the one wiring point. Private messages will go through `EncryptionService` (`encryptFor(pkx, pky, plaintext)` and `decrypt`). Today that is `MockEncryption`.

Not financial advice. DYOR.
