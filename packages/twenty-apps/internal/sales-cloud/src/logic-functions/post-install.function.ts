import { CoreApiClient } from 'twenty-client-sdk/core';
import { definePostInstallLogicFunction } from 'twenty-sdk/define';

import { CAMPAIGN_FORECAST_LOGIC_FUNCTION_UNIVERSAL_IDENTIFIERS as IDS } from 'src/constants/campaign-forecast-identifiers';
import { refreshForecastsAndCampaigns } from 'src/utils/refresh-forecasts-and-campaigns';

// Gives opportunities that existed before install their forecast fields.
export default definePostInstallLogicFunction({
  universalIdentifier: IDS.postInstall,
  name: 'post-install',
  description: 'Fills forecast fields on existing opportunities.',
  timeoutSeconds: 900,
  shouldRunSynchronously: false,
  handler: async () => {
    await refreshForecastsAndCampaigns(new CoreApiClient());
  },
});
