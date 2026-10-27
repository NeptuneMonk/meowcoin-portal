import { POST_CENTS, POST_MEOWE, quoteAction } from './pricing';
import type { FeeQuote, PortalAction, PricingService, SpotPrice } from './types';

export class MockPricing implements PricingService {
  async getSpot(): Promise<SpotPrice> {
    return {
      usdPerMeowe: POST_CENTS / 100 / POST_MEOWE,
      meowePerPenny: POST_MEOWE,
      simulated: true,
    };
  }

  async quote(action: PortalAction): Promise<FeeQuote> {
    return quoteAction(action);
  }
}
