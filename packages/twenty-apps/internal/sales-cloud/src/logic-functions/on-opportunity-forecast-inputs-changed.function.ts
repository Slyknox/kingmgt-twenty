import { defineLogicFunction } from 'twenty-sdk/define';
import { type DatabaseEventBatchPayload } from 'twenty-sdk/logic-function';

import { CAMPAIGN_FORECAST_LOGIC_FUNCTION_UNIVERSAL_IDENTIFIERS as IDS } from 'src/constants/campaign-forecast-identifiers';
import { applyOpportunityForecasts } from 'src/utils/apply-opportunity-forecasts';
import { collectForecastChanges } from 'src/utils/compute-opportunity-forecast';
import { appClient } from 'src/utils/app-client';

const handler = async (batch: DatabaseEventBatchPayload<any>) => {
  await applyOpportunityForecasts(
    appClient(),
    collectForecastChanges(batch.name, batch.events),
  );
};

export default defineLogicFunction({
  universalIdentifier: IDS.onOpportunityForecastInputsChanged,
  name: 'on-opportunity-forecast-inputs-changed',
  description:
    "Sets an opportunity's probability and forecast category from its stage, and keeps expected revenue at amount × probability.",
  timeoutSeconds: 120,
  // Creates pass through; updates only when one of these fields changed.
  databaseEventTriggerSettings: {
    eventName: 'opportunity.*',
    updatedFields: ['stage', 'amount', 'probability', 'forecastCategory'],
    batchMode: true,
  },
  handler,
});
