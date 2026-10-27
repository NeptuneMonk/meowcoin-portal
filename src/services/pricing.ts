import type { FeeQuote, FeeSplitAmounts, PortalAction } from './types';

/** Launch supply and the supply still out, from the public token page. */
export const LAUNCH_SUPPLY = 1_000_000_000;
export const CURRENT_SUPPLY = 960_700_000;
export const ALREADY_BURNED = LAUNCH_SUPPLY - CURRENT_SUPPLY;

/**
 * Demo spot, anchored so a one-penny post is 1,246 MEOWE.
 * Every other price uses this same rate.
 */
export const POST_CENTS = 1;
export const POST_MEOWE = 1_246;

export const BURN_SHARE = 0.3;
export const DOGE_SHARE = 0.6;
export const NODE_SHARE = 0.1;

export const ACTION_CENTS = {
  post: 1,
  mint: 5,
  profile: 15,
} as const satisfies Record<PortalAction, number>;

export function splitMeowe(meowe: number): FeeSplitAmounts {
  const burn = Math.round((meowe * 30) / 100);
  const nodes = Math.round((meowe * 10) / 100);
  const doge = meowe - burn - nodes;
  if (doge < 0) {
    throw new Error('Fee split underflow.');
  }
  return { burn, doge, nodes };
}

export function quoteFromCents(cents: number, action: PortalAction): FeeQuote {
  if (!Number.isInteger(cents) || cents <= 0) {
    throw new Error('Price must be a positive whole number of cents.');
  }
  const meowe = Math.round((cents / POST_CENTS) * POST_MEOWE);
  return {
    action,
    usdCents: cents,
    usd: cents / 100,
    meowe,
    split: splitMeowe(meowe),
    simulated: true,
  };
}

export function quoteAction(action: PortalAction): FeeQuote {
  return quoteFromCents(ACTION_CENTS[action], action);
}

export const POST_QUOTE = quoteAction('post');
export const MINT_QUOTE = quoteAction('mint');
export const PROFILE_QUOTE = quoteAction('profile');

/** Illustration only: a steady number of posts, at the demo price. */
export function burnIllustration(postsPerDay = 1000, days = 365) {
  const perPost = POST_QUOTE.split.burn;
  const burned = perPost * postsPerDay * days;
  return {
    perPost,
    postsPerDay,
    days,
    burned,
    share: burned / CURRENT_SUPPLY,
    left: CURRENT_SUPPLY - burned,
  };
}
