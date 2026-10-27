import type { EncryptedPayload, EncryptionService } from './types';

/**
 * Stand-in for private messages.
 * A live replacement follows Sup's `ECEncryption.Encrypt` / `Decrypt`
 * (`P2FK/classes/ECEncryption.cs` in embiimob/Sup): the recipient public
 * key is the profile's pkx and pky. This mock does not encrypt, does not
 * call the network, and does not keep the plaintext.
 */
export class MockEncryption implements EncryptionService {
  readonly mode = 'mock' as const;

  async encryptFor(pkx: string, pky: string, plaintext: Uint8Array): Promise<EncryptedPayload> {
    if (!pkx.trim() || !pky.trim()) {
      throw new Error('A recipient key needs both pkx and pky.');
    }
    if (!(plaintext instanceof Uint8Array)) {
      throw new Error('Plaintext must be bytes.');
    }
    return {
      ciphertext: `mock:${plaintext.byteLength}`,
      simulated: true,
    };
  }

  async decrypt(_ciphertext: string): Promise<Uint8Array | null> {
    return null;
  }
}
