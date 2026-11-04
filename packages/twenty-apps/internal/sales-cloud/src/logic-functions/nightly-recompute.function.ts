import { defineLogicFunction } from 'twenty-sdk/define';

import { CAMPAIGN_FORECAST_LOGIC_FUNCTION_UNIVERSAL_IDENTIFIERS as IDS } from 'src/constants/campaign-forecast-identifiers';
import { refreshForecastsAndCampaigns } from 'src/utils/refresh-forecasts-and-campaigns';
import { appClient } from 'src/utils/app-client';

// Safety net for events the triggers missed (an outage, a bulk import, a
// workspace over the per-run read cap).
export default defineLogicFunction({
  universalIdentifier: IDS.nightlyRecompute,
  name: 'nightly-recompute',
  description:
    'Fills missing opportunity forecast fields and recalculates every campaign.',
  timeoutSeconds: 900,
  cronTriggerSettings: { pattern: '17 3 * * *' },
  handler: () => refreshForecastsAndCampaigns(appClient()),
});
