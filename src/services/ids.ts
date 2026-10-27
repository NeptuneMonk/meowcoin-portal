const BASE32 = 'abcdefghijklmnopqrstuvwxyz234567';
const BASE58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

/**
 * Demo ids only. These are not real CIDs, addresses, or transaction ids.
 * A future IPFS pinner and Dogecoin indexer replace them.
 */
function expand(seed: string, count: number): number[] {
  let hash = 2166136261;
  const source = `meowe-demo|${seed}`;
  const out: number[] = [];
  for (let i = 0; i < count; i += 1) {
    hash ^= source.charCodeAt(i % source.length);
    hash = Math.imul(hash, 16777619);
    out.push(hash >>> 0);
  }
  return out;
}

export function demoCid(seed: string): string {
  const bytes = expand(`cid:${seed}`, 52);
  let body = '';
  for (let i = 0; i < 52; i += 1) {
    body += BASE32[bytes[i] % 32];
  }
  return `bafybei${body}`;
}

export function demoTxid(seed: string): string {
  const words = expand(`tx:${seed}`, 8);
  return words.map((word) => word.toString(16).padStart(8, '0')).join('');
}

export function demoAddress(seed: string): string {
  const bytes = expand(`sol:${seed}`, 44);
  let out = '';
  for (let i = 0; i < 44; i += 1) {
    out += BASE58[bytes[i] % BASE58.length];
  }
  return out;
}

export function demoSignature(seed: string): string {
  const bytes = expand(`sig:${seed}`, 88);
  let out = '';
  for (let i = 0; i < 88; i += 1) {
    out += BASE58[bytes[i] % BASE58.length];
  }
  return out;
}

export function slugHandle(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 16);
}
