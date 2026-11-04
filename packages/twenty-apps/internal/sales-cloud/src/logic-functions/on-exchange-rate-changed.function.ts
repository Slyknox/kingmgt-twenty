import { defineLogicFunction } from 'twenty-sdk/define';

import { EXCHANGE_RATE_LOGIC_FUNCTION_UNIVERSAL_IDENTIFIERS as IDS } from 'src/constants/exchange-rate-identifiers';
import { appClient } from 'src/utils/app-client';
import { recomputeAllCampaignRollups } from 'src/utils/recompute-campaign-rollups';
import { recomputeAllQuotes } from 'src/utils/sync-quotes';

// Every converted total depends on the rates, so a change recomputes them all.
export default defineLogicFunction({
  universalIdentifier: IDS.onExchangeRateChanged,
  name: 'on-exchange-rate-changed',
  description: 'Recalculates campaign results and quote totals when an exchange rate changes.',
  timeoutSeconds: 900,
  databaseEventTriggerSettings: {
    eventName: 'exchangeRate.*',
    updatedFields: ['currencyCode', 'unitsPerCorporateUnit', 'isCorporate'],
    batchMode: true,
  },
  handler: async () => {
    const client = appClient();

    await recomputeAllCampaignRollups(client);
    await recomputeAllQuotes(client);
  },
});
