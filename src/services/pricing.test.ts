import { describe, expect, it } from 'vitest';
import { formatCompact, formatUsd } from '../format';
import {
  ALREADY_BURNED,
  burnIllustration,
  CURRENT_SUPPLY,
  LAUNCH_SUPPLY,
  MINT_QUOTE,
  POST_QUOTE,
  PROFILE_QUOTE,
  splitMeowe,
} from './pricing';

describe('pricing', () => {
  it('prices a post at one penny and 1,246 MEOWE', () => {
    expect(POST_QUOTE.usdCents).toBe(1);
    expect(formatUsd(POST_QUOTE.usd)).toBe('$0.01');
    expect(POST_QUOTE.meowe).toBe(1246);
    expect(POST_QUOTE.split).toEqual({ burn: 374, doge: 747, nodes: 125 });
  });

  it('prices a profile at fifteen cents on the same rate', () => {
    expect(formatUsd(PROFILE_QUOTE.usd)).toBe('$0.15');
    expect(PROFILE_QUOTE.meowe).toBe(18_690);
    expect(PROFILE_QUOTE.split.burn + PROFILE_QUOTE.split.doge + PROFILE_QUOTE.split.nodes).toBe(
      PROFILE_QUOTE.meowe,
    );
  });

  it('prices an item mint at five cents', () => {
    expect(formatUsd(MINT_QUOTE.usd)).toBe('$0.05');
    expect(MINT_QUOTE.meowe).toBe(6230);
    expect(MINT_QUOTE.split).toEqual({ burn: 1869, doge: 3738, nodes: 623 });
  });

  it('keeps every split in whole tokens that add up', () => {
    for (let meowe = 1; meowe <= 2000; meowe += 1) {
      const split = splitMeowe(meowe);
      expect(split.burn + split.doge + split.nodes).toBe(meowe);
      expect(split.doge).toBeGreaterThanOrEqual(0);
    }
  });

  it('illustrates about 136.5 million burned in a year, about 14% of supply', () => {
    const year = burnIllustration();
    expect(year.perPost).toBe(374);
    expect(year.burned).toBe(136_510_000);
    expect(formatCompact(year.burned)).toBe('136.5M');
    expect(Math.round(year.share * 100)).toBe(14);
    expect(year.left).toBe(CURRENT_SUPPLY - year.burned);
  });

  it('matches the public supply figures', () => {
    expect(LAUNCH_SUPPLY).toBe(1_000_000_000);
    expect(CURRENT_SUPPLY).toBe(960_700_000);
    expect(ALREADY_BURNED).toBe(39_300_000);
  });
});
